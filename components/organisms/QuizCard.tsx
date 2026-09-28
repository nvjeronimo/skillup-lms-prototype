"use client";

import * as React from "react";
import { Check, X } from "lucide-react";
import { Icon } from "@/lib/icons";
import { InlineAlert, type AlertTone } from "@/components/atoms/InlineAlert";
import { cn } from "@/lib/utils";
import { useRovingRadio } from "@/lib/useRovingRadio";
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
  /**
   * DS Option Row `Show state-check-icon` (default true). Off hides the ✓ on
   * Correct, the ✗ on Incorrect and the "Un-selected is correct" note.
   */
  showStateIcon?: boolean;

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

/**
 * The answer marker — DS Checkbox `Type=Radio` (circle) / `Type=Checkbox` (square).
 *
 * The marker reports **what the learner picked**, and nothing else. It keeps the
 * brand fill after submitting: on the DS screens the checked radio is the same
 * navy in a green Correct row as in a pink Incorrect row. Correctness is carried
 * by the row tint, the label colour and the trailing icon — three signals, so
 * the marker does not need to be a fourth.
 *
 * It follows that an option the learner never chose stays empty even when the
 * row is revealed as correct: `Missed` is an unchecked box on a green row. On a
 * radio `Missed` has no meaning at all (board 04, Option Row).
 *
 * DS Checkbox Size=sm: 16×16, 1px stroke; round for Radio, radius 4 for
 * Checkbox. Checked is bg/primary with no stroke and an icon/on-primary mark (a
 * 6×6 dot, or a 12px tick). Disabled is bg/faint on border/disabled at
 * opacity 40, as the DS draws it (and as LessonBlocks OptionRadio does).
 */
function OptionMarker({
  multiSelect,
  checked,
  disabled = false,
}: {
  multiSelect?: boolean;
  checked: boolean;
  disabled?: boolean;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center border transition-colors",
        multiSelect ? "rounded" : "rounded-full",
        checked
          ? "border-transparent bg-sko-bg-primary"
          : disabled
            ? "border-sko-border-disabled bg-sko-bg-faint opacity-40"
            : "border-sko-border-default bg-sko-bg-page",
      )}
    >
      {checked ? (
        multiSelect ? (
          <Icon icon={Check} size={12} className="text-sko-icon-on-primary" />
        ) : (
          // The dot is filled with icon/on-primary: bg-current takes it from the text colour.
          <span className="h-1.5 w-1.5 rounded-full bg-current text-sko-icon-on-primary" />
        )
      ) : null}
    </span>
  );
}

/**
 * Alert tone follows the state. Whether the title carries a score depends on
 * where the problem boundary is, and the platform docs are explicit that the
 * feedback shows the problem score.
 *
 * In A-1 the card **is** the problem, so it prints "Correct (1/1 point)". In
 * A-2 one bucket returns a single score for the whole set, so the per-question
 * alerts stay bare and the score lives on the problem header — a per-question
 * number there would be one the API never returned.
 *
 * Answer revealed uses the Answer tone and is rendered separately.
 *
 * Three states carry a notice rather than a verdict (DS Question Card, visible
 * Inline Alert layers that are not bound to Show explanation): Last attempt and
 * Saved warn, and Results withheld says the answer went in without saying
 * whether it was right — correctness is exactly what is being withheld. It
 * carries the title only: the prototype models Results withheld as
 * `show_correctness: never`, so there is no release date to promise.
 */
function verdictAlert(
  state: QuizQuestionState,
  earned: number,
  possible: number,
  withScore: boolean,
): { tone: AlertTone; title: string; notice?: boolean; description?: string } | null {
  const score = withScore ? ` (${earned}/${possible} point${possible === 1 ? "" : "s"})` : "";
  switch (state) {
    case "Correct":
      return { tone: "success", title: `Correct${score}` };
    case "Partially correct":
      return { tone: "warning", title: `Partially correct${score}` };
    case "Incorrect":
      return { tone: "error", title: `Incorrect${score}` };
    case "Last attempt":
      return {
        tone: "warning",
        title: "Last attempt",
        notice: true,
        description: "Once you submit, this answer is final and your score is recorded.",
      };
    case "Saved":
      return {
        tone: "warning",
        title: "Saved, not submitted",
        notice: true,
        description: "Your answer is stored, but it has not been graded and scores nothing until you submit it.",
      };
    case "Results withheld":
      return { tone: "info", title: "Answer submitted", notice: true };
    default:
      return null;
  }
}

/** The seven states `LMS / Quiz · Option Row` can be in. */
type OptionState =
  | "Unanswered"
  | "Selected"
  | "Disabled"
  | "Correct"
  | "Incorrect"
  | "Missed"
  | "Correctly unselected";

/**
 * A tick reads as praise, so it belongs only to something the learner earned.
 * The right answer they did not pick is `Missed`: green, to show where the
 * answer was, but no tick and a text marker instead.
 *
 * The marking follows the quiz spec (04 F-QZ-007, and 06 §14.8 row 6: a
 * Partially correct checkbox card shows "Missed + Correctly unselected"):
 * - Incorrect marks only the learner's pick; every other row is `Disabled`. An
 *   Incorrect card must not reveal the answer while Show answer is still on
 *   offer.
 * - Correct marks the learner's pick; on a multi-select card the untouched
 *   wrong rows are `Correctly unselected`, on a radio they are `Disabled`.
 * - Partially correct and Answer revealed mark every row: `Missed` for the
 *   right answer not picked, and `Correctly unselected` for an untouched wrong
 *   row, gated on multi-select — leaving a wrong option unchecked is only part
 *   of an answer when there were several to weigh. ⚑ The DS Question Card
 *   keeps these rows `Unanswered` on Partially correct and uses a radio for its
 *   Answer revealed example; the spec wins here — see the note in the handoff.
 * - Results withheld and the pre-submit states never mark correctness.
 */
function optionState(
  state: QuizQuestionState,
  isSelected: boolean,
  correct: boolean,
  multiSelect: boolean,
): OptionState {
  switch (state) {
    case "Incorrect":
      if (!isSelected) return "Disabled";
      return correct ? "Correct" : "Incorrect";
    case "Correct":
      if (!isSelected) return multiSelect && !correct ? "Correctly unselected" : "Disabled";
      return correct ? "Correct" : "Incorrect";
    case "Partially correct":
    case "Answer revealed":
      if (correct) return isSelected ? "Correct" : "Missed";
      if (isSelected) return "Incorrect";
      return multiSelect ? "Correctly unselected" : "Unanswered";
    default:
      return isSelected ? "Selected" : "Unanswered";
  }
}

/**
 * Row chrome per state — fill, text, and the trailing marker. Every state has
 * the same 1px border/subtle stroke (it lives in the row's base classes): the
 * state is carried by the fill and the label colour only.
 */
const OPTION_ROW: Record<
  OptionState,
  { box: string; marker?: "tick" | "cross"; note?: string; noteTone?: string }
> = {
  Unanswered: { box: "bg-sko-bg-page text-sko-text-default" },
  Selected: { box: "bg-sko-bg-primary-soft text-sko-text-default" },
  Disabled: { box: "bg-sko-bg-page text-sko-text-default" },
  Correct: {
    box: "bg-sko-bg-success-soft text-sko-text-success",
    marker: "tick",
  },
  Incorrect: {
    box: "bg-sko-bg-error-soft text-sko-text-error",
    marker: "cross",
  },
  Missed: {
    box: "bg-sko-bg-success-soft text-sko-text-success",
    note: "This should be selected",
  },
  "Correctly unselected": {
    box: "bg-sko-bg-page text-sko-text-default",
    note: "Un-selected is correct",
    noteTone: "text-sko-text-subtle",
  },
};

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
  showStateIcon = true,
  footer,
  selectedIds = [],
  onToggleOption,
  id,
  className,
}: QuizCardProps) {
  const revealed = RESULT_STATES.includes(state);
  const earned = state === "Correct" ? points : state === "Partially correct" ? Math.max(1, points - 1) : 0;
  // The card owns a footer only when it is the problem — that is exactly the
  // A-1/A-2 split, so it also decides whether the verdict carries a score. No
  // new property: the contract has six and this is derived from one of them.
  // The same split decides the three notices (Last attempt, Saved, Results
  // withheld): they speak about submitting, which is the problem's business, so
  // in the bucket they would repeat on every question of the set.
  const verdict = verdictAlert(state, earned, points, showFooterQuestions);
  const alert = verdict && (!verdict.notice || showFooterQuestions) ? verdict : null;
  const chosen = options.filter((o) => selectedIds.includes(o.id));
  // Options are a labelled radiogroup (single) or group of checkboxes (multi).
  // Single-select gets the APG roving tabindex: one Tab stop, arrows move + check.
  const questionId = React.useId();
  const hintId = React.useId();
  const selectedIndex = options.findIndex((o) => selectedIds.includes(o.id));
  const roving = useRovingRadio(
    options.length,
    selectedIndex,
    (i) => {
      const next = options[i];
      if (next && !selectedIds.includes(next.id)) onToggleOption?.(next.id);
    },
    { disabled: revealed || multiSelect },
  );

  return (
    <div
      id={id}
      className={cn(
        "flex flex-col gap-5 rounded-xl border border-sko-border-subtle bg-sko-bg-page p-6 shadow-sk-card",
        className,
      )}
    >
      {/* DS `Platform prompt` frame: the Instruction with the points line 4px
          under it. */}
      {showPlatformPrompt || showPoints ? (
        <div className="flex flex-col gap-1">
          {/* The block's display_name. Authored text — it differs per course,
              and in ours it is the same generic line above every question. */}
          {showPlatformPrompt ? (
            <span className="sk-text-md-semibold text-sko-text-default">{platformPrompt}</span>
          ) : null}

          {/* `.problem-progress`. Empty in every course we can read, so off in
              A-1. In the bucket it carries the score for the whole set. */}
          {showPoints ? (
            <span className="sk-text-xs-medium text-sko-text-subtle">
              {typeof pointsEarned === "number"
                ? `${pointsEarned}/${points} points (${graded ? "graded" : "ungraded"})`
                : `${points} point${points === 1 ? "" : "s"} possible (${graded ? "graded" : "ungraded"})`}
            </span>
          ) : null}
        </div>
      ) : null}

      {/* DS: the nested Stepper Bar sits after the Platform prompt and before
          the Question. */}
      {showProgress ? progress : null}

      {/* body-large/Medium in text/default in all nine states, prompt or not. */}
      <h3 id={questionId} className="sk-text-md-medium text-sko-text-default">{question}</h3>

      {multiSelect ? (
        <span id={hintId} className="sk-text-2xs-medium -mt-2 uppercase tracking-wide text-sko-text-subtle">
          Select all that apply
        </span>
      ) : null}

      <div
        role={multiSelect ? "group" : "radiogroup"}
        aria-labelledby={questionId}
        aria-describedby={multiSelect ? hintId : undefined}
        className="flex flex-col gap-2"
      >
        {options.map((opt, i) => {
          const isSelected = selectedIds.includes(opt.id);
          const rowState = optionState(state, isSelected, Boolean(opt.correct), multiSelect);
          const row = OPTION_ROW[rowState];
          const plain = rowState === "Unanswered";
          // `Show state-check-icon` hides the ✓, the ✗ and the Correctly-unselected note.
          const showNote = row.note && (showStateIcon || rowState !== "Correctly unselected");
          const showMarker = showStateIcon ? row.marker : undefined;
          return (
            <div key={opt.id}>
              <button
                type="button"
                {...(multiSelect ? {} : roving.itemProps(i))}
                onClick={() => !revealed && onToggleOption?.(opt.id)}
                disabled={revealed}
                role={multiSelect ? "checkbox" : "radio"}
                aria-checked={isSelected}
                data-option-state={rowState}
                className={cn(
                  "sk-text-sm-regular flex w-full items-start gap-3 rounded-lg border border-sko-border-subtle py-3 pl-3 pr-4 text-left transition-colors",
                  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sko-border-primary",
                  row.box,
                  plain && !revealed ? "hover:bg-sko-bg-subtle" : null,
                )}
              >
                <OptionMarker
                  multiSelect={multiSelect}
                  checked={isSelected}
                  disabled={rowState === "Disabled"}
                />
                <span className="flex-1">{opt.label}</span>
                {/* A text marker where a tick would mislead. */}
                {showNote ? (
                  <span className={cn("sk-text-xs-medium mt-0.5 shrink-0", row.noteTone)}>{row.note}</span>
                ) : null}
                {showMarker === "tick" ? (
                  <>
                    <Icon icon={Check} size={24} className="shrink-0 text-sko-icon-success" aria-hidden />
                    <span className="sr-only">, correct</span>
                  </>
                ) : null}
                {showMarker === "cross" ? (
                  <>
                    <Icon icon={X} size={24} className="shrink-0 text-sko-icon-error" aria-hidden />
                    <span className="sr-only">, incorrect</span>
                  </>
                ) : null}
              </button>
            </div>
          );
        })}
      </div>

      {alert ? (
        <InlineAlert
          tone={alert.tone}
          title={alert.title}
          description={
            alert.notice
              ? alert.description
              : showExplanation
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
              // DS Next Hint: a link button with a 1px bottom stroke in every
              // state (border/disabled once the hints run out).
              className={cn(
                "sk-text-sm-semibold border-b px-0.5 py-1",
                hintIndex + 1 >= hints.length
                  ? "cursor-not-allowed border-sko-border-disabled text-sko-text-disabled"
                  : "border-sko-border-primary text-sko-text-primary",
              )}
            >
              Next Hint
            </button>
          }
        >
          <ol className="flex flex-col gap-1">
            {hints.slice(0, hintIndex + 1).map((h, i) => (
              <li key={i} className="sk-text-sm-regular text-sko-text-default">
                <span className="sk-text-sm-semibold text-sko-text-default">
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
