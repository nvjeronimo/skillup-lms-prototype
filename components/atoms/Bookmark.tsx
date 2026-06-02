import * as React from "react";
import { Bookmark as BookmarkIcon } from "lucide-react";
import { iconStroke, cn } from "@/lib/utils";

export interface BookmarkButtonProps {
  bookmarked: boolean;
  onToggle?: () => void;
  size?: number;
  className?: string;
}

/** Bookmark toggle — Bookmarked = No · Yes. Filled teal when bookmarked. */
export function BookmarkButton({
  bookmarked,
  onToggle,
  size = 18,
  className,
}: BookmarkButtonProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={bookmarked}
      aria-label={bookmarked ? "Remove bookmark" : "Add bookmark"}
      className={cn(
        "inline-flex items-center justify-center rounded-md p-1 transition-colors duration-200 hover:bg-lms-bg-brand-section",
        bookmarked ? "text-lms-text-brand-secondary" : "text-lms-fg-quaternary",
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
