/**
 * One IntersectionObserver per page for the arrival (motion-matrix §7.9, review M2): the
 * cascade's sections and every counter, bar and ring register here instead of each making
 * its own observer. Each element has one callback (a WeakMap), fired once, on the first round
 * it intersects, with every element that came into view in that round (the cascade ranks a
 * batch by it); the element is unobserved before its callback runs.
 * The observer is made on the first `observe` (never on the server) by `make`, so tests pass
 * a fake.
 */
export type InViewCallback = (batch: Element[]) => void;

export type ObserverLike = {
  observe(el: Element): void;
  unobserve(el: Element): void;
  disconnect(): void;
};

export type ObserverRegistry = {
  /** Calls `cb` once when `el` first intersects; returns the unregister. */
  observe(el: Element, cb: InViewCallback): () => void;
  /** Drops every registration and the observer (the page is leaving). */
  disconnect(): void;
};

export function createObserverRegistry(
  make: (onEntries: (entries: { target: Element; isIntersecting: boolean }[]) => void) => ObserverLike | null,
): ObserverRegistry {
  let callbacks = new WeakMap<Element, InViewCallback>();
  let observer: ObserverLike | null | undefined;

  const onEntries = (entries: { target: Element; isIntersecting: boolean }[]) => {
    const batch = entries.filter((e) => e.isIntersecting && callbacks.has(e.target)).map((e) => e.target);
    const due = batch.map((el) => [el, callbacks.get(el)!] as const);
    due.forEach(([el]) => {
      callbacks.delete(el);
      observer?.unobserve(el);
    });
    due.forEach(([, cb]) => cb(batch));
  };

  return {
    observe(el, cb) {
      if (observer === undefined) observer = make(onEntries);
      // No observer (no IntersectionObserver): the element counts as in view now.
      if (!observer) {
        cb([el]);
        return () => {};
      }
      callbacks.set(el, cb);
      observer.observe(el);
      return () => {
        if (callbacks.get(el) !== cb) return;
        callbacks.delete(el);
        observer?.unobserve(el);
      };
    },
    disconnect() {
      observer?.disconnect();
      observer = undefined;
      callbacks = new WeakMap();
    },
  };
}

/** The browser's observer on the viewport, or null where there is none. */
export function viewportObserver(
  onEntries: (entries: { target: Element; isIntersecting: boolean }[]) => void,
): ObserverLike | null {
  if (typeof IntersectionObserver === "undefined") return null;
  return new IntersectionObserver((entries) => onEntries(entries));
}
