"use client";

import * as React from "react";
import { useLmsStore } from "./store";

export type Breakpoint = "mobile" | "tablet" | "desktop";

/**
 * Responsive breakpoint per prototype-flows.md:
 *   mobile:  ≤ 768
 *   tablet:  769–1024
 *   desktop: ≥ 1025
 *
 * The responsive-mode switcher can force a breakpoint via `deviceMode`; when set
 * to anything other than "auto" the forced value wins (window size is ignored).
 */
function widthBreakpoint(): Breakpoint {
  const w = window.innerWidth;
  if (w <= 768) return "mobile";
  if (w <= 1024) return "tablet";
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
