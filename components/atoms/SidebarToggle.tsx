import * as React from "react";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { cn, iconStroke } from "@/lib/utils";

export interface SidebarToggleProps {
  expanded: boolean;
  onToggle?: () => void;
  className?: string;
}

/** Sidebar expand/collapse toggle — Expanded · Collapsed. DS: 24×24, glyph strokes in `border-primary`. */
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
        "inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-sm text-sk-border-primary transition-colors duration-200 hover:bg-sk-bg-secondary",
        className,
      )}
    >
      <IconCmp size={size} strokeWidth={iconStroke(size)} />
    </button>
  );
}
