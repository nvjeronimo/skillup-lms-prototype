"use client";

import * as React from "react";
import { ArrowDown, RotateCcw, Send, Sparkles, X } from "lucide-react";
import { Icon } from "@/lib/icons";
import { Button } from "@/components/atoms/Button";
import { ButtonLink } from "@/components/atoms/ButtonLink";
import { PlatformTabs, platformPanelId, platformTabId } from "@/components/platform/PlatformTabs";
import type { ActionEntry, ChatMessage } from "@/lib/assistant/types";
import { FirstStepsView, type FirstStepsViewProps } from "./FirstStepsView";
import { NextStepCard } from "./NextStepCard";
import { useDialog } from "@/lib/useDialog";
import { useSheetDrag } from "@/lib/useSheetDrag";
import { inertProps } from "@/lib/inert";
import { MOTION_MS } from "@/lib/motion/tokens";
import { isNearEnd } from "@/lib/motion/scroll";
import { useExitTransition } from "@/lib/useExitTransition";
import { cn, scrollBehavior } from "@/lib/utils";

export interface AssistantWindowProps {
  id: string;
  /** False while the window is leaving (it stays mounted for its exit animation). */
  open?: boolean;
  /** The presence state of useExitTransition, set as data-state on the window. */
  state?: "open" | "closed";
  /** useExitTransition's handler: the window's own animation is the one that ends last. */
  onAnimationEnd?: (event: React.AnimationEvent) => void;
  messages: ChatMessage[];
  /** The reply still arriving (model mode), or null. */
  streaming: string | null;
  status: "idle" | "answering";
  suggestions: string[];
  firstName: string;
  onAsk: (question: string) => void;
  /** Empties the conversation and brings the suggestions back. */
  onClear: () => void;
  onClose: () => void;
  /** A full-screen sheet (phones): focus stays inside and the page behind is inert. */
  modal: boolean;
  /**
   * While the first steps are running: the window gets two tabs, First steps (shown first)
   * and Ask. Absent: the window is the chat alone.
   */
  firstSteps?: Omit<FirstStepsViewProps, "firstName" | "next" | "onAsk"> | null;
  /** The one thing to do next, shown above the suggestions of an empty chat. */
  next?: { text: string; action: ActionEntry } | null;
  /** False when the window opened by itself: it must not pull the focus from the page. */
  takeFocus?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

type View = "first-steps" | "ask";
const VIEWS: { id: View; label: string }[] = [
  { id: "first-steps", label: "First steps" },
  { id: "ask", label: "Ask" },
];

const MAX_QUESTION = 500;
/* DS Copy row (v1.2, 15 Oct 2026), under the input. The DS line ends with a "Privacy" link;
   the prototype has no privacy page, so the link waits for one. */
const AI_NOTICE = "AI-generated responses may contain errors. Do not write personal data.";
const SCRIPTED_CAPTION = "Prototype: scripted answer.";

/* Who speaks, above each message (DS v1.2). */
const WHO = "sk-text-body-small-regular uppercase text-sko-text-subtle";

/**
 * The assistant's chat: a floating card above its launcher, a full-screen sheet on a phone.
 * Presentational: the conversation comes from lib/assistant/useAssistant.
 */
export function AssistantWindow({
  id,
  open = true,
  state = "open",
  onAnimationEnd,
  messages,
  streaming,
  status,
  suggestions,
  firstName,
  onAsk,
  onClear,
  onClose,
  modal,
  firstSteps = null,
  next = null,
  takeFocus = true,
  className,
  style,
}: AssistantWindowProps) {
  const inputId = React.useId();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const endRef = React.useRef<HTMLDivElement>(null);
  const [draft, setDraft] = React.useState("");
  // Focus trap, inert page and Esc for the sheet. The floating card is not modal: the page
  // behind stays usable, so it only takes the focus on open and closes on its own Esc.
  const dialogRef = useDialog(modal && open, onClose, { initialFocusRef: inputRef });
  // On a phone the window is a sheet: pull its header down to close it (Apple, 22 Oct 2026).
  const drag = useSheetDrag({ panelRef: dialogRef, axis: "y", dir: 1, onDismiss: onClose, enabled: modal && open });
  const tabsId = React.useId();
  // First steps come first while they run; the learner can go to the chat at any time.
  const [view, setView] = React.useState<View>(firstSteps ? "first-steps" : "ask");
  const showSteps = Boolean(firstSteps) && view === "first-steps";
  React.useEffect(() => {
    if (!open || modal || !takeFocus) return;
    // The chat's input, or the selected tab when the First steps view is shown instead.
    (inputRef.current ?? dialogRef.current?.querySelector<HTMLElement>('[role="tab"][aria-selected="true"]'))?.focus();
    // Only when the window opens (also when it is reopened during its exit): switching tabs
    // moves the focus itself (toAsk).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modal, open]);
  const toAsk = () => {
    setView("ask");
    // The input is rendered with the Ask tab: focus it once it is there.
    window.setTimeout(() => inputRef.current?.focus(), 0);
  };
  // A step that ticks while the window is open is said once: the one that was not done before.
  const doneKey = (firstSteps?.rows ?? []).filter((row) => row.done).map((row) => row.id).join(",");
  const lastDone = React.useRef(doneKey);
  const [ticked, setTicked] = React.useState("");
  React.useEffect(() => {
    const before = lastDone.current.split(",");
    lastDone.current = doneKey;
    const rows = firstSteps?.rows ?? [];
    const row = rows.find((r) => r.done && !before.includes(r.id));
    if (!row) return;
    const left = rows.filter((r) => !r.done).length;
    setTicked(`Done: ${row.label}. ${left} ${left === 1 ? "step" : "steps"} left.`);
    // Only when the set of done steps changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doneKey]);

  const answering = status === "answering";
  const last = messages[messages.length - 1];

  // Which messages rise in: the ones that arrive while the window is open. Those already there
  // when it opens come with the window, and an answer that was streamed into the answering
  // bubble takes that bubble's place without rising a second time.
  const [openedWith] = React.useState(() => new Set(messages.map((m) => m.id)));
  // Every answer streamed in place, not only the latest: an earlier one must not gain the
  // rise class (and replay it) when the next one commits.
  const [streamedIds, setStreamedIds] = React.useState<ReadonlySet<string>>(() => new Set());
  const [wasStreaming, setWasStreaming] = React.useState(false);
  const [prevLastId, setPrevLastId] = React.useState(last?.id);
  if (streaming && !wasStreaming) setWasStreaming(true);
  if (last?.id !== prevLastId) {
    setPrevLastId(last?.id);
    if (wasStreaming && last?.role === "assistant") {
      const id = last.id;
      setStreamedIds((ids) => new Set(ids).add(id));
    }
    setWasStreaming(false);
  }
  const arrived = (messageId: string) => !openedWith.has(messageId);

  // The conversation follows a growing answer only while the learner is at its end. Once they
  // scroll up to read, it stays where they are and a "New message" pill offers the way down.
  const logRef = React.useRef<HTMLDivElement>(null);
  const following = React.useRef(true);
  const lastTop = React.useRef(0);
  const firstScroll = React.useRef(true);
  const [pill, setPill] = React.useState(false);
  const onLogScroll = () => {
    const log = logRef.current;
    if (!log) return;
    if (isNearEnd(log.scrollTop, log.clientHeight, log.scrollHeight)) {
      following.current = true;
      setPill(false);
    } else if (log.scrollTop < lastTop.current) {
      // Only the learner scrolls up: the glide to the end never unfollows.
      following.current = false;
    }
    lastTop.current = log.scrollTop;
  };
  // "instant", not "auto": the log is an .sk-scroll region, where "auto" means its CSS glide.
  const toEnd = (behavior: ScrollBehavior) => endRef.current?.scrollIntoView({ block: "end", behavior });
  React.useEffect(() => {
    // The log is not rendered under the First steps tab: when it comes back it starts at the end.
    if (showSteps) {
      firstScroll.current = true;
      return;
    }
    if (messages.length === 0) setPill(false);
    if (firstScroll.current) {
      // Opening on a conversation: it is already at its end, not scrolled there.
      firstScroll.current = false;
      following.current = true;
      toEnd("instant");
    } else if (following.current) {
      // A growing stream keeps up instantly (a glide per chunk lags and stutters); a new
      // message glides.
      toEnd(streaming ? "instant" : scrollBehavior());
    } else {
      setPill(true);
    }
  }, [messages.length, streaming, answering, showSteps]);

  // A question the learner sends takes them to the end, wherever they were.
  const send = (question: string) => {
    following.current = true;
    setPill(false);
    onAsk(question);
  };
  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (answering || !draft.trim()) return;
    send(draft);
    setDraft("");
  };

  // The large greeting shows until the first question is sent.
  const greet = messages.length === 0 && !answering;
  // The suggestions fade out when one is sent (or a question is typed), instead of vanishing.
  const empty = useExitTransition(messages.length === 0, MOTION_MS.short4);

  return (
    <div
      ref={dialogRef}
      id={id}
      role="dialog"
      aria-label="SkillUp Assistant"
      aria-modal={(modal && open) || undefined}
      data-state={state}
      aria-hidden={!open || undefined}
      {...inertProps(!open)}
      onAnimationEnd={onAnimationEnd}
      style={style}
      onKeyDown={(event) => {
        if (!modal && event.key === "Escape") {
          event.stopPropagation();
          onClose();
        }
      }}
      className={cn(
        "flex flex-col overflow-hidden bg-sko-bg-page",
        modal ? "" : "rounded-card border border-sko-border-subtle shadow-xl",
        !open && "pointer-events-none",
        className,
      )}
    >
      {/* Header (Nelson, 23 Oct 2026, after the program quick view): a dark band in both themes
          (data-theme="dark", bg/subtle), the assistant's mark and two Secondary icon buttons. Before
          the first question it greets the learner by name in large type ("Hey John / How can we
          help?"); once a conversation runs it shrinks to one row so the log keeps the room. */}
      <header
        data-theme="dark"
        onPointerDown={drag.onPointerDown}
        className={cn("flex shrink-0 flex-col gap-4 bg-sko-bg-subtle p-4 md:p-5", modal && "touch-none")}
      >
        <div className="flex items-center justify-between gap-3">
          <h2 className="sk-text-body-large-medium inline-flex items-center gap-3 text-sko-text-default">
            <span aria-hidden className="inline-flex size-10 items-center justify-center rounded-control bg-sko-bg-primary-soft">
              <Icon icon={Sparkles} size={20} className="text-sko-icon-primary" />
            </span>
            <span className={cn(greet && "sr-only")}>SkillUp Assistant</span>
          </h2>
          <div className="flex items-center gap-2">
            {messages.length && !showSteps ? (
              <Button
                hierarchy="secondary"
                size="md"
                iconOnly
                leftIcon={RotateCcw}
                onClick={() => {
                  onClear();
                  inputRef.current?.focus();
                }}
                aria-label="Start a new conversation"
              />
            ) : null}
            <Button hierarchy="secondary" size="md" iconOnly leftIcon={X} onClick={onClose} aria-label="Close the assistant" />
          </div>
        </div>
        {greet ? (
          <p className="sk-text-headline-small-semibold text-sko-text-default" aria-hidden>
            Hey {firstName}
            <br />
            How can we help?
          </p>
        ) : null}
      </header>

      {firstSteps ? (
        <div className="px-5 pt-3">
          <PlatformTabs
            tabs={VIEWS}
            value={view}
            onChange={setView}
            size="sm"
            panels="selected"
            idBase={tabsId}
            ariaLabel="Assistant"
          />
        </div>
      ) : null}

      {showSteps && firstSteps ? (
        <div
          role="tabpanel"
          id={platformPanelId(tabsId, "first-steps")}
          aria-labelledby={platformTabId(tabsId, "first-steps")}
          className="sk-scroll flex-1 overflow-y-auto p-5"
        >
          <FirstStepsView
            {...firstSteps}
            firstName={firstName}
            next={next}
            onAsk={toAsk}
            onSkip={() => {
              firstSteps.onSkip();
              // The view goes away with its Skip button: the focus goes to the chat's input.
              toAsk();
            }}
          />
        </div>
      ) : (
      <div
        role={firstSteps ? "tabpanel" : undefined}
        id={firstSteps ? platformPanelId(tabsId, "ask") : undefined}
        aria-labelledby={firstSteps ? platformTabId(tabsId, "ask") : undefined}
        className="flex min-h-0 flex-1 flex-col"
      >
      <div className="relative flex min-h-0 flex-1 flex-col">
      <div
        ref={logRef}
        onScroll={onLogScroll}
        role="log"
        aria-live="off"
        aria-label="Conversation"
        className="sk-scroll flex flex-1 flex-col gap-4 overflow-y-auto p-5"
      >
        {empty.mounted ? (
          <div
            data-state={empty.state}
            aria-hidden={empty.state === "closed" || undefined}
            {...inertProps(empty.state === "closed")}
            onAnimationEnd={empty.onAnimationEnd}
            className="sk-animate-fade flex flex-col gap-4"
          >
            {next ? <NextStepCard text={next.text} action={next.action} /> : null}
            <p className="sk-text-body-medium-regular text-sko-text-muted">Ask me about the platform or your courses.</p>
            <ul className="flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <li key={s}>
                  <button
                    type="button"
                    onClick={() => send(s)}
                    disabled={answering}
                    className="sk-text-body-small-medium min-h-11 rounded-pill bg-sko-bg-primary-soft px-3 py-1.5 text-left text-sko-text-primary"
                  >
                    {s}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {messages.map((m) =>
          m.role === "user" ? (
            // DS v1.2 (15 Oct 2026): each message is named above it, ME on the right, ASSISTANT
            // on the left (body-small, text/subtle, capitals).
            <div
              key={m.id}
              className={cn("flex max-w-[85%] flex-col items-end gap-1 self-end", arrived(m.id) && "sk-animate-rise sk-enter-only")}
            >
              <span className={WHO}>
                Me<span className="sr-only">:</span>
              </span>
              <p className="sk-text-body-medium-regular whitespace-pre-line rounded-control bg-sko-bg-primary-soft px-4 py-3 text-sko-text-default">
                {m.text}
              </p>
            </div>
          ) : (
            <div
              key={m.id}
              className={cn(
                "flex max-w-[92%] flex-col gap-3 self-start",
                arrived(m.id) && !streamedIds.has(m.id) && "sk-animate-rise sk-enter-only",
              )}
            >
              <div className="flex flex-col gap-1">
                <span className={WHO}>
                  Assistant<span className="sr-only">:</span>
                </span>
                {/* DS v1.2: the answer is on bg/primary, in text/on-primary. */}
                <p className="sk-text-body-medium-regular whitespace-pre-line rounded-control bg-sko-bg-primary px-4 py-3 text-sko-text-on-primary">
                  {m.text}
                </p>
              </div>
              {m.actions?.length ? (
                <ul className="flex flex-col items-start gap-2">
                  {m.actions.map((a, i) => (
                    <li
                      key={a.id}
                      // The buttons follow the answer one after the other, half a short2 apart.
                      className={cn(arrived(m.id) && "sk-animate-rise sk-rise-nudge sk-enter-only")}
                      style={
                        arrived(m.id)
                          ? {
                              animationDelay: `calc(var(--motion-duration-short2) / 2 * ${i})`,
                              animationFillMode: "backwards",
                            }
                          : undefined
                      }
                    >
                      {/* A long label wraps: the button grows with it instead of keeping the 36px of Button sm. */}
                      <ButtonLink href={a.href} hierarchy="secondary" size="sm" className="!h-auto min-h-9 py-1.5">
                        {a.label}
                      </ButtonLink>
                    </li>
                  ))}
                </ul>
              ) : null}
              {/* The DS moved the AI notice under the input (Copy row). A scripted answer keeps
                  its own line: a test participant must not take it for the model. */}
              {m.source !== "model" ? <p className="sk-text-body-small-regular text-sko-text-subtle">{SCRIPTED_CAPTION}</p> : null}
            </div>
          ),
        )}

        {/* The answering bubble: mounted once per answer, it keeps its element while the
            streamed text grows into it (the text itself is never animated). */}
        {answering ? (
          <div className="sk-animate-rise sk-enter-only flex max-w-[92%] flex-col gap-1 self-start">
          <span aria-hidden className={WHO}>Assistant</span>
          <p className="sk-text-body-medium-regular whitespace-pre-line rounded-control bg-sko-bg-primary px-4 py-3 text-sko-text-on-primary">
            {streaming ? (
              streaming
            ) : (
              <span className="sk-typing">
                <span aria-hidden className="sk-typing__dot" />
                <span aria-hidden className="sk-typing__dot" />
                <span aria-hidden className="sk-typing__dot" />
                <span className="sk-typing__word">Thinking…</span>
              </span>
            )}
          </p>
          </div>
        ) : null}
        <div ref={endRef} />
      </div>
      {pill ? (
        <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center">
          <Button
            hierarchy="secondary"
            size="sm"
            leftIcon={ArrowDown}
            className="sk-animate-rise sk-enter-only pointer-events-auto shadow-md"
            onClick={() => {
              following.current = true;
              setPill(false);
              toEnd(scrollBehavior());
            }}
          >
            New message
          </Button>
        </div>
      ) : null}
      </div>

      {/* What a screen reader hears: the status, then the finished answer once. */}
      <p aria-live="polite" className="sr-only">
        {answering ? "Thinking…" : last?.role === "assistant" ? last.text : ""}
      </p>

      <form onSubmit={submit} className="flex items-center gap-2 border-t border-sko-border-subtle px-3 pb-2 pt-3">
        <label htmlFor={inputId} className="sr-only">
          Your question
        </label>
        <input
          ref={inputRef}
          id={inputId}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          maxLength={MAX_QUESTION}
          autoComplete="off"
          placeholder="Ask about the platform or your courses…"
          className="sk-text-body-medium-regular h-11 min-w-0 flex-1 rounded-control border border-sko-border-subtle bg-sko-bg-subtle px-4 text-sko-text-default outline-none placeholder:text-sko-text-placeholder transition-colors focus:border-sko-border-primary"
        />
        <button
          type="submit"
          aria-label="Send"
          disabled={answering || !draft.trim()}
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-control bg-sko-bg-primary text-sko-text-on-primary transition-colors hover:bg-sko-bg-primary-hover hover:text-sko-text-on-primary-hover disabled:bg-sko-bg-muted disabled:text-sko-text-disabled"
        >
          <Icon icon={Send} size={20} />
        </button>
      </form>
      {/* DS Copy row (v1.2): the notice for every answer, under the input. */}
      <p className="sk-text-body-small-regular px-3 pb-3 text-sko-text-subtle">{AI_NOTICE}</p>
      </div>
      )}

      {/* A first step ticking, said once, whichever tab is shown. */}
      <p aria-live="polite" className="sr-only">
        {ticked}
      </p>
    </div>
  );
}
