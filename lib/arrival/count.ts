import { countUpValue } from "@/lib/motion/countUp";

/**
 * A figure as text ("12", "75%", "3 of 8") split around its first whole number, for the
 * arrival counters. Decimals and grouped numbers ("4.5", "1,200") are not counted: a
 * count-up of those would show digits the figure never has.
 */
export function splitCount(value: string): { prefix: string; n: number; suffix: string } | null {
  const m = /^(\D*?)(\d+)(.*)$/.exec(value);
  if (!m) return null;
  const [, prefix, digits, suffix] = m;
  if (/^[.,]\d/.test(suffix)) return null;
  return { prefix, n: Number(digits), suffix };
}

/** The figure `elapsedMs` into its count-up (see countUpValue); unchanged without a number. */
export function countText(value: string, elapsedMs: number, durationMs: number): string {
  const parts = splitCount(value);
  if (!parts) return value;
  return `${parts.prefix}${countUpValue(parts.n, elapsedMs, durationMs)}${parts.suffix}`;
}
