import { Award, MessagesSquare, User, type LucideIcon } from "lucide-react";
import { discussionHref, discussionUnread } from "./discussion";
import type { BadgeColor } from "@/components/atoms/Badge";
import type { DeliveryMode } from "@/components/atoms/MetaBadges";
import { coursePageHref, coursePlayerHref, slugify } from "./hrefs";
import { SAMPLE_TODAY, YOUR_TIME, dueBadgeLabel, formatTime, parseDay, whenLabel } from "@/lib/sample-time";
import { calendarEvents, isDueThisWeek, isMissed } from "./calendar";
import { certificatesInProgress, earnedCertificates } from "./certificates";
import { CATALOG } from "./catalog";
import { PROGRAMS } from "./program";

/**
 * Mock data of the platform Dashboard (Figma handoff cards 01–03 of 6408:35150: desktop
 * 6408:72361, tablet 6408:72704, mobile 6418:127183, as they read on 8 Oct 2026).
 * Copy is verbatim from the Figma frames. Nothing here is read from an API yet.
 */

export const dashboardGreeting = { salutation: "Good morning," } as const;

/* ── Your learning at a glance (LMS/Platform/Dashboard/Today-at-a-glance) ───────────── */

export interface DashboardStat {
  label: string;
  value: string;
  detail: string;
  /** The phone's line uses shorter words, same facts. */
  shortLabel?: string;
  shortDetail?: string;
  /** The goal beside the figure, only when Open edX serves the fact behind it. */
  goal?: { label: string; spoken: string };
}

/**
 * Totals Open edX can serve (handoff map §37.4): the first three come from Learner Home in
 * one call; Programs needs `progress_details` once per program for "in progress".
 * The streak card and the "today" figures left the screens on 7 Oct: nothing returns them.
 * Since 20 Oct 2026 every figure is counted from the sample data (Nelson): every course the
 * learner is enrolled in (the single courses and the courses of the three programs), how many
 * are started and not complete, how many are complete, and the programs by state.
 *
 * Goals (Nelson, 21–22 Oct 2026, DS Today-at-a-glance v1.3): each figure on its own card with
 * a goal, only what Open edX already serves: the deadlines (Dates API, one call per course), the
 * enrolments (Learner Home) and the active program's courses (`progress_details`). No goal on
 * Certificates. The month arrows of PR 242 were taken out of the DS by Nelson on 22 Oct.
 */
const enrolled = CATALOG.length;
const coursesInProgress = CATALOG.filter((c) => c.percent !== null && c.percent > 0 && c.percent < 100).length;
const coursesCompleted = CATALOG.filter((c) => c.percent === 100).length;
const programPercents = PROGRAMS.map((p) => p.courses.map((c) => c.card.progressPct ?? 0));
const programsCompleted = programPercents.filter((ps) => ps.every((x) => x === 100)).length;
const programsInProgress = programPercents.filter((ps) => ps.some((x) => x > 0) && !ps.every((x) => x === 100)).length;

const activeIndex = programPercents.findIndex((ps) => ps.some((x) => x > 0) && !ps.every((x) => x === 100));
const activeProgram = activeIndex >= 0 ? PROGRAMS[activeIndex] : undefined;
const activeDone = activeIndex >= 0 ? programPercents[activeIndex].filter((x) => x === 100).length : 0;
const activeTotal = activeIndex >= 0 ? programPercents[activeIndex].length : 0;
const dueThisWeek = calendarEvents.filter(isDueThisWeek).length;
const pct = (a: number, b: number) => `${Math.round((a / b) * 100)}%`;

export const dashboardGlance: { title: string; stats: DashboardStat[] } = {
  title: "Your learning at a glance",
  stats: [
    {
      label: "Courses in progress",
      value: String(coursesInProgress),
      detail: `of ${enrolled} enrolled`,
      shortLabel: "In progress",
      shortDetail: `of ${enrolled} courses`,
      goal: { label: `${dueThisWeek} due this week`, spoken: `${dueThisWeek} deadlines in the next seven days` },
    },
    {
      label: "Programs",
      value: String(PROGRAMS.length),
      detail: `${programsInProgress} in progress · ${programsCompleted} completed`,
      shortDetail: `${programsInProgress} active · ${programsCompleted} done`,
      goal: activeProgram
        ? { label: `${activeDone} of ${activeTotal} courses`, spoken: `${activeProgram.title}: ${activeDone} of ${activeTotal} courses complete` }
        : undefined,
    },
    {
      label: "Courses completed",
      value: String(coursesCompleted),
      detail: `of ${enrolled} enrolled`,
      shortLabel: "Completed",
      shortDetail: `of ${enrolled} courses`,
      goal: { label: `${pct(coursesCompleted, enrolled)} of ${enrolled}`, spoken: `${pct(coursesCompleted, enrolled)} of your ${enrolled} enrolled courses complete` },
    },
    // Counted from the Certificates page (19 Oct 2026; it read 2 before the Data Analytics sample program).
    {
      label: "Certificates",
      value: String(earnedCertificates.length),
      detail: "ready to download",
      shortDetail: "to download",
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
  /** Today (and overdue) = the day in text/error; Upcoming = text/default. */
  urgency: "today" | "upcoming";
  title: string;
  meta: string;
  /** DS Badge Soft sm: Warning "Due tonight" / "Due tomorrow" / "Due Mon", Error "Overdue · 3 days". */
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
    status: { label: dueBadgeLabel(e.date, e.time), color: overdue ? "error" : "warning" },
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

export const dashboardResume: DashboardResumeCourse[] = [
  // Learner Home lists enrolments, which are courses: the row is the course the learner is in, not its program.
  { id: PROGRAM_COURSE, slug: PROGRAM_COURSE, title: "AI-Driven Content and Brand Communication", deliveryMode: "Flexible Learning", progressPct: 39, href: coursePlayerHref(PROGRAM_COURSE), homeHref: coursePageHref(PROGRAM_COURSE) },
  { id: "ux-research-design-thinking", slug: "ux-research-and-design-thinking", title: "UX Research and Design Thinking", deliveryMode: "Flexible Learning", progressPct: 5, href: coursePlayerHref("ux-research-and-design-thinking"), homeHref: coursePageHref("ux-research-and-design-thinking") },
  { id: "leadership-remote-teams", slug: "leadership-in-remote-teams", title: "Leadership in Remote Teams", deliveryMode: "Flexible Learning", progressPct: 52, href: coursePlayerHref("leadership-in-remote-teams"), homeHref: coursePageHref("leadership-in-remote-teams") },
];

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
    title: "Certificates",
    description: `${certificatesInProgress.length} in progress · ${earnedCertificates.length} to download`,
    // The Certificates page (19 Oct 2026); it opened the Six Sigma certificate until then.
    href: "/platform/certificates",
  },
  { id: "profile", icon: User, title: "Profile", description: "Your details · Account settings", href: "/platform/profile" },
];
