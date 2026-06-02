"use client";

import * as React from "react";
import Link from "next/link";
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
  className?: string;
}

/** Transcript | Notes (n) | Downloads (n). Updates the URL via Next Link. */
export function ContentTabs({ tabs, active, className }: ContentTabsProps) {
  return (
    <div
      role="tablist"
      aria-label="Content"
      className={cn(
        "flex items-center gap-1 overflow-x-auto border-b border-lms-border-secondary",
        className,
      )}
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
              "lms-text-sm-semibold -mb-px flex shrink-0 items-center gap-1.5 border-b-2 px-4 py-2.5 transition-colors",
              isActive
                ? "border-lms-border-brand text-lms-text-brand-secondary"
                : "border-transparent text-lms-text-secondary hover:text-lms-text-primary",
            )}
          >
            {tab.label}
            {typeof tab.count === "number" ? (
              <span
                className={cn(
                  "lms-text-xs-semibold inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1",
                  isActive
                    ? "bg-lms-bg-brand-section text-lms-text-brand-secondary"
                    : "bg-lms-bg-secondary text-lms-text-tertiary",
                )}
              >
                {tab.count}
              </span>
            ) : null}
          </Link>
        );
      })}
    </div>
  );
}
