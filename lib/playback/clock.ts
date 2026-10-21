import { PLAYBACK_TICK_MS, advancePlayback } from "./coverage";

/** What the clock reads on every tick. The caller writes `time` on a seek; the clock on a tick. */
export interface ClockState {
  time: number;
  speed: number;
  duration: number;
}

/**
 * The simulated clock without React: every PLAYBACK_TICK_MS it advances `state.time` by the wall
 * time elapsed times the speed and reports the stretch played. It writes `state.time` itself, ahead
 * of the caller's re-render, so a tick is never counted twice; a seek the caller writes in between
 * starts the next stretch where it landed, so the jump is never counted (BR-01). Stops at the end.
 * Returns stop().
 */
export function startPlaybackClock(
  state: ClockState,
  onAdvance: (from: number, to: number) => void,
  onEnd: () => void,
  now: () => number = () => Date.now(),
): () => void {
  let last = now();
  const id = setInterval(() => {
    const t = now();
    const next = advancePlayback(state.time, (t - last) / 1000, state.speed, state.duration);
    last = t;
    if (next.time > state.time) {
      const from = state.time;
      state.time = next.time;
      onAdvance(from, next.time);
    }
    if (next.ended) {
      clearInterval(id);
      onEnd();
    }
  }, PLAYBACK_TICK_MS);
  return () => clearInterval(id);
}
