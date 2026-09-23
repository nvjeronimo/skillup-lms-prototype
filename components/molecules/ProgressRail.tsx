"use client";

import * as React from "react";
import { Check, X, Flag } from "lucide-react";
import { Icon } from "@/lib/icons";
import { cn } from "@/lib/utils";

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
 * `Quiz · Progress Bar` variant (see QuizProgressBar), because a dot per
 * question reads as noise on a long quiz.
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
      className={cn(
        "flex flex-wrap items-center justify-between gap-3 rounded-xl border border-sko-border-subtle bg-sko-bg-page px-4 py-3",
        className,
      )}
      role="group"
      aria-label={label}
    >
      <span className="sk-text-sm-medium text-sko-text-default">{label}</span>
      <ol className="flex flex-wrap items-center gap-1.5">
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
                  "flex h-7 w-7 items-center justify-center rounded-full border text-[11px] font-medium transition-colors",
                  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sko-border-primary",
                  s === "done"
                    ? "border-sko-border-success bg-sko-bg-success-soft text-sko-text-success"
                    : s === "error"
                      ? "border-sko-border-error bg-sko-bg-error-soft text-sko-text-error"
                      : s === "flagged"
                        ? "border-sko-border-warning bg-sko-bg-warning-soft text-sko-text-warning"
                        : isCurrent
                          ? "border-sko-border-primary bg-sko-bg-primary-soft text-sko-text-primary"
                          : "border-sko-border-default text-sko-text-subtle hover:bg-sko-bg-subtle",
                  isCurrent && s !== "pending" ? "ring-2 ring-sko-border-primary ring-offset-1" : "",
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
