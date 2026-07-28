"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TabSlug } from "@/lib/store";

export interface ContentTab {
  slug: TabSlug;
  label: string;
  count?: number;
  href: string;
}

export interface ContentTabsProps {
  tabs: ContentTab[];
  active: TabSlug;
  /** Controls rendered at the right of the tab row (language / download / add note). */
  rightSlot?: React.ReactNode;
  /** Mobile renders the tab switcher as a dropdown select. */
  variant?: "tabs" | "select";
  className?: string;
}

/** Count pill — bg-brand-section + text-brand-secondary, per DS (all tab states). */
function CountBadge({ n }: { n: number }) {
  return (
    <span className="sk-text-xs-semibold inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-sk-bg-brand-section px-1 text-sk-text-brand-secondary">
      {n}
    </span>
  );
}

/**
 * Content switcher: Transcript | Notes (n) | Downloads (n) + an optional control
 * cluster on the right. On mobile it renders as a dropdown select that mirrors the
 * DS "LMS / Mobile Tab Select": grey→brand border, count badge in the trigger, and
 * a styled panel with the selected row on bg-brand-section.
 */
export function ContentTabs({ tabs, active, rightSlot, variant = "tabs", className }: ContentTabsProps) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const selectRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent) {
      if (selectRef.current && !selectRef.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (variant === "select") {
    const current = tabs.find((t) => t.slug === active) ?? tabs[0];
    return (
      <div className={cn("flex items-center justify-between gap-3", className)}>
        <div ref={selectRef} className="relative flex-1">
          <button
            type="button"
            aria-haspopup="listbox"
            aria-expanded={open}
            aria-label="Content"
            onClick={() => setOpen((o) => !o)}
            className={cn(
              "sk-text-sm-semibold flex w-full items-center justify-between gap-2 rounded-lg border bg-sk-bg-primary px-3 py-2.5 transition-colors",
              open
                ? "border-sk-border-brand text-sk-text-brand-secondary"
                : "border-sk-border-primary text-sk-text-primary",
            )}
          >
            <span className="flex min-w-0 items-center gap-2">
              <span className="truncate">{current.label}</span>
              {typeof current.count === "number" ? <CountBadge n={current.count} /> : null}
            </span>
            <ChevronDown
              size={16}
              strokeWidth={1.5}
              className={cn(
                "shrink-0 transition-transform",
                open ? "rotate-180 text-sk-text-brand-secondary" : "text-sk-text-tertiary",
              )}
            />
          </button>

          {open ? (
            <ul
              role="listbox"
              className="absolute left-0 right-0 top-[calc(100%+4px)] z-30 overflow-hidden rounded-lg border border-sk-border-brand bg-sk-bg-primary shadow-lg"
            >
              {tabs.map((t) => {
                const selected = t.slug === active;
                return (
                  <li key={t.slug} role="option" aria-selected={selected}>
                    <button
                      type="button"
                      onClick={() => {
                        setOpen(false);
                        if (!selected) router.push(t.href);
                      }}
                      className={cn(
                        "sk-text-sm-semibold flex w-full items-center gap-2 px-3 py-2.5 text-left transition-colors",
                        selected
                          ? "bg-sk-bg-brand-section text-sk-text-brand-secondary"
                          : "text-sk-text-brand-primary hover:bg-sk-bg-secondary",
                      )}
                    >
                      <span className="truncate">{t.label}</span>
                      {typeof t.count === "number" ? <CountBadge n={t.count} /> : null}
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : null}
        </div>
        {rightSlot}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 border-b border-sk-border-secondary",
        className,
      )}
    >
      <div
        role="tablist"
        aria-label="Content"
        className="flex items-center gap-1 overflow-x-auto overflow-y-hidden"
      >
        {tabs.map((tab) => {
          const isActive = tab.slug === active;
          return (
            <Link
              key={tab.slug}
              href={tab.href}
              role="tab"
              aria-selected={isActive}
              className={cn(
                "sk-text-sm-semibold relative flex shrink-0 items-center gap-1.5 px-4 py-2.5 transition-colors",
                isActive
                  ? "text-sk-text-brand-secondary"
                  : "text-sk-text-tertiary hover:text-sk-text-primary",
              )}
            >
              {tab.label}
              {typeof tab.count === "number" ? (
                <span
                  className={cn(
                    "sk-text-xs-semibold inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1",
                    isActive
                      ? "bg-sk-bg-brand-section text-sk-text-brand-secondary"
                      : "bg-sk-bg-secondary text-sk-text-secondary",
                  )}
                >
                  {tab.count}
                </span>
              ) : null}
              {/* DS `tab-selected`: a 2px brand bar with rounded top corners,
                  sitting on the tab-row baseline. */}
              {isActive ? (
                <span
                  aria-hidden
                  className="absolute inset-x-0 -bottom-px h-0.5 rounded-t-[2px] bg-sk-border-brand"
                />
              ) : null}
            </Link>
          );
        })}
      </div>
      {rightSlot ? <div className="flex shrink-0 items-center gap-3 pr-1">{rightSlot}</div> : null}
    </div>
  );
}
