import * as React from "react";
import { ArrowRight } from "lucide-react";
import { Button, type ButtonSize } from "@/components/atoms/Button";
import { cn } from "@/lib/utils";

export type Milestone = "Topic" | "Module" | "Course";

export interface CourseProgressionButtonProps {
  milestone?: Milestone;
  disabled?: boolean;
  size?: ButtonSize;
  /** Mobile: the milestone caption is hidden. */
  compact?: boolean;
  onClick?: () => void;
  className?: string;
}

/**
 * DS `LMS / Course Progression Button` — the footer's forward step. Navigation
 * only, never the topic's action.
 * - Topic  → Secondary outline "Next" + arrow. Naming the next topic inside the button
 *            was tried and parked (TBD, Sep 2026): for now the label is always just "Next".
 * - Module → "MODULE COMPLETE" caption (fg-brand-primary) + Primary "Go to next Module" + arrow.
 * - Course → "COURSE COMPLETE" caption (text-success-primary) + Primary "Go to next Course" + arrow.
 */
export function CourseProgressionButton({
  milestone = "Topic",
  disabled = false,
  size = "sm",
  compact = false,
  onClick,
  className,
}: CourseProgressionButtonProps) {
  if (milestone === "Topic") {
    return (
      <Button
        variant="secondary"
        size={size}
        rightIcon={ArrowRight}
        disabled={disabled}
        onClick={onClick}
        className={className}
      >
        Next
      </Button>
    );
  }

  const isCourse = milestone === "Course";
  return (
    <span className={cn("flex min-w-0 items-center gap-3", className)}>
      {!compact ? (
        <span
          className={cn(
            "sk-text-xs-medium shrink-0 uppercase",
            isCourse ? "text-sk-text-success-primary" : "text-sk-fg-brand-primary",
          )}
        >
          {isCourse ? "Course complete" : "Module complete"}
        </span>
      ) : null}
      <Button variant="primary" size={size} rightIcon={ArrowRight} disabled={disabled} onClick={onClick}>
        {isCourse ? "Go to next Course" : "Go to next Module"}
      </Button>
    </span>
  );
}
