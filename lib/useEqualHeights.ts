"use client";

import * as React from "react";

/**
 * Every card of a collection gets the height of the tallest one (Nelson, 16 Oct 2026: "os cards
 * têm que ter sempre a mesma altura"). The cards keep their action at the bottom (mt-auto), so
 * the extra height sits above it. Measured, not fixed: titles, the next topic and the states
 * change the natural height. Hidden cards (another breakpoint's copy) are left out. `deps`
 * re-measure when the list changes (tab, filter, search, view).
 * `minWidth`: below this viewport width the cards keep their own height. On a phone the grid is
 * one column, so equal heights only add empty space (Nelson, 25 Oct 2026: the phone course cards
 * were too tall).
 */
export function useEqualHeights<T extends HTMLElement>(
  selector: string,
  deps: React.DependencyList,
  { minWidth = 0 }: { minWidth?: number } = {},
) {
  const ref = React.useRef<T>(null);
  React.useLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;
    const apply = () => {
      const cards = Array.from(root.querySelectorAll<HTMLElement>(selector)).filter((c) => c.offsetParent !== null);
      cards.forEach((c) => (c.style.minHeight = ""));
      if (window.innerWidth < minWidth) return;
      const tallest = Math.max(0, ...cards.map((c) => c.getBoundingClientRect().height));
      if (tallest) cards.forEach((c) => (c.style.minHeight = `${tallest}px`));
    };
    apply();
    let frame = 0;
    const onResize = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(apply);
    };
    window.addEventListener("resize", onResize);
    // Web fonts change line breaks once they load.
    document.fonts?.ready.then(apply).catch(() => {});
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return ref;
}
