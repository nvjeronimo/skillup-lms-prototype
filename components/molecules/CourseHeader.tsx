import * as React from "react";
import { Collapse } from "@/components/atoms/Collapse";
import { SidebarToggle } from "@/components/atoms/SidebarToggle";
import { cn } from "@/lib/utils";
import type { Partner } from "@/lib/types";

export interface CourseHeaderProps {
  eyebrow?: string;
  title: string;
  /** DS `Partner: Name` line under the course name — one or more partner names,
   *  body-small/Medium in `text/muted` (DS Provider-Partner Badge label), joined
   *  with a middle dot. */
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
  /** "label" sets the eyebrow in the DS Label style (Course Journey proposal); default Caption + uppercase. */
  eyebrowStyle?: "caption" | "label";
  /**
   * The player sidebar condenses its header while the topic list is scrolled (Nelson, 25 Oct
   * 2026): the eyebrow and the partner line fold away, the title and the toggle (or the ring)
   * stay. Leave it undefined for the fixed layout; a boolean switches to the foldable one.
   */
  condensed?: boolean;
  className?: string;
}

/**
 * DS `LMS / Sidebar / Course Header`, 122px on a two-line name: 16/16/8/16
 * padding, 4px between rows. Row one is the COURSE eyebrow (Caption/Medium,
 * tertiary) with the 24px expand/collapse toggle at its end; then the course
 * name (Body/Lead/Semibold) and the partner name line (Caption/Medium, DS
 * `Show Partner: Name`). On Mobile the toggle is hidden and the progress ring
 * sits top-right beside the rows.
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
  eyebrowStyle = "caption",
  condensed,
  className,
}: CourseHeaderProps) {
  const rowTrailing = rightSlot ?? (showToggle ? <SidebarToggle expanded={expanded} onToggle={onToggle} /> : null);
  const partnerList = partners ?? (partner ? [{ name: partner }] : []);

  if (compact) {
    return (
      <div className={cn("flex justify-center px-2 pb-2 pt-4", className)}>{rowTrailing}</div>
    );
  }

  const eyebrowClass = cn(
    "min-w-0 text-sko-text-subtle",
    eyebrowStyle === "label" ? "sk-text-label-small-semibold" : "sk-text-body-small-medium uppercase",
  );

  if (condensed !== undefined) {
    // Foldable: the toggle (or the ring) beside the column, so it stays when the eyebrow folds.
    return (
      <div
        className={cn(
          "flex items-start gap-2 px-4 pb-2 pt-4",
          showDivider && "border-b border-sko-border-subtle",
          className,
        )}
      >
        <div className="flex min-w-0 flex-1 flex-col">
          {eyebrow ? (
            <Collapse open={!condensed}>
              <p className={cn(eyebrowClass, "pb-1")}>{eyebrow}</p>
            </Collapse>
          ) : null}
          <p className="sk-text-title-medium-semibold text-sko-text-default">{title}</p>
          {partnerList.length ? (
            <Collapse open={!condensed}>
              <p className="sk-text-body-small-medium pt-1 text-sko-text-muted">
                {partnerList.map((p) => p.name).join(" · ")}
              </p>
            </Collapse>
          ) : null}
        </div>
        {rowTrailing}
        {trailing}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex items-start gap-2 px-4 pb-2 pt-4",
        showDivider && "border-b border-sko-border-subtle",
        className,
      )}
    >
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        {/* An empty eyebrow with nothing beside it leaves no empty row. */}
        {eyebrow || rowTrailing ? (
          <div className="flex items-center gap-1">
            <p
              className={cn(
                "min-w-0 flex-1 text-sko-text-subtle",
                eyebrowStyle === "label" ? "sk-text-label-small-semibold" : "sk-text-body-small-medium uppercase",
              )}
            >
              {eyebrow}
            </p>
            {rowTrailing}
          </div>
        ) : null}
        <p className="sk-text-title-medium-semibold text-sko-text-default">{title}</p>
        {partnerList.length ? (
          <p className="sk-text-body-small-medium text-sko-text-muted">
            {partnerList.map((p) => p.name).join(" · ")}
          </p>
        ) : null}
      </div>
      {trailing}
    </div>
  );
}
