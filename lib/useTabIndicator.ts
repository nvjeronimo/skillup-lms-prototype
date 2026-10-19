"use client";

import * as React from "react";
import { indicatorMoved, measureIndicator, type IndicatorBox } from "./motion/indicator";

/**
 * One selected-tab bar that slides between tabs (motion-matrix §7.6): `translateX()` + width,
 * measured from the selected tab, short4 on the standard curve.
 *
 * Put `rowRef` on the positioned element that holds the tabs (the bar is drawn inside it) and
 * `data-tab-active` (true on the selected one) on every tab. Until the first measurement `box`
 * is null and the caller draws the old per-tab bar, so the server render and first paint look
 * the same. The first measurement of a row and every resize place the bar without animating;
 * only a change of `activeKey` slides it. Reduced motion: the global transition guard drops
 * transform and width, so the bar jumps.
 */
export function useTabIndicator(activeKey: string) {
  const [row, setRow] = React.useState<HTMLElement | null>(null);
  const rowRef = React.useCallback((node: HTMLElement | null) => setRow(node), []);
  const [box, setBox] = React.useState<IndicatorBox | null>(null);
  const [animate, setAnimate] = React.useState(false);
  // The key the bar was last placed for, on the current row: a new key slides, the same jumps.
  const placedFor = React.useRef<string | null>(null);

  const measure = React.useCallback(
    (slide: boolean) => {
      const tab = row?.querySelector<HTMLElement>('[data-tab-active="true"]');
      if (!row || !tab) return false;
      const next = measureIndicator(tab.getBoundingClientRect(), row.getBoundingClientRect());
      setAnimate(slide);
      setBox((prev) => (indicatorMoved(prev, next) ? next : prev));
      return true;
    },
    [row],
  );

  // A new row (first mount, or the select turning back into tabs) is placed, not slid.
  React.useLayoutEffect(() => {
    placedFor.current = null;
    if (!row) setBox(null);
  }, [row]);

  React.useLayoutEffect(() => {
    const slide = placedFor.current !== null && placedFor.current !== activeKey;
    if (measure(slide)) placedFor.current = activeKey;
  }, [activeKey, measure]);

  React.useEffect(() => {
    if (!row || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => measure(false));
    ro.observe(row);
    // A tab can change width without the row doing so (a web font arriving, a count changing).
    row.querySelectorAll<HTMLElement>("[data-tab-active]").forEach((el) => ro.observe(el));
    return () => ro.disconnect();
  }, [row, measure]);

  const style: React.CSSProperties | undefined = box
    ? { width: box.width, transform: `translateX(${box.x}px)` }
    : undefined;
  return { rowRef, box, animate, style };
}
