import { describe, expect, it } from "vitest";
import { withoutRestart, wantsRestart } from "./url";

describe("the test link", () => {
  it.each(["?first-steps=restart", "?tab=courses&first-steps=restart", "?first-steps=RESTART"])("restarts on %s", (s) =>
    expect(wantsRestart(s)).toBe(true),
  );
  it.each(["", "?", "?first-steps=1", "?first-steps", "?tab=courses", "?x=first-steps=restart"])("does nothing on %j", (s) =>
    expect(wantsRestart(s)).toBe(false),
  );
  it("drops only its own parameter from the address", () => {
    expect(withoutRestart("/platform/dashboard", "?first-steps=restart")).toBe("/platform/dashboard");
    expect(withoutRestart("/platform/my-learning", "?tab=courses&first-steps=restart")).toBe("/platform/my-learning?tab=courses");
  });
});
