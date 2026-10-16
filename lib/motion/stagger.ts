import type { CSSProperties } from "react";

/** Lists longer than this rise together: a cascade past eight rows reads as lag. */
const MAX_STAGGERED = 8;

/**
 * The entrance delay of row `index` in a list of `count` rows: half a short2 per row
 * (a token, never a raw ms), or none at all when the list is longer than eight rows.
 */
export function staggerDelay(index: number, count: number): string | undefined {
  if (count > MAX_STAGGERED) return undefined;
  return `calc(var(--motion-duration-short2) / 2 * ${index})`;
}

/**
 * The inline style of a staggered `sk-animate-rise` row: its delay, and a backwards fill so
 * the row stays hidden while it waits instead of showing, vanishing, then rising.
 */
export function staggerStyle(index: number, count: number): CSSProperties {
  const delay = staggerDelay(index, count);
  return delay ? { animationDelay: delay, animationFillMode: "backwards" } : {};
}
