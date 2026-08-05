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
        "flex flex-wrap items-center justify-between gap-3 border-t border-sk-border-secondary pt-4",
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
 * Mode B. Sits at the **top** of the quiz: back, a progress track and the
 * question counter.
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
    <div className={cn("flex items-center gap-4", className)}>
      <button
        type="button"
        onClick={onBack}
        disabled={!onBack}
        aria-label="Previous question"
        className={cn(
          "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md",
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sk-border-brand",
          onBack
            ? "text-sk-text-secondary hover:bg-sk-bg-secondary"
            : "cursor-not-allowed text-sk-fg-quaternary",
        )}
      >
        <Icon icon={ChevronLeft} size={20} />
      </button>

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

      <span className="sk-text-xs-semibold shrink-0 text-sk-text-primary">
        Question {current} of {total}
      </span>
    </div>
  );
}
