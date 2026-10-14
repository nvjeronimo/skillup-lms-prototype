/** Where a surface is in its life: not in the DOM, shown, or playing its exit animation. */
export type Presence = "unmounted" | "open" | "closing";

export type PresenceEvent = "open" | "close" | "exited";

/**
 * Pure transition table behind `useExitTransition`.
 * - `open` always shows (also cancels a running exit).
 * - `close` only starts an exit from `open`.
 * - `exited` only unmounts from `closing`; a stray animationend while open is ignored.
 */
export function nextPresence(p: Presence, e: PresenceEvent): Presence {
  switch (e) {
    case "open":
      return "open";
    case "close":
      return p === "open" ? "closing" : p;
    case "exited":
      return p === "closing" ? "unmounted" : p;
  }
}

/**
 * What the surface renders, from the `open` prop and the presence state. `open` wins on the
 * render where it changes, before the effect has moved presence: the surface is in the DOM on
 * the very render that opens it (so a dialog hook finds its element) and starts its exit on the
 * very render that closes it.
 */
export function presenceView(
  open: boolean,
  presence: Presence,
): { mounted: boolean; state: "open" | "closed" } {
  return { mounted: open || presence !== "unmounted", state: open ? "open" : "closed" };
}

/** Slack after the exit duration before the timer unmounts a surface whose animationend never came. */
const FALLBACK_SLACK_MS = 50;

type Timers = {
  set: (fn: () => void, ms: number) => unknown;
  clear: (id: never) => void;
};

/**
 * Arms the unmount fallback: only while `closing`, calls `onExited` once after
 * `exitMs + 50`. Returns a cancel function (safe to call any time, also when unarmed).
 */
export function armExitFallback(
  presence: Presence,
  exitMs: number,
  onExited: () => void,
  timers: Timers = { set: (fn, ms) => setTimeout(fn, ms), clear: (id) => clearTimeout(id) },
): () => void {
  if (presence !== "closing") return () => {};
  const id = timers.set(onExited, exitMs + FALLBACK_SLACK_MS);
  return () => timers.clear(id as never);
}

/** True when an animationend came from the element itself, not a child bubbling up. */
export function isOwnAnimationEnd(
  target: EventTarget | null,
  currentTarget: EventTarget | null,
): boolean {
  return target === currentTarget;
}
