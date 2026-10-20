import { Award, MessagesSquare, User, type LucideIcon } from "lucide-react";
import { discussionHref, discussionUnread } from "./discussion";
import type { BadgeColor } from "@/components/atoms/Badge";
import type { DeliveryMode } from "@/components/atoms/MetaBadges";
import { coursePageHref, coursePlayerHref, slugify } from "./hrefs";
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
}

/**
 * Totals Open edX can serve (handoff map §37.4): the first three come from Learner Home in
 * one call; Programs needs `progress_details` once per program for "in progress".
 * The streak card and the "today" figures left the screens on 7 Oct: nothing returns them.
 * Since 20 Oct 2026 every figure is counted from the sample data (Nelson): every course the
 * learner is enrolled in (the single courses and the courses of the three programs), how many
 * are started and not complete, how many are complete, and the programs by state.
 */
const enrolled = CATALOG.length;
const coursesInProgress = CATALOG.filter((c) => c.percent !== null && c.percent > 0 && c.percent < 100).length;
const coursesCompleted = CATALOG.filter((c) => c.percent === 100).length;
const programPercents = PROGRAMS.map((p) => p.courses.map((c) => c.card.progressPct ?? 0));
const programsCompleted = programPercents.filter((ps) => ps.every((x) => x === 100)).length;
const programsInProgress = programPercents.filter((ps) => ps.some((x) => x > 0) && !ps.every((x) => x === 100)).length;

export const dashboardGlance: { title: string; stats: DashboardStat[] } = {
  title: "Your learning at a glance",
  stats: [
    { label: "Courses in progress", value: String(coursesInProgress), detail: `of ${enrolled} enrolled` },
    { label: "Courses completed", value: String(coursesCompleted), detail: `of ${enrolled} enrolled` },
    // Counted from the Certificates page (19 Oct 2026; it read 2 before the Data Analytics sample program).
    { label: "Certificates", value: String(earnedCertificates.length), detail: "ready to download" },
    {
      label: "Programs",
      value: String(PROGRAMS.length),
      detail: `${programsInProgress} in progress · ${programsCompleted} completed`,
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
  /** Today = the day in text/error; Upcoming = text/default. */
  urgency: "today" | "upcoming";
  title: string;
  meta: string;
  /** DS Badge Soft sm, Warning: "Due …". */
  status: { label: string; color: BadgeColor };
  /** The assignment in the player (the Dates API gives each one its `link`). */
  href: string;
}

/** Assignment deadlines only, titled as the Dates API titles them (one call per enrolled course). */
export const dashboardDue: DashboardDueItem[] = [
  {
    id: "peer-review-persona-research",
    day: "24",
    when: "Tonight",
    urgency: "today",
    title: "Persona research draft (Peer Assessment)",
    meta: "UX Research and Design Thinking · 11:59 PM",
    status: { label: "Due 11:59", color: "warning" },
    // "Persona research draft", the peer assessment that closes Module 1 of the course.
    href: coursePlayerHref("ux-research-and-design-thinking", "uxr-m1-t10"),
  },
  {
    id: "assignment-02-audience-segmentation",
    day: "26",
    // 26 October 2026 is a Monday (the sample week: today is Saturday the 24th).
    when: "Mon",
    urgency: "upcoming",
    title: "Assignment 02 · Audience segmentation",
    meta: "AI-Driven Content and Brand Communication · Homework",
    status: { label: "Due Mon", color: "warning" },
    // "Assignment 02 · Audience segmentation", the homework that closes Module 2 of the course.
    href: coursePlayerHref(slugify("AI-Driven Content and Brand Communication"), "acb-m2-t10"),
  },
  {
    // The third deadline of the week, as the Calendar lists it (17 Oct 2026).
    id: "lrt-quiz-module-3",
    day: "28",
    when: "Wed",
    urgency: "upcoming",
    title: "Module 3 quiz · Meetings and rituals",
    meta: "Leadership in Remote Teams · Graded quiz",
    status: { label: "Due Wed", color: "warning" },
    href: coursePlayerHref("leadership-in-remote-teams"),
  },
];

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
  { id: PROGRAM_COURSE, slug: PROGRAM_COURSE, title: "AI-Driven Content and Brand Communication", deliveryMode: "Flexible Learning", progressPct: 40, href: coursePlayerHref(PROGRAM_COURSE), homeHref: coursePageHref(PROGRAM_COURSE) },
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
  { id: "profile", icon: User, title: "Profile", description: "Your details · Account settings" },
];
