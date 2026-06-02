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
  className?: string;
}

/** Top of every Sidebar v2 variant: course label + title + collapse toggle. */
export function CourseHeader({
  eyebrow = "Course",
  title,
  expanded = true,
  onToggle,
  compact = false,
  className,
}: CourseHeaderProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-2 border-b border-lms-border-secondary px-3 py-4",
        compact && "justify-center",
        className,
      )}
    >
      {!compact ? (
        <div className="min-w-0 flex-1">
          <p className="lms-text-2xs-medium text-lms-text-tertiary">{eyebrow}</p>
          <p className="lms-text-lg-medium mt-0.5 truncate text-lms-text-primary">{title}</p>
        </div>
      ) : null}
      <SidebarToggle expanded={expanded} onToggle={onToggle} />
    </div>
  );
}
