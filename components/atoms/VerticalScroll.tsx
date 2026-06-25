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
 * Custom scrollbar visualisation atom (decorative; real scrolling uses the
 * `.sk-scroll` native styling). Useful for documenting the rail in Storybook.
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
      className={cn("relative w-2 rounded-full bg-sk-bg-secondary", className)}
      style={{ height }}
      role="presentation"
    >
      <div
        className={cn(
          "absolute left-0 w-2 rounded-full transition-colors",
          dragging ? "bg-sk-fg-brand" : "bg-sk-border-primary",
        )}
        style={{ height: thumbHeight, top }}
      />
    </div>
  );
}
