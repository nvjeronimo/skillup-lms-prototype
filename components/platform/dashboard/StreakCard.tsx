import { Check } from "lucide-react";
import { Icon } from "@/lib/icons";
import type { DashboardWeekDay, WeekDayState } from "@/lib/platform/dashboard";
import { cn } from "@/lib/utils";

const WEEK_DAY_STATUS: Record<WeekDayState, string> = {
  done: "learned",
  "today-done": "today, learned",
  upcoming: "upcoming",
};

/**
 * `LMS / Course Detail / Week day` (5848:139230): one day of the weekly strip, 32 wide,
 * label over a 28px dot, gap 6. Done: body-small/Medium text/subtle, bg/page dot with a 1px
 * border/subtle and a 14px check. Today done: body-small/Semibold text/on-primary-soft, 2px
 * border/primary. Upcoming: 1.5px dashed border/subtle, no fill.
 */
export function WeekDay({ day, name, state }: DashboardWeekDay) {
  const today = state === "today-done";
  return (
    <li className="flex w-8 flex-col items-center gap-1.5">
      <span
        aria-hidden="true"
        className={cn(
          "whitespace-nowrap text-center",
          today ? "sk-text-body-small-semibold text-sko-text-on-primary-soft" : "sk-text-body-small-medium text-sko-text-subtle",
        )}
      >
        {day}
      </span>
      <span
        aria-hidden="true"
        className={cn(
          "flex size-7 shrink-0 items-center justify-center rounded-full",
          state === "done" && "border border-sko-border-subtle bg-sko-bg-page",
          today && "border-2 border-sko-border-primary bg-sko-bg-page",
          state === "upcoming" && "border-[1.5px] border-dashed border-sko-border-subtle",
        )}
      >
        {state === "upcoming" ? null : (
          <Icon icon={Check} size={14} className={today ? "text-sko-icon-primary" : "text-sko-icon-success"} />
        )}
      </span>
      <span className="sr-only">
        {name}: {WEEK_DAY_STATUS[state]}
      </span>
    </li>
  );
}

export interface StreakCardProps {
  count: number;
  /** Two lines, as drawn. */
  label: [string, string];
  week: DashboardWeekDay[];
  message: { before: string; highlight: string; after: string };
  className?: string;
}

/**
 * DS `LMS / Platform / Streak card` (6384:17785): Count (display-large/Bold, text/primary,
 * the one hero figure on the screen), Label (label-small/Semibold, text/subtle, 129 wide,
 * 8 above the baseline row), the week as seven Week day, and a Message in body-medium with
 * the time left in body-medium/Semibold text/primary (310 wide). bg/page, 1px border/subtle,
 * radius 8, gap 12, padding 24 / 20 / 16.
 * display-large is mode-aware in the DS: 72/90 desktop, 60/72 tablet, 48/60 mobile. The
 * class only carries the desktop pair, so the two custom properties it reads are set here.
 */
export function StreakCard({ count, label, week, message, className }: StreakCardProps) {
  return (
    <section
      aria-label="Streak"
      data-mock="Streak and days learned are not exposed by any API"
      className={cn(
        "flex flex-col gap-3 rounded-lg border border-sko-border-subtle bg-sko-bg-page p-4 md:p-5 lg:p-6",
        className,
      )}
    >
      <p className="flex items-end gap-3">
        {/* display-large/Bold: 72/90, 60/72, 48/60 by mode (tokens/typography.css). */}
        <span className="sk-text-display-large-bold whitespace-nowrap text-sko-text-primary">
          {count}
        </span>{" "}
        <span className="sk-text-label-small-semibold w-[129px] pb-2 text-sko-text-subtle">
          {label[0]}
          <br />
          {label[1]}
        </span>
      </p>
      <ul className="flex items-start justify-between">
        {week.map((d) => (
          <WeekDay key={d.day} {...d} />
        ))}
      </ul>
      <p className="sk-text-body-medium-regular max-w-[310px] text-sko-text-subtle">
        {message.before}
        <span className="sk-text-body-medium-semibold text-sko-text-primary">{message.highlight}</span>
        {message.after}
      </p>
    </section>
  );
}
