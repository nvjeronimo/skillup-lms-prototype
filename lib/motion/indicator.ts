/**
 * Geometry of a sliding tab indicator: one bar under the tab row that moves to the selected
 * tab with `translateX()` and a width, instead of one bar per tab.
 */
export interface IndicatorBox {
  x: number;
  width: number;
}

/**
 * Where the bar goes, in the coordinates of the positioned row that holds it: the tab's left
 * edge relative to the row's, plus how far the row has scrolled sideways (the bar scrolls
 * with the tabs because it lives inside the scrolled content).
 */
export function measureIndicator(
  tab: { left: number; width: number },
  row: { left: number },
  rowScrollLeft = 0,
): IndicatorBox {
  return { x: Math.round(tab.left - row.left + rowScrollLeft), width: Math.round(tab.width) };
}

/** True when two measurements differ by a pixel or more (sub-pixel jitter is ignored). */
export function indicatorMoved(a: IndicatorBox | null, b: IndicatorBox): boolean {
  if (!a) return true;
  return Math.abs(a.x - b.x) >= 1 || Math.abs(a.width - b.width) >= 1;
}
