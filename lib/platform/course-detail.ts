import type { BadgeColor } from "@/components/atoms/Badge";
import type { DeliveryMode, Difficulty } from "@/components/atoms/MetaBadges";
import { COURSES as OWN_COURSES } from "@/lib/courses";
import { CLOUD_COMPUTING, SIX_SIGMA } from "@/lib/courses/sample-page";
import type { TopicType } from "@/lib/types";
import type { ProgramCertificate } from "@/lib/platform/program";
import { getCatalogCourse } from "./catalog";
import { coursePlayerHref } from "./hrefs";

/**
 * Mock data of the Course Detail page, self-paced (Figma handoff frame 6146:10226, "Platform
 * Pages - Course Detail (self-paced) - Light"). Copy is verbatim from the thirteen screens:
 * Course 6406:39255 / 6406:40055 / 6406:40771, Progress 6406:41528 / 6406:41969 / 6406:42331,
 * Dates 6406:42688 / 6406:43322 / 6406:43877, Q&A 6406:44434 / 6406:44986 / 6406:45459 and the
 * mobile conversation 6418:127007. Nothing here is read from an API yet; what has no Open edX
 * source at all is marked on the page with `data-mock` (see course-details-metadata-map.md).
 * Where the design draws an item closed and gives it no content, the content is left out and
 * the page prints CONTENT_PENDING (lib/platform/program).
 */

/** `tabs[]` of course_metadata for a self-paced course, without the staff-only Instructor tab. */
export const COURSE_TABS = [
  { id: "course", label: "Course" },
  { id: "progress", label: "Progress" },
  { id: "dates", label: "Dates" },
  { id: "qa", label: "Mentorship Q&A" },
] as const;

export type CourseTabId = (typeof COURSE_TABS)[number]["id"];

export const DEFAULT_COURSE_TAB: CourseTabId = "course";

export function isCourseTab(value: string | null | undefined): value is CourseTabId {
  return COURSE_TABS.some((t) => t.id === value);
}

/** The page of a course, optionally on a tab and on a Q&A thread. */
export function courseDetailHref(slug: string, tab?: CourseTabId, thread?: string): string {
  const params = new URLSearchParams();
  if (tab && tab !== DEFAULT_COURSE_TAB) params.set("tab", tab);
  if (thread) params.set("thread", thread);
  const query = params.toString();
  return `/platform/course/${slug}${query ? `?${query}` : ""}`;
}

/* ── Course tab ─────────────────────────────────────────────────────────────────────── */

export type CourseTopicState = "Done" | "Pending" | "Locked";

export interface CourseTopic {
  id: string;
  title: string;
  type: TopicType;
  /** `effort_time`: authored in Studio, null in every payload delivered so far. */
  duration: string;
  state: CourseTopicState;
}

export interface CourseLesson {
  id: string;
  label: string;
  topics: CourseTopic[];
}

export type CourseModuleState = "complete" | "incomplete" | "locked";

export interface CourseModule {
  id: string;
  number: number;
  /** `display_name` of the chapter, rendered verbatim. */
  title: string;
  state: CourseModuleState;
  topicCount: string;
  duration: string;
  /** Why the module is locked. The outline sends a boolean only; the sentence is sample copy. */
  lockReason?: string;
  /** Not drawn for the modules the screens show closed. */
  lessons?: CourseLesson[];
  /** Open when the page loads (as drawn). */
  defaultOpen?: boolean;
}

export interface CoursePerson {
  name: string;
  role: string;
}

export type WeekDayState = "done" | "missed" | "today" | "today-done" | "upcoming";

export interface WeeklyGoal {
  /** `met`: the celebration with the tinted week strip. `set`: the plain strip. */
  state: "met" | "set";
  title: string;
  body: string;
  week: string;
  days: { label: string; name: string; state: WeekDayState }[];
  count: string;
  lastWeek: string;
  plan: string;
}

export interface CourseSidebarDate {
  id: string;
  /** ISO date, for <time>. */
  iso: string;
  day: string;
  month: string;
  title: string;
  detail: string;
  /** Relative badge; computed by the product from `date`. */
  relative: string;
  /** Yellow within a week, Gray otherwise. */
  relativeColor: BadgeColor;
}

export type CourseToolId = "bookmarks" | "updates" | "calendar-sync";

export interface CourseTool {
  id: CourseToolId;
  title: string;
  description: string;
}

/* ── Progress tab ───────────────────────────────────────────────────────────────────── */

export interface GradeRow {
  /** `assignment_policies[].type`: free text authored in Studio. */
  type: string;
  weight: string;
  grade: string;
  weighted: string;
}

export interface GradeSection {
  title: string;
  items: { title: string; score: string }[];
}

/* ── Dates tab ──────────────────────────────────────────────────────────────────────── */

export type CourseDateState = "complete" | "overdue" | "upcoming" | "locked";

export interface CourseDateBadge {
  label: string;
  color: BadgeColor;
}

export interface CourseDate {
  id: string;
  /** ISO date and time, for <time>. */
  iso: string;
  date: string;
  time: string;
  state: CourseDateState;
  /** Date type, assignment type and status, in that order, as drawn. */
  badges: CourseDateBadge[];
  title: string;
  description: string;
  /** Label of the link to the assignment, when the row has one. */
  link?: string;
}

/* ── Mentorship Q&A ─────────────────────────────────────────────────────────────────── */

export interface QaMessage {
  id: string;
  from: "learner" | "mentor";
  author: string;
  /** `author_label`. */
  label?: string;
  accepted?: boolean;
  body: string;
  time: string;
}

export interface QaThread {
  id: string;
  title: string;
  preview: string;
  meta: string;
  answered: boolean;
  following: boolean;
  unread: boolean;
  /** Not drawn for the threads the screens show only in the list. */
  messages?: QaMessage[];
}

/* ── The course ─────────────────────────────────────────────────────────────────────── */

export interface HostedCourse {
  partner: string;
  /** Where the course lives. In the prototype, a stand-in page that says so. */
  href: string;
  /** Progress card before the learner has left for the partner: eyebrow and button. */
  start: { eyebrow: string; cta: string };
  /** Progress card once the course was started there. The percentage reads as a dash. */
  started: { eyebrow: string; cta: string };
  /** The dialog shown before leaving SkillUp for the first time (DS Modal, Horizontal). */
  dialog: { title: string; body: string; dontShowAgain: string; cancel: string; confirm: string };
}

export interface CourseDetail {
  slug: string;
  title: string;
  imageSrc: string;
  partners: { name: string; logoSrc: string }[];
  deliveryMode: DeliveryMode;
  difficulty: Difficulty;
  stats: { structure: string; duration: string; org: string };
  progress: {
    percent: number;
    label: string;
    eyebrow: string;
    cta: string;
    /** `resume_course.url`. */
    href: string;
    notPassing: string;
    done: string;
    timeLeft: string;
  };
  search: { placeholder: string };
  /** The program this course is part of: the breadcrumb then goes through it. */
  program?: { slug: string; title: string };
  /**
   * Set when the whole course runs on a partner's platform (IBM): *Start course* sends the
   * learner there and nothing of the course is in our Studio (lab-third-party-platforms.md).
   * The page is then the header alone: what sits under it is not designed, because we do not
   * know yet what IBM shows or reports back.
   */
  hosted?: HostedCourse;

  update: { title: string; body: string };
  intro: { title: string; lead: string };
  modules: CourseModule[];
  mentor: { label: string; title: string; body: string; cta: string };
  team: { label: string; people: CoursePerson[]; cta: string };
  weeklyGoal: WeeklyGoal;
  certificate: ProgramCertificate;
  handouts: { label: string; items: string[] };
  upcomingDates: { label: string; items: CourseSidebarDate[]; cta: string };
  tools: { label: string; items: CourseTool[] };

  progressTab: {
    title: string;
    completion: { title: string; body: string; counts: string; percent: number };
    passAlert: { title: string; body: string };
    grade: {
      title: string;
      badge: string;
      /** `course_grade.percent` and the Pass threshold of `grading_policy.grade_range`. */
      percent: number;
      passPercent: number;
      currentLabel: string;
      passLabel: string;
      columns: { type: string; weight: string; grade: string; weighted: string };
      rows: GradeRow[];
      sections: GradeSection[];
    };
    note: string;
    weeklyGoal: WeeklyGoal;
  };

  datesTab: {
    title: string;
    /** Shown only to a learner who is behind the suggested schedule; left out otherwise. */
    missedAlert?: { title: string; body: string; cta: string };
    pastLabel: string;
    past: CourseDate[];
    todayLabel: string;
    /** ISO date of the Today marker, for <time>. */
    todayIso: string;
    upcomingLabel: string;
    upcoming: CourseDate[];
    timezoneNote: string;
  };

  qaTab: {
    title: string;
    listTitle: string;
    ask: string;
    search: string;
    filters: { id: "all" | "unanswered" | "following"; label: string }[];
    threads: QaThread[];
    mentorLine: string;
    following: string;
    replyPlaceholder: string;
    send: string;
    anonymous: string;
    back: string;
    report: string;
  };
}

const COURSES: CourseDetail[] = [SIX_SIGMA, CLOUD_COMPUTING, ...OWN_COURSES.map((c) => c.page)];

/**
 * The page of a course. Six Sigma and the IBM course are written out in lib/courses/sample-page
 * and each course with content of its own in its folder under lib/courses; every other course
 * of the catalogue gets the Six Sigma sample body under its own title, picture, progress and
 * program (lib/platform/catalog).
 */
export function getCourseDetailBySlug(slug: string): CourseDetail | undefined {
  const own = COURSES.find((c) => c.slug === slug);
  if (own) return own;
  const entry = getCatalogCourse(slug);
  if (!entry) return undefined;
  const percent = entry.percent ?? 0;
  return {
    ...SIX_SIGMA,
    slug,
    title: entry.title,
    imageSrc: entry.imageSrc ?? SIX_SIGMA.imageSrc,
    partners: [],
    stats: { ...SIX_SIGMA.stats, org: "SkillUp" },
    progress: {
      ...SIX_SIGMA.progress,
      percent,
      cta: entry.percent === null ? "Start course" : percent >= 100 ? "Review course" : "Resume course",
      href: coursePlayerHref(slug),
    },
    program: entry.program ? { slug: entry.program.slug, title: entry.program.title } : undefined,
  };
}

/** The one course that has a Course Detail page in the prototype. */
export const COURSE_DETAIL_HREF = courseDetailHref(SIX_SIGMA.slug);
