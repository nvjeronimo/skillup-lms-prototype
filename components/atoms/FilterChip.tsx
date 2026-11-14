import * as React from "react";
import { cn } from "@/lib/utils";
import styles from "./FilterChip.module.css";

export interface FilterChipProps {
  label: string;
  count?: number;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

/**
 * Pill with label + optional count. Active uses brand-section + brand text,
 * inactive uses secondary bg + secondary text (overlay panel filter rule).
 */
export function FilterChip({ label, count, active = false, onClick, className }: FilterChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "sk-text-body-medium-medium",
        styles.chip,
        active ? styles.active : styles.inactive,
        className,
      )}
    >
      <span>{label}</span>
      {typeof count === "number" ? (
        <span
          className={cn(
            "sk-text-body-small-semibold",
            active ? styles.countActive : styles.countInactive,
          )}
        >
          {count}
        </span>
      ) : null}
    </button>
  );
}
