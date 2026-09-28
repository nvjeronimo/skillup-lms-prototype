import * as React from "react";
import { ArrowRight, CircleCheck, PenLine } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { Badge } from "@/components/atoms/Badge";

/**
 * Option A (Nav in footer · action in content): the topic's PRIMARY action lives
 * in the content area, not the footer. State decides the control (DS
 * `Topic-Status-Badge` → `LMS / Course Progression Button`):
 * - incomplete (passive content) → "Mark as Complete", Buttons/Button sm Primary
 * - action     (quiz/assignment) → "Submit" + trailing arrow-right, Buttons/Button sm
 *   Primary (DS Milestone=Submit)
 * - review     (graded, submitted) → "Under Review", Badge v2 Soft sm Warning
 * - completed  → "Marked as completed", Badge v2 Soft sm Success
 */
export type TopicActionState = "incomplete" | "action" | "review" | "completed";

export interface TopicActionBarProps {
  state: TopicActionState;
  onComplete?: () => void;
  onSubmit?: () => void;
  className?: string;
}

export function TopicActionBar({ state, onComplete, onSubmit, className }: TopicActionBarProps) {
  if (state === "completed") {
    return (
      <Badge color="success" leftIcon={CircleCheck} className={className}>
        Marked as completed
      </Badge>
    );
  }
  if (state === "review") {
    return (
      <Badge color="warning" leftIcon={PenLine} className={className}>
        Under Review
      </Badge>
    );
  }
  if (state === "action") {
    return (
      <Button
        variant="primary"
        size="sm"
        rightIcon={ArrowRight}
        onClick={onSubmit}
        className={className}
      >
        Submit
      </Button>
    );
  }
  return (
    <Button variant="primary" size="sm" onClick={onComplete} className={className}>
      Mark as Complete
    </Button>
  );
}
