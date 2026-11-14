import * as React from "react";
import { Check, X, Flag } from "lucide-react";
import { Icon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import styles from "./ProgressRail.module.css";

export type RailItemState = "pending" | "current" | "done" | "error" | "flagged";

export interface ProgressRailProps {
  states: RailItemState[];
  currentIndex: number;
  /** Single position label, e.g. "Step 1 of 3". */
  label: string;
  /** Noun for each dot in assistive text — must match the visible label. */
  itemLabel?: string;
  onJump?: (index: number) => void;
  className?: string;
}

/**
 * Position + progress for a multi-step topic. One line: the label carries the
 * position, the dots carry per-item state — so neither has to be repeated in
 * prose elsewhere on the screen.
 *
 * Quizzes no longer use this: the DS replaced their dot rail with the
 * Stepper Bar's progress track (see QuizNavStepper in QuizNav), because a dot
 * per question reads as noise on a long quiz.
 */
export function ProgressRail({
  states,
  currentIndex,
  label,
  itemLabel = "Step",
  onJump,
  className,
}: ProgressRailProps) {

  return (
    <div
      className={cn(styles.rail, className)}
      role="group"
      aria-label={label}
    >
      <span className={`sk-text-body-medium-medium ${styles.label}`}>{label}</span>
      <ol className={styles.dots}>
        {states.map((s, i) => {
          const isCurrent = i === currentIndex;
          return (
            <li key={i}>
              <button
                type="button"
                onClick={() => onJump?.(i)}
                aria-label={`${itemLabel} ${i + 1}: ${s}`}
                aria-current={isCurrent ? "step" : undefined}
                className={cn(
                  "sk-text-body-small-medium",
                  styles.dot,
                  s === "done"
                    ? styles.done
                    : s === "error"
                      ? styles.error
                      : s === "flagged"
                        ? styles.flagged
                        : isCurrent
                          ? styles.current
                          : styles.pending,
                  isCurrent && s !== "pending" && styles.currentRing,
                )}
              >
                {s === "done" ? (
                  <Icon icon={Check} size={13} />
                ) : s === "error" ? (
                  <Icon icon={X} size={13} />
                ) : s === "flagged" ? (
                  <Icon icon={Flag} size={12} />
                ) : (
                  i + 1
                )}
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
