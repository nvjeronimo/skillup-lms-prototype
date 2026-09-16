import * as React from "react";
import { ChevronDown } from "lucide-react";
import { ModuleInfo } from "@/components/atoms/ModuleInfo";
import { cn } from "@/lib/utils";

export interface ModuleHeaderProps {
  label: string;
  title: string;
  topicsCompleted: number;
  topicsTotal: number;
  /** Expanded shows the caret pointing up; Collapsed points down. */
  collapsed?: boolean;
  showTopicProgress?: boolean;
  isCompleted?: boolean;
  onToggle?: () => void;
  className?: string;
}

/**
 * DS `LMS / Module Header` (State = Expanded · Collapsed), 86px tall on a
 * two-line name. Horizontal row, 12px gap, 12/16 padding, vertically centred:
 * a label column (`LMS / Module Info` eyebrow + Body/Small/Semibold name, 8px
 * apart) and a 24px chevron in `border-primary`.
 *
 * The row carries `bg-secondary-subtle` and its own 1px bottom hairline so the
 * module band reads as chrome against the white topic list. The chevron points
 * down when the group is closed and up when it is open — the arrow shows the
 * way out, not the way in.
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
        "flex w-full items-center gap-3 border-b border-sk-border-secondary bg-sk-bg-secondary-subtle px-4 py-3 text-left",
        className,
      )}
    >
      <span className="flex min-w-0 flex-1 flex-col gap-2">
        <ModuleInfo
          label={label}
          topicsCompleted={topicsCompleted}
          topicsTotal={topicsTotal}
          showTopicProgress={showTopicProgress}
          isCompleted={isCompleted}
        />
        {/* DS name box is two lines tall — longer names clip with an ellipsis. */}
        <span className="sk-text-sm-semibold line-clamp-2 text-sk-text-primary">{title}</span>
      </span>
      <ChevronDown
        size={24}
        strokeWidth={2}
        className={cn(
          "shrink-0 text-sk-border-primary transition-transform duration-200",
          !collapsed && "rotate-180",
        )}
        aria-hidden
      />
    </button>
  );
}
