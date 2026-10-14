import { describe, expect, it } from "vitest";
import { isNearEnd } from "./scroll";

// A 400 px box over 1000 px of conversation: the end is at scrollTop 600.
const BOX = 400;
const CONTENT = 1000;
const END = CONTENT - BOX;

describe("isNearEnd", () => {
  it("is true at the end", () => {
    expect(isNearEnd(END, BOX, CONTENT)).toBe(true);
  });

  it("is true 47 px above the end", () => {
    expect(isNearEnd(END - 47, BOX, CONTENT)).toBe(true);
  });

  it("is false 49 px above the end", () => {
    expect(isNearEnd(END - 49, BOX, CONTENT)).toBe(false);
  });

  it("is true when the content is shorter than the box", () => {
    expect(isNearEnd(0, BOX, 250)).toBe(true);
  });
});
