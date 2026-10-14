import { describe, expect, it } from "vitest";
import { staggerDelay, staggerStyle } from "./stagger";

describe("staggerDelay", () => {
  it("starts the first row at once", () => {
    expect(staggerDelay(0, 3)).toBe("calc(var(--motion-duration-short2) / 2 * 0)");
  });

  it("offsets each row by half a short2 in a list of eight", () => {
    expect(staggerDelay(2, 8)).toBe("calc(var(--motion-duration-short2) / 2 * 2)");
  });

  it("gives no delay to a list longer than eight", () => {
    expect(staggerDelay(0, 9)).toBeUndefined();
  });
});

describe("staggerStyle", () => {
  it("holds a delayed row hidden until its turn", () => {
    expect(staggerStyle(1, 3)).toEqual({
      animationDelay: "calc(var(--motion-duration-short2) / 2 * 1)",
      animationFillMode: "backwards",
    });
  });

  it("sets nothing on the rows of a long list", () => {
    expect(staggerStyle(1, 9)).toEqual({});
  });
});
