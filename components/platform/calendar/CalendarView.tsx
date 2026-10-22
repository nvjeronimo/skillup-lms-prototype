"use client";

import * as React from "react";
import Link from "next/link";
import { AlertCircle, CalendarPlus, ChevronLeft, ChevronRight, ClipboardCheck, Flag, Video } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { ArrivalCount } from "@/components/atoms/ArrivalCount";
import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import { Skeleton, SkeletonPill } from "@/components/atoms/Skeleton";
import { PlatformPage } from "@/components/platform/PlatformPage";
import { PlatformSegmented } from "@/components/platform/PlatformSegmented";
import {
  CALENDAR_TODAY,
  addDays,
  calendarEvents,
  calendarFilters,
  isMissed,
  missedByCourse,
  secondMissedEvent,
  parseDay,
  type CalendarEvent,
  type CalendarKind,
} from "@/lib/platform/calendar";
import { Icon } from "@/lib/icons";
import { useLmsStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { SHIFT_DATES } from "@/lib/platform/shift-dates";
import { YOUR_TIME, dueBadgeLabel, formatDay, formatTime } from "@/lib/sample-time";
import { coursePageHref, slugify } from "@/lib/platform/hrefs";
import { cn } from "@/lib/utils";
import { useDemoMode } from "@/lib/demo";

type Filter = (typeof calendarFilters)[number]["id"];
type View = "agenda" | "month";

/* One look per kind: the icon tile and the badge. Deadlines are warning (as the Dashboard's
   Due item), live sessions success (ADR 012: live is green), course dates info. */
const KIND: Record<CalendarKind, { icon: LucideIcon; tile: string; dot: string }> = {
  deadline: { icon: ClipboardCheck, tile: "bg-sko-bg-warning-soft text-sko-icon-warning", dot: "bg-sko-bg-warning" },
  live: { icon: Video, tile: "bg-sko-bg-success-soft text-sko-icon-success", dot: "bg-sko-bg-success" },
  course: { icon: Flag, tile: "bg-sko-bg-info-soft text-sko-icon-info", dot: "bg-sko-bg-info" },
};

const WEEKDAY = new Intl.DateTimeFormat("en-GB", { weekday: "short" });
const DAY_MONTH = new Intl.DateTimeFormat("en-GB", { weekday: "short", day: "numeric", month: "short" });
const MONTH = new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric" });

function dayHeading(iso: string) {
  if (iso === CALENDAR_TODAY) return { lead: "Today", rest: DAY_MONTH.format(parseDay(iso)) };
  if (iso === addDays(CALENDAR_TODAY, 1)) return { lead: "Tomorrow", rest: DAY_MONTH.format(parseDay(iso)) };
  return { lead: DAY_MONTH.format(parseDay(iso)), rest: "" };
}

/** The status badge's label and colour (the row's badge, and its skeleton's width). */
function statusOf(e: CalendarEvent): { label: string; color: "success" | "error" | "warning" | "info" } {
  if (e.kind === "deadline") {
    if (e.complete) return { label: "Done", color: "success" };
    if (isMissed(e)) return { label: "Missed", color: "error" };
    return { label: dueBadgeLabel(e.date, e.time), color: "warning" };
  }
  if (e.kind === "live") return { label: `Live · ${e.time ? formatTime(e.time) : ""}`, color: "success" };
  return { label: e.label, color: "info" };
}

function statusBadge(e: CalendarEvent) {
  const s = statusOf(e);
  return <Badge color={s.color}>{s.label}</Badge>;
}

/** The upcoming days of the Agenda and their dates (shared with the skeleton). */
function agendaDays(events: CalendarEvent[]) {
  const upcoming = events.filter((e) => e.date >= CALENDAR_TODAY && !e.complete);
  const days = [...new Set(upcoming.map((e) => e.date))].sort();
  return days.map((day) => ({ day, events: upcoming.filter((e) => e.date === day) }));
}

/** One date: kind tile, the label and time over the title (a link) and its course, the status on the right. */
/* An event row's layout, shared by the row and its skeleton. */
const EVENT_ROW = "flex items-start gap-3 border-b border-sko-border-subtle p-4 last:border-b-0 md:px-5";
const EVENT_TEXT = "flex min-w-0 flex-1 flex-col gap-0.5";
const EVENT_BADGES_PHONE = "mt-1 flex flex-wrap gap-1 md:hidden";
const EVENT_BADGES = "flex shrink-0 flex-col items-end gap-1 max-md:hidden";
/* The day list and a day's card, shared by the Agenda and its skeleton. */
const AGENDA = "flex flex-col gap-5";
const AGENDA_DAY = "flex flex-col gap-2";
const AGENDA_CARD = "overflow-hidden rounded-card border border-sko-border-subtle bg-sko-bg-page";

function EventRow({ event }: { event: CalendarEvent }) {
  const demo = useDemoMode();
  const k = KIND[event.kind];
  return (
    <li
      className={cn("relative", EVENT_ROW)}
      data-mock={event.outOfMvp ? "Live sessions are not in Open edX, and VILT is out of the MVP" : undefined}
    >
      <span aria-hidden className={cn("inline-flex size-10 shrink-0 items-center justify-center rounded-control", k.tile)}>
        <Icon icon={k.icon} size={20} />
      </span>
      <div className={EVENT_TEXT}>
        <p className="sk-text-body-small-semibold uppercase text-sko-text-subtle">
          {event.label}
          {event.time ? <span className="normal-case"> · {formatTime(event.time)} · {YOUR_TIME}</span> : null}
        </p>
        <p className="sk-text-body-medium-semibold text-sko-text-default">
          {/* The whole row is the title's target (44 at least), as the Dashboard rows. */}
          <Link href={event.href} className="hover:underline after:absolute after:inset-0 after:content-['']">
            {event.title}
          </Link>
        </p>
        <p className="sk-text-body-small-regular text-sko-text-subtle">{event.course}</p>
        {/* Mobile: the status sits under the text, so the title keeps the width. */}
        <span className={EVENT_BADGES_PHONE}>
          {statusBadge(event)}
          {event.outOfMvp && demo ? (
            <Badge variant="outline" color="gray">
              Not in MVP
            </Badge>
          ) : null}
        </span>
      </div>
      <span className={EVENT_BADGES}>
        {statusBadge(event)}
        {event.outOfMvp && demo ? (
          <Badge variant="outline" color="gray">
            Not in MVP
          </Badge>
        ) : null}
      </span>
    </li>
  );
}

/** The days from today on, each with its dates; the done and the missed ones are elsewhere. */
function Agenda({ events }: { events: CalendarEvent[] }) {
  const days = agendaDays(events);
  if (!days.length) {
    return (
      <p role="status" className="sk-text-body-medium-regular rounded-card border border-sko-border-subtle bg-sko-bg-page p-5 text-sko-text-subtle">
        Nothing coming up for this filter.
      </p>
    );
  }
  return (
    <ol className={AGENDA}>
      {days.map(({ day, events: dayEvents }) => {
        const h = dayHeading(day);
        return (
          <li key={day} className={AGENDA_DAY}>
            <h3 className="sk-text-title-medium-semibold text-sko-text-default">
              {h.lead} {h.rest ? <span className="text-sko-text-subtle">{h.rest}</span> : null}
            </h3>
            <ul className={AGENDA_CARD}>
              {dayEvents.map((e) => (
                <EventRow key={e.id} event={e} />
              ))}
            </ul>
          </li>
        );
      })}
    </ol>
  );
}

/** A month: weeks from Monday, each day with up to two dates and "+N more". Desktop and tablet. */
function Month({ events, month, onMonth }: { events: CalendarEvent[]; month: string; onMonth: (delta: number) => void }) {
  const first = parseDay(`${month}-01`);
  const lead = (first.getDay() + 6) % 7; // Monday first
  const daysIn = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();
  const cells: (string | null)[] = [
    ...Array.from({ length: lead }, () => null),
    ...Array.from({ length: daysIn }, (_, i) => `${month}-${String(i + 1).padStart(2, "0")}`),
  ];
  while (cells.length % 7) cells.push(null);
  const weeks = Array.from({ length: cells.length / 7 }, (_, w) => cells.slice(w * 7, w * 7 + 7));
  const heads = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className="overflow-hidden rounded-card border border-sko-border-subtle bg-sko-bg-page">
      <div className="flex items-center justify-between gap-2 border-b border-sko-border-subtle px-4 py-3">
        <h3 className="sk-text-title-medium-semibold text-sko-text-default" aria-live="polite">
          {MONTH.format(first)}
        </h3>
        <div className="flex gap-1">
          <button type="button" aria-label="Previous month" onClick={() => onMonth(-1)} className="inline-flex size-9 items-center justify-center rounded-control text-sko-icon-subtle transition-colors hover:bg-sko-bg-subtle">
            <Icon icon={ChevronLeft} size={20} />
          </button>
          <button type="button" aria-label="Next month" onClick={() => onMonth(1)} className="inline-flex size-9 items-center justify-center rounded-control text-sko-icon-subtle transition-colors hover:bg-sko-bg-subtle">
            <Icon icon={ChevronRight} size={20} />
          </button>
        </div>
      </div>
      <table className="w-full table-fixed border-collapse">
        <thead>
          <tr>
            {heads.map((h) => (
              <th key={h} scope="col" className="sk-text-body-small-semibold border-b border-sko-border-subtle py-2 text-center uppercase text-sko-text-subtle">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week, w) => (
            <tr key={w}>
              {week.map((day, d) => {
                const list = day ? events.filter((e) => e.date === day) : [];
                const today = day === CALENDAR_TODAY;
                return (
                  <td key={d} className={cn("h-28 border-b border-r border-sko-border-subtle p-1.5 align-top last:border-r-0", !day && "bg-sko-bg-faint")}>
                    {day ? (
                      <div className="flex h-full flex-col gap-1">
                        <span
                          aria-current={today ? "date" : undefined}
                          className={cn(
                            "sk-text-body-small-semibold inline-flex size-6 items-center justify-center rounded-pill",
                            today ? "bg-sko-bg-primary text-sko-text-on-primary" : "text-sko-text-subtle",
                          )}
                        >
                          {Number(day.slice(8))}
                        </span>
                        {list.slice(0, 2).map((e) => (
                          <Link
                            key={e.id}
                            href={e.href}
                            title={`${e.label}: ${e.title}`}
                            className={cn(
                              "sk-text-body-small-medium flex items-center gap-1 truncate rounded-inner px-1 py-0.5 text-sko-text-default transition-colors hover:bg-sko-bg-subtle",
                              // Done: struck through. Missed: in the error ink, not struck — it still needs doing.
                              e.complete && "text-sko-text-subtle line-through",
                              isMissed(e) && "text-sko-text-error",
                            )}
                          >
                            <span aria-hidden className={cn("size-1.5 shrink-0 rounded-pill", KIND[e.kind].dot)} />
                            <span className="truncate">{e.title}</span>
                          </Link>
                        ))}
                        {list.length > 2 ? <span className="sk-text-body-small-regular px-1 text-sko-text-subtle">+{list.length - 2} more</span> : null}
                      </div>
                    ) : null}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** The next seven days as a strip: a day, its number, a dot per kind of date. */
function WeekStrip({ events }: { events: CalendarEvent[] }) {
  const days = Array.from({ length: 7 }, (_, i) => addDays(CALENDAR_TODAY, i));
  return (
    <ol className="grid grid-cols-7 gap-1">
      {days.map((day) => {
        const kinds = [...new Set(events.filter((e) => e.date === day && !e.complete).map((e) => e.kind))];
        const today = day === CALENDAR_TODAY;
        return (
          <li key={day} className={cn("flex flex-col items-center gap-1 rounded-control py-2", today && "bg-sko-bg-primary-soft")}>
            <span className="sk-text-body-small-medium text-sko-text-subtle">{WEEKDAY.format(parseDay(day))}</span>
            <span className={cn("sk-text-title-medium-semibold", today ? "text-sko-text-primary" : "text-sko-text-default")}>{Number(day.slice(8))}</span>
            <span className="flex h-1.5 gap-0.5" aria-hidden>
              {kinds.map((k) => (
                <span key={k} className={cn("size-1.5 rounded-pill", KIND[k].dot)} />
              ))}
            </span>
            <span className="sr-only">{kinds.length ? `${kinds.length} kind${kinds.length > 1 ? "s" : ""} of date` : "Nothing"}</span>
          </li>
        );
      })}
    </ol>
  );
}

/* The skeleton draws the first events only: a long agenda is mostly below the fold. */
const MAX_SKELETON_EVENTS = 8;

/** The first `max` events of the days, in order (the days they leave empty are dropped). */
function capDays(days: { day: string; events: CalendarEvent[] }[], max: number) {
  const out: typeof days = [];
  let left = max;
  for (const d of days) {
    if (left <= 0) break;
    out.push({ day: d.day, events: d.events.slice(0, left) });
    left -= d.events.length;
  }
  return out;
}

/** An event row while it loads: the kind tile, ghost label · time, title and course, the badges. */
function EventRowSkeleton({ event, demo }: { event: CalendarEvent; demo: boolean }) {
  const badges = (
    <>
      <SkeletonPill>{statusOf(event).label}</SkeletonPill>
      {event.outOfMvp && demo ? <SkeletonPill>Not in MVP</SkeletonPill> : null}
    </>
  );
  return (
    <div className={EVENT_ROW}>
      <Skeleton variant="block" width={40} height={40} radius="control" />
      <div className={EVENT_TEXT}>
        <Skeleton variant="ghost" text="body-small-semibold" className="uppercase">
          {event.label}
          {event.time ? <span className="normal-case"> · {formatTime(event.time)} · {YOUR_TIME}</span> : null}
        </Skeleton>
        <Skeleton variant="ghost" text="body-medium-semibold">{event.title}</Skeleton>
        <Skeleton variant="ghost" text="body-small-regular">{event.course}</Skeleton>
        <span className={EVENT_BADGES_PHONE}>{badges}</span>
      </div>
      <span className={EVENT_BADGES}>{badges}</span>
    </div>
  );
}

/**
 * The Calendar while it loads (motion-matrix §7.9): CalendarView's column in Skeletons from the
 * same data, so it has the page's geometry: the title, the missed-deadlines alert and its rows,
 * the filters, the Agenda (the view that opens) day by day as ghost lines, and the 320 column.
 */
function CalendarSkeleton() {
  const demo = useDemoMode();
  const [twoCourses, setTwoCourses] = React.useState(false);
  React.useEffect(() => setTwoCourses(new URLSearchParams(window.location.search).get("missed") === "2"), []);
  const all = twoCourses ? [...calendarEvents, secondMissedEvent] : calendarEvents;
  const missed = missedByCourse(all);
  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-5 md:gap-6 lg:gap-8">
      <Skeleton variant="ghost" text="headline-large-bold">What’s coming up.</Skeleton>
      {missed.length ? (
        <div className="flex flex-col gap-3">
          <div className="flex items-start gap-3 border-t-2 border-sko-border-subtle bg-sko-bg-page p-4">
            <Skeleton variant="circle" size={20} className="mt-0.5" />
            <div className="flex flex-col gap-0.5">
              <Skeleton variant="ghost" text="body-medium-semibold">{SHIFT_DATES.title}</Skeleton>
              <Skeleton variant="ghost" text="body-medium-regular">{SHIFT_DATES.body}</Skeleton>
            </div>
          </div>
          <div className="overflow-hidden rounded-card border border-sko-border-subtle bg-sko-bg-page">
            {missed.map(({ course, items }) => (
              <div key={course} className="flex flex-col gap-3 border-b border-sko-border-subtle p-4 last:border-b-0 md:flex-row md:items-center">
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <Skeleton variant="ghost" text="body-medium-semibold">{course}</Skeleton>
                  <Skeleton variant="ghost" text="body-small-regular">
                    {items.map((e) => `${e.title} · was due ${formatDay(e.date)}`).join(" · ")}
                  </Skeleton>
                </div>
                <SkeletonPill size="segment" className="max-md:w-full md:h-9">{SHIFT_DATES.button}</SkeletonPill>
              </div>
            ))}
          </div>
        </div>
      ) : null}
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:gap-8">
        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex max-w-full gap-0.5 overflow-hidden rounded-track bg-sko-bg-track p-1">
              {calendarFilters.map((f) => (
                <SkeletonPill key={f.id} size="segment" className="bg-transparent">{f.label}</SkeletonPill>
              ))}
            </div>
            <div className="inline-flex gap-0.5 rounded-track bg-sko-bg-track p-1 max-md:hidden">
              <SkeletonPill size="segment" className="bg-transparent">Agenda</SkeletonPill>
              <SkeletonPill size="segment" className="bg-transparent">Month</SkeletonPill>
            </div>
          </div>
          <div className={AGENDA}>
            {capDays(agendaDays(all), MAX_SKELETON_EVENTS).map(({ day, events }) => {
              const h = dayHeading(day);
              return (
                <div key={day} className={AGENDA_DAY}>
                  <Skeleton variant="ghost" text="title-medium-semibold">{`${h.lead} ${h.rest}`}</Skeleton>
                  <div className={AGENDA_CARD}>
                    {events.map((e) => (
                      <EventRowSkeleton key={e.id} event={e} demo={demo} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex flex-col gap-4 lg:w-[320px] lg:shrink-0">
          <div className="flex flex-col gap-3 rounded-card border border-sko-border-subtle bg-sko-bg-page p-4">
            <Skeleton variant="ghost" text="title-medium-semibold">Next 7 days</Skeleton>
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: 7 }, (_, i) => (
                <div key={i} className="flex flex-col items-center gap-1 py-2">
                  <Skeleton text="body-small-medium" width={24} />
                  <Skeleton text="title-medium-semibold" width={20} />
                  <span className="h-1.5" />
                </div>
              ))}
            </div>
            <Skeleton text="body-small-regular" width="60%" />
            <Skeleton text="body-small-regular" width="90%" />
          </div>
          <div className="flex flex-col gap-3 rounded-card border border-sko-border-subtle bg-sko-bg-page p-4">
            <div className="flex items-start gap-3">
              <Skeleton variant="circle" size={20} className="mt-0.5" />
              <div className="flex flex-col gap-0.5">
                <Skeleton variant="ghost" text="body-medium-semibold">Add to your calendar</Skeleton>
                <Skeleton variant="ghost" text="body-small-regular">
                  Your deadlines and sessions in Google, Outlook or Apple Calendar, kept up to date.
                </Skeleton>
              </div>
            </div>
            <SkeletonPill size="segment" className="self-start md:h-9">Subscribe</SkeletonPill>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Calendar (proposal, 17 Oct 2026; no Figma screen yet): the dates of every course in one place.
 * Header, then the missed deadlines (if any), then Agenda (the default, and the only view on
 * mobile) or Month, filtered by kind. Desktop has a 320 column: the next seven days and calendar
 * sync. Every date opens what it is about: the unit in the player, the course or program page.
 */
export function CalendarView() {
  const showToast = useLmsStore((s) => s.showToast);
  const router = useRouter();
  const [filter, setFilter] = React.useState<Filter>("all");
  const [view, setView] = React.useState<View>("agenda");
  const [month, setMonth] = React.useState(CALENDAR_TODAY.slice(0, 7));
  // `?missed=2` shows the two-course case (Figma cards 01b / 03b).
  const [twoCourses, setTwoCourses] = React.useState(false);
  React.useEffect(() => setTwoCourses(new URLSearchParams(window.location.search).get("missed") === "2"), []);
  const all = twoCourses ? [...calendarEvents, secondMissedEvent] : calendarEvents;
  const events = all.filter((e) => filter === "all" || e.kind === filter);
  const missed = all.filter(isMissed);
  const missedCourses = missedByCourse(all);
  // Shifted courses leave the alert (the platform reloads their dates).
  const [shifted, setShifted] = React.useState<string[]>([]);
  const visibleMissed = missedCourses.filter((c) => !shifted.includes(c.course));
  const shift = (course: string) => {
    setShifted((list) => [...list, course]);
    showToast(SHIFT_DATES.toast, {
      actionLabel: SHIFT_DATES.toastLink,
      onAction: () => router.push(`${coursePageHref(slugify(course))}?tab=dates`),
    });
  };
  const thisWeek = calendarEvents.filter((e) => e.date >= CALENDAR_TODAY && e.date <= addDays(CALENDAR_TODAY, 6) && !e.complete);
  const shiftMonth = (delta: number) => {
    const d = parseDay(`${month}-01`);
    d.setMonth(d.getMonth() + delta);
    setMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
  };

  return (
    <PlatformPage
      current="calendar"
      className="px-6 pb-12 pt-6 md:px-8 md:pb-16 md:pt-8 lg:px-10 lg:pb-20 lg:pt-10"
      skeleton={<CalendarSkeleton />}
    >
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-5 md:gap-6 lg:gap-8">
        <h1 data-arrive={0} className="sk-text-headline-large-bold text-sko-text-default">
          What&rsquo;s <span data-heading-em="" className="text-sko-text-subtle">coming up.</span>
        </h1>

        {visibleMissed.length ? (
          // Open edX "Shift due dates", as the platform does it (lib/platform/shift-dates): its warning
          // alert and copy, then one row per self-paced course with missed deadlines, each with its own
          // Primary "Shift due dates" (reset_course_deadlines is one course per call, no confirmation).
          // After a shift: the platform's toast with "View all dates" (that course's Dates tab), and the row goes.
          <section data-arrive={1} aria-labelledby="calendar-missed" className="flex flex-col gap-3">
            <div className="flex items-start gap-3 border-t-2 border-sko-border-warning bg-sko-bg-page p-4">
              <Icon icon={AlertCircle} size={20} className="mt-0.5 shrink-0 text-sko-icon-warning" />
              <div className="flex flex-col gap-0.5">
                <h2 id="calendar-missed" className="sk-text-body-medium-semibold text-sko-text-default">
                  {SHIFT_DATES.title}
                </h2>
                <p className="sk-text-body-medium-regular text-sko-text-muted">{SHIFT_DATES.body}</p>
              </div>
            </div>
            <ul className="overflow-hidden rounded-card border border-sko-border-subtle bg-sko-bg-page">
              {visibleMissed.map(({ course, items }) => (
                <li key={course} className="flex flex-col gap-3 border-b border-sko-border-subtle p-4 last:border-b-0 md:flex-row md:items-center">
                  <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <p className="sk-text-body-medium-semibold text-sko-text-default">{course}</p>
                    <p className="sk-text-body-small-regular text-sko-text-subtle">
                      {items.map((e) => `${e.title} · was due ${formatDay(e.date)}`).join(" · ")}
                    </p>
                  </div>
                  <Button size="sm" className="shrink-0 max-md:h-11 max-md:w-full" onClick={() => shift(course)}>
                    {SHIFT_DATES.button}
                  </Button>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:gap-8">
          <section data-arrive={2} aria-label="Dates" className="flex min-w-0 flex-1 flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <PlatformSegmented label="Show" options={calendarFilters} value={filter} onChange={setFilter} />
              <PlatformSegmented
                label="View"
                className="max-md:hidden"
                options={[
                  { id: "agenda", label: "Agenda" },
                  { id: "month", label: "Month" },
                ]}
                value={view}
                onChange={(v) => setView(v as View)}
              />
            </div>
            <div data-mock="Dates come one course at a time (Dates API); no route merges them, and no course has due dates authored yet">
              {view === "month" ? (
                <>
                  <div className="max-md:hidden">
                    <Month events={events} month={month} onMonth={shiftMonth} />
                  </div>
                  <div className="md:hidden">
                    <Agenda events={events} />
                  </div>
                </>
              ) : (
                <Agenda events={events} />
              )}
            </div>
          </section>

          <aside data-arrive={3} aria-label="This week and calendar sync" className="flex flex-col gap-4 lg:w-[320px] lg:shrink-0">
            <section aria-labelledby="calendar-week" className="flex flex-col gap-3 rounded-card border border-sko-border-subtle bg-sko-bg-page p-4">
              <h2 id="calendar-week" className="sk-text-title-medium-semibold text-sko-text-default">
                Next 7 days
              </h2>
              <WeekStrip events={calendarEvents} />
              <p className="sk-text-body-small-regular text-sko-text-subtle">
                <ArrivalCount value={String(thisWeek.filter((e) => e.kind === "deadline").length)} /> deadlines ·{" "}
                <ArrivalCount value={String(thisWeek.filter((e) => e.kind === "live").length)} /> live sessions
              </p>
              <ul className="flex flex-wrap gap-x-4 gap-y-1" aria-label="Legend">
                {(["deadline", "live", "course"] as const).map((k) => (
                  <li key={k} className="sk-text-body-small-regular inline-flex items-center gap-1.5 text-sko-text-subtle">
                    <span aria-hidden className={cn("size-2 rounded-pill", KIND[k].dot)} />
                    {k === "deadline" ? "Deadline" : k === "live" ? "Live session" : "Course date"}
                  </li>
                ))}
              </ul>
            </section>
            <section
              aria-labelledby="calendar-sync"
              data-mock="Calendar sync is Phase 3 (feature deltas)"
              className="flex flex-col gap-3 rounded-card border border-sko-border-subtle bg-sko-bg-page p-4"
            >
              <div className="flex items-start gap-3">
                <Icon icon={CalendarPlus} size={20} className="mt-0.5 shrink-0 text-sko-icon-primary" />
                <div className="flex flex-col gap-0.5">
                  <h2 id="calendar-sync" className="sk-text-body-medium-semibold text-sko-text-default">
                    Add to your calendar
                  </h2>
                  <p className="sk-text-body-small-regular text-sko-text-subtle">
                    Your deadlines and sessions in Google, Outlook or Apple Calendar, kept up to date.
                  </p>
                </div>
              </div>
              <Button hierarchy="secondary" size="sm" className="self-start max-md:h-11" onClick={() => showToast("Calendar sync is not part of this prototype yet")}>
                Subscribe
              </Button>
            </section>
          </aside>
        </div>
      </div>
    </PlatformPage>
  );
}
