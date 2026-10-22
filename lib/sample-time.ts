/**
 * The one "today" of the prototype (UX audit, 20 Oct 2026): Saturday 24 October 2026.
 *
 * Every sample date is read against it: the Dashboard, the Calendar, My Learning, every course
 * page (Dates tab, Weekly goal, Upcoming dates) and the player's due labels. Before this file the
 * course pages and the player ran on Thursday 24 September 2026; their timelines moved forward by
 * 30 days, so each course keeps the same distance between today and its deadlines.
 *
 * The sample dates are local days, with no time zone: an ISO day ("2026-10-24") is read as that
 * day wherever the page is opened. Times are stored 24 h in the learner's zone ("23:59") and
 * printed 12 h with "your time" (Nelson, 22 Oct 2026: "11:59 PM · your time"), see formatTime.
 *
 * This file imports nothing, so course files (lib/courses/README.md) may import it too.
 */

export const SAMPLE_TODAY = "2026-10-24";

/** The suffix of every time the learner reads, as on the course Dates tab. */
export const YOUR_TIME = "your time";

/** A stored 24 h time as the learner reads it, 12 h: "23:59" → "11:59 PM", "00:00" → "12:00 AM". */
export function formatTime(hhmm: string): string {
  const [h, m] = hhmm.split(":").map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`;
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const WEEKDAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "2026-10-24" (or "2026-10-24T23:59") → the local day. */
export function parseDay(iso: string): Date {
  const [y, m, d] = iso.slice(0, 10).split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function isoDay(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function addDays(iso: string, n: number): string {
  const d = parseDay(iso);
  d.setDate(d.getDate() + n);
  return isoDay(d);
}

/** Whole days from `from` to `to` (positive when `to` is later). */
export function daysBetween(from: string, to: string): number {
  return Math.round((parseDay(to).getTime() - parseDay(from).getTime()) / 86_400_000);
}

/** "Sat" */
export const formatWeekday = (iso: string) => WEEKDAYS[parseDay(iso).getDay()];
/** "Saturday" */
export const formatWeekdayName = (iso: string) => WEEKDAY_NAMES[parseDay(iso).getDay()];
/** DS short date: "Fri 17 Oct". */
export const formatDay = (iso: string) => {
  const d = parseDay(iso);
  return `${WEEKDAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}`;
};
/** DS date without the weekday, no year: "17 Oct". */
export const formatDayMonth = (iso: string) => {
  const d = parseDay(iso);
  return `${d.getDate()} ${MONTHS[d.getMonth()]}`;
};
/** DS long date: "17 Oct 2026". */
export const formatDate = (iso: string) => {
  const d = parseDay(iso);
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
};

/** The Dates tab marker: "Today · 24 Oct 2026". */
export const todayLabel = (today: string = SAMPLE_TODAY) => `Today · ${formatDate(today)}`;

/** "Due 24 Oct 2026": the player's due line of an assignment. */
export const dueLabel = (iso: string) => `Due ${formatDate(iso)}`;

/**
 * Where a date sits from today, in the words of the course sidebar and the Dashboard:
 * "Overdue · 3 days", "Today", "Tomorrow", "In 3 days", "In 2 weeks", "In 4 months".
 */
export function relativeLabel(iso: string, today: string = SAMPLE_TODAY): string {
  const n = daysBetween(today, iso);
  if (n < 0) return n === -1 ? "Overdue · 1 day" : `Overdue · ${-n} days`;
  if (n === 0) return "Today";
  if (n === 1) return "Tomorrow";
  if (n < 14) return `In ${n} days`;
  if (n < 60) return `In ${Math.round(n / 7)} weeks`;
  const months = Math.round(n / 30.44);
  return months === 1 ? "In 1 month" : `In ${months} months`;
}

/** Yellow within the coming week (today included), gray after it: the sidebar's colour rule. */
export const relativeColor = (iso: string, today: string = SAMPLE_TODAY): "yellow" | "gray" => {
  const n = daysBetween(today, iso);
  return n >= 0 && n <= 6 ? "yellow" : "gray";
};

/** The word under a deadline's day: "Tonight" (a 23:59 deadline today), "Today", "Tomorrow" or "Mon". */
export function whenLabel(iso: string, time?: string, today: string = SAMPLE_TODAY): string {
  const n = daysBetween(today, iso);
  if (n === 0) return time === "23:59" ? "Tonight" : "Today";
  if (n === 1) return "Tomorrow";
  return formatWeekday(iso);
}

/** A deadline's badge: "Due tonight", "Due today", "Due tomorrow", "Due Mon", or "Overdue · 3 days". */
export function dueBadgeLabel(iso: string, time?: string, today: string = SAMPLE_TODAY): string {
  const n = daysBetween(today, iso);
  if (n < 0) return relativeLabel(iso, today);
  return `Due ${whenLabel(iso, time, today).replace(/^[A-Z]/, (c) => (n <= 1 ? c.toLowerCase() : c))}`;
}

/** Monday of the week of `iso` (weeks run Monday to Sunday, as the Weekly goal strip). */
export const mondayOf = (iso: string) => addDays(iso, -((parseDay(iso).getDay() + 6) % 7));

/** The Weekly goal heading: "This week · 19–25 Oct" (or "26 Oct – 1 Nov" across two months). */
export function thisWeekLabel(today: string = SAMPLE_TODAY): string {
  const mon = parseDay(mondayOf(today));
  const sun = parseDay(addDays(mondayOf(today), 6));
  const range =
    mon.getMonth() === sun.getMonth()
      ? `${mon.getDate()}–${sun.getDate()} ${MONTHS[sun.getMonth()]}`
      : `${mon.getDate()} ${MONTHS[mon.getMonth()]} – ${sun.getDate()} ${MONTHS[sun.getMonth()]}`;
  return `This week · ${range}`;
}

/** Index of today in the Weekly goal strip (Monday 0 … Sunday 6): 5, a Saturday. */
export const todayWeekIndex = (today: string = SAMPLE_TODAY) => (parseDay(today).getDay() + 6) % 7;
