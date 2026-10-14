/**
 * Motion durations in milliseconds, for JS timers only (fallback unmount timeouts,
 * toast auto-dismiss). Must equal the `--motion-duration-*` values in
 * tokens/motion.css; lib/motion/tokens.test.ts pins that. Styling never reads these:
 * use the Tailwind keys (`duration-short3` …).
 */
export const MOTION_MS = {
  short2: 100,
  short3: 150,
  short4: 200,
  medium2: 300,
  long2: 500,
} as const;
