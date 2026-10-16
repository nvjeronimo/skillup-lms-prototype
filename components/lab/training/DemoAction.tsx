"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * A control whose destination does not exist in the lab. It stays a real button (keyboard, focus, 44px),
 * and says so when used instead of pretending with href="#".
 */
export function DemoAction({ className, children }: { className?: string; children: React.ReactNode }) {
  const [said, setSaid] = React.useState(false);
  return (
    <span className="inline-flex flex-col items-start gap-1">
      <button type="button" className={cn(className)} onClick={() => setSaid(true)}>
        {children}
      </button>
      <span role="status" className="tb-meta tb-c-ink2">
        {said ? "Lab demo — this action isn't wired yet." : ""}
      </span>
    </span>
  );
}
