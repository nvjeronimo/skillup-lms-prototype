import { describe, expect, it, vi } from "vitest";
import { createObserverRegistry, type ObserverLike } from "./observerRegistry";

function fake() {
  let fire: (entries: { target: Element; isIntersecting: boolean }[]) => void = () => {};
  const observed = new Set<Element>();
  const made = vi.fn();
  const obs: ObserverLike = {
    observe: (el) => observed.add(el),
    unobserve: (el) => observed.delete(el),
    disconnect: () => observed.clear(),
  };
  const make = (cb: typeof fire) => {
    made();
    fire = cb;
    return obs;
  };
  return { make, made, observed, fire: (...e: [Element, boolean][]) => fire(e.map(([target, isIntersecting]) => ({ target, isIntersecting }))) };
}

const el = () => ({}) as Element;

describe("createObserverRegistry", () => {
  it("makes one observer for every element", () => {
    const f = fake();
    const r = createObserverRegistry(f.make);
    r.observe(el(), () => {});
    r.observe(el(), () => {});
    expect(f.made).toHaveBeenCalledTimes(1);
    expect(f.observed.size).toBe(2);
  });

  it("fires once, on the first intersection, with the round's batch", () => {
    const f = fake();
    const r = createObserverRegistry(f.make);
    const a = el();
    const b = el();
    const c = el();
    const ca = vi.fn();
    const cb = vi.fn();
    const cc = vi.fn();
    r.observe(a, ca);
    r.observe(b, cb);
    r.observe(c, cc);
    f.fire([a, true], [b, true], [c, false]);
    expect(ca).toHaveBeenCalledWith([a, b]);
    expect(cb).toHaveBeenCalledWith([a, b]);
    expect(cc).not.toHaveBeenCalled();
    expect(f.observed.has(a)).toBe(false);
    f.fire([a, true]);
    expect(ca).toHaveBeenCalledTimes(1);
  });

  it("several callbacks on one element: one observe, each fires once, each unregisters alone", () => {
    const f = fake();
    const r = createObserverRegistry(f.make);
    const a = el();
    const one = vi.fn();
    const two = vi.fn();
    const three = vi.fn();
    r.observe(a, one);
    const offTwo = r.observe(a, two);
    r.observe(a, three);
    expect(f.observed.size).toBe(1);
    offTwo();
    expect(f.observed.has(a)).toBe(true);
    f.fire([a, true]);
    expect(one).toHaveBeenCalledTimes(1);
    expect(two).not.toHaveBeenCalled();
    expect(three).toHaveBeenCalledTimes(1);
    expect(f.observed.has(a)).toBe(false);
  });

  it("an unregistered element is not called", () => {
    const f = fake();
    const r = createObserverRegistry(f.make);
    const a = el();
    const ca = vi.fn();
    const off = r.observe(a, ca);
    off();
    f.fire([a, true]);
    expect(ca).not.toHaveBeenCalled();
    expect(f.observed.size).toBe(0);
  });

  it("without an observer the element counts as in view at once", () => {
    const r = createObserverRegistry(() => null);
    const a = el();
    const ca = vi.fn();
    r.observe(a, ca);
    expect(ca).toHaveBeenCalledWith([a]);
  });

  it("disconnect drops everything; the next observe makes a new observer", () => {
    const f = fake();
    const r = createObserverRegistry(f.make);
    const a = el();
    const ca = vi.fn();
    r.observe(a, ca);
    r.disconnect();
    f.fire([a, true]);
    expect(ca).not.toHaveBeenCalled();
    r.observe(el(), () => {});
    expect(f.made).toHaveBeenCalledTimes(2);
  });
});
