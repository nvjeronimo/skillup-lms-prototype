import * as React from "react";
import { cn } from "@/lib/utils";

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
        "lms-text-sm-medium inline-flex items-center gap-1.5 rounded-full px-3 py-1 transition-colors duration-200",
        active
          ? "bg-lms-bg-brand-section text-lms-text-brand-secondary"
          : "bg-lms-bg-secondary text-lms-text-secondary hover:bg-lms-bg-tertiary",
        className,
      )}
    >
      <span>{label}</span>
      {typeof count === "number" ? (
        <span
          className={cn(
            "lms-text-xs-semibold",
            active ? "text-lms-text-brand-secondary" : "text-lms-text-tertiary",
          )}
        >
          {count}
        </span>
      ) : null}
    </button>
  );
}
