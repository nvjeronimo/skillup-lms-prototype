import type { BadgeColor } from "@/components/atoms/Badge";
import type { DeliveryMode, Difficulty } from "@/components/atoms/MetaBadges";
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
    missedAlert: { title: string; body: string; cta: string };
    pastLabel: string;
    past: CourseDate[];
    todayLabel: string;
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

/** The existing course player; every topic and assignment link opens it. */
const COURSE_PLAYER_HREF = "/course/six-sigma/topic/m3-t1";

const WEEK_LABELS: { label: string; name: string }[] = [
  { label: "Mo", name: "Monday" },
  { label: "Tu", name: "Tuesday" },
  { label: "We", name: "Wednesday" },
  { label: "Th", name: "Thursday" },
  { label: "Fr", name: "Friday" },
  { label: "Sa", name: "Saturday" },
  { label: "Su", name: "Sunday" },
];

function week(states: WeekDayState[]): WeeklyGoal["days"] {
  return WEEK_LABELS.map((day, index) => ({ ...day, state: states[index] }));
}

const GRAY: BadgeColor = "gray";

const SIX_SIGMA: CourseDetail = {
  slug: "six-sigma",
  title: "Six Sigma for process improvement",
  imageSrc: "/platform/course-six-sigma.jpg",
  partners: [
    { name: "Microsoft", logoSrc: "/platform/partner-microsoft.jpg" },
    { name: "IBM", logoSrc: "/platform/partner-ibm.jpg" },
  ],
  deliveryMode: "Flexible Learning",
  difficulty: "Beginner",
  stats: { structure: "4 modules · 42 topics", duration: "~ 14 hours", org: "SkillUp · SIXSIGMA-01" },
  progress: {
    percent: 38,
    label: "Course progress",
    eyebrow: "Go to last topic",
    cta: "Resume course",
    href: COURSE_PLAYER_HREF,
    notPassing: "Not passing yet · 15% of 70%",
    done: "16 of 42 topics",
    timeLeft: "~ 8h 40m left",
  },
  search: { placeholder: "Search this course" },

  update: {
    title: "Course update",
    body: "The control chart worksheet in Handouts has a corrected example. The checkpoint at the end of Module 3 counts towards your grade and unlocks Module 4.",
  },
  intro: {
    title: "What you'll learn",
    lead: "Four modules that walk the DMAIC cycle end to end. Work through them at your own pace. Each module closes with a graded checkpoint.",
  },
  modules: [
    {
      id: "module-1",
      number: 1,
      title: "Module 1 · Foundations of Six Sigma",
      state: "complete",
      topicCount: "12 topics",
      duration: "3h 20m",
    },
    {
      id: "module-2",
      number: 2,
      title: "Module 2 · DMAIC in practice",
      state: "incomplete",
      topicCount: "12 topics",
      duration: "3h 20m",
    },
    {
      id: "module-3",
      number: 3,
      title: "Module 3 · Improve the process",
      state: "incomplete",
      topicCount: "9 topics",
      duration: "3h 48m",
      defaultOpen: true,
      lessons: [
        {
          id: "define-and-measure",
          label: "Define and measure",
          topics: [
            { id: "m3-t1", title: "The define phase", type: "Reading", duration: "18 min", state: "Done" },
            { id: "m3-t2", title: "The measure phase", type: "Video", duration: "28 min", state: "Pending" },
            { id: "m3-t3", title: "Plotting a control chart", type: "Video", duration: "18 min", state: "Done" },
            { id: "m3-t4", title: "Choosing the right metric", type: "Reading", duration: "6 min", state: "Done" },
            { id: "m3-t5", title: "DMAIC fundamentals", type: "Quiz", duration: "8 min", state: "Done" },
          ],
        },
        {
          id: "analyze-and-interpret",
          label: "Analyze and interpret",
          topics: [
            { id: "m3-t6", title: "Running the analyse phase", type: "Reading", duration: "45 min", state: "Pending" },
            { id: "m3-t7", title: "Designing the prototype", type: "Video", duration: "30 min", state: "Pending" },
            { id: "m3-t8", title: "Conducting user testing", type: "Project", duration: "25 min", state: "Pending" },
            { id: "m3-t9", title: "Implementing feedback", type: "Peer Review", duration: "50 min", state: "Locked" },
          ],
        },
      ],
    },
    {
      id: "module-4",
      number: 4,
      title: "Module 4 · Control and sustain",
      state: "locked",
      topicCount: "9 topics",
      duration: "3h 20m",
      lockReason: "Complete “Module 3 · Checkpoint” to unlock",
    },
  ],
  mentor: {
    label: "Mentor",
    title: "Ask anything to your mentor",
    body: "Post your question in Q&A",
    cta: "Ask your mentor",
  },
  team: {
    label: "Course team",
    people: [
      { name: "Olivia Rhye", role: "Lead instructor · IBM" },
      { name: "Marcus Lee", role: "Instructor · IBM" },
      { name: "Priya Raman", role: "Course author · SkillUp" },
    ],
    cta: "Ask the course team",
  },
  weeklyGoal: {
    state: "met",
    title: "You met your goal this week",
    body: "Take a moment to celebrate your progress.",
    week: "This week · 15–21 Sep",
    days: week(["done", "missed", "done", "today-done", "upcoming", "upcoming", "upcoming"]),
    count: "3 of 3 days this week",
    lastWeek: "Last week: 2 of 3",
    plan: "Regular · 3 days a week.",
  },
  certificate: {
    status: "not-earned",
    courseId: "six-sigma",
    courseLabel: "Six Sigma for process improvement",
    title: "Not earned yet, keep on track!",
    requirements: [
      { title: "Reach the passing grade", detail: "15% now · 70% needed", percent: 15 },
      { title: "Complete the course content", detail: "16 of 42 topics · 38%", percent: 38 },
    ],
  },
  handouts: {
    label: "Handouts",
    items: ["Six Sigma cheat sheet (PDF)", "DMAIC project template (XLSX)", "Control chart worksheet (PDF)"],
  },
  upcomingDates: {
    label: "Upcoming dates",
    items: [
      {
        id: "final-project",
        iso: "2026-09-19",
        day: "19",
        month: "SEP",
        title: "Module 4 · Final project",
        detail: "Assignment due · 23:59 your time",
        relative: "Tomorrow",
        relativeColor: "yellow",
      },
      {
        id: "certificate",
        iso: "2026-10-03",
        day: "03",
        month: "OCT",
        title: "Certificate available",
        detail: "Certificate · 09:00 your time",
        relative: "In 15 days",
        relativeColor: "gray",
      },
    ],
    cta: "All dates",
  },
  tools: {
    label: "Course tools",
    items: [
      { id: "bookmarks", title: "Bookmarks", description: "Saved lessons/units" },
      { id: "updates", title: "Updates", description: "Announcements from the course team" },
      {
        id: "calendar-sync",
        title: "Subscribe to calendar updates",
        description: "Add your personal due dates to your calendar",
      },
    ],
  },

  progressTab: {
    title: "Your progress",
    completion: {
      title: "Course completion",
      body: "How much of the course content you have completed.",
      counts: "16 complete · 26 incomplete · 0 locked",
      percent: 38,
    },
    passAlert: {
      title: "A weighted grade of 70% is required to pass",
      body: "Your current weighted grade is 15%.",
    },
    grade: {
      title: "Your grade",
      badge: "15% · below the 70% pass mark",
      percent: 15,
      passPercent: 70,
      currentLabel: "Current 15%",
      passLabel: "Pass 70%",
      columns: { type: "Assignment type", weight: "Weight", grade: "Grade", weighted: "Weighted" },
      rows: [
        { type: "Final Quiz", weight: "30%", grade: "50%", weighted: "15%" },
        { type: "Hands-on Lab · BigQuery ML", weight: "70%", grade: "0%", weighted: "0%" },
      ],
      sections: [
        {
          title: "Module 4 · Final project and wrap-up",
          items: [
            { title: "Final project · Digital marketing strategy", score: "0/100 · 0%" },
            { title: "Course wrap-up and assessment", score: "3/10 · 30%" },
          ],
        },
      ],
    },
    note: "For progress on ungraded parts of the course, see the Course tab.",
    weeklyGoal: {
      state: "set",
      title: "Your weekly goal",
      body: "A day counts when you open any lesson in this course.",
      week: "This week · 15–21 Sep",
      days: week(["done", "missed", "done", "today", "upcoming", "upcoming", "upcoming"]),
      count: "2 of 3 days this week",
      lastWeek: "Last week: 3 of 3",
      plan: "Regular · 3 days a week.",
    },
  },

  datesTab: {
    title: "Important Dates",
    missedAlert: {
      title: "You missed a deadline on your schedule",
      body: "Your due dates are a suggested schedule, counted from the day you enrolled. Shift them forward to get back on track — the work you have done stays.",
      cta: "Shift due dates",
    },
    pastLabel: "Past",
    past: [
      {
        id: "course-starts",
        iso: "2026-07-28T00:00",
        date: "28 Jul 2026",
        time: "00:00 · your time",
        state: "complete",
        badges: [{ label: "COURSE", color: GRAY }],
        title: "Course starts",
        description: "Enrolment opened and all module content became available.",
      },
      {
        id: "channel-selection",
        iso: "2026-08-14T23:59",
        date: "14 Aug 2026",
        time: "23:59 · your time",
        state: "complete",
        badges: [
          { label: "DUE DATE", color: GRAY },
          { label: "HOMEWORK", color: GRAY },
          { label: "COMPLETE", color: "success" },
        ],
        title: "Module 1 · Channel selection challenge",
        description: "Submitted 2 days early.",
        link: "Open the assignment",
      },
      {
        id: "audience-mapping",
        iso: "2026-08-21T23:59",
        date: "21 Aug 2026",
        time: "23:59 · your time",
        state: "overdue",
        badges: [
          { label: "DUE DATE", color: GRAY },
          { label: "HOMEWORK", color: GRAY },
          { label: "OVERDUE", color: "error" },
        ],
        title: "Module 2 · Audience mapping",
        description: "Past due. The assignment no longer accepts work.",
        link: "Open the assignment",
      },
      {
        id: "upgrade-deadline",
        iso: "2026-08-30T23:59",
        date: "30 Aug 2026",
        time: "23:59 · your time",
        state: "complete",
        badges: [{ label: "UPGRADE", color: GRAY }],
        title: "Upgrade deadline",
        description: "The last day to upgrade to the verified track for this run.",
      },
    ],
    todayLabel: "Today · 18 Sep 2026",
    upcomingLabel: "Upcoming",
    upcoming: [
      {
        id: "final-project",
        iso: "2026-09-19T23:59",
        date: "19 Sep 2026",
        time: "23:59 · your time",
        state: "upcoming",
        badges: [
          { label: "DUE DATE", color: GRAY },
          { label: "FINAL PROJECT", color: GRAY },
          { label: "UPCOMING", color: GRAY },
        ],
        title: "Module 4 · Final project: digital marketing strategy",
        description: "Submit your strategy document. Best attempt wins.",
        link: "Open the assignment",
      },
      {
        id: "wrap-up",
        iso: "2026-09-26T23:59",
        date: "26 Sep 2026",
        time: "23:59 · your time",
        state: "locked",
        badges: [
          { label: "DUE DATE", color: GRAY },
          { label: "FINAL EXAM", color: GRAY },
          { label: "LOCKED", color: GRAY },
        ],
        title: "Module 4 · Course wrap-up and assessment",
        description: "Unlocks when Module 3 is complete.",
      },
      {
        id: "certificate-available",
        iso: "2026-10-03T09:00",
        date: "03 Oct 2026",
        time: "09:00 · your time",
        state: "upcoming",
        badges: [{ label: "CERTIFICATE", color: GRAY }],
        title: "Certificate available",
        description: "Your certificate is issued after this date if you have a passing grade.",
      },
      {
        id: "audit-access-ends",
        iso: "2026-10-31T23:59",
        date: "31 Oct 2026",
        time: "23:59 · your time",
        state: "upcoming",
        badges: [{ label: "ACCESS", color: GRAY }],
        title: "Audit access ends",
        description: "After this date the course content is no longer available on the audit track.",
      },
      {
        id: "course-ends",
        iso: "2037-10-31T23:30",
        date: "31 Oct 2037",
        time: "23:30 · your time",
        state: "upcoming",
        badges: [{ label: "COURSE", color: GRAY }],
        title: "Course ends",
        description: "After this date the course is archived — content stays readable, graded work closes.",
      },
    ],
    timezoneNote: "All times are shown in your time zone (Europe/Lisbon, UTC+1).",
  },

  qaTab: {
    title: "Mentorship Q&A",
    listTitle: "Your questions",
    ask: "Ask a question",
    search: "Search your questions…",
    filters: [
      { id: "all", label: "All" },
      { id: "unanswered", label: "Unanswered" },
      { id: "following", label: "Following" },
    ],
    threads: [
      {
        id: "control-chart",
        title: "Why is my control chart flagging every point?",
        preview: "David: Check your subgroup size first — if it is 1, the limits collapse.",
        meta: "2 days ago  ·  4 replies",
        answered: true,
        following: true,
        unread: false,
        messages: [
          {
            id: "m1",
            from: "learner",
            author: "You",
            body: "Every point on my control chart is out of limits. Am I plotting the wrong thing?",
            time: "2 days ago",
          },
          {
            id: "m2",
            from: "mentor",
            author: "David Chen",
            label: "STAFF",
            accepted: true,
            body: "Check your subgroup size first — if it is 1, the limits collapse onto the mean and everything reads as a signal.",
            time: "2 days ago",
          },
          {
            id: "m3",
            from: "learner",
            author: "You",
            body: "It is 1. I was plotting one reading per shift.",
            time: "2 days ago",
          },
          {
            id: "m4",
            from: "mentor",
            author: "David Chen",
            label: "STAFF",
            body: "Then you want an individuals chart, not an X-bar. Same data, different limits. Try it and send me the result.",
            time: "yesterday",
          },
        ],
      },
      {
        id: "cpk-vs-ppk",
        title: "Cpk vs Ppk — when does the difference matter?",
        preview: "David: Whenever your process is not in control yet.",
        meta: "5 days ago  ·  7 replies  ·  2 unread",
        answered: true,
        following: false,
        unread: true,
      },
      {
        id: "sample-size",
        title: "Sample size for the measure phase",
        preview: "You: Thanks — that clears it up.",
        meta: "last week  ·  3 replies",
        answered: true,
        following: false,
        unread: false,
      },
      {
        id: "checkpoint-attempts",
        title: "Is the checkpoint graded on first attempt only?",
        preview: "You: Asked yesterday, no reply yet.",
        meta: "yesterday  ·  1 reply",
        answered: false,
        following: false,
        unread: false,
      },
    ],
    mentorLine: "David Chen · your mentor · typically responds within 1 day",
    following: "Following",
    replyPlaceholder: "Write a reply…",
    send: "Send",
    anonymous: "Post anonymously",
    back: "Your questions",
    report: "Report",
  },
};

/**
 * A course that runs on IBM (Figma I1 6792:139729 and I2 6792:139888, with tablet and mobile).
 * The screens are the Course Detail header alone, with the Progress card changed; everything
 * under the header is the Six Sigma sample and is not rendered for a hosted course.
 */
const CLOUD_COMPUTING: CourseDetail = {
  ...SIX_SIGMA,
  slug: "introduction-to-cloud-computing",
  title: "Introduction to Cloud Computing",
  partners: [{ name: "IBM", logoSrc: "/platform/partner-ibm.jpg" }],
  stats: { structure: "4 modules · 42 topics", duration: "~ 14 hours", org: "IBM · CC0101EN" },
  progress: { ...SIX_SIGMA.progress, percent: 0 },
  hosted: {
    partner: "IBM",
    href: "/partner/ibm?course=introduction-to-cloud-computing",
    start: { eyebrow: "Hosted by IBM · opens in a new tab", cta: "Start course" },
    started: { eyebrow: "Progress is tracked on IBM", cta: "Continue on IBM" },
    dialog: {
      title: "This course continues on IBM",
      body: "IBM hosts the lessons and labs for this course. It opens in a new tab and you sign in with your IBM account. Your enrolment on SkillUp stays active.",
      dontShowAgain: "Don’t show again",
      cancel: "Cancel",
      confirm: "Continue to IBM",
    },
  },
};

const COURSES: CourseDetail[] = [SIX_SIGMA, CLOUD_COMPUTING];

/**
 * The page of a course. Six Sigma and the IBM course are written out above; every other
 * course of the catalogue gets the same sample body under its own title, picture, progress
 * and program (lib/platform/catalog).
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
