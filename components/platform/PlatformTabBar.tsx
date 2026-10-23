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

/** The sections in the bar itself; every other section (and any added later) goes under More. */
const IN_BAR: PlatformSection[] = ["dashboard", "my-learning", "calendar"];

type Section = (typeof PLATFORM_SECTIONS)[number];

const ITEM =
  "sk-text-body-small-semibold relative flex h-11 shrink-0 items-center justify-center rounded-control transition-[background-color,color,transform] duration-short2 ease-standard-decelerate active:scale-[.96]";
/** Compact, as an iOS tab bar (Nelson, 23 Oct 2026): the current tab is a wide segment with its
    label beside the icon; the others are 44 × 44 icons, their names kept for screen readers. */
const itemTone = (on: boolean) =>
  on
    ? // As DS Tab-Bar-Item 1.1: padding 12 (Spacing/lg), gap 16 (Spacing/xl, room for the count).
      "gap-4 bg-sko-bg-primary-soft px-3 text-sko-text-on-primary-soft"
    : "w-11 text-sko-text-subtle hover:bg-sko-bg-hover";
const labelTone = (on: boolean) => (on ? "whitespace-nowrap" : "sr-only");

/** A row of the More panel: 44 tall, 20px icon, body-medium/Medium, Radius/card-inset (as the profile menu rows). */
const MORE_ROW =
  "sk-text-body-medium-medium flex min-h-11 w-full items-center gap-3 rounded-card-inset px-3 text-left transition-colors hover:bg-sko-bg-hover";

function TabIcon({
  icon,
  on,
  count,
  size = 22,
}: {
  icon: LucideIcon;
  on: boolean;
  count?: number;
  size?: number;
}) {
  return (
    <span className="relative">
      <Icon icon={icon} size={size} strokeWidth={on ? 2.25 : 1.75} aria-hidden />
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
 * his answers to the open question). A bar that floats 16 above the bottom edge (plus the safe
 * area), leaving the right corner to the assistant launcher, which sits beside it on the same line.
 * Dashboard, My Learning and Calendar are in the bar; More gathers the rest (Discussion, Services, and
 * any section added later) in a panel that opens above it. Before the compact pass each item was an icon over a short label
 * (body-small Medium; the full name, cut with an ellipsis when it does not fit, Nelson 23 Oct 2026), 56 tall; the current one sits on a bg/primary-soft fill with a heavier icon,
 * so it never depends on colour alone (More is current on any page it holds). Links with
 * `aria-current`, not a tablist: each opens another page. The material is bg/page at 88% under a
 * blur, solid under "reduce transparency"; a soft shadow lifts it, no border, no gradient. Phones
 * only: tablet and desktop keep the top bar. Radius by role (decision 028): the bar is a track, its
 * items controls, the More panel a card with card-inset rows; in Studio they are pills.
 * Compact since 23 Oct 2026 (Nelson, iOS style): the bar hugs its items (52 tall, not 64); only the
 * current tab shows its label, beside the icon; the others are icon-only 44 × 44 targets with
 * `aria-label`. The current tab still never depends on colour alone: its fill, its label, a heavier icon.
 * It slides away while the learner scrolls down and comes back on any scroll up, at the top and at
 * the end of the page, and when the keyboard focus reaches it (Nelson, 23 Oct 2026); never while
 * the More panel is open. Under reduced motion it fades instead of sliding (globals.css).
 */
export function PlatformTabBar({ current }: { current: PlatformSection | null }) {
  const showToast = useLmsStore((s) => s.showToast);
  const inBar = PLATFORM_SECTIONS.filter((s) => IN_BAR.includes(s.id));
  const inMore = PLATFORM_SECTIONS.filter((s) => !IN_BAR.includes(s.id));
  const moreCurrent = inMore.some((s) => s.id === current);
  const more = useDisclosure();
  const [scrolledAway, setScrolledAway] = React.useState(false);
  React.useEffect(() => {
    let last = window.scrollY;
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const y = window.scrollY;
        const delta = y - last;
        const atEnd = window.innerHeight + y >= document.documentElement.scrollHeight - 4;
        // A small dead zone, so a finger resting on the glass does not make the bar flicker.
        if (y < 64 || atEnd || delta < -6) setScrolledAway(false);
        else if (delta > 6) setScrolledAway(true);
        if (Math.abs(delta) > 6) last = y;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);
  const hidden = scrolledAway && !more.open;

  const named = (s: Section) =>
    typeof s.count === "number" && s.count > 0 ? `${s.label}, ${s.count} items` : s.label;
  // No page for this section in the prototype: say so instead of a dead link.
  const missing = (s: Section) => () => showToast(`${s.label} is not part of this prototype yet`);

  return (
    <nav
      aria-label="Platform"
      data-floating-nav=""
      data-hidden={hidden || undefined}
      onFocus={() => setScrolledAway(false)}
      className="sk-floating-nav sk-no-print sk-animate-rise fixed bottom-[calc(1rem+env(safe-area-inset-bottom,0px))] left-4 z-30 max-w-[calc(100vw-5.5rem)] rounded-track p-1"
    >
      <ul className="flex items-center gap-1">
        {inBar.map((s) => {
          const on = s.id === current;
          const content = (
            <>
              <TabIcon icon={ICONS[s.id]} on={on} count={s.count} size={on ? 20 : 22} />
              <span className={labelTone(on)}>{s.label}</span>
            </>
          );
          return (
            <li key={s.id} className="flex">
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
        <li className="flex">
          <div ref={more.containerRef} className="relative flex">
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
              <TabIcon icon={MoreHorizontal} on={moreCurrent} size={moreCurrent ? 20 : 22} />
              <span className={labelTone(moreCurrent)}>More</span>
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
