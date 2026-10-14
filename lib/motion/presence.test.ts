import { afterEach, describe, expect, it, vi } from "vitest";
import { armExitFallback, isOwnAnimationEnd, nextPresence } from "./presence";

describe("nextPresence", () => {
  it("mounts and opens", () => expect(nextPresence("unmounted", "open")).toBe("open"));
  it("starts closing when open", () => expect(nextPresence("open", "close")).toBe("closing"));
  it("unmounts when the exit finishes", () =>
    expect(nextPresence("closing", "exited")).toBe("unmounted"));
  it("reopens during an exit", () => expect(nextPresence("closing", "open")).toBe("open"));
  it("ignores close when already unmounted", () =>
    expect(nextPresence("unmounted", "close")).toBe("unmounted"));
  it("ignores a stray animationend from an entrance", () =>
    expect(nextPresence("open", "exited")).toBe("open"));
});

describe("armExitFallback", () => {
  afterEach(() => vi.useRealTimers());

  it("fires once after exitMs + 50, not before", () => {
    vi.useFakeTimers();
    const onExited = vi.fn();
    armExitFallback("closing", 200, onExited);
    vi.advanceTimersByTime(249);
    expect(onExited).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(onExited).toHaveBeenCalledTimes(1);
    vi.advanceTimersByTime(1000);
    expect(onExited).toHaveBeenCalledTimes(1);
  });

  it("does not arm when open or unmounted", () => {
    vi.useFakeTimers();
    const onExited = vi.fn();
    armExitFallback("open", 200, onExited);
    armExitFallback("unmounted", 200, onExited);
    vi.advanceTimersByTime(1000);
    expect(onExited).not.toHaveBeenCalled();
  });

  it("cancel prevents firing", () => {
    vi.useFakeTimers();
    const onExited = vi.fn();
    const cancel = armExitFallback("closing", 200, onExited);
    cancel();
    vi.advanceTimersByTime(1000);
    expect(onExited).not.toHaveBeenCalled();
  });
});

describe("isOwnAnimationEnd", () => {
  it("is true for the element itself and false for a child", () => {
    const root = new EventTarget();
    const child = new EventTarget();
    expect(isOwnAnimationEnd(root, root)).toBe(true);
    expect(isOwnAnimationEnd(child, root)).toBe(false);
  });
});
