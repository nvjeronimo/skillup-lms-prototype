import * as React from "react";
import { ChevronDown } from "lucide-react";
import { ModuleInfo } from "@/components/atoms/ModuleInfo";
import { cn, iconStroke } from "@/lib/utils";

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
 * a label column (`LMS / Module Info` eyebrow + body-medium/Semibold name, 8px
 * apart) and a 24px chevron in `border/default`, stroked 2px per decision 013
 * (the DS draws 1.5px; DS fix pending).
 *
 * The row sits on `bg/faint`. Only State=Collapsed carries a 1px bottom
 * hairline (`border/subtle`, inside), which separates stacked closed modules;
 * an Expanded header has no stroke and runs straight into its topic list. The
 * name wraps to as many lines as it needs (no truncation). The chevron points
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
        "flex w-full items-center gap-3 bg-sko-bg-faint px-4 py-3 text-left",
        collapsed && "border-b border-sko-border-subtle",
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
        {/* DS name is auto-height with truncation off — long names wrap, never clip. */}
        <span className="sk-text-sm-semibold text-sko-text-default">{title}</span>
      </span>
      <ChevronDown
        size={24}
        /* Decision 013: 24px icons use a 2px stroke (DS draws 1.5px — DS fix pending). */
        strokeWidth={iconStroke(24)}
        className={cn(
          "shrink-0 text-sko-border-default transition-transform duration-200",
          !collapsed && "rotate-180",
        )}
        aria-hidden
      />
    </button>
  );
}
