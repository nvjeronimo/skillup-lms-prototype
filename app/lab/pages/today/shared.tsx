"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button, type ButtonProps } from "@/components/atoms/Button";
import { DemoButton } from "@/components/lab/pages/DemoButton";
import { MockTag } from "@/components/lab/MockTag";
import { MOCK } from "@/lib/lab/dashboard-mock";
import type { PlanDay, Session, TrainingPlan } from "@/lib/lab/training-plan";
import type { TopicType } from "@/lib/types";

/** The lab's mock "today" (training-plan.ts: MOCK_TODAY_INDEX = Tuesday 30 Sep). */
export const TODAY_LABEL = "Tuesday 30 September";

const DAY_LONG: Record<string, string> = {
  Mon: "Monday",
  Tue: "Tuesday",
  Wed: "Wednesday",
  Thu: "Thursday",
  Fri: "Friday",
  Sat: "Saturday",
  Sun: "Sunday",
};

export const dayLong = (d: PlanDay) => DAY_LONG[d.short] ?? d.short;
/** "Wed 1 Oct" — the mock week runs Mon 29 Sep to Sun 5 Oct. */
export const dayDate = (d: PlanDay) => `${d.short} ${d.date} ${d.date >= 29 ? "Sep" : "Oct"}`;

/** Session `kind` → the DS topic type, for TopicTypeBadge. */
export function kindToTopicType(kind: string): TopicType {
  switch (kind) {
    case "Video":
      return "Video";
    case "Reading":
      return "Reading";
    case "Quiz":
      return "Quiz";
    case "Live session":
      return "VILT-Live Session";
    case "Recording":
      return "VILT-Recording";
    case "Project":
      return "Project";
    case "Assignment":
      return "Practice Assignment";
    default:
      return "Lesson Page";
  }
}

export const isLiveNow = (s: Session) => s.state === "live" && s.time === "Live now";

/** "Video · 12 min", "Live session at 17:30", "Live now". */
export function sessionMeta(s: Session): string {
  if (s.state === "live") return isLiveNow(s) ? "Live now" : `Live session at ${s.time}`;
  return `${s.kind} · ${s.minutes} min`;
}

export interface DatedSession extends Session {
  day: PlanDay;
}

/** Sessions still ahead this week (today's other sessions included), minus today's main one and live-now. */
export function stillAhead(plan: TrainingPlan): DatedSession[] {
  return plan.days
    .filter((d) => !d.isPast)
    .flatMap((d) => d.sessions.map((s) => ({ ...s, day: d })))
    .filter((s) => s.state !== "today" && s.state !== "done" && !isLiveNow(s));
}

export function liveNow(plan: TrainingPlan): Session | undefined {
  return plan.days.find((d) => d.isToday)?.sessions.find(isLiveNow);
}

/** A missed session that the re-plan put on a later day, e.g. "Wed". */
export function movedTo(plan: TrainingPlan, s: Session): string | undefined {
  const later = plan.days.find((d) => !d.isPast && d.sessions.some((x) => x.state === "moved" && x.title === s.title));
  return later?.short;
}

export function plural(n: number, one: string, many = `${one}s`) {
  return `${n} ${n === 1 ? one : many}`;
}

/**
 * A DS Button that navigates. Where the lab has no destination (href "#"), it becomes a DemoButton,
 * which says so instead of pretending.
 */
export function GoButton({ href, ...props }: Omit<ButtonProps, "onClick"> & { href: string }) {
  const router = useRouter();
  if (!href || href === "#") return <DemoButton {...props} />;
  return <Button {...props} onClick={() => router.push(href)} />;
}

/** The one MockTag per page, at the bottom. */
export function PageMock({ live = false }: { live?: boolean }) {
  return (
    <div className="mt-16">
      <MockTag
        layout="block"
        reason={`The week plan, its dates and the re-plan are mocked. ${MOCK.pace}. ${MOCK.due}.${live ? ` ${MOCK.live}.` : ""}`}
      />
    </div>
  );
}

/** Focus ring for the few custom controls (the Button has its own). */
export const FOCUS =
  "focus-visible:outline-none focus-visible:shadow-[0_0_0_2px_var(--color-border-focus-gap),0_0_0_4px_var(--color-border-primary)]";
