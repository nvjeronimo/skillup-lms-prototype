import type { BadgeColor } from "@/components/atoms/Badge";
import type { CourseDetail, WeekDayState, WeeklyGoal } from "@/lib/platform/course-detail";

/**
 * The Six Sigma course page, the original sample, and the IBM course built on it. They sit
 * here, below the course folders, because a course page borrows the parts it does not
 * rewrite from `SIX_SIGMA` (lib/courses/kit). Read through lib/platform/course-detail.
 */

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

export function week(states: WeekDayState[]): WeeklyGoal["days"] {
  return WEEK_LABELS.map((day, index) => ({ ...day, state: states[index] }));
}

export const GRAY: BadgeColor = "gray";

export const SIX_SIGMA: CourseDetail = {
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
export const CLOUD_COMPUTING: CourseDetail = {
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
