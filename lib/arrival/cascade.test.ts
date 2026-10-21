import { describe, expect, it } from "vitest";
import { MAX_ARRIVE_STEPS, arriveDelay, batchSteps, clampStep, planArrival } from "./cascade";

describe("clampStep", () => {
  it("keeps steps 0–7", () => {
    expect(clampStep(0)).toBe(0);
    expect(clampStep(3)).toBe(3);
    expect(clampStep(7)).toBe(7);
  });
  it("clamps past the eighth step, below zero and junk", () => {
    expect(MAX_ARRIVE_STEPS).toBe(8);
    expect(clampStep(12)).toBe(7);
    expect(clampStep(-2)).toBe(0);
    expect(clampStep(Number.NaN)).toBe(0);
    expect(clampStep(2.7)).toBe(2);
  });
});

describe("arriveDelay", () => {
  it("is half a short2 per step, as a token expression", () => {
    expect(arriveDelay(0)).toBe("calc(var(--motion-duration-short2) / 2 * 0)");
    expect(arriveDelay(3)).toBe("calc(var(--motion-duration-short2) / 2 * 3)");
  });
  it("never goes past the last step", () => {
    expect(arriveDelay(20)).toBe("calc(var(--motion-duration-short2) / 2 * 7)");
  });
});

describe("batchSteps", () => {
  it("ranks a batch by its steps, from 0, so it starts at once", () => {
    expect(batchSteps([5, 3, 4])).toEqual([2, 0, 1]);
  });
  it("keeps the order of equal steps", () => {
    expect(batchSteps([2, 2])).toEqual([0, 1]);
  });
  it("clamps a long batch", () => {
    expect(batchSteps([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])[9]).toBe(7);
  });
});

describe("planArrival", () => {
  it("runs the sections in view on their own steps and holds the rest", () => {
    expect(
      planArrival([
        { step: 0, inView: true },
        { step: 1, inView: true },
        { step: 4, inView: false },
      ]),
    ).toEqual([{ run: true, delayStep: 0 }, { run: true, delayStep: 1 }, { run: false }]);
  });
  it("starts the first section in view at once even if its step is later", () => {
    expect(planArrival([{ step: 2, inView: true }, { step: 3, inView: true }])).toEqual([
      { run: true, delayStep: 0 },
      { run: true, delayStep: 1 },
    ]);
  });
});
