import * as React from "react";
import { cn } from "@/lib/utils";
import styles from "./PanelTabs.module.css";

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
      className={cn(styles.tabs, className)}
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
            className={cn("sk-text-body-medium-semibold", styles.tab, isActive ? styles.active : styles.inactive)}
          >
            {t.label}
            {typeof t.count === "number" ? (
              <span
                className={cn(
                  // DS Badge Soft sm: Brand on the current tab, Gray on the others.
                  "sk-text-body-small-medium",
                  styles.count,
                  isActive ? styles.countActive : styles.countInactive,
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
