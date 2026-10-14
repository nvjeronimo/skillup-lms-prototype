"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { Icon } from "@/lib/icons";
import { iconStroke } from "@/lib/utils";
import { Button } from "@/components/atoms/Button";
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

  return (
    <div className="flex flex-col gap-4">
      <p className="sk-text-body-medium-regular text-sko-text-default">
        Welcome, {firstName}. Five things to get you started.
      </p>
      <div className="flex flex-col gap-2">
        <p className="sk-text-body-small-medium text-sko-text-subtle">
          {done} of {rows.length} done
        </p>
        <PlatformProgressBar value={(done / rows.length) * 100} label="First steps" height={4} />
      </div>
      <ol className="flex flex-col">
        {rows.map((row) => (
          <li
            key={row.id}
            className="flex min-h-11 items-start gap-3 border-b border-sko-border-subtle py-3 last:border-b-0"
          >
            {row.done ? (
              <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sko-bg-success-soft text-sko-icon-success">
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
                    <path className="sk-draw-check" d="M4 12l5 5L20 6" pathLength={1} />
                  </svg>
                )}
              </span>
            ) : (
              <span aria-hidden className="mt-0.5 h-5 w-5 shrink-0 rounded-full border border-sko-border-default" />
            )}
            <div className="flex min-w-0 flex-1 flex-col items-start gap-2">
              <div>
                <p className="sk-text-body-medium-semibold text-sko-text-default">{row.label}</p>
                <p className="sk-text-body-small-regular text-sko-text-subtle">{row.why}</p>
              </div>
              {row.done ? (
                <p className="sk-text-body-small-medium text-sko-text-success">Done</p>
              ) : row.ask ? (
                <Button hierarchy="secondary" size="sm" onClick={onAsk}>
                  {row.cta}
                </Button>
              ) : row.href ? (
                <ButtonLink href={row.href} hierarchy="secondary" size="sm" className="!h-auto min-h-9 py-1.5">
                  {row.cta}
                </ButtonLink>
              ) : null}
            </div>
          </li>
        ))}
      </ol>
      <button
        type="button"
        onClick={onSkip}
        className="sk-text-body-small-medium min-h-11 self-start text-sko-text-subtle underline hover:text-sko-text-default"
      >
        Skip first steps
      </button>
    </div>
  );
}
