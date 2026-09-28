import * as React from "react";
import { CircleCheck, PenLine } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { Badge } from "@/components/atoms/Badge";
import { cn } from "@/lib/utils";

/**
 * Option A (Nav in footer · action in content): the topic's PRIMARY action lives
 * in the content area, not the footer. State decides the control (DS
 * `Topic-Status-Badge` → `LMS / Course Progression Button`):
 * - incomplete (passive content) → "Mark as Complete", Buttons/Button sm Primary
 * - action     (quiz/assignment) → "Submit", Buttons/Button sm Primary
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

/* Badge v2 Style=Soft, Size=sm: a pill with no stroke and a 6px icon→label gap.
   The Badge atom still draws the V1 shape (radius 6, inset ring, 2px gap), so the
   v2 geometry is applied here until the atom gains a v2 option. */
const BADGE_V2_SOFT = "!rounded-full !ring-0 !gap-1.5";

export function TopicActionBar({ state, onComplete, onSubmit, className }: TopicActionBarProps) {
  if (state === "completed") {
    return (
      <Badge tone="success" leftIcon={CircleCheck} className={cn(BADGE_V2_SOFT, className)}>
        Marked as completed
      </Badge>
    );
  }
  if (state === "review") {
    return (
      <Badge tone="warning" leftIcon={PenLine} className={cn(BADGE_V2_SOFT, className)}>
        Under Review
      </Badge>
    );
  }
  if (state === "action") {
    return (
      <Button variant="primary" size="sm" onClick={onSubmit} className={className}>
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
