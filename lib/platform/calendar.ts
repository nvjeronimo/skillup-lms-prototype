import { addDays, isoDay, parseDay, SAMPLE_TODAY } from "@/lib/sample-time";
import { getCourseDetailBySlug } from "./course-detail";
import { coursePageHref, coursePlayerHref, programPageHref } from "./hrefs";

/**
 * Calendar (proposal, 17 Oct 2026): every date the learner has to know, across their courses.
 *
 * Open edX has no cross-course calendar: the Dates API answers one course at a time
 * (`GET /api/course_home/dates/{course}` → `course_date_blocks[]` with title, date,
 * `date_type`, `complete`, `link`). The page asks it for every enrolment and merges the
 * answers. Live sessions are not in Open edX at all and VILT is out of the MVP: they are
 * shown here, marked, so the proposal covers the whole case (Nelson, 17 Oct 2026).
 *
 * The sample "today" is Saturday 24 October 2026 (lib/sample-time), the day the Dashboard's
 * "Tonight" deadline falls on; the three deadlines of the coming seven days are the "3" on the
 * top bar. Since 20 Oct 2026 (UX audit) every course date here is read from that course's Dates
 * tab, the way the Dates API would give it: the same day, title, type and state, so the
 * Calendar, the Dashboard and the course page cannot disagree.
 */

export const CALENDAR_TODAY = SAMPLE_TODAY;

export type CalendarKind = "deadline" | "course" | "live";

export interface CalendarEvent {
  id: string;
  /** ISO date, local. */
  date: string;
  /** 24 h, in the learner's zone ("23:59", "16:00"), printed "11:59 PM · your time" (formatTime); none for a whole-day date. */
  time?: string;
  kind: CalendarKind;
  /** Deadlines: the assignment type of the Dates tab ("Graded quiz", "Homework"). Course dates: what the date is, in a word. */
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
const SEO = "seo-geo-and-organic-growth-with-ai";

/** "GRADED QUIZ" → "Graded quiz". */
const sentence = (label: string) => label.charAt(0) + label.slice(1).toLowerCase();

/** One row of a course's Dates tab (`course_date_blocks[]`). */
function courseDate(slug: string, dateId: string) {
  const page = getCourseDetailBySlug(slug);
  const row = page && [...page.datesTab.past, ...page.datesTab.upcoming].find((d) => d.id === dateId);
  if (!page || !row) throw new Error(`No date "${dateId}" on the Dates tab of ${slug}`);
  return { page, row };
}

/** A deadline of a course: its Dates tab row, its assignment-type badge as the label, its unit in the player. */
function deadline(slug: string, dateId: string, topicId: string, id: string): CalendarEvent {
  const { page, row } = courseDate(slug, dateId);
  return {
    id,
    date: row.iso.slice(0, 10),
    time: row.iso.slice(11, 16),
    kind: "deadline",
    label: sentence(row.badges[1]?.label ?? "DUE DATE"),
    // "Module 1 · Graded Quiz: Research foundations" → the unit's own title, as the outline has it.
    title: row.title.replace(/^Module \d+ · /, ""),
    course: page.title,
    href: coursePlayerHref(slug, topicId),
    ...(row.state === "complete" ? { complete: true } : {}),
  };
}

/** A whole-day date of a course (it opens, its certificate is issued). */
function courseDay(slug: string, dateId: string, id: string, label: string, course: string, href: string): CalendarEvent {
  const { page, row } = courseDate(slug, dateId);
  return { id, date: row.iso.slice(0, 10), kind: "course", label, title: page.title, course, href };
}

export const calendarEvents: CalendarEvent[] = [
  // Overdue: the graded quiz that closes Module 1 of the UX course. It is what the course's
  // missed-deadline alert, and "Shift due dates" here, are about.
  deadline(UX, "graded-quiz-foundations", "uxr-m1-t9", "uxr-graded-quiz-foundations"),
  deadline(ACB, "assignment-01", "acb-m1-t11", "acb-assignment-01-brand-voice-guide"),
  deadline(UX, "persona-research-draft", "uxr-m1-t10", "peer-review-persona-research"),
  deadline(ACB, "assignment-02", "acb-m2-t10", "assignment-02-audience-segmentation"),
  {
    id: "live-agile-coach",
    date: "2026-10-27",
    time: "16:00",
    kind: "live",
    label: "Live session",
    title: "Agile Coach Q&A with David Chen",
    course: "Leadership in Remote Teams",
    href: coursePageHref(LRT),
    outOfMvp: true,
  },
  {
    id: "live-brand-workshop",
    date: "2026-10-29",
    time: "17:00",
    kind: "live",
    label: "Live session",
    title: "Brand voice workshop",
    course: "AI-Driven Content and Brand Communication",
    href: coursePageHref(ACB),
    outOfMvp: true,
  },
  deadline(PMA, "assignment-01", "pma-m2-t8", "pma-assignment-01-sprint-plan"),
  deadline(LRT, "graded-quiz-meetings", "lrt-m3-t6", "lrt-graded-quiz-meetings"),
  // Course 3 of the program: its suggested start, the day after the certificate date of course 2.
  courseDay(SEO, "suggested-start", "program-course-3-opens", "Course opens", "Certificate Program in AI Augmented Digital Marketing", programPageHref("ai-driven-digital-marketing")),
  courseDay(LRT, "certificate-available", "lrt-certificate-available", "Certificate available", "Issued after this date with a passing grade", coursePageHref(LRT)),
];

export const calendarFilters: { id: "all" | CalendarKind; label: string }[] = [
  { id: "all", label: "All" },
  { id: "deadline", label: "Deadlines" },
  { id: "live", label: "Live sessions" },
  { id: "course", label: "Course dates" },
];

/* ── Dates: lib/sample-time (no time zone: the sample dates are local days) ──────────── */

export { addDays, isoDay, parseDay };

/** Overdue: a deadline before today, not done. */
export const isMissed = (e: CalendarEvent) => e.kind === "deadline" && !e.complete && e.date < CALENDAR_TODAY;

/**
 * A second missed deadline, in another course, shown only with `?missed=2` on the Calendar: the
 * two-course case of the Figma cards 01b / 03b (Nelson, 20 Oct 2026). The default sample keeps one.
 * It is a real graded unit of its course's Dates tab (the Module 1 graded quiz, 20 Oct); the
 * default sample has it submitted, so only this variant shows it as not done.
 */
export const secondMissedEvent: CalendarEvent = {
  ...deadline(ACB, "graded-quiz-brand", "acb-m1-t12", "acb-graded-quiz-brand"),
  complete: false,
};

/** Missed deadlines grouped by course: "Shift due dates" resets one course at a time. */
export function missedByCourse(events: CalendarEvent[]) {
  const map = new Map<string, CalendarEvent[]>();
  for (const e of events.filter(isMissed)) map.set(e.course, [...(map.get(e.course) ?? []), e]);
  return [...map.entries()].map(([course, items]) => ({ course, items }));
}

/** The deadlines of the next seven days, today included, not done. */
export const isDueThisWeek = (e: CalendarEvent) =>
  e.kind === "deadline" && !e.complete && e.date >= CALENDAR_TODAY && e.date <= addDays(CALENDAR_TODAY, 6);

/** The count on the top bar: the deadlines of the next seven days. */
export const deadlinesThisWeek = calendarEvents.filter(isDueThisWeek).length;
