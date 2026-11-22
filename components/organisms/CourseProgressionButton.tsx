import * as React from "react";
import { ArrowRight } from "lucide-react";
import { Button, type ButtonSize } from "@/components/atoms/Button";
import { cn } from "@/lib/utils";
import styles from "./CourseProgressionButton.module.css";

export type Milestone = "Topic" | "Module" | "Course";

export interface CourseProgressionButtonProps {
  milestone?: Milestone;
  disabled?: boolean;
  size?: ButtonSize;
  /** Mobile: the milestone caption is hidden. */
  compact?: boolean;
  /** The current topic is complete: the Topic step turns Brand/Primary (Nelson, 22 Oct 2026). */
  topicComplete?: boolean;
  onClick?: () => void;
  className?: string;
}

/**
 * DS `LMS / Course Progression Button` — the footer's forward step. Navigation
 * only, never the topic's action.
 * - Topic  → "Next" + arrow: Brand/Secondary while the topic is not complete, Brand/Primary
 *            once it is (Nelson, 22 Oct 2026: moving on becomes the one main action only when
 *            there is nothing left to do here). Naming the next topic inside the button was tried
 *            and parked (TBD, Sep 2026): for now the label is always just "Next".
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
  topicComplete = false,
  onClick,
  className,
}: CourseProgressionButtonProps) {
  if (milestone === "Topic") {
    return (
      <Button
        hierarchy={topicComplete ? "primary" : "secondary"}
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
    <span className={cn(styles.group, compact && styles.groupCompact, className)}>
      {!compact ? (
        <span
          className={cn(
            // Shown only when the footer row is at least 36rem wide (the nav is the
            // container): on a tablet next to the sidebar there is no room for it.
            "sk-text-body-small-medium",
            styles.caption,
            isCourse ? styles.captionCourse : styles.captionModule,
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
        className={compact ? styles.buttonCompact : styles.buttonFull}
      >
        {isCourse ? "Go to next Course" : "Go to next Module"}
      </Button>
    </span>
  );
}
