"use client";

import * as React from "react";
import { Check, X } from "lucide-react";
import { Icon } from "@/lib/icons";
import { Button } from "@/components/atoms/Button";
import { cn } from "@/lib/utils";

export type QuizState = "Question" | "Revealed" | "Results" | "Not Passed";

export interface QuizOption {
  id: string;
  label: string;
  correct?: boolean;
}

export interface QuizCardProps {
  state?: QuizState;
  question?: string;
  options?: QuizOption[];
  selectedId?: string;
  onSelect?: (id: string) => void;
  onSubmit?: () => void;
  className?: string;
}

const DEFAULT_OPTIONS: QuizOption[] = [
  { id: "a", label: "Reduce process variation and defects", correct: true },
  { id: "b", label: "Increase production speed at any cost" },
  { id: "c", label: "Eliminate all documentation" },
  { id: "d", label: "Replace all staff with automation" },
];

/** Quiz question with state-specific feedback: Question / Revealed / Results / Not Passed. */
export function QuizCard({
  state = "Question",
  question = "What is the primary goal of Six Sigma?",
  options = DEFAULT_OPTIONS,
  selectedId,
  onSelect,
  onSubmit,
  className,
}: QuizCardProps) {
  const revealed = state === "Revealed" || state === "Results" || state === "Not Passed";

  return (
    <div
      className={cn(
        "flex flex-col gap-4 rounded-xl border border-lms-border-secondary bg-lms-bg-primary p-5",
        className,
      )}
    >
      {state === "Results" || state === "Not Passed" ? (
        <div
          className={cn(
            "flex items-center gap-2 rounded-lg px-3 py-2",
            state === "Results" ? "bg-lms-bg-success-primary" : "bg-lms-bg-error-primary",
          )}
        >
          <Icon
            icon={state === "Results" ? Check : X}
            size={18}
            className={
              state === "Results" ? "text-lms-text-success-primary" : "text-lms-text-error-primary"
            }
          />
          <span
            className={cn(
              "lms-text-sm-semibold",
              state === "Results" ? "text-lms-text-success-primary" : "text-lms-text-error-primary",
            )}
          >
            {state === "Results" ? "Passed — 4 / 4 correct" : "Not passed — 2 / 4 correct"}
          </span>
        </div>
      ) : null}

      <h3 className="lms-text-md-semibold text-lms-text-primary">{question}</h3>

      <ul className="flex flex-col gap-2">
        {options.map((opt) => {
          const isSelected = opt.id === selectedId;
          const showCorrect = revealed && opt.correct;
          const showWrong = revealed && isSelected && !opt.correct;
          return (
            <li key={opt.id}>
              <button
                type="button"
                onClick={() => onSelect?.(opt.id)}
                aria-pressed={isSelected}
                className={cn(
                  "lms-text-sm-medium flex w-full items-center justify-between gap-2 rounded-lg border px-3 py-2.5 text-left transition-colors",
                  showCorrect
                    ? "border-lms-text-success-primary bg-lms-bg-success-primary text-lms-text-success-primary"
                    : showWrong
                      ? "border-lms-text-error-primary bg-lms-bg-error-primary text-lms-text-error-primary"
                      : isSelected
                        ? "border-lms-border-brand bg-lms-bg-brand-section text-lms-text-brand-secondary"
                        : "border-lms-border-primary text-lms-text-primary hover:bg-lms-bg-secondary",
                )}
              >
                <span>{opt.label}</span>
                {showCorrect ? <Icon icon={Check} size={16} /> : null}
                {showWrong ? <Icon icon={X} size={16} /> : null}
              </button>
            </li>
          );
        })}
      </ul>

      {state === "Question" ? (
        <div className="flex justify-end">
          <Button variant="primary" onClick={onSubmit} disabled={!selectedId}>
            Submit answer
          </Button>
        </div>
      ) : null}
      {state === "Not Passed" ? (
        <div className="flex justify-end">
          <Button variant="secondary" onClick={onSubmit}>
            Try again
          </Button>
        </div>
      ) : null}
    </div>
  );
}
