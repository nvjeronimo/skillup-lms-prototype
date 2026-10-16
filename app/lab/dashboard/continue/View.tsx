"use client";

import * as React from "react";
import { AlertTriangle, ArrowRight, Award, CalendarDays, CheckCircle2, Clock, PartyPopper, PlayCircle, Radio } from "lucide-react";
import { Icon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import type { TopicType } from "@/lib/types";
import { Badge } from "@/components/atoms/Badge";
import { EmptyState } from "@/components/atoms/EmptyState";
import { TopicTypeBadge } from "@/components/atoms/TopicTypeBadge";
import { MockTag } from "@/components/lab/MockTag";
import { usePersona } from "@/components/lab/usePersona";
import { nextAction, type DueItem, type Enrolment, type LiveSession, type Persona } from "@/lib/lab/dashboard-mock";
import {
  Link,
  TopicProgress,
  certCopy,
  daysAway,
  linkPrimary,
  linkSecondary,
  linkText,
  pickDue,
  pickLive,
} from "./parts";

/** A gap this long gets a kind acknowledgement on the resume card. */
const GAP_DAYS = 7;
const MY_LEARNING = "/";

/** Direction A · Continue first — one dominant resume card, everything else compact and below it. */
export function View() {
  const persona = usePersona();
  const hero = nextAction(persona);
  const away = hero ? daysAway(hero.lastActive) : 0;
  const returning = away >= GAP_DAYS;

  const alsoInProgress = persona.enrolments.filter((e) => e.status === "in-progress" && e.id !== hero?.id);
  const rest = persona.enrolments.filter((e) => e.id !== hero?.id && e.status !== "in-progress");

  return (
    <main id="main" tabIndex={-1} className="outline-none mx-auto w-full max-w-5xl flex-1 px-4 pb-12 pt-6 md:px-8 md:pt-10">
      <Greeting persona={persona} hero={hero} returning={returning} />

      {hero ? (
        <ResumeCard enrolment={hero} away={returning ? hero.lastActive : undefined} />
      ) : (
        <EmptyState
          icon={PartyPopper}
          title="You are all caught up"
          description="Nothing is in progress right now. Your completed courses and certificates are in My Learning."
          action={
            <Link href={MY_LEARNING} className={linkSecondary}>
              Go to My Learning
            </Link>
          }
          className="bg-sko-bg-page"
        />
      )}

      {alsoInProgress.length > 0 ? <AlsoInProgress enrolments={alsoInProgress} /> : null}

      <RestSummary rest={rest} />

      <AroundStrip persona={persona} hero={hero} />
    </main>
  );
}

/* ---------------------------------------------------------------------------------------------- */

function Greeting({ persona, hero, returning }: { persona: Persona; hero?: Enrolment; returning: boolean }) {
  const notStarted = hero?.status === "not-started";
  const title = returning ? `Welcome back, ${persona.firstName}` : `Good to see you, ${persona.firstName}`;
  const sub = !hero
    ? "Here is what is happening across your learning."
    : notStarted && returning
      ? "No catching up needed. Your first topic is ready whenever you are."
      : notStarted
        ? "Your first topic is ready whenever you are."
        : returning
          ? "Your progress is saved exactly where you left it."
          : "Here is where you left off.";
  return (
    <header className="mb-5 md:mb-6">
      <h1 className="sk-text-headline-medium-semibold text-sko-text-default">{title}</h1>
      <p className="sk-text-body-large-regular mt-1 text-sko-text-muted">{sub}</p>
    </header>
  );
}

function ResumeCard({ enrolment, away }: { enrolment: Enrolment; away?: string }) {
  const notStarted = enrolment.status === "not-started";
  const next = enrolment.nextTopic;
  const eyebrow = notStarted ? "Start here" : away ? "Pick up where you left off" : "Continue learning";
  const cta = notStarted ? "Start course" : "Resume";

  return (
    <section
      aria-labelledby="resume-heading"
      className="rounded-xl border border-sko-border-subtle bg-sko-bg-page p-4 md:p-6 lg:p-8"
    >
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:gap-10">
        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <div>
            <p className="sk-text-body-small-semibold uppercase tracking-wide text-sko-text-primary">{eyebrow}</p>
            <h2 id="resume-heading" className="sk-text-headline-small-semibold mt-1 text-sko-text-default">
              {enrolment.title}
            </h2>
            <p className="sk-text-body-medium-regular mt-1 text-sko-text-muted">
              {enrolment.provider} · {enrolment.selfPaced ? "Self-paced" : "Instructor-paced"}
              {notStarted ? ` · ${enrolment.topicsTotal} topics` : null}
            </p>
          </div>

          {away && !notStarted ? (
            <p className="sk-text-body-medium-medium flex items-start gap-2 rounded-lg border border-sko-border-warning-soft bg-sko-bg-warning-soft px-3 py-2 text-sko-text-warning">
              <Icon icon={Clock} size={16} className="mt-0.5 shrink-0 text-sko-icon-warning" aria-hidden="true" />
              <span>
                Last visit {away}. That is fine. A few minutes today is enough to get the thread back.
              </span>
            </p>
          ) : null}

          {next ? (
            <div className="rounded-lg bg-sko-bg-subtle p-4">
              <p className="sk-text-body-small-semibold uppercase tracking-wide text-sko-text-subtle">
                {notStarted ? "First topic" : "Up next"}
              </p>
              <div className="mt-2 flex flex-col gap-1">
                <TopicTypeBadge type={next.type as TopicType} />
                <p className="sk-text-title-medium-semibold text-sko-text-default">{next.title}</p>
              </div>
            </div>
          ) : null}
        </div>

        <div className="flex flex-col gap-4 lg:w-72 lg:shrink-0">
          {notStarted ? null : <TopicProgress enrolment={enrolment} />}
          <Link href={next?.href ?? "#"} className={cn(linkPrimary, "w-full")}>
            <Icon icon={PlayCircle} size={20} aria-hidden="true" />
            <span>
              {cta}
              <span className="sr-only"> {enrolment.title}</span>
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}

function AlsoInProgress({ enrolments }: { enrolments: Enrolment[] }) {
  return (
    <section aria-labelledby="also-heading" className="mt-8">
      <h2 id="also-heading" className="sk-text-title-medium-semibold text-sko-text-default">
        Also in progress
      </h2>
      <ul className="mt-3 divide-y divide-sko-border-subtle overflow-hidden rounded-xl border border-sko-border-subtle bg-sko-bg-page">
        {enrolments.map((e) => (
          <li key={e.id} className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:gap-6">
            <div className="min-w-0 flex-1">
              <h3 className="sk-text-body-large-semibold text-sko-text-default">{e.title}</h3>
              {e.nextTopic ? (
                <p className="sk-text-body-medium-regular mt-1 flex flex-wrap items-center gap-x-2 text-sko-text-muted">
                  <span>Next:</span>
                  <TopicTypeBadge type={e.nextTopic.type as TopicType} />
                  <span className="text-sko-text-default">{e.nextTopic.title}</span>
                </p>
              ) : null}
              <p className="sk-text-body-small-regular mt-1 text-sko-text-subtle">Last active {e.lastActive.toLowerCase()}</p>
            </div>
            <TopicProgress enrolment={e} size="sm" className="md:w-44 md:shrink-0" />
            <Link href={e.nextTopic?.href ?? "#"} className={cn(linkSecondary, "w-full md:w-auto")}>
              Resume<span className="sr-only"> {e.title}</span>
              <Icon icon={ArrowRight} size={16} aria-hidden="true" />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

function RestSummary({ rest }: { rest: Enrolment[] }) {
  if (rest.length === 0) return null;
  const count = (s: Enrolment["status"]) => rest.filter((e) => e.status === s).length;
  const parts = [
    [count("not-started"), "not started"],
    [count("completed"), "completed"],
    [count("locked"), "locked"],
  ]
    .filter(([n]) => (n as number) > 0)
    .map(([n, label]) => `${n} ${label}`);
  return (
    <p className="sk-text-body-medium-regular mt-4 flex flex-wrap items-center gap-x-2 text-sko-text-muted">
      <span>
        {rest.length === 1 ? "1 more course" : `${rest.length} more courses`}: {parts.join(", ")}.
      </span>
      <Link href={MY_LEARNING} className={linkText}>
        See all in My Learning
      </Link>
    </p>
  );
}

/* ---------------------------------------------------------------------------------------------- */

function AroundStrip({ persona, hero }: { persona: Persona; hero?: Enrolment }) {
  return (
    <section aria-labelledby="around-heading" className="mt-10">
      <h2 id="around-heading" className="sk-text-title-medium-semibold text-sko-text-default">
        Around your learning
      </h2>
      <div className="mt-3 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {hero ? <CertificateCard persona={persona} hero={hero} /> : null}
        <WeeklyGoalCard persona={persona} />
        <ComingUpCard persona={persona} className="md:col-span-2 lg:col-span-1" />
      </div>
    </section>
  );
}

const CARD = "flex flex-col gap-3 rounded-xl border border-sko-border-subtle bg-sko-bg-page p-4";

function CertificateCard({ persona, hero }: { persona: Persona; hero: Enrolment }) {
  const copy = certCopy(hero.cert, hero.status === "not-started");
  const earned = persona.certificatesEarned;
  return (
    <div className={CARD}>
      <h3 className="sk-text-body-large-semibold flex items-center gap-2 text-sko-text-default">
        <Icon icon={Award} size={20} className="text-sko-icon-primary" aria-hidden="true" />
        Certificate
      </h3>
      <div>
        <p className="sk-text-body-medium-semibold text-sko-text-default">{copy.title}</p>
        <p className="sk-text-body-medium-regular mt-0.5 text-sko-text-muted">
          {hero.title}: {copy.detail}
        </p>
      </div>
      {earned > 0 ? (
        <p className="sk-text-body-medium-regular flex items-center gap-2 text-sko-text-muted">
          <Icon icon={CheckCircle2} size={16} className="shrink-0 text-sko-icon-success" aria-hidden="true" />
          {earned === 1 ? "1 certificate earned so far" : `${earned} certificates earned so far`}
        </p>
      ) : null}
      {hero.cert === "downloadable" ? (
        <Link href={`/course/${hero.id}/certificate`} className={linkText}>
          View certificate
        </Link>
      ) : null}
    </div>
  );
}

function WeeklyGoalCard({ persona }: { persona: Persona }) {
  const { daysTarget, daysDone } = persona.weeklyGoal.value;
  const met = daysDone >= daysTarget;
  const left = Math.max(daysTarget - daysDone, 0);
  const note = met
    ? "Goal met this week. Nice rhythm."
    : daysDone === 0
      ? "A short session today counts toward it."
      : `${left} more ${left === 1 ? "day" : "days"} to reach it.`;
  return (
    <div className={CARD}>
      <h3 className="sk-text-body-large-semibold flex items-center gap-2 text-sko-text-default">
        <Icon icon={CalendarDays} size={20} className="text-sko-icon-primary" aria-hidden="true" />
        Weekly goal
      </h3>
      <div>
        <p className="sk-text-body-medium-semibold text-sko-text-default">
          {daysDone} of {daysTarget} learning days this week
        </p>
        <div className="mt-2 flex gap-1.5" aria-hidden="true">
          {Array.from({ length: daysTarget }, (_, i) => (
            <span
              key={i}
              className={cn("h-2 flex-1 rounded-full", i < daysDone ? "bg-sko-bg-primary" : "bg-sko-bg-muted")}
            />
          ))}
        </div>
        <p className="sk-text-body-medium-regular mt-2 text-sko-text-muted">{note}</p>
      </div>
      {persona.weeklyGoal.mock ? <MockTag reason={persona.weeklyGoal.mock} layout="block" /> : null}
    </div>
  );
}

function ComingUpCard({ persona, className }: { persona: Persona; className?: string }) {
  const live = pickLive(persona.live.value);
  const due = pickDue(persona.due.value);
  return (
    <div className={cn(CARD, className)}>
      <h3 className="sk-text-body-large-semibold flex items-center gap-2 text-sko-text-default">
        <Icon icon={Clock} size={20} className="text-sko-icon-primary" aria-hidden="true" />
        Coming up
      </h3>
      <ul className="flex flex-col gap-3">
        <li className="flex flex-col gap-1">
          <p className="sk-text-body-small-semibold uppercase tracking-wide text-sko-text-subtle">Next live session</p>
          {live ? <LiveLine session={live} /> : <p className="sk-text-body-medium-regular text-sko-text-muted">No sessions scheduled.</p>}
          {persona.live.mock ? <MockTag reason={persona.live.mock} /> : null}
        </li>
        <li className="flex flex-col gap-1 border-t border-sko-border-subtle pt-3">
          <p className="sk-text-body-small-semibold uppercase tracking-wide text-sko-text-subtle">Next due</p>
          {due ? <DueLine item={due} /> : <p className="sk-text-body-medium-regular text-sko-text-muted">Nothing due.</p>}
          {persona.due.mock ? <MockTag reason={persona.due.mock} /> : null}
        </li>
      </ul>
    </div>
  );
}

const LIVE_BADGE: Record<LiveSession["state"], { label: string; color: "success" | "info" | "gray"; icon?: typeof Radio }> = {
  live: { label: "Live now", color: "success", icon: Radio },
  today: { label: "Today", color: "info" },
  upcoming: { label: "Upcoming", color: "gray" },
  recording: { label: "Recording", color: "gray", icon: PlayCircle },
};

function LiveLine({ session }: { session: LiveSession }) {
  const b = LIVE_BADGE[session.state];
  return (
    <div className="flex flex-wrap items-center gap-x-2">
      <Badge color={b.color} leftIcon={b.icon}>
        {b.label}
      </Badge>
      {/* No live-session page exists in the prototype yet. */}
      <Link href="#" className={cn(linkText, "sk-text-body-medium-semibold")}>
        {session.title}
      </Link>
      <span className="sk-text-body-small-regular text-sko-text-subtle">
        {session.when} · {session.course}
      </span>
    </div>
  );
}

const DUE_BADGE: Record<DueItem["state"], { label: string; color: "warning" | "gray"; icon?: typeof Radio }> = {
  // Overdue is a nudge, not an error: amber, never red.
  overdue: { label: "Overdue", color: "warning", icon: AlertTriangle },
  "due-soon": { label: "Due soon", color: "warning", icon: Clock },
  upcoming: { label: "Upcoming", color: "gray" },
};

function DueLine({ item }: { item: DueItem }) {
  const b = DUE_BADGE[item.state];
  return (
    <div className="flex flex-wrap items-center gap-x-2">
      <Badge color={b.color} leftIcon={b.icon}>
        {b.label}
      </Badge>
      <Link href={item.href} className={cn(linkText, "sk-text-body-medium-semibold")}>
        {item.title}
      </Link>
      <span className="sk-text-body-small-regular text-sko-text-subtle">
        {item.kind} · {item.dueLabel} · {item.course}
      </span>
    </div>
  );
}
