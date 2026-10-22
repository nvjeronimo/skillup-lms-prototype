"use client";

import * as React from "react";
import Link from "next/link";
import { BookOpen, CalendarDays, LayoutDashboard, LifeBuoy, MessagesSquare, type LucideIcon } from "lucide-react";
import { Icon } from "@/lib/icons";
import { PLATFORM_SECTIONS, type PlatformSection } from "@/lib/platform/user";
import { useLmsStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const ICONS: Record<PlatformSection, LucideIcon> = {
  dashboard: LayoutDashboard,
  "my-learning": BookOpen,
  calendar: CalendarDays,
  discussion: MessagesSquare,
  services: LifeBuoy,
};

/** Shorter names where the full one does not fit a fifth of a phone (the page title keeps it). */
const SHORT: Partial<Record<PlatformSection, string>> = { "my-learning": "Learning" };

/**
 * The platform sections on a phone (Nelson, 22 Oct 2026: "a floating menu, as in an app"). A pill
 * that floats 16 above the bottom edge (plus the safe area) with the five sections of the top bar,
 * in its order (`PLATFORM_SECTIONS`, as the desktop tabs and the tablet menu). Each is an icon over
 * a short label (body-small Medium: Semibold "Dashboard" does not fit a fifth of a 375 phone), 56
 * tall; the current one sits on a bg/primary-soft pill with a heavier icon, so it never depends on
 * colour alone. Links with `aria-current`, not a tablist:
 * each opens another page. The material is bg/page at 88% under a blur, solid under "reduce
 * transparency"; a soft shadow lifts it, no border, no gradient. Phones only: tablet and desktop
 * keep the top bar. The assistant launcher stacks above it (AssistantChat measures it).
 */
export function PlatformTabBar({ current }: { current: PlatformSection | null }) {
  const showToast = useLmsStore((s) => s.showToast);
  return (
    <nav
      aria-label="Platform"
      data-floating-nav=""
      className="sk-floating-nav sk-no-print sk-animate-rise fixed inset-x-4 bottom-[calc(1rem+env(safe-area-inset-bottom,0px))] z-30 rounded-pill p-1"
    >
      <ul className="flex items-stretch">
        {PLATFORM_SECTIONS.map((s) => {
          const isCurrent = s.id === current;
          const label = SHORT[s.id] ?? s.label;
          const itemClass = cn(
            "sk-text-body-small-medium relative flex min-h-14 w-full flex-col items-center justify-center gap-0.5 rounded-pill transition-[background-color,color,transform] duration-short2 ease-standard-decelerate active:scale-[.96]",
            isCurrent ? "bg-sko-bg-primary-soft text-sko-text-on-primary-soft" : "text-sko-text-subtle",
          );
          const content = (
            <>
              <span className="relative">
                <Icon icon={ICONS[s.id]} size={22} strokeWidth={isCurrent ? 2.25 : 1.75} aria-hidden />
                {typeof s.count === "number" && s.count > 0 ? (
                  <span
                    aria-hidden
                    className="sk-text-label-small-semibold absolute -right-2.5 -top-1.5 inline-flex h-4 min-w-4 items-center justify-center rounded-pill bg-sko-bg-primary px-1 text-sko-text-on-primary"
                  >
                    {s.count}
                  </span>
                ) : null}
              </span>
              <span className="max-w-full truncate">{label}</span>
            </>
          );
          const name = typeof s.count === "number" && s.count > 0 ? `${s.label}, ${s.count} items` : s.label;
          return (
            <li key={s.id} className="flex min-w-0 flex-1">
              {s.href ? (
                <Link href={s.href} aria-current={isCurrent ? "page" : undefined} aria-label={name} className={itemClass}>
                  {content}
                </Link>
              ) : (
                // No page for this section in the prototype: say so instead of a dead link.
                <button
                  type="button"
                  aria-label={name}
                  onClick={() => showToast(`${s.label} is not part of this prototype yet`)}
                  className={itemClass}
                >
                  {content}
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
