"use client";

import * as React from "react";
import { useLmsStore } from "@/lib/store";

/** The panel layout is on (25 Oct 2026): Harbor's patterns after the DreamHost panel, which the
 *  Fluent skin shares (left rail + search in the top bar is also Microsoft 365's shell). */
export function useHarbor(): boolean {
  return useLmsStore((s) => s.skin === "harbor" || s.skin === "fluent");
}

/*
 * The Harbor rail: expanded (icons + names, 240) or collapsed (icons, 72), as the panel's
 * left navigation. One choice for the browser, shared by the top-bar menu button and the rail.
 */
const KEY = "sk-harbor-rail";
const listeners = new Set<() => void>();
let expanded: boolean | null = null;

function read(): boolean {
  if (expanded === null) {
    try {
      expanded = localStorage.getItem(KEY) !== "0";
    } catch {
      expanded = true;
    }
  }
  return expanded;
}

export function toggleHarborRail() {
  expanded = !read();
  try {
    localStorage.setItem(KEY, expanded ? "1" : "0");
  } catch {
    /* storage blocked: the choice lasts for this page */
  }
  listeners.forEach((l) => l());
}

export function useHarborRailExpanded(): boolean {
  return React.useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    read,
    () => true,
  );
}
