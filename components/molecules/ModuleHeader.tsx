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
 * the eyebrow and binds the eyebrow text to `--sk-text-success-primary`.
 *
 * The row carries `bg-secondary-subtle` so the module band reads as chrome
 * against the white topic list, and the chevron points down when the group is
 * closed and up when it is open — the arrow shows the way out, not the way in.
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
      className={cn(
        "flex w-full items-start gap-2 bg-sk-bg-secondary-subtle px-3 py-2.5 text-left",
        className,
      )}
    >
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-1">
          {isCompleted ? (
            <Check
              size={14}
              strokeWidth={iconStroke(14)}
              className="text-sk-text-success-primary"
              aria-hidden
            />
          ) : null}
          <span
            className={cn(
              "sk-text-2xs-semibold",
              isCompleted ? "text-sk-text-success-primary" : "text-sk-text-tertiary",
            )}
          >
            {label}
            {showTopicProgress ? ` · ${topicsCompleted} of ${topicsTotal}` : ""}
          </span>
        </span>
        <span className="sk-text-sm-semibold mt-0.5 block text-sk-text-primary">{title}</span>
      </span>
      <ChevronDown
        size={18}
        strokeWidth={iconStroke(18)}
        className={cn(
          "mt-0.5 shrink-0 text-sk-text-tertiary transition-transform duration-200",
          !collapsed && "rotate-180",
        )}
        aria-hidden
      />
    </button>
  );
}
