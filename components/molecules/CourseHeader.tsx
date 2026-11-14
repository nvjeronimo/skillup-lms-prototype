import * as React from "react";
import { Collapse } from "@/components/atoms/Collapse";
import { SidebarToggle } from "@/components/atoms/SidebarToggle";
import { cn } from "@/lib/utils";
import type { Partner } from "@/lib/types";
import styles from "./CourseHeader.module.css";

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
  condensed,
  className,
}: CourseHeaderProps) {
  const rowTrailing = rightSlot ?? (showToggle ? <SidebarToggle expanded={expanded} onToggle={onToggle} /> : null);
  const partnerList = partners ?? (partner ? [{ name: partner }] : []);

  if (compact) {
    return (
      <div className={cn(styles.compact, className)}>{rowTrailing}</div>
    );
  }

  // The eyebrow is set in the DS Label style, not inline uppercase (Course Journey, promoted by
  // Nelson, 27 Oct 2026).
  const eyebrowClass = `sk-text-label-small-semibold ${styles.eyebrow}`;

  if (condensed !== undefined) {
    // Foldable: the toggle (or the ring) beside the column, so it stays when the eyebrow folds.
    return (
      <div
        className={cn(styles.header, showDivider && styles.divider, className)}
      >
        <div className={styles.column}>
          {/* Each line steps out in two beats (`.sk-fold`, globals.css): it fades, then its room closes. */}
          {eyebrow ? (
            <Collapse open={!condensed} className="sk-fold">
              <p className={cn(eyebrowClass, styles.eyebrowFolding)}>{eyebrow}</p>
            </Collapse>
          ) : null}
          <p className={`sk-text-title-medium-semibold ${styles.title}`}>{title}</p>
          {partnerList.length ? (
            <Collapse open={!condensed} className="sk-fold">
              <p className={`sk-text-body-small-medium ${styles.partners} ${styles.partnersFolding}`}>
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
      className={cn(styles.header, showDivider && styles.divider, className)}
    >
      <div className={`${styles.column} ${styles.rows}`}>
        {/* An empty eyebrow with nothing beside it leaves no empty row. */}
        {eyebrow || rowTrailing ? (
          <div className={styles.eyebrowRow}>
            <p className={cn(eyebrowClass, styles.eyebrowFill)}>{eyebrow}</p>
            {rowTrailing}
          </div>
        ) : null}
        <p className={`sk-text-title-medium-semibold ${styles.title}`}>{title}</p>
        {partnerList.length ? (
          <p className={`sk-text-body-small-medium ${styles.partners}`}>
            {partnerList.map((p) => p.name).join(" · ")}
          </p>
        ) : null}
      </div>
      {trailing}
    </div>
  );
}
