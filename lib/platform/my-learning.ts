import type { DeliveryMode, Difficulty, Provider } from "@/components/atoms/MetaBadges";
import type { TopicType } from "@/lib/types";
import { coursePageHref, coursePlayerHref } from "./hrefs";

/**
 * Mock data of the platform My Learning page (Figma handoff cards 04–11 of 6408:35150, as
 * they read on 8 Oct 2026: Courses 6408:73284 grid / 6408:73888 list / 6408:74498 tablet /
 * 6408:75046 mobile; Programs 6408:75613 / 6408:75885 / 6408:76167 / 6408:76383).
 * Copy is verbatim from the Figma frames. Nothing here is read from an API yet; the values
 * are the ones Open edX can serve (handoff map §37.4).
 */

export type MyLearningTab = "programs" | "courses";
export type MyLearningView = "grid" | "list";

/** The tab and the view drawn in the default frame (Courses · Grid). */
export const MY_LEARNING_DEFAULT_TAB: MyLearningTab = "courses";
export const MY_LEARNING_DEFAULT_VIEW: MyLearningView = "grid";


/* ── Header ─────────────────────────────────────────────────────────────────────────── */

export const myLearningHeading = { title: "Keep", emphasis: "going." } as const;

export interface MyLearningStat {
  label: string;
  value: string;
  detail: string;
}

/** Three DS `Stat`, Theme=Default: totals from Learner Home, the same as the Dashboard glance card. */
export const myLearningStats: MyLearningStat[] = [
  { label: "In progress", value: "3", detail: "courses" },
  { label: "Completed", value: "1", detail: "course" },
  { label: "Certificates", value: "1", detail: "earned" },
];

/* ── Toolbar ────────────────────────────────────────────────────────────────────────── */

/** Tab order as drawn: Programs first, Courses selected. */
export const myLearningTabs: { id: MyLearningTab; label: string }[] = [
  { id: "programs", label: "Programs" },
  { id: "courses", label: "Courses" },
];

export const myLearningSearch = { placeholder: "Search my learning" } as const;

/* ── Courses (DS `LMS / Course Card`) ───────────────────────────────────────────────── */

/**
 * What one DS `LMS / Course Card` shows. Shared by My Learning and by the course rows of the
 * Program page (`lib/platform/program.ts`).
 */
export interface MyLearningCourse {
  id: string;
  title: string;
  initials: string;
  /**
   * The course's own image (`course_image`; `bannerImgSrc` in Learner Home), shown over the
   * initials (DS `Show image`). The files under /platform/covers are the placeholder
   * pictures of the Figma screens. Without it, or if it fails to load, the initials show.
   */
  imageSrc?: string;
  provider: Provider;
  difficulty: Difficulty;
  /** Open edX `pacing` gives one value today: Flexible Learning. */
  delivery: DeliveryMode;
  /** 0–100; null when the course has not been started. 100 reads "Complete". */
  progressPct: number | null;
  /** Right of the progress row: the course's total effort (`effort`), or its start date. */
  progressMeta: string;
  /** The next unit, or the certificate line once the course is complete. */
  upNext: { title: string; type: TopicType } | { certificate: string };
  cta: "Resume" | "Start" | "Review";
  /** Where the action goes. Without it the course has no page in the prototype and the card calls `onAction`. */
  href?: string;
  /** Where the title goes: the course's Course Detail page. */
  detailHref?: string;
}

const COVERS = "/platform/covers";

const COURSES: MyLearningCourse[] = [
  {
    id: "ux-research-and-design-thinking",
    title: "UX Research and Design Thinking",
    initials: "UX",
    imageSrc: `${COVERS}/ux-research-and-design-thinking.jpg`,
    provider: "SkillUp",
    difficulty: "Beginner",
    delivery: "Flexible Learning",
    progressPct: 5,
    progressMeta: "10 hours total",
    upNext: { title: "Discovery interview techniques", type: "Video" },
    cta: "Resume",
  },
  {
    id: "project-management-with-ai-tools",
    title: "Project Management with AI Tools",
    initials: "PM",
    imageSrc: `${COVERS}/project-management-with-ai-tools.jpg`,
    provider: "SkillUp",
    difficulty: "Intermediate",
    delivery: "Flexible Learning",
    progressPct: 35,
    progressMeta: "12 hours total",
    upNext: { title: "AI-assisted sprint planning", type: "Video" },
    cta: "Resume",
  },
  {
    id: "leadership-in-remote-teams",
    title: "Leadership in Remote Teams",
    initials: "LR",
    imageSrc: `${COVERS}/leadership-in-remote-teams.jpg`,
    provider: "SkillUp",
    difficulty: "Intermediate",
    delivery: "Flexible Learning",
    progressPct: 52,
    progressMeta: "6 hours total",
    upNext: { title: "Async standups", type: "Video" },
    cta: "Resume",
  },
  {
    // The completed course: full bar, the certificate line, Review.
    id: "intro-to-product-analytics",
    title: "Intro to Product Analytics",
    initials: "PA",
    imageSrc: `${COVERS}/intro-to-product-analytics.jpg`,
    provider: "SkillUp",
    difficulty: "Beginner",
    delivery: "Flexible Learning",
    progressPct: 100,
    progressMeta: "8 hours total",
    upNext: { certificate: "Issued 12 Sep 2026" },
    cta: "Review",
  },
  {
    id: "business-analytics-with-python",
    title: "Business Analytics with Python",
    initials: "BA",
    imageSrc: `${COVERS}/business-analytics-with-python.jpg`,
    provider: "SkillUp",
    difficulty: "Advanced",
    delivery: "Flexible Learning",
    progressPct: null,
    progressMeta: "Starts Apr 28",
    upNext: { title: "Python environment setup", type: "Reading" },
    cta: "Start",
  },
];

/**
 * Every course opens its own page (the title: `homeUrl`) and its own player (the button:
 * `resumeUrl`); the id is the course's slug. A finished course is reviewed from its page.
 */
export const myLearningCourses: MyLearningCourse[] = COURSES.map((course) => ({
  ...course,
  href: course.cta === "Review" ? coursePageHref(course.id) : coursePlayerHref(course.id),
  detailHref: coursePageHref(course.id),
}));

/* ── Browse tile (LMS / Platform / Browse tile, 6388:116426) ────────────────────────── */

export const myLearningBrowseTile = { title: "Browse catalog", subtitle: "Add a new course" } as const;

/* ── Programs (DS `LMS/Platform/My-Learning/Program-Card`) ──────────────────────────── */

export interface MyLearningProgram {
  id: string;
  title: string;
  /** "Program · N courses": `relatedPrograms.numberOfCourses`. */
  eyebrow: string;
  delivery: DeliveryMode;
  /** "N of M courses complete": `progress_details`, completed ÷ all courses. */
  courses: string;
  /** 0–100: the same ratio. */
  progressPct: number;
  /** State=In progress: the first course in progress, with a primary "Continue". */
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
    // The program's own title, as its page shows it.
    title: "Certificate Program in AI Augmented Digital Marketing",
    eyebrow: "Program · 7 courses",
    delivery: "Flexible Learning",
    courses: "1 of 7 courses complete",
    progressPct: 14,
    upNext: "Course 2 · AI-Driven Content and Brand Communication",
    cta: "Continue",
    href: "/platform/program/ai-driven-digital-marketing",
  },
  {
    id: "cybersecurity-fundamentals",
    title: "Cybersecurity Fundamentals Certificate",
    eyebrow: "Program · 5 courses",
    delivery: "Flexible Learning",
    courses: "0 of 5 courses complete",
    progressPct: 0,
    status: "Not started · Starts May 12",
    cta: "Details",
  },
];

export const myLearningProgramProgressLabel = "of program complete";
export const myLearningProgramUpNextLabel = "Up next";
