import * as React from "react";
import { cn } from "@/lib/utils";
import styles from "./SectionHeader.module.css";

export interface SectionHeaderProps {
  label: string;
  /** Show a collapse caret. */
  collapsible?: boolean;
  collapsed?: boolean;
  onToggle?: () => void;
  className?: string;
}

/**
 * DS `LMS / Section Header` — sub-section label inside modules (e.g.
 * "Section 1 · Define and measure"). A 40px (minimum) row on `bg/subtle`,
 * radius 6, 16px side padding; the 18px title line centres at 11px. The row
 * grows when the label wraps or the text scale rises (decision 016). Title is
 * body-small/Medium in `text/muted`, and the caret is a "▾" text glyph in
 * body-small/Medium `text/subtle`, 8px after the title (left-aligned, not
 * pinned to the far edge).
 */
export function SectionHeader({
  label,
  collapsible = false,
  collapsed = false,
  onToggle,
  className,
}: SectionHeaderProps) {
  const content = (
    <>
      <span className={cn("sk-text-body-small-medium", styles.label)}>{label}</span>
      {collapsible ? (
        <span
          aria-hidden
          className={cn(
            "sk-text-body-small-medium",
            styles.caret,
            collapsed && styles.collapsed,
          )}
        >
          ▾
        </span>
      ) : null}
    </>
  );

  const row = styles.row;

  if (collapsible) {
    return (
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={!collapsed}
        className={cn(row, styles.toggle, className)}
      >
        {content}
      </button>
    );
  }

  return <div className={cn(row, className)}>{content}</div>;
}
