"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Award, Check, CheckCircle2, Circle, Clock, Download, Hourglass, Lock, PlayCircle } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Icon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { Badge, type BadgeColor } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import { TopicTypeBadge } from "@/components/atoms/TopicTypeBadge";
import { MockTag } from "@/components/lab/MockTag";
import { usePersona } from "@/components/lab/usePersona";
import { nextAction, type Enrolment, type EnrolmentStatus } from "@/lib/lab/dashboard-mock";
import type { TopicType } from "@/lib/types";

/* ── Helpers ───────────────────────────────────────────────────────────────────────── */

type Filter = "all" | "in-progress" | "not-started" | "completed";

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "in-progress", label: "In progress" },
  { id: "not-started", label: "Not started" },
  { id: "completed", label: "Completed" },
];

/** Locked courses have not started either, so they sit under "Not started". */
function bucket(s: EnrolmentStatus): Exclude<Filter, "all"> {
  return s === "locked" ? "not-started" : s;
}

/** Grid order: what you are doing, what you could start, what waits, what is done. */
const ORDER: Record<EnrolmentStatus, number> = { "in-progress": 0, "not-started": 1, locked: 2, completed: 3 };

const STATUS: Record<EnrolmentStatus, { label: string; color: BadgeColor; icon: LucideIcon }> = {
  "in-progress": { label: "In progress", color: "brand", icon: PlayCircle },
  "not-started": { label: "Not started", color: "gray", icon: Circle },
  locked: { label: "Locked", color: "gray", icon: Lock },
  completed: { label: "Completed", color: "success", icon: CheckCircle2 },
};

/** Stale = an in-progress course untouched for a week or more (from the REAL `last_visited`). */
function isStale(e: Enrolment): boolean {
  if (e.status !== "in-progress") return false;
  if (/month|year/.test(e.lastActive)) return true;
  const days = /(\d+)\s+days?\s+ago/.exec(e.lastActive);
  if (days) return Number(days[1]) >= 7;
  const weeks = /(\d+)\s+weeks?\s+ago/.exec(e.lastActive);
  return weeks !== null;
}

function activityLine(e: Enrolment): string {
  if (e.lastActive === "—") return "Not opened yet";
  if (e.lastActive === "Never opened") return "Not opened yet";
  return `Last activity: ${e.lastActive.charAt(0).toLowerCase()}${e.lastActive.slice(1)}`;
}

const FOCUS =
  "focus-visible:outline-none focus-visible:shadow-[0_0_0_2px_var(--color-border-focus-gap),0_0_0_4px_var(--color-border-primary)]";

/** A link dressed as DS Button V2 Brand (md, 44px). Button renders a <button>, so links get this. */
function linkButton(hierarchy: "primary" | "secondary") {
  return cn(
    "sk-text-sm-semibold inline-flex h-11 shrink-0 items-center justify-center gap-1 rounded-md px-3 transition-colors duration-200",
    FOCUS,
    hierarchy === "primary"
      ? "bg-sko-bg-primary text-sko-text-on-primary hover:bg-sko-bg-primary-hover hover:text-sko-text-on-primary-hover"
      : "bg-sko-bg-page text-sko-text-primary ring-1 ring-inset ring-sko-border-primary hover:bg-sko-bg-faint forced-colors:border forced-colors:border-solid forced-colors:border-sko-border-primary",
  );
}

/* ── Pick up strip ─────────────────────────────────────────────────────────────────── */

function PickUp({ e }: { e: Enrolment }) {
  const starting = e.status === "not-started";
  const stale = isStale(e);
  return (
    <section
      aria-labelledby="pickup-h"
      className="flex flex-col gap-3 rounded-xl border border-sko-border-subtle bg-sko-bg-page p-4 shadow-sk-card md:flex-row md:items-center md:gap-6"
    >
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <h2 id="pickup-h" className="sk-text-xs-semibold uppercase tracking-wide text-sko-text-subtle">
          {starting ? "Start here" : "Pick up"}
        </h2>
        <p className="sk-text-md-semibold text-sko-text-default">{e.title}</p>
        {e.nextTopic ? (
          <p className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="sk-text-sm-regular text-sko-text-muted">{starting ? "First topic:" : "Next:"}</span>
            <TopicTypeBadge type={e.nextTopic.type as TopicType} />
            <span className="sk-text-sm-medium min-w-0 text-sko-text-default">{e.nextTopic.title}</span>
          </p>
        ) : null}
        {stale ? (
          <p className="sk-text-sm-medium flex items-center gap-1.5 text-sko-text-warning">
            <Icon icon={Clock} size={16} className="shrink-0 text-sko-icon-warning" aria-hidden="true" />
            Last activity {e.lastActive} — pick up with one topic.
          </p>
        ) : !starting ? (
          <p className="sk-text-sm-regular text-sko-text-subtle">{activityLine(e)}</p>
        ) : null}
      </div>
      {e.nextTopic ? (
        <Link href={e.nextTopic.href} className={cn(linkButton("primary"), "self-start md:self-auto")}>
          <span className="px-0.5">{starting ? "Start course" : "Continue"}</span>
          <Icon icon={ArrowRight} size={20} aria-hidden="true" />
          <span className="sr-only">: {e.title}</span>
        </Link>
      ) : null}
    </section>
  );
}

/* ── Summary row ───────────────────────────────────────────────────────────────────── */

function Summary({ enrolments }: { enrolments: Enrolment[] }) {
  const inProgress = enrolments.filter((e) => e.status === "in-progress").length;
  const completed = enrolments.filter((e) => e.status === "completed").length;
  const ready = enrolments.filter((e) => e.cert === "downloadable").length;
  const preparing = enrolments.filter((e) => e.cert === "generating").length;
  const earned = ready + preparing;
  const notStarted = enrolments.length - inProgress - completed;

  // Nothing begun yet: a sentence instead of a row of zeros.
  if (inProgress === 0 && completed === 0) {
    return (
      <section aria-labelledby="summary-h" className="flex flex-col gap-1">
        <h2 id="summary-h" className="sr-only">
          Where you stand
        </h2>
        <p className="sk-text-md-regular text-sko-text-muted">
          You have {notStarted === 1 ? "one course" : `${notStarted} courses`} ready to start, and
          nothing here is timed — begin with one topic whenever you are ready.
        </p>
      </section>
    );
  }

  const items = [
    { label: "In progress", value: inProgress },
    { label: "Completed", value: completed },
    { label: "Certificates earned", value: earned, note: preparing ? `${preparing} being prepared` : undefined },
  ];
  return (
    <section aria-labelledby="summary-h">
      <h2 id="summary-h" className="sr-only">
        Where you stand
      </h2>
      <dl className="flex flex-wrap gap-x-8 gap-y-3">
        {items.map((it) => (
          <div key={it.label} className="flex flex-col-reverse">
            <dt className="sk-text-sm-regular text-sko-text-muted">
              {it.label}
              {it.note ? <span className="text-sko-text-subtle"> · {it.note}</span> : null}
            </dt>
            <dd className="sk-text-display-xs-semibold text-sko-text-default">{it.value}</dd>
          </div>
        ))}
        <div className="flex flex-col-reverse">
          <dt className="sk-text-sm-regular text-sko-text-muted">Enrolled</dt>
          <dd className="sk-text-display-xs-semibold text-sko-text-subtle">{enrolments.length}</dd>
        </div>
      </dl>
    </section>
  );
}

/* ── Enrolment card ────────────────────────────────────────────────────────────────── */

function CertLine({ e }: { e: Enrolment }) {
  switch (e.cert) {
    case "downloadable":
      return (
        <Button hierarchy="secondary" size="md" leftIcon={Download} className="self-start">
          Download certificate<span className="sr-only">: {e.title}</span>
        </Button>
      );
    case "generating":
      return (
        <p className="sk-text-sm-medium flex items-center gap-1.5 text-sko-text-default">
          <Icon icon={Hourglass} size={16} className="shrink-0 text-sko-icon-primary" aria-hidden="true" />
          Certificate being prepared
        </p>
      );
    case "audit_passing":
      return (
        <p className="sk-text-sm-medium flex items-center gap-1.5 text-sko-text-success">
          <Icon icon={Award} size={16} className="shrink-0 text-sko-icon-success" aria-hidden="true" />
          Passing — finish to earn it
        </p>
      );
    default:
      return (
        <p className="sk-text-sm-regular flex items-center gap-1.5 text-sko-text-subtle">
          <Icon icon={Award} size={16} className="shrink-0 text-sko-icon-muted" aria-hidden="true" />
          Certificate on completion
        </p>
      );
  }
}

function EnrolmentCard({ e }: { e: Enrolment }) {
  const s = STATUS[e.status];
  const showProgress = e.status === "in-progress" || e.status === "completed";
  const stale = isStale(e);
  const headingId = `card-${e.id}`;

  return (
    <li className="flex">
      <article
        aria-labelledby={headingId}
        className="flex w-full flex-col gap-4 rounded-xl border border-sko-border-subtle bg-sko-bg-page p-4 shadow-sk-card"
      >
        <div className="flex flex-col items-start gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge color={s.color} variant="soft" leftIcon={s.icon}>
              {s.label}
            </Badge>
            {e.program ? (
              <span className="sk-text-xs-medium text-sko-text-subtle">Programme · {e.program.value}</span>
            ) : null}
          </div>
          {e.program?.mock ? <MockTag reason={e.program.mock} /> : null}
          <h3 id={headingId} className="sk-text-md-semibold text-sko-text-default">
            {e.title}
          </h3>
          <p className="sk-text-xs-regular text-sko-text-subtle">
            {e.provider} · {e.selfPaced ? "Self-paced" : "Instructor-paced"}
          </p>
        </div>

        {showProgress ? (
          <div className="flex flex-col gap-1.5">
            <div className="flex items-baseline justify-between gap-2">
              <span className="sk-text-sm-semibold text-sko-text-default">{e.pct}% complete</span>
              <span className="sk-text-xs-regular text-sko-text-subtle">
                {e.topicsDone} of {e.topicsTotal} topics
              </span>
            </div>
            <div
              role="progressbar"
              aria-label={`${e.title} progress`}
              aria-valuenow={e.pct}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuetext={`${e.pct}% complete, ${e.topicsDone} of ${e.topicsTotal} topics`}
              className="h-2 overflow-hidden rounded-full bg-sko-bg-muted"
            >
              <div className="h-full rounded-full bg-sko-bg-info" style={{ width: `${e.pct}%` }} />
            </div>
          </div>
        ) : null}

        {e.status === "locked" && e.lockedBy ? (
          <div className="flex items-start gap-2 rounded-lg bg-sko-bg-subtle px-3 py-2">
            <Icon icon={Lock} size={16} className="mt-0.5 shrink-0 text-sko-icon-muted" aria-hidden="true" />
            <p className="sk-text-sm-regular text-sko-text-muted">
              <span className="sk-text-sm-semibold text-sko-text-default">Unlocks after {e.lockedBy}.</span> Finish that
              course and this one opens.
            </p>
          </div>
        ) : e.nextTopic && e.status !== "completed" ? (
          <div className="flex min-w-0 flex-col items-start gap-1 rounded-lg bg-sko-bg-subtle px-3 py-2">
            <span className="sk-text-xs-semibold text-sko-text-subtle">
              {e.status === "not-started" ? "First topic" : "Up next"}
            </span>
            <span className="sk-text-sm-medium w-full text-sko-text-default">{e.nextTopic.title}</span>
            <TopicTypeBadge type={e.nextTopic.type as TopicType} />
          </div>
        ) : null}

        <div className="mt-auto flex flex-col gap-3">
          {stale ? (
            <p className="sk-text-sm-medium flex items-center gap-1.5 text-sko-text-warning">
              <Icon icon={Clock} size={16} className="shrink-0 text-sko-icon-warning" aria-hidden="true" />
              {activityLine(e)}
            </p>
          ) : e.status !== "locked" ? (
            <p className="sk-text-xs-regular text-sko-text-subtle">{activityLine(e)}</p>
          ) : null}
          <CertLine e={e} />
          {e.nextTopic && (e.status === "in-progress" || e.status === "not-started") ? (
            <Link href={e.nextTopic.href} className={cn(linkButton("secondary"), "self-start")}>
              <span className="px-0.5">{e.status === "not-started" ? "Start course" : "Continue"}</span>
              <span className="sr-only">: {e.title}</span>
            </Link>
          ) : null}
        </div>
      </article>
    </li>
  );
}

/* ── Certificates shelf ────────────────────────────────────────────────────────────── */

function Certificates({ enrolments }: { enrolments: Enrolment[] }) {
  const earned = enrolments.filter((e) => e.cert === "downloadable" || e.cert === "generating");
  const passing = enrolments.filter((e) => e.cert === "audit_passing");

  return (
    <section aria-labelledby="certs-h" className="flex flex-col gap-4">
      <h2 id="certs-h" className="sk-text-lg-semibold text-sko-text-default">
        Certificates
      </h2>
      {earned.length === 0 ? (
        <p className="sk-text-sm-regular text-sko-text-muted">
          No certificates yet. Each course gives you one when you pass it, and it will wait for you here.
        </p>
      ) : (
        <ul className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {earned.map((e) => (
            <li
              key={e.id}
              className="flex items-start gap-3 rounded-xl border border-sko-border-subtle bg-sko-bg-page p-4"
            >
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sko-bg-primary-soft text-sko-icon-primary">
                <Icon icon={Award} size={20} aria-hidden="true" />
              </span>
              <div className="flex min-w-0 flex-1 flex-col items-start gap-2">
                <p className="sk-text-sm-semibold text-sko-text-default">{e.title}</p>
                {e.cert === "downloadable" ? (
                  <Button hierarchy="secondary" size="md" leftIcon={Download}>
                    Download<span className="sr-only"> certificate: {e.title}</span>
                  </Button>
                ) : (
                  <p className="sk-text-sm-regular flex items-center gap-1.5 text-sko-text-muted">
                    <Icon icon={Hourglass} size={16} className="shrink-0 text-sko-icon-muted" aria-hidden="true" />
                    Being prepared — it will be ready to download here.
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
      {passing.length > 0 ? (
        <p className="sk-text-sm-regular text-sko-text-muted">
          On the way:{" "}
          {passing.map((e, i) => (
            <React.Fragment key={e.id}>
              {i > 0 ? ", " : null}
              <span className="sk-text-sm-semibold text-sko-text-default">{e.title}</span>
            </React.Fragment>
          ))}{" "}
          — you are passing; finish the course to earn the certificate.
        </p>
      ) : null}
    </section>
  );
}

/* ── Page ──────────────────────────────────────────────────────────────────────────── */

export function View() {
  const persona = usePersona();
  const [filter, setFilter] = React.useState<Filter>("all");
  // A new persona starts from "All".
  React.useEffect(() => setFilter("all"), [persona.id]);

  const all = React.useMemo(
    () => [...persona.enrolments].sort((a, b) => ORDER[a.status] - ORDER[b.status]),
    [persona.enrolments],
  );
  const counts: Record<Filter, number> = {
    all: all.length,
    "in-progress": all.filter((e) => bucket(e.status) === "in-progress").length,
    "not-started": all.filter((e) => bucket(e.status) === "not-started").length,
    completed: all.filter((e) => bucket(e.status) === "completed").length,
  };
  const shown = filter === "all" ? all : all.filter((e) => bucket(e.status) === filter);
  const filterLabel = FILTERS.find((f) => f.id === filter)?.label ?? "All";
  const next = nextAction(persona);
  const nothingStarted = counts["in-progress"] === 0 && counts.completed === 0;

  return (
    <main id="main" tabIndex={-1} className="outline-none mx-auto flex w-full max-w-4xl flex-1 flex-col gap-8 p-4 md:p-8 xl:max-w-[1264px]">
      <header className="flex flex-col gap-1">
        <h1 className="sk-text-display-sm-semibold text-sko-text-default">
          {nothingStarted ? `Welcome, ${persona.firstName}` : `Your learning, ${persona.firstName}`}
        </h1>
        <p className="sk-text-md-regular text-sko-text-muted">
          {nothingStarted
            ? "Everything you are enrolled in, in one place."
            : `Where you stand across ${all.length} ${all.length === 1 ? "course" : "courses"}.`}
        </p>
      </header>

      {next ? <PickUp e={next} /> : null}

      <Summary enrolments={all} />

      <section aria-labelledby="courses-h" className="flex flex-col gap-4">
        <h2 id="courses-h" className="sk-text-lg-semibold text-sko-text-default">
          Your courses
        </h2>

        {all.length > 1 ? (
          <div role="group" aria-label="Show courses by status" className="flex flex-wrap gap-2">
            {FILTERS.map((f) => {
              const on = filter === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setFilter(f.id)}
                  className={cn(
                    "sk-text-sm-semibold inline-flex h-11 items-center gap-1.5 rounded-full px-4 transition-colors duration-200",
                    FOCUS,
                    on
                      ? "bg-sko-bg-primary text-sko-text-on-primary"
                      : "bg-sko-bg-page text-sko-text-default ring-1 ring-inset ring-sko-border-default hover:bg-sko-bg-faint forced-colors:border forced-colors:border-solid forced-colors:border-sko-border-default",
                  )}
                >
                  {on ? <Icon icon={Check} size={16} aria-hidden="true" /> : null}
                  {f.label}
                  <span className={on ? "sk-text-sm-regular" : "sk-text-sm-regular text-sko-text-subtle"}>
                    {counts[f.id]}
                  </span>
                </button>
              );
            })}
          </div>
        ) : null}

        <p role="status" aria-live="polite" className="sk-text-sm-regular text-sko-text-muted">
          Showing {shown.length} {shown.length === 1 ? "course" : "courses"}
          {filter === "all" ? "" : ` · ${filterLabel}`}
          {filter === "not-started" && all.some((e) => e.status === "locked") ? " (includes locked courses)" : ""}
        </p>

        {shown.length > 0 ? (
          <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {shown.map((e) => (
              <EnrolmentCard key={e.id} e={e} />
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-start gap-3 rounded-xl border border-dashed border-sko-border-default p-6">
            <p className="sk-text-md-medium text-sko-text-default">No {filterLabel.toLowerCase()} courses right now.</p>
            <Button hierarchy="secondary" size="md" onClick={() => setFilter("all")}>
              Show all courses
            </Button>
          </div>
        )}
      </section>

      <Certificates enrolments={all} />
    </main>
  );
}
