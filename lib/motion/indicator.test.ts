import { describe, expect, it } from "vitest";
import { indicatorMoved, measureIndicator } from "./indicator";

describe("measureIndicator", () => {
  it("places the bar at the tab's offset in the row", () => {
    expect(measureIndicator({ left: 340, width: 96 }, { left: 300 })).toEqual({ x: 40, width: 96 });
  });
  it("adds the row's sideways scroll", () => {
    expect(measureIndicator({ left: 280, width: 80 }, { left: 300 }, 60)).toEqual({ x: 40, width: 80 });
  });
  it("rounds to whole pixels", () => {
    expect(measureIndicator({ left: 340.4, width: 95.6 }, { left: 300 })).toEqual({ x: 40, width: 96 });
  });
});

describe("indicatorMoved", () => {
  it("is true on the first measurement", () => {
    expect(indicatorMoved(null, { x: 0, width: 10 })).toBe(true);
  });
  it("ignores sub-pixel jitter", () => {
    expect(indicatorMoved({ x: 10, width: 50 }, { x: 10.4, width: 50.3 })).toBe(false);
  });
  it("sees a real move", () => {
    expect(indicatorMoved({ x: 10, width: 50 }, { x: 90, width: 50 })).toBe(true);
    expect(indicatorMoved({ x: 10, width: 50 }, { x: 10, width: 64 })).toBe(true);
  });
});
