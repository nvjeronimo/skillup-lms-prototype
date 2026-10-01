"use client";

import * as React from "react";
import { Badge } from "@/components/atoms/Badge";
import { cn } from "@/lib/utils";

export interface CollectionTab<T extends string> {
  id: T;
  label: string;
  count: number;
}

export interface CollectionTabsProps<T extends string> {
  tabs: CollectionTab<T>[];
  active: T;
  onChange: (id: T) => void;
  /** Accessible name of the tablist. */
  label: string;
  /** Prefix of the tab and panel ids: `${idBase}-tab-${id}` / `${idBase}-panel-${id}`. */
  idBase: string;
  className?: string;
}

export const collectionTabId = (idBase: string, id: string) => `${idBase}-tab-${id}`;
export const collectionPanelId = (idBase: string, id: string) => `${idBase}-panel-${id}`;

/**
 * DS Horizontal tabs, Type=Underline, with a count badge (6376:17141 · mobile 6400:29861).
 * Tabs 12 apart; each tab is label + Badge v2 Soft (Brand on the selected tab, Gray on the
 * others), gap 8, padding 0/4. Selected: text/primary and the 2px bg/primary `tab-selected`
 * bar with rounded top corners; the others text/subtle.
 * Tablet and desktop (Size=md): body-large/Semibold, padding 12 top and bottom (48 tall),
 * badge md. Mobile (Size=sm): body-medium/Semibold, 32 tall with 12 under the label,
 * badge sm; the target grows to 44 upwards without moving the layout.
 *
 * The tabs switch a collection in place, so this is an ARIA tablist: roving tabindex,
 * Left / Right / Home / End move and select. The parent renders the tabpanel.
 */
export function CollectionTabs<T extends string>({
  tabs,
  active,
  onChange,
  label,
  idBase,
  className,
}: CollectionTabsProps<T>) {
  const refs = React.useRef<Record<string, HTMLButtonElement | null>>({});

  const onKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
    else if (event.key === "ArrowLeft") next = (index - 1 + tabs.length) % tabs.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = tabs.length - 1;
    else return;
    event.preventDefault();
    const target = tabs[next];
    refs.current[target.id]?.focus();
    onChange(target.id);
  };

  return (
    <div role="tablist" aria-label={label} className={cn("flex items-start gap-3", className)}>
      {tabs.map((tab, index) => {
        const selected = tab.id === active;
        const badgeColor = selected ? "brand" : "gray";
        return (
          <button
            key={tab.id}
            ref={(node) => {
              refs.current[tab.id] = node;
            }}
            type="button"
            role="tab"
            id={collectionTabId(idBase, tab.id)}
            aria-selected={selected}
            aria-controls={selected ? collectionPanelId(idBase, tab.id) : undefined}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(tab.id)}
            onKeyDown={(event) => onKeyDown(event, index)}
            className={cn(
              "relative flex h-8 shrink-0 items-center justify-center gap-2 px-1 pb-3 transition-colors md:h-auto md:py-3",
              "max-md:before:absolute max-md:before:inset-x-0 max-md:before:-top-3 max-md:before:bottom-0 max-md:before:content-['']",
              selected ? "text-sko-text-primary" : "text-sko-text-subtle hover:text-sko-text-default",
            )}
          >
            {/* The DS text styles are not responsive, so each size renders its own label and badge. */}
            <span className="sk-text-sm-semibold md:hidden">{tab.label}</span>
            <span className="sk-text-md-semibold hidden md:inline">{tab.label}</span>
            <Badge color={badgeColor} size="sm" className="md:hidden">
              {tab.count}
            </Badge>
            <Badge color={badgeColor} size="md" className="hidden md:inline-flex">
              {tab.count}
            </Badge>
            {selected ? (
              <span aria-hidden="true" className="absolute inset-x-0 -bottom-px h-0.5 rounded-t-[2px] bg-sko-bg-primary" />
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
