"use client";

import * as React from "react";
import { Button } from "@/components/atoms/Button";
import { cn } from "@/lib/utils";

/**
 * DS `LMS / Quiz · Footer Actions`.
 *
 * Belongs to the **problem**, not necessarily to a question: it sits inside a
 * Question Card in the per-question model (mode A-1) and once under the last
 * question in the bucket model (mode A-2), because that is where the problem
 * boundary is.
 *
 * Secondary actions are off by default — turn on only what the state allows.
 */

/** The nine states the platform can put a question in. No others exist. */
export type QuizQuestionState =
  | "Unanswered"
  | "Selected"
  | "Saved"
  | "Last attempt"
  | "Incorrect"
  | "Partially correct"
  | "Correct"
  | "Answer revealed"
  | "Results withheld";

/** Every result state carries a disabled Submit, whatever the attempt count. */
const RESULT_STATES: QuizQuestionState[] = [
  "Correct",
  "Incorrect",
  "Partially correct",
  "Answer revealed",
  "Results withheld",
];

export interface CtaFlags {
  /** Submit is always present; only `disabled` changes. The label never does. */
  submitEnabled: boolean;
  showHint: boolean;
  showSave: boolean;
  /** Save renders as a disabled "Draft saved" confirmation rather than an action. */
  saved: boolean;
  showAnswer: boolean;
  showReset: boolean;
  showReview: boolean;
  /** Mode B chrome — false everywhere in mode A. */
  showNext: boolean;
  showSkip: boolean;
}

/**
 * The CTA matrix, read off the component rather than from memory. A `false`
 * means the control does not exist in that state, which is not the same as
 * being disabled.
 */
const CTA_MATRIX: Record<QuizQuestionState, CtaFlags> = {
  Unanswered: f({ submitEnabled: false, showHint: true, showSave: true, showAnswer: true, showSkip: true }),
  Selected: f({ submitEnabled: true, showHint: true, showSave: true, showAnswer: true, showSkip: true }),
  Saved: f({ submitEnabled: true, showHint: true, showSave: true, saved: true, showAnswer: true, showReset: true, showReview: true, showSkip: true }),
  "Last attempt": f({ submitEnabled: true, showHint: true, showSave: true, saved: true, showAnswer: true, showReset: true }),
  Incorrect: f({ showHint: true, showAnswer: true, showReset: true, showReview: true, showNext: true }),
  "Partially correct": f({ showAnswer: true, showReset: true, showReview: true }),
  // Reset publishes a zero and refunds nothing, so it must never be offered on
  // an answer the learner has already got right.
  Correct: f({ showAnswer: true, showReview: true }),
  "Answer revealed": f({ showReview: true }),
  "Results withheld": f({ showReview: true }),
};

function f(partial: Partial<CtaFlags>): CtaFlags {
  return {
    submitEnabled: false,
    showHint: false,
    showSave: false,
    saved: false,
    showAnswer: false,
    showReset: false,
    showReview: false,
    showNext: false,
    showSkip: false,
    ...partial,
  };
}

export interface CtaContext {
  /** Mode B chrome ships off. */
  mode: "A" | "B";
  /** `show_reset_button` on the problem. Absent = the control does not exist. */
  resetAvailable?: boolean;
  /** `showanswer` permits a reveal. */
  answerAvailable?: boolean;
  /** `force_save_button`, or `rerandomize: always`. */
  saveAvailable?: boolean;
  /** A `<demandhint>` exists in the OLX. */
  hintAvailable?: boolean;
  /** All attempts used, or past due. Submit disabled AND Reset gone. */
  closed?: boolean;
}

/**
 * Resolve the matrix for a state, then subtract whatever the platform does not
 * offer on this quiz. A control the settings do not enable cannot be shown by a
 * state that would otherwise allow it.
 */
export function ctaFlags(state: QuizQuestionState, ctx: CtaContext): CtaFlags {
  const base = CTA_MATRIX[state];
  const closed = Boolean(ctx.closed);

  return {
    // Attempts spent = closed: Submit disabled, and every result state disables
    // it too — display.js does that the moment the response arrives.
    submitEnabled: base.submitEnabled && !closed && !RESULT_STATES.includes(state),
    showHint: base.showHint && Boolean(ctx.hintAvailable),
    showSave: base.showSave && Boolean(ctx.saveAvailable) && !closed,
    saved: base.saved,
    showAnswer: base.showAnswer && Boolean(ctx.answerAvailable),
    showReset: base.showReset && Boolean(ctx.resetAvailable) && !closed,
    showReview: base.showReview,
    // Mode B chrome, off everywhere in mode A.
    showNext: base.showNext && ctx.mode === "B",
    showSkip: base.showSkip && ctx.mode === "B",
  };
}

export interface QuizFooterActionsProps extends Partial<CtaFlags> {
  /** Off hides the whole secondary group; the primary action is unaffected. */
  showSecondaryActions?: boolean;
  /**
   * Off hides the whole Primary action frame — Submit and the attempts line —
   * as the DS `Show Primary action` does. The bucket model has one primary for
   * the whole set.
   */
  showPrimaryAction?: boolean;
  /**
   * DS `Show attempts` (default true). The line still needs both numbers, so
   * unlimited attempts — which the platform prints nothing for — pass none.
   */
  showAttempts?: boolean;
  attemptsUsed?: number;
  maxAttempts?: number;
  onSubmit?: () => void;
  onHint?: () => void;
  onSave?: () => void;
  onShowAnswer?: () => void;
  onReset?: () => void;
  /** Mode B `Next question`. */
  onNext?: () => void;
  /** Mode B `Skip question`. */
  onSkip?: () => void;
  /** Returns focus to the question header, as the platform's review-btn does. */
  reviewTargetId?: string;
  className?: string;
}

export function QuizFooterActions({
  showSecondaryActions = true,
  showPrimaryAction = true,
  submitEnabled = false,
  showHint = false,
  showSkip = false,
  showSave = false,
  saved = false,
  showAnswer = false,
  showReset = false,
  showReview = false,
  showNext = false,
  showAttempts = true,
  attemptsUsed,
  maxAttempts,
  onSubmit,
  onHint,
  onSave,
  onShowAnswer,
  onReset,
  onNext,
  onSkip,
  reviewTargetId,
  className,
}: QuizFooterActionsProps) {
  const secondary = showSecondaryActions;

  return (
    // Secondary actions sit left, the primary right — bottom-aligned, as the
    // DS row is (counter-axis MAX). Both rows wrap with an 8px gap.
    <div className={cn("flex flex-wrap items-end justify-between gap-2", className)}>
      {/* DS order: Hint, Skip question, Save draft / Draft saved, Show answer,
          Next question, Reset. Hint, Show answer, Next question and Reset are
          Link buttons (Link Button_def Brand/Primary); Skip and Save are
          Secondary. */}
      <div className="flex flex-wrap items-center gap-2">
        {secondary && showHint ? (
          <Button hierarchy="link" size="md" onClick={onHint}>
            Hint
          </Button>
        ) : null}

        {/* Mode B chrome — off in mode A. */}
        {secondary && showSkip ? (
          <Button variant="secondary" size="md" onClick={onSkip}>
            Skip question
          </Button>
        ) : null}

        {secondary && showSave ? (
          saved ? (
            // A confirmation, not an action.
            <Button variant="secondary" size="md" disabled>
              Draft saved
            </Button>
          ) : (
            <Button variant="secondary" size="md" onClick={onSave}>
              Save draft
            </Button>
          )
        ) : null}

        {secondary && showAnswer ? (
          <Button hierarchy="link" size="md" onClick={onShowAnswer}>
            Show answer
          </Button>
        ) : null}

        {/* Mode B chrome — off in mode A. */}
        {secondary && showNext ? (
          <Button hierarchy="link" size="md" onClick={onNext}>
            Next question
          </Button>
        ) : null}

        {/* Reset deletes the answer and publishes a zero without refunding the
            attempt. Never relabel it: "Try again" would hide that cost. */}
        {secondary && showReset ? (
          <Button hierarchy="link" size="md" onClick={onReset}>
            Reset
          </Button>
        ) : null}

        {/* The platform's review-btn: visually hidden until focused, so a
            keyboard or screen-reader user has a way back to the question. */}
        {showReview && reviewTargetId ? (
          <a
            href={`#${reviewTargetId}`}
            className={cn(
              "sk-text-body-medium-semibold rounded-md text-sko-text-primary",
              "sr-only focus:not-sr-only focus:px-3 focus:py-2",
              "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sko-border-primary",
            )}
          >
            Review
          </a>
        ) : null}
      </div>

      {/* DS `Primary action`: one row, the attempts line to the LEFT of
          Submit. `Show Primary action` hides the whole frame, line included. */}
      {showPrimaryAction ? (
        <div className="flex items-center justify-end gap-2">
          {/* Unlimited attempts print no line at all — that is the platform's
              behaviour, not a hidden count. */}
          {showAttempts && typeof attemptsUsed === "number" && typeof maxAttempts === "number" ? (
            <span className="sk-text-body-small-medium text-sko-text-subtle">
              You have used {attemptsUsed} of {maxAttempts} attempt{maxAttempts === 1 ? "" : "s"}
            </span>
          ) : null}

          {/* The label is always "Submit". edX toggles `disabled` and nothing
              else — there is no Submitted, no Try again, in any state. */}
          <Button variant="primary" size="md" disabled={!submitEnabled} onClick={onSubmit}>
            Submit
          </Button>
        </div>
      ) : null}
    </div>
  );
}
