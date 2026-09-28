/**
 * Direction C's agenda model: live sessions and due items from the persona, merged into one
 * chronological list and bucketed by time. Everything here is MOCK (MOCK.live + MOCK.due): the
 * persona data only carries display labels, so the ISO dates below pin those labels to one mock
 * week (Mon 29 Sep – Sun 5 Oct, "now" = Tue 30 Sep, 15:45) so the page can sort and group them.
 */
import type { Persona } from "@/lib/lab/dashboard-mock";
import type { TopicType } from "@/lib/types";

export const MOCK_TODAY = "2025-09-30";
export const MOCK_NOW = "15:45";
const WEEK_START = "2025-09-29";

export type AgendaKind = "Live session" | "Recording" | "Quiz" | "Project" | "Assignment" | "Exam";
export type AgendaStatus = "live" | "overdue" | "recording" | "due-soon" | "upcoming" | "scheduled";
export type Bucket = "now" | "catch-up" | "today" | "week" | "later";

export interface AgendaItem {
  id: string;
  kind: AgendaKind;
  title: string;
  course: string;
  host?: string;
  /** ISO date (due items, recordings) or ISO date-time (sessions). */
  at: string;
  /** Free text kept from the persona, e.g. "ends 16:30" or "52 min". */
  note?: string;
  status: AgendaStatus;
  href: string;
  bucket: Bucket;
}

/** persona:source:id → ISO date(-time). Matches the labels in lib/lab/dashboard-mock.ts. */
const WHEN: Record<string, { at: string; note?: string }> = {
  "maya:live:l1": { at: "2025-09-30T16:00" },
  "maya:live:l2": { at: "2025-10-02T18:00" },
  "maya:due:d1": { at: "2025-10-02" },
  "maya:due:d2": { at: "2025-10-13" },
  "dev:live:l1": { at: "2025-09-24", note: "52 min" },
  "dev:live:l2": { at: "2025-10-01T17:30" },
  "dev:due:d1": { at: "2025-09-22" },
  "dev:due:d2": { at: "2025-10-03" },
  "priya:live:l1": { at: "2025-09-30T15:30", note: "Ends 16:30" },
  "priya:due:d1": { at: "2025-10-17" },
};

export const KIND_TOPIC_TYPE: Record<AgendaKind, TopicType> = {
  "Live session": "VILT-Live Session",
  Recording: "VILT-Recording",
  Quiz: "Quiz",
  Project: "Project",
  Assignment: "Graded Assignment",
  Exam: "Quiz",
};

/* ── Date helpers: string maths only, so server and client render the same text. ─────── */
const WD = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const WD_LONG = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MO = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MO_LONG = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const dateOf = (iso: string) => iso.slice(0, 10);
export const timeOf = (iso: string) => (iso.length > 10 ? iso.slice(11, 16) : undefined);

function utc(date: string): Date {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

/** "Thu 2 Oct" */
export function shortDay(iso: string): string {
  const d = utc(dateOf(iso));
  return `${WD[d.getUTCDay()]} ${d.getUTCDate()} ${MO[d.getUTCMonth()]}`;
}

/** "Tuesday 30 September" */
export function longDay(iso: string): string {
  const d = utc(dateOf(iso));
  return `${WD_LONG[d.getUTCDay()]} ${d.getUTCDate()} ${MO_LONG[d.getUTCMonth()]}`;
}

export interface WeekDay {
  date: string;
  weekday: string;
  dayOfMonth: number;
  isToday: boolean;
  count: number;
}

export function week(items: AgendaItem[]): WeekDay[] {
  const start = utc(WEEK_START).getTime();
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start + i * 86_400_000);
    const date = d.toISOString().slice(0, 10);
    return {
      date,
      weekday: WD[d.getUTCDay()],
      dayOfMonth: d.getUTCDate(),
      isToday: date === MOCK_TODAY,
      count: items.filter((it) => dateOf(it.at) === date && it.status !== "overdue" && it.status !== "recording").length,
    };
  });
}

function bucketOf(status: AgendaStatus, at: string): Bucket {
  if (status === "live") return "now";
  if (status === "overdue" || status === "recording") return "catch-up";
  const day = dateOf(at);
  if (day === MOCK_TODAY) return "today";
  const weekEnd = new Date(utc(WEEK_START).getTime() + 6 * 86_400_000).toISOString().slice(0, 10);
  return day <= weekEnd ? "week" : "later";
}

/** Merge the persona's sessions and due items into one list, oldest first. */
export function buildAgenda(p: Persona): AgendaItem[] {
  const items: AgendaItem[] = [];
  for (const s of p.live.value) {
    const w = WHEN[`${p.id}:live:${s.id}`];
    if (!w) continue;
    const status: AgendaStatus = s.state === "live" ? "live" : s.state === "recording" ? "recording" : "scheduled";
    items.push({
      id: `live-${s.id}`,
      kind: s.state === "recording" ? "Recording" : "Live session",
      title: s.title,
      course: s.course,
      host: s.host,
      at: w.at,
      note: w.note,
      status,
      href: "#",
      bucket: bucketOf(status, w.at),
    });
  }
  for (const d of p.due.value) {
    const w = WHEN[`${p.id}:due:${d.id}`];
    if (!w) continue;
    const status: AgendaStatus = d.state;
    items.push({
      id: `due-${d.id}`,
      kind: d.kind,
      title: d.title,
      course: d.course,
      at: w.at,
      status,
      href: d.href,
      bucket: bucketOf(status, w.at),
    });
  }
  // Date-only items (deadlines) sort after timed items on the same day: they are due by end of day.
  const key = (it: AgendaItem) => (it.at.length > 10 ? it.at : `${it.at}T23:59`);
  return items.sort((a, b) => key(a).localeCompare(key(b)));
}
