"use client";

import * as React from "react";
import { Bookmark as BookmarkIcon } from "lucide-react";
import { iconStroke, cn } from "@/lib/utils";

export interface BookmarkButtonProps {
  bookmarked: boolean;
  onToggle?: () => void;
  size?: number;
  /** Context label, e.g. the topic title — overrides the generic label. */
  itemLabel?: string;
  /**
   * Keep the name the same in both states ("Bookmark X") and let aria-pressed say whether it is
   * on, so the state is not spoken twice ("Remove bookmark…, pressed"). Course Journey proposal.
   */
  stableLabel?: boolean;
  className?: string;
}

/** Bookmark toggle — DS `bookmark` Bookmarked = No · Yes, 16×16. Bookmarked fills and strokes in `icon/primary`. */
export function BookmarkButton({
  bookmarked,
  onToggle,
  size = 16,
  itemLabel,
  stableLabel = false,
  className,
}: BookmarkButtonProps) {
  const ariaLabel = stableLabel
    ? itemLabel
      ? `Bookmark ${itemLabel}`
      : "Bookmark"
    : itemLabel
    ? bookmarked
      ? `Remove bookmark from ${itemLabel}`
      : `Bookmark ${itemLabel}`
    : bookmarked
      ? "Remove bookmark"
      : "Add bookmark";
  // Off → on swells the icon once; not on first paint (a row that mounts bookmarked stays
  // still). The class leaves when the bookmark goes off, so the next on replays it.
  const [toggled, setToggled] = React.useState(false);
  const first = React.useRef(bookmarked);
  React.useEffect(() => {
    if (bookmarked !== first.current) setToggled(true);
  }, [bookmarked]);
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={bookmarked}
      aria-label={ariaLabel}
      className={cn(
        "inline-flex items-center justify-center rounded-control p-1 transition-[color,background-color] duration-short3 hover:bg-sko-bg-primary-soft",
        bookmarked ? "text-sko-icon-primary" : "text-sko-text-subtle",
        className,
      )}
    >
      {/* The fill is a colour (transparent ↔ currentColor), so it eases with the stroke. */}
      <BookmarkIcon
        size={size}
        strokeWidth={iconStroke(size)}
        className={cn(
          "transition-[fill] duration-short3",
          bookmarked ? "fill-current" : "fill-transparent",
          toggled && bookmarked && "sk-animate-bookmark",
        )}
      />
    </button>
  );
}
