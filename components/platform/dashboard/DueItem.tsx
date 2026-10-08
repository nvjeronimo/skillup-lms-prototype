import { Badge } from "@/components/atoms/Badge";
import type { DashboardDueItem } from "@/lib/platform/dashboard";
import { cn } from "@/lib/utils";

/**
 * DS `LMS / Platform / Due item` (6382:3495): one deadline or live session in "Due this week".
 * Date (60 wide): the day in headline-small/Bold, text/error when Urgency is Today and
 * text/default when Upcoming, over label-small/Semibold text/subtle. Content: title
 * body-medium/Semibold, meta body-small/Regular text/subtle, gap 2. Status: DS Badge v2
 * Soft sm (Error + dot for Live, Warning for Due …). Gap 12, padding 16 / 20 (16 / 16 on
 * mobile), a 1px border/subtle rule below every item but the last.
 */
export function DueItem({ day, when, urgency, title, meta, status }: Omit<DashboardDueItem, "id">) {
  return (
    <li className="flex items-start gap-3 border-b border-sko-border-subtle p-4 last:border-b-0 md:px-5">
      <div className="flex w-[60px] shrink-0 flex-col">
        <span
          className={cn(
            "sk-text-headline-small-bold",
            urgency === "today" ? "text-sko-text-error" : "text-sko-text-default",
          )}
        >
          {day}
        </span>
        <span className="sk-text-label-small-semibold text-sko-text-subtle">{when}</span>
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <p className="sk-text-body-medium-semibold text-sko-text-default">{title}</p>
        <p className="sk-text-body-small-regular text-sko-text-subtle">{meta}</p>
      </div>
      {/* _Badge base Dot: 6 left, an 8px dot slot, 4 to the label. The Badge atom has no Dot
          option, so the slot is composed here (pl-1.5 + gap-1 over the atom's px-2). */}
      <Badge color={status.color} className={cn("shrink-0 whitespace-nowrap", status.dot && "gap-1 pl-1.5")}>
        {status.dot ? (
          <span aria-hidden="true" className="flex size-2 items-center justify-center">
            <span className="size-1.5 rounded-full bg-sko-bg-error" />
          </span>
        ) : null}
        {status.label}
      </Badge>
    </li>
  );
}
