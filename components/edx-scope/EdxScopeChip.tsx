"use client";

import * as React from "react";
import { useEdxScope } from "@/lib/edx-scope";

/**
 * The chip that says the Open edX scope is on (?scope=edx), with the way back. Fixed bottom-left,
 * above the page, never over the assistant (bottom-right).
 */
export function EdxScopeChip() {
  const on = useEdxScope();
  if (!on) return null;
  const off = () => {
    const url = new URL(window.location.href);
    url.searchParams.set("scope", "full");
    window.location.assign(url.toString());
  };
  return (
    <div
      role="status"
      className="sk-text-body-small-medium fixed bottom-[calc(16px+env(safe-area-inset-bottom,0px))] left-4 z-[60] flex items-center gap-3 rounded-control border border-sko-border-primary bg-sko-bg-page py-2 pl-3 pr-2 text-sko-text-default shadow-lg"
    >
      <span>Open edX only: what we invented is hidden</span>
      <button
        type="button"
        onClick={off}
        className="sk-text-body-small-semibold min-h-[32px] rounded-control px-2 text-sko-text-primary underline-offset-2 hover:underline"
      >
        Show everything
      </button>
    </div>
  );
}
