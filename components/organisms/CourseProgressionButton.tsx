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
    <span className={cn("flex items-center gap-3", compact && "min-w-0", className)}>
      {!compact ? (
        <span
          className={cn(
            // Shown only when the footer row is at least 36rem wide (the nav is the
            // container): on a tablet next to the sidebar there is no room for it.
            "sk-text-xs-medium hidden shrink-0 whitespace-nowrap uppercase [@container(min-width:36rem)]:inline",
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
        // Mobile: the label may take two lines; the button grows instead of clipping it.
        className={compact ? "!h-auto min-h-9 py-1.5 text-left" : "shrink-0 whitespace-nowrap"}
      >
        {isCourse ? "Go to next Course" : "Go to next Module"}
      </Button>
    </span>
  );
}
