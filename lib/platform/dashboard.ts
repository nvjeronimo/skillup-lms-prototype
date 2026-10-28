import { Award, MessagesSquare, User, type LucideIcon } from "lucide-react";
import { discussionHref, discussionUnread } from "./discussion";
import type { BadgeColor } from "@/components/atoms/Badge";
import type { DeliveryMode } from "@/components/atoms/MetaBadges";
import { coursePageHref, coursePlayerHref, slugify } from "./hrefs";
import { SAMPLE_TODAY, YOUR_TIME, dueBadgeLabel, formatTime, parseDay, whenLabel } from "@/lib/sample-time";
import { calendarEvents, isDueThisWeek, isMissed } from "./calendar";
import { certificatesInProgress, earnedCertificates } from "./certificates";
import { ACTIVE_PERSONA_ID } from "@/lib/persona-active";
import { getPersona } from "@/lib/personas";
import { CATALOG, catalogFor } from "./catalog";
import { PROGRAMS } from "./program";

/**
 * Mock data of the platform Dashboard (Figma handoff cards 01–03 of 6408:35150: desktop
 * 6408:72361, tablet 6408:72704, mobile 6418:127183, as they read on 8 Oct 2026).
 * Copy is verbatim from the Figma frames. Nothing here is read from an API yet.
 */

/* ── Your learning at a glance (LMS/Platform/Dashboard/Today-at-a-glance) ───────────── */

export interface DashboardStat {
  label: string;
  value: string;
  /** The first line of the detail, in bold (DS v1.4: "in progress", "1 in progress"). */
  detailStrong?: string;
  detail: string;
  /** The value's colour: brand (text/on-primary-soft) or success (text/success, what is done). */
  tone: "brand" | "success";
  /** The goal beside the figure, only when Open edX serves the fact behind it. Warning when it
   *  asks for action (a deadline is near), Gray otherwise. */
  goal?: { label: string; spoken: string; color?: "warning" | "gray" };
  /** Where the card goes (Nelson, 25 Oct 2026: the figures link to the list they count). */
  href: string;
  /**
   * Harbor only (25 Oct 2026, the DreamHost panel's trend chips): the change over the last 30 days.
   * Sample data: no Open edX API returns a figure's past value (data-mock on the chip).
   */
  trend?: { label: string; dir: "up" | "down" | "flat"; spoken: string };
}

/**
 * Totals Open edX can serve (handoff map §37.4): the first three come from Learner Home in
 * one call; Programs needs `progress_details` once per program for "in progress".
 * The streak card and the "today" figures left the screens on 7 Oct: nothing returns them.
 * Since 20 Oct 2026 every figure is counted from the sample data (Nelson): every course the
 * learner is enrolled in (the single courses and the courses of the three programs), how many
 * are started and not complete, how many are complete, and the programs by state.
 *
 * Goals (Nelson, 21–22 Oct 2026, DS Today-at-a-glance v1.4): each figure on its own card with
 * a goal, only what Open edX already serves: the deadlines (Dates API, one call per course), the
 * enrolments (Learner Home) and the programs' states (`progress_details`). No goal on
 * Certificates. v1.4 (22 Oct): the light card; the same short labels and two-line details on
 * every breakpoint; the done figures (Completed, Certificates) in text/success.
 */
const enrolled = CATALOG.length;
const coursesInProgress = CATALOG.filter((c) => c.percent !== null && c.percent > 0 && c.percent < 100).length;
const coursesCompleted = CATALOG.filter((c) => c.percent === 100).length;
const programPercents = PROGRAMS.map((p) => p.courses.map((c) => c.card.progressPct ?? 0));
const programsCompleted = programPercents.filter((ps) => ps.every((x) => x === 100)).length;
const programsInProgress = programPercents.filter((ps) => ps.some((x) => x > 0) && !ps.every((x) => x === 100)).length;
const programsNotStarted = PROGRAMS.length - programsCompleted - programsInProgress;

const dueThisWeek = calendarEvents.filter(isDueThisWeek).length;
const pct = (a: number, b: number) => `${Math.round((a / b) * 100)}%`;

export const dashboardGlance: { title: string; stats: DashboardStat[] } = {
  title: "Your learning at a glance",
  stats: [
    {
      label: "Courses",
      value: String(coursesInProgress),
      detailStrong: "in progress",
      detail: `of ${enrolled} enrolled`,
      tone: "brand",
      goal: { label: `${dueThisWeek} due this week`, spoken: `${dueThisWeek} deadlines in the next seven days`, color: "warning" },
      href: "/platform/my-learning?tab=courses&status=in-progress",
      trend: { label: "1", dir: "up", spoken: "1 more than 30 days ago" },
    },
    {
      label: "Programs",
      value: String(programsInProgress),
      detailStrong: "in progress",
      detail: `of ${PROGRAMS.length} enrolled`,
      tone: "brand",
      goal: {
        label: `${programsNotStarted} not started`,
        spoken: `${programsNotStarted} of your ${PROGRAMS.length} programs not started yet`,
      },
      href: "/platform/my-learning?tab=programs&status=in-progress",
      trend: { label: "0", dir: "flat", spoken: "the same as 30 days ago" },
    },
    {
      // "Courses completed", as the Figma Dashboard (Nelson, 28 Oct 2026): it counts courses only.
      label: "Courses completed",
      value: String(coursesCompleted),
      detail: `of ${enrolled} enrolled`,
      tone: "success",
      goal: { label: `${pct(coursesCompleted, enrolled)} completed`, spoken: `${pct(coursesCompleted, enrolled)} of your ${enrolled} enrolled courses complete` },
      href: "/platform/my-learning?tab=courses&status=completed",
      trend: { label: "2", dir: "up", spoken: "2 more than 30 days ago" },
    },
    // Counted from the Certificates page (19 Oct 2026; it read 2 before the Data Analytics sample program).
    {
      label: "Certificates",
      value: String(earnedCertificates.length),
      detail: "ready to download",
      tone: "success",
      href: "/platform/certificates",
      trend: { label: "1", dir: "up", spoken: "1 more than 30 days ago" },
    },
  ],
};

/* ── Due this week (LMS / Platform / Due item, 6382:3495) ───────────────────────────── */

export interface DashboardDueItem {
  id: string;
  /** Day of the month. */
  day: string;
  /** "Today", "Tonight", or the weekday. */
  when: string;
  /** Today (and past due) = the day in text/warning; Upcoming = text/default. */
  urgency: "today" | "upcoming";
  title: string;
  meta: string;
  /** DS Badge Soft sm, all Warning: "Due tonight" / "Due tomorrow" / "Due Mon" / "Past due · 3 days" (amber, never red: Nelson, 28 Oct 2026). */
  status: { label: string; color: BadgeColor };
  /** The assignment in the player (the Dates API gives each one its `link`). */
  href: string;
}

/**
 * Assignment deadlines only, as the Calendar lists them (lib/platform/calendar, read from each
 * course's Dates tab since 20 Oct 2026): the overdue ones first, the same the Calendar's
 * "Shift due dates" is about, then the next seven days, today included.
 */
export const dashboardDue: DashboardDueItem[] = [
  ...calendarEvents.filter(isMissed),
  ...calendarEvents.filter(isDueThisWeek),
].map((e) => {
  const overdue = isMissed(e);
  return {
    id: e.id,
    day: String(parseDay(e.date).getDate()),
    when: whenLabel(e.date, e.time),
    urgency: overdue || e.date === SAMPLE_TODAY ? "today" : "upcoming",
    // DS Due-Item v1.1 (Nelson, 22 Oct 2026): the activity type in brackets after the title (not
    // when the title already starts with it: "Graded Quiz: …"); the meta is the course and the
    // time, 12 h, in the learner's zone.
    title:
      e.label && !e.title.toLowerCase().startsWith(e.label.toLowerCase()) ? `${e.title} (${e.label})` : e.title,
    meta: [e.course, e.time ? `${formatTime(e.time)} · ${YOUR_TIME}` : null].filter(Boolean).join(" · "),
    status: { label: dueBadgeLabel(e.date, e.time), color: "warning" },
    href: e.href,
  };
});

/* ── Pick up where you left off (LMS / Course Row · LMS / Platform / Resume row) ────── */

export interface DashboardResumeCourse {
  id: string;
  /** The course's slug: its page and its outline, where the module to resume is read. */
  slug: string;
  title: string;
  deliveryMode: DeliveryMode;
  progressPct: number;
  /** Where Resume goes (`resumeUrl`): the course's own player. */
  href: string;
  /** Where the title goes (`homeUrl`): the course's page. */
  homeHref: string;
}

const PROGRAM_COURSE = slugify("AI-Driven Content and Brand Communication");

const WRITTEN_RESUME: DashboardResumeCourse[] = [
  // Learner Home lists enrolments, which are courses: the row is the course the learner is in, not its program.
  { id: PROGRAM_COURSE, slug: PROGRAM_COURSE, title: "AI-Driven Content and Brand Communication", deliveryMode: "Flexible Learning", progressPct: 39, href: coursePlayerHref(PROGRAM_COURSE), homeHref: coursePageHref(PROGRAM_COURSE) },
  { id: "ux-research-design-thinking", slug: "ux-research-and-design-thinking", title: "UX Research and Design Thinking", deliveryMode: "Flexible Learning", progressPct: 5, href: coursePlayerHref("ux-research-and-design-thinking"), homeHref: coursePageHref("ux-research-and-design-thinking") },
  { id: "leadership-remote-teams", slug: "leadership-in-remote-teams", title: "Leadership in Remote Teams", deliveryMode: "Flexible Learning", progressPct: 52, href: coursePlayerHref("leadership-in-remote-teams"), homeHref: coursePageHref("leadership-in-remote-teams") },
];

/**
 * The rows under a synthetic persona (Nelson, 25 Oct 2026): the persona's courses in progress,
 * programs first as the catalogue orders them, at most three; as written with no persona.
 */
export function dashboardResumeFor(personaId: string | null): DashboardResumeCourse[] {
  if (!getPersona(personaId)) return WRITTEN_RESUME;
  return catalogFor(personaId)
    .filter((c) => c.percent !== null && c.percent > 0 && c.percent < 100)
    .slice(0, 3)
    .map((c) => ({
      id: c.slug,
      slug: c.slug,
      title: c.title,
      deliveryMode: "Flexible Learning" as const,
      progressPct: c.percent ?? 0,
      href: coursePlayerHref(c.slug),
      homeHref: coursePageHref(c.slug),
    }));
}

export const dashboardResume: DashboardResumeCourse[] = dashboardResumeFor(ACTIVE_PERSONA_ID);

/* ── Jump somewhere (LMS / Platform / Jump tile, 6382:3302) ─────────────────────────── */

export interface DashboardJumpTile {
  id: string;
  /** DS icon → lucide: message-chat-circle, award-01, user-01. */
  icon: LucideIcon;
  title: string;
  description: string;
  /** Set when the section has a page in the prototype; otherwise the tile shows a toast. */
  href?: string;
}

export const dashboardJump: DashboardJumpTile[] = [
  {
    id: "discussion",
    icon: MessagesSquare,
    title: "Discussion",
    description: `${discussionUnread} unread replies in your courses`,
    href: discussionHref(),
  },
  {
    id: "certificates",
    icon: Award,
    title: "My Certificates",
    description: `${certificatesInProgress.length} in progress · ${earnedCertificates.length} to download`,
    // The Certificates page (19 Oct 2026); it opened the Six Sigma certificate until then.
    href: "/platform/certificates",
  },
  { id: "profile", icon: User, title: "Profile", description: "Your details · Account settings", href: "/platform/profile" },
];
