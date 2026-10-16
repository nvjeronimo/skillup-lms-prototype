"use client";

import * as React from "react";
import { countUpValue } from "@/lib/motion/countUp";
import { MOTION_MS } from "@/lib/motion/tokens";

/** Reduced motion from either source: the OS setting or the Accessibility panel's switch. */
function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return true;
  return (
    document.documentElement.hasAttribute("data-reduce-motion") ||
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true
  );
}

// useLayoutEffect on the client (no flash of the final number), useEffect on the server.
const useIsoLayoutEffect = typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

/**
 * A number that counts up from 0 to `target` over long2 (see `countUpValue`), for a score
 * landing on screen. It counts when it first shows and when the target changes, never on a
 * re-render with the same target. Under reduced motion it is the target at once.
 * The first render (and the server render) is the target, so nothing reads wrong without JS;
 * the layout effect drops it to 0 before the first paint when it is going to count.
 */
export function useCountUp(target: number): number {
  const [value, setValue] = React.useState(target);

  useIsoLayoutEffect(() => {
    if (prefersReducedMotion() || target <= 0) {
      setValue(target);
      return;
    }
    let frame = 0;
    let start: number | null = null;
    setValue(0);
    const tick = (now: number) => {
      if (start === null) start = now;
      const next = countUpValue(target, now - start, MOTION_MS.long2);
      setValue(next);
      if (next !== target) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target]);

  return value;
}
