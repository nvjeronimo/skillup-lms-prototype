import * as React from "react";
import { Button } from "@/components/atoms/Button";
import { CourseProgressionButton, type Milestone } from "./CourseProgressionButton";
import { cn } from "@/lib/utils";

export interface TopicFooterNavProps {
  position: number;
  total: number;
  title: string;
  milestone?: Milestone;
  previousDisabled?: boolean;
  nextDisabled?: boolean;
  onPrevious?: () => void;
  onNext?: () => void;
  /** Compact mobile layout: just Previous / Next, no center info. */
  compact?: boolean;
  className?: string;
}

/**
 * Sacred footer: Previous · Unit Info / Title · Next topic. No middle action chip.
 * Previous is always present + navigable; Next is always present (may be disabled).
 */
export function TopicFooterNav({
  position,
  total,
  title,
  milestone = "Topic",
  previousDisabled = false,
  nextDisabled = false,
  onPrevious,
  onNext,
  compact = false,
  className,
}: TopicFooterNavProps) {
  return (
    <nav
      aria-label="Topic navigation"
      className={cn(
        "flex h-16 items-center justify-between gap-4 border-t border-sk-border-secondary bg-sk-bg-primary px-4 md:px-6",
        className,
      )}
    >
      <Button
        variant="secondary"
        size={compact ? "sm" : "md"}
        disabled={previousDisabled}
        onClick={onPrevious}
      >
        Previous
      </Button>

      {!compact ? (
        <div className="min-w-0 flex-1 text-center">
          <p className="sk-text-2xs-medium text-sk-text-tertiary">
            {position} of {total}
          </p>
          <p className="sk-text-sm-semibold truncate text-sk-text-primary">{title}</p>
        </div>
      ) : null}

      <CourseProgressionButton
        milestone={milestone}
        size={compact ? "sm" : "md"}
        disabled={nextDisabled}
        onClick={onNext}
      />
    </nav>
  );
}
