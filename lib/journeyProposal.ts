"use client";

import * as React from "react";

/**
 * The Course Journey proposal (Impeccable critique of the ICP sidebar, 24 Oct 2026; Nelson: "a
 * separate page with the fixes, for my analysis"). Off by default: the player keeps the current
 * sidebar. `?journey=proposal` turns it on for the browser tab (sessionStorage), `?journey=current`
 * turns it off again; /lab/course-journey links both ways.
 */
const KEY = "sk-journey-proposal";
const EVENT = "sk-journey-proposal";

function read(): boolean {
  try {
    const q = new URLSearchParams(window.location.search).get("journey");
    if (q === "proposal") window.sessionStorage.setItem(KEY, "1");
    else if (q === "current") window.sessionStorage.removeItem(KEY);
    return window.sessionStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}

export function setJourneyProposal(on: boolean) {
  try {
    if (on) window.sessionStorage.setItem(KEY, "1");
    else window.sessionStorage.removeItem(KEY);
  } catch {
    /* private mode: the flag lasts for this page only */
  }
  window.dispatchEvent(new Event(EVENT));
}

/** False on the server and the first paint, then the tab's choice (no hydration mismatch). */
export function useJourneyProposal(): boolean {
  const [on, setOn] = React.useState(false);
  React.useEffect(() => {
    setOn(read());
    const sync = () => setOn(read());
    window.addEventListener(EVENT, sync);
    return () => window.removeEventListener(EVENT, sync);
  }, []);
  return on;
}
