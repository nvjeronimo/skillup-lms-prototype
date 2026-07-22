"use client";

import * as React from "react";
import { Check, X, Flag } from "lucide-react";
import { Icon } from "@/lib/icons";
import { cn } from "@/lib/utils";

export type QuizQuestionState = "unanswered" | "current" | "correct" | "incorrect" | "flagged";

export interface QuizProgressRailProps {
  states: QuizQuestionState[];
  currentIndex: number;
  /** Single position label, e.g. "Question 1 of 3 · Practice quiz". */
  label: string;
  onJump?: (index: number) => void;
  className?: string;
}

/**
 * In-quiz progress map. Open edX has no quiz-level concept — the rail is
 * computed client-side from the per-question states, which is exactly why it
 * has to live in our shell rather than in the problem renderer.
 */
export function QuizProgressRail({
  states,
  currentIndex,
  label,
  onJump,
  className,
}: QuizProgressRailProps) {

  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-3 rounded-xl border border-sk-border-secondary bg-sk-bg-primary px-4 py-3",
        className,
      )}
      role="group"
      aria-label="Quiz progress"
    >
      <span className="sk-text-sm-medium text-sk-text-primary">{label}</span>
      <ol className="flex flex-wrap items-center gap-1.5">
        {states.map((s, i) => {
          const isCurrent = i === currentIndex;
          return (
            <li key={i}>
              <button
                type="button"
                onClick={() => onJump?.(i)}
                aria-label={`Question ${i + 1} — ${s}`}
                aria-current={isCurrent ? "step" : undefined}
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full border text-[11px] font-medium transition-colors",
                  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sk-border-brand",
                  s === "correct"
                    ? "border-sk-text-success-primary bg-sk-bg-success-primary text-sk-text-success-primary"
                    : s === "incorrect"
                      ? "border-sk-text-error-primary bg-sk-bg-error-primary text-sk-text-error-primary"
                      : s === "flagged"
                        ? "border-sk-text-warning-primary bg-sk-bg-warning-primary text-sk-text-warning-primary"
                        : isCurrent
                          ? "border-sk-border-brand bg-sk-bg-brand-section text-sk-text-brand-secondary"
                          : "border-sk-border-primary text-sk-text-tertiary hover:bg-sk-bg-secondary",
                  isCurrent && s !== "unanswered" ? "ring-2 ring-sk-border-brand ring-offset-1" : "",
                )}
              >
                {s === "correct" ? (
                  <Icon icon={Check} size={13} />
                ) : s === "incorrect" ? (
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
