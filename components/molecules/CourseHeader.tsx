import * as React from "react";
import { PartnerLogo } from "@/components/atoms/PartnerLogo";
import { SidebarToggle } from "@/components/atoms/SidebarToggle";
import { cn } from "@/lib/utils";
import type { Partner } from "@/lib/types";

export interface CourseHeaderProps {
  eyebrow?: string;
  title: string;
  /** DS `Partner logos` row under the course name: one to n partners, 24px
   *  logos, 8px apart, wrapping when they run out of width. */
  partners?: Partner[];
  /** Legacy single-name form; equivalent to `partners=[{ name }]`. */
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
 * name (Body/Lead/Semibold) and the partner logos (24px, DS `Show partner
 * logos` · `Show partner 2` · `Show partner 3`). On Mobile the toggle is hidden
 * and the progress ring sits top-right beside the rows.
 */
export function CourseHeader({
  eyebrow = "Course",
  title,
  partners,
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
  const partnerList = partners ?? (partner ? [{ name: partner }] : []);

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
        {partnerList.length ? (
          <div className="flex flex-wrap items-center gap-2" aria-label="Course partners">
            {partnerList.map((p) => (
              <PartnerLogo key={p.name} partner={p} />
            ))}
          </div>
        ) : null}
      </div>
      {trailing}
    </div>
  );
}
