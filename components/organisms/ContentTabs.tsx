import * as React from "react";
import Link from "@/lib/router";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDisclosure } from "@/lib/useDisclosure";
import { useTabIndicator } from "@/lib/useTabIndicator";
import type { TabSlug } from "@/lib/store";
import styles from "./ContentTabs.module.css";

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
  /**
   * `tabs` everywhere since 22 Oct 2026 (Nelson: the phone keeps the desktop tabs; the row scrolls
   * sideways if it ever needs to). `select`, the old phone dropdown, is kept but unused.
   */
  variant?: "tabs" | "select";
  className?: string;
}

/** Count pill (DS Mobile Tab Select › Count badge): bg/primary-soft + text/primary in every row. */
function CountBadge({ n }: { n: number }) {
  return (
    <span className={`sk-text-body-small-medium ${styles.countBadge}`}>
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
  const { open, mounted, close, containerRef, triggerProps, panelProps } = useDisclosure();
  const current = tabs.find((t) => t.slug === active) ?? tabs[0];
  const indicator = useTabIndicator(active, tabs.length);

  const heading = <h2 className="sk-sr-only">{current.label}</h2>;

  if (variant === "select") {
    return (
      <>
        <div className={cn(styles.selectRow, className)}>
          <nav ref={containerRef} aria-label="Topic content" className={styles.selectNav}>
            <button
              type="button"
              {...triggerProps}
              className={cn(
                "sk-text-body-medium-semibold",
                styles.trigger,
                styles.colors,
                open ? styles.triggerOpen : styles.triggerClosed,
              )}
            >
              <span className={styles.triggerLabel}>
                <span className={styles.ellipsis}>{current.label}</span>
                {typeof current.count === "number" ? <CountBadge n={current.count} /> : null}
                <span className="sk-sr-only">, switch topic content</span>
              </span>
              <ChevronDown
                size={16}
                strokeWidth={1.5}
                aria-hidden
                className={cn(
                  styles.chevron,
                  open ? styles.chevronOpen : styles.chevronClosed,
                )}
              />
            </button>

            {mounted ? (
              <ul
                {...panelProps}
                className={`sk-animate-menu ${styles.menu}`}
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
                          "sk-text-body-medium-semibold",
                          styles.option,
                          styles.colors,
                          selected ? styles.optionSelected : styles.optionIdle,
                        )}
                      >
                        <span className={styles.ellipsis}>{t.label}</span>
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
          styles.row,
          className,
        )}
      >
        <nav aria-label="Topic content" className={styles.tabsNav}>
          <ul ref={indicator.rowRef} className={styles.tabs}>
            {tabs.map((tab) => {
              const isActive = tab.slug === active;
              return (
                <li key={tab.slug} className={styles.tabItem}>
                  <Link
                    href={tab.href}
                    aria-current={isActive ? "page" : undefined}
                    data-tab-active={isActive}
                    className={cn(
                      "sk-text-body-medium-semibold",
                      styles.tab,
                      styles.colors,
                      isActive ? styles.tabActive : styles.tabIdle,
                    )}
                  >
                    {tab.label}
                    {typeof tab.count === "number" ? (
                      <span
                        className={cn(
                          // DS Badge Soft sm: Brand on the current tab, Gray on the others.
                          "sk-text-body-small-medium",
                          styles.tabCount,
                          isActive ? styles.tabCountActive : styles.tabCountIdle,
                        )}
                      >
                        {tab.count}
                      </span>
                    ) : null}
                    {/* DS `tab-selected`: a 2px brand bar with rounded top corners,
                        sitting on the tab-row baseline. Drawn per tab only until the
                        sliding bar below has measured (server render, first paint). */}
                    {isActive && !indicator.box ? (
                      <span
                        aria-hidden
                        className={styles.bar}
                      />
                    ) : null}
                  </Link>
                </li>
              );
            })}
            {indicator.box ? (
              <li
                aria-hidden
                className={cn(
                  styles.slidingBar,
                  indicator.animate && styles.slidingBarAnimate,
                )}
                style={indicator.style}
              />
            ) : null}
          </ul>
        </nav>
        {rightSlot ? <div className={styles.right}>{rightSlot}</div> : null}
      </div>
      {heading}
    </>
  );
}
