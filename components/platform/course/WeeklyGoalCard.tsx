"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { Icon } from "@/lib/icons";
import { Button } from "@/components/atoms/Button";
import { CardShell } from "@/components/platform/program/parts";
import { useLmsStore } from "@/lib/store";
import type { WeekDayState, WeeklyGoal } from "@/lib/platform/course-detail";
import { cn } from "@/lib/utils";

const DAY_STATE_LABEL: Record<WeekDayState, string> = {
  done: "active",
  missed: "not active",
  today: "today, not active yet",
  "today-done": "today, active",
  upcoming: "upcoming",
};

/**
 * DS `LMS/Platform/Course-Detail/Week-Day`: the two-letter day (body-small/Medium, text/subtle;
 * today body-small/Semibold on text/on-primary-soft) over a 28px dot, 6 apart.
 * Done: bg/page, 1px border/subtle, a 14px check. Missed: bg/subtle, 1px border/subtle.
 * Today: bg/page, 2px border/primary (with the check once the day counts).
 * Upcoming: no fill, 1.5px dashed border/subtle.
 */
function WeekDay({ day }: { day: WeeklyGoal["days"][number] }) {
  const today = day.state === "today" || day.state === "today-done";
  const checked = day.state === "done" || day.state === "today-done";
  return (
    <li className="flex w-8 flex-col items-center gap-1.5">
      <span
        aria-hidden
        className={cn(
          today ? "sk-text-body-small-semibold text-sko-text-on-primary-soft" : "sk-text-body-small-medium text-sko-text-subtle",
        )}
      >
        {day.label}
      </span>
      <span
        aria-hidden
        className={cn(
          "flex size-7 items-center justify-center rounded-full text-sko-icon-success",
          day.state === "done" && "border border-sko-border-subtle bg-sko-bg-page",
          day.state === "missed" && "border border-sko-border-subtle bg-sko-bg-subtle",
          today && "border-2 border-sko-border-primary bg-sko-bg-page",
          day.state === "upcoming" && "border-[1.5px] border-dashed border-sko-border-subtle",
        )}
      >
        {checked ? <Icon icon={Check} size={14} /> : null}
      </span>
      <span className="sr-only">
        {day.name}: {DAY_STATE_LABEL[day.state]}
      </span>
    </li>
  );
}

/**
 * DS `LMS/Platform/Course-Detail/Weekly-Goal-Card` (component handoff 6350:7334), the two
 * states the screens draw:
 * - State=Met (Course tab sidebar, 6406:39279): title, text, then the week inside a
 *   bg/success-soft box (radius 8, padding 12) with the count in text/success over last
 *   week's, a 1px rule and the plan line with "Edit goal".
 * - State=Set (Progress tab, 6406:41528): title, text, a 1px rule, the week on the card
 *   itself with the count and last week's on one line, then the plan line.
 * The other states of the component are not on any screen and are not built.
 */
export function WeeklyGoalCard({
  goal,
  labelAs = "h2",
  className,
}: {
  goal: WeeklyGoal;
  labelAs?: "h2" | "h3";
  className?: string;
}) {
  const showToast = useLmsStore((s) => s.showToast);
  const met = goal.state === "met";

  const days = (
    <ul aria-label={goal.week} className="flex items-start justify-between">
      {goal.days.map((day) => (
        <WeekDay key={day.label} day={day} />
      ))}
    </ul>
  );
  const rule = <span aria-hidden className="border-t border-sko-border-subtle" />;

  return (
    <CardShell
      label="Weekly goal"
      labelAs={labelAs}
      gap="lg"
      mock="Days active this week and last week's count are not returned by any API"
      className={className}
    >
      <p className="sk-text-body-large-semibold text-sko-text-default">{goal.title}</p>
      <p className="sk-text-body-medium-regular text-sko-text-subtle">{goal.body}</p>

      {met ? (
        <>
          <div className="flex flex-col gap-2 rounded-lg bg-sko-bg-success-soft p-3">
            <p className="sk-text-body-small-medium text-sko-text-subtle">{goal.week}</p>
            {days}
            <div className="flex flex-col">
              <p className="sk-text-body-medium-semibold text-sko-text-success">{goal.count}</p>
              <p className="sk-text-body-small-medium text-sko-text-subtle">{goal.lastWeek}</p>
            </div>
          </div>
          {rule}
        </>
      ) : (
        <>
          {rule}
          <div className="flex flex-col gap-2">
            <p className="sk-text-body-small-medium text-sko-text-subtle">{goal.week}</p>
            {days}
            <div className="flex flex-wrap items-center justify-between gap-x-2">
              <p className="sk-text-body-medium-regular text-sko-text-subtle">{goal.count}</p>
              <p className="sk-text-body-small-medium text-sko-text-subtle">{goal.lastWeek}</p>
            </div>
          </div>
        </>
      )}

      <div className="flex items-center justify-between gap-3">
        <p className="sk-text-body-small-regular text-sko-text-subtle">{goal.plan}</p>
        <Button
          hierarchy="link"
          size="sm"
          onClick={() => showToast("Edit goal is not part of this prototype yet")}
          className="shrink-0"
        >
          Edit goal
        </Button>
      </div>
    </CardShell>
  );
}
