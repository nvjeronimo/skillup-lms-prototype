import type { DeliveryMode, Difficulty, Provider } from "@/components/atoms/MetaBadges";
import type { TopicType } from "@/lib/types";
import { COURSES as OWN_COURSES } from "@/lib/courses";
import { PROGRAMS } from "@/lib/programs";
import { SAMPLE_TODAY, formatDate, formatDay, formatDayMonth } from "@/lib/sample-time";
import { coursePageHref, coursePlayerHref, programCertificatePageHref } from "./hrefs";
import { ACTIVE_PERSONA, ACTIVE_PERSONA_ID } from "@/lib/persona-active";
import { overlayCard } from "@/lib/persona-overlay";
import { getPersona } from "@/lib/personas";

/**
 * Mock data of the platform My Learning page (Figma handoff cards 04–11 of 6408:35150, as
 * they read on 8 Oct 2026: Courses 6408:73284 grid / 6408:73888 list / 6408:74498 tablet /
 * 6408:75046 mobile; Programs 6408:75613 / 6408:75885 / 6408:76167 / 6408:76383).
 * Copy is verbatim from the Figma frames. Nothing here is read from an API yet; the values
 * are the ones Open edX can serve (handoff map §37.4).
 */

export type MyLearningTab = "programs" | "courses";
/** "table": Harbor only (25 Oct 2026), the DreamHost panel's list view. */
export type MyLearningView = "grid" | "list" | "table";

/** The tab drawn in the default frame (Courses). */
export const MY_LEARNING_DEFAULT_TAB: MyLearningTab = "courses";
/**
 * The tab My Learning opens on (Nelson, 16 Oct 2026): the one the learner last opened; the first
 * time, Programs when they are enrolled in one, otherwise Courses. A `?tab=` in the link wins.
 */
export const MY_LEARNING_TAB_KEY = "sk-my-learning-tab";
export function myLearningFirstTab(programCount: number): MyLearningTab {
  return programCount > 0 ? "programs" : MY_LEARNING_DEFAULT_TAB;
}
/**
 * The view drawn in the default frame (Grid). A synthetic persona that asks for density (P04,
 * Nelson 25 Oct 2026) opens on the list; the browser only, where My Learning renders under one.
 */
export const MY_LEARNING_DEFAULT_VIEW: MyLearningView = ACTIVE_PERSONA?.conditions.listView ? "list" : "grid";


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
  /**
   * More than one provider or partner (DS Course-Card 1.10, 16 Oct 2026: a second badge, as on a
   * program). When set it replaces `provider` on the card, in this order. Sample data.
   */
  partners?: Provider[];
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

/* ── Dates and hours, read from the course and program data (UX audit, 20 Oct 2026) ──── */

/** The page of a course with content of its own (lib/courses). */
const ownPage = (slug: string) => OWN_COURSES.find((c) => c.page.slug === slug)?.page;

/** The day a course's suggested schedule starts, from its Dates tab. */
const courseStart = (slug: string) => {
  const page = ownPage(slug);
  const rows = page ? [...page.datesTab.past, ...page.datesTab.upcoming] : [];
  return rows.find((r) => r.id === "course-starts" || r.id === "suggested-start")?.iso.slice(0, 10) ?? SAMPLE_TODAY;
};

/** A start date: "Starts Fri 13 Nov" while it is to come, "Started 5 Oct" once it has passed. */
const startLabel = (iso: string) => (iso > SAMPLE_TODAY ? `Starts ${formatDay(iso)}` : `Started ${formatDayMonth(iso)}`);

/** The first deadline still to come in a course (its Dates tab), as "Due Mon 26 Oct". */
function nextDueOf(slug: string): string | undefined {
  const row = ownPage(slug)?.datesTab.upcoming.find(
    (r) => r.badges[0]?.label === "DUE DATE" && r.state !== "complete" && r.iso.slice(0, 10) >= SAMPLE_TODAY,
  );
  return row ? `Due ${formatDay(row.iso.slice(0, 10))}` : undefined;
}

/** "~ 8h 35m left" → 8.58; "13 hours total" → 13. */
function hoursIn(text: string): number {
  const m = /(\d+)\s*h(?:ours?)?(?:\s*(\d+)\s*m)?/.exec(text);
  return m ? Number(m[1]) + Number(m[2] ?? 0) / 60 : 0;
}

/**
 * The hours of a program (DS v1.8 details line), the sum over its courses: nothing for a course
 * completed, the time left on the page of a course in progress, the whole effort of a course not
 * started. A program not started yet shows its total.
 */
function programHours(slug: string): string | undefined {
  const program = PROGRAMS.find((p) => p.slug === slug);
  if (!program) return undefined;
  let total = 0;
  let left = 0;
  for (const c of program.courses) {
    const hours = hoursIn(c.card.progressMeta);
    const pct = c.card.progressPct ?? 0;
    total += hours;
    if (pct >= 100) continue;
    const timeLeft = ownPage(c.slug)?.progress.timeLeft;
    left += pct > 0 && timeLeft ? hoursIn(timeLeft) : hours;
  }
  const started = program.courses.some((c) => (c.card.progressPct ?? 0) > 0);
  return started ? `${Math.round(left)} h left` : `${Math.round(total)} h total`;
}

/** The end of access of a program: the "ends" date of its page, which every course's "Course ends" repeats. */
function accessUntilOf(slug: string): string | undefined {
  const iso = PROGRAMS.find((p) => p.slug === slug)?.dates.find((d) => d.id === "ends")?.iso;
  return iso ? `Access until ${formatDate(iso)}` : undefined;
}

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
    // Sample of a course with two partners (DS Course-Card 1.10).
    partners: ["SkillUp", "IBM"],
    difficulty: "Advanced",
    delivery: "Flexible Learning",
    progressPct: null,
    progressMeta: startLabel(courseStart("business-analytics-with-python")),
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
const WRITTEN_COURSES: MyLearningCourse[] = COURSES.map((course) => ({
  ...course,
  href: course.cta === "Review" ? coursePageHref(course.id) : coursePlayerHref(course.id),
  detailHref: coursePageHref(course.id),
}));

/**
 * The single courses at a synthetic persona's progress (Nelson, 25 Oct 2026; lib/persona-overlay),
 * as written with none. A server page passes the request's persona (lib/persona-server).
 */
export function myLearningCoursesFor(personaId: string | null | undefined): MyLearningCourse[] {
  const persona = getPersona(personaId);
  if (!persona) return WRITTEN_COURSES;
  return WRITTEN_COURSES.map((c) =>
    c.id in persona.courses ? overlayCard(c, persona.courses[c.id], c.id) : c,
  );
}

export const myLearningCourses: MyLearningCourse[] = myLearningCoursesFor(ACTIVE_PERSONA_ID);

/* ── Browse tile (LMS / Platform / Browse tile, 6388:116426) ────────────────────────── */

/**
 * The provider and partners of a course, as its card shows them (Course-Card 1.10): the partners
 * when set, else the provider. The course page header uses the same list, so the two never differ.
 * A course outside My Learning uses its own list (`own`), else SkillUp.
 */
export function coursePartnersOf(slug: string, own?: Provider[]): Provider[] {
  const course = myLearningCourses.find((c) => c.id === slug);
  if (!course) return own?.length ? own : ["SkillUp"];
  return course.partners?.length ? course.partners : [course.provider];
}

export const myLearningBrowseTile = { title: "Browse catalog", subtitle: "Add a new course" } as const;

/* ── Programs (DS `LMS/Platform/My-Learning/Program-Card`) ──────────────────────────── */

export interface MyLearningProgram {
  id: string;
  title: string;
  delivery: DeliveryMode;
  difficulty: Difficulty;
  /** Partner logos, as on the course and program headers. Sample: no field returns them. */
  /** Partner logos (DS Provider-Partner-Badge Type=Logo). */
  partners: { name: Provider }[];
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
  /** State=Not started: the Badge Gray start date ("Starts Wed 4 Nov"), with a Secondary "Start". */
  status?: string;
  /** State=Completed: the date the program certificate was issued (Certificates API). */
  certificateDate?: string;
  cta: "Resume" | "Start" | "View Certificate";
  /** The program page: what the card and its title open. No href: no page in the prototype. */
  href?: string;
  /** What the button opens when it is not the program page: the player of the course in progress. */
  actionHref?: string;
}

const WRITTEN_PROGRAMS: MyLearningProgram[] = [
  {
    id: "ai-driven-digital-marketing",
    // The program's own title, as its page shows it.
    title: "Certificate Program in AI Augmented Digital Marketing",
    delivery: "Flexible Learning",
    difficulty: "Beginner",
    partners: [
      { name: "Microsoft" },
      { name: "IBM" },
    ],
    courses: "1 of 7 courses complete",
    courseCount: 7,
    imageSrc: `${COVERS}/program-ai-digital-marketing.jpg`,
    initials: "AD",
    nextDue: nextDueOf("ai-driven-content-and-brand-communication"),
    lastStudied: "Last studied 3 days ago",
    hours: programHours("ai-driven-digital-marketing"),
    accessUntil: accessUntilOf("ai-driven-digital-marketing"),
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
    // SkillUp's own program: its logo as the partner (Nelson, 22 Oct 2026); the card and the
    // program header read it from here.
    partners: [{ name: "SkillUp" }],
    courses: "0 of 5 courses complete",
    courseCount: 5,
    initials: "CF",
    // No picture was made for this program: a placeholder cover, the same as the Figma screens (16 Oct 2026).
    imageSrc: `${COVERS}/intro-to-product-analytics.jpg`,
    hours: programHours("cybersecurity-fundamentals"),
    accessUntil: accessUntilOf("cybersecurity-fundamentals"),
    progressPct: 0,
    status: startLabel(courseStart("security-foundations-and-the-threat-landscape")),
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
      { name: "Microsoft" },
      { name: "IBM" },
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

/**
 * A program card at the active persona's progress (Nelson, 25 Oct 2026), counted from the
 * program's course rows (lib/programs carries the persona): N of M complete, the course in
 * progress or up next, Start / Resume / View Certificate.
 */
function personaProgramCard(card: MyLearningProgram): MyLearningProgram {
  const program = PROGRAMS.find((p) => p.slug === card.id);
  if (!program) return card;
  const pcts = program.courses.map((c) => c.card.progressPct ?? 0);
  const total = pcts.length;
  const complete = pcts.filter((x) => x >= 100).length;
  const started = pcts.some((x) => x > 0);
  const current = program.courses.find((c) => (c.card.progressPct ?? 0) > 0 && (c.card.progressPct ?? 0) < 100)
    ?? program.courses.find((c) => !c.card.progressPct);
  const base: MyLearningProgram = {
    ...card,
    courses: `${complete} of ${total} courses complete`,
    progressPct: total ? Math.round((complete / total) * 100) : 0,
    hours: programHours(card.id),
    upNext: undefined,
    status: undefined,
    certificateDate: undefined,
    actionHref: undefined,
  };
  if (complete === total) {
    return { ...base, hours: undefined, cta: "View Certificate", certificateDate: card.certificateDate ?? "2 Oct 2026", actionHref: programCertificatePageHref(card.id) };
  }
  if (!started) {
    return { ...base, nextDue: undefined, lastStudied: undefined, cta: "Start", status: card.status ?? "Not started" };
  }
  return {
    ...base,
    lastStudied: card.lastStudied ?? "Last studied 5 days ago",
    nextDue: card.nextDue,
    cta: "Resume",
    upNext: current ? `Course ${current.number} · ${current.card.title}` : undefined,
    actionHref: current ? coursePlayerHref(current.slug) : undefined,
  };
}

export const myLearningPrograms: MyLearningProgram[] = ACTIVE_PERSONA ? WRITTEN_PROGRAMS.map(personaProgramCard) : WRITTEN_PROGRAMS;

/* ── Status filter (13 Oct 2026) ────────────────────────────────────────────────────── */

/**
 * The state of a course or a program, as Open edX gives it: a course from `hasStarted` and
 * `certificate.isEarned`, a program from `progress_details`. Each tab is one list in this
 * order, and a filter under the toolbar keeps the cards of one state (Nelson, 13 Oct 2026;
 * it replaced the three sections tried the same day).
 */
export type MyLearningState = "in-progress" | "not-started" | "completed";
export type MyLearningStatusFilter = "all" | MyLearningState;

/**
 * The partners of a program, as its card shows them (Program-Card 1.10). The program page header
 * uses the same list, so the two never differ. A program without partners shows none, as its card.
 */
export function programPartnersOf(id: string): Provider[] {
  return myLearningPrograms.find((p) => p.id === id)?.partners.map((p) => p.name) ?? [];
}

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
