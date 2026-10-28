"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { isAssistantPath, pageContextFromPath } from "@/lib/assistant/page-context";
import { nextStep } from "@/lib/assistant/next-step";
import { buildSnapshot } from "@/lib/assistant/snapshot";
import { useAssistant } from "@/lib/assistant/useAssistant";
import { STEPS, stepAction } from "@/lib/first-steps/steps";
import { restartFirstSteps, useFirstSteps } from "@/lib/first-steps/useFirstSteps";
import { wantsRestart, withoutRestart } from "@/lib/first-steps/url";
import { useLearner } from "@/lib/persona-gate";
import { useEdxScope } from "@/lib/edx-scope";
import { useLmsStore } from "@/lib/store";
import { MOTION_MS } from "@/lib/motion/tokens";
import { useExitTransition, useFrozenWhileClosed } from "@/lib/useExitTransition";
import { ASSISTANT_OPEN_EVENT } from "@/lib/assistant/bus";
import { AssistantWindow } from "./AssistantWindow";

const OPEN_KEY = "sk-assistant-open";
const PHONE = "(max-width: 767px)";

/**
 * The assistant, mounted once for the whole app (ResponsiveShell). Since 26 Oct 2026 (Nelson) it
 * has no launcher of its own: the search + Assistant pill of the platform and player bars (and
 * their search button where the pill does not fit) opens it through lib/assistant/bus. The
 * floating launcher it had is kept in AssistantChatFloating (`?assistant=floating`).
 * It knows where it is from the address, so no page hands it anything: in the player its topics
 * are about the course. Shown on the platform pages and in the player only.
 */
export function AssistantChat() {
  const pathname = usePathname() ?? "/";
  // Open edX scope: no learner assistant there, so it never mounts (nor do its first steps).
  const edx = useEdxScope();
  if (edx || !isAssistantPath(pathname)) return null;
  return <Chat pathname={pathname} />;
}

function Chat({ pathname }: { pathname: string }) {
  const windowId = React.useId();
  // The learner, or the synthetic persona once hydrated (Nelson, 25 Oct 2026).
  const learner = useLearner();
  const completedTopics = useLmsStore((s) => s.completedTopics);
  const bookmarks = useLmsStore((s) => s.bookmarks);
  const previewPhone = useLmsStore((s) => s.deviceMode === "mobile");
  const page = React.useMemo(() => pageContextFromPath(pathname), [pathname]);
  const firstSteps = useFirstSteps(page, completedTopics);
  const snapshot = React.useMemo(
    () => buildSnapshot({ completedTopics, bookmarks }, page, firstSteps.state ?? undefined),
    [completedTopics, bookmarks, page, firstSteps.state],
  );
  const assistant = useAssistant(snapshot);

  // The test link (prototype only): `?first-steps=restart` on any address starts the first
  // steps again with an empty conversation, then leaves the address so a reload does not.
  const clearChat = React.useRef(assistant.clear);
  clearChat.current = assistant.clear;
  React.useEffect(() => {
    const { pathname: path, search } = window.location;
    if (!wantsRestart(search)) return;
    clearChat.current();
    restartFirstSteps(Array.from(useLmsStore.getState().completedTopics));
    window.history.replaceState(window.history.state, "", withoutRestart(path, search));
  }, [pathname]);
  // A question is the fifth first step.
  const ask = (question: string) => {
    if (question.trim()) firstSteps.asked();
    assistant.ask(question);
  };

  // The one next step, unless it is the page the learner is already on.
  const next = React.useMemo(() => {
    const step = nextStep(snapshot);
    const action = step && snapshot.actions.find((a) => a.id === step.actionId);
    return step && action && action.href !== pathname ? { text: step.text, action } : null;
  }, [snapshot, pathname]);

  // The First steps view: while they run, and once more when the fifth has just been done.
  const stepsState = firstSteps.state;
  const showSteps = stepsState?.status === "active" || firstSteps.justFinished;
  const stepsView =
    stepsState && showSteps
      ? {
          rows: STEPS.map((step) => {
            const action = stepAction(step.id, snapshot);
            return {
              id: step.id,
              label: step.label,
              why: step.why,
              cta: step.cta,
              done: stepsState.done.includes(step.id),
              href: action && action !== "ask" ? action.href : undefined,
              ask: action === "ask",
            };
          }),
          finished: stepsState.status === "done",
          onSkip: firstSteps.dismiss,
        }
      : null;

  // Open or closed is remembered for the tab, so following a button keeps the chat open.
  const [open, setOpen] = React.useState(false);
  const [phone, setPhone] = React.useState(false);
  React.useEffect(() => {
    const query = window.matchMedia(PHONE);
    const sync = () => setPhone(query.matches);
    sync();
    // On a phone the chat is a full-screen sheet: a page never opens covered by it.
    try {
      setOpen(!query.matches && sessionStorage.getItem(OPEN_KEY) === "1");
    } catch {
      /* storage blocked: closed */
    }
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);
  // The window opened by itself: it must not take the focus from the page.
  const [selfOpened, setSelfOpened] = React.useState(false);
  const set = (next: boolean) => {
    setOpen(next);
    setSelfOpened(false);
    // "You're set." has been seen once the window closes: next time it is the chat alone.
    if (!next) firstSteps.acknowledge();
    try {
      sessionStorage.setItem(OPEN_KEY, next ? "1" : "0");
    } catch {
      /* see above */
    }
  };
  // Closing gives the focus back to the button that opened the window (the effect below).
  const refocus = React.useRef(false);
  // Opened or closed by the learner: the window never opens by itself after that. (Not in
  // `set`: the sheet closing on navigation is not the learner's doing.)
  const close = () => {
    refocus.current = true;
    firstSteps.greeted();
    set(false);
  };
  const openByLearner = () => {
    firstSteps.greeted();
    set(true);
  };
  // Opened from elsewhere on the page, with or without a question (lib/assistant/bus: Harbor's
  // top-bar search, Nelson 25 Oct 2026).
  const [askNonce, setAskNonce] = React.useState(0);
  const fromBus = React.useRef({ openByLearner, ask });
  fromBus.current = { openByLearner, ask };
  React.useEffect(() => {
    const onOpen = (e: Event) => {
      const question = (e as CustomEvent<{ question: string }>).detail?.question ?? "";
      fromBus.current.openByLearner();
      if (question) {
        fromBus.current.ask(question);
        setAskNonce((n) => n + 1);
      }
    };
    window.addEventListener(ASSISTANT_OPEN_EVENT, onOpen);
    return () => window.removeEventListener(ASSISTANT_OPEN_EVENT, onOpen);
  }, []);
  React.useEffect(() => {
    if (open || !refocus.current) return;
    refocus.current = false;
    // The focus goes back to the button that opened it: the bar's Assistant button, or its
    // search button where the pill does not fit.
    visibleAnchor()?.focus();
  }, [open]);

  const isPhone = phone || previewPhone;
  // A press outside the window closes it (Nelson, 27 Oct 2026), on the platform pages and in the
  // player. The focus stays where the learner pressed, so not through `close`. A press on the bar's
  // Assistant or search button is left to that button. The phone sheet covers the screen: no outside.
  const dismiss = React.useRef(() => {});
  dismiss.current = () => {
    firstSteps.greeted();
    set(false);
  };
  React.useEffect(() => {
    if (!open || isPhone) return;
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Element) || !target.isConnected) return;
      if (document.getElementById(windowId)?.contains(target)) return;
      if (target.closest("[data-assistant-anchor]")) return;
      dismiss.current();
    };
    document.addEventListener("pointerdown", onPointerDown, true);
    return () => document.removeEventListener("pointerdown", onPointerDown, true);
  }, [open, isPhone, windowId]);
  // On a phone, following a button of an answer goes to the page: the sheet gets out of the way.
  const lastPath = React.useRef(pathname);
  React.useEffect(() => {
    if (lastPath.current === pathname) return;
    lastPath.current = pathname;
    if (isPhone) set(false);
  });
  // A new learner may never press the Assistant button: the window opens by itself, once, where
  // it does not cover the page (not on a phone, where it is a full-screen sheet).
  const greet = stepsState?.status === "active" && !stepsState.greeted && !isPhone && !open;
  const greetedFn = firstSteps.greeted;
  const inPlayer = pathname.startsWith("/course/");
  React.useEffect(() => {
    if (!greet) return;
    const timer = window.setTimeout(() => {
      setOpen(true);
      setSelfOpened(true);
      greetedFn();
    }, 600);
    return () => window.clearTimeout(timer);
  }, [greet, greetedFn]);
  // Since 26 Oct 2026 (Nelson) the assistant has no floating launcher: it opens from the search +
  // Assistant pill of the top bars (platform pages and the player) or from their search button
  // where the pill does not fit. The window hangs under that button (any `[data-assistant-anchor]`
  // on screen); on a phone it is a full-screen sheet.
  const anchor = useAnchor(open && !isPhone);
  // The window stays on screen while it leaves: it shrinks (short3), or the sheet slides down
  // (short4). Opening again mid-exit reopens it at once.
  const presence = useExitTransition(open, isPhone ? MOTION_MS.short4 : MOTION_MS.short3);
  // While it leaves, it shows what it showed: closing acknowledges "You're set.", which would
  // otherwise swap the view under the exit.
  const shownSteps = useFrozenWhileClosed(stepsView, open);
  const shownNext = useFrozenWhileClosed(next, open);
  const top = anchor?.top ?? 80;

  return (
    <>
      {/* The window opening by itself leaves the focus on the page: this is how it is heard. */}
      <p role="status" className="sr-only">
        {open && selfOpened
          ? `SkillUp Assistant opened: ${firstSteps.left} first steps to get you started.`
          : ""}
      </p>
      {presence.mounted ? (
        <AssistantWindow
          id={windowId}
          open={open}
          state={presence.state}
          onAnimationEnd={presence.onAnimationEnd}
          messages={assistant.messages}
          streaming={assistant.streaming}
          status={assistant.status}
          suggestions={assistant.suggestions}
          firstName={learner.firstName}
          onAsk={ask}
          firstSteps={shownSteps}
          next={shownNext}
          takeFocus={!selfOpened}
          askNonce={askNonce}
          onClear={assistant.clear}
          onClose={close}
          modal={isPhone}
          variant="panel"
          scope={inPlayer ? "course" : "platform"}
          className={
            isPhone
              ? "sk-animate-sheet fixed inset-0 z-[45]"
              : "sk-animate-pop fixed z-[45] w-[420px] max-w-[calc(100vw-48px)] origin-top"
          }
          style={
            isPhone
              ? undefined
              : {
                  top,
                  ...(anchor ? { left: anchor.left } : { right: 24 }),
                  height: `min(640px, calc(100dvh - ${top + 24}px))`,
                }
          }
        />
      ) : null}
    </>
  );
}

/** The assistant's opener on screen: the pill's Assistant button or a bar's search button. */
function visibleAnchor(): HTMLElement | null {
  const all = document.querySelectorAll<HTMLElement>("[data-assistant-anchor]");
  for (const el of all) if (el.getBoundingClientRect().height > 0) return el;
  return null;
}

/**
 * Where the window hangs: 12 under the opener, its right edge on the opener's (kept 24 inside the
 * window). Read when the window opens and on resize; on a first visit the bar may not have painted
 * yet, so it tries again for a few seconds.
 */
function useAnchor(enabled: boolean): { top: number; left: number } | null {
  const [anchor, setAnchor] = React.useState<{ top: number; left: number } | null>(null);
  React.useEffect(() => {
    if (!enabled) return;
    let tries = 0;
    let retry = 0;
    const place = () => {
      const button = visibleAnchor();
      if (!button) {
        if (tries++ < 20) retry = window.setTimeout(place, 150);
        return;
      }
      const r = button.getBoundingClientRect();
      const width = Math.min(420, window.innerWidth - 48);
      setAnchor({
        top: Math.round(r.bottom + 12),
        left: Math.round(Math.max(24, Math.min(r.right - width, window.innerWidth - width - 24))),
      });
    };
    place();
    window.addEventListener("resize", place);
    return () => {
      window.clearTimeout(retry);
      window.removeEventListener("resize", place);
    };
  }, [enabled]);
  return anchor;
}
