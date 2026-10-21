"use client";

import * as React from "react";

const KEY = "sk-demo";

/**
 * Demo mode (Nelson, 21 Oct 2026, after the audit): the prototype's own notes and controls —
 * the test-build footer, "Simulate load failure", "Proposal: not designed yet", "Not in MVP",
 * Reset demo, Restart first steps and the player's preview switches — show only with
 * `?demo=1` in the address. It sticks for this browser until `?demo=0`, so a stakeholder demo
 * keeps it across pages and a learner test never sees it.
 */
export function useDemoMode(): boolean {
  const [on, setOn] = React.useState(false);
  React.useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("demo");
    try {
      if (q === "1") window.localStorage.setItem(KEY, "1");
      else if (q === "0") window.localStorage.removeItem(KEY);
      setOn(window.localStorage.getItem(KEY) === "1");
    } catch {
      setOn(q === "1");
    }
  }, []);
  return on;
}

/** Renders its children only in demo mode. */
export function DemoOnly({ children }: { children: React.ReactNode }) {
  return useDemoMode() ? <>{children}</> : null;
}
