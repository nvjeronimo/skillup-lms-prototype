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
import { useLmsStore } from "@/lib/store";
import { MOTION_MS } from "@/lib/motion/tokens";
import { useExitTransition, useFrozenWhileClosed } from "@/lib/useExitTransition";
import { cn } from "@/lib/utils";
import { AssistantLauncher } from "./AssistantLauncher";
import { ASSISTANT_OPEN_EVENT } from "@/lib/assistant/bus";
import { AssistantWindow } from "./AssistantWindow";

const OPEN_KEY = "sk-assistant-open";
const EDGE = 24;
const EDGE_PHONE = 16;
const GAP = 16;
/** The launcher's size (DS `Assistant-Launcher`, 48 since 13 Oct 2026). */
const SIZE = 48;
const PHONE = "(max-width: 767px)";

/**
 * KEPT FOR REFERENCE (Nelson, 26 Oct 2026: "deixa o histórico do módulo flutuante"): the floating
 * assistant as it was until 26 Oct 2026, when the search + Assistant pill of the top bars took its
 * place everywhere (AssistantChat). It renders only with `?assistant=floating` (lib/assistant/
 * floating), so the idea can come back as it was designed. Not maintained with the pill.
 *
 * The assistant, mounted once for the whole app (ResponsiveShell): a launcher in the bottom
 * left corner and the chat it opens. Left on desktop and tablet since 13 Oct 2026 (on the right
 * it sat over Mark as Complete in the feedback row); on a phone it is on the right, above the
 * footer nav, at the end of the feedback row.
 * It knows where it is from the address, so no page
 * hands it anything. Shown on the platform pages and in the player only.
 */
export function AssistantChatFloating() {
  const pathname = usePathname() ?? "/";
  if (!isAssistantPath(pathname)) return null;
  return <Chat pathname={pathname} />;
}

function Chat({ pathname }: { pathname: string }) {
  const windowId = React.useId();
  const launcherRef = React.useRef<HTMLButtonElement>(null);
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
  // Closing gives the focus back to the launcher (the effect below). On a phone it is inert
  // under the open sheet, so the focus moves once the sheet starts to leave.
  const refocus = React.useRef(false);
  // Opened or closed by the learner: the window never opens by itself after that. (Not in
  // `set`: the sheet closing on navigation is not the learner's doing.)
  const inBar = React.useRef(false);
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
    // In the bar the launcher is hidden: the focus goes back to the bar's Assistant button.
    const barButton = inBar.current
      ? document.querySelector<HTMLElement>('form[role="search"] button[type="button"]')
      : null;
    (barButton ?? launcherRef.current)?.focus();
  }, [open]);

  const isPhone = phone || previewPhone;
  // On a phone, following a button of an answer goes to the page: the sheet gets out of the way.
  const lastPath = React.useRef(pathname);
  React.useEffect(() => {
    if (lastPath.current === pathname) return;
    lastPath.current = pathname;
    if (isPhone) set(false);
  });
  // A new learner may never press the launcher: the window opens by itself, once, where it
  // does not cover the page (not on a phone, where it is a full-screen sheet).
  const greet = stepsState?.status === "active" && !stepsState.greeted && !isPhone && !open;
  const greetedFn = firstSteps.greeted;
  React.useEffect(() => {
    if (!greet) return;
    const timer = window.setTimeout(() => {
      setOpen(true);
      setSelfOpened(true);
      greetedFn();
    }, 600);
    return () => window.clearTimeout(timer);
  }, [greet, greetedFn]);
  const edge = isPhone ? EDGE_PHONE : EDGE;
  // The launcher steps away while another modal (the Course Journey drawer, a dialog) is open
  // (Course Journey critique P1, 24 Oct 2026; promoted by Nelson, 27 Oct 2026).
  const inPlayer = pathname.startsWith("/course/");
  const otherModal = useOtherModalOpen(windowId);
  const hideForModal = otherModal && !open;
  // Left, except on a phone. The footer lifts the launcher only where the two would meet.
  const [wideEnough, setWideEnough] = React.useState(false);
  const [xlEnough, setXlEnough] = React.useState(false);
  React.useEffect(() => {
    const q = window.matchMedia("(min-width: 1025px)");
    const xl = window.matchMedia("(min-width: 1280px)");
    const sync = () => {
      setWideEnough(q.matches);
      setXlEnough(xl.matches);
    };
    sync();
    q.addEventListener("change", sync);
    xl.addEventListener("change", sync);
    return () => {
      q.removeEventListener("change", sync);
      xl.removeEventListener("change", sync);
    };
  }, []);
  // The panel layout (Harbor, Fluent) has the pill from desktop up; the tabs bar from 1280.
  const panelSkin = useLmsStore((s) => s.skin === "harbor" || s.skin === "fluent");
  // On a platform page from desktop up the assistant is in the top bar (its search pill), so
  // the launcher steps away and the window opens on the right, under the bar's Assistant button.
  // Since 26 Oct 2026 every skin's platform bar has the search + Assistant pill (Nelson): on the
  // platform pages from desktop up the floating launcher steps away; it stays in the player, and
  // below desktop (the compact bar has no pill; the phone keeps it beside the tab bar).
  const harborBar =
    pathname.startsWith("/platform") && !isPhone && (panelSkin ? wideEnough : xlEnough);
  // In the player the launcher always takes the content card's corner (bottom right, above Previous
  // / Next): in the sidebar's corner it covered the collapsed rail's last rows (Nelson, 26 Oct 2026).
  const side = isPhone || inPlayer || harborBar ? "right" : "left";
  const bottom = edge + useFooterHeight(pathname, side, edge + SIZE, edge);
  // In the bar, the window hangs under the bar's Assistant button, as the DreamHost panel's.
  const barAnchor = useBarAnchor(harborBar && open);
  inBar.current = harborBar;
  const sheet = open && isPhone;
  // The window stays on screen while it leaves: it shrinks back into the launcher (short3),
  // or the sheet slides down (short4). Pressing the launcher again mid-exit reopens it at once.
  const presence = useExitTransition(open, isPhone ? MOTION_MS.short4 : MOTION_MS.short3);
  // While it leaves, it shows what it showed: closing acknowledges "You're set.", which would
  // otherwise swap the view under the exit.
  const shownSteps = useFrozenWhileClosed(stepsView, open);
  const shownNext = useFrozenWhileClosed(next, open);

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
          variant={harborBar ? "panel" : "default"}
          className={
            isPhone
              ? "sk-animate-sheet fixed inset-0 z-[45]"
              : harborBar && barAnchor
                ? "sk-animate-pop fixed z-[45] w-[420px] max-w-[calc(100vw-48px)] origin-top"
                : cn(
                    "sk-animate-pop fixed z-[45] w-[380px] max-w-[calc(100vw-48px)]",
                    // It grows out of the launcher, so it scales from the launcher's corner.
                    side === "left" ? "origin-bottom-left" : "origin-bottom-right",
                  )
          }
          style={
            isPhone
              ? undefined
              : harborBar && barAnchor
                ? {
                    top: barAnchor.top,
                    left: barAnchor.left,
                    height: `min(640px, calc(100dvh - ${barAnchor.top + 24}px))`,
                  }
                : {
                    [side]: edge,
                    bottom: bottom + SIZE + GAP,
                    height: `min(600px, calc(100dvh - ${bottom + SIZE + GAP + 24}px))`,
                  }
          }
        />
      ) : null}
      {/* Always mounted. On a phone it sits under the sheet (one layer down) while the sheet is on
          screen, so it is covered as the sheet rises and uncovered as it slides away, never
          removed and put back in one frame; while the sheet is open it is inert and hidden. */}
      <AssistantLauncher
        ref={launcherRef}
        open={open}
        onToggle={() => (open ? close() : openByLearner())}
        controls={windowId}
        badge={firstSteps.left}
        covered={sheet || hideForModal || harborBar}
        className={cn(
          "fixed",
          isPhone && presence.mounted ? "z-[44]" : "z-[45]",
          (hideForModal || harborBar) && "pointer-events-none opacity-0",
        )}
        style={{ [side]: edge, bottom }}
      />
    </>
  );
}

/**
 * Where the panel-layout window hangs: 12 under the top bar's Assistant button, its right edge on
 * the button's (kept 24 inside the window). Read when the window opens and on resize.
 */
function useBarAnchor(enabled: boolean): { top: number; left: number } | null {
  const [anchor, setAnchor] = React.useState<{ top: number; left: number } | null>(null);
  React.useEffect(() => {
    if (!enabled) return;
    let tries = 0;
    let retry = 0;
    const place = () => {
      const button = document.querySelector<HTMLElement>(
        'form[role="search"] button[type="button"]',
      );
      // On a first visit the window can open before the bar has painted: try again shortly.
      if (!button || button.getBoundingClientRect().height === 0) {
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

/**
 * Whether a modal dialog other than the assistant's own window is open. Watches the page for
 * `aria-modal="true"`.
 */
function useOtherModalOpen(ownId: string): boolean {
  const [openModal, setOpenModal] = React.useState(false);
  React.useEffect(() => {
    const check = () =>
      setOpenModal(
        [...document.querySelectorAll<HTMLElement>('[aria-modal="true"]')].some(
          (el) => el.id !== ownId && !el.closest(`#${CSS.escape(ownId)}`),
        ),
      );
    check();
    const mo = new MutationObserver(check);
    mo.observe(document.body, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ["aria-modal"],
    });
    return () => mo.disconnect();
  }, [ownId]);
  return openModal;
}

/**
 * How much of the viewport's bottom the player's topic footer covers under the launcher, so
 * the launcher sits above it and never over Previous or Next. 0 on a page with no footer nav, and 0
 * where the footer does not reach the launcher's column (on desktop the sidebar is there).
 * `reach` is how far from its edge the launcher extends. On a phone the launcher is on the right.
 * On a phone's platform page the launcher sits beside the floating tab bar instead, on the same
 * line, centred on it (Nelson, 23 Oct 2026): the value then lifts it from `edge` to that centre.
 */
function useFooterHeight(
  pathname: string,
  side: "left" | "right",
  reach: number,
  edge: number,
): number {
  const [height, setHeight] = React.useState(0);
  const inPlayer = pathname.startsWith("/course/");
  const onPlatform = pathname.startsWith("/platform");
  React.useEffect(() => {
    // Only the player's footer nav and the platform's floating bar; the other pages pay nothing.
    if (!inPlayer && !onPlatform) return setHeight(0);
    const selector = inPlayer ? 'nav[aria-label="Topic navigation"]' : "nav[data-floating-nav]";
    const measure = () => {
      const footer = document.querySelector<HTMLElement>(selector);
      if (!footer) return setHeight(0);
      const { top, bottom, left, right } = footer.getBoundingClientRect();
      if (onPlatform) {
        // Beside the bar: the launcher's centre on the bar's centre. Read from its layout box, not
        // its painted one, so the launcher stays put while the bar slides away on scroll.
        const barTop = footer.offsetTop;
        const barHeight = footer.offsetHeight;
        return setHeight(
          Math.max(
            0,
            Math.round(window.innerHeight - barTop - barHeight + (barHeight - SIZE) / 2 - edge),
          ),
        );
      }
      const meets = side === "left" ? left < reach : right > window.innerWidth - reach;
      const visible = top < window.innerHeight && bottom > 0 && meets;
      setHeight(visible ? Math.max(0, Math.round(window.innerHeight - top)) : 0);
    };
    measure();
    // The footer moves without the DOM changing (the player settles its layout after the
    // store hydrates), so DOM and size observers are not enough: a slow tick catches the rest.
    const mutations = new MutationObserver(measure);
    mutations.observe(document.body, { childList: true, subtree: true });
    const sizes = new ResizeObserver(measure);
    sizes.observe(document.body);
    const tick = window.setInterval(measure, 500);
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, true);
    return () => {
      mutations.disconnect();
      sizes.disconnect();
      window.clearInterval(tick);
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure, true);
    };
  }, [pathname, inPlayer, onPlatform, side, reach, edge]);
  return height;
}
