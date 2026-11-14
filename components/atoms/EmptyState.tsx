import * as React from "react";
import type { LucideIcon } from "lucide-react";
import { Icon } from "@/lib/icons";
import { cn, iconStroke } from "@/lib/utils";
import styles from "./EmptyState.module.css";

export interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  /** Render the title as a heading when the empty state is the page (e.g. a locked topic). */
  titleAs?: "p" | "h1" | "h2";
  className?: string;
}

/**
 * DS `LMS / Empty State` (node 19975-537992): 1px border/subtle, radius 12,
 * padding 48/32, gap 16; 56px rounded-square pictograph on bg/primary-soft with a
 * 28px icon/primary glyph (2px stroke per decision 013, not the DS 1.5); title
 * body-large/Medium, body body-medium/Medium filling the width. Used for Notes
 * empty, Downloads empty, etc.
 */
export function EmptyState({ icon, title, description, action, titleAs: Title = "p", className }: EmptyStateProps) {
  return (
    <div
      className={cn(styles.emptyState, className)}
    >
      <span className={styles.pictograph}>
        <Icon icon={icon} size={28} strokeWidth={iconStroke(28)} />
      </span>
      <Title className={cn("sk-text-body-large-medium", styles.title)}>{title}</Title>
      {description ? (
        <p className={cn("sk-text-body-medium-medium", styles.description)}>{description}</p>
      ) : null}
      {action ? <div>{action}</div> : null}
    </div>
  );
}
