"use client";

import * as React from "react";
import { Check, X, Flag } from "lucide-react";
import { Icon } from "@/lib/icons";
import { cn } from "@/lib/utils";

export type RailItemState = "pending" | "current" | "done" | "error" | "flagged";

export interface ProgressRailProps {
  states: RailItemState[];
  currentIndex: number;
  /** Single position label, e.g. "Question 1 of 3 · Practice quiz". */
  label: string;
  onJump?: (index: number) => void;
  className?: string;
}

/**
 * Position + progress for any multi-item topic (quiz questions, activity
 * steps). One line: the label carries the position, the dots carry per-item
 * state — so neither has to be repeated in prose elsewhere on the screen.
 *
 * For quizzes this is the unit navigator: Open edX groups a quiz's questions in
 * a subsection and renders one tab per unit, but exposes no per-question
 * counter, so the label is computed client-side in our shell.
 */
export function ProgressRail({
  states,
  currentIndex,
  label,
  onJump,
  className,
}: ProgressRailProps) {

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
                  s === "done"
                    ? "border-sk-text-success-primary bg-sk-bg-success-primary text-sk-text-success-primary"
                    : s === "error"
                      ? "border-sk-text-error-primary bg-sk-bg-error-primary text-sk-text-error-primary"
                      : s === "flagged"
                        ? "border-sk-text-warning-primary bg-sk-bg-warning-primary text-sk-text-warning-primary"
                        : isCurrent
                          ? "border-sk-border-brand bg-sk-bg-brand-section text-sk-text-brand-secondary"
                          : "border-sk-border-primary text-sk-text-tertiary hover:bg-sk-bg-secondary",
                  isCurrent && s !== "pending" ? "ring-2 ring-sk-border-brand ring-offset-1" : "",
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
