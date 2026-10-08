"use client";

import * as React from "react";
import { Badge } from "@/components/atoms/Badge";
import { cn } from "@/lib/utils";

export interface PlatformTab<T extends string> {
  id: T;
  label: string;
  /** Shown in a Badge v2 Soft after the label: Brand on the selected tab, Gray on the others. */
  count?: number;
}

export interface PlatformTabsProps<T extends string> {
  tabs: readonly PlatformTab<T>[];
  /** The selected tab. */
  value: T;
  onChange: (id: T) => void;
  /**
   * `md`: DS Size=md on every breakpoint (48 tall, body-large/Semibold, badge md).
   * `responsive`: Size=sm on mobile (32 tall, body-medium/Semibold, badge sm, the target
   * grown to 44 upwards) and Size=md from tablet up.
   */
  size?: "md" | "responsive";
  /**
   * `own`: the row draws its 1px border/subtle rule itself and scrolls sideways when the
   * tabs do not fit. `parent`: the parent draws the rule as its bottom border and the
   * selected bar sits on it.
   */
  rule?: "own" | "parent";
  /**
   * `all`: every panel stays in the DOM, so every tab points at its panel.
   * `selected`: only the selected panel is rendered, so only its tab carries `aria-controls`.
   */
  panels?: "all" | "selected";
  /** Prefix of the tab and panel ids: see `platformTabId` and `platformPanelId`. */
  idBase: string;
  /** Accessible name of the tablist. */
  ariaLabel: string;
  className?: string;
}

/** The ids that tie each tab to its panel (`aria-controls` / `aria-labelledby`). */
export const platformTabId = (idBase: string, id: string) => `${idBase}-tab-${id}`;
export const platformPanelId = (idBase: string, id: string) => `${idBase}-panel-${id}`;

/**
 * DS `Horizontal tabs`, Type=Underline (6443:18731 · with a count badge 6376:17141 · mobile
 * 6400:29861): a row of `_Tab button base` 12 apart; each tab is the label and an optional
 * count badge, gap 8, padding 0/4. Selected is text/primary with the 2px bg/primary
 * `tab-selected` bar (top corners rounded 2); the rest are text/subtle.
 * Same look as organisms/ContentTabs, which is a <nav> of links at body-medium.
 *
 * The tabs swap panels on one page, so this is an ARIA tablist: roving tabindex, Left / Right
 * (wrapping), Home and End move focus, and selection follows focus. The parent renders the
 * tabpanels with `platformPanelId` / `platformTabId`.
 */
export function PlatformTabs<T extends string>({
  tabs,
  value,
  onChange,
  size = "md",
  rule = "own",
  panels = "all",
  idBase,
  ariaLabel,
  className,
}: PlatformTabsProps<T>) {
  const refs = React.useRef<Record<string, HTMLButtonElement | null>>({});
  const responsive = size === "responsive";
  const ownRule = rule === "own";

  const onKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = tabs.length - 1;
    let next: number;
    if (event.key === "ArrowRight") next = index === last ? 0 : index + 1;
    else if (event.key === "ArrowLeft") next = index === 0 ? last : index - 1;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = last;
    else return;
    event.preventDefault();
    const target = tabs[next];
    refs.current[target.id]?.focus();
    onChange(target.id);
  };

  const tablist = (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={cn("flex items-start gap-3", !ownRule && className)}
    >
      {tabs.map((tab, index) => {
        const selected = tab.id === value;
        const badgeColor = selected ? "brand" : "gray";
        return (
          <button
            key={tab.id}
            ref={(node) => {
              refs.current[tab.id] = node;
            }}
            type="button"
            role="tab"
            id={platformTabId(idBase, tab.id)}
            aria-selected={selected}
            aria-controls={panels === "all" || selected ? platformPanelId(idBase, tab.id) : undefined}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(tab.id)}
            onKeyDown={(event) => onKeyDown(event, index)}
            className={cn(
              "relative flex shrink-0 items-center justify-center gap-2 px-1 transition-colors",
              // Size=sm is 32 tall with 12 under the label; an invisible band grows the target to 44 upwards.
              responsive
                ? "h-8 pb-3 max-md:before:absolute max-md:before:inset-x-0 max-md:before:-top-3 max-md:before:bottom-0 max-md:before:content-[''] md:h-auto md:py-3"
                : "sk-text-body-large-semibold py-3",
              // The scrolling row clips an outline drawn outside the tab.
              ownRule && "focus-visible:-outline-offset-2",
              selected ? "text-sko-text-primary" : "text-sko-text-subtle hover:text-sko-text-default",
            )}
          >
            {/* The DS text styles are not responsive, so `responsive` renders a label and a badge per size. */}
            {responsive ? (
              <>
                <span className="sk-text-body-medium-semibold md:hidden">{tab.label}</span>
                <span className="sk-text-body-large-semibold hidden md:inline">{tab.label}</span>
              </>
            ) : (
              tab.label
            )}
            {tab.count !== undefined && responsive ? (
              <Badge color={badgeColor} size="sm" className="md:hidden">
                {tab.count}
              </Badge>
            ) : null}
            {tab.count !== undefined ? (
              <Badge color={badgeColor} size="md" className={responsive ? "hidden md:inline-flex" : undefined}>
                {tab.count}
              </Badge>
            ) : null}
            {selected ? (
              <span
                aria-hidden="true"
                className={cn(
                  "absolute inset-x-0 h-0.5 rounded-t-[2px] bg-sko-bg-primary",
                  ownRule ? "bottom-0" : "-bottom-px",
                )}
              />
            ) : null}
          </button>
        );
      })}
    </div>
  );

  if (!ownRule) return tablist;

  return (
    // The rule is an inset shadow, not a border: the row keeps its height and the selected bar
    // sits on the rule (a real 1px border in forced colours, where shadows are dropped).
    <div
      className={cn(
        "overflow-x-auto overflow-y-hidden shadow-[inset_0_-1px_0_0_var(--color-border-subtle)]",
        "forced-colors:border-b forced-colors:border-sko-border-subtle",
        className,
      )}
    >
      {tablist}
    </div>
  );
}
