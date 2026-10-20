"use client";

import * as React from "react";
import { LayoutGrid, List, type LucideIcon } from "lucide-react";
import { Icon } from "@/lib/icons";
import type { MyLearningView } from "@/lib/platform/my-learning";
import { cn } from "@/lib/utils";

export interface ViewToggleProps {
  view: MyLearningView;
  onChange: (view: MyLearningView) => void;
  className?: string;
}

/* DS icons grid-01 and list (Untitled UI) → lucide equivalents. */
const OPTIONS: { view: MyLearningView; label: string; icon: LucideIcon }[] = [
  { view: "grid", label: "Grid view", icon: LayoutGrid },
  { view: "list", label: "List view", icon: List },
];

/**
 * DS Button group v2.0, icon only: a bg/muted track (padding 4, gap 2, radius 8) holding two
 * 44 × 32 segments, 40 tall in all. The current view is a pill: bg/page, 1px border/subtle,
 * radius 6, icon/primary. The other has no fill (bg/subtle on hover) and icon/subtle.
 * Nelson chose the pill on 11 Oct 2026; before that the segments were joined by a rule and
 * the current one sat on bg/primary-soft. Icon 20.
 * A group of two toggle buttons (aria-pressed). Desktop only: below desktop the collections
 * are Grid only, so the parent hides it.
 */
export function ViewToggle({ view, onChange, className }: ViewToggleProps) {
  return (
    <div
      role="group"
      aria-label="View"
      className={cn("inline-flex gap-0.5 rounded-control bg-sko-bg-muted p-1", className)}
    >
      {OPTIONS.map((option) => {
        const pressed = option.view === view;
        return (
          <button
            key={option.view}
            type="button"
            aria-pressed={pressed}
            aria-label={option.label}
            onClick={() => onChange(option.view)}
            className={cn(
              "inline-flex h-8 w-11 items-center justify-center rounded-inner border transition-colors",
              pressed
                ? "border-sko-border-subtle bg-sko-bg-page text-sko-icon-primary"
                : "border-transparent text-sko-icon-subtle hover:bg-sko-bg-subtle",
            )}
          >
            <Icon icon={option.icon} size={20} aria-hidden="true" />
          </button>
        );
      })}
    </div>
  );
}
