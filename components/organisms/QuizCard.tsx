import * as React from "react";
import { Check, X } from "lucide-react";
import { Icon } from "@/lib/icons";
import { InlineAlert, type AlertTone } from "@/components/atoms/InlineAlert";
import { Collapse } from "@/components/atoms/Collapse";
import { useFrozenWhileClosed } from "@/lib/useExitTransition";
import { cn, iconStroke } from "@/lib/utils";
import { useRovingRadio } from "@/lib/useRovingRadio";
import styles from "./QuizCard.module.css";
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
  /**
   * Mode B: which question is on screen. The question body (question, options,
   * alerts, hints) is keyed on it and enters from `stepDirection`'s side; the
   * stepper and the footer stay mounted, so Back and Skip keep keyboard focus.
   */
  stepKey?: React.Key;
  stepDirection?: "next" | "prev";
  className?: string;
}

const DEFAULT_OPTIONS: QuizOption[] = [
  { id: "a", label: "Reduce process variation and defects", correct: true },
  { id: "b", label: "Increase production speed at any cost" },
  { id: "c", label: "Eliminate all documentation" },
  { id: "d", label: "Replace all staff with automation" },
];

/** The marker's dot or tick growing in from its centre. */
/* The mark grows from half size with a fade, never from nothing (scale 0): it settles into the
   box instead of popping out of it (Emil Kowalski review, 22 Oct 2026). */
const MARK_MOTION = styles.mark;

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
 *
 * Motion: the box changes colour (short3, standard) and the dot or tick grows in
 * from its centre (short3, standard-decelerate). Both are always rendered and
 * scaled to 0 when unchecked, so un-picking shrinks them back. Reduced motion
 * keeps transform out of the transitioned properties, so the mark just appears.
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
        styles.marker,
        multiSelect ? styles.markerCheckbox : styles.markerRadio,
        checked ? styles.markerChecked : disabled ? styles.markerDisabled : styles.markerIdle,
      )}
    >
      {multiSelect ? (
        <Icon
          icon={Check}
          size={12}
          className={cn(MARK_MOTION, checked ? styles.markOn : styles.markOff)}
        />
      ) : (
        // The dot is filled with icon/on-primary: bg-current takes it from the text colour.
        <span
          className={cn(
            styles.markDot,
            MARK_MOTION,
            checked ? styles.markOn : styles.markOff,
          )}
        />
      )}
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
        description:
          "Your answer is stored, but it has not been graded and scores nothing until you submit it.",
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
  Unanswered: { box: styles.rowUnanswered },
  Selected: { box: styles.rowSelected },
  Disabled: { box: styles.rowDisabled },
  Correct: {
    box: styles.rowCorrect,
    marker: "tick",
  },
  Incorrect: {
    box: styles.rowIncorrect,
    marker: "cross",
  },
  Missed: {
    box: styles.rowMissed,
    note: "This should be selected",
  },
  "Correctly unselected": {
    box: styles.rowUnselected,
    note: "Un-selected is correct",
    noteTone: styles.noteSubtle,
  },
};

/**
 * The Correct row's tick: lucide's check at 24px, drawn as one path so its stroke
 * can be animated (the CompletionStatus pattern). It draws at once, with no
 * chain delay. Reduced motion shows it whole. Not animated: lucide's own check.
 */
function DrawnCheck({ animate }: { animate: boolean }) {
  if (!animate)
    return <Icon icon={Check} size={24} className={styles.tick} aria-hidden />;
  return (
    <svg
      aria-hidden
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={iconStroke(24)}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={styles.tick}
    >
      <path className="sk-draw-check-immediate" d="M4 12l5 5L20 6" pathLength={1} />
    </svg>
  );
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
  showStateIcon = true,
  footer,
  selectedIds = [],
  onToggleOption,
  id,
  stepKey,
  stepDirection = "next",
  className,
}: QuizCardProps) {
  const revealed = RESULT_STATES.includes(state);
  // The verdict onsets (tick draw, cross fade, alert fade) play only when the state
  // changes while this question is on screen. A question shown again with its answer
  // already in (Back, Retry) renders still. The ref is reset on each new step and only
  // ever flips to true, so a repeated render (StrictMode) gives the same answer.
  const onsetRef = React.useRef({ stepKey, state, live: false });
  if (onsetRef.current.stepKey !== stepKey) {
    onsetRef.current = { stepKey, state, live: false };
  } else if (onsetRef.current.state !== state) {
    onsetRef.current = { stepKey, state, live: true };
  }
  const animateVerdict = onsetRef.current.live;
  const earned =
    state === "Correct" ? points : state === "Partially correct" ? Math.max(1, points - 1) : 0;
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
  // The hint alert opens and closes as a Collapse; while it closes (Reset) it keeps the hints
  // it showed instead of emptying first.
  const hintOpen = showHint && hints.length > 0 && hintIndex >= 0;
  const shownHintIndex = useFrozenWhileClosed(hintIndex, hintOpen);

  return (
    <div
      id={id}
      className={cn(
        styles.card,
        className,
      )}
    >
      {/* DS `Platform prompt` frame: the Instruction with the points line 4px
          under it. */}
      {showPlatformPrompt || showPoints ? (
        <div className={styles.prompt}>
          {/* The block's display_name. Authored text — it differs per course,
              and in ours it is the same generic line above every question. */}
          {showPlatformPrompt ? (
            <span className={`sk-text-body-large-semibold ${styles.ink}`}>
              {platformPrompt}
            </span>
          ) : null}

          {/* `.problem-progress`. Empty in every course we can read, so off in
              A-1. In the bucket it carries the score for the whole set. */}
          {showPoints ? (
            <span className={`sk-text-body-small-medium ${styles.subtle}`}>
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

      {/* The question body. In mode B it is keyed on the step and enters from
          the side the learner moved toward; elsewhere it is a plain wrapper. */}
      <div
        key={stepKey}
        className={cn(
          styles.question,
          stepKey !== undefined &&
            (stepDirection === "next" ? "sk-animate-step-next" : "sk-animate-step-prev"),
        )}
      >
        {/* body-large/Medium in text/default in all nine states, prompt or not. */}
        <h3 id={questionId} className={`sk-text-body-large-medium ${styles.ink}`}>
          {question}
        </h3>

        {multiSelect ? (
          <span
            id={hintId}
            className={`sk-text-label-small-medium ${styles.selectAll}`}
          >
            Select all that apply
          </span>
        ) : null}

        <div
          role={multiSelect ? "group" : "radiogroup"}
          aria-labelledby={questionId}
          aria-describedby={multiSelect ? hintId : undefined}
          className={styles.options}
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
                    "sk-text-body-medium-regular",
                    styles.option,
                    row.box,
                    plain && !revealed ? styles.optionHover : null,
                  )}
                >
                  <OptionMarker
                    multiSelect={multiSelect}
                    checked={isSelected}
                    disabled={rowState === "Disabled"}
                  />
                  <span className={styles.optionLabel}>{opt.label}</span>
                  {/* A text marker where a tick would mislead. */}
                  {showNote ? (
                    <span className={cn("sk-text-body-small-medium", styles.note, row.noteTone)}>
                      {row.note}
                    </span>
                  ) : null}
                  {/* Onsets, no movement: the tick draws itself the moment the
                    verdict lands; the cross only fades in. Nothing shakes. */}
                  {showMarker === "tick" ? (
                    <>
                      <DrawnCheck animate={animateVerdict} />
                      <span className="sk-sr-only">, correct</span>
                    </>
                  ) : null}
                  {showMarker === "cross" ? (
                    <>
                      <Icon
                        icon={X}
                        size={24}
                        className={cn(
                          styles.cross,
                          animateVerdict && "sk-animate-fade",
                        )}
                        aria-hidden
                      />
                      <span className="sk-sr-only">, incorrect</span>
                    </>
                  ) : null}
                </button>
              </div>
            );
          })}
        </div>

        {/* Keyed on the title, so a new verdict or notice fades in rather than
          the text changing under the learner (only when it lands in view). */}
        {alert ? (
          <InlineAlert
            key={alert.title}
            className={animateVerdict ? "sk-animate-fade" : undefined}
            tone={alert.tone}
            title={alert.title}
            description={
              alert.notice
                ? alert.description
                : showExplanation
                  ? chosen
                      .filter((o) => o.feedback)
                      .map((o) => o.feedback)
                      .join(" ")
                  : undefined
            }
          />
        ) : null}

        {/* The <solution>, revealed only when Show answer is pressed. It opens
          rather than appears (grid rows 0fr → 1fr, content fading in), and
          closes the same way on Reset. The -mt-5/pt-5 pair cancels the card's
          gap while it is closed, so a closed explanation takes no space. */}
        {solution ? (
          <Collapse open={state === "Answer revealed"} className={styles.collapseGap}>
            <div
              className={cn(
                styles.collapseBody,
                styles.solution,
                state === "Answer revealed" ? styles.solutionShown : styles.solutionHidden,
              )}
            >
              <InlineAlert tone="answer" title="Answer" description={solution} />
            </div>
          </Collapse>
        ) : null}

        {/* One alert that grows, not one per hint: `get_demand_hint` re-renders
          every hint from the first to the current one into a single list, so
          hint 1 is still on screen when hint 3 arrives. There is no Previous —
          nothing has been taken away to go back to.

          Two controls in two places: `Hint` stays in the action row, and
          `Next Hint` lives in here once the first hint shows. It disables on
          exhaustion, never on first use — with three hints authored it stays
          live after the first press. */}
        {hints.length > 0 ? (
          <Collapse open={hintOpen} className={styles.collapseGap}>
            <div className={styles.collapseBody}>
              <InlineAlert
                tone="hint"
                title=""
                action={
                  <button
                    type="button"
                    onClick={onNextHint}
                    disabled={shownHintIndex + 1 >= hints.length}
                    // DS Next Hint: a link button with a 1px bottom stroke in every
                    // state (border/disabled once the hints run out).
                    className={cn(
                      "sk-text-body-medium-semibold",
                      styles.nextHint,
                      shownHintIndex + 1 >= hints.length ? styles.nextHintDone : styles.nextHintLive,
                    )}
                  >
                    Next Hint
                  </button>
                }
              >
                <ol className={styles.hints}>
                  {hints.slice(0, shownHintIndex + 1).map((h, i) => (
                    <li key={i} className={`sk-text-body-medium-regular ${styles.ink}`}>
                      <span className={`sk-text-body-medium-semibold ${styles.ink}`}>
                        Hint ({i + 1} of {hints.length}):{" "}
                      </span>
                      {h}
                    </li>
                  ))}
                </ol>
              </InlineAlert>
            </div>
          </Collapse>
        ) : null}
      </div>

      {showFooterQuestions && footer ? <QuizFooterActions {...footer} /> : null}
    </div>
  );
}
