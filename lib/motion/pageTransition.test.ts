import { describe, expect, it } from "vitest";
import { shouldTransitionClick, type AnchorLike, type ClickLike } from "./pageTransition";

const click = (over: Partial<ClickLike> = {}): ClickLike => ({
  button: 0,
  metaKey: false,
  ctrlKey: false,
  shiftKey: false,
  altKey: false,
  defaultPrevented: false,
  ...over,
});

const anchor = (href: string, attrs: Record<string, string> = {}, target = ""): AnchorLike => ({
  href,
  target,
  hasAttribute: (n) => n in attrs,
  getAttribute: (n) => attrs[n] ?? null,
});

const here = { origin: "https://lms.test", pathname: "/platform/dashboard" };

describe("shouldTransitionClick", () => {
  it("takes a plain click to another page of the site", () => {
    expect(shouldTransitionClick(click(), anchor("https://lms.test/platform/my-learning"), here)).toBe(true);
  });

  it("leaves a link that only changes the query or the hash", () => {
    expect(shouldTransitionClick(click(), anchor("https://lms.test/platform/dashboard?tab=2"), here)).toBe(false);
    expect(shouldTransitionClick(click(), anchor("https://lms.test/platform/dashboard#main"), here)).toBe(false);
  });

  it("leaves other sites, new tabs, downloads and opted-out links", () => {
    expect(shouldTransitionClick(click(), anchor("https://example.com/x"), here)).toBe(false);
    expect(shouldTransitionClick(click(), anchor("https://lms.test/a", {}, "_blank"), here)).toBe(false);
    expect(shouldTransitionClick(click(), anchor("https://lms.test/a", { download: "" }), here)).toBe(false);
    expect(shouldTransitionClick(click(), anchor("https://lms.test/a", { "data-page-transition": "off" }), here)).toBe(false);
  });

  it("leaves modified, non-left and already handled clicks", () => {
    const to = anchor("https://lms.test/platform/my-learning");
    expect(shouldTransitionClick(click({ metaKey: true }), to, here)).toBe(false);
    expect(shouldTransitionClick(click({ ctrlKey: true }), to, here)).toBe(false);
    expect(shouldTransitionClick(click({ shiftKey: true }), to, here)).toBe(false);
    expect(shouldTransitionClick(click({ altKey: true }), to, here)).toBe(false);
    expect(shouldTransitionClick(click({ button: 1 }), to, here)).toBe(false);
    expect(shouldTransitionClick(click({ defaultPrevented: true }), to, here)).toBe(false);
  });

  it("leaves an href it cannot read", () => {
    expect(shouldTransitionClick(click(), anchor("not a url"), here)).toBe(false);
  });
});
