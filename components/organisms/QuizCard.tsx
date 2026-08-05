"use client";

import * as React from "react";
import { Check, X, Lightbulb, ArrowRight, RotateCcw } from "lucide-react";
import { Icon } from "@/lib/icons";
import { Button } from "@/components/atoms/Button";
import { InlineAlert } from "@/components/atoms/InlineAlert";
import { cn } from "@/lib/utils";
import type { QuizOption } from "@/lib/content";

export type QuizState = "Question" | "Revealed";

export interface QuizCardProps {
  state?: QuizState;
  question?: string;
  options?: QuizOption[];
  /** Answer cardinality — single-select shows radios, multi-select checkboxes (BR-3). */
  multiSelect?: boolean;
  explanation?: string;
  reviewTopicTitle?: string;
  onReviewTopic?: () => void;
  /** Chosen option ids. Single-select carries at most one. */
  selectedIds?: string[];
  onToggleOption?: (id: string) => void;
  onSubmit?: () => void;

  /* ---- Mode switches (quizzes/08-two-modes.md §9). Defaults are mode B. ---- */

  /** B: per-question counter + bar. A: no per-question position exists today. */
  progress?: React.ReactNode;
  /** B: why the answer is right or wrong. A: 213 of 215 audited questions have none. */
  showExplanation?: boolean;
  /** A: the repeated "Choose the correct option(s)" and the points line. */
  showPlatformPrompt?: boolean;
  /** Points the platform prints beside its prompt. */
  points?: number;
  /** A: the platform shows Save on graded questions. B saves silently. */
  showSave?: boolean;
  onSave?: () => void;
  saved?: boolean;
  /** Both modes: the platform shows this too. */
  showAttempts?: boolean;
  attemptsUsed?: number;
  maxAttempts?: number;
  /** Warn before the last attempt of the quiz is spent. */
  isLastAttempt?: boolean;

  /**
   * Retry after a wrong answer while attempts remain. Reset wipes the score
   * already earned and never returns the attempt, so this must sit beside the
   * attempts count and never imply a free second go. With a shuffled question
   * the platform refuses a second submit without a Reset first, so this control
   * owns both steps.
   */
  onRetry?: () => void;

  /**
   * Attempts spent, past due, or past the course end date. Disables Submit and
   * removes Reset and Save. The platform never says why; only mode B explains.
   */
  closed?: boolean;
  closedReason?: string;

  /** B only: the bottom of the screen carries the one forward action. */
  onNext?: () => void;
  nextLabel?: string;
  className?: string;
}

const DEFAULT_OPTIONS: QuizOption[] = [
  { id: "a", label: "Reduce process variation and defects", correct: true },
  { id: "b", label: "Increase production speed at any cost" },
  { id: "c", label: "Eliminate all documentation" },
  { id: "d", label: "Replace all staff with automation" },
];

/** The answer marker — DS Checkbox `Type=Radio` (circle) / `Type=Checkbox` (square). */
function OptionMarker({
  multiSelect,
  checked,
  tone,
}: {
  multiSelect?: boolean;
  checked: boolean;
  tone: "default" | "brand" | "success" | "error";
}) {
  const shape = multiSelect ? "rounded-[6px]" : "rounded-full";
  const border =
    tone === "success"
      ? "border-sk-text-success-primary"
      : tone === "error"
        ? "border-sk-text-error-primary"
        : checked
          ? "border-sk-border-brand"
          : "border-sk-border-primary";
  const fill =
    checked && tone === "success"
      ? "bg-sk-bg-success-solid"
      : checked && tone === "error"
        ? "bg-sk-bg-error-solid"
        : checked && tone === "brand"
          ? "bg-sk-bg-brand-solid"
          : "bg-transparent";

  return (
    <span
      aria-hidden
      className={cn(
        "mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center border-2 transition-colors",
        shape,
        border,
        fill,
      )}
    >
      {checked ? (
        multiSelect ? (
          <Icon icon={Check} size={13} className="text-sk-fg-white" />
        ) : (
          // Radio dot
          <span className="h-2 w-2 rounded-full bg-sk-fg-white" />
        )
      ) : null}
    </span>
  );
}

/**
 * A single quiz question. Mirrors the Open edX CAPA problem lifecycle: each
 * question submits and scores independently, with answer-specific feedback and
 * an optional Show-answer/explanation reveal. Position and step controls are
 * passed in as the `progress` and `navigation` bands so the whole step reads as
 * one box; the card never states the position itself.
 */
export function QuizCard({
  state = "Question",
  question = "What is the primary goal of Six Sigma?",
  options = DEFAULT_OPTIONS,
  multiSelect = false,
  explanation,
  reviewTopicTitle,
  onReviewTopic,
  selectedIds = [],
  onToggleOption,
  onSubmit,
  progress,
  showExplanation = true,
  showPlatformPrompt = false,
  points = 1,
  showSave = false,
  onSave,
  saved,
  showAttempts = true,
  attemptsUsed,
  maxAttempts,
  isLastAttempt,
  onRetry,
  closed = false,
  closedReason,
  onNext,
  nextLabel = "Next question",
  className,
}: QuizCardProps) {
  const revealed = state === "Revealed";
  const [showAnswer, setShowAnswer] = React.useState(false);
  const [confirming, setConfirming] = React.useState(false);

  // A new question resets the per-question affordances.
  React.useEffect(() => {
    setShowAnswer(false);
    setConfirming(false);
  }, [question]);

  const chosen = options.filter((o) => selectedIds.includes(o.id));
  // Single: the chosen option is correct. Multi: every correct option is
  // selected and no incorrect one is.
  const isCorrect = multiSelect
    ? options.every((o) => Boolean(o.correct) === selectedIds.includes(o.id)) && selectedIds.length > 0
    : Boolean(chosen[0]?.correct);
  const hasSelection = selectedIds.length > 0;

  return (
    <div
      className={cn(
        "flex flex-col gap-4 rounded-xl border border-sk-border-secondary bg-sk-bg-primary p-5",
        className,
      )}
    >
      {/* Progress band — full-bleed inside the card so it plainly belongs to
          the quiz, like the action buttons below. */}
      {progress ? (
        <div className="-mx-5 -mt-5 border-b border-sk-border-secondary px-5 py-3">
          {progress}
        </div>
      ) : null}

      {/* Mode A reproduces what the platform prints above every question: the
          same generic prompt repeated, with a plural that is wrong for
          single-select, and a points line. Its blandness is the finding. */}
      {showPlatformPrompt ? (
        <div className="flex flex-col gap-0.5">
          <span className="sk-text-md-semibold text-sk-text-primary">
            Choose the correct option(s)
          </span>
          <span className="sk-text-xs-regular text-sk-text-tertiary">
            {points} point{points === 1 ? "" : "s"} possible (graded)
          </span>
        </div>
      ) : null}

      <h3
        className={cn(
          showPlatformPrompt
            ? "sk-text-md-regular text-sk-text-secondary"
            : "sk-text-md-semibold text-sk-text-primary",
        )}
      >
        {question}
      </h3>

      {multiSelect ? (
        <span className="sk-text-2xs-medium -mt-2 uppercase tracking-wide text-sk-text-tertiary">
          Select all that apply
        </span>
      ) : null}

      <ul className="flex flex-col gap-2">
        {options.map((opt) => {
          const isSelected = selectedIds.includes(opt.id);
          // After submitting, only reveal the correct answer once the learner
          // asked for it — otherwise a wrong answer would give the game away.
          const revealCorrect = revealed && Boolean(opt.correct) && (isCorrect || showAnswer);
          const showWrong = revealed && isSelected && !opt.correct;
          const tone: "default" | "brand" | "success" | "error" = revealCorrect
            ? "success"
            : showWrong
              ? "error"
              : isSelected
                ? "brand"
                : "default";
          return (
            <li key={opt.id}>
              <button
                type="button"
                onClick={() => !revealed && onToggleOption?.(opt.id)}
                disabled={revealed}
                role={multiSelect ? "checkbox" : "radio"}
                aria-checked={isSelected}
                className={cn(
                  "sk-text-sm-medium flex w-full items-start gap-2.5 rounded-lg border px-3 py-2.5 text-left transition-colors",
                  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sk-border-brand",
                  revealCorrect
                    ? "border-sk-text-success-primary bg-sk-bg-success-primary text-sk-text-success-primary"
                    : showWrong
                      ? "border-sk-text-error-primary bg-sk-bg-error-primary text-sk-text-error-primary"
                      : isSelected
                        ? "border-sk-border-brand bg-sk-bg-brand-section text-sk-text-brand-secondary"
                        : cn(
                            "border-sk-border-primary text-sk-text-primary",
                            revealed ? "opacity-60" : "hover:bg-sk-bg-secondary",
                          ),
                )}
              >
                <OptionMarker multiSelect={multiSelect} checked={isSelected || revealCorrect} tone={tone} />
                <span className="flex-1">{opt.label}</span>
                {revealCorrect ? <Icon icon={Check} size={16} className="mt-0.5" /> : null}
                {showWrong ? <Icon icon={X} size={16} className="mt-0.5" /> : null}
              </button>
            </li>
          );
        })}
      </ul>

      {/* The verdict shows in both modes — the platform does tell the learner
          correct or incorrect. What mode A withholds is everything after that:
          no per-choice feedback, no explanation. */}
      {revealed ? (
        <div
          className={cn(
            "flex flex-col gap-1 rounded-lg px-3 py-2.5",
            isCorrect ? "bg-sk-bg-success-primary" : "bg-sk-bg-error-primary",
          )}
        >
          <span
            className={cn(
              "sk-text-2xs-medium uppercase tracking-wide",
              isCorrect ? "text-sk-text-success-primary" : "text-sk-text-error-primary",
            )}
          >
            {isCorrect ? "Correct" : "Not quite"}
          </span>
          {/* Mode A stops at the verdict. The learner is told correct or
              incorrect and nothing else, because 213 of 215 audited questions
              carry no feedback — and that absence is the finding, so it must
              not be filled with placeholder prose. */}
          {(showExplanation ? chosen : [])
            .filter((o) => o.feedback)
            .map((o) => (
              <p
                key={o.id}
                className={cn(
                  "sk-text-sm-regular",
                  isCorrect ? "text-sk-text-success-primary" : "text-sk-text-error-primary",
                )}
              >
                {o.feedback}
              </p>
            ))}
        </div>
      ) : null}

      {/* Explanation, revealed on demand. */}
      {revealed && showAnswer && explanation ? (
        <div className="flex flex-col gap-1 rounded-lg bg-sk-bg-secondary px-3 py-2.5">
          <span className="sk-text-2xs-medium uppercase tracking-wide text-sk-text-tertiary">
            Explanation
          </span>
          <p className="sk-text-sm-regular text-sk-text-secondary">{explanation}</p>
        </div>
      ) : null}

      {/* Last-attempt confirmation gate (graded only). */}
      {confirming ? (
        <div className="flex flex-col gap-2 rounded-lg bg-sk-bg-warning-primary px-3 py-2.5">
          <span className="sk-text-sm-semibold text-sk-text-warning-primary">
            This is your last attempt
          </span>
          <p className="sk-text-xs-regular text-sk-text-warning-primary">
            After submitting, this answer is final and the score is locked.
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setConfirming(false);
                onSubmit?.();
              }}
            >
              Submit final answer
            </Button>
            <Button variant="secondary" size="sm" onClick={() => setConfirming(false)}>
              Keep editing
            </Button>
          </div>
        </div>
      ) : null}

      {/* A saved answer is worth zero until submitted, and the platform's own
          word for it — "saved" — is the misleading one. Say it in terms of
          grading, not storage (spec §8.2a). */}
      {saved && !revealed ? (
        <span className="sk-text-xs-regular text-sk-text-warning-primary">
          Saved, but not submitted. It scores nothing until you submit.
        </span>
      ) : null}

      {/* Attempts qualify Submit rather than being an action. An attempt is one
          run through the whole quiz, so this is quiz-level information repeated
          here for orientation, never a count of tries at this question. */}
      {showAttempts && typeof maxAttempts === "number" && typeof attemptsUsed === "number" ? (
        <span className="sk-text-xs-regular text-sk-text-tertiary">
          Attempt {Math.min(attemptsUsed + 1, maxAttempts)} of {maxAttempts} at this quiz
        </span>
      ) : null}

      {/* Closed: attempts spent, past due, or past the course end date. The
          platform greys Submit and removes Reset and Save without a word. Both
          modes reach this state; only B is allowed to explain it. */}
      {closed && closedReason ? (
        <InlineAlert tone="warning" title="This quiz is closed" description={closedReason} />
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Save is the platform's, shown only in mode A. B saves silently and
              spends its words on what decides the grade. */}
          {!revealed && showSave && !closed ? (
            <Button variant="secondary" onClick={onSave} disabled={!hasSelection}>
              Save
            </Button>
          ) : null}

          {revealed && showExplanation && explanation && !showAnswer ? (
            <Button variant="secondary" leftIcon={Lightbulb} onClick={() => setShowAnswer(true)}>
              Show answer
            </Button>
          ) : null}

          {/* Retry lives on the card, not in the nav: if the primary becomes
              Next question, a learner who got it wrong with attempts left has
              nowhere to click. Reset never returns the attempt, so the label
              must sit beside the attempts count and never imply a free go. */}
          {revealed && !isCorrect && !closed && onRetry ? (
            <Button variant="secondary" leftIcon={RotateCcw} onClick={onRetry}>
              Try again
            </Button>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {!revealed && !confirming ? (
            <Button
              variant="primary"
              onClick={() => (isLastAttempt ? setConfirming(true) : onSubmit?.())}
              disabled={!hasSelection || closed}
            >
              Submit
            </Button>
          ) : null}

          {revealed && onNext ? (
            <Button variant="primary" rightIcon={ArrowRight} onClick={onNext}>
              {nextLabel}
            </Button>
          ) : null}
        </div>

      </div>
    </div>
  );
}
