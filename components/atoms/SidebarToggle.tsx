import * as React from "react";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { cn, iconStroke } from "@/lib/utils";

export interface SidebarToggleProps {
  expanded: boolean;
  onToggle?: () => void;
  className?: string;
}

/** Sidebar expand/collapse toggle — Expanded · Collapsed. */
export function SidebarToggle({ expanded, onToggle, className }: SidebarToggleProps) {
  const size = 20;
  const IconCmp = expanded ? PanelLeftClose : PanelLeftOpen;
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
      aria-expanded={expanded}
      className={cn(
        "inline-flex h-8 w-8 items-center justify-center rounded-md text-lms-text-secondary transition-colors duration-200 hover:bg-lms-bg-secondary",
        className,
      )}
    >
      <IconCmp size={size} strokeWidth={iconStroke(size)} />
    </button>
  );
}
