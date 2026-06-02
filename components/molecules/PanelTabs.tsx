"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface PanelTab {
  value: string;
  label: string;
  count?: number;
}

export interface PanelTabsProps {
  tabs: PanelTab[];
  active: string;
  onChange: (value: string) => void;
  ariaLabel: string;
  className?: string;
}

/**
 * Horizontal tabs with count badges, used by the Notifications + Saved panels
 * (matches the SKO Final Screens). Arrow-key navigable, brand underline on active.
 */
export function PanelTabs({ tabs, active, onChange, ariaLabel, className }: PanelTabsProps) {
  const refs = React.useRef<(HTMLButtonElement | null)[]>([]);

  function onKeyDown(e: React.KeyboardEvent, i: number) {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const dir = e.key === "ArrowRight" ? 1 : -1;
    const next = (i + dir + tabs.length) % tabs.length;
    onChange(tabs[next].value);
    refs.current[next]?.focus();
  }

  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={cn(
        "sticky top-0 z-20 flex items-center gap-4 border-b border-lms-border-secondary bg-lms-bg-primary px-4",
        className,
      )}
    >
      {tabs.map((t, i) => {
        const isActive = t.value === active;
        return (
          <button
            key={t.value}
            ref={(el) => {
              refs.current[i] = el;
            }}
            role="tab"
            aria-selected={isActive}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onChange(t.value)}
            onKeyDown={(e) => onKeyDown(e, i)}
            className={cn(
              "lms-text-sm-semibold -mb-px flex items-center gap-1.5 border-b-2 py-3 transition-colors",
              isActive
                ? "border-lms-border-brand text-lms-text-brand-secondary"
                : "border-transparent text-lms-text-secondary hover:text-lms-text-primary",
            )}
          >
            {t.label}
            {typeof t.count === "number" ? (
              <span
                className={cn(
                  "lms-text-xs-semibold inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5",
                  isActive
                    ? "bg-lms-bg-brand-section text-lms-text-brand-secondary"
                    : "bg-lms-bg-secondary text-lms-text-tertiary",
                )}
              >
                {t.count}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
