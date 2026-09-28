import * as React from "react";
import { cn } from "@/lib/utils";

export interface SidebarToggleProps {
  expanded: boolean;
  onToggle?: () => void;
  className?: string;
}

/**
 * DS `sidebar-expand-collapse-toggle` — Expanded · Collapsed. A 24×24 panel
 * glyph stroked 1.5px in `border/default` (the stroke the Sidebar-ICP instances
 * use): a 19×16 outline with radius 2 at (3,4), plus a 7×16 left pane that is
 * filled when Expanded and outline-only when Collapsed. No chevron.
 * Stroke geometry is inset by half the stroke so the outer edge matches the
 * DS inside stroke.
 */
export function SidebarToggle({ expanded, onToggle, className }: SidebarToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
      aria-expanded={expanded}
      className={cn(
        "inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-sm text-sko-border-default transition-colors duration-200 hover:bg-sko-bg-subtle",
        className,
      )}
    >
      <svg
        width={24}
        height={24}
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinejoin="round"
        aria-hidden
      >
        <rect x="3.75" y="4.75" width="17.5" height="14.5" rx="1.25" fill="none" />
        <path
          d="M9.25 4.75H5A1.25 1.25 0 0 0 3.75 6v12A1.25 1.25 0 0 0 5 19.25h4.25z"
          fill={expanded ? "currentColor" : "none"}
        />
      </svg>
    </button>
  );
}
