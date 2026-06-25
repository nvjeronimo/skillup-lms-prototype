import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn, iconStroke } from "@/lib/utils";

export interface SectionHeaderProps {
  label: string;
  /** Show a collapse caret. */
  collapsible?: boolean;
  collapsed?: boolean;
  onToggle?: () => void;
  className?: string;
}

/** Sub-section label inside modules (e.g. "Section 1 · Define and measure"). */
export function SectionHeader({
  label,
  collapsible = false,
  collapsed = false,
  onToggle,
  className,
}: SectionHeaderProps) {
  const content = (
    <>
      <span className="sk-text-xs-semibold text-sk-text-secondary">{label}</span>
      {collapsible ? (
        <ChevronDown
          size={16}
          strokeWidth={iconStroke(16)}
          className={cn(
            "text-sk-text-tertiary transition-transform duration-200",
            collapsed && "-rotate-90",
          )}
        />
      ) : null}
    </>
  );

  if (collapsible) {
    return (
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={!collapsed}
        className={cn(
          "flex w-full items-center justify-between px-3 py-2 text-left",
          className,
        )}
      >
        {content}
      </button>
    );
  }

  return (
    <div className={cn("flex items-center justify-between px-3 py-2", className)}>{content}</div>
  );
}
