import * as React from "react";
import { CircleHelp, X } from "lucide-react";
import { Icon } from "@/lib/icons";
import { Button } from "@/components/atoms/Button";
import { useDialog } from "@/lib/useDialog";
import { useExitTransition, useFrozenWhileClosed } from "@/lib/useExitTransition";
import { MOTION_MS } from "@/lib/motion/tokens";
import { cn } from "@/lib/utils";
import { inertProps } from "@/lib/inert";
import styles from "./CompletionQuestionModal.module.css";

export interface CompletionQuestionModalProps {
  open: boolean;
  /** What the topic is called in the question: "lab", "reading", "lesson", "activity", "video", "podcast". */
  noun: string;
  /** Why we have to ask, in one sentence. */
  reason: string;
  /** False on the last topic: there is nowhere to go on to, so the text does not promise it. */
  hasNext?: boolean;
  /** "Yes, completed": mark the topic as completed and advance to the next topic. */
  onYes: () => void;
  /** "Not yet": keep the topic incomplete and advance to the next topic. */
  onNotYet: () => void;
  /** Close, Esc or the backdrop: no change, remain on the current topic. */
  onClose: () => void;
  /**
   * "package": a SCORM package that reports completion by itself has not done so yet (proposal of
   * 11 Nov 2026). We cannot mark a package complete, so there is no "Yes, completed": the learner
   * stays on the activity (primary, `onClose`) or continues anyway (`onNotYet`).
   */
  variant?: "question" | "package";
}

/**
 * The question Next asks when the learner moves on from a topic the platform cannot measure
 * without Mark as Complete (lab-third-party-platforms.md §4; Figma frames 7070:14832 and
 * 7077:18132). Copy and the three behaviours are Navdeep's, 12 Oct 2026. DS `Modal` Type=Horizontal:
 * featured icon beside the title and supporting text, close top right, two actions right
 * aligned. On a phone the actions stack and the primary one comes first, as in the DS
 * mobile variant. As the Figma completion question (7080:8235; Nelson's SKO match review,
 * 28 Oct 2026): the DS `Background pattern decorative` circles behind the featured icon, the
 * supporting text in text/subtle with 14 between its paragraphs, and lg (48) actions 32 below.
 */
export function CompletionQuestionModal({
  open,
  noun,
  reason,
  hasNext = true,
  onYes,
  onNotYet,
  onClose,
  variant = "question",
}: CompletionQuestionModalProps) {
  const titleId = React.useId();
  const descId = React.useId();
  // Focus starts on the close button, the first control in the dialog: neither answer is
  // offered as the default, because one of them changes the learner's progress.
  const dialogRef = useDialog(open, onClose);

  const { mounted, state, onAnimationEnd } = useExitTransition(open, MOTION_MS.short3);
  // "Yes" moves to the next topic, which changes these props: keep the question as it was for the exit.
  const shown = useFrozenWhileClosed({ noun, reason, hasNext, variant }, open);
  const pkg = shown.variant === "package";

  if (!mounted) return null;
  const closed = state === "closed";
  return (
    <div
      ref={dialogRef}
      data-state={state}
      aria-hidden={closed || undefined}
      {...inertProps(closed)}
      className={cn(
        styles.root,
        closed && styles.closed,
      )}
    >
      {/* The backdrop's fade-out (short4) outlasts the dialog's pop-out (short3), so it ends the exit. */}
      <div
        className={`sk-backdrop sk-animate-fade ${styles.backdrop}`}
        onClick={onClose}
        onAnimationEnd={onAnimationEnd}
        aria-hidden
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        className={`sk-animate-pop ${styles.dialog}`}
      >
        {/* DS `Background pattern decorative` (Circles): 336 square, centred on the featured icon,
            hairline rings that fade out from the middle. */}
        <svg
          aria-hidden
          viewBox="0 0 336 336"
          className={styles.pattern}
        >
          {[24, 48, 72, 96, 120, 144, 168].map((r) => (
            <circle key={r} cx="168" cy="168" r={r - 0.5} fill="none" stroke="currentColor" />
          ))}
        </svg>
        <div className={styles.head}>
          <span className={styles.featured}>
            <Icon icon={CircleHelp} size={24} />
          </span>
          <div className={styles.text}>
            <h2 id={titleId} className={`sk-text-body-large-semibold ${styles.title}`}>
              {pkg ? `This ${shown.noun} hasn't recorded completion yet` : `Have you completed this ${shown.noun}?`}
            </h2>
            <div id={descId} className={`sk-text-body-medium-regular ${styles.description}`}>
              <p>{shown.reason}</p>
              <p>
                {pkg
                  ? `If you continue now, this topic stays not complete until you come back and finish the ${shown.noun}.`
                  : shown.hasNext
                    ? `You can move to the next topic either way and return to this ${shown.noun} anytime.`
                    : `You can return to this ${shown.noun} anytime.`}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className={styles.close}
          >
            <Icon icon={X} size={24} />
          </button>
        </div>

        <div className={styles.actions}>
          {pkg ? (
            <>
              <Button variant="primary" size="lg" onClick={onClose}>
                Stay on the {shown.noun}
              </Button>
              <Button variant="secondary" size="lg" onClick={onNotYet}>
                Continue anyway
              </Button>
            </>
          ) : (
            <>
              <Button variant="primary" size="lg" onClick={onYes}>
                Yes, completed
              </Button>
              <Button variant="secondary" size="lg" onClick={onNotYet}>
                Not yet
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
