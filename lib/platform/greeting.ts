"use client";

import * as React from "react";

/**
 * The Dashboard greeting follows the learner's local time (Nelson, 26 Oct 2026): "Good morning,"
 * from 05:00, "Good afternoon," from 12:00, "Good evening," from 18:00 until 05:00.
 *
 * The hour is the browser's, never the server's: a server in UTC would greet a learner in
 * Lisbon or Bangalore at the wrong time. So the server renders the neutral "Hello," and the
 * browser swaps in the right one on hydration (useSyncExternalStore re-renders with the client
 * snapshot, no hydration error). The greeting sits under the page's arrival fade, so the swap
 * is not seen. It is checked again when the tab comes back to the front, so a page left open
 * overnight says the right thing in the morning.
 *
 * For the LMS: the same rule, on the learner's browser time; Open edX's `time_zone` user
 * preference is only a fallback (most learners never set it). LMS-HANDOFF/greeting-by-time.md.
 */

export type Salutation = "Good morning," | "Good afternoon," | "Good evening," | "Hello,";

/** The salutation for an hour of the day, 0–23. */
export function salutationFor(hour: number): Exclude<Salutation, "Hello,"> {
  if (hour >= 5 && hour < 12) return "Good morning,";
  if (hour >= 12 && hour < 18) return "Good afternoon,";
  return "Good evening,";
}

const subscribe = (onChange: () => void) => {
  document.addEventListener("visibilitychange", onChange);
  return () => document.removeEventListener("visibilitychange", onChange);
};

/** The salutation for now, in the learner's time zone; "Hello," on the server. */
export function useSalutation(): Salutation {
  return React.useSyncExternalStore(
    subscribe,
    () => salutationFor(new Date().getHours()),
    () => "Hello,",
  );
}
