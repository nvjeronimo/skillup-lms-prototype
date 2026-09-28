import * as React from "react";
import { cn, iconStroke } from "@/lib/utils";

export interface SidebarToggleProps {
  expanded: boolean;
  onToggle?: () => void;
  className?: string;
}

/**
 * DS `sidebar-expand-collapse-toggle` — Expanded · Collapsed. A 24×24 panel
 * glyph stroked 2px in `border/default` per decision 013 (24px icons use a 2px
 * stroke; the Sidebar-ICP instances draw 1.5px — DS fix pending): a 19×16
 * outline with radius 2 at (3,4), plus a 7×16 left pane that is filled when
 * Expanded and outline-only when Collapsed. No chevron.
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
        strokeWidth={iconStroke(24)}
        strokeLinejoin="round"
        aria-hidden
      >
        <rect x="4" y="5" width="17" height="14" rx="1" fill="none" />
        <path
          d="M9 5H5A1 1 0 0 0 4 6v12A1 1 0 0 0 5 19h4z"
          fill={expanded ? "currentColor" : "none"}
        />
      </svg>
    </button>
  );
}
