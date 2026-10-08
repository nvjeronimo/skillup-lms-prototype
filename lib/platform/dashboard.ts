import { Award, MessagesSquare, User, type LucideIcon } from "lucide-react";
import type { BadgeColor } from "@/components/atoms/Badge";
import type { DeliveryMode } from "@/components/atoms/MetaBadges";

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
 */
export const dashboardGlance: { title: string; stats: DashboardStat[] } = {
  title: "Your learning at a glance",
  stats: [
    { label: "Courses in progress", value: "3", detail: "of 5 enrolled" },
    { label: "Courses completed", value: "1", detail: "of 5 enrolled" },
    { label: "Certificates", value: "1", detail: "ready to download" },
    { label: "Programs", value: "2", detail: "1 in progress" },
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
  /** DS Badge v2 Soft sm, Warning: "Due …". */
  status: { label: string; color: BadgeColor };
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
  },
  {
    id: "assignment-02-audience-segmentation",
    day: "26",
    when: "Fri",
    urgency: "upcoming",
    title: "Assignment 02 · Audience segmentation",
    meta: "AI-Driven Digital Marketing · Homework",
    status: { label: "Due Fri", color: "warning" },
  },
];

/* ── Pick up where you left off (LMS / Course Row · LMS / Platform / Resume row) ────── */

export interface DashboardResumeCourse {
  id: string;
  title: string;
  deliveryMode: DeliveryMode;
  progressPct: number;
  /** Where Resume goes. Every row opens the one course the prototype has. */
  href: string;
}

const COURSE_PLAYER = "/course/six-sigma/topic/m3-t1";

export const dashboardResume: DashboardResumeCourse[] = [
  { id: "ai-driven-digital-marketing", title: "AI-Driven Digital Marketing", deliveryMode: "Flexible Learning", progressPct: 38, href: COURSE_PLAYER },
  { id: "ux-research-design-thinking", title: "UX Research and Design Thinking", deliveryMode: "Flexible Learning", progressPct: 5, href: COURSE_PLAYER },
  { id: "leadership-remote-teams", title: "Leadership in Remote Teams", deliveryMode: "Flexible Learning", progressPct: 52, href: COURSE_PLAYER },
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
  { id: "discussion", icon: MessagesSquare, title: "Discussion", description: "12 unread updates in your courses" },
  {
    id: "certificates",
    icon: Award,
    title: "Certificates",
    description: "3 in progress · 1 to download",
    href: "/course/six-sigma/certificate",
  },
  { id: "profile", icon: User, title: "Profile", description: "Your details · Account settings" },
];
