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
      <span className="inline-flex items-center gap-1.5 rounded-full bg-lms-bg-error-primary px-2 py-0.5">
        <span className="h-2 w-2 rounded-full bg-lms-text-error-primary" aria-hidden />
        <span className="lms-text-xs-semibold text-lms-text-error-primary">LIVE</span>
      </span>
      <span className="lms-text-xs-regular text-lms-text-secondary">
        {live} of {total} participants
      </span>
      {recording ? (
        <span className="lms-text-2xs-medium rounded bg-lms-bg-secondary px-1.5 py-0.5 text-lms-text-tertiary">
          Recording
        </span>
      ) : null}
    </div>
  );
}
