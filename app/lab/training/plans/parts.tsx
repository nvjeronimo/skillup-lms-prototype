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

