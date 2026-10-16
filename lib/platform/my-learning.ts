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

/* The three header stats left the page on 13 Oct 2026: the Dashboard already shows them. */

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
    progressMeta: "Starts Oct 14",
    upNext: { title: "Python environment setup", type: "Reading" },
    cta: "Start",
  },
];

/**
 * Every course opens its own page (the title: `homeUrl`) and its own player (the button:
 * `resumeUrl`); the id is the course's slug. A finished course is reviewed from its page.
 * Single courses only: a course of a program is reached through its program (decision 025,
 * 14 Oct 2026; checked in my-learning.test.ts).
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
  delivery: DeliveryMode;
  difficulty: Difficulty;
  /** Partner logos, as on the course and program headers. Sample: no field returns them. */
  partners: { name: string; logoSrc: string }[];
  /** "N of M courses complete": `progress_details`, completed ÷ all courses. */
  courses: string;
  /** Number of courses in the program (programs API, length of `courses`). DS v1.7: a hero
      tag in every state, and the right end of the progress row when not started or completed. */
  courseCount: number;
  /** DS v1.8 thumb: the program's card image (programs API); the initials show without it. */
  imageSrc?: string;
  initials: string;
  /** DS v1.8, In progress: the earliest upcoming due date in the course in progress (dates API). */
  nextDue?: string;
  /** DS v1.8 details line, each part left out when there is no data: the latest last-accessed
      date across the courses, the hours left (or in total, not started; the sum of course effort),
      and the end of access (enrollment end). */
  lastStudied?: string;
  hours?: string;
  accessUntil?: string;
  /** 0–100: the same ratio. */
  progressPct: number;
  /** State=In progress: the first course in progress, with a Primary "Resume". */
  upNext?: string;
  /** State=Not started: the Badge Gray start date ("Starts Oct 5"), with a Secondary "Start". */
  status?: string;
  /** State=Completed: the date the program certificate was issued (Certificates API). */
  certificateDate?: string;
  cta: "Resume" | "Start" | "View Certificate";
  /** The program page: what the card and its title open. No href: no page in the prototype. */
  href?: string;
  /** What the button opens when it is not the program page: the player of the course in progress. */
  actionHref?: string;
}

export const myLearningPrograms: MyLearningProgram[] = [
  {
    id: "ai-driven-digital-marketing",
    // The program's own title, as its page shows it.
    title: "Certificate Program in AI Augmented Digital Marketing",
    delivery: "Flexible Learning",
    difficulty: "Beginner",
    partners: [
      { name: "Microsoft", logoSrc: "/platform/partner-microsoft-dark.svg" },
      { name: "IBM", logoSrc: "/platform/partner-ibm-dark.svg" },
    ],
    courses: "1 of 7 courses complete",
    courseCount: 7,
    imageSrc: `${COVERS}/program-ai-digital-marketing.jpg`,
    initials: "AD",
    nextDue: "Due Fri 17 Oct",
    lastStudied: "Last studied 3 days ago",
    hours: "18 h left",
    accessUntil: "Access until 30 Jun 2027",
    progressPct: 14,
    upNext: "Course 2 · AI-Driven Content and Brand Communication",
    cta: "Resume",
    href: "/platform/program/ai-driven-digital-marketing",
    actionHref: coursePlayerHref("ai-driven-content-and-brand-communication"),
  },
  {
    id: "cybersecurity-fundamentals",
    title: "Cybersecurity Fundamentals Certificate",
    delivery: "Flexible Learning",
    difficulty: "Beginner",
    partners: [],
    courses: "0 of 5 courses complete",
    courseCount: 5,
    initials: "CF",
    // No picture was made for this program: a placeholder cover, the same as the Figma screens (16 Oct 2026).
    imageSrc: `${COVERS}/intro-to-product-analytics.jpg`,
    hours: "42 h total",
    accessUntil: "Access until 31 Mar 2027",
    progressPct: 0,
    status: "Starts Oct 5",
    cta: "Start",
    href: "/platform/program/cybersecurity-fundamentals",
  },
  {
    // The completed program (DS `State=Completed`, 13 Oct 2026). Its page since 16 Oct 2026
    // (lib/programs/data-analytics-foundations); View Certificate opens the program certificate.
    id: "data-analytics-foundations",
    title: "Data Analytics Foundations Certificate",
    delivery: "Flexible Learning",
    difficulty: "Beginner",
    partners: [
      { name: "Microsoft", logoSrc: "/platform/partner-microsoft-dark.svg" },
      { name: "IBM", logoSrc: "/platform/partner-ibm-dark.svg" },
    ],
    courses: "5 of 5 courses complete",
    courseCount: 5,
    initials: "DA",
    // A placeholder cover, the same as the Figma screens (16 Oct 2026).
    imageSrc: `${COVERS}/business-analytics-with-python.jpg`,
    progressPct: 100,
    certificateDate: "30 Sep 2026",
    cta: "View Certificate",
    href: "/platform/program/data-analytics-foundations",
    actionHref: "/platform/certificate/program/data-analytics-foundations",
  },
];

/* ── Status filter (13 Oct 2026) ────────────────────────────────────────────────────── */

/**
 * The state of a course or a program, as Open edX gives it: a course from `hasStarted` and
 * `certificate.isEarned`, a program from `progress_details`. Each tab is one list in this
 * order, and a filter under the toolbar keeps the cards of one state (Nelson, 13 Oct 2026;
 * it replaced the three sections tried the same day).
 */
export type MyLearningState = "in-progress" | "not-started" | "completed";
export type MyLearningStatusFilter = "all" | MyLearningState;

export const myLearningStatusOrder: MyLearningState[] = ["in-progress", "not-started", "completed"];

export const myLearningStatusFilters: { id: MyLearningStatusFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "in-progress", label: "In progress" },
  { id: "not-started", label: "Not started" },
  { id: "completed", label: "Completed" },
];

export const myLearningStateOf = (progressPct: number | null): MyLearningState =>
  progressPct === null || progressPct <= 0 ? "not-started" : progressPct >= 100 ? "completed" : "in-progress";

export const myLearningProgramUpNextLabel = "Up next";
export const myLearningProgramCompletedLabel = "Program completed";
/** DS `State=Not started`: the words where the courses line is. */
export const myLearningProgramNotStartedLabel = "Not started";
export const myLearningProgramCertificateLabel = "Certificate issued";
