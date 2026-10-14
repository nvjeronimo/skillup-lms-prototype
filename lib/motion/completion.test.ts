import { describe, expect, it } from "vitest";
import { isFreshCompletion } from "./completion";

describe("isFreshCompletion", () => {
  const last = { topicId: "t1", at: 10_000 };

  it("is fresh at the moment of completion", () =>
    expect(isFreshCompletion(last, "t1", 10_000)).toBe(true));
  it("is still fresh just inside the window", () =>
    expect(isFreshCompletion(last, "t1", 11_499)).toBe(true));
  it("is no longer fresh once the window has passed (no replay on navigation)", () =>
    expect(isFreshCompletion(last, "t1", 11_500)).toBe(false));
  it("is never fresh for another topic", () =>
    expect(isFreshCompletion(last, "t2", 10_000)).toBe(false));
  it("is never fresh when nothing has been completed", () =>
    expect(isFreshCompletion(null, "t1", 10_000)).toBe(false));
});
