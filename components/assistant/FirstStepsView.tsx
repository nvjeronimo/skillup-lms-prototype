import * as React from "react";
import { Check } from "lucide-react";
import { Icon } from "@/lib/icons";
import { cn, iconStroke } from "@/lib/utils";
import { Button } from "@/components/atoms/Button";
import { Badge } from "@/components/atoms/Badge";
import { ButtonLink } from "@/components/atoms/ButtonLink";
import { PlatformProgressBar } from "@/components/platform/PlatformProgressBar";
import type { ActionEntry } from "@/lib/assistant/types";
import { NextStepCard } from "./NextStepCard";
import styles from "./FirstStepsView.module.css";

export interface FirstStepRow {
  id: string;
  label: string;
  why: string;
  cta: string;
  done: boolean;
  /** Where the step happens. Absent: the snapshot has no such place, the row has no button. */
  href?: string;
  /** The step done in the chat itself: its button switches to the Ask tab. */
  ask?: boolean;
}

export interface FirstStepsViewProps {
  firstName: string;
  rows: FirstStepRow[];
  /** All five are done in this visit: the closing state. */
  finished: boolean;
  next: { text: string; action: ActionEntry } | null;
  onAsk: () => void;
  onSkip: () => void;
}

/**
 * The First steps view of the assistant's window: five steps that tick themselves as the
 * learner does them on the real pages (lib/first-steps). Presentational.
 */
export function FirstStepsView({ firstName, rows, finished, next, onAsk, onSkip }: FirstStepsViewProps) {
  const done = rows.filter((row) => row.done).length;
  // A step that ticks while the view is shown draws its check; those done before are still.
  const [doneBefore] = React.useState(() => new Set(rows.filter((row) => row.done).map((row) => row.id)));

  if (finished) {
    return (
      <div className={styles.finished}>
        <p className={cn("sk-text-body-large-semibold", styles.textDefault)}>You&apos;re set.</p>
        {next ? <NextStepCard text={next.text} action={next.action} /> : null}
        <Button hierarchy="secondary" size="sm" onClick={onAsk}>
          Ask the assistant
        </Button>
      </div>
    );
  }

  // Compact (Nelson, 23 Oct 2026, as the program quick view's course list): one card, its title
  // and count over the bar, then one row per step — the step circle (check when done), the
  // label on one line and, on the right, "Completed" or the step's button. Why the step matters
  // stays for assistive tech and as the row's tooltip.
  return (
    <div className={styles.view}>
      <div className={styles.card}>
        <div className={styles.head}>
          <div className={styles.titleRow}>
            <p className={cn("sk-text-title-medium-semibold", styles.textDefault)}>First steps</p>
            <p className={cn("sk-text-body-small-regular", styles.textSubtle)}>
              {done} of {rows.length} done
            </p>
          </div>
          <PlatformProgressBar value={(done / rows.length) * 100} label="First steps" height={4} />
        </div>
        <ol className={styles.steps}>
          {rows.map((row, i) => (
            <li key={row.id} title={row.why} className={styles.step}>
              {row.done ? (
                <span className={cn(styles.circle, styles.circleDone)}>
                  {doneBefore.has(row.id) ? (
                    <Icon icon={Check} size={14} />
                  ) : (
                    // The lucide check as one path, so its stroke draws itself (CompletionStatus).
                    <svg
                      aria-hidden
                      width={14}
                      height={14}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={iconStroke(14)}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path className="sk-draw-check-immediate" d="M4 12l5 5L20 6" pathLength={1} />
                    </svg>
                  )}
                </span>
              ) : (
                <span aria-hidden className={cn("sk-text-body-small-semibold", styles.circle, styles.circleTodo)}>
                  {i + 1}
                </span>
              )}
              <p className={cn("sk-text-body-medium-medium", styles.label)}>
                {row.label}
                <span className="sk-sr-only">. {row.why}</span>
              </p>
              {row.done ? (
                <Badge variant="soft" color="success" className={styles.trailing}>
                  Completed
                </Badge>
              ) : row.ask ? (
                <Button hierarchy="secondary" size="sm" onClick={onAsk} className={styles.trailing}>
                  {row.cta}
                </Button>
              ) : row.href ? (
                <ButtonLink href={row.href} hierarchy="secondary" size="sm" className={styles.trailing}>
                  {row.cta}
                </ButtonLink>
              ) : null}
            </li>
          ))}
        </ol>
      </div>
      <button
        type="button"
        onClick={onSkip}
        className={cn("sk-text-body-small-medium", styles.skip)}
      >
        Skip first steps
      </button>
    </div>
  );
}
