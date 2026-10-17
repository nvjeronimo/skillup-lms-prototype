"use client";

import * as React from "react";
import Link from "next/link";
import { AlertCircle, CalendarPlus, ChevronLeft, ChevronRight, ClipboardCheck, Flag, Video } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import { PlatformPage } from "@/components/platform/PlatformPage";
import { PlatformSegmented } from "@/components/platform/PlatformSegmented";
import {
  CALENDAR_TODAY,
  addDays,
  calendarEvents,
  calendarFilters,
  isMissed,
  parseDay,
  type CalendarEvent,
  type CalendarKind,
} from "@/lib/platform/calendar";
import { Icon } from "@/lib/icons";
import { useLmsStore } from "@/lib/store";
import { cn } from "@/lib/utils";

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

function statusBadge(e: CalendarEvent) {
  if (e.kind === "deadline") {
    if (e.complete) return <Badge color="success">Done</Badge>;
    if (isMissed(e)) return <Badge color="error">Missed</Badge>;
    return <Badge color="warning">{e.date === CALENDAR_TODAY ? `Due ${e.time ?? "today"}` : `Due ${e.time ?? ""}`.trim()}</Badge>;
  }
  if (e.kind === "live") return <Badge color="success">{`Live · ${e.time}`}</Badge>;
  return <Badge color="info">{e.label}</Badge>;
}

/** One date: kind tile, the label and time over the title (a link) and its course, the status on the right. */
function EventRow({ event }: { event: CalendarEvent }) {
  const k = KIND[event.kind];
  return (
    <li
      className="flex items-start gap-3 border-b border-sko-border-subtle p-4 last:border-b-0 md:px-5"
      data-mock={event.outOfMvp ? "Live sessions are not in Open edX, and VILT is out of the MVP" : undefined}
    >
      <span aria-hidden className={cn("inline-flex size-10 shrink-0 items-center justify-center rounded-lg", k.tile)}>
        <Icon icon={k.icon} size={20} />
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <p className="sk-text-body-small-semibold uppercase text-sko-text-subtle">
          {event.label}
          {event.time ? <span className="normal-case"> · {event.time}</span> : null}
        </p>
        <p className="sk-text-body-medium-semibold text-sko-text-default">
          <Link href={event.href} className="hover:underline">
            {event.title}
          </Link>
        </p>
        <p className="sk-text-body-small-regular text-sko-text-subtle">{event.course}</p>
        {/* Mobile: the status sits under the text, so the title keeps the width. */}
        <span className="mt-1 flex flex-wrap gap-1 md:hidden">
          {statusBadge(event)}
          {event.outOfMvp ? (
            <Badge variant="outline" color="gray">
              Not in MVP
            </Badge>
          ) : null}
        </span>
      </div>
      <span className="flex shrink-0 flex-col items-end gap-1 max-md:hidden">
        {statusBadge(event)}
        {event.outOfMvp ? (
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
  const upcoming = events.filter((e) => e.date >= CALENDAR_TODAY && !e.complete);
  const days = [...new Set(upcoming.map((e) => e.date))].sort();
  if (!days.length) {
    return (
      <p role="status" className="sk-text-body-medium-regular rounded-lg border border-sko-border-subtle bg-sko-bg-page p-5 text-sko-text-subtle">
        Nothing coming up for this filter.
      </p>
    );
  }
  return (
    <ol className="flex flex-col gap-5">
      {days.map((day) => {
        const h = dayHeading(day);
        return (
          <li key={day} className="flex flex-col gap-2">
            <h3 className="sk-text-title-medium-semibold text-sko-text-default">
              {h.lead} {h.rest ? <span className="text-sko-text-subtle">{h.rest}</span> : null}
            </h3>
            <ul className="overflow-hidden rounded-lg border border-sko-border-subtle bg-sko-bg-page">
              {upcoming
                .filter((e) => e.date === day)
                .map((e) => (
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
    <div className="overflow-hidden rounded-lg border border-sko-border-subtle bg-sko-bg-page">
      <div className="flex items-center justify-between gap-2 border-b border-sko-border-subtle px-4 py-3">
        <h3 className="sk-text-title-medium-semibold text-sko-text-default" aria-live="polite">
          {MONTH.format(first)}
        </h3>
        <div className="flex gap-1">
          <button type="button" aria-label="Previous month" onClick={() => onMonth(-1)} className="inline-flex size-9 items-center justify-center rounded-md text-sko-icon-subtle transition-colors hover:bg-sko-bg-subtle">
            <Icon icon={ChevronLeft} size={20} />
          </button>
          <button type="button" aria-label="Next month" onClick={() => onMonth(1)} className="inline-flex size-9 items-center justify-center rounded-md text-sko-icon-subtle transition-colors hover:bg-sko-bg-subtle">
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
                            "sk-text-body-small-semibold inline-flex size-6 items-center justify-center rounded-full",
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
                              "sk-text-body-small-medium flex items-center gap-1 truncate rounded px-1 py-0.5 text-sko-text-default hover:bg-sko-bg-subtle",
                              // Done: struck through. Missed: in the error ink, not struck — it still needs doing.
                              e.complete && "text-sko-text-subtle line-through",
                              isMissed(e) && "text-sko-text-error",
                            )}
                          >
                            <span aria-hidden className={cn("size-1.5 shrink-0 rounded-full", KIND[e.kind].dot)} />
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
          <li key={day} className={cn("flex flex-col items-center gap-1 rounded-md py-2", today && "bg-sko-bg-primary-soft")}>
            <span className="sk-text-body-small-medium text-sko-text-subtle">{WEEKDAY.format(parseDay(day))}</span>
            <span className={cn("sk-text-title-medium-semibold", today ? "text-sko-text-primary" : "text-sko-text-default")}>{Number(day.slice(8))}</span>
            <span className="flex h-1.5 gap-0.5" aria-hidden>
              {kinds.map((k) => (
                <span key={k} className={cn("size-1.5 rounded-full", KIND[k].dot)} />
              ))}
            </span>
            <span className="sr-only">{kinds.length ? `${kinds.length} kind${kinds.length > 1 ? "s" : ""} of date` : "Nothing"}</span>
          </li>
        );
      })}
    </ol>
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
  const [filter, setFilter] = React.useState<Filter>("all");
  const [view, setView] = React.useState<View>("agenda");
  const [month, setMonth] = React.useState(CALENDAR_TODAY.slice(0, 7));
  const events = calendarEvents.filter((e) => filter === "all" || e.kind === filter);
  const missed = calendarEvents.filter(isMissed);
  const thisWeek = calendarEvents.filter((e) => e.date >= CALENDAR_TODAY && e.date <= addDays(CALENDAR_TODAY, 6) && !e.complete);
  const shiftMonth = (delta: number) => {
    const d = parseDay(`${month}-01`);
    d.setMonth(d.getMonth() + delta);
    setMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
  };

  return (
    <PlatformPage current="calendar" className="px-6 pb-12 pt-6 md:px-8 md:pb-16 md:pt-8 lg:px-10 lg:pb-20 lg:pt-10">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-5 md:gap-6 lg:gap-8">
        <h1 className="sk-text-headline-large-bold text-sko-text-default">
          What&rsquo;s <span className="text-sko-text-subtle">coming up.</span>
        </h1>

        {missed.length ? (
          // Open edX: `dates_banner_info.missed_deadlines`; a self-paced course can shift its dates.
          // DS Inline Alert 1.2, Tone=Error, Surface=Subtle: on the grey page the alert fill is bg/page.
          <section aria-labelledby="calendar-missed" className="flex flex-col gap-3 border-t-2 border-sko-border-error bg-sko-bg-page p-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-3">
              <Icon icon={AlertCircle} size={20} className="mt-0.5 shrink-0 text-sko-icon-error" />
              <div className="flex flex-col gap-0.5">
                <h2 id="calendar-missed" className="sk-text-body-medium-semibold text-sko-text-default">
                  You missed {missed.length === 1 ? "a deadline" : `${missed.length} deadlines`}
                </h2>
                <p className="sk-text-body-medium-regular text-sko-text-muted">
                  {missed.map((e) => `${e.title} (${e.course})`).join(" · ")}. In a self-paced course you can move your
                  dates and keep going.
                </p>
              </div>
            </div>
            <Button hierarchy="secondary" size="sm" className="shrink-0 max-md:h-11" onClick={() => showToast("Shift due dates is not part of this prototype yet")}>
              Shift my dates
            </Button>
          </section>
        ) : null}

        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:gap-8">
          <section aria-label="Dates" className="flex min-w-0 flex-1 flex-col gap-4">
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

          <aside aria-label="This week and calendar sync" className="flex flex-col gap-4 lg:w-[320px] lg:shrink-0">
            <section aria-labelledby="calendar-week" className="flex flex-col gap-3 rounded-lg border border-sko-border-subtle bg-sko-bg-page p-4">
              <h2 id="calendar-week" className="sk-text-title-medium-semibold text-sko-text-default">
                Next 7 days
              </h2>
              <WeekStrip events={calendarEvents} />
              <p className="sk-text-body-small-regular text-sko-text-subtle">
                {thisWeek.filter((e) => e.kind === "deadline").length} deadlines ·{" "}
                {thisWeek.filter((e) => e.kind === "live").length} live sessions
              </p>
              <ul className="flex flex-wrap gap-x-4 gap-y-1" aria-label="Legend">
                {(["deadline", "live", "course"] as const).map((k) => (
                  <li key={k} className="sk-text-body-small-regular inline-flex items-center gap-1.5 text-sko-text-subtle">
                    <span aria-hidden className={cn("size-2 rounded-full", KIND[k].dot)} />
                    {k === "deadline" ? "Deadline" : k === "live" ? "Live session" : "Course date"}
                  </li>
                ))}
              </ul>
            </section>
            <section
              aria-labelledby="calendar-sync"
              data-mock="Calendar sync is Phase 3 (feature deltas)"
              className="flex flex-col gap-3 rounded-lg border border-sko-border-subtle bg-sko-bg-page p-4"
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
