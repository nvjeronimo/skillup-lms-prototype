import { describe, expect, it } from "vitest";
import { createRateLimiter } from "./rate-limit";

describe("createRateLimiter", () => {
  it("allows the limit, refuses the next, and forgets after the window", () => {
    let t = 0;
    const allow = createRateLimiter({ limit: 2, windowMs: 1000, now: () => t });
    expect([allow("a"), allow("a"), allow("a")]).toEqual([true, true, false]);
    expect(allow("b")).toBe(true);
    t = 1001;
    expect(allow("a")).toBe(true);
  });
});
