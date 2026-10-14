"use client";

import * as React from "react";
import { armExitFallback, isOwnAnimationEnd, nextPresence } from "./motion/presence";

/**
 * Keeps a surface mounted while its exit animation plays.
 * Render only when `mounted`; set `data-state={state}` on the root and `onAnimationEnd`
 * on the element whose animation ends last. `exitMs` is the fallback for when the
 * animation never fires (reduced motion edge cases, display:none).
 */
export function useExitTransition(
  open: boolean,
  exitMs: number,
): {
  mounted: boolean;
  state: "open" | "closed";
  onAnimationEnd: (e: React.AnimationEvent) => void;
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

  return {
    mounted: presence !== "unmounted",
    state: presence === "open" ? "open" : "closed",
    onAnimationEnd,
  };
}
