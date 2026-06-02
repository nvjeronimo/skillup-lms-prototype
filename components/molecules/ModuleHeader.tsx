import * as React from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn, iconStroke } from "@/lib/utils";

export interface ModuleHeaderProps {
  label: string;
  title: string;
  topicsCompleted: number;
  topicsTotal: number;
  /** Expanded shows the caret pointing down; Collapsed points right. */
  collapsed?: boolean;
  showTopicProgress?: boolean;
  isCompleted?: boolean;
  onToggle?: () => void;
  className?: string;
}

/**
 * Module group header. When `isCompleted`, shows a green check at the start of
 * the eyebrow and binds the eyebrow text to `--lms-text-success-primary`.
 */
export function ModuleHeader({
  label,
  title,
  topicsCompleted,
  topicsTotal,
  collapsed = false,
  showTopicProgress = true,
  isCompleted = false,
  onToggle,
  className,
}: ModuleHeaderProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={!collapsed}
      className={cn("flex w-full items-start gap-2 px-3 py-2.5 text-left", className)}
    >
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-1">
          {isCompleted ? (
            <Check
              size={14}
              strokeWidth={iconStroke(14)}
              className="text-lms-text-success-primary"
              aria-hidden
            />
          ) : null}
          <span
            className={cn(
              "lms-text-2xs-semibold",
              isCompleted ? "text-lms-text-success-primary" : "text-lms-text-tertiary",
            )}
          >
            {label}
            {showTopicProgress ? ` · ${topicsCompleted}/${topicsTotal}` : ""}
          </span>
        </span>
        <span className="lms-text-sm-semibold mt-0.5 block text-lms-text-primary">{title}</span>
      </span>
      <ChevronDown
        size={18}
        strokeWidth={iconStroke(18)}
        className={cn(
          "mt-0.5 shrink-0 text-lms-text-tertiary transition-transform duration-200",
          collapsed && "-rotate-90",
        )}
        aria-hidden
      />
    </button>
  );
}
