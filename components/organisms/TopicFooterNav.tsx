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
  /** Mobile (≤768): title hidden, milestone captions hidden. */
  compact?: boolean;
  className?: string;
}

/**
 * DS `LMS / Topic Footer Nav` (Default V1): 12/16 padding, 16px gap, 1px top
 * hairline, 8px bottom corners (Radius/fixed-md), three equal columns —
 * Previous (neutral outline) · Unit info ("n of N" Body/Small/Semibold over the title, Caption/Regular, both
 * text-tertiary) · Next (`LMS / Course Progression Button`, right-aligned).
 *
 * Responsive rules (also annotated on the Figma component):
 * - Desktop ≥1025 and Tablet 769–1024: the full row above.
 * - Mobile ≤768: same padding and 36px buttons; the topic title is hidden (the
 *   paginator stays) and milestone captions are hidden. The side columns hug their
 *   buttons (8px gap) and a milestone label may wrap to two lines.
 * Next always reads "Next" + arrow; naming the next topic in the button is TBD.
 * Previous is disabled on the first topic, never hidden; Next is never hidden.
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
        "items-center rounded-b-lg border-t border-sko-border-subtle bg-sko-bg-page px-4 py-3 [container-type:inline-size]",
        // Desktop/tablet: equal side columns keep the unit info centred, but a side never
        // shrinks below its content, so "Module completed" + "Go to next Module" pushes
        // the centre over instead of wrapping inside a 36px button.
        // Mobile: the side columns hug their buttons and the milestone label may wrap.
        compact ? "flex gap-2" : "grid grid-cols-[1fr_minmax(0,auto)_1fr] gap-4",
        className,
      )}
    >
      <div className={cn("flex items-center", compact && "flex-none")}>
        <Button variant="neutral" size="sm" disabled={previousDisabled} onClick={onPrevious}>
          Previous
        </Button>
      </div>

      {/* Unit info: the paginator is the stronger element; the title sits under it
          on tablet/desktop and is dropped on mobile. */}
      {/* Mobile: the paginator never wraps ("3 of 25" on one line); the Next side gives way. */}
      <div className={cn("text-center", compact ? "min-w-max flex-1 whitespace-nowrap" : "min-w-0")}>
        <p className="sk-text-body-medium-semibold text-sko-text-subtle">
          {position} of {total}
        </p>
        {!compact ? (
          <p className="sk-text-body-small-regular truncate text-sko-text-subtle">{title}</p>
        ) : null}
      </div>

      <div className={cn("flex items-center justify-end gap-3", compact && "min-w-0 shrink")}>
        <CourseProgressionButton
          milestone={milestone}
          size="sm"
          compact={compact}
          disabled={nextDisabled}
          onClick={onNext}
        />
      </div>
    </nav>
  );
}
