import * as React from "react";
import {
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  Plus,
  RotateCcw,
  Send,
  X,
} from "lucide-react";
import { Icon } from "@/lib/icons";
import { Button } from "@/components/atoms/Button";
import { ButtonLink } from "@/components/atoms/ButtonLink";
import { PlatformTabs, platformPanelId, platformTabId } from "@/components/platform/PlatformTabs";
import type { ActionEntry, ChatMessage } from "@/lib/assistant/types";
import { ASSISTANT_TOPICS, COURSE_ASSISTANT_TOPICS } from "@/lib/assistant/topics";
import { AssistantGlyph } from "./AssistantGlyph";
import { FirstStepsView, type FirstStepsViewProps } from "./FirstStepsView";
import { NextStepCard } from "./NextStepCard";
import { useDialog } from "@/lib/useDialog";
import { useSheetDrag } from "@/lib/useSheetDrag";
import { inertProps } from "@/lib/inert";
import { MOTION_MS } from "@/lib/motion/tokens";
import { isNearEnd } from "@/lib/motion/scroll";
import { useExitTransition } from "@/lib/useExitTransition";
import { cn, scrollBehavior } from "@/lib/utils";
import styles from "./AssistantWindow.module.css";

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
  /** Changes when a question comes from outside the window (lib/assistant/bus): show the chat. */
  askNonce?: number;
  /**
   * "panel": the panel layout's assistant (Harbor, Fluent; Nelson, 26 Oct 2026, after the
   * DreamHost panel): a white header ("Assistant", New chat, close), "Hi {name}! Explore a topic
   * or chat below" with topics that open their questions, a pill input and the AI notice in a
   * footer row. "default": the floating chat of the other skins.
   */
  variant?: "default" | "panel";
  /** "course": in the player, the panel's topics are about the course (Nelson, 26 Oct 2026). */
  scope?: "platform" | "course";
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
const WHO = cn("sk-text-body-small-regular", styles.who);

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
  askNonce = 0,
  variant = "default",
  scope = "platform",
  className,
  style,
}: AssistantWindowProps) {
  const panel = variant === "panel";
  // The topic whose questions are shown (panel only); null: the topic list.
  const [topicId, setTopicId] = React.useState<string | null>(null);
  const topics = scope === "course" ? COURSE_ASSISTANT_TOPICS : ASSISTANT_TOPICS;
  const topic = topics.find((t) => t.id === topicId) ?? null;
  const inputId = React.useId();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const endRef = React.useRef<HTMLDivElement>(null);
  const [draft, setDraft] = React.useState("");
  // Focus trap, inert page and Esc for the sheet. The floating card is not modal: the page
  // behind stays usable, so it only takes the focus on open and closes on its own Esc.
  const dialogRef = useDialog(modal && open, onClose, { initialFocusRef: inputRef });
  // On a phone the window is a sheet: pull its header down to close it (Apple, 22 Oct 2026).
  const drag = useSheetDrag({
    panelRef: dialogRef,
    axis: "y",
    dir: 1,
    onDismiss: onClose,
    enabled: modal && open,
  });
  const tabsId = React.useId();
  // First steps come first while they run; the learner can go to the chat at any time.
  const [view, setView] = React.useState<View>(firstSteps ? "first-steps" : "ask");
  const showSteps = Boolean(firstSteps) && view === "first-steps";
  React.useEffect(() => {
    if (askNonce) setView("ask");
  }, [askNonce]);
  React.useEffect(() => {
    if (!open || modal || !takeFocus) return;
    // The chat's input, or the selected tab when the First steps view is shown instead.
    (
      inputRef.current ??
      dialogRef.current?.querySelector<HTMLElement>('[role="tab"][aria-selected="true"]')
    )?.focus();
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
  const doneKey = (firstSteps?.rows ?? [])
    .filter((row) => row.done)
    .map((row) => row.id)
    .join(",");
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
  const toEnd = (behavior: ScrollBehavior) =>
    endRef.current?.scrollIntoView({ block: "end", behavior });
  React.useEffect(() => {
    // The log is not rendered under the First steps tab: when it comes back it starts at the end.
    if (showSteps) {
      firstScroll.current = true;
      return;
    }
    if (messages.length === 0) setPill(false);
    // The panel's empty chat opens on its greeting and topics, at the top.
    if (panel && messages.length === 0 && !answering) {
      firstScroll.current = true;
      logRef.current?.scrollTo({ top: 0 });
      return;
    }
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
  }, [messages.length, streaming, answering, showSteps, panel]);

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
        styles.window,
        modal ? "" : panel ? styles.panel : styles.floating,
        !open && styles.closed,
        className,
      )}
    >
      {/* Header (Nelson, 23 Oct 2026, after the program quick view): a dark band in both themes
          (data-theme="dark", bg/subtle), the assistant's mark and two Secondary icon buttons. Before
          the first question it greets the learner by name in large type ("Hey John / How can we
          help?"); once a conversation runs it shrinks to one row so the log keeps the room. */}
      {panel ? (
        <header
          onPointerDown={drag.onPointerDown}
          className={cn(
            styles.panelHeader,
            modal && styles.dragHandle,
          )}
        >
          <h2 className={cn("sk-text-title-medium-semibold", styles.panelTitle)}>
            <AssistantGlyph size={20} className={styles.headerGlyph} />
            Assistant
          </h2>
          <div className={styles.panelActions}>
            <Button
              hierarchy="secondary"
              size="sm"
              rightIcon={Plus}
              disabled={!messages.length || showSteps}
              onClick={() => {
                onClear();
                setTopicId(null);
                inputRef.current?.focus();
              }}
            >
              New chat
            </Button>
            <span aria-hidden className={styles.divider} />
            <Button
              hierarchy="secondary"
              size="sm"
              iconOnly
              leftIcon={X}
              onClick={onClose}
              aria-label="Close the assistant"
            />
          </div>
        </header>
      ) : (
        <header
          data-theme="dark"
          onPointerDown={drag.onPointerDown}
          className={cn(
            styles.bandHeader,
            modal && styles.dragHandle,
          )}
        >
          <div className={styles.bandRow}>
            <h2 className={cn("sk-text-body-large-medium", styles.bandTitle)}>
              <span
                aria-hidden
                className={styles.bandMark}
              >
                <AssistantGlyph size={20} className={styles.headerGlyph} />
              </span>
              <span className={cn(greet && "sk-sr-only")}>SkillUp Assistant</span>
            </h2>
            <div className={styles.bandActions}>
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
              <Button
                hierarchy="secondary"
                size="md"
                iconOnly
                leftIcon={X}
                onClick={onClose}
                aria-label="Close the assistant"
              />
            </div>
          </div>
          {greet ? (
            <p className={cn("sk-text-headline-small-semibold", styles.textDefault)} aria-hidden>
              Hey {firstName}
              <br />
              How can we help?
            </p>
          ) : null}
        </header>
      )}

      {firstSteps ? (
        <div className={styles.tabs}>
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
          className={cn("sk-scroll", styles.stepsPanel)}
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
          className={styles.askPanel}
        >
          <div className={styles.logWrap}>
            <div
              ref={logRef}
              onScroll={onLogScroll}
              role="log"
              aria-live="off"
              aria-label="Conversation"
              className={cn("sk-scroll", styles.log)}
            >
              {empty.mounted ? (
                <div
                  data-state={empty.state}
                  aria-hidden={empty.state === "closed" || undefined}
                  {...inertProps(empty.state === "closed")}
                  onAnimationEnd={empty.onAnimationEnd}
                  className={cn("sk-animate-fade", styles.empty)}
                >
                  {panel ? (
                    <div className={styles.panelIntro}>
                      <div className={styles.greeting}>
                        {/* No icon before the greeting (Nelson, 27 Oct 2026). */}
                        <p className={cn("sk-text-headline-small-semibold", styles.textDefault)}>
                          Hi {firstName}!
                        </p>
                        <p className={cn("sk-text-title-large-regular", styles.textMuted)}>
                          Explore a topic or chat below
                        </p>
                      </div>
                      {next ? <NextStepCard text={next.text} action={next.action} /> : null}
                      {topic ? (
                        <div className={styles.topicView}>
                          <button
                            type="button"
                            onClick={() => setTopicId(null)}
                            aria-label={`${topic.label}: back to the topics`}
                            className={styles.back}
                          >
                            <Icon
                              icon={ChevronLeft}
                              size={20}
                              className={styles.chevron}
                              aria-hidden
                            />
                            <span
                              aria-hidden
                              className={styles.topicIcon}
                            >
                              <Icon icon={topic.icon} size={20} className={styles.iconPrimary} />
                            </span>
                            <span className={cn("sk-text-body-large-medium", styles.textDefault)}>
                              {topic.label}
                            </span>
                          </button>
                          <ul className={styles.questions}>
                            {topic.questions.map((question) => (
                              <li key={question}>
                                <button
                                  type="button"
                                  onClick={() => send(question)}
                                  disabled={answering}
                                  className={cn("sk-text-body-large-regular", styles.question)}
                                >
                                  {question}
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : (
                        <ul className={styles.topics}>
                          {topics.map((t) => (
                            <li key={t.id}>
                              <button
                                type="button"
                                onClick={() => setTopicId(t.id)}
                                className={styles.topic}
                              >
                                <span
                                  aria-hidden
                                  className={styles.topicIcon}
                                >
                                  <Icon icon={t.icon} size={20} className={styles.iconPrimary} />
                                </span>
                                <span className={cn("sk-text-body-large-medium", styles.topicLabel)}>
                                  {t.label}
                                </span>
                                <Icon
                                  icon={ChevronRight}
                                  size={20}
                                  className={styles.chevron}
                                  aria-hidden
                                />
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ) : (
                    <>
                      {next ? <NextStepCard text={next.text} action={next.action} /> : null}
                      <p className={cn("sk-text-body-medium-regular", styles.textMuted)}>
                        Ask me about the platform or your courses.
                      </p>
                      <ul className={styles.suggestions}>
                        {suggestions.map((s) => (
                          <li key={s}>
                            <button
                              type="button"
                              onClick={() => send(s)}
                              disabled={answering}
                              className={cn("sk-text-body-small-medium", styles.suggestion)}
                            >
                              {s}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              ) : null}

              {messages.map((m) =>
                m.role === "user" ? (
                  // DS v1.2 (15 Oct 2026): each message is named above it, ME on the right, ASSISTANT
                  // on the left (body-small, text/subtle, capitals).
                  <div
                    key={m.id}
                    className={cn(
                      styles.mine,
                      arrived(m.id) && "sk-animate-rise sk-enter-only",
                    )}
                  >
                    <span className={WHO}>
                      Me<span className="sk-sr-only">:</span>
                    </span>
                    <p className={cn("sk-text-body-medium-regular", styles.mineBubble)}>
                      {m.text}
                    </p>
                  </div>
                ) : (
                  <div
                    key={m.id}
                    className={cn(
                      styles.answer,
                      arrived(m.id) && !streamedIds.has(m.id) && "sk-animate-rise sk-enter-only",
                    )}
                  >
                    <div className={styles.answerText}>
                      <span className={WHO}>
                        Assistant<span className="sk-sr-only">:</span>
                      </span>
                      {/* DS v1.2: the answer is on bg/primary, in text/on-primary. */}
                      <p className={cn("sk-text-body-medium-regular", styles.answerBubble)}>
                        {m.text}
                      </p>
                    </div>
                    {m.actions?.length ? (
                      <ul className={styles.actions}>
                        {m.actions.map((a, i) => (
                          <li
                            key={a.id}
                            // The buttons follow the answer one after the other, half a short2 apart.
                            className={cn(
                              arrived(m.id) && "sk-animate-rise sk-rise-nudge sk-enter-only",
                            )}
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
                            <ButtonLink
                              href={a.href}
                              hierarchy="secondary"
                              size="sm"
                              className={styles.actionButton}
                            >
                              {a.label}
                            </ButtonLink>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                    {/* The DS moved the AI notice under the input (Copy row). A scripted answer keeps
                  its own line: a test participant must not take it for the model. */}
                    {m.source !== "model" ? (
                      <p className={cn("sk-text-body-small-regular", styles.textSubtle)}>
                        {SCRIPTED_CAPTION}
                      </p>
                    ) : null}
                  </div>
                ),
              )}

              {/* The answering bubble: mounted once per answer, it keeps its element while the
            streamed text grows into it (the text itself is never animated). */}
              {answering ? (
                <div className={cn("sk-animate-rise sk-enter-only", styles.answering)}>
                  <span aria-hidden className={WHO}>
                    Assistant
                  </span>
                  <p className={cn("sk-text-body-medium-regular", styles.answerBubble)}>
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
              <div className={styles.pillBar}>
                <Button
                  hierarchy="secondary"
                  size="sm"
                  leftIcon={ArrowDown}
                  className={cn("sk-animate-rise sk-enter-only", styles.pill)}
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
          <p aria-live="polite" className="sk-sr-only">
            {answering ? "Thinking…" : last?.role === "assistant" ? last.text : ""}
          </p>

          {panel ? (
            <>
              <form onSubmit={submit} className={styles.panelForm}>
                <div className={styles.panelField}>
                  <label htmlFor={inputId} className="sk-sr-only">
                    Your question
                  </label>
                  <input
                    ref={inputRef}
                    id={inputId}
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    maxLength={MAX_QUESTION}
                    autoComplete="off"
                    placeholder="What can I help you with today?"
                    className={cn("sk-text-body-large-regular", styles.panelInput)}
                  />
                  <button
                    type="submit"
                    aria-label="Send"
                    disabled={answering || !draft.trim()}
                    className={styles.panelSend}
                  >
                    <Icon icon={Send} size={20} />
                  </button>
                </div>
              </form>
              <p className={cn("sk-text-body-medium-regular", styles.panelNotice)}>
                {AI_NOTICE}
              </p>
            </>
          ) : (
            <>
              <form
                onSubmit={submit}
                className={styles.form}
              >
                <label htmlFor={inputId} className="sk-sr-only">
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
                  className={cn("sk-text-body-medium-regular", styles.input)}
                />
                <button
                  type="submit"
                  aria-label="Send"
                  disabled={answering || !draft.trim()}
                  className={styles.send}
                >
                  <Icon icon={Send} size={20} />
                </button>
              </form>
              {/* DS Copy row (v1.2): the notice for every answer, under the input. */}
              <p className={cn("sk-text-body-medium-regular", styles.notice)}>
                {AI_NOTICE}
              </p>
            </>
          )}
        </div>
      )}

      {/* A first step ticking, said once, whichever tab is shown. */}
      <p aria-live="polite" className="sk-sr-only">
        {ticked}
      </p>
    </div>
  );
}
