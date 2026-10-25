"use client";

import * as React from "react";
import Link from "next/link";
import {
  BookOpen,
  CalendarDays,
  LayoutDashboard,
  LifeBuoy,
  MessagesSquare,
  type LucideIcon,
} from "lucide-react";
import { Icon } from "@/lib/icons";
import { PLATFORM_SECTIONS, type PlatformSection } from "@/lib/platform/user";
import { useHarborRailExpanded } from "@/lib/platform/harbor";
import { useLmsStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const ICONS: Record<PlatformSection, LucideIcon> = {
  dashboard: LayoutDashboard,
  "my-learning": BookOpen,
  calendar: CalendarDays,
  discussion: MessagesSquare,
  services: LifeBuoy,
};

/**
 * Harbor's navigation (Nelson, 25 Oct 2026, after the DreamHost panel): a rail on the left from
 * desktop up, instead of the sections in the top bar. Expanded (240): icon and name; collapsed
 * (72): the icon, its name for assistive tech and as a tooltip. The menu button in the bar
 * switches it, remembered per browser. The current page is a Radius/card pill (16 in Harbor) on bg/primary-soft
 * (the panel's #D9EAFC), ink text; the others take bg/hover on hover. Tablet and phone keep
 * their own navigation (the bar's menu, the floating tab bar).
 */
export function HarborRail({ current }: { current: PlatformSection | null }) {
  const expanded = useHarborRailExpanded();
  const showToast = useLmsStore((s) => s.showToast);
  return (
    <aside
      className={cn(
        "sk-no-print hidden shrink-0 self-stretch border-r border-sko-border-subtle bg-sko-bg-page lg:block",
        expanded ? "w-60" : "w-[72px]",
      )}
    >
    <nav aria-label="Platform" className="sticky top-0 flex max-h-[100dvh] flex-col gap-1 overflow-y-auto p-2">
      <ul className="flex flex-col gap-1">
        {PLATFORM_SECTIONS.map((s) => {
          const on = s.id === current;
          const item = cn(
            "sk-text-body-medium-semibold relative flex min-h-11 w-full items-center gap-3 rounded-card text-sko-text-default transition-colors",
            expanded ? "px-4" : "justify-center px-0",
            on ? "bg-sko-bg-primary-soft text-sko-text-on-primary-soft" : "hover:bg-sko-bg-hover",
          );
          const content = (
            <>
              <Icon icon={ICONS[s.id]} size={20} strokeWidth={on ? 2.25 : 1.75} aria-hidden />
              <span className={cn(expanded ? "min-w-0 flex-1 truncate" : "sr-only")}>{s.label}</span>
              {typeof s.count === "number" ? (
                expanded ? (
                  <span className="sk-text-body-small-semibold rounded-pill bg-sko-bg-muted px-2 py-0.5 text-sko-text-muted">
                    <span className="sr-only">, </span>
                    {s.count}
                  </span>
                ) : (
                  <span aria-hidden className="absolute right-3 top-2 size-2 rounded-pill bg-sko-bg-info" />
                )
              ) : null}
            </>
          );
          return (
            <li key={s.id}>
              {s.href ? (
                <Link href={s.href} aria-current={on ? "page" : undefined} title={expanded ? undefined : s.label} className={item}>
                  {content}
                </Link>
              ) : (
                <button
                  type="button"
                  title={expanded ? undefined : s.label}
                  onClick={() => showToast(`${s.label} is not part of this prototype yet`)}
                  className={item}
                >
                  {content}
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
    </aside>
  );
}
