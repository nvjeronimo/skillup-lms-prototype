"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  CalendarClock,
  Check,
  CheckCircle2,
  Clock,
  Flag,
  Lock,
  PlayCircle,
  Radio,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { Icon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import type { TopicType } from "@/lib/types";
import { Badge, type BadgeColor } from "@/components/atoms/Badge";
import { TopicTypeBadge } from "@/components/atoms/TopicTypeBadge";
import { MockTag } from "@/components/lab/MockTag";
import { usePersona } from "@/components/lab/usePersona";
import {
  MOCK,
  nextAction,
  type DueItem,
  type Enrolment,
  type LiveSession,
  type Persona,
} from "@/lib/lab/dashboard-mock";
import { CtaLink } from "./CtaLink";
import { PaceTrack } from "./PaceTrack";
import { ACTIVE_DAYS, TOPICS_TO_NEXT_MODULE, TRACK, WEEK_DAYS } from "./pace-data";

type PaceKind = "not-started" | "on-track" | "ahead" | "behind";

const PACE: Record<
  PaceKind,
  { icon: LucideIcon; circle: string; label: string; panel: string }
> = {
  "not-started": {
    icon: Flag,
    circle: "bg-sko-bg-primary-soft text-sko-icon-primary",
    label: "text-sko-text-primary",
    panel: "border-sko-border-subtle",
  },
  "on-track": {
    icon: CheckCircle2,
    circle: "bg-sko-bg-success-soft text-sko-icon-success",
    label: "text-sko-text-success",
    panel: "border-sko-border-subtle",
  },
  ahead: {
    icon: TrendingUp,
    circle: "bg-sko-bg-info-soft text-sko-icon-info",
    label: "text-sko-text-info",
    panel: "border-sko-border-subtle",
  },
  behind: {
    icon: Clock,
    circle: "bg-sko-bg-warning-soft text-sko-icon-warning",
    label: "text-sko-text-warning",
    panel: "border-sko-border-warning-soft",
  },
};

const DUE_ORDER: Record<DueItem["state"], number> = { overdue: 0, "due-soon": 1, upcoming: 2 };
const DUE_BADGE: Record<DueItem["state"], { color: BadgeColor; label: string; icon: LucideIcon }> = {
  overdue: { color: "warning", label: "Overdue", icon: Clock },
  "due-soon": { color: "info", label: "Due soon", icon: CalendarClock },
  upcoming: { color: "gray", label: "Upcoming", icon: CalendarClock },
};
const DUE_VERB: Record<DueItem["kind"], string> = {
  Quiz: "Take quiz",
  Project: "Open project",
  Assignment: "Open assignment",
  Exam: "Open exam",
};

function paceKind(p: Persona): PaceKind {
  if (p.enrolments.every((e) => e.status === "not-started" || e.status === "locked")) return "not-started";
  return p.pace.value.state;
}

const card = "rounded-xl border border-sko-border-subtle bg-sko-bg-page p-4 md:p-6";

/* ── Page ─────────────────────────────────────────────────────────────────────────────── */

export function View() {
  const p = usePersona();
  const kind = paceKind(p);
  const next = nextAction(p);

  return (
    <main id="main" tabIndex={-1} className="outline-none mx-auto w-full max-w-6xl flex-1 px-4 py-6 md:px-8 md:py-8">
      <h1 className="sk-text-headline-medium-semibold text-sko-text-default">
        {kind === "not-started" ? `Welcome, ${p.firstName}` : `Your week, ${p.firstName}`}
      </h1>
      <p className="sk-text-body-large-regular mt-1 text-sko-text-muted">
        {kind === "not-started"
          ? "Here is where your courses stand and how to begin."
          : "Where you are against your cohort, and what to do this week."}
      </p>

      <PacePanel p={p} kind={kind} next={next} />
      <ThisWeek p={p} kind={kind} />
      <YourCourses enrolments={p.enrolments} />
    </main>
  );
}

/* ── Pace panel (hero) ────────────────────────────────────────────────────────────────── */

function PacePanel({ p, kind, next }: { p: Persona; kind: PaceKind; next?: Enrolment }) {
  const s = PACE[kind];
  const track = TRACK[p.id];
  const course = p.enrolments.find((e) => e.id === "six-sigma")?.title ?? next?.title;

  const stateLabel =
    kind === "not-started" ? "Not started yet" : kind === "behind" ? `${p.pace.value.label} — catching up` : p.pace.value.label;

  const message: Record<PaceKind, string> = {
    "not-started":
      "No catching up to do. The course is self-paced, so you can begin today and go at a speed that suits you.",
    "on-track": "You are keeping pace with your cohort. One or two sessions this week keeps it that way.",
    ahead: "You are a little ahead of your cohort. Nice, steady work.",
    behind: "It happens to most learners at some point, and two weeks is very recoverable. Here is a small plan.",
  };

  return (
    <section aria-labelledby="pace-h" className={cn(card, "mt-6 border", s.panel)}>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="flex min-w-0 flex-col gap-5">
          <div className="flex items-start gap-3">
            <span className={cn("inline-flex size-12 shrink-0 items-center justify-center rounded-full", s.circle)}>
              <Icon icon={s.icon} size={24} aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <h2 id="pace-h" className="sk-text-body-medium-semibold text-sko-text-muted">
                Your pace{course ? ` · ${course}` : ""}
              </h2>
              <p className={cn("sk-text-headline-small-semibold", s.label)}>{stateLabel}</p>
              <p className="sk-text-body-large-regular mt-1 text-sko-text-default">{p.pace.value.detail}.</p>
              <p className="sk-text-body-medium-regular mt-1 text-sko-text-muted">{message[kind]}</p>
            </div>
          </div>

          <PaceTrack {...track} behind={kind === "behind"} />

          {kind === "behind" ? <CatchUpPlan p={p} /> : null}
        </div>

        <UpNext kind={kind} next={next} />
      </div>

      {p.pace.mock ? <MockTag layout="block" reason={p.pace.mock} className="mt-5" /> : null}
    </section>
  );
}

function UpNext({ kind, next }: { kind: PaceKind; next?: Enrolment }) {
  if (!next?.nextTopic) return null;
  const starting = next.status === "not-started";
  const ctaLabel = starting ? "Start course" : kind === "behind" ? "Resume where you left off" : "Resume";
  return (
    <div className="flex flex-col gap-3 rounded-lg bg-sko-bg-subtle p-4">
      <h3 className="sk-text-body-medium-semibold text-sko-text-muted">{starting ? "Start here" : "Up next"}</h3>
      <div className="flex flex-col gap-1">
        <TopicTypeBadge type={next.nextTopic.type as TopicType} />
        <p className="sk-text-body-large-semibold text-sko-text-default">{next.nextTopic.title}</p>
        <p className="sk-text-body-medium-regular text-sko-text-muted">{next.title}</p>
      </div>
      {!starting ? (
        <Progress label={`${next.title} progress`} pct={next.pct} caption={`${next.topicsDone} of ${next.topicsTotal} topics`} />
      ) : null}
      <CtaLink href={next.nextTopic.href} icon={ArrowRight} className="w-full" aria-label={`${ctaLabel}: ${next.title}`}>
        {ctaLabel}
      </CtaLink>
      {starting ? (
        <p className="sk-text-body-small-regular text-sko-text-muted">The first topic is short. There is no deadline to beat.</p>
      ) : null}
    </div>
  );
}

function CatchUpPlan({ p }: { p: Persona }) {
  const track = TRACK[p.id];
  const topics = TOPICS_TO_NEXT_MODULE[p.id];
  const next = nextAction(p);
  const overdue = p.due.value.find((d) => d.state === "overdue");
  const recording = p.live.value.find((l) => l.state === "recording");

  return (
    <div className="rounded-lg border border-sko-border-warning-soft bg-sko-bg-warning-soft p-4">
      <h3 className="sk-text-body-large-semibold text-sko-text-default">Your catch-up plan</h3>
      <p className="sk-text-body-medium-regular mt-0.5 text-sko-text-muted">
        Start with step 1. One step today is enough.
      </p>
      <ol className="mt-3 flex flex-col gap-3">
        {next?.nextTopic ? (
          <PlanStep n={1}>
            <p className="sk-text-body-medium-semibold text-sko-text-default">
              Finish {topics} topics to reach Module {track.you + 1}
            </p>
            <p className="sk-text-body-medium-regular text-sko-text-muted">Start with “{next.nextTopic.title}”.</p>
            <MockTag reason={MOCK.pace} className="mt-1" />
          </PlanStep>
        ) : null}
        {overdue ? (
          <PlanStep n={2}>
            <p className="sk-text-body-medium-semibold text-sko-text-default">{overdue.title}</p>
            <p className="sk-text-body-medium-regular text-sko-text-muted">{overdue.dueLabel}. It sits right after step 1.</p>
            <Link
              href={overdue.href}
              className="sk-text-body-medium-semibold inline-flex min-h-[44px] items-center gap-1 text-sko-text-primary underline underline-offset-4"
            >
              {DUE_VERB[overdue.kind]}
              <span className="sr-only">: {overdue.title}</span>
            </Link>
          </PlanStep>
        ) : null}
        {recording ? (
          <PlanStep n={3}>
            <p className="sk-text-body-medium-semibold text-sko-text-default">Watch the session you missed</p>
            <p className="sk-text-body-medium-regular text-sko-text-muted">
              {recording.title} · Recording available · {recording.when.replace(/^Recorded [^·]+· /, "")}
            </p>
            <Link
              href="#"
              className="sk-text-body-medium-semibold inline-flex min-h-[44px] items-center gap-1 text-sko-text-primary underline underline-offset-4"
            >
              Watch recording
              <span className="sr-only">: {recording.title}</span>
            </Link>
          </PlanStep>
        ) : null}
      </ol>
    </div>
  );
}

function PlanStep({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <span
        aria-hidden="true"
        className="sk-text-body-medium-semibold inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-sko-bg-page text-sko-text-warning ring-1 ring-inset ring-sko-border-warning"
      >
        {n}
      </span>
      <div className="min-w-0 flex-1">
        <span className="sr-only">Step {n}: </span>
        {children}
      </div>
    </li>
  );
}

/* ── This week ────────────────────────────────────────────────────────────────────────── */

function ThisWeek({ p, kind }: { p: Persona; kind: PaceKind }) {
  return (
    <section aria-labelledby="week-h" className="mt-10">
      <h2 id="week-h" className="sk-text-title-medium-semibold text-sko-text-default">
        This week
      </h2>
      <div className="mt-3 grid gap-4 lg:grid-cols-[minmax(0,1fr)_380px]">
        <DueList p={p} />
        <div className="flex flex-col gap-4">
          <WeeklyGoal p={p} kind={kind} />
          <LiveList p={p} />
        </div>
      </div>
    </section>
  );
}

function DueList({ p }: { p: Persona }) {
  const items = [...p.due.value].sort((a, b) => DUE_ORDER[a.state] - DUE_ORDER[b.state]);
  return (
    <div className={card}>
      <h3 className="sk-text-body-large-semibold text-sko-text-default">Due</h3>
      {items.length === 0 ? (
        <p className="sk-text-body-medium-regular mt-2 text-sko-text-muted">
          Nothing is due this week. Deadlines will show here, soonest first.
        </p>
      ) : (
        <ul className="mt-3 flex flex-col divide-y divide-sko-border-subtle">
          {items.map((d) => {
            const b = DUE_BADGE[d.state];
            return (
              <li
                key={d.id}
                className={cn(
                  "flex flex-col gap-3 py-3 first:pt-0 last:pb-0 md:flex-row md:items-center md:justify-between",
                  d.state === "overdue" && "-mx-2 rounded-lg border-l-4 border-sko-border-warning bg-sko-bg-warning-soft px-3 first:pt-3 last:pb-3",
                )}
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge color={b.color} variant="outline" leftIcon={b.icon}>
                      {b.label}
                    </Badge>
                    <span className="sk-text-body-small-medium text-sko-text-subtle">
                      {d.kind} · {d.course}
                    </span>
                  </div>
                  <p className="sk-text-body-medium-semibold mt-1 text-sko-text-default">{d.title}</p>
                  <p className={cn("sk-text-body-medium-regular", d.state === "overdue" ? "text-sko-text-warning" : "text-sko-text-muted")}>
                    {d.state === "overdue" ? d.dueLabel : `Due ${d.dueLabel}`}
                  </p>
                </div>
                <CtaLink
                  href={d.href}
                  variant={d.state === "upcoming" ? "secondary" : "primary"}
                  className="shrink-0 self-start md:self-center"
                  aria-label={`${DUE_VERB[d.kind]}: ${d.title}`}
                >
                  {DUE_VERB[d.kind]}
                </CtaLink>
              </li>
            );
          })}
        </ul>
      )}
      {p.due.mock ? <MockTag layout="block" reason={p.due.mock} className="mt-4" /> : null}
    </div>
  );
}

function WeeklyGoal({ p, kind }: { p: Persona; kind: PaceKind }) {
  const { daysTarget, daysDone } = p.weeklyGoal.value;
  const active = new Set(ACTIVE_DAYS[p.id]);
  const met = daysDone >= daysTarget;
  const next = nextAction(p);

  const line =
    kind === "not-started"
      ? `Aim for ${daysTarget} short sessions a week. Even ten minutes counts.`
      : met
        ? "Goal met for this week."
        : daysDone === 0
          ? `A fresh week. ${daysTarget} learning days is the goal, and today can be the first.`
          : `${daysTarget - daysDone} more ${daysTarget - daysDone === 1 ? "day" : "days"} to reach your goal.`;

  return (
    <div className={card}>
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="sk-text-body-large-semibold text-sko-text-default">Weekly goal</h3>
        <span className="sk-text-body-medium-semibold text-sko-text-default">
          {daysDone} of {daysTarget} days
        </span>
      </div>
      <p className="sk-text-body-medium-regular mt-1 text-sko-text-muted">{line}</p>

      <div
        role="progressbar"
        aria-label="Weekly goal: learning days"
        aria-valuemin={0}
        aria-valuemax={daysTarget}
        aria-valuenow={Math.min(daysDone, daysTarget)}
        aria-valuetext={`${daysDone} of ${daysTarget} days`}
        className="mt-3 h-2 overflow-hidden rounded-full bg-sko-bg-muted"
      >
        <div
          className={cn("h-full rounded-full", met ? "bg-sko-bg-success" : "bg-sko-bg-info")}
          style={{ width: `${Math.min(100, (daysDone / Math.max(daysTarget, 1)) * 100)}%` }}
        />
      </div>

      <p className="sk-text-body-small-medium mt-3 text-sko-text-subtle">Last 7 days</p>
      <ul aria-label="Active days, last 7 days" className="mt-1 grid grid-cols-7 gap-1">
        {WEEK_DAYS.map((d, i) => {
          const on = active.has(i);
          const today = i === WEEK_DAYS.length - 1;
          return (
            <li
              key={d.short}
              className={cn(
                "flex flex-col items-center gap-0.5 rounded-md py-1.5",
                on ? "bg-sko-bg-success-soft text-sko-text-success" : "bg-sko-bg-faint text-sko-text-subtle",
                today && "ring-1 ring-inset ring-sko-border-strong",
              )}
            >
              <span className="sk-text-body-small-medium" aria-hidden="true">
                {d.short}
              </span>
              <span aria-hidden="true" className="inline-flex size-4 items-center justify-center">
                {on ? <Icon icon={Check} size={14} /> : <span className="size-1.5 rounded-full bg-sko-bg-strong" />}
              </span>
              <span className="sr-only">
                {d.long}: {on ? "learned" : "no activity"}
              </span>
            </li>
          );
        })}
      </ul>

      {!met && next?.nextTopic ? (
        <CtaLink href={next.nextTopic.href} variant="secondary" className="mt-4 w-full">
          {kind === "not-started" ? "Do a 10-minute start" : "Learn today"}
        </CtaLink>
      ) : null}
      {p.weeklyGoal.mock ? <MockTag layout="block" reason={p.weeklyGoal.mock} className="mt-4" /> : null}
    </div>
  );
}

const LIVE_BADGE: Record<LiveSession["state"], { color: BadgeColor; label: string; icon: LucideIcon }> = {
  live: { color: "success", label: "Live now", icon: Radio },
  today: { color: "success", label: "Today", icon: CalendarClock },
  upcoming: { color: "gray", label: "Upcoming", icon: CalendarClock },
  recording: { color: "gray", label: "Recording available", icon: PlayCircle },
};

function LiveList({ p }: { p: Persona }) {
  const order: Record<LiveSession["state"], number> = { live: 0, today: 1, recording: 2, upcoming: 3 };
  const items = [...p.live.value].sort((a, b) => order[a.state] - order[b.state]);

  return (
    <div className={card}>
      <h3 className="sk-text-body-large-semibold text-sko-text-default">Live sessions</h3>
      {items.length === 0 ? (
        <p className="sk-text-body-medium-regular mt-2 text-sko-text-muted">No live sessions are scheduled for your courses.</p>
      ) : (
        <ul className="mt-3 flex flex-col gap-4">
          {items.map((l) => {
            const b = LIVE_BADGE[l.state];
            const cta =
              l.state === "live"
                ? { label: "Join now", variant: "success" as const }
                : l.state === "recording"
                  ? { label: "Watch recording", variant: "secondary" as const }
                  : { label: "View details", variant: "secondary" as const };
            return (
              <li key={l.id} className="flex flex-col gap-2">
                <div>
                  <Badge color={b.color} variant={l.state === "live" ? "soft" : "outline"} leftIcon={b.icon}>
                    {b.label}
                  </Badge>
                  <p className="sk-text-body-medium-semibold mt-1 text-sko-text-default">{l.title}</p>
                  <p className="sk-text-body-medium-regular text-sko-text-muted">
                    {l.when} · {l.course} · with {l.host}
                  </p>
                </div>
                <CtaLink href="#" variant={cta.variant} className="self-start" aria-label={`${cta.label}: ${l.title}`}>
                  {cta.label}
                </CtaLink>
              </li>
            );
          })}
        </ul>
      )}
      {p.live.mock ? <MockTag layout="block" reason={p.live.mock} className="mt-4" /> : null}
    </div>
  );
}

/* ── Your courses ─────────────────────────────────────────────────────────────────────── */

const STATUS_BADGE: Record<Enrolment["status"], { color: BadgeColor; label: string; icon?: LucideIcon }> = {
  "in-progress": { color: "info", label: "In progress" },
  "not-started": { color: "gray", label: "Not started" },
  completed: { color: "success", label: "Completed", icon: CheckCircle2 },
  locked: { color: "gray", label: "Locked", icon: Lock },
};

function YourCourses({ enrolments }: { enrolments: Enrolment[] }) {
  return (
    <section aria-labelledby="courses-h" className="mt-10">
      <h2 id="courses-h" className="sk-text-title-medium-semibold text-sko-text-default">
        Your courses
      </h2>
      <ul className="mt-3 flex flex-col divide-y divide-sko-border-subtle rounded-xl border border-sko-border-subtle bg-sko-bg-page">
        {enrolments.map((e) => (
          <CourseRow key={e.id} e={e} />
        ))}
      </ul>
    </section>
  );
}

function CourseRow({ e }: { e: Enrolment }) {
  const s = STATUS_BADGE[e.status];
  const cta =
    e.status === "locked"
      ? null
      : e.status === "completed"
        ? e.cert === "downloadable"
          ? { label: "View certificate", href: "#", icon: Award }
          : null
        : e.nextTopic
          ? { label: e.status === "not-started" ? "Start" : "Resume", href: e.nextTopic.href, icon: ArrowRight }
          : null;

  return (
    <li className="grid gap-3 p-4 md:grid-cols-[minmax(0,1fr)_200px_auto] md:items-center md:gap-6">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <Badge color={s.color} variant="outline" leftIcon={s.icon}>
            {s.label}
          </Badge>
          {e.cert === "generating" ? (
            <span className="sk-text-body-small-medium text-sko-text-subtle">Certificate being prepared</span>
          ) : null}
        </div>
        <p className="sk-text-body-large-semibold mt-1 text-sko-text-default">{e.title}</p>
        <p className="sk-text-body-medium-regular text-sko-text-muted">
          {e.status === "locked" && e.lockedBy
            ? `Opens after you finish ${e.lockedBy}`
            : e.nextTopic && e.status !== "completed"
              ? `Next: ${e.nextTopic.title}`
              : `Last active ${e.lastActive.toLowerCase()}`}
        </p>
      </div>

      <Progress
        label={`${e.title} progress`}
        pct={e.pct}
        caption={`${e.topicsDone} of ${e.topicsTotal} topics`}
        complete={e.status === "completed"}
      />

      <div className="md:justify-self-end">
        {cta ? (
          <CtaLink href={cta.href} variant="secondary" icon={cta.icon} aria-label={`${cta.label}: ${e.title}`}>
            {cta.label}
          </CtaLink>
        ) : null}
      </div>
    </li>
  );
}

/* ── Shared ───────────────────────────────────────────────────────────────────────────── */

function Progress({
  label,
  pct,
  caption,
  complete = false,
}: {
  label: string;
  pct: number;
  caption: string;
  complete?: boolean;
}) {
  const v = Math.max(0, Math.min(100, pct));
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between gap-2">
        <span className="sk-text-body-small-medium text-sko-text-muted">{caption}</span>
        <span className="sk-text-body-small-semibold text-sko-text-default">{v}%</span>
      </div>
      <div
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={v}
        className="h-2 overflow-hidden rounded-full bg-sko-bg-muted"
      >
        <div
          className={cn("h-full rounded-full", complete ? "bg-sko-bg-success" : "bg-sko-bg-info")}
          style={{ width: `${v}%` }}
        />
      </div>
    </div>
  );
}
