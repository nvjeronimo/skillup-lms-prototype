import * as React from "react";
import { cn } from "@/lib/utils";
import styles from "./LiveAttendance.module.css";

export interface LiveAttendanceProps {
  live: number;
  total: number;
  recording?: boolean;
  className?: string;
}

/** Live session attendance indicator: X of Y live + recording status. */
export function LiveAttendance({ live, total, recording = false, className }: LiveAttendanceProps) {
  return (
    <div className={cn(styles.row, className)}>
      {/* Decision 012: LIVE is green, never red (red is for errors). Badge Soft Success pair; the dot
          pulses (sk-live-dot) and stops under reduced motion, the word stays. */}
      <span className={styles.live}>
        <span className={`sk-live-dot ${styles.dot}`} aria-hidden />
        <span className={`sk-text-body-small-semibold ${styles.liveLabel}`}>LIVE</span>
      </span>
      <span className={`sk-text-body-small-regular ${styles.count}`}>
        {live} of {total} participants
      </span>
      {recording ? (
        <span className={`sk-text-label-small-medium ${styles.recording}`}>
          Recording
        </span>
      ) : null}
    </div>
  );
}
