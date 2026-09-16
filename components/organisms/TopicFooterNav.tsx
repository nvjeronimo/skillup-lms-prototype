import * as React from "react";
import { Button } from "@/components/atoms/Button";
import { CourseProgressionButton, type Milestone } from "./CourseProgressionButton";
import { cn } from "@/lib/utils";

export interface TopicFooterNavProps {
  position: number;
  total: number;
  title: string;
  /** Title of the next topic — shown inside the Next button on desktop/tablet. */
  nextTitle?: string;
  milestone?: Milestone;
  previousDisabled?: boolean;
  nextDisabled?: boolean;
  onPrevious?: () => void;
  onNext?: () => void;
  /** Mobile (≤768): title hidden, Next drops the topic name, captions hidden. */
  compact?: boolean;
  className?: string;
}

/**
 * DS `LMS / Topic Footer Nav` (Default V1): 12/16 padding, 16px gap, 1px top
 * hairline, three equal columns — Previous (neutral outline) · Unit info
 * ("n of N" Body/Small/Semibold over the title, Caption/Regular, both
 * text-tertiary) · Next (`LMS / Course Progression Button`, right-aligned).
 *
 * Responsive rules (also annotated on the Figma component):
 * - Desktop ≥1025 and Tablet 769–1024: the full row above; the Next label
 *   carries the next topic's name and truncates at 186px.
 * - Mobile ≤768: same padding and 36px buttons; the topic title is hidden (the
 *   paginator stays), Next reads just "Next", milestone captions are hidden.
 * Previous is disabled on the first topic, never hidden; Next is never hidden.
 */
export function TopicFooterNav({
  position,
  total,
  title,
  nextTitle,
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
        "flex items-center gap-4 border-t border-sk-border-secondary bg-sk-bg-primary px-4 py-3",
        className,
      )}
    >
      <div className="flex flex-1 items-center">
        <Button variant="neutral" size="sm" disabled={previousDisabled} onClick={onPrevious}>
          Previous
        </Button>
      </div>

      {/* Unit info: the paginator is the stronger element; the title sits under it
          on tablet/desktop and is dropped on mobile. */}
      <div className="min-w-0 flex-1 text-center">
        <p className="sk-text-sm-semibold text-sk-text-tertiary">
          {position} of {total}
        </p>
        {!compact ? (
          <p className="sk-text-xs-regular truncate text-sk-text-tertiary">{title}</p>
        ) : null}
      </div>

      <div className="flex min-w-0 flex-1 items-center justify-end">
        <CourseProgressionButton
          milestone={milestone}
          nextTitle={nextTitle}
          size="sm"
          compact={compact}
          disabled={nextDisabled}
          onClick={onNext}
        />
      </div>
    </nav>
  );
}
