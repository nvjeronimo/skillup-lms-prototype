"use client";

import * as React from "react";
import { Check, X } from "lucide-react";
import { Icon } from "@/lib/icons";
import { InlineAlert, type AlertTone } from "@/components/atoms/InlineAlert";
import { cn } from "@/lib/utils";
import type { QuizOption } from "@/lib/content";
import {
  QuizFooterActions,
  type QuizFooterActionsProps,
  type QuizQuestionState,
} from "@/components/molecules/QuizFooterActions";

export type { QuizQuestionState };

/** States that carry a submitted result. */
const RESULT_STATES: QuizQuestionState[] = [
  "Correct",
  "Incorrect",
  "Partially correct",
  "Answer revealed",
  "Results withheld",
];

/** States where the platform marks which options were right. */
const MARKS_CORRECTNESS: QuizQuestionState[] = [
  "Correct",
  "Incorrect",
  "Partially correct",
  "Answer revealed",
];

export interface QuizCardProps {
  /** One of the nine platform states. No others exist. */
  state?: QuizQuestionState;
  question?: string;
  options?: QuizOption[];
  multiSelect?: boolean;

  /* ---- The card's own six properties ---- */

  /** Mode B chrome: a per-question counter. No platform equivalent. */
  showProgress?: boolean;
  progress?: React.ReactNode;
  /** The revealed hint list — an authored `<demandhint>`. Not the Hint button. */
  showHint?: boolean;
  hints?: string[];
  hintIndex?: number;
  onNextHint?: () => void;
  /** Per-choice feedback authored as `<choicehint>`. */
  showExplanation?: boolean;
  /** The authored `<solution>`, revealed only when Show answer is pressed. */
  solution?: string;
  /** The block's `display_name`, printed above the question. Authored text. */
  showPlatformPrompt?: boolean;
  platformPrompt?: string;
  /** The `.problem-progress` points line. Empty in every course we can read. */
  showPoints?: boolean;
  points?: number;
  pointsEarned?: number;
  graded?: boolean;
  /** Off in the bucket model: the questions carry no action row at all. */
  showFooterQuestions?: boolean;

  /* ---- Passed through to the nested Footer Actions instance ---- */
  footer?: Omit<QuizFooterActionsProps, "className">;

  selectedIds?: string[];
  onToggleOption?: (id: string) => void;
  /** Anchor the platform's Review control returns focus to. */
  id?: string;
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
          <span className="h-2 w-2 rounded-full bg-sk-fg-white" />
        )
      ) : null}
    </span>
  );
}

/**
 * Alert tone follows the state, and the title carries the score — the DS shows
 * "Correct · 1 / 1 point" and "Partially correct · 1 / 2 points", not a bare
 * verdict. Answer revealed uses the Answer tone; Results withheld shows none,
 * because correctness is exactly what is being masked.
 */
function verdictAlert(
  state: QuizQuestionState,
  earned: number,
  possible: number,
): { tone: AlertTone; title: string } | null {
  const score = `${earned} / ${possible} point${possible === 1 ? "" : "s"}`;
  switch (state) {
    case "Correct":
      return { tone: "success", title: `Correct · ${score}` };
    case "Partially correct":
      return { tone: "warning", title: `Partially correct · ${score}` };
    case "Incorrect":
      return { tone: "error", title: `Incorrect · ${score}` };
    default:
      return null;
  }
}

/**
 * A single quiz question. Mirrors the Open edX CAPA problem lifecycle: each
 * question submits and scores independently.
 *
 * The footer is a nested instance of `LMS / Quiz · Footer Actions` — the card
 * does not own its CTAs. In the bucket model (mode A-2) the card carries no
 * footer at all and one Footer Actions sits under the last question, because
 * that is where the problem boundary is.
 */
export function QuizCard({
  state = "Unanswered",
  question = "What is the primary goal of Six Sigma?",
  options = DEFAULT_OPTIONS,
  multiSelect = false,
  showProgress = false,
  progress,
  showHint = false,
  hints = [],
  hintIndex = 0,
  onNextHint,
  showExplanation = true,
  solution,
  showPlatformPrompt = false,
  platformPrompt = "Choose the correct option",
  showPoints = false,
  points = 1,
  pointsEarned,
  graded = true,
  showFooterQuestions = true,
  footer,
  selectedIds = [],
  onToggleOption,
  id,
  className,
}: QuizCardProps) {
  const revealed = RESULT_STATES.includes(state);
  const marks = MARKS_CORRECTNESS.includes(state);
  const earned = state === "Correct" ? points : state === "Partially correct" ? Math.max(1, points - 1) : 0;
  const alert = verdictAlert(state, earned, points);
  const chosen = options.filter((o) => selectedIds.includes(o.id));

  return (
    <div
      id={id}
      className={cn(
        "flex flex-col gap-4 rounded-xl border border-sk-border-secondary bg-sk-bg-primary p-5",
        className,
      )}
    >
      {showProgress ? progress : null}

      {/* The block's display_name. Authored text — it differs per course, and
          in ours it is the same generic line above every question. */}
      {showPlatformPrompt ? (
        <span className="sk-text-md-semibold text-sk-text-primary">{platformPrompt}</span>
      ) : null}

      {/* `.problem-progress`. Empty in every course we can read, so off in A-1.
          In the bucket it carries the score for the whole set. */}
      {showPoints ? (
        <span className="sk-text-xs-regular text-sk-text-tertiary">
          {typeof pointsEarned === "number"
            ? `${pointsEarned}/${points} points (${graded ? "graded" : "ungraded"})`
            : `${points} point${points === 1 ? "" : "s"} possible (${graded ? "graded" : "ungraded"})`}
        </span>
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
          const revealCorrect = marks && Boolean(opt.correct);
          const showWrong = marks && isSelected && !opt.correct;
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
                <OptionMarker
                  multiSelect={multiSelect}
                  checked={isSelected || revealCorrect}
                  tone={tone}
                />
                <span className="flex-1">{opt.label}</span>
                {revealCorrect ? <Icon icon={Check} size={16} className="mt-0.5" /> : null}
                {showWrong ? <Icon icon={X} size={16} className="mt-0.5" /> : null}
              </button>
            </li>
          );
        })}
      </ul>

      {alert ? (
        <InlineAlert
          tone={alert.tone}
          title={alert.title}
          description={
            showExplanation
              ? chosen.filter((o) => o.feedback).map((o) => o.feedback).join(" ")
              : undefined
          }
        />
      ) : null}

      {/* The <solution>, revealed only when Show answer is pressed. */}
      {state === "Answer revealed" && solution ? (
        <InlineAlert tone="answer" title="Answer" description={solution} />
      ) : null}

      {/* One alert that grows, not one per hint: `get_demand_hint` re-renders
          every hint from the first to the current one into a single list, so
          hint 1 is still on screen when hint 3 arrives. There is no Previous —
          nothing has been taken away to go back to.

          Two controls in two places: `Hint` stays in the action row, and
          `Next Hint` lives in here once the first hint shows. It disables on
          exhaustion, never on first use — with three hints authored it stays
          live after the first press. */}
      {showHint && hints.length > 0 && hintIndex >= 0 ? (
        <InlineAlert
          tone="hint"
          title=""
          action={
            <button
              type="button"
              onClick={onNextHint}
              disabled={hintIndex + 1 >= hints.length}
              className={cn(
                "sk-text-sm-semibold underline",
                hintIndex + 1 >= hints.length
                  ? "cursor-not-allowed text-sk-fg-quaternary"
                  : "text-sk-text-brand",
              )}
            >
              Next Hint
            </button>
          }
        >
          <ol className="flex flex-col gap-1">
            {hints.slice(0, hintIndex + 1).map((h, i) => (
              <li key={i} className="sk-text-sm-regular text-sk-text-secondary">
                <span className="sk-text-sm-semibold text-sk-text-primary">
                  Hint ({i + 1} of {hints.length}):{" "}
                </span>
                {h}
              </li>
            ))}
          </ol>
        </InlineAlert>
      ) : null}

      {showFooterQuestions && footer ? <QuizFooterActions {...footer} /> : null}
    </div>
  );
}
