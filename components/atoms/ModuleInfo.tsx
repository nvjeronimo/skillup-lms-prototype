import * as React from "react";
import { Badge } from "@/components/atoms/Badge";
import { cn } from "@/lib/utils";
import styles from "./ModuleInfo.module.css";

export interface ModuleInfoProps {
  /** Module number eyebrow, e.g. "MODULE 01". */
  label: string;
  topicsCompleted: number;
  topicsTotal: number;
  /** Hide the "· x of y topics" progress part (module number only). */
  showTopicProgress?: boolean;
  /** Status = Module Completed: everything turns success and a 14px check trails the count. */
  isCompleted?: boolean;
  className?: string;
}

/**
 * DS `LMS / Module Info` (Status = Module In progress · Module Completed).
 * One horizontal row, 8px gap: module number (Overline/Medium, tertiary) ·
 * separator (Caption/Medium, disabled) · "x of y topics" (Overline/Medium; "topics" since the
 * Course Journey, promoted by Nelson, 27 Oct 2026).
 * A completed module shows the number and the soft success Badge "Completed", the badge of
 * every completed module, course and program (Nelson, 25 Oct 2026; it replaced the green
 * "x of y" + check).
 */
export function ModuleInfo({
  label,
  topicsCompleted,
  topicsTotal,
  showTopicProgress = true,
  isCompleted = false,
  className,
}: ModuleInfoProps) {
  if (isCompleted && showTopicProgress) {
    return (
      <span className={cn(styles.row, className)}>
        <span className={cn("sk-text-label-small-medium", styles.label)}>{label}</span>
        <Badge variant="soft" color="success">
          Completed
        </Badge>
      </span>
    );
  }
  return (
    // 18px row: pinned to the Overline height (label-small, 12/18 since the
    // no-text-below-12 decision) so the Caption separator dot centres inside it.
    <span className={cn(styles.row, styles.pinned, className)}>
      <span className={cn("sk-text-label-small-medium", styles.label)}>{label}</span>
      {showTopicProgress ? (
        <>
          <span className={cn("sk-text-body-small-medium", styles.separator)} aria-hidden>
            ·
          </span>
          <span className={cn("sk-text-label-small-medium", styles.label)}>
            {topicsCompleted} of {topicsTotal} topics
          </span>
        </>
      ) : null}
    </span>
  );
}
