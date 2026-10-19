import * as React from "react";
import { cn } from "@/lib/utils";

export interface LiveAttendanceProps {
  live: number;
  total: number;
  recording?: boolean;
  className?: string;
}

/** Live session attendance indicator: X of Y live + recording status. */
export function LiveAttendance({ live, total, recording = false, className }: LiveAttendanceProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {/* Decision 012: LIVE is green, never red (red is for errors). Badge Soft Success pair; the dot
          pulses (sk-live-dot) and stops under reduced motion, the word stays. */}
      <span className="inline-flex items-center gap-1.5 rounded-full bg-sko-bg-success-soft px-2 py-0.5">
        <span className="sk-live-dot h-2 w-2 rounded-full bg-sko-bg-success" aria-hidden />
        <span className="sk-text-body-small-semibold text-sko-text-success">LIVE</span>
      </span>
      <span className="sk-text-body-small-regular text-sko-text-muted">
        {live} of {total} participants
      </span>
      {recording ? (
        <span className="sk-text-label-small-medium rounded bg-sko-bg-subtle px-1.5 py-0.5 text-sko-text-subtle">
          Recording
        </span>
      ) : null}
    </div>
  );
}
