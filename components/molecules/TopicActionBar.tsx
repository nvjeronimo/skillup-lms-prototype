import * as React from "react";
import { ArrowRight, PenLine } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { Badge } from "@/components/atoms/Badge";
import { cn } from "@/lib/utils";

/**
 * Option A (Nav in footer · action in content): the topic's PRIMARY action lives
 * in the content area, not the footer. State decides the control (DS
 * `Topic-Status-Badge` → `LMS / Course Progression Button`):
 * - incomplete (passive content) → "Mark as Complete", Buttons/Button sm Primary
 * - action     (quiz/assignment) → "Submit" + trailing arrow-right, Buttons/Button sm
 *   Primary (DS Milestone=Submit)
 * - review     (graded, submitted) → "Under Review", Badge Soft sm Warning
 * - completed  → "Marked as completed", Badge Soft sm Success, label only. The same label on
 *   every type, also the ones that complete by themselves (Nelson, 13 Oct 2026).
 */
export type TopicActionState = "incomplete" | "action" | "review" | "completed";

export interface TopicActionBarProps {
  state: TopicActionState;
  onComplete?: () => void;
  onSubmit?: () => void;
  /**
   * True while the page has another primary action the learner has not used yet: a partner
   * lab that has not been opened, where the launch button is the primary. Mark as Complete is
   * then Secondary, and turns Primary once the lab has been opened (Nelson, 12 Oct 2026).
   */
  secondary?: boolean;
  /**
   * The topic was completed just now: the completed badge pops in (the first beat of the
   * completion chain). The toast announces it; the pop is visual only.
   */
  fresh?: boolean;
  className?: string;
}

export function TopicActionBar({
  state,
  onComplete,
  onSubmit,
  secondary = false,
  fresh = false,
  className,
}: TopicActionBarProps) {
  if (state === "completed") {
    return (
      // DS `Topic-Status-Badge`, Completed: Badge Soft sm Success, label only, and always
      // "Marked as completed", whatever completed the topic (Nelson, 13 Oct 2026).
      <Badge color="success" className={cn(fresh && "sk-animate-pop", className)}>
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
    <Button variant={secondary ? "secondary" : "primary"} size="sm" onClick={onComplete} className={className}>
      Mark as Complete
    </Button>
  );
}
