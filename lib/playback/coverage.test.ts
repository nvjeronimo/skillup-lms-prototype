import { describe, expect, it } from "vitest";
import {
  AUTO_COMPLETE_FRACTION,
  MAX_TICK_SECONDS,
  addPlayed,
  advancePlayback,
  crossesAutoComplete,
  mergeIntervals,
  watchedFraction,
  type Interval,
} from "./coverage";

describe("mergeIntervals", () => {
  it("merges overlapping and touching intervals and sorts them", () =>
    expect(
      mergeIntervals([
        [50, 60],
        [0, 10],
        [5, 20],
        [20, 30],
      ]),
    ).toEqual([
      [0, 30],
      [50, 60],
    ]));
  it("drops empty and reversed intervals", () =>
    expect(
      mergeIntervals([
        [10, 10],
        [30, 20],
        [1, 2],
      ]),
    ).toEqual([[1, 2]]));
  it("leaves an empty list empty", () => expect(mergeIntervals([])).toEqual([]));
});

describe("addPlayed", () => {
  it("adds the stretch played", () => expect(addPlayed([], 0, 10)).toEqual([[0, 10]]));
  it("joins a stretch that continues an earlier one", () =>
    expect(addPlayed([[0, 10]], 10, 12)).toEqual([[0, 12]]));
  it("adds nothing when time did not move forward (a seek back is not playback)", () => {
    const before: Interval[] = [[0, 10]];
    expect(addPlayed(before, 40, 5)).toEqual([[0, 10]]);
    expect(addPlayed(before, 7, 7)).toEqual([[0, 10]]);
  });
  it("does not mutate its input", () => {
    const before: Interval[] = [[0, 10]];
    addPlayed(before, 10, 20);
    expect(before).toEqual([[0, 10]]);
  });
});

describe("watchedFraction", () => {
  it("is the share of the duration covered, overlaps counted once", () =>
    expect(
      watchedFraction(
        [
          [0, 30],
          [20, 50],
        ],
        100,
      ),
    ).toBeCloseTo(0.5));
  it("ignores coverage past the end", () => expect(watchedFraction([[90, 150]], 100)).toBeCloseTo(0.1));
  it("is 0 for an unknown duration", () => expect(watchedFraction([[0, 10]], 0)).toBe(0));
  it("a rewatch adds nothing", () => {
    const once = addPlayed([], 0, 60);
    const twice = addPlayed(once, 0, 60);
    expect(watchedFraction(twice, 100)).toBeCloseTo(0.6);
  });
});

describe("seeking does not count as watching", () => {
  it("play 0→10, seek to 90, play 90→100: 20% watched, not 100%", () => {
    let watched = addPlayed([], 0, 10);
    // The seek itself adds nothing: only the stretches advanced by playback are added.
    watched = addPlayed(watched, 90, 100);
    expect(watchedFraction(watched, 100)).toBeCloseTo(0.2);
    expect(crossesAutoComplete([], watched, 100)).toBe(false);
  });
});

describe("crossesAutoComplete", () => {
  const d = 100;
  it("the threshold is 90% (BR-01)", () => expect(AUTO_COMPLETE_FRACTION).toBe(0.9));
  it("is true on the stretch that reaches 90%", () =>
    expect(crossesAutoComplete([[0, 89]], addPlayed([[0, 89]], 89, 90), d)).toBe(true));
  it("is false below 90%", () =>
    expect(crossesAutoComplete([[0, 80]], addPlayed([[0, 80]], 80, 89.9), d)).toBe(false));
  it("is true once only: past 90% it is false on every later stretch", () => {
    const at90 = addPlayed([], 0, 90);
    expect(crossesAutoComplete(at90, addPlayed(at90, 90, 95), d)).toBe(false);
  });
  it("counts coverage from earlier sessions (cumulative)", () => {
    const earlier: Interval[] = [[0, 50]];
    const today = addPlayed(earlier, 50, 90);
    expect(crossesAutoComplete(earlier, today, d)).toBe(true);
  });
});

describe("advancePlayback", () => {
  it("advances by the elapsed time times the speed", () =>
    expect(advancePlayback(10, 0.25, 2, 100)).toEqual({ time: 10.5, ended: false }));
  it("stops at the end", () => expect(advancePlayback(99.9, 0.25, 1, 100)).toEqual({ time: 100, ended: true }));
  it("caps a long gap (a throttled timer) to one tick's worth", () =>
    expect(advancePlayback(0, 60, 1, 100).time).toBe(MAX_TICK_SECONDS));
  it("never goes backwards", () => expect(advancePlayback(10, -1, 1, 100).time).toBe(10));
});
