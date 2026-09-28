import * as React from "react";
import { Bookmark as BookmarkIcon } from "lucide-react";
import { iconStroke, cn } from "@/lib/utils";

export interface BookmarkButtonProps {
  bookmarked: boolean;
  onToggle?: () => void;
  size?: number;
  /** Context label, e.g. the topic title — overrides the generic label. */
  itemLabel?: string;
  className?: string;
}

/** Bookmark toggle — DS `bookmark` Bookmarked = No · Yes, 16×16. Bookmarked fills and strokes in `icon/primary`. */
export function BookmarkButton({
  bookmarked,
  onToggle,
  size = 16,
  itemLabel,
  className,
}: BookmarkButtonProps) {
  const ariaLabel = itemLabel
    ? bookmarked
      ? `Remove bookmark from ${itemLabel}`
      : `Bookmark ${itemLabel}`
    : bookmarked
      ? "Remove bookmark"
      : "Add bookmark";
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={bookmarked}
      aria-label={ariaLabel}
      className={cn(
        "inline-flex items-center justify-center rounded-md p-1 transition-colors duration-200 hover:bg-sko-bg-primary-soft",
        bookmarked ? "text-sko-icon-primary" : "text-sko-text-subtle",
        className,
      )}
    >
      <BookmarkIcon
        size={size}
        strokeWidth={iconStroke(size)}
        fill={bookmarked ? "currentColor" : "none"}
      />
    </button>
  );
}
