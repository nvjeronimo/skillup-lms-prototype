/**
 * Small timing rules of the "Later" motion block (motion-matrix §7.6). Pure, so vitest can
 * pin them; the components hold the timers.
 */

/** How long a Button's Done check stays before the label returns. */
export const BUTTON_DONE_MS = 1200;

/** How long Copy link / Share shows its check and says "Copied" before it reverts (§7.9). */
export const COPIED_MS = 1500;

/**
 * The label of a share trigger: "Copied" while the copy confirmation shows, its own label
 * otherwise (the visible word on a labelled button, the aria-label on an icon-only one).
 */
export function copiedLabel(copied: boolean, label: string): string {
  return copied ? "Copied" : label;
}

/** How long the locked-topic tooltip stays when nothing dismisses it first. */
export const LOCK_TOOLTIP_MS = 3000;

/** How long the transcript stops following (unchanged from before the motion block) the video after the learner scrolls it. */
export const TRANSCRIPT_FOLLOW_PAUSE_MS = 8000;

/**
 * True when a Button should show its Done check: it was loading, it no longer is, and the
 * caller says the work succeeded (`done`). Any other transition shows the label.
 */
export function showsDoneCheck(wasLoading: boolean, loading: boolean, done: boolean | undefined): boolean {
  return wasLoading && !loading && done === true;
}

/** Keys that scroll a box the learner has focus in (they pause the transcript's auto-follow). */
const SCROLL_KEYS = new Set(["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "]);
export function isScrollKey(key: string): boolean {
  return SCROLL_KEYS.has(key);
}

export interface Span {
  top: number;
  bottom: number;
}

/**
 * True when `item` is not wholly inside `view` (both in the same coordinates, e.g. client
 * rects). The transcript scrolls to its active line only then; a line already on screen
 * stays where the learner is reading it.
 */
export function isOutOfView(item: Span, view: Span): boolean {
  return item.top < view.top || item.bottom > view.bottom;
}

/** The part of `a` that `b` also covers (an empty span has bottom <= top). */
export function intersectSpans(a: Span, b: Span): Span {
  return { top: Math.max(a.top, b.top), bottom: Math.min(a.bottom, b.bottom) };
}
