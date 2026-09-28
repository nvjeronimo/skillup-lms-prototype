import * as React from "react";
import type { Enrolment } from "@/lib/lab/dashboard-mock";
import type { Session, TrainingPlan } from "@/lib/lab/training-plan";
import { cn } from "@/lib/utils";

export const WEEKS = 12;

/**
 * MOCK: the week of the 12-week plan a learner is in. edX has no schedule, so it is derived from the REAL
 * completion % (one week per twelfth done). Six Sigma reuses the Today plan's week so both pages agree.
 */
export function planWeek(e: Enrolment, plan: TrainingPlan): number {
  if (e.status === "not-started") return 0;
  if (e.id === "six-sigma" && plan.weekIndex > 0) return plan.weekIndex;
  return Math.min(WEEKS, Math.floor((e.pct / 100) * WEEKS) + 1);
}

/** Days since the last visit, from the REAL relative `last_visited` label. */
export function daysAway(lastActive: string): number {
  const d = /(\d+)\s+days?\s+ago/i.exec(lastActive);
  if (d) return Number(d[1]);
  const m = /(\d+)\s+months?\s+ago/i.exec(lastActive);
  if (m) return Number(m[1]) * 30;
  return 0;
}

export type NextSession = Session & { day: string };

/** The next session of this course on the week plan (MOCK schedule), today first, live sessions excluded. */
export function nextSession(e: Enrolment, plan: TrainingPlan): NextSession | undefined {
  for (const d of plan.days) {
    if (d.isPast && !d.isToday) continue;
    const s = d.sessions.find(
      (x) => e.title.startsWith(x.course) && (x.state === "today" || x.state === "planned" || x.state === "moved"),
    );
    if (s) return { ...s, day: d.isToday ? "Today" : d.short };
  }
  return undefined;
}

/** Twelve squares: done = graphite, current week = lime, the rest of the plan = outlined teal. */
export function WeekStrip({ week, className }: { week: number; className?: string }) {
  return (
    <ol className={cn("tb-weeks", className)} aria-hidden>
      {Array.from({ length: WEEKS }, (_, i) => {
        const n = i + 1;
        const cls = week === 0 ? "tb-mark-plan" : n < week ? "tb-mark-done" : n === week ? "tb-mark-today" : "tb-mark-plan";
        return <li key={n} className={cn("tb-mark", cls)} />;
      })}
    </ol>
  );
}

export function WeekLegend() {
  return (
    <ul className="tb-meta tb-c-ink2 flex flex-wrap gap-x-3 gap-y-1" aria-label="Legend for the 12-week plans">
      <li className="flex items-center gap-1.5"><span className="tb-mark tb-mark-done" aria-hidden />Weeks done</li>
      <li className="flex items-center gap-1.5"><span className="tb-mark tb-mark-today" aria-hidden />This week</li>
      <li className="flex items-center gap-1.5"><span className="tb-mark tb-mark-plan" aria-hidden />Still to come</li>
    </ul>
  );
}

/** A section of the Plans page: strong rule, uppercase heading, count in a fixed numeral slot. */
export function PlanSection({
  id,
  title,
  count,
  aside,
  children,
}: {
  id: string;
  title: string;
  count: number;
  aside?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section aria-labelledby={id} className="tb-rule-strong-t mt-12 pt-6">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <h2 id={id} className="tb-h2">
          {title} <span className="tb-num tb-c-ink3">{count}</span>
        </h2>
        {aside}
      </div>
      {children}
    </section>
  );
}
