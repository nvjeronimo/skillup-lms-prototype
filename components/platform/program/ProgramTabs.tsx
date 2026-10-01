"use client";

import * as React from "react";
import { PROGRAM_TABS, type ProgramTabId } from "@/lib/platform/program";
import { cn } from "@/lib/utils";

/** The ids that tie each tab to its panel (`aria-controls` / `aria-labelledby`). */
export function programTabDomIds(baseId: string, tab: ProgramTabId) {
  return { tab: `${baseId}-tab-${tab}`, panel: `${baseId}-panel-${tab}` };
}

/**
 * DS `Horizontal tabs` (6443:18731): a row of `_Tab button base` — body-large/Semibold,
 * padding 12/4, gap 12, 48px tall — on a 1px border/subtle rule. Selected is text/primary
 * with the 2px bg/primary `tab-selected` bar (top corners rounded 2); the rest are text/subtle.
 * Same look as organisms/ContentTabs, which is a <nav> of links at body-medium.
 *
 * These tabs swap panels on one page, so this is an ARIA tablist: roving tabindex, Left/Right
 * (wrapping), Home and End move focus, and selection follows focus.
 */
export function ProgramTabs({
  baseId,
  active,
  onSelect,
  className,
}: {
  baseId: string;
  active: ProgramTabId;
  onSelect: (tab: ProgramTabId) => void;
  className?: string;
}) {
  const refs = React.useRef<Partial<Record<ProgramTabId, HTMLButtonElement | null>>>({});

  function onKeyDown(e: React.KeyboardEvent<HTMLButtonElement>, index: number) {
    const last = PROGRAM_TABS.length - 1;
    let next: number;
    if (e.key === "ArrowRight") next = index === last ? 0 : index + 1;
    else if (e.key === "ArrowLeft") next = index === 0 ? last : index - 1;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = last;
    else return;
    e.preventDefault();
    const id = PROGRAM_TABS[next].id;
    refs.current[id]?.focus();
    onSelect(id);
  }

  return (
    // The rule is an inset shadow, not a border: the row stays 48px and the selected bar
    // sits on the rule (a real 1px border in forced colours, where shadows are dropped).
    <div
      className={cn(
        "overflow-x-auto overflow-y-hidden shadow-[inset_0_-1px_0_0_var(--color-border-subtle)]",
        "forced-colors:border-b forced-colors:border-sko-border-subtle",
        className,
      )}
    >
      <div role="tablist" aria-label="Program sections" className="flex items-start gap-3">
        {PROGRAM_TABS.map((tab, index) => {
          const selected = tab.id === active;
          const ids = programTabDomIds(baseId, tab.id);
          return (
            <button
              key={tab.id}
              ref={(el) => {
                refs.current[tab.id] = el;
              }}
              type="button"
              role="tab"
              id={ids.tab}
              aria-selected={selected}
              aria-controls={ids.panel}
              tabIndex={selected ? 0 : -1}
              onClick={() => onSelect(tab.id)}
              onKeyDown={(e) => onKeyDown(e, index)}
              className={cn(
                "sk-text-md-semibold relative flex shrink-0 items-center justify-center gap-2 px-1 py-3 transition-colors",
                "focus-visible:-outline-offset-2",
                selected ? "text-sko-text-primary" : "text-sko-text-subtle hover:text-sko-text-default",
              )}
            >
              {tab.label}
              {selected ? (
                <span aria-hidden className="absolute inset-x-0 bottom-0 h-0.5 rounded-t-[2px] bg-sko-bg-primary" />
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
