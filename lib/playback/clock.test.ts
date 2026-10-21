import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { PLAYBACK_TICK_MS } from "./coverage";
import { startPlaybackClock, type ClockState } from "./clock";

describe("startPlaybackClock", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  function run(state: ClockState) {
    const advances: [number, number][] = [];
    const onEnd = vi.fn();
    const stop = startPlaybackClock(state, (from, to) => advances.push([from, to]), onEnd);
    return { advances, onEnd, stop };
  }

  it("advances one tick's time at the speed", () => {
    const { advances, stop } = run({ time: 0, speed: 2, duration: 100 });
    vi.advanceTimersByTime(PLAYBACK_TICK_MS);
    expect(advances).toEqual([[0, 0.5]]);
    stop();
  });

  it("a seek between ticks never counts: the next stretch starts where the seek landed", () => {
    const state: ClockState = { time: 0, speed: 1, duration: 100 };
    const { advances, stop } = run(state);
    vi.advanceTimersByTime(PLAYBACK_TICK_MS);
    state.time = 60; // the learner scrubs to 1:00
    vi.advanceTimersByTime(PLAYBACK_TICK_MS);
    expect(advances).toEqual([
      [0, 0.25],
      [60, 60.25],
    ]);
    stop();
  });

  it("counts a tick once even if the caller has not re-rendered yet", () => {
    const state: ClockState = { time: 0, speed: 1, duration: 100 };
    const { advances, stop } = run(state);
    vi.advanceTimersByTime(PLAYBACK_TICK_MS * 2);
    expect(advances).toEqual([
      [0, 0.25],
      [0.25, 0.5],
    ]);
    stop();
  });

  it("ends at the duration and stops ticking", () => {
    const { advances, onEnd } = run({ time: 99.9, speed: 1, duration: 100 });
    vi.advanceTimersByTime(PLAYBACK_TICK_MS * 4);
    expect(advances).toEqual([[99.9, 100]]);
    expect(onEnd).toHaveBeenCalledTimes(1);
  });

  it("stop() stops it", () => {
    const { advances, stop } = run({ time: 0, speed: 1, duration: 100 });
    stop();
    vi.advanceTimersByTime(PLAYBACK_TICK_MS * 4);
    expect(advances).toEqual([]);
  });
});
