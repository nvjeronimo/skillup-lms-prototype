/**
 * Motion durations in milliseconds, for JS timers only (fallback unmount timeouts,
 * toast auto-dismiss). Must equal the `--motion-duration-*` values in
 * tokens/motion.css; lib/motion/tokens.test.ts pins that. Styling never reads these:
 * use the Tailwind keys (`duration-short3` …).
 */
export const MOTION_MS = {
  short2: 150,
  short3: 200,
  short4: 300,
  medium2: 400,
  long2: 600,
} as const;

/**
 * Hover-intent grace before a hover surface (the rail's Topic-Flyout) closes: a timer, not a
 * motion duration. It lets the pointer cross the gap from the row into the flyout without the
 * flyout closing under it. Tied to short3 so it stays on the scale (it was a raw 140 ms).
 */
export const HOVER_CLOSE_GRACE_MS = MOTION_MS.short3;
