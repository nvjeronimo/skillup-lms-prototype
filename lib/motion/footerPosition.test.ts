import { beforeEach, describe, expect, it } from "vitest";
import { fadesOnMount, forgetFooterPosition, rememberFooterPosition } from "./footerPosition";

describe("footer position memory", () => {
  beforeEach(() => forgetFooterPosition());

  it("does not fade on the first paint", () => {
    expect(fadesOnMount("a", 3)).toBe(false);
  });
  it("fades a new number in the same course", () => {
    rememberFooterPosition("a", 3);
    expect(fadesOnMount("a", 4)).toBe(true);
  });
  it("does not fade the same number", () => {
    rememberFooterPosition("a", 3);
    expect(fadesOnMount("a", 3)).toBe(false);
  });
  it("does not fade across courses", () => {
    rememberFooterPosition("a", 5);
    expect(fadesOnMount("b", 2)).toBe(false);
  });
  it("does not fade after the player was left", () => {
    rememberFooterPosition("a", 5);
    forgetFooterPosition();
    expect(fadesOnMount("a", 6)).toBe(false);
  });
});
