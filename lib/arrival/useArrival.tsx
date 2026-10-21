"use client";

import * as React from "react";
import { MOTION_MS } from "@/lib/motion/tokens";
import { ARMING_WINDOW_MS, canArm, parseCssTimeMs } from "./arming";
import { arriveDelay, batchSteps, planArrival } from "./cascade";
import { countText } from "./count";
import { LOAD_MODE_KEY, loadDelayMs, parseLoadMode, shouldShowSkeleton, type LoadMode } from "./loadMode";
import { nextRingPhase, ringShownPct, ringTransitionClass, type RingPhase } from "./ring";
import { createObserverRegistry, viewportObserver, type InViewCallback } from "./observerRegistry";
import { VISITED_KEY, arrivalKey, decideVisit, isFirstVisit, markVisited, parseVisited, serializeVisited } from "./visits";

/*
 * Loading and arrival (motion-matrix §7.9). One controller per platform page
 * (`useArrivalController`, in PlatformPage) decides on mount whether this is the page's
 * first visit in the session; the pieces below read its decision from ArrivalContext.
 *
 *   data-arrival="pending" on <html>  the simulated load: content hidden, skeleton shown
 *                                      (set pre-paint on a hard load by lib/arrival/prepaint)
 *   data-arrive={n} on a section       its place in the cascade (0…7)
 *   data-arrive-state="run" | "wait"   set by the controller: rising now / below the fold
 *   useArrivalCount, ArrivalCount      a figure that counts up when it first shows
 *   useArrivalValue                    a bar or ring value that starts empty, then fills
 *
 * Nothing here delays a control: the content is in the DOM from the server render and is
 * usable from the first frame it shows; the cascade only animates opacity and transform.
 */

export type ArrivalState = {
  /** The controller has read the session (false on the server and the first client render). */
  decided: boolean;
  /** This page's first visit in the session: the cascade and counters play. */
  first: boolean;
  /** The simulated load is over; the content shows. */
  released: boolean;
  /** Just after the load (ARMING_WINDOW_MS): counters and fills mounting now still count. */
  arming: boolean;
  /**
   * The page's one IntersectionObserver (review M2): calls `cb` once when `el` first shows,
   * with the batch that came into view with it. Returns the unregister.
   */
  observe: (el: Element, cb: InViewCallback) => () => void;
};

const NO_OBSERVE: ArrivalState["observe"] = () => () => {};
const SETTLED: ArrivalState = { decided: false, first: false, released: true, arming: false, observe: NO_OBSERVE };

declare global {
  interface Window {
    /** The pre-paint script's failsafe timer (lib/arrival/prepaint). */
    __skArrivalFs?: number;
  }
}

export const ArrivalContext = React.createContext<ArrivalState>(SETTLED);

export function useArrival(): ArrivalState {
  return React.useContext(ArrivalContext);
}

// useLayoutEffect on the client (decide before the first paint), useEffect on the server.
const useIsoLayoutEffect = typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

/** Reduced motion from either source: the OS setting or the Accessibility panel's switch. */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return true;
  return (
    document.documentElement.hasAttribute("data-reduce-motion") ||
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true
  );
}

/** The visited pages of this session, or null when sessionStorage is blocked (= a revisit). */
function readVisited(): Set<string> | null {
  try {
    return parseVisited(window.sessionStorage.getItem(VISITED_KEY));
  } catch {
    return null;
  }
}

function writeVisited(visited: Set<string>) {
  try {
    window.sessionStorage.setItem(VISITED_KEY, serializeVisited(visited));
  } catch {
    /* blocked: every visit reads as a revisit anyway */
  }
}

export function readLoadMode(): LoadMode {
  try {
    return parseLoadMode(window.localStorage.getItem(LOAD_MODE_KEY));
  } catch {
    return "normal";
  }
}

/** Fired on window when either Loading switch changes (the other tab gets a `storage` event). */
const LOAD_MODE_EVENT = "sk-arrival-load-mode";
/** The choice when storage is blocked: still shared by the two switches of this page. */
let memoryLoadMode: LoadMode | null = null;

function subscribeLoadMode(onChange: () => void): () => void {
  const onStorage = (e: StorageEvent) => {
    if (e.key === LOAD_MODE_KEY) onChange();
  };
  window.addEventListener(LOAD_MODE_EVENT, onChange);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(LOAD_MODE_EVENT, onChange);
    window.removeEventListener("storage", onStorage);
  };
}

/**
 * The demo menu's Loading switch, kept per browser. One source for its two places (the
 * player's demo menu and the platform top bar's panel, review M6): both read localStorage
 * through useSyncExternalStore and a change in one updates the other while it is open.
 */
export function useLoadMode(): [LoadMode, (mode: LoadMode) => void] {
  const mode = React.useSyncExternalStore(
    subscribeLoadMode,
    () => memoryLoadMode ?? readLoadMode(),
    () => "normal" as LoadMode,
  );
  const set = React.useCallback((next: LoadMode) => {
    try {
      window.localStorage.setItem(LOAD_MODE_KEY, next);
      memoryLoadMode = null;
    } catch {
      memoryLoadMode = next;
    }
    window.dispatchEvent(new Event(LOAD_MODE_EVENT));
  }, []);
  return [mode, set];
}

/** Gives a section its cascade entrance, `delayStep` half-short2s from now. */
function runArrive(el: HTMLElement, delayStep: number) {
  el.style.setProperty("--sk-arrive-delay", arriveDelay(delayStep));
  el.setAttribute("data-arrive-state", "run");
  const done = (e: AnimationEvent) => {
    if (e.target !== el) return;
    // Clean up once it has landed: no lingering transform (a containing block for fixed children).
    el.removeAttribute("data-arrive-state");
    el.style.removeProperty("--sk-arrive-delay");
    el.removeEventListener("animationend", done);
  };
  el.addEventListener("animationend", done);
}

/**
 * Starts the cascade inside `root`: the sections in view rise now in step order; the ones
 * below the fold wait (invisible, still focusable: a Tab to one scrolls it in and shows it)
 * and rise when they first intersect, each batch from that moment. Returns the cleanup.
 */
function startCascade(
  root: HTMLElement,
  observe: ArrivalState["observe"],
  resume = false,
): () => void {
  // Resuming (strict mode's second effect run, after the first run's cleanup disconnected the
  // observer): only the sections still waiting below the fold are watched again.
  // A section that is not rendered (a hidden tab panel, a breakpoint's other block) is left
  // alone: it would keep a "run" it never plays and replay it when it is shown later.
  const sections = [...root.querySelectorAll<HTMLElement>(resume ? '[data-arrive-state="wait"]' : "[data-arrive]")].filter(
    (el) => el.getClientRects().length > 0,
  );
  if (!sections.length) return () => {};
  const step = (el: Element) => Number((el as HTMLElement).dataset.arrive);
  // The fold: the window's bottom, or the root's when it scrolls itself and ends above it (the
  // player body, over its footer nav).
  const fold = Math.min(window.innerHeight, root.getBoundingClientRect().bottom);
  const plan = planArrival(
    sections.map((el) => ({ step: step(el), inView: !resume && el.getBoundingClientRect().top < fold })),
  );
  const offs: (() => void)[] = [];
  sections.forEach((el, i) => {
    const p = plan[i];
    if (p.run) {
      runArrive(el, p.delayStep);
      return;
    }
    el.setAttribute("data-arrive-state", "wait");
    // The page's shared observer: the sections of one round rise as a batch, in step order.
    offs.push(
      observe(el, (batch) => {
        const shown = batch.filter((b): b is HTMLElement => b instanceof HTMLElement && b.hasAttribute("data-arrive"));
        const ranks = batchSteps(shown.map(step));
        runArrive(el, ranks[Math.max(0, shown.indexOf(el))] ?? 0);
      }),
    );
  });
  return () => offs.forEach((off) => off());
}

/**
 * The arrival controller of a platform page. Decides once per page (strict mode's second
 * effect run reuses the decision), marks the page visited, holds the skeleton for the
 * simulated load when it is a first visit and the load is on, then shows the content and
 * starts the cascade inside `rootRef` in the same task (no frame of un-animated content).
 */
export function useArrivalController(pathname: string, rootRef: React.RefObject<HTMLElement>): ArrivalState {
  const [state, setState] = React.useState<Omit<ArrivalState, "observe">>(SETTLED);
  // One observer for the page: the cascade and every counter, bar and ring (review M2).
  const [registry] = React.useState(() => createObserverRegistry(viewportObserver));
  React.useEffect(() => () => registry.disconnect(), [registry]);
  const decision = React.useRef<{ key: string; first: boolean; mode: LoadMode; released: boolean } | null>(null);

  useIsoLayoutEffect(() => {
    // The page has taken over: the pre-paint failsafe is no longer needed.
    if (window.__skArrivalFs !== undefined) {
      window.clearTimeout(window.__skArrivalFs);
      window.__skArrivalFs = undefined;
    }
    const key = arrivalKey(pathname);
    if (decision.current?.key !== key) {
      const visited = readVisited();
      const first = visited !== null && isFirstVisit(key, visited);
      if (visited && first) writeVisited(markVisited(key, visited));
      decision.current = { key, first, mode: readLoadMode(), released: false };
    }
    const d = decision.current;
    const html = document.documentElement;
    let stopCascade = () => {};
    let timer = 0;
    let armTimer = 0;
    // Counters and fills that mount in the window after the load still count; later ones do not.
    const openArming = () => {
      armTimer = window.setTimeout(() => setState((s) => ({ ...s, arming: false })), ARMING_WINDOW_MS);
      setState({ decided: true, first: true, released: true, arming: true });
    };
    const release = () => {
      d.released = true;
      html.removeAttribute("data-arrival");
      if (rootRef.current) stopCascade = startCascade(rootRef.current, registry.observe);
      openArming();
    };

    if (!d.first) {
      html.removeAttribute("data-arrival");
      setState({ decided: true, first: false, released: true, arming: false });
    } else if (d.released) {
      if (rootRef.current) stopCascade = startCascade(rootRef.current, registry.observe, true);
      openArming();
    } else if (shouldShowSkeleton(d.first, d.mode)) {
      html.setAttribute("data-arrival", "pending");
      setState({ decided: true, first: true, released: false, arming: false });
      timer = window.setTimeout(release, loadDelayMs(d.mode));
    } else {
      release();
    }
    return () => {
      window.clearTimeout(timer);
      window.clearTimeout(armTimer);
      stopCascade();
      if (!d.released) html.removeAttribute("data-arrival");
    };
  }, [pathname, rootRef, registry]);

  return React.useMemo(() => ({ ...state, observe: registry.observe }), [state, registry]);
}

/**
 * The player shell's arrival (top bar and sidebar rings): its own first visit, keyed by the
 * course (`courseArrivalPath`), decided once and marked in the session, so the rings sweep on
 * the first topic opened in the course and not on every new topic. The load, the arming window
 * and the page's observer are the body controller's (`body`). Clears the pre-paint
 * `data-arrival-course` flag once the rings have been drawn from this decision. Call it after
 * useArrivalController in the same component, so it reads the session the body just marked.
 */
export function useCourseArrival(courseKey: string, body: ArrivalState): ArrivalState {
  const decision = React.useRef<{ key: string; first: boolean } | null>(null);
  const [first, setFirst] = React.useState<boolean | null>(null);
  useIsoLayoutEffect(() => {
    if (decision.current?.key !== courseKey) {
      const visited = readVisited();
      const d = visited ? decideVisit(courseKey, visited) : { first: false, visited: null };
      if (d.visited && d.first) writeVisited(d.visited);
      decision.current = { key: courseKey, first: d.first };
    }
    setFirst(decision.current.first);
  }, [courseKey]);
  // The flag only acts on rings that have not read a decision yet (OverallProgress), so it can
  // go as soon as the course is decided.
  React.useEffect(() => {
    if (first !== null) document.documentElement.removeAttribute("data-arrival-course");
  }, [first]);
  return React.useMemo(
    () => ({
      decided: first !== null && body.decided,
      first: first === true,
      released: body.released,
      arming: body.arming,
      observe: body.observe,
    }),
    [first, body.decided, body.released, body.arming, body.observe],
  );
}

/**
 * Fires once, the first time `ref`'s element is in view after the load of a first visit,
 * after its section's cascade delay (so the count is seen, not run under an invisible section).
 * `armed` is true from the decision until then: the value should show empty / 0.
 * Never armed on a revisit, under reduced motion, outside a platform page, or when the element
 * mounts after the arming window (a tab panel, a filtered card: no replay).
 */
export type ArrivalTrigger = {
  armed: boolean;
  go: boolean;
  /** The element has read the arrival decision (false on the server and before the decision). */
  decided: boolean;
};

export function useArrivalTrigger(ref: React.RefObject<Element>): ArrivalTrigger {
  const { first, released, decided, arming, observe } = useArrival();
  const [phase, setPhase] = React.useState<"idle" | "armed" | "go" | "done">("idle");
  const used = React.useRef(false);

  useIsoLayoutEffect(() => {
    if (used.current || !decided) return;
    used.current = true;
    if (canArm({ first, released, arming }) && !prefersReducedMotion()) setPhase("armed");
    else setPhase("done");
  }, [decided, first, released, arming]);

  React.useEffect(() => {
    const el = ref.current;
    if (phase !== "armed" || !released || !el) return;
    // Not rendered when the content shows (a hidden tab panel): it never counts, so showing
    // it later (a tab switch) does not replay anything.
    if (el.getClientRects().length === 0) {
      setPhase("done");
      return;
    }
    let next = 0;
    let wait = 0;
    const off = observe(el, () => {
      // Next task: the section around it has been set rising by then (if it was waiting below
      // the fold, its own observer fires in the same round); start when its delay is over.
      next = window.setTimeout(() => {
        const section = el.closest('[data-arrive-state="run"]');
        const delay = section ? parseCssTimeMs(getComputedStyle(section).animationDelay) : 0;
        wait = window.setTimeout(() => setPhase("go"), delay);
      }, 0);
    });
    return () => {
      off();
      window.clearTimeout(next);
      window.clearTimeout(wait);
    };
  }, [phase, released, ref, observe]);

  return { armed: phase === "armed", go: phase === "go", decided: phase !== "idle" };
}

/**
 * A figure ("12", "75%") that counts up from 0 over long2 the first time it shows on a
 * first visit; otherwise (revisit, reduced motion, server) it is the figure itself.
 * `counting` tells the caller to keep the final value for screen readers (ArrivalCount).
 */
export function useArrivalCount<T extends Element>(value: string): { ref: React.RefObject<T>; text: string; counting: boolean } {
  const ref = React.useRef<T>(null);
  const trigger = useArrivalTrigger(ref);
  return { ref, ...useCountText(value, trigger) };
}

/**
 * The count-up text of `value` driven by a trigger the caller owns: a bar's value text runs
 * from the bar's own trigger, so the two start on the same frame (review M2).
 */
export function useCountText(value: string, { armed, go }: ArrivalTrigger): { text: string; counting: boolean } {
  // Starts on the count's first step, so the frame between "in view" and the first tick is 0, not the figure.
  const [text, setText] = React.useState(() => countText(value, 0, MOTION_MS.long2));

  React.useEffect(() => {
    if (!go) return;
    let frame = 0;
    let start: number | null = null;
    const tick = (now: number) => {
      if (start === null) start = now;
      const elapsed = now - start;
      setText(countText(value, elapsed, MOTION_MS.long2));
      if (elapsed < MOTION_MS.long2) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [go, value]);

  const counting = armed || (go && text !== value);
  return { text: armed ? countText(value, 0, MOTION_MS.long2) : go ? text : value, counting };
}

/**
 * A bar or ring value: 0 while armed (first visit, before it shows), then `target`. The
 * component animates the change itself (a transform or stroke-dashoffset transition at
 * long2, standard-decelerate); under reduced motion it is never armed.
 */
export function useArrivalValue<T extends Element>(
  target: number,
): { ref: React.RefObject<T>; value: number; armed: boolean; trigger: ArrivalTrigger } {
  const ref = React.useRef<T>(null);
  const trigger = useArrivalTrigger(ref);
  return { ref, value: trigger.armed ? 0 : target, armed: trigger.armed, trigger };
}

/**
 * A progress ring (motion-matrix §7.9 with §7.2): on a first visit it is drawn empty until it
 * shows, then sweeps to `pct` (long2, standard-decelerate, no delay); afterwards, and on every
 * revisit, a change of `pct` is the completion chain's beat (the same transition, short4
 * late). See lib/arrival/ring. `shown` is the percentage to draw, `transition` the arc's
 * classes, `trigger` drives the centre figure's count (ArrivalCountFrom).
 */
export function useArrivalRing<T extends Element>(
  pct: number,
): { ref: React.RefObject<T>; shown: number; transition: string; trigger: ArrivalTrigger; decided: boolean } {
  const { ref, armed, trigger } = useArrivalValue<T>(pct);
  const [phase, setPhase] = React.useState<RingPhase>("settled");
  const last = React.useRef(pct);
  useIsoLayoutEffect(() => {
    const changed = last.current !== pct;
    last.current = pct;
    setPhase((p) => nextRingPhase(p, armed, changed));
  }, [armed, pct]);
  // The render that arms comes before the effect above: draw it empty already.
  const drawn: RingPhase = armed ? "armed" : phase;
  return { ref, shown: ringShownPct(drawn, pct), transition: ringTransitionClass(drawn), trigger, decided: trigger.decided };
}
