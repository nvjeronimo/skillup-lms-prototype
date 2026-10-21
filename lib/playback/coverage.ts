/**
 * Watched coverage of a video or podcast, for the auto-complete rule.
 *
 * BR-01 (LMS-HANDOFF/BA/03-business-rules.md): a Video completes when playback reaches ≥ 90% of
 * its total duration, in one session or cumulative across sessions; a Podcast the same for audio.
 * P1-46: at 90% the topic is Completed, once (a completed topic is never completed again).
 *
 * Coverage is the set of stretches actually PLAYED, in seconds. A seek jumps without adding
 * anything, so scrubbing to the end does not complete the topic; and a stretch watched twice
 * counts once. Pure: the store keeps the intervals per topic, the players feed it.
 */

/** One played stretch, [from, to) in seconds. */
export type Interval = [number, number];

/** BR-01: the share of the duration that must have been played. */
export const AUTO_COMPLETE_FRACTION = 0.9;

/** How often the simulated players advance their clock, in milliseconds. */
export const PLAYBACK_TICK_MS = 250;

/**
 * The most a single tick may advance, in seconds of media at 1×. A timer the browser throttled
 * (a background tab) would otherwise jump ahead by the whole gap.
 */
export const MAX_TICK_SECONDS = 1;

/** Sorted, non-overlapping intervals; empty or reversed ones dropped. Touching ones are joined. */
export function mergeIntervals(intervals: readonly Interval[]): Interval[] {
  const sorted = intervals
    .filter(([a, b]) => b > a)
    .map(([a, b]) => [a, b] as Interval)
    .sort((x, y) => x[0] - y[0]);
  const out: Interval[] = [];
  for (const [a, b] of sorted) {
    const last = out[out.length - 1];
    if (last && a <= last[1]) last[1] = Math.max(last[1], b);
    else out.push([a, b]);
  }
  return out;
}

/** The coverage after playing from `from` to `to`. Time that did not move forward adds nothing. */
export function addPlayed(intervals: readonly Interval[], from: number, to: number): Interval[] {
  if (!(to > from)) return mergeIntervals(intervals);
  return mergeIntervals([...intervals, [from, to]]);
}

/** The share of `duration` covered, 0 to 1. Coverage outside [0, duration] does not count. */
export function watchedFraction(intervals: readonly Interval[], duration: number): number {
  if (!(duration > 0)) return 0;
  let seconds = 0;
  for (const [a, b] of mergeIntervals(intervals)) {
    seconds += Math.max(0, Math.min(b, duration) - Math.max(a, 0));
  }
  return Math.min(1, seconds / duration);
}

/**
 * True when the coverage meets BR-01's 90%. Completing once is the store's part: a topic already
 * completed is never completed again (P1-46), so this may stay true on every later stretch.
 */
export function reachedAutoComplete(intervals: readonly Interval[], duration: number): boolean {
  return watchedFraction(intervals, duration) >= AUTO_COMPLETE_FRACTION;
}

/**
 * One tick of the simulated clock: `elapsedSeconds` of wall time at `speed`, capped (see
 * MAX_TICK_SECONDS), never backwards, stopping at the end.
 */
export function advancePlayback(
  time: number,
  elapsedSeconds: number,
  speed: number,
  duration: number,
): { time: number; ended: boolean } {
  const step = Math.min(Math.max(0, elapsedSeconds), MAX_TICK_SECONDS) * speed;
  const next = Math.min(duration, time + step);
  return { time: next, ended: next >= duration };
}
