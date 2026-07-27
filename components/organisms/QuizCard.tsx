"use client";

import * as React from "react";
import { Check, X, Lightbulb, ArrowRight } from "lucide-react";
import { Icon } from "@/lib/icons";
import { Button } from "@/components/atoms/Button";
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
  /** Graded quizzes expose a Save-draft affordance and an attempts counter. */
  showSaveDraft?: boolean;
  onSaveDraft?: () => void;
  draftSaved?: boolean;
  attemptsUsed?: number;
  maxAttempts?: number;
  /** Warn before the last graded attempt is spent. */
  isLastAttempt?: boolean;
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
 * an optional Show-answer/explanation reveal. Position ("Question n of m") is
 * owned by the Progress Rail — this card never repeats it.
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
  showSaveDraft,
  onSaveDraft,
  draftSaved,
  attemptsUsed,
  maxAttempts,
  isLastAttempt,
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
      <h3 className="sk-text-md-semibold text-sk-text-primary">{question}</h3>

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

      {/* Answer-specific feedback for the option(s) the learner actually chose. */}
      {revealed && chosen.some((o) => o.feedback) ? (
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
          {chosen
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

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {!revealed && !confirming ? (
            <Button
              variant="primary"
              onClick={() => (isLastAttempt ? setConfirming(true) : onSubmit?.())}
              disabled={!hasSelection}
            >
              Submit answer
            </Button>
          ) : null}

          {!revealed && showSaveDraft ? (
            <Button variant="secondary" onClick={onSaveDraft} disabled={!hasSelection}>
              Save draft
            </Button>
          ) : null}

          {revealed && explanation && !showAnswer ? (
            <Button variant="secondary" leftIcon={Lightbulb} onClick={() => setShowAnswer(true)}>
              Show answer
            </Button>
          ) : null}

          {revealed && !isCorrect && reviewTopicTitle ? (
            <Button variant="secondary" rightIcon={ArrowRight} onClick={onReviewTopic}>
              Review lesson
            </Button>
          ) : null}
        </div>

        <div className="flex flex-col items-end gap-0.5">
          {typeof maxAttempts === "number" && typeof attemptsUsed === "number" ? (
            <span className="sk-text-xs-regular text-sk-text-tertiary">
              You have used {attemptsUsed} of {maxAttempts} attempts
            </span>
          ) : null}
          {draftSaved && !revealed ? (
            <span className="sk-text-xs-regular text-sk-text-brand-secondary">
              Draft saved — not submitted yet
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}
