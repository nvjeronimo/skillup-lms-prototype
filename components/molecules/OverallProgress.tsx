import * as React from "react";
import { cn } from "@/lib/utils";

export interface OverallProgressProps {
  pct: number;
  moduleCurrent: number;
  moduleTotal: number;
  device?: "Desktop" | "Mobile";
  className?: string;
}

/**
 * 46×46 progress ring with the percentage in its centre. The arc is blue while
 * in progress and turns green once complete (DS `LMS / Progress Circle` ·
 * Completed). Its ends are square (butt), matching the DS ring.
 */
function ProgressRing({ pct, className }: { pct: number; className?: string }) {
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;
  const complete = pct >= 100;
  return (
    <div
      className={cn(
        "relative inline-flex h-[46px] w-[46px] shrink-0 items-center justify-center",
        className,
      )}
      role="img"
      aria-label={`${pct}% complete`}
    >
      <svg className="h-[46px] w-[46px] -rotate-90" viewBox="0 0 46 46">
        <circle cx="23" cy="23" r={radius} fill="none" stroke="var(--sk-bg-tertiary)" strokeWidth="4" />
        <circle
          cx="23"
          cy="23"
          r={radius}
          fill="none"
          stroke={complete ? "var(--sk-fg-progress-complete)" : "var(--sk-fg-progress)"}
          strokeWidth="4"
          strokeLinecap="butt"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <span className="sk-text-xs-semibold absolute text-sk-text-primary">{pct}%</span>
    </div>
  );
}

/**
 * Course progress. Mobile = the compact ring alone. Desktop (V2) = an eyebrow
 * plus a "Module X of Y" subline on the left and the ring with its centre %
 * on the right, framed by top/bottom hairlines. Matches the DS
 * `LMS / Overall Progress` component (Device=Desktop-V2).
 */
export function OverallProgress({
  pct,
  moduleCurrent,
  moduleTotal,
  device = "Desktop",
  className,
}: OverallProgressProps) {
  const clamped = Math.max(0, Math.min(100, pct));

  if (device === "Mobile") {
    return <ProgressRing pct={clamped} className={className} />;
  }

  return (
    <div
      className={cn(
        "flex items-center gap-1 border-y border-sk-border-secondary px-4 py-2",
        className,
      )}
    >
      <div className="flex min-w-0 flex-1 flex-col justify-center">
        <span className="sk-text-xs-medium uppercase text-sk-text-tertiary">Overall progress</span>
        <span className="sk-text-xs-medium truncate text-sk-text-primary">
          Module {moduleCurrent} of {moduleTotal}
        </span>
      </div>
      <ProgressRing pct={clamped} />
    </div>
  );
}
