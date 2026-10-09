import { GRAY, SIX_SIGMA, THIS_WEEK, modulesFromOutline, playerHref, week } from "@/lib/courses/kit";
import type { CourseDetail, WeeklyGoal } from "@/lib/courses/kit";
import { outline } from "./outline";

/**
 * "Business Analytics with Python": a stand-alone course of My Learning, not started. Its
 * figures follow the My Learning card: no progress (0 of 44 topics), first up the reading
 * "Python environment setup". The card gives no total effort, only "Starts Oct 14": the
 * 15 hours here are the sum of the outline, and the start is 14 Oct 2026, three weeks after
 * today (24 Sep 2026, the day of the Dashboard). The content is open before
 * then, which is why the card offers Start; the due dates count from the start date.
 */
const WEEKLY_GOAL: WeeklyGoal = {
  state: "set",
  title: "Your weekly goal",
  body: "A day counts when you open any lesson in this course.",
  week: THIS_WEEK,
  days: week(["missed", "missed", "missed", "today", "upcoming", "upcoming", "upcoming"]),
  count: "0 of 3 days this week",
  lastWeek: "Last week: 0 of 3",
  plan: "Regular · 3 days a week.",
};

export const page: CourseDetail = {
  slug: outline.slug,
  title: outline.title,
  imageSrc: "/platform/covers/business-analytics-with-python.jpg",
  partners: [],
  deliveryMode: "Flexible Learning",
  difficulty: "Advanced",
  stats: { structure: "5 modules · 44 topics", duration: "~ 15 hours", org: "SkillUp · BAP-01" },
  progress: {
    percent: 0,
    label: "Course progress",
    eyebrow: "Start with the first topic",
    cta: "Start course",
    href: playerHref(outline),
    notPassing: "Not started · 0% of 70%",
    done: "0 of 44 topics",
    timeLeft: "~ 15h left",
  },
  search: SIX_SIGMA.search,

  update: {
    title: "Course update",
    body: "The due dates of this course count from 14 Oct 2026. The content is already open, so you can set up Python and work through Module 1 before then. The sales sample used in every module is in Handouts.",
  },
  intro: {
    title: "What you'll learn",
    lead: "Five modules that take a business question from a raw export to a recommendation: pandas for loading and cleaning data, exploration and charts, regression, forecasting and segmentation with scikit-learn, and a capstone review of pricing and retention. You should already be comfortable with spreadsheets and basic statistics. Work through the modules at your own pace.",
  },
  modules: modulesFromOutline(outline, [
    { duration: "2h 25m", defaultOpen: true },
    { duration: "3h 17m" },
    { duration: "2h 35m" },
    { duration: "3h 33m" },
    { duration: "3h 10m", lockReason: "Complete “Module 4 · Models for Business Decisions” to unlock" },
  ]),
  mentor: SIX_SIGMA.mentor,
  team: {
    label: "Course team",
    people: [
      { name: "Dr. Ifeoma Adeyemi", role: "Lead instructor · SkillUp" },
      { name: "Lucas Moreau", role: "Mentor · SkillUp" },
      { name: "Priya Raman", role: "Course author · SkillUp" },
    ],
    cta: "Ask the course team",
  },
  weeklyGoal: WEEKLY_GOAL,
  certificate: {
    status: "not-earned",
    courseId: outline.slug,
    courseLabel: outline.title,
    title: "Not earned yet, keep on track!",
    requirements: [
      { title: "Reach the passing grade", detail: "0% now · 70% needed", percent: 0 },
      { title: "Complete the course content", detail: "0 of 44 topics · 0%", percent: 0 },
    ],
  },
  handouts: {
    label: "Handouts",
    items: [
      "Environment setup checklist (PDF)",
      "Sales sample: orders, customers and products (ZIP)",
      "pandas quick reference (PDF)",
      "Starter notebooks for Modules 1 to 4 (ZIP)",
    ],
  },
  upcomingDates: {
    label: "Upcoming dates",
    items: [
      {
        id: "course-starts",
        iso: "2026-10-14",
        day: "28",
        month: "APR",
        title: "Course starts",
        detail: "Due dates count from this day",
        relative: "In 20 days",
        relativeColor: "gray",
      },
      {
        id: "graded-quiz-foundations",
        iso: "2026-10-25",
        day: "09",
        month: "MAY",
        title: "Graded Quiz: Python and pandas foundations",
        detail: "Assignment due · 23:59 your time",
        relative: "In 31 days",
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
      counts: "0 complete · 36 incomplete · 8 locked",
      percent: 0,
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
        { type: "Graded Quiz", weight: "20%", grade: "0%", weighted: "0%" },
        { type: "Homework", weight: "30%", grade: "0%", weighted: "0%" },
        { type: "Capstone Project", weight: "35%", grade: "0%", weighted: "0%" },
        { type: "Final Assessment", weight: "15%", grade: "0%", weighted: "0%" },
      ],
      sections: [
        {
          title: "Module 1 · Python for Analysts",
          items: [{ title: "Graded Quiz: Python and pandas foundations", score: "0/3 · 0%" }],
        },
        {
          title: "Module 2 · Cleaning and Reshaping Business Data",
          items: [{ title: "Assignment 01 · Clean and summarise a sales dataset", score: "0/100 · 0%" }],
        },
        {
          title: "Module 3 · Exploring and Visualising",
          items: [{ title: "Graded Quiz: Exploration and visualisation", score: "0/3 · 0%" }],
        },
        {
          title: "Module 4 · Models for Business Decisions",
          items: [{ title: "Assignment 02 · Demand forecast with a baseline", score: "0/100 · 0%" }],
        },
        {
          title: "Module 5 · Capstone: From Analysis to Recommendation",
          items: [
            { title: "Capstone Project: Pricing and retention review", score: "0/20 · 0%" },
            { title: "Final Assessment", score: "0/3 · 0%" },
          ],
        },
      ],
    },
    note: SIX_SIGMA.progressTab.note,
    weeklyGoal: WEEKLY_GOAL,
  },

  datesTab: {
    title: "Important Dates",
    // No missed-deadline alert: the schedule has not started.
    pastLabel: "Past",
    past: [
      {
        id: "enrolled",
        iso: "2026-09-14T10:20",
        date: "14 Sep 2026",
        time: "10:20 · your time",
        state: "complete",
        badges: [{ label: "COURSE", color: GRAY }],
        title: "You enrolled",
        description: "The course content opened for you on this day.",
      },
    ],
    todayLabel: "Today · 24 Sep 2026",
    todayIso: "2026-09-24",
    upcomingLabel: "Upcoming",
    upcoming: [
      {
        id: "course-starts",
        iso: "2026-10-14T00:00",
        date: "14 Oct 2026",
        time: "00:00 · your time",
        state: "upcoming",
        badges: [{ label: "COURSE", color: GRAY }],
        title: "Course starts",
        description: "The due dates below count from this day. You can start the content earlier.",
      },
      {
        id: "graded-quiz-foundations",
        iso: "2026-10-25T23:59",
        date: "25 Oct 2026",
        time: "23:59 · your time",
        state: "upcoming",
        badges: [
          { label: "DUE DATE", color: GRAY },
          { label: "GRADED QUIZ", color: GRAY },
          { label: "UPCOMING", color: GRAY },
        ],
        title: "Module 1 · Graded Quiz: Python and pandas foundations",
        description: "Two attempts. The best one counts.",
      },
      {
        id: "assignment-01",
        iso: "2026-11-08T23:59",
        date: "08 Nov 2026",
        time: "23:59 · your time",
        state: "upcoming",
        badges: [
          { label: "DUE DATE", color: GRAY },
          { label: "HOMEWORK", color: GRAY },
          { label: "UPCOMING", color: GRAY },
        ],
        title: "Module 2 · Assignment 01 · Clean and summarise a sales dataset",
        description: "A notebook that cleans the orders export and answers three questions about it.",
      },
      {
        id: "graded-quiz-exploration",
        iso: "2026-11-22T23:59",
        date: "22 Nov 2026",
        time: "23:59 · your time",
        state: "upcoming",
        badges: [
          { label: "DUE DATE", color: GRAY },
          { label: "GRADED QUIZ", color: GRAY },
          { label: "UPCOMING", color: GRAY },
        ],
        title: "Module 3 · Graded Quiz: Exploration and visualisation",
        description: "Two attempts. The best one counts.",
      },
      {
        id: "assignment-02",
        iso: "2026-12-06T23:59",
        date: "06 Dec 2026",
        time: "23:59 · your time",
        state: "upcoming",
        badges: [
          { label: "DUE DATE", color: GRAY },
          { label: "HOMEWORK", color: GRAY },
          { label: "UPCOMING", color: GRAY },
        ],
        title: "Module 4 · Assignment 02 · Demand forecast with a baseline",
        description: "A twelve-week forecast compared with a naive baseline on held-out weeks.",
      },
      {
        id: "capstone-project",
        iso: "2026-12-20T23:59",
        date: "20 Dec 2026",
        time: "23:59 · your time",
        state: "locked",
        badges: [
          { label: "DUE DATE", color: GRAY },
          { label: "FINAL PROJECT", color: GRAY },
          { label: "LOCKED", color: GRAY },
        ],
        title: "Module 5 · Capstone Project: Pricing and retention review",
        description: "Unlocks when Module 4 is complete. You then review the notebooks of two peers.",
      },
      {
        id: "final-assessment",
        iso: "2026-12-23T23:59",
        date: "23 Dec 2026",
        time: "23:59 · your time",
        state: "locked",
        badges: [
          { label: "DUE DATE", color: GRAY },
          { label: "FINAL EXAM", color: GRAY },
          { label: "LOCKED", color: GRAY },
        ],
        title: "Module 5 · Final Assessment",
        description: "Unlocks when Module 4 is complete. One attempt.",
      },
      {
        id: "certificate-available",
        iso: "2026-12-28T09:00",
        date: "28 Dec 2026",
        time: "09:00 · your time",
        state: "upcoming",
        badges: [{ label: "CERTIFICATE", color: GRAY }],
        title: "Certificate available",
        description: "Your certificate is issued after this date if you have a passing grade.",
      },
      {
        id: "course-ends",
        iso: "2027-10-17T23:59",
        date: "17 Oct 2027",
        time: "23:59 · your time",
        state: "upcoming",
        badges: [{ label: "COURSE", color: GRAY }],
        title: "Course ends",
        description: "After this date the course is archived: content stays readable, graded work closes.",
      },
    ],
    timezoneNote: SIX_SIGMA.datesTab.timezoneNote,
  },

  qaTab: {
    ...SIX_SIGMA.qaTab,
    threads: [
      {
        id: "python-version",
        title: "Which Python version do I need, and can I keep the one I already have?",
        preview: "Lucas: 3.11 or later, in its own environment, beside the one you have.",
        meta: "yesterday  ·  4 replies",
        answered: true,
        following: true,
        unread: false,
        messages: [
          {
            id: "m1",
            from: "learner",
            author: "You",
            body: "I have not started the course yet and want to prepare my laptop. It already has Python 3.9 from another project. Do I need to replace it?",
            time: "2 days ago",
          },
          {
            id: "m2",
            from: "mentor",
            author: "Lucas Moreau",
            label: "STAFF",
            accepted: true,
            body: "Keep it. The course needs Python 3.11 or later, but you install it in a separate environment, so your other project is not touched. The first reading, “Python environment setup”, walks through it and ends with a check you can run.",
            time: "2 days ago",
          },
          {
            id: "m3",
            from: "learner",
            author: "You",
            body: "And if my work laptop does not let me install anything?",
            time: "yesterday",
          },
          {
            id: "m4",
            from: "mentor",
            author: "Lucas Moreau",
            label: "STAFF",
            body: "Then use a hosted notebook service for the course. The same reading lists what it must offer: Python 3.11, pandas 2 and file upload. The starter notebooks run unchanged there. Do not upload data from your employer to it.",
            time: "yesterday",
          },
        ],
      },
      {
        id: "prior-knowledge",
        title: "How much Python should I know before starting an Advanced course?",
        preview: "Lucas: Variables, loops and functions. Module 1 refreshes the rest.",
        meta: "5 days ago  ·  2 replies  ·  1 unread",
        answered: true,
        following: false,
        unread: true,
      },
      {
        id: "start-before-date",
        title: "The course starts on 14 Oct. Can I begin the content now?",
        preview: "You: Good, I will start with the setup this week.",
        meta: "last week  ·  3 replies",
        answered: true,
        following: false,
        unread: false,
      },
      {
        id: "own-data",
        title: "Can I use my company's data for the capstone?",
        preview: "You: Asked today, no reply yet.",
        meta: "today  ·  1 reply",
        answered: false,
        following: false,
        unread: false,
      },
    ],
    mentorLine: "Lucas Moreau · your mentor · typically responds within 1 day",
  },
};
