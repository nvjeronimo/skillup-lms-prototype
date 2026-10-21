import { describe, expect, it } from "vitest";
import { nextRingPhase, ringShownPct, ringTransitionClass } from "./ring";

describe("ring phases", () => {
  it("first visit: armed (empty) → sweep → settled", () => {
    let p = nextRingPhase("settled", true, false);
    expect(p).toBe("armed");
    expect(ringShownPct(p, 60)).toBe(0);
    p = nextRingPhase(p, false, false);
    expect(p).toBe("sweep");
    expect(ringShownPct(p, 60)).toBe(60);
    expect(ringTransitionClass(p)).not.toContain("delay");
  });

  it("the sweep holds until the value changes; a change is the chain", () => {
    expect(nextRingPhase("sweep", false, false)).toBe("sweep");
    const p = nextRingPhase("sweep", false, true);
    expect(p).toBe("settled");
    expect(ringTransitionClass(p)).toContain("delay-short4");
  });

  it("a revisit is settled from the start: only the chain animates", () => {
    expect(nextRingPhase("settled", false, false)).toBe("settled");
    expect(nextRingPhase("settled", false, true)).toBe("settled");
    expect(ringShownPct("settled", 40)).toBe(40);
  });

  it("armed has no transition, so the empty arc is its first paint", () => {
    expect(ringTransitionClass("armed")).toBe("");
  });
});
