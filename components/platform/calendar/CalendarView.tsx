import * as React from "react";
import Link from "@/lib/router";
import { AlertCircle, CalendarDays, CalendarPlus, ChevronLeft, ChevronRight, ClipboardCheck, Flag, List, Video } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { ArrivalCount } from "@/components/atoms/ArrivalCount";
import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import { Skeleton, SkeletonPill } from "@/components/atoms/Skeleton";
import { PlatformPage } from "@/components/platform/PlatformPage";
import { PlatformSegmented } from "@/components/platform/PlatformSegmented";
import { StickyToolbar } from "@/components/platform/StickyToolbar";
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
import { useRouter } from "@/lib/router";
import { SHIFT_DATES } from "@/lib/platform/shift-dates";
import { YOUR_TIME, dueBadgeLabel, formatDay, formatTime } from "@/lib/sample-time";
import { coursePageHref, slugify } from "@/lib/platform/hrefs";
import { cn } from "@/lib/utils";
import { useDemoMode } from "@/lib/demo";
import { CalendarSyncModal } from "@/components/platform/forms/CalendarSyncModal";
import { useSessionAdditions } from "@/lib/platform/session-additions";
import { useEdxScope } from "@/lib/edx-scope";
import styles from "./CalendarView.module.css";

type Filter = (typeof calendarFilters)[number]["id"];
type View = "agenda" | "month";

/* One look per kind: the icon tile and the badge. Deadlines are warning (as the Dashboard's
   Due item), live sessions success (ADR 012: live is green), course dates info. */
const KIND: Record<CalendarKind, { icon: LucideIcon; tile: string; dot: string }> = {
  deadline: { icon: ClipboardCheck, tile: styles.tileDeadline, dot: styles.dotDeadline },
  live: { icon: Video, tile: styles.tileLive, dot: styles.dotLive },
  course: { icon: Flag, tile: styles.tileCourse, dot: styles.dotCourse },
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
    // Past due is amber, never red (Nelson, 28 Oct 2026): it can still be shifted.
    if (isMissed(e)) return { label: "Past due", color: "warning" };
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
const EVENT_ROW = styles.eventRow;
const EVENT_TEXT = styles.eventText;
const EVENT_BADGES_PHONE = styles.eventBadgesPhone;
const EVENT_BADGES = styles.eventBadges;
/* The day list and a day's card, shared by the Agenda and its skeleton. */
const AGENDA = styles.agenda;
const AGENDA_DAY = styles.agendaDay;
const AGENDA_CARD = cn(styles.card, styles.listCard);

function EventRow({ event }: { event: CalendarEvent }) {
  const demo = useDemoMode();
  const k = KIND[event.kind];
  return (
    <li
      className={cn("sk-press-card", styles.eventRowLive, EVENT_ROW)}
      data-mock={event.outOfMvp ? "Live sessions are not in Open edX, and VILT is out of the MVP" : undefined}
    >
      <span aria-hidden className={cn(styles.tile, k.tile)}>
        <Icon icon={k.icon} size={20} />
      </span>
      <div className={EVENT_TEXT}>
        <p className={cn("sk-text-body-small-semibold", styles.eventLabel)}>
          {event.label}
          {event.time ? <span className={styles.timeCase}> · {formatTime(event.time)} · {YOUR_TIME}</span> : null}
        </p>
        <p className={cn("sk-text-body-medium-semibold", styles.ink)}>
          {/* The whole row is the title's target (44 at least), as the Dashboard rows. */}
          <Link href={event.href} className={styles.eventLink}>
            {event.title}
          </Link>
        </p>
        <p className={cn("sk-text-body-small-regular", styles.subtle)}>{event.course}</p>
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
      <p role="status" className={cn("sk-text-body-medium-regular", styles.card, styles.emptyCard)}>
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
            <h3 className={cn("sk-text-title-medium-semibold", styles.ink)}>
              {h.lead} {h.rest ? <span className={styles.subtle}>{h.rest}</span> : null}
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

/** The month's cells from Monday (null pads the first and last week), in weeks. */
function monthWeeks(month: string) {
  const first = parseDay(`${month}-01`);
  const lead = (first.getDay() + 6) % 7; // Monday first
  const daysIn = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();
  const cells: (string | null)[] = [
    ...Array.from({ length: lead }, () => null),
    ...Array.from({ length: daysIn }, (_, i) => `${month}-${String(i + 1).padStart(2, "0")}`),
  ];
  while (cells.length % 7) cells.push(null);
  return Array.from({ length: cells.length / 7 }, (_, w) => cells.slice(w * 7, w * 7 + 7));
}

const WEEK_HEADS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

/** The month's name and the previous / next buttons, shared by both month views. */
function MonthHeader({ month, onMonth }: { month: string; onMonth: (delta: number) => void }) {
  return (
    <div className={styles.monthHeader}>
      <h3 className={cn("sk-text-title-medium-semibold", styles.ink)} aria-live="polite">
        {MONTH.format(parseDay(`${month}-01`))}
      </h3>
      <div className={styles.monthNav}>
        <button type="button" aria-label="Previous month" onClick={() => onMonth(-1)} className={styles.monthNavButton}>
          <Icon icon={ChevronLeft} size={20} />
        </button>
        <button type="button" aria-label="Next month" onClick={() => onMonth(1)} className={styles.monthNavButton}>
          <Icon icon={ChevronRight} size={20} />
        </button>
      </div>
    </div>
  );
}

/** A month: weeks from Monday, each day with up to two dates and "+N more". Desktop and tablet. */
function Month({ events, month, onMonth }: { events: CalendarEvent[]; month: string; onMonth: (delta: number) => void }) {
  const weeks = monthWeeks(month);
  const heads = WEEK_HEADS;

  return (
    <div className={cn(styles.card, styles.listCard)}>
      <MonthHeader month={month} onMonth={onMonth} />
      <table className={styles.monthTable}>
        <thead>
          <tr>
            {heads.map((h) => (
              <th key={h} scope="col" className={cn("sk-text-body-small-semibold", styles.weekHead)}>
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
                  <td key={d} className={cn(styles.dayCell, !day && styles.dayCellPad)}>
                    {day ? (
                      <div className={styles.dayStack}>
                        <span
                          aria-current={today ? "date" : undefined}
                          className={cn(
                            "sk-text-body-small-semibold",
                            styles.dayNumber,
                            today ? styles.dayNumberToday : styles.subtle,
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
                              "sk-text-body-small-medium",
                              styles.monthEvent,
                              // Done: struck through. Past due: in the warning ink, not struck — it still needs doing.
                              e.complete && styles.monthEventDone,
                              isMissed(e) && styles.monthEventMissed,
                            )}
                          >
                            <span aria-hidden className={cn(styles.monthEventDot, KIND[e.kind].dot)} />
                            <span className={styles.oneLine}>{e.title}</span>
                          </Link>
                        ))}
                        {list.length > 2 ? <span className={cn("sk-text-body-small-regular", styles.moreDates)}>+{list.length - 2} more</span> : null}
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

/**
 * The month on a phone (Nelson, 22 Oct 2026): seven columns are ~45 px there, too narrow for
 * titles, so each day shows its number and a dot per kind of date (deadline, live, course
 * dates). Tapping a day lists its dates under the grid, as the Agenda rows. Today is selected
 * when it is in the month, else the first day with a date, else the 1st.
 */
function MonthCompact({ events, month, onMonth }: { events: CalendarEvent[]; month: string; onMonth: (delta: number) => void }) {
  const weeks = monthWeeks(month);
  const inMonth = events.filter((e) => e.date.startsWith(month)).sort((a, b) => a.date.localeCompare(b.date));
  const fallback = CALENDAR_TODAY.startsWith(month) ? CALENDAR_TODAY : (inMonth[0]?.date ?? `${month}-01`);
  const [picked, setPicked] = React.useState<string | null>(null);
  const selected = picked && picked.startsWith(month) ? picked : fallback;
  const dayEvents = events.filter((e) => e.date === selected);
  const h = dayHeading(selected);

  return (
    <div className={styles.compact}>
      <div className={cn(styles.card, styles.listCard)}>
        <MonthHeader month={month} onMonth={onMonth} />
        <table className={styles.monthTable}>
          <thead>
            <tr>
              {WEEK_HEADS.map((d) => (
                <th key={d} scope="col" className={cn("sk-text-label-small-semibold", styles.weekHeadCompact)}>
                  <abbr title={d} className={styles.abbr}>{d.slice(0, 1)}</abbr>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {weeks.map((week, w) => (
              <tr key={w}>
                {week.map((day, d) => {
                  if (!day) return <td key={d} />;
                  const list = events.filter((e) => e.date === day);
                  const kinds = (Object.keys(KIND) as CalendarKind[]).filter((k) => list.some((e) => e.kind === k));
                  const today = day === CALENDAR_TODAY;
                  const isSelected = day === selected;
                  const missed = list.some(isMissed);
                  return (
                    <td key={d} className={styles.compactCell}>
                      <button
                        type="button"
                        onClick={() => setPicked(day)}
                        aria-pressed={isSelected}
                        aria-current={today ? "date" : undefined}
                        aria-label={`${DAY_MONTH.format(parseDay(day))}${list.length ? `, ${list.length} ${list.length === 1 ? "date" : "dates"}` : ", no dates"}${missed ? ", missed deadline" : ""}`}
                        className={cn(
                          styles.compactDay,
                          isSelected ? styles.compactDaySelected : styles.compactDayIdle,
                        )}
                      >
                        <span
                          className={cn(
                            "sk-text-body-small-semibold",
                            styles.dayNumber,
                            today ? styles.dayNumberToday : isSelected ? styles.primaryInk : styles.ink,
                          )}
                        >
                          {Number(day.slice(8))}
                        </span>
                        <span aria-hidden className={styles.dots}>
                          {kinds.map((k) => (
                            <span key={k} className={cn(styles.dot, KIND[k].dot)} />
                          ))}
                        </span>
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <section aria-live="polite" aria-label={`${h.lead} ${h.rest}`.trim()} className={AGENDA_DAY}>
        <h3 className={cn("sk-text-title-medium-semibold", styles.ink)}>
          {h.lead} {h.rest ? <span className={styles.subtle}>{h.rest}</span> : null}
        </h3>
        {dayEvents.length ? (
          <ul className={AGENDA_CARD}>
            {dayEvents.map((e) => (
              <EventRow key={e.id} event={e} />
            ))}
          </ul>
        ) : (
          <p className={cn("sk-text-body-medium-regular", styles.card, styles.emptyCard)}>
            Nothing on this day.
          </p>
        )}
      </section>
    </div>
  );
}

/** The next seven days as a strip: a day, its number, a dot per kind of date. */
function WeekStrip({ events }: { events: CalendarEvent[] }) {
  const days = Array.from({ length: 7 }, (_, i) => addDays(CALENDAR_TODAY, i));
  return (
    <ol className={styles.week}>
      {days.map((day) => {
        const kinds = [...new Set(events.filter((e) => e.date === day && !e.complete).map((e) => e.kind))];
        const today = day === CALENDAR_TODAY;
        return (
          <li key={day} className={cn(styles.weekDay, today && styles.weekDayToday)}>
            <span className={cn("sk-text-body-small-medium", styles.subtle)}>{WEEKDAY.format(parseDay(day))}</span>
            <span className={cn("sk-text-title-medium-semibold", today ? styles.primaryInk : styles.ink)}>{Number(day.slice(8))}</span>
            <span className={styles.dots} aria-hidden>
              {kinds.map((k) => (
                <span key={k} className={cn(styles.dot, KIND[k].dot)} />
              ))}
            </span>
            <span className="sk-sr-only">{kinds.length ? `${kinds.length} kind${kinds.length > 1 ? "s" : ""} of date` : "Nothing"}</span>
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
        <Skeleton variant="ghost" text="body-small-semibold" className={styles.upper}>
          {event.label}
          {event.time ? <span className={styles.timeCase}> · {formatTime(event.time)} · {YOUR_TIME}</span> : null}
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
    <div className={cn("sk-page-stack", styles.stack)}>
      <Skeleton variant="ghost" text="headline-large-bold">What’s coming up.</Skeleton>
      {missed.length ? (
        <div className={styles.missed}>
          <div className={cn(styles.missedAlert, styles.missedAlertGhost)}>
            <Skeleton variant="circle" size={20} className={styles.iconNudge} />
            <div className={styles.stackHalf}>
              <Skeleton variant="ghost" text="body-medium-semibold">{SHIFT_DATES.title}</Skeleton>
              <Skeleton variant="ghost" text="body-medium-regular">{SHIFT_DATES.body}</Skeleton>
            </div>
          </div>
          <div className={cn(styles.card, styles.listCard)}>
            {missed.map(({ course, items }) => (
              <div key={course} className={styles.missedRow}>
                <div className={styles.eventText}>
                  <Skeleton variant="ghost" text="body-medium-semibold">{course}</Skeleton>
                  <Skeleton variant="ghost" text="body-small-regular">
                    {items.map((e) => `${e.title} · was due ${formatDay(e.date)}`).join(" · ")}
                  </Skeleton>
                </div>
                <SkeletonPill size="segment" className={styles.shiftGhost}>{SHIFT_DATES.button}</SkeletonPill>
              </div>
            ))}
          </div>
        </div>
      ) : null}
      <div className={styles.columns}>
        <div className={styles.main}>
          <div className={styles.toolbar}>
            <div className={cn(styles.segmentTrack, styles.filterTrackGhost)}>
              {calendarFilters.map((f) => (
                <SkeletonPill key={f.id} size="segment" className={styles.segmentGhost}>{f.label}</SkeletonPill>
              ))}
            </div>
            <div className={cn(styles.segmentTrack, styles.viewTrackGhost)}>
              <SkeletonPill size="segment" className={cn(styles.segmentGhost, styles.viewGhost)}>
                <span className={styles.phoneSrOnly}>Agenda</span>
              </SkeletonPill>
              <SkeletonPill size="segment" className={cn(styles.segmentGhost, styles.viewGhost)}>
                <span className={styles.phoneSrOnly}>Month</span>
              </SkeletonPill>
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
        <div className={styles.side}>
          <div className={cn(styles.card, styles.sideCard)}>
            <Skeleton variant="ghost" text="title-medium-semibold">Next 7 days</Skeleton>
            <div className={styles.week}>
              {Array.from({ length: 7 }, (_, i) => (
                <div key={i} className={styles.weekDay}>
                  <Skeleton text="body-small-medium" width={24} />
                  <Skeleton text="title-medium-semibold" width={20} />
                  <span className={styles.dotsGhost} />
                </div>
              ))}
            </div>
            <Skeleton text="body-small-regular" width="60%" />
            <Skeleton text="body-small-regular" width="90%" />
          </div>
          <div className={cn(styles.card, styles.sideCard)}>
            <div className={styles.syncHead}>
              <Skeleton variant="circle" size={20} className={styles.iconNudge} />
              <div className={styles.stackHalf}>
                <Skeleton variant="ghost" text="body-medium-semibold">Add to your calendar</Skeleton>
                <Skeleton variant="ghost" text="body-small-regular">
                  Your deadlines and sessions in Google, Outlook or Apple Calendar, kept up to date.
                </Skeleton>
              </div>
            </div>
            <SkeletonPill size="segment" className={styles.subscribeGhost}>Subscribe</SkeletonPill>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Calendar (proposal, 17 Oct 2026; no Figma screen yet): the dates of every course in one place.
 * Header, then the missed deadlines (if any), then Agenda (the default) or Month (compact on
 * mobile: dots per day, the picked day's dates under the grid), filtered by kind. Desktop has a 320 column: the next seven days and calendar
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
  // Sessions booked in Services this session show as live sessions (23 Oct 2026).
  const bookings = useSessionAdditions((s) => s.bookings);
  const [syncing, setSyncing] = React.useState(false);
  // Open edX scope: course dates and deadlines only; live sessions and coaching bookings have no source.
  const edx = useEdxScope();
  const filters = edx ? calendarFilters.filter((f) => f.id !== "live") : calendarFilters;
  const weekEvents = edx ? calendarEvents.filter((e) => e.kind !== "live") : calendarEvents;
  const all = React.useMemo(
    () => [
      ...(twoCourses ? [...calendarEvents, secondMissedEvent] : calendarEvents),
      ...bookings.map(
        (b): CalendarEvent => ({
          id: b.id,
          date: b.date,
          time: b.time,
          kind: "live",
          label: "Coaching",
          title: `${b.service} with a career coach`,
          course: "SkillUp Career services",
          href: "/platform/services",
          outOfMvp: true,
        }),
      ),
    ].filter((e) => !edx || e.kind !== "live"),
    [twoCourses, bookings, edx],
  );
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
      onAction: () => router.push(coursePageHref(slugify(course))),
    });
  };
  const thisWeek = all.filter((e) => e.date >= CALENDAR_TODAY && e.date <= addDays(CALENDAR_TODAY, 6) && !e.complete);
  const shiftMonth = (delta: number) => {
    const d = parseDay(`${month}-01`);
    d.setMonth(d.getMonth() + delta);
    setMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
  };

  return (
    <PlatformPage
      current="calendar"
      className={styles.page}
      skeleton={<CalendarSkeleton />}
    >
      <div className={cn("sk-page-stack", styles.stack)}>
        <h1 data-arrive={0} className={cn("sk-text-headline-large-bold", styles.ink)}>
          What&rsquo;s <span data-heading-em="" className={styles.subtle}>coming up.</span>
        </h1>

        {visibleMissed.length ? (
          // Open edX "Shift due dates", as the platform does it (lib/platform/shift-dates): its warning
          // alert and copy, then one row per self-paced course with missed deadlines, each with its own
          // Primary "Shift due dates" (reset_course_deadlines is one course per call, no confirmation).
          // After a shift: the platform's toast with "View all dates", and the row goes. Its link opens the
          // course page: a self-paced course has no Dates tab (decision 036).
          <section data-arrive={1} aria-labelledby="calendar-missed" data-mock="Example: SkillUp courses have no due dates configured, only start and end (meeting 28 Oct 2026, decision 036)" className={styles.missed}>
            <div className={cn(styles.missedAlert, styles.missedAlertWarning)}>
              <Icon icon={AlertCircle} size={20} className={styles.missedIcon} />
              <div className={styles.stackHalf}>
                <h2 id="calendar-missed" className={cn("sk-text-body-medium-semibold", styles.ink)}>
                  {SHIFT_DATES.title}
                </h2>
                <p className={cn("sk-text-body-medium-regular", styles.muted)}>{SHIFT_DATES.body}</p>
              </div>
            </div>
            <ul className={cn(styles.card, styles.listCard)}>
              {visibleMissed.map(({ course, items }) => (
                <li key={course} className={styles.missedRow}>
                  <div className={styles.eventText}>
                    <p className={cn("sk-text-body-medium-semibold", styles.ink)}>{course}</p>
                    <p className={cn("sk-text-body-medium-regular", styles.subtle)}>
                      {items.map((e) => `${e.title} · was due ${formatDay(e.date)}`).join(" · ")}
                    </p>
                  </div>
                  <Button size="sm" className={styles.shiftButton} onClick={() => shift(course)}>
                    {SHIFT_DATES.button}
                  </Button>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <div className={styles.columns}>
          <section data-arrive={2} aria-label="Dates" className={styles.main}>
            {/* The two controls side by side on every breakpoint (Nelson, 23 Oct 2026): the kind filter
                takes the room and scrolls sideways if it must; the view switch is icons only below md. */}
            {/* Stuck to the top on scroll up (StickyToolbar, Nelson 24 Oct 2026). */}
            <StickyToolbar className={styles.toolbar}>
              <PlatformSegmented
                label="Show"
                options={filters}
                value={filter}
                onChange={setFilter}
                className={styles.filterSwitch}
              />
              <PlatformSegmented
                label="View"
                compact
                options={[
                  { id: "agenda", label: "Agenda", icon: List },
                  { id: "month", label: "Month", icon: CalendarDays },
                ]}
                value={view}
                onChange={(v) => setView(v as View)}
                className={styles.viewSwitch}
              />
            </StickyToolbar>
            <div data-mock="Example: SkillUp courses have no due dates configured, only start and end (meeting 28 Oct 2026, decision 036); the Dates API also serves one course at a time">
              {view === "month" ? (
                <>
                  <div className={styles.fromTablet}>
                    <Month events={events} month={month} onMonth={shiftMonth} />
                  </div>
                  <div className={styles.phoneOnly}>
                    <MonthCompact events={events} month={month} onMonth={shiftMonth} />
                  </div>
                </>
              ) : (
                <Agenda events={events} />
              )}
            </div>
          </section>

          {/* On desktop the side column stays in view while the long agenda scrolls (audit, 25 Oct
              2026: the agenda ran 153% of the first viewport beside a column of 48%). */}
          <aside data-arrive={3} aria-label="This week and calendar sync" className={cn(styles.side, styles.sideSticky)}>
            <section aria-labelledby="calendar-week" className={cn(styles.card, styles.sideCard)}>
              <h2 id="calendar-week" className={cn("sk-text-title-medium-semibold", styles.ink)}>
                Next 7 days
              </h2>
              <WeekStrip events={weekEvents} />
              <p className={cn("sk-text-body-small-regular", styles.subtle)}>
                <ArrivalCount value={String(thisWeek.filter((e) => e.kind === "deadline").length)} /> deadlines
                <span data-invented="live: no live-session schedule in Open edX">
                  {" "}
                  ·{" "}
                  <ArrivalCount value={String(thisWeek.filter((e) => e.kind === "live").length)} /> live sessions
                </span>
              </p>
              <ul className={styles.legend} aria-label="Legend">
                {(["deadline", "live", "course"] as const).map((k) => (
                  <li
                    key={k}
                    data-invented={k === "live" ? "live: no live-session schedule in Open edX" : undefined}
                    className={cn("sk-text-body-small-regular", styles.legendItem)}>
                    <span aria-hidden className={cn(styles.legendDot, KIND[k].dot)} />
                    {k === "deadline" ? "Deadline" : k === "live" ? "Live session" : "Course date"}
                  </li>
                ))}
              </ul>
            </section>
            <section
              aria-labelledby="calendar-sync"
              data-mock="Calendar sync is Phase 3 (feature deltas)"
              className={cn(styles.card, styles.sideCard)}
            >
              <div className={styles.syncHead}>
                <Icon icon={CalendarPlus} size={20} className={styles.syncIcon} />
                <div className={styles.stackHalf}>
                  <h2 id="calendar-sync" className={cn("sk-text-body-medium-semibold", styles.ink)}>
                    Add to your calendar
                  </h2>
                  <p className={cn("sk-text-body-medium-regular", styles.subtle)}>
                    Your deadlines and sessions in Google, Outlook or Apple Calendar, kept up to date.
                  </p>
                </div>
              </div>
              <Button hierarchy="secondary" size="sm" className={styles.subscribe} onClick={() => setSyncing(true)}>
                Subscribe
              </Button>
            </section>
          </aside>
        </div>
      </div>
      <CalendarSyncModal open={syncing} onClose={() => setSyncing(false)} />
    </PlatformPage>
  );
}
