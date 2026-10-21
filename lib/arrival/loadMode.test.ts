import { describe, expect, it } from "vitest";
import { loadDelayMs, parseLoadMode, shouldShowSkeleton } from "./loadMode";

describe("parseLoadMode", () => {
  it("reads the three modes", () => {
    expect(parseLoadMode("normal")).toBe("normal");
    expect(parseLoadMode("off")).toBe("off");
    expect(parseLoadMode("slow")).toBe("slow");
  });
  it("falls back to normal for anything else", () => {
    expect(parseLoadMode(null)).toBe("normal");
    expect(parseLoadMode("")).toBe("normal");
    expect(parseLoadMode("SLOW!")).toBe("normal");
  });
});

describe("loadDelayMs", () => {
  it("is about half a second normally, 2 s slow, nothing off", () => {
    expect(loadDelayMs("normal")).toBe(500);
    expect(loadDelayMs("slow")).toBe(2000);
    expect(loadDelayMs("off")).toBe(0);
  });
});

describe("shouldShowSkeleton", () => {
  it("only on a first visit and never with the load off", () => {
    expect(shouldShowSkeleton(true, "normal")).toBe(true);
    expect(shouldShowSkeleton(true, "slow")).toBe(true);
    expect(shouldShowSkeleton(true, "off")).toBe(false);
    expect(shouldShowSkeleton(false, "normal")).toBe(false);
  });
});
