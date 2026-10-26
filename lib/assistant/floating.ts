"use client";

import * as React from "react";

/**
 * The floating assistant (launcher + chat, until 26 Oct 2026) stays available as a reference:
 * `?assistant=floating` turns it on for the browser tab, `?assistant=bar` turns it off again
 * (sessionStorage). Off by default: the assistant opens from the top bars' search + Assistant.
 */
const KEY = "sk-assistant-floating";

function read(): boolean {
  try {
    const q = new URLSearchParams(window.location.search).get("assistant");
    if (q === "floating") window.sessionStorage.setItem(KEY, "1");
    else if (q === "bar") window.sessionStorage.removeItem(KEY);
    return window.sessionStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}

/** False on the server and the first paint, then the tab's choice. */
export function useFloatingAssistant(): boolean {
  const [on, setOn] = React.useState(false);
  React.useEffect(() => setOn(read()), []);
  return on;
}
