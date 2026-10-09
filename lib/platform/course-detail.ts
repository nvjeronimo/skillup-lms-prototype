import type { BadgeColor } from "@/components/atoms/Badge";
import type { DeliveryMode, Difficulty } from "@/components/atoms/MetaBadges";
import { aiContentCourse, moduleTopics, uxResearchCourse } from "@/lib/data";
import type { Course, TopicType } from "@/lib/types";
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
    todayIso: "2026-09-18",
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

/* ── Courses with content of their own (asked by Nelson on 9 Oct 2026) ──────────────── */

/** "approx. 15 min read" → "15 min": the page prints the bare effort. */
const effort = (duration: string) => duration.replace(/^approx\.\s*/, "").replace(/\s*read$/, "");

/**
 * The syllabus of a course whose player has an outline of its own (lib/data): the same
 * modules, lessons, topics and states, so the page and the player cannot disagree. What the
 * outline does not hold comes in `extra`, one entry per module: its duration and, when it
 * applies, that it opens with the page or why it is locked.
 */
function modulesFromOutline(
  outline: Course,
  extra: Pick<CourseModule, "duration" | "defaultOpen" | "lockReason">[],
): CourseModule[] {
  return outline.modules.map((mod, index) => {
    const topics = moduleTopics(mod);
    const state: CourseModuleState = topics.every((t) => t.completed)
      ? "complete"
      : topics.every((t) => t.locked)
        ? "locked"
        : "incomplete";
    return {
      id: mod.id,
      number: index + 1,
      title: `Module ${index + 1} · ${mod.title}`,
      state,
      topicCount: `${topics.length} topics`,
      ...extra[index],
      lessons: (mod.lessons ?? []).map((lesson) => ({
        id: lesson.id,
        label: lesson.label,
        topics: lesson.topics.map((t) => ({
          id: t.id,
          title: t.title,
          type: t.type,
          duration: effort(t.duration),
          state: t.completed ? "Done" : t.locked ? "Locked" : "Pending",
        })),
      })),
    };
  });
}

/** Both sample weeks run Monday 21 to Sunday 27 September 2026; today is Thursday 24. */
const THIS_WEEK = "This week · 21–27 Sep";

/**
 * "AI-Driven Content and Brand Communication": course 2 of 7 of the AI Augmented Digital
 * Marketing program, in progress. Its figures follow the module rows of the Program page
 * (lib/platform/program): 38 topics, Module 1 complete and 3 of 10 topics of Module 2,
 * about 13 hours, a weighted grade of 28% against the 70% needed. Today is 24 Sep 2026, the
 * day of the Dashboard, whose due item is Assignment 02 on the 26th.
 */
const AI_CONTENT_GOAL: WeeklyGoal = {
  state: "met",
  title: "You met your goal this week",
  body: "Take a moment to celebrate your progress.",
  week: THIS_WEEK,
  days: week(["done", "done", "missed", "today-done", "upcoming", "upcoming", "upcoming"]),
  count: "3 of 3 days this week",
  lastWeek: "Last week: 3 of 3",
  plan: "Regular · 3 days a week.",
};

const AI_CONTENT: CourseDetail = {
  slug: aiContentCourse.slug,
  title: aiContentCourse.title,
  imageSrc: "/platform/covers/program-course-2-ai-driven-content.jpg",
  partners: [],
  deliveryMode: "Flexible Learning",
  difficulty: "Beginner",
  stats: { structure: "4 modules · 38 topics", duration: "~ 13 hours", org: "SkillUp · ADM-02" },
  progress: {
    percent: 40,
    label: "Course progress",
    eyebrow: "Go to last topic",
    cta: "Resume course",
    href: coursePlayerHref(aiContentCourse.slug),
    notPassing: "Not passing yet · 28% of 70%",
    done: "15 of 38 topics",
    timeLeft: "~ 9h left",
  },
  search: SIX_SIGMA.search,
  program: {
    slug: "ai-driven-digital-marketing",
    title: "Certificate Program in AI Augmented Digital Marketing",
  },

  update: {
    title: "Course update",
    body: "The content brief and prompt template in Handouts has a new section for format limits. Assignment 02, at the end of Module 2, counts towards your grade.",
  },
  intro: {
    title: "What you'll learn",
    lead: "Four modules that take a brand from its voice to finished content: a voice system, copy drafted with an AI assistant, visual content and a final content kit. Work through them at your own pace.",
  },
  modules: modulesFromOutline(aiContentCourse, [
    { duration: "3h 13m" },
    { duration: "3h 22m", defaultOpen: true },
    { duration: "3h 04m" },
    { duration: "3h 14m", lockReason: "Complete “Module 3 · AI for Visual Content” to unlock" },
  ]),
  mentor: SIX_SIGMA.mentor,
  team: {
    label: "Course team",
    people: [
      { name: "Rajesh Menon", role: "Lead instructor · SkillUp" },
      { name: "Priya Raman", role: "Course author · SkillUp" },
    ],
    cta: "Ask the course team",
  },
  weeklyGoal: AI_CONTENT_GOAL,
  certificate: {
    status: "not-earned",
    courseId: aiContentCourse.slug,
    courseLabel: aiContentCourse.title,
    title: "Not earned yet, keep on track!",
    requirements: [
      { title: "Reach the passing grade", detail: "28% now · 70% needed", percent: 28 },
      { title: "Complete the course content", detail: "15 of 38 topics · 40%", percent: 40 },
    ],
  },
  handouts: {
    label: "Handouts",
    items: [
      "Brand voice guide template (DOCX)",
      "Content brief and prompt template (DOCX)",
      "Prompt library starter (XLSX)",
    ],
  },
  upcomingDates: {
    label: "Upcoming dates",
    items: [
      {
        id: "assignment-02",
        iso: "2026-09-26",
        day: "26",
        month: "SEP",
        title: "Assignment 02 · Audience segmentation",
        detail: "Assignment due · 23:59 your time",
        relative: "In 2 days",
        relativeColor: "yellow",
      },
      {
        id: "graded-quiz-visual",
        iso: "2026-10-04",
        day: "04",
        month: "OCT",
        title: "Graded Quiz: AI for visual content",
        detail: "Assignment due · 23:59 your time",
        relative: "In 10 days",
        relativeColor: "gray",
      },
    ],
    cta: "All dates",
  },
  tools: SIX_SIGMA.tools,

  progressTab: {
    title: "Your progress",
    completion: {
      title: "Course completion",
      body: "How much of the course content you have completed.",
      counts: "15 complete · 17 incomplete · 6 locked",
      percent: 40,
    },
    passAlert: {
      title: "A weighted grade of 70% is required to pass",
      body: "Your current weighted grade is 28%.",
    },
    grade: {
      title: "Your grade",
      badge: "28% · below the 70% pass mark",
      percent: 28,
      passPercent: 70,
      currentLabel: "Current 28%",
      passLabel: "Pass 70%",
      columns: SIX_SIGMA.progressTab.grade.columns,
      // Two homework assignments and two graded quizzes: one of each is done, so each type
      // is at half of what its one result earned. 18% + 10% = the 28% of the header.
      rows: [
        { type: "Homework", weight: "40%", grade: "45%", weighted: "18%" },
        { type: "Graded Quiz", weight: "20%", grade: "50%", weighted: "10%" },
        { type: "Final Project", weight: "25%", grade: "0%", weighted: "0%" },
        { type: "Final Assessment", weight: "15%", grade: "0%", weighted: "0%" },
      ],
      sections: [
        {
          title: "Module 1 · Brand Strategy & Voice Systems",
          items: [
            { title: "Assignment 01 · Brand voice guide", score: "90/100 · 90%" },
            { title: "Graded Quiz: Brand strategy and voice", score: "3/3 · 100%" },
          ],
        },
        {
          title: "Module 2 · AI-Assisted Content Development",
          items: [{ title: "Assignment 02 · Audience segmentation", score: "0/100 · 0%" }],
        },
        {
          title: "Module 3 · AI for Visual Content",
          items: [{ title: "Graded Quiz: AI for visual content", score: "0/3 · 0%" }],
        },
        {
          title: "Module 4 · Final Project, Assessment, and Wrap-Up",
          items: [
            { title: "Final Project: Brand content kit", score: "0/20 · 0%" },
            { title: "Final Assessment", score: "0/3 · 0%" },
          ],
        },
      ],
    },
    note: SIX_SIGMA.progressTab.note,
    weeklyGoal: AI_CONTENT_GOAL,
  },

  datesTab: {
    title: "Important Dates",
    // No missed-deadline alert: nothing on this learner's schedule is overdue.
    pastLabel: "Past",
    past: [
      {
        id: "course-starts",
        iso: "2026-09-13T00:00",
        date: "13 Sep 2026",
        time: "00:00 · your time",
        state: "complete",
        badges: [{ label: "COURSE", color: GRAY }],
        title: "Course starts",
        description: "Opened the day after you completed course 1 of the program.",
      },
      {
        id: "assignment-01",
        iso: "2026-09-18T23:59",
        date: "18 Sep 2026",
        time: "23:59 · your time",
        state: "complete",
        badges: [
          { label: "DUE DATE", color: GRAY },
          { label: "HOMEWORK", color: GRAY },
          { label: "COMPLETE", color: "success" },
        ],
        title: "Module 1 · Assignment 01 · Brand voice guide",
        description: "Submitted 1 day early. Graded 90/100.",
        link: "Open the assignment",
      },
      {
        id: "graded-quiz-brand",
        iso: "2026-09-20T23:59",
        date: "20 Sep 2026",
        time: "23:59 · your time",
        state: "complete",
        badges: [
          { label: "DUE DATE", color: GRAY },
          { label: "GRADED QUIZ", color: GRAY },
          { label: "COMPLETE", color: "success" },
        ],
        title: "Module 1 · Graded Quiz: Brand strategy and voice",
        description: "Submitted on the due date. 3 of 3 correct.",
        link: "Open the assignment",
      },
    ],
    todayLabel: "Today · 24 Sep 2026",
    todayIso: "2026-09-24",
    upcomingLabel: "Upcoming",
    upcoming: [
      {
        id: "assignment-02",
        iso: "2026-09-26T23:59",
        date: "26 Sep 2026",
        time: "23:59 · your time",
        state: "upcoming",
        badges: [
          { label: "DUE DATE", color: GRAY },
          { label: "HOMEWORK", color: GRAY },
          { label: "UPCOMING", color: GRAY },
        ],
        title: "Module 2 · Assignment 02 · Audience segmentation",
        description: "Three segments, with the brief, the prompt and the edited draft for each.",
        link: "Open the assignment",
      },
      {
        id: "graded-quiz-visual",
        iso: "2026-10-04T23:59",
        date: "04 Oct 2026",
        time: "23:59 · your time",
        state: "upcoming",
        badges: [
          { label: "DUE DATE", color: GRAY },
          { label: "GRADED QUIZ", color: GRAY },
          { label: "UPCOMING", color: GRAY },
        ],
        title: "Module 3 · Graded Quiz: AI for visual content",
        description: "Two attempts. The best one counts.",
      },
      {
        id: "final-project",
        iso: "2026-10-10T23:59",
        date: "10 Oct 2026",
        time: "23:59 · your time",
        state: "locked",
        badges: [
          { label: "DUE DATE", color: GRAY },
          { label: "FINAL PROJECT", color: GRAY },
          { label: "LOCKED", color: GRAY },
        ],
        title: "Module 4 · Final Project: Brand content kit",
        description: "Unlocks when Module 3 is complete.",
      },
      {
        id: "final-assessment",
        iso: "2026-10-11T23:59",
        date: "11 Oct 2026",
        time: "23:59 · your time",
        state: "locked",
        badges: [
          { label: "DUE DATE", color: GRAY },
          { label: "FINAL EXAM", color: GRAY },
          { label: "LOCKED", color: GRAY },
        ],
        title: "Module 4 · Final Assessment",
        description: "Unlocks when Module 3 is complete. One attempt.",
      },
      {
        id: "certificate-available",
        iso: "2026-10-12T09:00",
        date: "12 Oct 2026",
        time: "09:00 · your time",
        state: "upcoming",
        badges: [{ label: "CERTIFICATE", color: GRAY }],
        title: "Certificate available",
        description: "Your certificate is issued after this date if you have a passing grade.",
      },
      {
        id: "course-ends",
        iso: "2027-10-31T23:59",
        date: "31 Oct 2027",
        time: "23:59 · your time",
        state: "upcoming",
        badges: [{ label: "COURSE", color: GRAY }],
        title: "Course ends",
        description: "The program ends on this date and access to all its courses closes.",
      },
    ],
    timezoneNote: SIX_SIGMA.datesTab.timezoneNote,
  },

  qaTab: {
    ...SIX_SIGMA.qaTab,
    threads: [
      {
        id: "brand-voice-drafts",
        title: "My AI drafts all sound the same. How do I get our voice in?",
        preview: "Marcus: Add one sentence you would publish and one you would not.",
        meta: "2 days ago  ·  4 replies",
        answered: true,
        following: true,
        unread: false,
        messages: [
          {
            id: "m1",
            from: "learner",
            author: "You",
            body: "Whatever I ask for, the drafts come back in the same polite, generic tone. I pasted the three voice traits from my guide into the prompt. What am I missing?",
            time: "2 days ago",
          },
          {
            id: "m2",
            from: "mentor",
            author: "Marcus Lee",
            label: "STAFF",
            accepted: true,
            body: "Traits on their own are too abstract for an assistant. Add one sentence you would publish and one you would not, and say why the second one fails. Examples steer the draft more than adjectives do.",
            time: "2 days ago",
          },
          {
            id: "m3",
            from: "learner",
            author: "You",
            body: "I added both. Much closer, but the headlines are still too long.",
            time: "2 days ago",
          },
          {
            id: "m4",
            from: "mentor",
            author: "Marcus Lee",
            label: "STAFF",
            body: "Then give the limit as a number: headlines of up to six words. Ask for the output with labels as well, so you can check each line against the limit.",
            time: "yesterday",
          },
        ],
      },
      {
        id: "segments-count",
        title: "How many segments should Assignment 02 cover?",
        preview: "Marcus: Three, split by need or situation.",
        meta: "4 days ago  ·  3 replies  ·  1 unread",
        answered: true,
        following: false,
        unread: true,
      },
      {
        id: "ai-disclosure",
        title: "Do I have to say that copy was drafted with AI?",
        preview: "You: Thanks, the Module 1 reading covers it.",
        meta: "last week  ·  2 replies",
        answered: true,
        following: false,
        unread: false,
      },
      {
        id: "practice-quiz-grade",
        title: "Does the practice quiz count towards the grade?",
        preview: "You: Asked yesterday, no reply yet.",
        meta: "yesterday  ·  1 reply",
        answered: false,
        following: false,
        unread: false,
      },
    ],
    mentorLine: "Marcus Lee · your mentor · typically responds within 1 day",
  },
};

/**
 * "UX Research and Design Thinking": a stand-alone course of My Learning, just started.
 * Its figures follow the My Learning card: 5% (2 of 40 topics), 10 hours in all, next up
 * "Discovery interview techniques". Nothing is graded yet. Today is 24 Sep 2026, the day of
 * the Dashboard, whose due item is the persona research draft, due tonight; the graded quiz
 * before it is overdue, which is what the missed-deadline alert is about.
 */
const UX_RESEARCH_GOAL: WeeklyGoal = {
  state: "set",
  title: "Your weekly goal",
  body: "A day counts when you open any lesson in this course.",
  week: THIS_WEEK,
  days: week(["missed", "done", "missed", "today", "upcoming", "upcoming", "upcoming"]),
  count: "1 of 3 days this week",
  lastWeek: "Last week: 1 of 3",
  plan: "Regular · 3 days a week.",
};

const UX_RESEARCH: CourseDetail = {
  slug: uxResearchCourse.slug,
  title: uxResearchCourse.title,
  imageSrc: "/platform/covers/ux-research-and-design-thinking.jpg",
  partners: [],
  deliveryMode: "Flexible Learning",
  difficulty: "Beginner",
  stats: { structure: "4 modules · 40 topics", duration: "~ 10 hours", org: "SkillUp · UXR-01" },
  progress: {
    percent: 5,
    label: "Course progress",
    eyebrow: "Go to last topic",
    cta: "Resume course",
    href: coursePlayerHref(uxResearchCourse.slug),
    notPassing: "Not passing yet · 0% of 70%",
    done: "2 of 40 topics",
    timeLeft: "~ 9h 40m left",
  },
  search: SIX_SIGMA.search,

  update: {
    title: "Course update",
    body: "The five interview transcripts for the persona research draft are in Handouts. The draft counts towards your grade: once you submit it, you review the draft of one peer.",
  },
  intro: {
    title: "What you'll learn",
    lead: "Four modules that follow the design thinking process: understand the people you design for, define the problem, generate and prototype ideas, then test them. Work through them at your own pace.",
  },
  modules: modulesFromOutline(uxResearchCourse, [
    { duration: "2h 35m", defaultOpen: true },
    { duration: "2h 30m" },
    { duration: "2h 45m" },
    { duration: "2h 10m", lockReason: "Complete “Module 3 · Ideate and Prototype” to unlock" },
  ]),
  mentor: SIX_SIGMA.mentor,
  team: {
    label: "Course team",
    people: [
      { name: "Dr. Marta Silva", role: "Lead instructor · SkillUp" },
      { name: "Priya Raman", role: "Course author · SkillUp" },
    ],
    cta: "Ask the course team",
  },
  weeklyGoal: UX_RESEARCH_GOAL,
  certificate: {
    status: "not-earned",
    courseId: uxResearchCourse.slug,
    courseLabel: uxResearchCourse.title,
    title: "Not earned yet, keep on track!",
    requirements: [
      { title: "Reach the passing grade", detail: "0% now · 70% needed", percent: 0 },
      { title: "Complete the course content", detail: "2 of 40 topics · 5%", percent: 5 },
    ],
  },
  handouts: {
    label: "Handouts",
    items: [
      "Interview guide template (DOCX)",
      "Case study: five interview transcripts (PDF)",
      "Persona template (PPTX)",
    ],
  },
  upcomingDates: {
    label: "Upcoming dates",
    items: [
      {
        id: "persona-research-draft",
        iso: "2026-09-24",
        day: "24",
        month: "SEP",
        title: "Persona research draft",
        detail: "Peer assessment due · 23:59 your time",
        relative: "Today",
        relativeColor: "yellow",
      },
      {
        id: "graded-quiz-define",
        iso: "2026-10-05",
        day: "05",
        month: "OCT",
        title: "Graded Quiz: Synthesis and problem framing",
        detail: "Assignment due · 23:59 your time",
        relative: "In 11 days",
        relativeColor: "gray",
      },
    ],
    cta: "All dates",
  },
  tools: SIX_SIGMA.tools,

  progressTab: {
    title: "Your progress",
    completion: {
      title: "Course completion",
      body: "How much of the course content you have completed.",
      counts: "2 complete · 29 incomplete · 9 locked",
      percent: 5,
    },
    passAlert: {
      title: "A weighted grade of 70% is required to pass",
      body: "Your current weighted grade is 0%.",
    },
    grade: {
      title: "Your grade",
      badge: "0% · below the 70% pass mark",
      percent: 0,
      passPercent: 70,
      currentLabel: "Current 0%",
      passLabel: "Pass 70%",
      columns: SIX_SIGMA.progressTab.grade.columns,
      rows: [
        { type: "Graded Quiz", weight: "30%", grade: "0%", weighted: "0%" },
        { type: "Peer Assessment", weight: "40%", grade: "0%", weighted: "0%" },
        { type: "Final Project", weight: "30%", grade: "0%", weighted: "0%" },
      ],
      sections: [
        {
          title: "Module 1 · Empathize: Understanding Users",
          items: [
            { title: "Graded Quiz: Research foundations", score: "0/3 · 0%" },
            { title: "Persona research draft", score: "0/20 · 0%" },
          ],
        },
        {
          title: "Module 2 · Define: From Research to Problem Statements",
          items: [{ title: "Graded Quiz: Synthesis and problem framing", score: "0/3 · 0%" }],
        },
        {
          title: "Module 3 · Ideate and Prototype",
          items: [
            { title: "Prototype critique", score: "0/20 · 0%" },
            { title: "Graded Quiz: Ideate and prototype", score: "0/3 · 0%" },
          ],
        },
        {
          title: "Module 4 · Test, Iterate, and Final Project",
          items: [{ title: "Final Project: Research-backed redesign", score: "0/20 · 0%" }],
        },
      ],
    },
    note: SIX_SIGMA.progressTab.note,
    weeklyGoal: UX_RESEARCH_GOAL,
  },

  datesTab: {
    title: "Important Dates",
    missedAlert: SIX_SIGMA.datesTab.missedAlert,
    pastLabel: "Past",
    past: [
      {
        id: "course-starts",
        iso: "2026-09-07T00:00",
        date: "07 Sep 2026",
        time: "00:00 · your time",
        state: "complete",
        badges: [{ label: "COURSE", color: GRAY }],
        title: "Course starts",
        description: "Enrolment opened and all module content became available.",
      },
      {
        id: "graded-quiz-foundations",
        iso: "2026-09-21T23:59",
        date: "21 Sep 2026",
        time: "23:59 · your time",
        state: "overdue",
        badges: [
          { label: "DUE DATE", color: GRAY },
          { label: "GRADED QUIZ", color: GRAY },
          { label: "OVERDUE", color: "error" },
        ],
        title: "Module 1 · Graded Quiz: Research foundations",
        description: "Past due and not submitted yet.",
        link: "Open the assignment",
      },
    ],
    todayLabel: "Today · 24 Sep 2026",
    todayIso: "2026-09-24",
    upcomingLabel: "Upcoming",
    upcoming: [
      {
        id: "persona-research-draft",
        iso: "2026-09-24T23:59",
        date: "24 Sep 2026",
        time: "23:59 · your time",
        state: "upcoming",
        badges: [
          { label: "DUE DATE", color: GRAY },
          { label: "PEER ASSESSMENT", color: GRAY },
          { label: "DUE TODAY", color: "warning" },
        ],
        title: "Module 1 · Persona research draft",
        description: "Submit one persona with its evidence table, then review the draft of one peer.",
        link: "Open the assignment",
      },
      {
        id: "graded-quiz-define",
        iso: "2026-10-05T23:59",
        date: "05 Oct 2026",
        time: "23:59 · your time",
        state: "upcoming",
        badges: [
          { label: "DUE DATE", color: GRAY },
          { label: "GRADED QUIZ", color: GRAY },
          { label: "UPCOMING", color: GRAY },
        ],
        title: "Module 2 · Graded Quiz: Synthesis and problem framing",
        description: "Two attempts. The best one counts.",
      },
      {
        id: "prototype-critique",
        iso: "2026-10-16T23:59",
        date: "16 Oct 2026",
        time: "23:59 · your time",
        state: "upcoming",
        badges: [
          { label: "DUE DATE", color: GRAY },
          { label: "PEER ASSESSMENT", color: GRAY },
          { label: "UPCOMING", color: GRAY },
        ],
        title: "Module 3 · Prototype critique",
        description: "Submit your prototype and the questions it is meant to answer, then review one peer.",
      },
      {
        id: "graded-quiz-prototype",
        iso: "2026-10-18T23:59",
        date: "18 Oct 2026",
        time: "23:59 · your time",
        state: "upcoming",
        badges: [
          { label: "DUE DATE", color: GRAY },
          { label: "GRADED QUIZ", color: GRAY },
          { label: "UPCOMING", color: GRAY },
        ],
        title: "Module 3 · Graded Quiz: Ideate and prototype",
        description: "Two attempts. The best one counts.",
      },
      {
        id: "final-project",
        iso: "2026-10-30T23:59",
        date: "30 Oct 2026",
        time: "23:59 · your time",
        state: "locked",
        badges: [
          { label: "DUE DATE", color: GRAY },
          { label: "FINAL PROJECT", color: GRAY },
          { label: "LOCKED", color: GRAY },
        ],
        title: "Module 4 · Final Project: Research-backed redesign",
        description: "Unlocks when Module 3 is complete.",
      },
      {
        id: "certificate-available",
        iso: "2026-11-06T09:00",
        date: "06 Nov 2026",
        time: "09:00 · your time",
        state: "upcoming",
        badges: [{ label: "CERTIFICATE", color: GRAY }],
        title: "Certificate available",
        description: "Your certificate is issued after this date if you have a passing grade.",
      },
      {
        id: "course-ends",
        iso: "2027-12-31T23:59",
        date: "31 Dec 2027",
        time: "23:59 · your time",
        state: "upcoming",
        badges: [{ label: "COURSE", color: GRAY }],
        title: "Course ends",
        description: "After this date the course is archived — content stays readable, graded work closes.",
      },
    ],
    timezoneNote: SIX_SIGMA.datesTab.timezoneNote,
  },

  qaTab: {
    ...SIX_SIGMA.qaTab,
    threads: [
      {
        id: "interview-count",
        title: "How many interviews do I need for a first persona?",
        preview: "David: Stop when new interviews stop adding new themes.",
        meta: "yesterday  ·  4 replies",
        answered: true,
        following: true,
        unread: false,
        messages: [
          {
            id: "m1",
            from: "learner",
            author: "You",
            body: "The brief asks for at least three interviews of my own, or the five of the case study. Is three really enough for a persona?",
            time: "yesterday",
          },
          {
            id: "m2",
            from: "mentor",
            author: "David Chen",
            label: "STAFF",
            accepted: true,
            body: "For a draft, yes. The number matters less than the pattern: you stop when new interviews stop adding new themes. With three you will see the start of a pattern, and the draft should say so.",
            time: "yesterday",
          },
          {
            id: "m3",
            from: "learner",
            author: "You",
            body: "Two of my three participants do the same job. Is that a problem?",
            time: "yesterday",
          },
          {
            id: "m4",
            from: "mentor",
            author: "David Chen",
            label: "STAFF",
            body: "Say it in the evidence table. A persona that is open about a narrow sample is more useful than one that hides it. If you can, add one person in a different role before the final version.",
            time: "today",
          },
        ],
      },
      {
        id: "interview-friends",
        title: "Can I interview friends or colleagues for the draft?",
        preview: "David: Yes, if they really do the activity you are studying.",
        meta: "3 days ago  ·  2 replies  ·  1 unread",
        answered: true,
        following: false,
        unread: true,
      },
      {
        id: "leading-question",
        title: "Is “How do you feel about slow checkouts?” a leading question?",
        preview: "You: That makes sense, I will ask what happened instead.",
        meta: "last week  ·  3 replies",
        answered: true,
        following: false,
        unread: false,
      },
      {
        id: "peer-anonymous",
        title: "Is the peer assessment anonymous?",
        preview: "You: Asked today, no reply yet.",
        meta: "today  ·  1 reply",
        answered: false,
        following: false,
        unread: false,
      },
    ],
  },
};

const COURSES: CourseDetail[] = [SIX_SIGMA, CLOUD_COMPUTING, AI_CONTENT, UX_RESEARCH];

/**
 * The page of a course. Six Sigma, the IBM course and the two courses with content of their
 * own are written out above; every other course of the catalogue gets the Six Sigma sample
 * body under its own title, picture, progress and program (lib/platform/catalog).
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
