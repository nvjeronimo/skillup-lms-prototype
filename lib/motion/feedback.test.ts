import { describe, expect, it } from "vitest";
import {
  BUTTON_DONE_MS,
  LOCK_TOOLTIP_MS,
  TRANSCRIPT_FOLLOW_PAUSE_MS,
  intersectSpans,
  isOutOfView,
  isScrollKey,
  showsDoneCheck,
} from "./feedback";

describe("timings", () => {
  it("match the brief", () => {
    expect(BUTTON_DONE_MS).toBe(1200);
    expect(LOCK_TOOLTIP_MS).toBe(3000);
    expect(TRANSCRIPT_FOLLOW_PAUSE_MS).toBe(4000);
  });
});

describe("showsDoneCheck", () => {
  it("shows the check when loading ends with done", () => {
    expect(showsDoneCheck(true, false, true)).toBe(true);
  });
  it("not without done", () => {
    expect(showsDoneCheck(true, false, undefined)).toBe(false);
    expect(showsDoneCheck(true, false, false)).toBe(false);
  });
  it("not while still loading, nor when it was not loading", () => {
    expect(showsDoneCheck(true, true, true)).toBe(false);
    expect(showsDoneCheck(false, false, true)).toBe(false);
  });
});

describe("isScrollKey", () => {
  it("knows the keys that scroll", () => {
    for (const k of ["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "]) expect(isScrollKey(k)).toBe(true);
  });
  it("ignores the rest", () => {
    expect(isScrollKey("Enter")).toBe(false);
    expect(isScrollKey("a")).toBe(false);
    expect(isScrollKey("Tab")).toBe(false);
  });
});

describe("isOutOfView", () => {
  const view = { top: 100, bottom: 500 };
  it("is false for a line wholly inside", () => {
    expect(isOutOfView({ top: 100, bottom: 140 }, view)).toBe(false);
    expect(isOutOfView({ top: 460, bottom: 500 }, view)).toBe(false);
  });
  it("is true for a line cut at the top or bottom", () => {
    expect(isOutOfView({ top: 90, bottom: 130 }, view)).toBe(true);
    expect(isOutOfView({ top: 480, bottom: 520 }, view)).toBe(true);
  });
  it("is true for a line wholly outside", () => {
    expect(isOutOfView({ top: 600, bottom: 640 }, view)).toBe(true);
  });
});

describe("intersectSpans", () => {
  it("keeps the overlap", () => {
    expect(intersectSpans({ top: 0, bottom: 800 }, { top: 120, bottom: 1000 })).toEqual({ top: 120, bottom: 800 });
  });
});
