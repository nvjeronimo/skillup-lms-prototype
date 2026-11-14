import * as React from "react";
import Link from "@/lib/router";
import {
  BookOpen,
  CalendarDays,
  LayoutDashboard,
  LifeBuoy,
  MessagesSquare,
  type LucideIcon,
} from "lucide-react";
import { Icon } from "@/lib/icons";
import { platformSections, type PlatformSection } from "@/lib/platform/user";
import { useEdxScope } from "@/lib/edx-scope";
import { useHarborRailExpanded } from "@/lib/platform/harbor";
import { useLmsStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import styles from "./HarborRail.module.css";

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
  // Open edX scope: no Services, no My Learning count.
  const sections = platformSections(useEdxScope());
  return (
    <aside
      className={cn(
        // Opening and closing ease the width (medium2) instead of jumping; the names fade in as it
        // opens. A page transition leaves it still (sk-vt-platform-rail, globals.css).
        "sk-no-print sk-vt-platform-rail",
        styles.rail,
        expanded ? styles.railExpanded : styles.railCollapsed,
      )}
    >
    <nav aria-label="Platform" className={styles.nav}>
      <ul className={styles.list}>
        {sections.map((s) => {
          const on = s.id === current;
          const item = cn(
            "sk-text-body-medium-semibold",
            styles.item,
            expanded ? styles.itemExpanded : styles.itemCollapsed,
            on ? styles.itemCurrent : styles.itemIdle,
          );
          const content = (
            <>
              <Icon icon={ICONS[s.id]} size={20} strokeWidth={on ? 2.25 : 1.75} aria-hidden />
              <span key={String(expanded)} className={cn(expanded ? cn("sk-animate-fade", styles.label) : "sk-sr-only")}>{s.label}</span>
              {typeof s.count === "number" ? (
                expanded ? (
                  <span className={cn("sk-text-body-small-semibold", styles.count)}>
                    <span className="sk-sr-only">, </span>
                    {s.count}
                  </span>
                ) : (
                  <span aria-hidden className={styles.dot} />
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
