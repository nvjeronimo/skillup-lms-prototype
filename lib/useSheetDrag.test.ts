import { describe, expect, it } from "vitest";
import { projectDistance, rubberband } from "./useSheetDrag";

describe("sheet drag physics", () => {
  it("projects a flick like Apple's sample code", () => {
    // 1000 px/s at 0.998 → 1 × 0.998 / 0.002 = 499 px
    expect(projectDistance(1000)).toBeCloseTo(499, 0);
    expect(projectDistance(0)).toBe(0);
  });

  it("resists more the further past the edge", () => {
    const near = rubberband(-20, 600);
    const far = rubberband(-200, 600);
    expect(near).toBeLessThan(0);
    expect(Math.abs(near)).toBeLessThan(20);
    expect(Math.abs(far) / 200).toBeLessThan(Math.abs(near) / 20);
  });
});
