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
 * DS Button group, icon only (6376:17198): two 44 × 40 segments in one 1px border/default
 * frame, radius 8, Elevation/level1, a 1px border/default rule between them. The current
 * view sits on bg/muted, the other on bg/page; each carries the 2px inner bottom shade of
 * the DS skeuomorphic shadow. Icon 20.
 * A group of two toggle buttons (aria-pressed). Desktop only: below desktop the collections
 * are Grid only, so the parent hides it.
 */
export function ViewToggle({ view, onChange, className }: ViewToggleProps) {
  return (
    <div
      role="group"
      aria-label="View"
      className={cn(
        // No overflow clip: it would cut the focus outline of the segments, which carry the
        // inner radius (8 − 1 border) themselves.
        "inline-flex rounded-lg border border-sko-border-default shadow-sm",
        className,
      )}
    >
      {OPTIONS.map((option, index) => {
        const pressed = option.view === view;
        const last = index === OPTIONS.length - 1;
        return (
          <button
            key={option.view}
            type="button"
            aria-pressed={pressed}
            aria-label={option.label}
            onClick={() => onChange(option.view)}
            className={cn(
              "inline-flex h-[38px] w-[43px] items-center justify-center shadow-[inset_0_-2px_0_0_var(--color-shadow-default)] transition-colors focus-visible:relative focus-visible:z-10",
              index === 0 && "rounded-l-[7px]",
              last && "rounded-r-[7px]",
              index > 0 && "border-l border-sko-border-default",
              pressed
                ? "bg-sko-bg-muted text-sko-icon-default"
                : "bg-sko-bg-page text-sko-icon-muted hover:bg-sko-bg-faint",
            )}
          >
            <Icon icon={option.icon} size={20} aria-hidden="true" />
          </button>
        );
      })}
    </div>
  );
}
