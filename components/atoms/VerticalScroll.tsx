import * as React from "react";
import { cn } from "@/lib/utils";

export interface VerticalScrollProps {
  /** 0–100 thumb position. */
  position?: number;
  /** Thumb height as a fraction 0–1 of the track. */
  thumbFraction?: number;
  dragging?: boolean;
  height?: number;
  className?: string;
}

/**
 * DS `Vertical Scroll` — custom scrollbar visualisation atom (decorative; real
 * scrolling uses the `.sk-scroll` native styling). Useful for documenting the
 * rail in Storybook. DS: 6px wide (Scrollbar/width) with radius 3
 * (Scrollbar/radius, fully round at 6px), no track fill, thumb in `icon/faint`.
 * The `dragging` state is prototype-only (the DS component has no variant).
 */
export function VerticalScroll({
  position = 0,
  thumbFraction = 0.4,
  dragging = false,
  height = 160,
  className,
}: VerticalScrollProps) {
  const thumbHeight = Math.max(24, height * thumbFraction);
  const travel = height - thumbHeight;
  const top = (position / 100) * travel;
  return (
    <div
      className={cn("relative w-1.5 rounded-full", className)}
      style={{ height }}
      role="presentation"
    >
      <div
        className={cn(
          "absolute left-0 w-1.5 rounded-full transition-colors",
          // token-lint-disable-next-line DS binds the thumb fill to icon/faint (a mark, not a surface under content)
          dragging ? "bg-sko-bg-primary" : "bg-sko-icon-faint",
        )}
        style={{ height: thumbHeight, top }}
      />
    </div>
  );
}
