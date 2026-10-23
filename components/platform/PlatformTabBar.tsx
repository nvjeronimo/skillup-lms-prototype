"use client";

import * as React from "react";
import Link from "next/link";
import {
  BookOpen,
  CalendarDays,
  LayoutDashboard,
  LifeBuoy,
  MessagesSquare,
  MoreHorizontal,
  type LucideIcon,
} from "lucide-react";
import { Icon } from "@/lib/icons";
import { PLATFORM_SECTIONS, type PlatformSection } from "@/lib/platform/user";
import { useLmsStore } from "@/lib/store";
import { useDisclosure } from "@/lib/useDisclosure";
import { cn } from "@/lib/utils";

const ICONS: Record<PlatformSection, LucideIcon> = {
  dashboard: LayoutDashboard,
  "my-learning": BookOpen,
  calendar: CalendarDays,
  discussion: MessagesSquare,
  services: LifeBuoy,
};

/** Shorter names where the full one does not fit the bar (the page title keeps it). */
const SHORT: Partial<Record<PlatformSection, string>> = { "my-learning": "Learning" };

/** The sections in the bar itself; every other section (and any added later) goes under More. */
const IN_BAR: PlatformSection[] = ["dashboard", "my-learning", "calendar"];

type Section = (typeof PLATFORM_SECTIONS)[number];

const ITEM =
  "sk-text-body-small-medium relative flex min-h-14 w-full flex-col items-center justify-center gap-0.5 rounded-pill transition-[background-color,color,transform] duration-short2 ease-standard-decelerate active:scale-[.96]";
const itemTone = (on: boolean) =>
  on ? "bg-sko-bg-primary-soft text-sko-text-on-primary-soft" : "text-sko-text-subtle";

/** A row of the More panel: 44 tall, 20px icon, body-medium/Medium (as the profile menu rows). */
const MORE_ROW =
  "sk-text-body-medium-medium flex min-h-11 w-full items-center gap-3 rounded-card-inset px-3 text-left transition-colors hover:bg-sko-bg-hover";

function TabIcon({ icon, on, count }: { icon: LucideIcon; on: boolean; count?: number }) {
  return (
    <span className="relative">
      <Icon icon={icon} size={22} strokeWidth={on ? 2.25 : 1.75} aria-hidden />
      {typeof count === "number" && count > 0 ? (
        <span
          aria-hidden
          className="sk-text-label-small-semibold absolute -right-2.5 -top-1.5 inline-flex h-4 min-w-4 items-center justify-center rounded-pill bg-sko-bg-primary px-1 text-sko-text-on-primary"
        >
          {count}
        </span>
      ) : null}
    </span>
  );
}

/**
 * The platform sections on a phone (Nelson, 22 Oct 2026: "a floating menu, as in an app"; 23 Oct:
 * his answers to the open question). A pill that floats 16 above the bottom edge (plus the safe
 * area), leaving the right corner to the assistant launcher, which sits beside it on the same line.
 * Dashboard, Learning and Calendar are in the bar; More gathers the rest (Discussion, Services, and
 * any section added later) in a panel that opens above it. Each item is an icon over a short label
 * (body-small Medium), 56 tall; the current one sits on a bg/primary-soft pill with a heavier icon,
 * so it never depends on colour alone (More is current on any page it holds). Links with
 * `aria-current`, not a tablist: each opens another page. The material is bg/page at 88% under a
 * blur, solid under "reduce transparency"; a soft shadow lifts it, no border, no gradient. Phones
 * only: tablet and desktop keep the top bar.
 */
export function PlatformTabBar({ current }: { current: PlatformSection | null }) {
  const showToast = useLmsStore((s) => s.showToast);
  const inBar = PLATFORM_SECTIONS.filter((s) => IN_BAR.includes(s.id));
  const inMore = PLATFORM_SECTIONS.filter((s) => !IN_BAR.includes(s.id));
  const moreCurrent = inMore.some((s) => s.id === current);
  const more = useDisclosure();

  const named = (s: Section) =>
    typeof s.count === "number" && s.count > 0 ? `${s.label}, ${s.count} items` : s.label;
  // No page for this section in the prototype: say so instead of a dead link.
  const missing = (s: Section) => () => showToast(`${s.label} is not part of this prototype yet`);

  return (
    <nav
      aria-label="Platform"
      data-floating-nav=""
      className="sk-floating-nav sk-no-print sk-animate-rise fixed bottom-[calc(1rem+env(safe-area-inset-bottom,0px))] left-4 right-[4.5rem] z-30 rounded-pill p-1"
    >
      <ul className="flex items-stretch">
        {inBar.map((s) => {
          const on = s.id === current;
          const content = (
            <>
              <TabIcon icon={ICONS[s.id]} on={on} count={s.count} />
              <span className="max-w-full truncate">{SHORT[s.id] ?? s.label}</span>
            </>
          );
          return (
            <li key={s.id} className="flex min-w-0 flex-1">
              {s.href ? (
                <Link
                  href={s.href}
                  aria-current={on ? "page" : undefined}
                  aria-label={named(s)}
                  className={cn(ITEM, itemTone(on))}
                >
                  {content}
                </Link>
              ) : (
                <button
                  type="button"
                  aria-label={named(s)}
                  onClick={missing(s)}
                  className={cn(ITEM, itemTone(on))}
                >
                  {content}
                </button>
              )}
            </li>
          );
        })}
        <li className="flex min-w-0 flex-1">
          <div ref={more.containerRef} className="relative flex w-full">
            <button
              type="button"
              {...more.triggerProps}
              aria-label={
                moreCurrent
                  ? `More sections, current: ${inMore.find((s) => s.id === current)?.label}`
                  : "More sections"
              }
              className={cn(ITEM, itemTone(moreCurrent || more.open))}
            >
              <TabIcon icon={MoreHorizontal} on={moreCurrent} />
              <span className="max-w-full truncate">More</span>
            </button>
            {more.mounted ? (
              <div
                {...more.panelProps}
                data-tab-menu=""
                className="sk-animate-menu-up absolute bottom-full right-0 z-10 mb-2 w-56 origin-bottom-right rounded-card bg-sko-bg-page p-1 shadow-xl"
              >
                <ul className="flex flex-col">
                  {inMore.map((s) => {
                    const on = s.id === current;
                    const row = cn(
                      MORE_ROW,
                      on
                        ? "bg-sko-bg-primary-soft text-sko-text-on-primary-soft"
                        : "text-sko-text-default",
                    );
                    const content = (
                      <>
                        <Icon
                          icon={ICONS[s.id]}
                          size={20}
                          strokeWidth={on ? 2.25 : 1.75}
                          aria-hidden
                        />
                        <span className="min-w-0 flex-1 truncate">{s.label}</span>
                      </>
                    );
                    return (
                      <li key={s.id}>
                        {s.href ? (
                          <Link
                            href={s.href}
                            aria-current={on ? "page" : undefined}
                            className={row}
                            onClick={more.close}
                          >
                            {content}
                          </Link>
                        ) : (
                          <button
                            type="button"
                            className={row}
                            onClick={() => (more.close(), missing(s)())}
                          >
                            {content}
                          </button>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ) : null}
          </div>
        </li>
      </ul>
    </nav>
  );
}
