import * as React from "react";
import { SidebarToggle } from "@/components/atoms/SidebarToggle";
import { cn } from "@/lib/utils";

export interface CourseHeaderProps {
  eyebrow?: string;
  title: string;
  /** DS `Show Partner: Name` — the provider line under the course name. */
  partner?: string;
  expanded?: boolean;
  onToggle?: () => void;
  /** Hide the title/eyebrow (collapsed sidebar shows just the toggle). */
  compact?: boolean;
  /** Hide the collapse toggle (mobile drawer uses its own close X). */
  showToggle?: boolean;
  /** Overrides the trailing slot on the eyebrow row — e.g. the mobile drawer's close. */
  rightSlot?: React.ReactNode;
  /** A trailing column beside all three rows, top-aligned — the Mobile variant
   *  parks the 46px progress ring here, level with the COURSE eyebrow. */
  trailing?: React.ReactNode;
  /** Bottom hairline (DS: the header carries its own 1px `border-secondary`). */
  showDivider?: boolean;
  className?: string;
}

/**
 * DS `LMS / Sidebar / Course Header`, 122px on a two-line name: 16/16/8/16
 * padding, 4px between rows. Row one is the COURSE eyebrow (Caption/Medium,
 * tertiary) with the 24px expand/collapse toggle at its end; then the course
 * name (Body/Lead/Semibold) and the partner name (Caption/Medium). On Mobile
 * the toggle is hidden and the progress ring sits top-right beside the rows.
 */
export function CourseHeader({
  eyebrow = "Course",
  title,
  partner,
  expanded = true,
  onToggle,
  compact = false,
  showToggle = true,
  rightSlot,
  trailing,
  showDivider = true,
  className,
}: CourseHeaderProps) {
  const rowTrailing = rightSlot ?? (showToggle ? <SidebarToggle expanded={expanded} onToggle={onToggle} /> : null);

  if (compact) {
    return (
      <div className={cn("flex justify-center px-2 pb-2 pt-4", className)}>{rowTrailing}</div>
    );
  }

  return (
    <div
      className={cn(
        "flex items-start gap-2 px-4 pb-2 pt-4",
        showDivider && "border-b border-sk-border-secondary",
        className,
      )}
    >
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-center gap-1">
          <p className="sk-text-xs-medium min-w-0 flex-1 uppercase text-sk-text-tertiary">{eyebrow}</p>
          {rowTrailing}
        </div>
        <p className="sk-text-lg-semibold text-sk-text-primary">{title}</p>
        {partner ? <p className="sk-text-xs-medium text-sk-text-primary">{partner}</p> : null}
      </div>
      {trailing}
    </div>
  );
}
