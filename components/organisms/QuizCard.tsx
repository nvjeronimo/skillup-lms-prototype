"use client";

import * as React from "react";
import { Check, X } from "lucide-react";
import { Icon } from "@/lib/icons";
import { Button } from "@/components/atoms/Button";
import { cn } from "@/lib/utils";

export type QuizState = "Start" | "Question" | "Revealed" | "Results" | "Not Passed";

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

  // Start state — quiz intro with meta + a single "Start quiz" CTA.
  if (state === "Start") {
    return (
      <div
        className={cn(
          "flex flex-col gap-3 rounded-xl border border-sk-border-secondary bg-sk-bg-primary p-5",
          className,
        )}
      >
        <span className="sk-text-2xs-medium text-sk-text-brand-secondary">Practice quiz</span>
        <h3 className="sk-text-md-semibold text-sk-text-primary">Define and measure</h3>
        <p className="sk-text-sm-regular text-sk-text-secondary">
          Check your understanding before moving on. You can retake this as many times as you like.
        </p>
        <p className="sk-text-xs-regular text-sk-text-tertiary">Module 3 · 5 questions · approx. 4 min</p>
        <div>
          <Button variant="primary" size="md" onClick={onSubmit}>
            Start quiz
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-4 rounded-xl border border-sk-border-secondary bg-sk-bg-primary p-5",
        className,
      )}
    >
      {state === "Results" || state === "Not Passed" ? (
        <div
          className={cn(
            "flex items-center gap-2 rounded-lg px-3 py-2",
            state === "Results" ? "bg-sk-bg-success-primary" : "bg-sk-bg-error-primary",
          )}
        >
          <Icon
            icon={state === "Results" ? Check : X}
            size={18}
            className={
              state === "Results" ? "text-sk-text-success-primary" : "text-sk-text-error-primary"
            }
          />
          <span
            className={cn(
              "sk-text-sm-semibold",
              state === "Results" ? "text-sk-text-success-primary" : "text-sk-text-error-primary",
            )}
          >
            {state === "Results" ? "Passed — 4 / 4 correct" : "Not passed — 2 / 4 correct"}
          </span>
        </div>
      ) : null}

      <h3 className="sk-text-md-semibold text-sk-text-primary">{question}</h3>

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
                  "sk-text-sm-medium flex w-full items-center justify-between gap-2 rounded-lg border px-3 py-2.5 text-left transition-colors",
                  showCorrect
                    ? "border-sk-text-success-primary bg-sk-bg-success-primary text-sk-text-success-primary"
                    : showWrong
                      ? "border-sk-text-error-primary bg-sk-bg-error-primary text-sk-text-error-primary"
                      : isSelected
                        ? "border-sk-border-brand bg-sk-bg-brand-section text-sk-text-brand-secondary"
                        : "border-sk-border-primary text-sk-text-primary hover:bg-sk-bg-secondary",
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
