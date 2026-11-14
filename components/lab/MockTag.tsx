import * as React from "react";
import { cn } from "@/lib/utils";
import styles from "./MockTag.module.css";

export interface MockTagProps {
  /** Why this is mocked: the API or decision that does not exist yet. Shown in full, never hover-only. */
  reason: string;
  /** "inline" sits next to a value; "block" labels a whole section. */
  layout?: "inline" | "block";
  className?: string;
}

/**
 * Lab-only marker for data no API returns today. Deliberately loud (dashed border, "MOCK" label) so a
 * screenshot of a /lab page can never be read as a promise to the devs. Never ship outside /lab.
 */
export function MockTag({ reason, layout = "inline", className }: MockTagProps) {
  return (
    <span
      className={cn(styles.tag, layout === "block" && styles.block, className)}
    >
      <span className={`sk-text-body-small-semibold ${styles.label}`}>Mock</span>
      <span className="sk-text-body-small-regular">{reason}</span>
    </span>
  );
}
