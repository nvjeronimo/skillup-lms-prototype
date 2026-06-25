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

/**
 * Content switcher: Transcript | Notes (n) | Downloads (n) + an optional control
 * cluster on the right. On mobile it renders as a dropdown select (DS: Mobile Tab Select).
 */
export function ContentTabs({ tabs, active, rightSlot, variant = "tabs", className }: ContentTabsProps) {
  const router = useRouter();

  if (variant === "select") {
    const current = tabs.find((t) => t.slug === active) ?? tabs[0];
    return (
      <div className={cn("flex items-center justify-between gap-3", className)}>
        <div className="relative flex-1">
          <select
            aria-label="Content"
            value={current.slug}
            onChange={(e) => {
              const next = tabs.find((t) => t.slug === e.target.value);
              if (next) router.push(next.href);
            }}
            className="sk-text-sm-semibold w-full appearance-none rounded-lg border border-sk-border-primary bg-sk-bg-primary py-2.5 pl-3 pr-9 text-sk-text-primary outline-none focus:border-sk-border-brand"
          >
            {tabs.map((t) => (
              <option key={t.slug} value={t.slug}>
                {t.label}
                {typeof t.count === "number" ? ` (${t.count})` : ""}
              </option>
            ))}
          </select>
          <ChevronDown
            size={16}
            strokeWidth={1.5}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sk-text-tertiary"
          />
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
      <div role="tablist" aria-label="Content" className="flex items-center gap-1 overflow-x-auto">
        {tabs.map((tab) => {
          const isActive = tab.slug === active;
          return (
            <Link
              key={tab.slug}
              href={tab.href}
              role="tab"
              aria-selected={isActive}
              className={cn(
                "sk-text-sm-semibold -mb-px flex shrink-0 items-center gap-1.5 border-b-2 px-4 py-2.5 transition-colors",
                isActive
                  ? "border-sk-border-brand text-sk-text-brand-secondary"
                  : "border-transparent text-sk-text-secondary hover:text-sk-text-primary",
              )}
            >
              {tab.label}
              {typeof tab.count === "number" ? (
                <span
                  className={cn(
                    "sk-text-xs-semibold inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1",
                    isActive
                      ? "bg-sk-bg-brand-section text-sk-text-brand-secondary"
                      : "bg-sk-bg-secondary text-sk-text-tertiary",
                  )}
                >
                  {tab.count}
                </span>
              ) : null}
            </Link>
          );
        })}
      </div>
      {rightSlot ? <div className="flex shrink-0 items-center gap-3 pr-1">{rightSlot}</div> : null}
    </div>
  );
}
