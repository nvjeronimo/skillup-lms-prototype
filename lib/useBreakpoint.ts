"use client";

import * as React from "react";
import { useLmsStore } from "./store";

export type Breakpoint = "mobile" | "tablet" | "desktop";

/**
 * Responsive breakpoint, on the same edges as the Tailwind md (768) and lg (1024) screens:
 *   mobile:  < 768
 *   tablet:  768–1023
 *   desktop: ≥ 1024
 * prototype-flows.md said ≤ 768 / ≤ 1024, so at exactly 768 the CSS drew the tablet page while
 * this hook still mounted the phone tab bar over it (Nelson, 3 Nov 2026).
 *
 * The responsive-mode switcher can force a breakpoint via `deviceMode`; when set
 * to anything other than "auto" the forced value wins (window size is ignored).
 */
function widthBreakpoint(): Breakpoint {
  const w = window.innerWidth;
  if (w < 768) return "mobile";
  if (w < 1024) return "tablet";
  return "desktop";
}

function subscribe(onChange: () => void) {
  window.addEventListener("resize", onChange);
  return () => window.removeEventListener("resize", onChange);
}

/*
 * useSyncExternalStore, not state + effect: on a client navigation the first render already has
 * the right breakpoint, and after a server render React re-renders before the first paint. With
 * the old effect a phone painted the desktop player first (sidebar open, content ~30px wide) and
 * then jumped (audit of 21 Oct 2026).
 */
export function useBreakpoint(): Breakpoint {
  const deviceMode = useLmsStore((s) => s.deviceMode);
  const bp = React.useSyncExternalStore<Breakpoint>(subscribe, widthBreakpoint, () => "desktop");
  return deviceMode === "auto" ? bp : deviceMode;
}
