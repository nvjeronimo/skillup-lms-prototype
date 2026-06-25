import * as React from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { Badge } from "@/components/atoms/Badge";

/**
 * Option A (Nav in footer · action in content): the topic's PRIMARY action lives
 * in the content area, not the footer. State decides the control:
 * - incomplete (passive content) → "Mark as Complete" button
 * - action     (quiz/assignment) → "Submit answers" button
 * - review     (graded, submitted) → "Under Review" badge
 * - completed  → "✓ Marked as Completed" badge
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
      <Badge tone="success" leftIcon={Check} className={className}>
        Marked as Completed
      </Badge>
    );
  }
  if (state === "review") {
    return (
      <Badge tone="warning" className={className}>
        Under Review
      </Badge>
    );
  }
  if (state === "action") {
    return (
      <Button variant="primary" onClick={onSubmit} className={className}>
        Submit answers
      </Button>
    );
  }
  return (
    <Button variant="primary" onClick={onComplete} className={className}>
      Mark as Complete
    </Button>
  );
}
