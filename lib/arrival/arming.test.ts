import { describe, expect, it } from "vitest";
import { ARMING_WINDOW_MS, canArm, parseCssTimeMs } from "./arming";

describe("canArm", () => {
  it("arms what is mounted before the load ends, on a first visit", () => {
    expect(canArm({ first: true, released: false, arming: false })).toBe(true);
  });
  it("arms what mounts during the window right after the load", () => {
    expect(canArm({ first: true, released: true, arming: true })).toBe(true);
  });
  it("never arms what mounts later (a tab panel, a filter): no replay", () => {
    expect(canArm({ first: true, released: true, arming: false })).toBe(false);
  });
  it("never arms on a revisit", () => {
    expect(canArm({ first: false, released: false, arming: true })).toBe(false);
  });
});

describe("ARMING_WINDOW_MS", () => {
  it("covers a full cascade (7 half-short2 steps + short4) and a long2 count", () => {
    expect(ARMING_WINDOW_MS).toBe((7 * 150) / 2 + 300 + 600);
  });
});

describe("parseCssTimeMs", () => {
  it("reads computed s and ms", () => {
    // token-lint-disable-next-line computed CSS times are the input under test
    expect(parseCssTimeMs("0.15s")).toBe(150);
    // token-lint-disable-next-line computed CSS times are the input under test
    expect(parseCssTimeMs("150ms")).toBe(150);
    // token-lint-disable-next-line computed CSS times are the input under test
    expect(parseCssTimeMs("0s")).toBe(0);
  });
  it("takes the first of a list and is 0 for junk", () => {
    expect(parseCssTimeMs("0.05s, 0s")).toBe(50);
    expect(parseCssTimeMs("")).toBe(0);
    expect(parseCssTimeMs("auto")).toBe(0);
  });
});
