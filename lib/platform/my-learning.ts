import type { DeliveryMode, Difficulty, Provider } from "@/components/atoms/MetaBadges";
import type { TopicType } from "@/lib/types";

/**
 * Mock data of the platform My Learning page (Figma: Courses 6374:114591 / 6374:115077,
 * Programs 6374:115915 / 6374:116384, tablet 6397:17285 / 6397:18563, mobile 6400:29847 /
 * 6400:31480). Copy is verbatim from the Figma frames. Nothing here is read from an API yet.
 */

export type MyLearningTab = "programs" | "courses";
export type MyLearningView = "grid" | "list";

/** The tab and the view drawn in the default frame (Courses · Grid). */
export const MY_LEARNING_DEFAULT_TAB: MyLearningTab = "courses";
export const MY_LEARNING_DEFAULT_VIEW: MyLearningView = "grid";

/** The existing course player: every course card opens it. */
const COURSE_PLAYER_HREF = "/course/six-sigma/topic/m3-t1";

/* ── Header ─────────────────────────────────────────────────────────────────────────── */

export const myLearningHeading = { title: "Keep", emphasis: "going." } as const;

export interface MyLearningStat {
  label: string;
  value: string;
  detail: string;
}

/** Three `LMS / Platform / Stat`, Theme=Default. */
export const myLearningStats: MyLearningStat[] = [
  { label: "Daily goals completed", value: "4", detail: "courses · 1 program" },
  { label: "Items completed", value: "80", detail: "% · 4 of 5" },
  { label: "Minutes learned", value: "12", detail: "days · keep going" },
];

/* ── Toolbar ────────────────────────────────────────────────────────────────────────── */

/** Tab order as drawn: Programs first, Courses selected. */
export const myLearningTabs: { id: MyLearningTab; label: string }[] = [
  { id: "programs", label: "Programs" },
  { id: "courses", label: "Courses" },
];

export const myLearningSearch = { placeholder: "Search my learning" } as const;

/* ── Courses (LMS / Course Card, 6375:15009) ────────────────────────────────────────── */

export interface MyLearningCourse {
  id: string;
  title: string;
  initials: string;
  provider: Provider;
  difficulty: Difficulty;
  /** The DS `LMS / Delivery Mode Badge` variant on the card. */
  delivery: DeliveryMode;
  /** Label override drawn on the instance, when it differs from the variant's own label. */
  deliveryLabel?: string;
  /** 0–100, or null when the course has not been started. */
  progressPct: number | null;
  /** Right of the progress row: time left, total length or start date. */
  progressMeta: string;
  upNext: { title: string; type: TopicType };
  cta: "Resume" | "Start";
  href: string;
}

export const myLearningCourses: MyLearningCourse[] = [
  {
    id: "ux-research-and-design-thinking",
    title: "UX Research and Design Thinking",
    initials: "UX",
    provider: "SkillUp",
    difficulty: "Beginner",
    delivery: "Flexible Learning",
    deliveryLabel: "Flexible + Live Sessions",
    progressPct: 5,
    progressMeta: "9 min left",
    upNext: { title: "Discovery interview techniques", type: "Video" },
    cta: "Resume",
    href: COURSE_PLAYER_HREF,
  },
  {
    id: "project-management-with-ai-tools",
    title: "Project Management with AI Tools",
    initials: "PM",
    provider: "SkillUp",
    difficulty: "Intermediate",
    delivery: "Flexible Learning",
    deliveryLabel: "Flexible + Live Sessions",
    progressPct: 35,
    progressMeta: "18 min left",
    upNext: { title: "AI-assisted sprint planning", type: "Video" },
    cta: "Resume",
    href: COURSE_PLAYER_HREF,
  },
  {
    id: "leadership-in-remote-teams",
    title: "Leadership in Remote Teams",
    initials: "LR",
    provider: "SkillUp",
    difficulty: "Intermediate",
    delivery: "Flexible Learning",
    progressPct: 52,
    progressMeta: "24 min left",
    upNext: { title: "Async standups", type: "Video" },
    cta: "Resume",
    href: COURSE_PLAYER_HREF,
  },
  {
    id: "intro-to-product-analytics",
    title: "Intro to Product Analytics",
    initials: "PA",
    provider: "SkillUp",
    difficulty: "Beginner",
    delivery: "Flexible Learning",
    progressPct: null,
    progressMeta: "8 hours total",
    upNext: { title: "Product metrics basics", type: "Video" },
    cta: "Start",
    href: COURSE_PLAYER_HREF,
  },
  {
    id: "business-analytics-with-python",
    title: "Business Analytics with Python",
    initials: "BA",
    provider: "SkillUp",
    difficulty: "Advanced",
    delivery: "Live Sessions",
    progressPct: null,
    progressMeta: "Starts Apr 28",
    upNext: { title: "Python environment setup", type: "Reading" },
    cta: "Start",
    href: COURSE_PLAYER_HREF,
  },
];

/* ── Browse tile (LMS / Platform / Browse tile, 6388:116426) ────────────────────────── */

export const myLearningBrowseTile = { title: "Browse catalog", subtitle: "Add a new course" } as const;

/* ── Programs (LMS / Platform / Program card, 6388:3858) ────────────────────────────── */

export interface MyLearningProgram {
  id: string;
  title: string;
  eyebrow: string;
  delivery: DeliveryMode;
  /** Badge v2 Gray next to the delivery badge. */
  cohort: string;
  /**
   * The Grid layout of this card is drawn with "Show cohort" off while its List layout shows
   * the cohort. Kept as drawn; set to true to show the cohort in both layouts.
   */
  cohortInGrid: boolean;
  /** Week / Courses / Lessons, as drawn in the hero. */
  stats: [string, string, string];
  /** 0–100. */
  progressPct: number;
  /** State=In progress: the next module, with a primary "Continue". */
  upNext?: string;
  /** State=Not started: the Badge v2 Gray status, with a secondary "Details". */
  status?: string;
  cta: "Continue" | "Details";
  /** No href: the program has no page in the prototype. */
  href?: string;
}

export const myLearningPrograms: MyLearningProgram[] = [
  {
    id: "ai-driven-digital-marketing",
    title: "AI-Driven Digital Marketing Certificate",
    eyebrow: "Program · 6 courses + capstone",
    delivery: "Flexible + Live",
    cohort: "Cohort Apr 2026",
    cohortInGrid: true,
    stats: ["Week 4/32", "Courses 1/7", "Lessons 10/64"],
    progressPct: 27,
    upNext: "Module 2 · SEO & Organic Search",
    cta: "Continue",
    href: "/platform/program/ai-driven-digital-marketing",
  },
  {
    id: "cybersecurity-fundamentals",
    title: "Cybersecurity Fundamentals Certificate",
    eyebrow: "Program · 6 courses + capstone",
    delivery: "Flexible + Live",
    cohort: "Cohort May 2026",
    cohortInGrid: false,
    stats: ["Week 0/32", "Courses 0/5", "Lessons 0/64"],
    progressPct: 0,
    status: "Not started · Starts May 12",
    cta: "Details",
  },
];

export const myLearningProgramProgressLabel = "of program complete";
export const myLearningProgramUpNextLabel = "Up next";
