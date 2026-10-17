import { coursePageHref, coursePlayerHref } from "./hrefs";

/**
 * Calendar (proposal, 17 Oct 2026): every date the learner has to know, across their courses.
 *
 * Open edX has no cross-course calendar: the Dates API answers one course at a time
 * (`GET /api/course_home/dates/{course}` → `course_date_blocks[]` with title, date,
 * `date_type`, `complete`, `link`). The page asks it for every enrolment and merges the
 * answers. Live sessions are not in Open edX at all and VILT is out of the MVP: they are
 * shown here, marked, so the proposal covers the whole case (Nelson, 17 Oct 2026).
 *
 * The sample "today" is Saturday 24 October 2026, the day the Dashboard's "Tonight" deadline
 * falls on; the three deadlines of the coming seven days are the "3" on the top bar.
 */

export const CALENDAR_TODAY = "2026-10-24";

export type CalendarKind = "deadline" | "course" | "live";

export interface CalendarEvent {
  id: string;
  /** ISO date, local. */
  date: string;
  /** "11:59 PM", "4:00 PM"; none for a whole-day date. */
  time?: string;
  kind: CalendarKind;
  /** Course start / end / unlock / certificate: what the date is, in a word. */
  label: string;
  title: string;
  course: string;
  /** Where the title goes: the unit in the player, or the course page. */
  href: string;
  /** Deadlines: done before the date (Dates API `complete`). */
  complete?: boolean;
  /** Not in Open edX and not in the MVP: shown with a SAMPLE mark. */
  outOfMvp?: boolean;
}

const UX = "ux-research-and-design-thinking";
const ACB = "ai-driven-content-and-brand-communication";
const LRT = "leadership-in-remote-teams";
const PMA = "project-management-with-ai-tools";

export const calendarEvents: CalendarEvent[] = [
  {
    id: "uxr-quiz-interviews",
    date: "2026-10-22",
    time: "11:59 PM",
    kind: "deadline",
    label: "Graded quiz",
    title: "Practice Quiz: Interview techniques",
    course: "UX Research and Design Thinking",
    href: coursePlayerHref(UX),
  },
  {
    id: "acb-m2-reading",
    date: "2026-10-20",
    time: "11:59 PM",
    kind: "deadline",
    label: "Homework",
    title: "Assignment 01 · Brand voice in three traits",
    course: "AI-Driven Content and Brand Communication",
    href: coursePlayerHref(ACB),
    complete: true,
  },
  {
    id: "peer-review-persona-research",
    date: "2026-10-24",
    time: "11:59 PM",
    kind: "deadline",
    label: "Peer assessment",
    title: "Persona research draft",
    course: "UX Research and Design Thinking",
    href: coursePlayerHref(UX, "uxr-m1-t10"),
  },
  {
    id: "assignment-02-audience-segmentation",
    date: "2026-10-26",
    time: "11:59 PM",
    kind: "deadline",
    label: "Homework",
    title: "Assignment 02 · Audience segmentation",
    course: "AI-Driven Content and Brand Communication",
    href: coursePlayerHref(ACB, "acb-m2-t10"),
  },
  {
    id: "live-agile-coach",
    date: "2026-10-27",
    time: "4:00 PM",
    kind: "live",
    label: "Live session",
    title: "Agile Coach Q&A with David Chen",
    course: "Leadership in Remote Teams",
    href: coursePageHref(LRT),
    outOfMvp: true,
  },
  {
    id: "lrt-quiz-module-3",
    date: "2026-10-28",
    time: "11:59 PM",
    kind: "deadline",
    label: "Graded quiz",
    title: "Module 3 quiz · Meetings and rituals",
    course: "Leadership in Remote Teams",
    href: coursePlayerHref(LRT),
  },
  {
    id: "live-brand-workshop",
    date: "2026-10-29",
    time: "5:00 PM",
    kind: "live",
    label: "Live session",
    title: "Brand voice workshop",
    course: "AI-Driven Content and Brand Communication",
    href: coursePageHref(ACB),
    outOfMvp: true,
  },
  {
    id: "pma-sprint-plan",
    date: "2026-11-02",
    time: "11:59 PM",
    kind: "deadline",
    label: "Project",
    title: "Sprint plan with an AI assistant",
    course: "Project Management with AI Tools",
    href: coursePlayerHref(PMA),
  },
  {
    id: "program-course-3-opens",
    date: "2026-11-04",
    kind: "course",
    label: "Course opens",
    title: "SEO, GEO, and Organic Growth with AI",
    course: "Certificate Program in AI Augmented Digital Marketing",
    href: "/platform/program/ai-driven-digital-marketing",
  },
  {
    id: "lrt-ends",
    date: "2026-11-15",
    kind: "course",
    label: "Course ends",
    title: "Leadership in Remote Teams",
    course: "Last day to finish and earn the certificate",
    href: coursePageHref(LRT),
  },
];

export const calendarFilters: { id: "all" | CalendarKind; label: string }[] = [
  { id: "all", label: "All" },
  { id: "deadline", label: "Deadlines" },
  { id: "live", label: "Live sessions" },
  { id: "course", label: "Course dates" },
];

/* ── Dates (no time zone: the sample dates are local days) ─────────────────────────── */

export const parseDay = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
};
export const isoDay = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
export const addDays = (iso: string, n: number) => {
  const d = parseDay(iso);
  d.setDate(d.getDate() + n);
  return isoDay(d);
};

/** Overdue: a deadline before today, not done. */
export const isMissed = (e: CalendarEvent) => e.kind === "deadline" && !e.complete && e.date < CALENDAR_TODAY;

/** The deadlines of the next seven days, today included: the count on the top bar. */
export const deadlinesThisWeek = calendarEvents.filter(
  (e) => e.kind === "deadline" && !e.complete && e.date >= CALENDAR_TODAY && e.date <= addDays(CALENDAR_TODAY, 6),
).length;
