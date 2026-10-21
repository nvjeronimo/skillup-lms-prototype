import { describe, expect, it } from "vitest";
import { countText, splitCount } from "./count";

describe("splitCount", () => {
  it("finds the whole number in a figure", () => {
    expect(splitCount("12")).toEqual({ prefix: "", n: 12, suffix: "" });
    expect(splitCount("75%")).toEqual({ prefix: "", n: 75, suffix: "%" });
    expect(splitCount("3 of 8")).toEqual({ prefix: "", n: 3, suffix: " of 8" });
  });
  it("has nothing to count in a figure without a number", () => {
    expect(splitCount("—")).toBeNull();
    expect(splitCount("")).toBeNull();
  });
  it("leaves decimals and grouped numbers alone (not whole counts)", () => {
    expect(splitCount("4.5")).toBeNull();
    expect(splitCount("1,200")).toBeNull();
  });
});

describe("countText", () => {
  it("is the figure with its number at the step reached", () => {
    expect(countText("75%", 0, 500)).toBe("0%");
    expect(countText("75%", 500, 500)).toBe("75%");
    expect(countText("3 of 8", 9999, 500)).toBe("3 of 8");
  });
  it("climbs and never passes the target", () => {
    const mid = Number(countText("80", 250, 500));
    expect(mid).toBeGreaterThan(40);
    expect(mid).toBeLessThanOrEqual(80);
  });
  it("returns a figure without a number unchanged", () => {
    expect(countText("—", 0, 500)).toBe("—");
  });
});
