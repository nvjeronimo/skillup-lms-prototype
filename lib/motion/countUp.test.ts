import { describe, expect, it } from "vitest";
import { countUpValue } from "./countUp";

describe("countUpValue", () => {
  it("starts at 0", () => {
    expect(countUpValue(80, 0, 500)).toBe(0);
  });

  it("lands on the target when the duration is up", () => {
    expect(countUpValue(80, 500, 500)).toBe(80);
  });

  it("stays on the target after the duration", () => {
    expect(countUpValue(80, 9999, 500)).toBe(80);
  });

  it("never goes back down, in whole numbers within [0, target]", () => {
    let prev = -1;
    for (let t = 0; t <= 500; t += 50) {
      const v = countUpValue(80, t, 500);
      expect(Number.isInteger(v)).toBe(true);
      expect(v).toBeGreaterThanOrEqual(prev);
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThanOrEqual(80);
      prev = v;
    }
  });

  it("decelerates: more than half the way at the halfway point", () => {
    expect(countUpValue(80, 250, 500)).toBeGreaterThan(40);
  });

  it("a zero target stays at zero", () => {
    expect(countUpValue(0, 250, 500)).toBe(0);
  });
});
