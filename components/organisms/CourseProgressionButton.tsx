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
 * - Topic  → Brand/Secondary "Next" + arrow. Naming the next topic inside the button
 *            was tried and parked (TBD, Sep 2026): for now the label is always just "Next".
 * - Module → "MODULE COMPLETED" caption (text/primary, body-small/Medium) + Brand/Primary
 *            "Go to next Module" + arrow.
 * - Course → "COURSE COMPLETED" caption (text/success) + Success/Primary (bg/success)
 *            "Go to next Course" + arrow.
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
        hierarchy="secondary"
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
            isCourse ? "text-sko-text-success" : "text-sko-text-primary",
          )}
        >
          {isCourse ? "Course completed" : "Module completed"}
        </span>
      ) : null}
      <Button
        tone={isCourse ? "success" : "brand"}
        hierarchy="primary"
        size={size}
        rightIcon={ArrowRight}
        disabled={disabled}
        onClick={onClick}
      >
        {isCourse ? "Go to next Course" : "Go to next Module"}
      </Button>
    </span>
  );
}
