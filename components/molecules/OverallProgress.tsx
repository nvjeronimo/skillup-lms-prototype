"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { ArrivalCountFrom } from "@/components/atoms/ArrivalCount";
import { useArrivalRing } from "@/lib/arrival/useArrival";
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
 * Completed). Its ends are square (butt), matching the DS ring. The DS arc has
 * innerRadius 0.8 on a 46px ellipse: a 4.6px band from r=18.4 to r=23, so the
 * stroke is centred on r=20.7.
 */
export function ProgressRing({
  pct,
  compact = false,
  className,
}: {
  pct: number;
  /**
   * 32px ring for the mobile topbar: DS Progress circle Size=xxxxs (Nelson, 21 Oct 2026; was 28
   * since 14 Oct). The percentage shows inside in body-small/Semibold, the DS's smallest style
   * (Nelson, 21 Oct). Completed shows the green arc with a check instead of 100%.
   */
  compact?: boolean;
  className?: string;
}) {
  // DS Progress circle: xxxxs 32 with a 3px band, xxxs 46 with a 4px band, stroke centred.
  const box = compact ? 32 : 46;
  const band = compact ? 3 : 4;
  const radius = box / 2 - band / 2;
  const circumference = 2 * Math.PI * radius;
  // On a first visit the arc sweeps from empty when it shows (motion-matrix §7.9); after that
  // only the completion chain moves it (useArrivalRing keeps the two apart).
  const ring = useArrivalRing<HTMLDivElement>(pct);
  const offset = circumference - (ring.shown / 100) * circumference;
  const complete = pct >= 100;
  return (
    <div
      ref={ring.ref}
      className={cn("relative inline-flex shrink-0 items-center justify-center", className)}
      style={{ width: box, height: box }}
      role="img"
      aria-label={compact ? (complete ? "Course completed" : `Course progress, ${pct}%`) : `${pct}% complete`}
    >
      <svg className="-rotate-90" width={box} height={box} viewBox={`0 0 ${box} ${box}`} aria-hidden>
        <circle cx={box / 2} cy={box / 2} r={radius} fill="none" stroke="var(--color-bg-track)" strokeWidth={band} />
        <circle
          cx={box / 2}
          cy={box / 2}
          r={radius}
          fill="none"
          stroke={complete ? "var(--color-icon-success-strong)" : "var(--color-bg-info)"}
          strokeWidth={band}
          strokeLinecap="butt"
          // The last beat of the completion chain: the arc advances 200ms after the badge pops.
          // A transition runs only on change, so the first paint does not animate; reduced
          // motion leaves stroke-dashoffset out of the transitioned properties, so it jumps.
          // The first-visit sweep uses the same transition without the delay.
          className={ring.transition}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      {compact && complete ? (
        <Check size={14} strokeWidth={2} className="absolute text-sko-icon-success-strong" aria-hidden />
      ) : (
        <span className="sk-text-body-small-semibold absolute text-sko-text-default">
          <ArrivalCountFrom value={`${pct}%`} trigger={ring.trigger} />
        </span>
      )}
    </div>
  );
}

/**
 * Course progress. Mobile = the compact ring alone. Desktop (V2) = an eyebrow
 * plus a "Module X of Y" subline on the left and the ring with its centre %
 * on the right, 0/16/8/16 padding under the Course Header and a bottom
 * hairline. Matches the DS `LMS / Overall Progress` component (Device=Desktop).
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
        "flex items-center gap-1 border-b border-sko-border-subtle px-4 pb-2 pt-0",
        className,
      )}
    >
      <div className="flex min-w-0 flex-1 flex-col justify-center">
        <span className="sk-text-body-small-medium uppercase text-sko-text-subtle">Overall progress</span>
        <span className="sk-text-body-small-medium truncate text-sko-text-default">
          Module {moduleCurrent} of {moduleTotal}
        </span>
      </div>
      <ProgressRing pct={clamped} />
    </div>
  );
}
