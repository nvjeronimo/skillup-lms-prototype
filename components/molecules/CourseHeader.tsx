import * as React from "react";
import { SidebarToggle } from "@/components/atoms/SidebarToggle";
import { cn } from "@/lib/utils";

export interface CourseHeaderProps {
  eyebrow?: string;
  title: string;
  expanded?: boolean;
  onToggle?: () => void;
  /** Hide the title/eyebrow (collapsed sidebar shows just the toggle). */
  compact?: boolean;
  /** Hide the collapse toggle (mobile drawer uses its own close X). */
  showToggle?: boolean;
  /** Overrides the trailing slot — e.g. the mobile progress ring instead of the toggle. */
  rightSlot?: React.ReactNode;
  className?: string;
}

/** Top of every Sidebar v2 variant: course label + title + collapse toggle. */
export function CourseHeader({
  eyebrow = "Course",
  title,
  expanded = true,
  onToggle,
  compact = false,
  showToggle = true,
  rightSlot,
  className,
}: CourseHeaderProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-2 border-b border-sk-border-secondary px-3 py-4",
        compact && "justify-center",
        className,
      )}
    >
      {!compact ? (
        <div className="min-w-0 flex-1">
          <p className="sk-text-2xs-medium text-sk-text-tertiary">{eyebrow}</p>
          <p className="sk-text-lg-semibold mt-1 text-sk-text-primary">{title}</p>
        </div>
      ) : null}
      {rightSlot ?? (showToggle ? <SidebarToggle expanded={expanded} onToggle={onToggle} /> : null)}
    </div>
  );
}
