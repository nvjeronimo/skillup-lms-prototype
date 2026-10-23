"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { Icon } from "@/lib/icons";
import { iconStroke } from "@/lib/utils";
import { Button } from "@/components/atoms/Button";
import { Badge } from "@/components/atoms/Badge";
import { ButtonLink } from "@/components/atoms/ButtonLink";
import { PlatformProgressBar } from "@/components/platform/PlatformProgressBar";
import type { ActionEntry } from "@/lib/assistant/types";
import { NextStepCard } from "./NextStepCard";

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
      <div className="flex flex-col items-start gap-4">
        <p className="sk-text-body-large-semibold text-sko-text-default">You&apos;re set.</p>
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
    <div className="flex flex-col gap-3">
      <div className="overflow-hidden rounded-card-inset border border-sko-border-subtle">
        <div className="flex flex-col gap-2 border-b border-sko-border-subtle px-4 py-3">
          <div className="flex items-baseline justify-between gap-3">
            <p className="sk-text-title-medium-semibold text-sko-text-default">First steps</p>
            <p className="sk-text-body-small-regular text-sko-text-subtle">
              {done} of {rows.length} done
            </p>
          </div>
          <PlatformProgressBar value={(done / rows.length) * 100} label="First steps" height={4} />
        </div>
        <ol className="flex flex-col divide-y divide-sko-border-subtle">
          {rows.map((row, i) => (
            <li key={row.id} title={row.why} className="flex min-h-14 items-center gap-3 px-4 py-2">
              {row.done ? (
                <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-pill bg-sko-bg-success text-sko-icon-on-media">
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
                <span aria-hidden className="sk-text-body-small-semibold inline-flex size-6 shrink-0 items-center justify-center rounded-pill bg-sko-bg-subtle text-sko-text-subtle">
                  {i + 1}
                </span>
              )}
              <p className="sk-text-body-medium-medium min-w-0 flex-1 text-sko-text-default">
                {row.label}
                <span className="sr-only">. {row.why}</span>
              </p>
              {row.done ? (
                <Badge variant="soft" color="success" className="shrink-0">
                  Completed
                </Badge>
              ) : row.ask ? (
                <Button hierarchy="secondary" size="sm" onClick={onAsk} className="shrink-0">
                  {row.cta}
                </Button>
              ) : row.href ? (
                <ButtonLink href={row.href} hierarchy="secondary" size="sm" className="shrink-0">
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
        className="sk-text-body-small-medium min-h-11 self-start text-sko-text-subtle underline transition-colors hover:text-sko-text-default"
      >
        Skip first steps
      </button>
    </div>
  );
}
