import Link from "next/link";
import { Badge } from "@/components/atoms/Badge";
import type { DashboardDueItem } from "@/lib/platform/dashboard";
import { cn } from "@/lib/utils";

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
    <li className="sk-press-card relative flex items-start gap-3 border-b border-sko-border-subtle p-4 shadow-sk-card last:border-b-0 md:px-5">
      <div className="flex w-[60px] shrink-0 flex-col items-center text-center">
        <span
          className={cn(
            "sk-text-headline-small-bold",
            urgency === "today" ? "text-sko-text-warning" : "text-sko-text-default",
          )}
        >
          {day}
        </span>
        <span className="sk-text-label-small-semibold text-sko-text-subtle">{when}</span>
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <div className="flex items-start gap-0.5">
          <p className="sk-text-body-medium-semibold min-w-0 flex-1 text-sko-text-default">
            {/* The title opens the assignment in the player; the whole row is its target (44 at least). */}
            <Link href={href} className="hover:underline after:absolute after:inset-0 after:content-['']">
              {title}
            </Link>
          </p>
          <Badge color={status.color} className="shrink-0 whitespace-nowrap">
            {status.label}
          </Badge>
        </div>
        <p className="sk-text-body-small-regular text-sko-text-subtle">{meta}</p>
      </div>
    </li>
  );
}
