import { MOTION_MS } from "@/lib/motion/tokens";
import { MAX_ARRIVE_STEPS } from "./cascade";

/**
 * How long after the load a counter or fill that mounts may still arm: one full cascade
 * (seven half-short2 steps + its short4 rise) and a long2 count. Anything mounting after
 * that (a tab panel, a filtered card) shows its final value: §7.9 has no replay.
 */
export const ARMING_WINDOW_MS =
  (MOTION_MS.short2 / 2) * (MAX_ARRIVE_STEPS - 1) + MOTION_MS.short4 + MOTION_MS.long2;

/**
 * Whether a counter or fill mounting now counts: only on a first visit, and only if it was
 * there before the load ended or arrives inside the window right after it.
 */
export function canArm(s: { first: boolean; released: boolean; arming: boolean }): boolean {
  return s.first && (!s.released || s.arming);
}

/** A computed CSS time ("0.15s", "150ms", a list) in ms: the first entry, 0 for junk. */
export function parseCssTimeMs(value: string): number {
  const m = /^\s*(-?\d*\.?\d+)(ms|s)\b/.exec(value);
  if (!m) return 0;
  const n = Number(m[1]);
  return m[2] === "s" ? n * 1000 : n;
}
