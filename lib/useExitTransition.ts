"use client";

import * as React from "react";
import { nextPresence, type Presence } from "./motion/presence";

/** Slack after the exit duration before the timer unmounts a surface whose animationend never came. */
const FALLBACK_SLACK_MS = 50;

/**
 * Keeps a surface mounted while its exit animation plays.
 * Render only when `mounted`; set `data-state={state}` on the root and `onAnimationEnd`
 * on the element whose animation ends last. `exitMs` is the fallback for when the
 * animation never fires (reduced motion edge cases, display:none).
 */
export function useExitTransition(open: boolean, exitMs: number) {
  const [presence, dispatch] = React.useReducer(nextPresence, open ? "open" : "unmounted") as [
    Presence,
    React.Dispatch<"open" | "close" | "exited">,
  ];

  React.useEffect(() => {
    dispatch(open ? "open" : "close");
  }, [open]);

  React.useEffect(() => {
    if (presence !== "closing") return;
    const id = window.setTimeout(() => dispatch("exited"), exitMs + FALLBACK_SLACK_MS);
    return () => window.clearTimeout(id);
  }, [presence, exitMs]);

  const onAnimationEnd = React.useCallback(
    (e: React.AnimationEvent) => {
      if (e.target !== e.currentTarget) return;
      dispatch("exited");
    },
    [],
  );

  return {
    mounted: presence !== "unmounted",
    state: (presence === "open" ? "open" : "closed") as "open" | "closed",
    onAnimationEnd,
  };
}
