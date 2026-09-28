"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  ArrowRight,
  CalendarCheck,
  CalendarPlus,
  Clock,
  PlayCircle,
  Radio,
  Video,
} from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { Badge } from "@/components/atoms/Badge";
import { MockTag } from "@/components/lab/MockTag";
import { usePersona } from "@/components/lab/usePersona";
import { Icon, topicTypeIcon } from "@/lib/icons";
import { MOCK, nextAction, type Enrolment } from "@/lib/lab/dashboard-mock";
import type { TopicType } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  KIND_TOPIC_TYPE,
  MOCK_NOW,
  MOCK_TODAY,
  buildAgenda,
  longDay,
  shortDay,
  timeOf,
  week,
  type AgendaItem,
  type Bucket,
} from "./agenda";

/** Direction C · Live + today — the dashboard as an agenda: pick up, now, catch up, today, this week, later. */
export function View() {
  const persona = usePersona();
  const router = useRouter();
  const next = nextAction(persona);
  const agenda = React.useMemo(() => buildAgenda(persona), [persona]);
  const [added, setAdded] = React.useState<Set<string>>(() => new Set());

  const toggleAdded = (id: string) =>
    setAdded((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  const go = (href: string) => {
    if (href && href !== "#") router.push(href);
  };

  const by = (b: Bucket) => agenda.filter((it) => it.bucket === b);
  const now = by("now");
  const catchUp = by("catch-up");
  const today = by("today");
  const thisWeek = by("week");
  const later = by("later");
  const days = week(agenda);

  return (
    <main id="main" tabIndex={-1} className="outline-none mx-auto w-full max-w-5xl flex-1 px-4 py-6 md:px-6 md:py-8 lg:px-8">
      <header>
        <p className="sk-text-sm-medium text-sko-text-subtle">Dashboard</p>
        <h1 className="sk-text-display-xs-semibold mt-1 text-sko-text-default">Hi {persona.firstName}</h1>
        <p className="sk-text-md-regular mt-1 text-sko-text-muted">What is on, in time order.</p>
      </header>

      <PickUp enrolment={next} onGo={go} />

      <section aria-labelledby="schedule-h" className="mt-8">
        <div className="flex flex-col gap-2">
          <h2 id="schedule-h" className="sk-text-lg-semibold text-sko-text-default">
            Schedule
          </h2>
          <p className="sk-text-sm-regular text-sko-text-muted">
            Today is <time dateTime={`${MOCK_TODAY}T${MOCK_NOW}`}>{longDay(MOCK_TODAY)}, {MOCK_NOW}</time> (mock date).
          </p>
          <div className="flex flex-col gap-1.5">
            <MockTag layout="block" reason={`Sessions: ${MOCK.live}`} />
            <MockTag layout="block" reason={`Deadlines: ${MOCK.due}`} />
          </div>
        </div>

        {agenda.length === 0 ? (
          <NothingScheduled added={added.has("study-slot")} onAdd={() => toggleAdded("study-slot")} />
        ) : (
          <div className="mt-6 flex flex-col gap-8 lg:grid lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start lg:gap-8">
            <div className="flex min-w-0 flex-col gap-8 lg:col-start-1 lg:row-start-1">
              {now.length > 0 ? (
                <AgendaSection id="now" title="Now" items={now} added={added} onAdd={toggleAdded} onGo={go} />
              ) : null}
              {catchUp.length > 0 ? (
                <AgendaSection
                  id="catch-up"
                  title="Catch up"
                  subtitle="Past due and missed"
                  items={catchUp}
                  added={added}
                  onAdd={toggleAdded}
                  onGo={go}
                />
              ) : null}
              <AgendaSection
                id="today"
                title="Today"
                subtitle={shortDay(MOCK_TODAY)}
                items={today}
                empty={now.length > 0 ? "Nothing else today." : "Nothing scheduled today."}
                added={added}
                onAdd={toggleAdded}
                onGo={go}
              />
              <AgendaSection
                id="week"
                title="This week"
                subtitle={`To ${shortDay(days[6].date)}`}
                items={thisWeek}
                empty="Nothing else this week."
                added={added}
                onAdd={toggleAdded}
                onGo={go}
              />
              <AgendaSection
                id="later"
                title="Later"
                items={later}
                empty="Nothing scheduled after this week."
                added={added}
                onAdd={toggleAdded}
                onGo={go}
              />
            </div>

            {/* After the agenda in the DOM: "Now" is read and seen first; lg places it in the right column. */}
            <WeekStrip days={days} className="lg:sticky lg:top-6 lg:col-start-2 lg:row-start-1" />
          </div>
        )}
      </section>
    </main>
  );
}

/* ── Pick up: the one resume row, always present (REAL data: resume_course + completion). ── */

function PickUp({ enrolment, onGo }: { enrolment?: Enrolment; onGo: (href: string) => void }) {
  const topic = enrolment?.nextTopic;
  return (
    <section
      aria-labelledby="pickup-h"
      className="mt-6 rounded-xl border border-sko-border-subtle bg-sko-bg-page p-3 md:p-4"
    >
      {enrolment && topic ? (
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-sko-bg-primary-soft">
              <Icon icon={topicTypeIcon(topic.type as TopicType)} size={20} className="text-sko-icon-primary" />
            </span>
            <div className="min-w-0">
              <h2 id="pickup-h" className="sk-text-xs-semibold text-sko-text-subtle">
                {enrolment.status === "not-started" ? "Start here" : "Pick up where you left off"}
              </h2>
              <p className="sk-text-md-semibold text-sko-text-default md:truncate">{topic.title}</p>
              <p className="sk-text-sm-regular text-sko-text-muted md:truncate">
                {topic.type} · {enrolment.title} ·{" "}
                {enrolment.status === "not-started" ? "Not started" : `${enrolment.pct}% done`}
              </p>
            </div>
          </div>
          <Button
            size="md"
            rightIcon={ArrowRight}
            className="w-full shrink-0 md:w-auto"
            onClick={() => onGo(topic.href)}
          >
            {enrolment.status === "not-started" ? "Start" : "Resume"}
            <span className="sr-only">: {topic.title}</span>
          </Button>
        </div>
      ) : (
        <>
          <h2 id="pickup-h" className="sk-text-xs-semibold text-sko-text-subtle">
            Pick up
          </h2>
          <p className="sk-text-md-semibold text-sko-text-default">You are all caught up — no course in progress.</p>
        </>
      )}
    </section>
  );
}

/* ── Week strip: visual only; the sentence under it is the text equivalent. ── */

function WeekStrip({ days, className }: { days: ReturnType<typeof week>; className?: string }) {
  const busy = days.filter((d) => d.count > 0);
  const summary =
    busy.length === 0
      ? "Nothing scheduled this week."
      : `${busy.map((d) => `${d.weekday} ${d.dayOfMonth} (${d.count} ${d.count === 1 ? "item" : "items"})`).join(", ")}.`;

  return (
    <section
      aria-labelledby="strip-h"
      className={cn("rounded-xl border border-sko-border-subtle bg-sko-bg-page p-3 md:p-4", className)}
    >
      <h3 id="strip-h" className="sk-text-sm-semibold text-sko-text-default">
        This week at a glance
      </h3>
      <ol aria-hidden="true" className="mt-3 grid grid-cols-7 gap-1">
        {days.map((d) => (
          <li
            key={d.date}
            className={cn(
              "flex min-w-0 flex-col items-center gap-0.5 rounded-lg py-2",
              d.isToday ? "bg-sko-bg-primary-soft ring-2 ring-inset ring-sko-border-primary" : "bg-sko-bg-subtle",
            )}
          >
            <span className={cn("sk-text-xs-medium", d.isToday ? "text-sko-text-primary" : "text-sko-text-subtle")}>
              {d.weekday}
            </span>
            <span className="sk-text-sm-semibold text-sko-text-default">{d.dayOfMonth}</span>
            <span
              className={cn(
                "sk-text-xs-semibold inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1",
                d.count > 0 ? "bg-sko-bg-primary text-sko-text-on-primary" : "text-sko-text-disabled",
              )}
            >
              {d.count > 0 ? d.count : "·"}
            </span>
          </li>
        ))}
      </ol>
      <p className="sk-text-sm-regular mt-3 text-sko-text-muted">
        <span className="sk-text-sm-medium text-sko-text-default">
          {shortDay(days[0].date)} – {shortDay(days[6].date)}:
        </span>{" "}
        {summary} Today is {days.find((d) => d.isToday)?.weekday}.
      </p>
    </section>
  );
}

/* ── A time section: heading + an ordered list, or a one-line empty state. ── */

interface SectionProps {
  id: string;
  title: string;
  subtitle?: string;
  items: AgendaItem[];
  empty?: string;
  added: Set<string>;
  onAdd: (id: string) => void;
  onGo: (href: string) => void;
}

function AgendaSection({ id, title, subtitle, items, empty, added, onAdd, onGo }: SectionProps) {
  const hid = `sec-${id}-h`;
  return (
    <section aria-labelledby={hid}>
      <div className="flex flex-wrap items-baseline gap-x-2">
        <h3 id={hid} className="sk-text-md-semibold text-sko-text-default">
          {title}
        </h3>
        {subtitle ? <span className="sk-text-sm-regular text-sko-text-subtle">{subtitle}</span> : null}
        {items.length > 0 ? (
          <span className="sk-text-sm-regular text-sko-text-subtle">
            · {items.length} {items.length === 1 ? "item" : "items"}
          </span>
        ) : null}
      </div>
      {items.length === 0 ? (
        <p className="sk-text-sm-regular mt-2 border-l-2 border-sko-border-subtle pl-3 text-sko-text-muted">{empty}</p>
      ) : (
        <ol className="mt-3 flex flex-col gap-2">
          {items.map((it) => (
            <AgendaRow key={it.id} item={it} added={added.has(it.id)} onAdd={() => onAdd(it.id)} onGo={onGo} />
          ))}
        </ol>
      )}
    </section>
  );
}

/* ── One agenda item: when · what · CTA. ── */

function When({ item }: { item: AgendaItem }) {
  const t = timeOf(item.at);
  const line = (a: string, b?: string) => (
    <>
      <span className="sk-text-sm-semibold block text-sko-text-default">{a}</span>
      {b ? <span className="sk-text-xs-regular block text-sko-text-muted">{b}</span> : null}
    </>
  );
  let body: React.ReactNode;
  switch (item.bucket) {
    case "now":
      body = line("Now", item.note);
      break;
    case "today":
      body = line(t ?? "Due today", t ? undefined : "End of day");
      break;
    case "catch-up":
      body =
        item.status === "overdue"
          ? line(`Was due ${shortDay(item.at)}`)
          : line(`Missed ${shortDay(item.at)}`, item.note);
      break;
    default:
      body = t ? line(shortDay(item.at), t) : line(`Due ${shortDay(item.at)}`);
  }
  return (
    <time dateTime={item.at} className="block shrink-0 md:w-32">
      {body}
    </time>
  );
}

function Status({ item }: { item: AgendaItem }) {
  switch (item.status) {
    case "live":
      return (
        <Badge color="success" variant="outline" leftIcon={Radio}>
          Live now
        </Badge>
      );
    case "overdue":
      return (
        <Badge color="warning" variant="outline" leftIcon={AlertTriangle}>
          Overdue
        </Badge>
      );
    case "recording":
      return (
        <Badge color="gray" leftIcon={PlayCircle}>
          Recording available
        </Badge>
      );
    case "due-soon":
      return (
        <Badge color="info" leftIcon={Clock}>
          Due soon
        </Badge>
      );
    default:
      return null;
  }
}

function Cta({ item, added, onAdd, onGo }: { item: AgendaItem; added: boolean; onAdd: () => void; onGo: (h: string) => void }) {
  const cls = "w-full md:w-auto";
  const sr = <span className="sr-only">: {item.title}</span>;
  if (item.status === "live") {
    return (
      <Button tone="success" hierarchy="primary" leftIcon={Video} className={cls} onClick={() => onGo(item.href)}>
        Join now{sr}
      </Button>
    );
  }
  if (item.status === "recording") {
    return (
      <Button hierarchy="secondary" leftIcon={PlayCircle} className={cls} onClick={() => onGo(item.href)}>
        Watch recording{sr}
      </Button>
    );
  }
  if (item.kind === "Live session") {
    return (
      <Button
        hierarchy="secondary"
        leftIcon={added ? CalendarCheck : CalendarPlus}
        className={cls}
        onClick={onAdd}
      >
        {added ? "Added to calendar" : "Add to calendar"}
        {sr}
      </Button>
    );
  }
  return (
    <Button hierarchy="secondary" className={cls} onClick={() => onGo(item.href)}>
      Open {item.kind.toLowerCase()}
      {sr}
    </Button>
  );
}

function AgendaRow({ item, added, onAdd, onGo }: { item: AgendaItem; added: boolean; onAdd: () => void; onGo: (h: string) => void }) {
  const live = item.status === "live";
  const overdue = item.status === "overdue";
  return (
    <li
      className={cn(
        "flex flex-col gap-3 rounded-xl border p-4 md:flex-row md:items-center md:gap-4",
        live
          ? "border-sko-border-success bg-sko-bg-success-soft"
          : overdue
            ? "border-sko-border-warning bg-sko-bg-page"
            : "border-sko-border-subtle bg-sko-bg-page",
      )}
    >
      <When item={item} />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="sk-text-xs-medium inline-flex items-center gap-1.5 text-sko-text-subtle">
            <Icon icon={topicTypeIcon(KIND_TOPIC_TYPE[item.kind])} size={14} className="text-sko-icon-primary" />
            {item.kind}
          </span>
          <Status item={item} />
        </div>
        <p className="sk-text-md-semibold mt-1 text-sko-text-default">{item.title}</p>
        <p className="sk-text-sm-regular text-sko-text-muted">
          {item.course}
          {item.host ? ` · with ${item.host}` : null}
          {item.bucket === "today" && item.kind === "Live session" ? " · Join opens 10 min before" : null}
        </p>
        {live ? <MockTag className="mt-2" reason={MOCK.live} /> : null}
      </div>
      <div className="shrink-0">
        <Cta item={item} added={added} onAdd={onAdd} onGo={onGo} />
      </div>
    </li>
  );
}

/* ── The self-paced case (Noah): the agenda collapses to one line + a study-slot nudge. ── */

function NothingScheduled({ added, onAdd }: { added: boolean; onAdd: () => void }) {
  return (
    <div className="mt-6 flex flex-col gap-3 rounded-xl border border-sko-border-subtle bg-sko-bg-page p-4 md:flex-row md:items-center md:gap-4">
      <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-sko-bg-faint">
        <Icon icon={CalendarPlus} size={20} className="text-sko-icon-subtle" />
      </span>
      <div className="min-w-0 flex-1">
        <h3 className="sk-text-md-semibold text-sko-text-default">Nothing scheduled this week</h3>
        <p className="sk-text-sm-regular text-sko-text-muted">
          Your courses are self-paced: no live sessions or deadlines. A regular slot helps — try two 30-minute
          sessions this week.
        </p>
      </div>
      <Button
        hierarchy="secondary"
        leftIcon={added ? CalendarCheck : CalendarPlus}
        className="w-full shrink-0 md:w-auto"
        onClick={onAdd}
      >
        {added ? "Study slot added" : "Add a study slot"}
      </Button>
    </div>
  );
}
