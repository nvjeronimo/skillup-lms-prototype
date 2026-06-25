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
        "sticky top-0 z-20 flex items-center gap-4 border-b border-sk-border-secondary bg-sk-bg-primary px-4",
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
              "sk-text-sm-semibold -mb-px flex items-center gap-1.5 border-b-2 py-3 transition-colors",
              isActive
                ? "border-sk-border-brand text-sk-text-brand-secondary"
                : "border-transparent text-sk-text-secondary hover:text-sk-text-primary",
            )}
          >
            {t.label}
            {typeof t.count === "number" ? (
              <span
                className={cn(
                  "sk-text-xs-semibold inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5",
                  isActive
                    ? "bg-sk-bg-brand-section text-sk-text-brand-secondary"
                    : "bg-sk-bg-secondary text-sk-text-tertiary",
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
