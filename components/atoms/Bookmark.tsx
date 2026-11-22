import * as React from "react";
import { Bookmark as BookmarkIcon } from "lucide-react";
import { iconStroke, cn } from "@/lib/utils";
import styles from "./Bookmark.module.css";

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
  // One name in both states ("Bookmark X"): aria-pressed says whether it is on, so the state is
  // not spoken twice ("Remove bookmark…, pressed"). Course Journey, promoted by Nelson, 27 Oct 2026.
  const ariaLabel = itemLabel ? `Bookmark ${itemLabel}` : "Bookmark";
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
        styles.bookmark,
        bookmarked ? styles.on : styles.off,
        className,
      )}
    >
      {/* The fill is a colour (transparent ↔ currentColor), so it eases with the stroke. */}
      <BookmarkIcon
        size={size}
        strokeWidth={iconStroke(size)}
        className={cn(
          styles.icon,
          bookmarked ? styles.filled : styles.empty,
          toggled && bookmarked && "sk-animate-bookmark",
        )}
      />
    </button>
  );
}
