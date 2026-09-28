"use client";

import * as React from "react";
import { ArrowLeft, ArrowRight, ChevronLeft } from "lucide-react";
import { Icon } from "@/lib/icons";
import { Button } from "@/components/atoms/Button";
import { cn } from "@/lib/utils";

/**
 * DS `LMS / Quiz · Nav`. Quiz-level navigation, and the one place where the two
 * modes differ in *structure* rather than in switches — which is why this is a
 * variant and the Question Card is not.
 */

export interface QuizNavStackedProps {
  /** Leaves the quiz. The whole quiz is one unit, so there is nowhere else to go. */
  onPrevious?: () => void;
  onNext?: () => void;
  className?: string;
}

/**
 * Mode A. Sits at the **foot** of the quiz, where the platform puts it.
 *
 * Previous/Next move between **units**, and the whole quiz is one unit, so they
 * leave the quiz entirely. They are deliberately not labelled "Previous
 * question" — relabelling them would hand A half of B's improvement and flatten
 * the comparison the two modes exist to make.
 */
export function QuizNavStacked({ onPrevious, onNext, className }: QuizNavStackedProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-3 border-t border-sko-border-subtle pt-4",
        className,
      )}
    >
      <Button variant="secondary" leftIcon={ArrowLeft} onClick={onPrevious}>
        Previous
      </Button>
      <Button variant="secondary" rightIcon={ArrowRight} onClick={onNext}>
        Next
      </Button>
    </div>
  );
}

export interface QuizNavStepperProps {
  /** 1-based position of the question on screen. */
  current: number;
  total: number;
  /** Completion 0–100, derived from submitted answers so it never regresses. */
  pct: number;
  /** Previous **question** — never "leave the quiz"; exiting belongs to the outline. */
  onBack?: () => void;
  className?: string;
}

/**
 * Mode B. Sits at the **top** of the quiz — nested in the Question Card when
 * `showProgress` is on: back, the question counter over a progress track, and
 * a rule under both.
 *
 * Putting it at the top has a useful side effect — mode A's Previous/Next live
 * at the foot and leave the quiz, so the two modes are told apart at a glance
 * rather than by reading labels.
 *
 * The forward action is not here. The bottom of the screen carries the
 * question's own action: Submit, becoming Next question once submitted, and See
 * results on the last question. Retry is not here either — if the primary were
 * Next question, a learner who got it wrong with attempts left would have
 * nowhere to click, so the card owns that.
 */
export function QuizNavStepper({
  current,
  total,
  pct,
  onBack,
  className,
}: QuizNavStepperProps) {
  const value = Math.max(0, Math.min(100, Math.round(pct)));

  return (
    // DS `LMS / Quiz · Stepper Bar`, Mode=With Back only: the bar row, then a
    // 1px border/subtle rule, 12px apart.
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="flex items-end gap-4">
        {/* A link button (Link Button_def Brand/Secondary): visible "Back"
            label, 20px chevron in icon/faint, no box. Disabled follows the
            Link Button_def Disabled state (text/disabled). */}
        <button
          type="button"
          onClick={onBack}
          disabled={!onBack}
          className={cn(
            "sk-text-sm-semibold inline-flex h-5 shrink-0 items-center gap-1 rounded",
            "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sko-border-primary",
            onBack ? "text-sko-text-subtle" : "cursor-not-allowed text-sko-text-disabled",
          )}
        >
          <Icon icon={ChevronLeft} size={20} className={onBack ? "text-sko-icon-faint" : undefined} />
          Back
        </button>

        {/* Progress bar, Label=Top: the counter sits 8px above the track,
            right-aligned. Track bg/strong, fill bg/info, square ends. */}
        <div className="flex min-w-0 flex-1 flex-col items-end gap-2">
          <span className="sk-text-xs-medium text-sko-text-muted">
            Question {current} of {total}
          </span>
          <div
            className="h-2 w-full bg-sko-bg-strong"
            role="progressbar"
            aria-valuenow={value}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Quiz progress: ${value}% complete`}
          >
            <div className="h-full bg-sko-bg-info" style={{ width: `${value}%` }} />
          </div>
        </div>
      </div>

      <div className="h-px bg-sko-border-subtle" />
    </div>
  );
}
