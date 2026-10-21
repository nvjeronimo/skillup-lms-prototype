import { describe, expect, it } from "vitest";
import { arrivalAfter, arrivalAtMount, isShown } from "./imageArrival";

describe("arrivalAtMount", () => {
  it("waits for an image that is still loading", () => {
    expect(arrivalAtMount({ complete: false, naturalWidth: 0 })).toBe("pending");
    expect(arrivalAtMount(null)).toBe("pending");
  });
  it("shows a cached (already decoded) image at once, with no fade", () => {
    expect(arrivalAtMount({ complete: true, naturalWidth: 320 })).toBe("instant");
  });
  it("treats a complete image with no width as broken", () => {
    expect(arrivalAtMount({ complete: true, naturalWidth: 0 })).toBe("failed");
  });
});

describe("arrivalAfter", () => {
  it("fades in on load and keeps the placeholder on error", () => {
    expect(arrivalAfter("pending", "load")).toBe("loaded");
    expect(arrivalAfter("pending", "error")).toBe("failed");
  });
  it("leaves an image shown at once as it is on a late load event", () => {
    expect(arrivalAfter("instant", "load")).toBe("instant");
    expect(arrivalAfter("instant", "error")).toBe("failed");
  });
});

describe("isShown", () => {
  it("is visible only once loaded", () => {
    expect(isShown("pending")).toBe(false);
    expect(isShown("failed")).toBe(false);
    expect(isShown("loaded")).toBe(true);
    expect(isShown("instant")).toBe(true);
  });
});
