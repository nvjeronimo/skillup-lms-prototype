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
