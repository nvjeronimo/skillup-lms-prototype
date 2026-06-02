import * as React from "react";
import { cn } from "@/lib/utils";

export interface OverallProgressProps {
  pct: number;
  moduleCurrent: number;
  moduleTotal: number;
  device?: "Desktop" | "Mobile";
  className?: string;
}

/** Course progress. Desktop = bar + label; Mobile = compact ring with center %. */
export function OverallProgress({
  pct,
  moduleCurrent,
  moduleTotal,
  device = "Desktop",
  className,
}: OverallProgressProps) {
  const clamped = Math.max(0, Math.min(100, pct));

  if (device === "Mobile") {
    const radius = 18;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (clamped / 100) * circumference;
    return (
      <div
        className={cn("relative inline-flex h-[46px] w-[46px] items-center justify-center", className)}
        role="img"
        aria-label={`${clamped}% complete`}
      >
        <svg className="h-[46px] w-[46px] -rotate-90" viewBox="0 0 46 46">
          <circle cx="23" cy="23" r={radius} fill="none" stroke="var(--lms-bg-tertiary)" strokeWidth="4" />
          <circle
            cx="23"
            cy="23"
            r={radius}
            fill="none"
            stroke="var(--lms-fg-progress)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <span className="lms-text-2xs-semibold absolute text-lms-text-primary">{clamped}%</span>
      </div>
    );
  }

  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between">
        <span className="lms-text-2xs-medium text-lms-text-tertiary">Overall progress</span>
        <span className="lms-text-xs-semibold text-lms-text-primary">{clamped}%</span>
      </div>
      <div
        className="mt-2 h-2 w-full overflow-hidden rounded-full bg-lms-bg-tertiary"
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Overall progress, ${clamped}%, module ${moduleCurrent} of ${moduleTotal}`}
      >
        <div className="h-full rounded-full bg-lms-fg-progress" style={{ width: `${clamped}%` }} />
      </div>
    </div>
  );
}
