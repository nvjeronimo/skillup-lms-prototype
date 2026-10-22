"use client";

import * as React from "react";
import { armExitFallback, isOwnAnimationEnd, nextPresence, presenceView } from "./motion/presence";

/**
 * What a leaving surface shows: `value` while `open`, and the last value it had while open
 * once `open` is false, so the exit animation draws what was on screen even when the caller
 * has already cleared or changed it. The ref is written in an effect, never during render.
 */
export function useFrozenWhileClosed<T>(value: T, open: boolean): T {
  const lastOpen = React.useRef(value);
  React.useEffect(() => {
    if (open) lastOpen.current = value;
  });
  return open ? value : lastOpen.current;
}

/**
 * Keeps a surface mounted while its exit animation plays.
 * Render only when `mounted`; set `data-state={state}` on the root and `onAnimationEnd`
 * on the element whose animation ends last. Surfaces that leave by a CSS transition (menus and
 * popovers since 22 Oct 2026, interruptible) set `onTransitionEnd` instead: their opacity ends it. `exitMs` is the fallback for when the
 * animation never fires (reduced motion edge cases, display:none).
 */
export function useExitTransition(
  open: boolean,
  exitMs: number,
): {
  mounted: boolean;
  state: "open" | "closed";
  onAnimationEnd: (e: React.AnimationEvent) => void;
  onTransitionEnd: (e: React.TransitionEvent) => void;
} {
  const [presence, dispatch] = React.useReducer(nextPresence, open ? "open" : "unmounted");

  React.useEffect(() => {
    dispatch(open ? "open" : "close");
  }, [open]);

  React.useEffect(
    () => armExitFallback(presence, exitMs, () => dispatch("exited")),
    [presence, exitMs],
  );

  const onAnimationEnd = React.useCallback((e: React.AnimationEvent) => {
    if (isOwnAnimationEnd(e.target, e.currentTarget)) dispatch("exited");
  }, []);

  const onTransitionEnd = React.useCallback((e: React.TransitionEvent) => {
    if (e.propertyName === "opacity" && isOwnAnimationEnd(e.target, e.currentTarget)) dispatch("exited");
  }, []);

  return { ...presenceView(open, presence), onAnimationEnd, onTransitionEnd };
}
