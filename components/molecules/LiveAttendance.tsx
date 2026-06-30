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
      <span className="inline-flex items-center gap-1.5 rounded-full bg-sk-bg-error-primary px-2 py-0.5">
        <span className="h-2 w-2 rounded-full bg-sk-bg-error-solid" aria-hidden />
        <span className="sk-text-xs-semibold text-sk-text-error-primary">LIVE</span>
      </span>
      <span className="sk-text-xs-regular text-sk-text-secondary">
        {live} of {total} participants
      </span>
      {recording ? (
        <span className="sk-text-2xs-medium rounded bg-sk-bg-secondary px-1.5 py-0.5 text-sk-text-tertiary">
          Recording
        </span>
      ) : null}
    </div>
  );
}
