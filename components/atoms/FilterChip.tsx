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
        "sk-text-sm-medium inline-flex items-center gap-1.5 rounded-full px-3 py-1 transition-colors duration-200",
        active
          ? "bg-sk-bg-brand-section text-sk-text-brand-secondary"
          : "bg-sk-bg-secondary text-sk-text-secondary hover:bg-sk-bg-tertiary",
        className,
      )}
    >
      <span>{label}</span>
      {typeof count === "number" ? (
        <span
          className={cn(
            "sk-text-xs-semibold",
            active ? "text-sk-text-brand-secondary" : "text-sk-text-tertiary",
          )}
        >
          {count}
        </span>
      ) : null}
    </button>
  );
}
