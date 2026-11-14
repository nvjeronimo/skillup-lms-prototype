import * as React from "react";
import { ArrowLeft, ArrowRight, ChevronLeft } from "lucide-react";
import { Icon } from "@/lib/icons";
import { Button } from "@/components/atoms/Button";
import { cn } from "@/lib/utils";
import styles from "./QuizNav.module.css";

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
      className={cn(styles.stacked, className)}
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
    <div className={cn(styles.stepper, className)}>
      <div className={styles.bar}>
        {/* A link button (Link Button Brand/Secondary): visible "Back"
            label, 20px chevron in icon/faint, no box. Disabled follows the
            Link Button Disabled state (text/disabled). */}
        <button
          type="button"
          onClick={onBack}
          disabled={!onBack}
          className={cn(
            "sk-text-body-medium-semibold",
            styles.back,
            onBack ? styles.backEnabled : styles.backDisabled,
          )}
        >
          <Icon icon={ChevronLeft} size={20} className={onBack ? styles.backIcon : undefined} />
          Back
        </button>

        {/* Progress bar, Label=Top: the counter sits 8px above the track,
            right-aligned. Fill bg/info, square ends; it grows by scaleX from the
            left edge (short4, standard), and jumps under reduced motion. The track stays bg/muted:
            DS track bg/strong fails 1.4.11 against bg/info (2.26:1 light,
            2.82:1 dark), and the bar is the only place the answered share
            shows. */}
        <div className={styles.progress}>
          <span className={`sk-text-body-small-medium ${styles.counter}`}>
            Question {current} of {total}
          </span>
          <div
            className={styles.track}
            role="progressbar"
            aria-valuenow={value}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Quiz progress: ${value}% complete`}
          >
            <div
              className={styles.fill}
              style={{ transform: `scaleX(${value / 100})` }}
            />
          </div>
        </div>
      </div>

      <div className={styles.rule} />
    </div>
  );
}
