import * as React from "react";
import { cn } from "@/lib/utils";

export interface QuizProgressBarProps {
  /** 1-based position of the step being viewed. */
  current: number;
  total: number;
  /**
   * Completion 0–100. Derived from answered/total rather than position, so
   * stepping back to review an earlier question never shrinks the bar.
   */
  pct: number;
  className?: string;
}

/**
 * DS `LMS / Quiz · Progress` — variant `Quiz · Progress Bar` (node 20464-4849).
 *
 * Replaces the per-question dot rail: the workshop found a dot-per-question
 * with correct/incorrect state to be noise on a long quiz, and asked for
 * "question X of Y" plus a bar. Position is stated, progress is drawn.
 *
 * Square bar ends (`Radius/fixed-none`), matching the progress ring's butt cap.
 */
export function QuizProgressBar({ current, total, pct, className }: QuizProgressBarProps) {
  const value = Math.max(0, Math.min(100, Math.round(pct)));

  return (
    <div className={cn("flex items-center gap-4", className)}>
      <span className="sk-text-xs-semibold shrink-0 text-sk-text-secondary">
        Question {current} of {total}
      </span>

      <div
        className="h-2 min-w-0 flex-1 bg-sk-bg-tertiary"
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Quiz progress: ${value}% complete`}
      >
        <div className="h-full bg-sk-fg-progress" style={{ width: `${value}%` }} />
      </div>

      <span className="sk-text-xs-semibold shrink-0 text-sk-text-primary">{value}%</span>
    </div>
  );
}
