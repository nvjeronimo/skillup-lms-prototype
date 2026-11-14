import Link from "@/lib/router";
import { Badge } from "@/components/atoms/Badge";
import type { DashboardDueItem } from "@/lib/platform/dashboard";
import { cn } from "@/lib/utils";
import styles from "./DueItem.module.css";

/**
 * DS `LMS/Platform/Dashboard/Due-Item`: one assignment deadline in "Due this week" (live
 * sessions left the list on 7 Oct: nothing in Open edX carries them).
 * Date (60 wide, centred): the day in headline-small/Bold, text/warning when Urgency is Today
 * and text/default when Upcoming, over label-small/Semibold text/subtle. Content: the title
 * row (title body-medium/Semibold + the Status badge, gap 2), then the meta body-small/Regular
 * text/subtle under both, full width, gap 2. Status: DS Badge Soft sm Warning ("Due …").
 * v1.2 (Nelson, 22 Oct 2026): the badge moved into the title row so the meta takes the whole
 * width on narrow columns. Gap 12, padding 16 / 20 (16 / 16 on mobile), a 1px border/subtle
 * rule below every item but the last; Shadows/shadow-card (v1.1).
 */
export function DueItem({ day, when, urgency, title, meta, status, href }: Omit<DashboardDueItem, "id">) {
  return (
    <li className={cn("sk-press-card", styles.item)}>
      <div className={styles.date}>
        <span
          className={cn(
            "sk-text-headline-small-bold",
            urgency === "today" ? styles.dayToday : styles.dayUpcoming,
          )}
        >
          {day}
        </span>
        <span className={cn("sk-text-label-small-semibold", styles.when)}>{when}</span>
      </div>
      <div className={styles.content}>
        <div className={styles.titleRow}>
          <p className={cn("sk-text-body-medium-semibold", styles.title)}>
            {/* The title opens the assignment in the player; the whole row is its target (44 at least). */}
            <Link href={href} className={styles.link}>
              {title}
            </Link>
          </p>
          <Badge color={status.color} className={styles.badge}>
            {status.label}
          </Badge>
        </div>
        <p className={cn("sk-text-body-small-regular", styles.meta)}>{meta}</p>
      </div>
    </li>
  );
}
