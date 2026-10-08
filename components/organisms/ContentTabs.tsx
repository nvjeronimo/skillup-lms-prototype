"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDisclosure } from "@/lib/useDisclosure";
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

/** Count pill (DS Mobile Tab Select › Count badge): bg/primary-soft + text/primary in every row. */
function CountBadge({ n }: { n: number }) {
  return (
    <span className="sk-text-body-small-medium inline-flex items-center rounded-full bg-sko-bg-primary-soft px-2 py-0.5 text-sko-text-primary">
      {n}
    </span>
  );
}

/**
 * Content switcher: Transcript | Notes (n) | Downloads (n) + an optional control
 * cluster on the right. On mobile it renders as a dropdown that mirrors the DS
 * "LMS / Mobile Tab Select": grey→brand border, count badge in the trigger, and
 * a styled panel with the selected row on bg-brand-section.
 *
 * Each entry is its own route (…/notes, …/downloads), so this is navigation, not
 * an ARIA tablist (a tablist must not navigate): a `<nav>` of links with
 * `aria-current="page"` on the current one. The mobile dropdown is a disclosure
 * of the same links (Esc / outside click close it; Esc returns focus to the
 * trigger). A visually hidden h2 names the region that follows.
 */
export function ContentTabs({ tabs, active, rightSlot, variant = "tabs", className }: ContentTabsProps) {
  const { open, close, containerRef, triggerProps, panelProps } = useDisclosure();
  const current = tabs.find((t) => t.slug === active) ?? tabs[0];

  const heading = <h2 className="sr-only">{current.label}</h2>;

  if (variant === "select") {
    return (
      <>
        <div className={cn("flex items-center justify-between gap-3", className)}>
          <nav ref={containerRef} aria-label="Topic content" className="relative flex-1">
            <button
              type="button"
              {...triggerProps}
              className={cn(
                "sk-text-body-medium-semibold flex w-full items-center justify-between gap-2 rounded-lg border bg-sko-bg-page px-3 py-2.5 transition-colors",
                open
                  ? "border-sko-border-primary text-sko-text-primary"
                  : "border-sko-border-default text-sko-text-default",
              )}
            >
              <span className="flex min-w-0 items-center gap-2">
                <span className="truncate">{current.label}</span>
                {typeof current.count === "number" ? <CountBadge n={current.count} /> : null}
                <span className="sr-only">, switch topic content</span>
              </span>
              <ChevronDown
                size={16}
                strokeWidth={1.5}
                aria-hidden
                className={cn(
                  "shrink-0 transition-transform",
                  open ? "rotate-180 text-sko-text-primary" : "text-sko-text-subtle",
                )}
              />
            </button>

            {open ? (
              <ul
                {...panelProps}
                className="absolute left-0 right-0 top-[calc(100%+4px)] z-30 overflow-hidden rounded-lg border border-sko-border-primary bg-sko-bg-page shadow-lg"
              >
                {tabs.map((t) => {
                  const selected = t.slug === active;
                  return (
                    <li key={t.slug}>
                      <Link
                        href={t.href}
                        aria-current={selected ? "page" : undefined}
                        onClick={close}
                        className={cn(
                          "sk-text-body-medium-semibold flex w-full items-center gap-2 px-3 py-2.5 text-left transition-colors",
                          selected
                            ? "bg-sko-bg-primary-soft text-sko-text-primary"
                            : "text-sko-text-on-primary-soft hover:bg-sko-bg-subtle",
                        )}
                      >
                        <span className="truncate">{t.label}</span>
                        {typeof t.count === "number" ? <CountBadge n={t.count} /> : null}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            ) : null}
          </nav>
          {rightSlot}
        </div>
        {heading}
      </>
    );
  }

  return (
    <>
      <div
        className={cn(
          "flex items-center justify-between gap-3 border-b border-sko-border-subtle",
          className,
        )}
      >
        <nav aria-label="Topic content" className="overflow-x-auto overflow-y-hidden">
          <ul className="flex items-center gap-3">
            {tabs.map((tab) => {
              const isActive = tab.slug === active;
              return (
                <li key={tab.slug} className="shrink-0">
                  <Link
                    href={tab.href}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "sk-text-body-medium-semibold relative flex shrink-0 items-center gap-2 px-1 pb-3 pt-0 transition-colors",
                      isActive
                        ? "text-sko-text-primary"
                        : "text-sko-text-subtle hover:text-sko-text-default",
                    )}
                  >
                    {tab.label}
                    {typeof tab.count === "number" ? (
                      <span
                        className={cn(
                          // DS Badge v2 Soft sm: Brand on the current tab, Gray on the others.
                          "sk-text-body-small-medium inline-flex items-center rounded-full px-2 py-0.5",
                          isActive
                            ? "bg-sko-bg-primary-soft text-sko-text-primary"
                            : "bg-sko-bg-faint text-sko-text-muted",
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
                        className="absolute inset-x-0 -bottom-px h-0.5 rounded-t-[2px] bg-sko-bg-primary"
                      />
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        {rightSlot ? <div className="flex shrink-0 items-center gap-3 pr-1">{rightSlot}</div> : null}
      </div>
      {heading}
    </>
  );
}
