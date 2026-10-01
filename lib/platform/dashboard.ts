import { Award, Calendar, MessagesSquare, User, type LucideIcon } from "lucide-react";
import type { BadgeColor } from "@/components/atoms/Badge";
import type { DeliveryMode } from "@/components/atoms/MetaBadges";

/**
 * Mock data of the platform Dashboard (Figma 6374:16006 / 6397:16635 / 6400:29528).
 * Copy is verbatim from the Figma frames. Nothing here is read from an API yet.
 */

export const dashboardGreeting = { salutation: "Good morning," } as const;

/* ── Today at a glance (LMS / Platform / Glance card, 6384:17651) ───────────────────── */

export interface DashboardStat {
  label: string;
  value: string;
  detail: string;
}

export const dashboardGlance: { title: string; stats: DashboardStat[] } = {
  title: "Today at a glance",
  stats: [
    { label: "Today's lessons", value: "3", detail: "2 done · 1 in progress" },
    { label: "Live attendance", value: "80%", detail: "4 of 5 sessions" },
    { label: "Week Time learned", value: "1h 24m", detail: "Goal · 2h" },
    { label: "XP this week", value: "+420", detail: "Top 8% in cohort" },
  ],
};

/* ── Streak (LMS / Platform / Streak card, 6384:17785) ──────────────────────────────── */

/** `LMS / Course Detail / Week day` states used on the Dashboard. */
export type WeekDayState = "done" | "today-done" | "upcoming";

export interface DashboardWeekDay {
  /** Two-letter label shown in the strip. */
  day: string;
  /** Full name, for assistive tech. */
  name: string;
  state: WeekDayState;
}

export const dashboardStreak: {
  count: number;
  /** Two lines, as drawn. */
  label: [string, string];
  week: DashboardWeekDay[];
  message: { before: string; highlight: string; after: string };
} = {
  count: 12,
  label: ["Day streak", "keep going"],
  week: [
    { day: "Su", name: "Sunday", state: "done" },
    { day: "Mo", name: "Monday", state: "done" },
    { day: "Tu", name: "Tuesday", state: "done" },
    { day: "We", name: "Wednesday", state: "today-done" },
    { day: "Th", name: "Thursday", state: "upcoming" },
    { day: "Fr", name: "Friday", state: "upcoming" },
    { day: "Sa", name: "Saturday", state: "upcoming" },
  ],
  message: { before: "You extended your streak — ", highlight: "13 hours", after: " left in the day. Nice work!" },
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
  /** DS Badge v2 Soft sm: Error + dot for Live, Warning for Due …. */
  status: { label: string; color: BadgeColor; dot?: boolean };
}

export const dashboardDue: DashboardDueItem[] = [
  {
    id: "live-qa-agile-coaching",
    day: "24",
    when: "Today",
    urgency: "today",
    title: "Live Q&A: Agile Coaching with David Chen",
    meta: "Module 2 · 4:00 PM · 30 min · Attendance required",
    status: { label: "Live", color: "error", dot: true },
  },
  {
    id: "peer-review-persona-research",
    day: "24",
    when: "Tonight",
    urgency: "today",
    title: "Peer review · Persona research draft",
    meta: "UX Research and Design Thinking · 11:59 PM",
    status: { label: "Due 11:59", color: "warning" },
  },
  {
    id: "assignment-02-audience-segmentation",
    day: "26",
    when: "Fri",
    urgency: "upcoming",
    title: "Submit assignment 02 · Audience segmentation",
    meta: "AI-Driven Digital Marketing · Module 2 · Quiz + 350-word write-up",
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
  { id: "ai-driven-digital-marketing", title: "AI-Driven Digital Marketing", deliveryMode: "Flexible + Live", progressPct: 38, href: COURSE_PLAYER },
  { id: "ux-research-design-thinking", title: "UX Research and Design Thinking", deliveryMode: "Flexible + Live", progressPct: 5, href: COURSE_PLAYER },
  { id: "leadership-remote-teams", title: "Leadership in Remote Teams", deliveryMode: "Flexible Learning", progressPct: 52, href: COURSE_PLAYER },
];

/* ── Jump somewhere (LMS / Platform / Jump tile, 6382:3302) ─────────────────────────── */

export interface DashboardJumpTile {
  id: string;
  /** DS icon → lucide: message-chat-circle, calendar, award-01, user-01. */
  icon: LucideIcon;
  title: string;
  description: string;
  /** Set when the section has a page in the prototype; otherwise the tile shows a toast. */
  href?: string;
}

export const dashboardJump: DashboardJumpTile[] = [
  { id: "discussion", icon: MessagesSquare, title: "Discussion", description: "12 new replies · 2 mentions" },
  { id: "book-a-mentor", icon: Calendar, title: "Book a mentor", description: "Mara has Thursday open" },
  {
    id: "certificates",
    icon: Award,
    title: "Certificates",
    description: "2 in progress · 1 to download",
    href: "/course/six-sigma/certificate",
  },
  { id: "profile", icon: User, title: "Profile", description: "Skills · Settings · Sharing" },
];
