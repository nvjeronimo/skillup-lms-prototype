import { GRAY, SIX_SIGMA, THIS_WEEK, modulesFromOutline, playerHref, week } from "@/lib/courses/kit";
import type { CourseDetail, WeeklyGoal } from "@/lib/courses/kit";
import { outline } from "./outline";

/**
 * "Email, CRM, and Lifecycle Marketing with AI": course 6 of 7 of the AI Augmented Digital
 * Marketing program, not started. Its figures follow its row on the Program page
 * (lib/programs/ai-driven-digital-marketing): 3 modules, 34 topics, about 10 hours, no
 * progress, next up "Course Introduction". Nothing is done, graded or overdue. Today is
 * 24 Sep 2026; the due dates are those of the suggested pace of the program, which reaches
 * this course on 8 Mar 2027 (sample data: the program file gives only its start and end).
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
  imageSrc: "/platform/covers/program-course-6-email-crm-lifecycle.jpg",
  partners: [],
  deliveryMode: "Flexible Learning",
  difficulty: "Beginner",
  stats: { structure: "3 modules · 34 topics", duration: "~ 10 hours", org: "SkillUp · ADM-06" },
  progress: {
    percent: 0,
    label: "Course progress",
    eyebrow: "Start with the first topic",
    cta: "Start course",
    href: playerHref(outline),
    notPassing: "Not passing yet · 0% of 70%",
    done: "0 of 34 topics",
    timeLeft: "~ 10h left",
  },
  search: SIX_SIGMA.search,
  program: {
    slug: "ai-driven-digital-marketing",
    title: "Certificate Program in AI Augmented Digital Marketing",
  },

  update: {
    title: "Course update",
    body: "You do not need an email platform or a CRM account for this course. The sample contact list of 500 records and the flow templates used in both assignments are in Handouts.",
  },
  intro: {
    title: "What you'll learn",
    lead: "Three modules on the messages you send to people who asked for them: how email reaches the inbox and gets opened, how a CRM lets you segment and automate, and how AI helps you personalise and test. The course ends with a lifecycle email plan of your own. Work through it at your own pace.",
  },
  modules: modulesFromOutline(outline, [
    { duration: "3h 07m", defaultOpen: true },
    { duration: "3h 25m" },
    { duration: "3h 38m", lockReason: "Complete Module 2 to unlock" },
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
  weeklyGoal: WEEKLY_GOAL,
  certificate: {
    status: "not-earned",
    courseId: outline.slug,
    courseLabel: outline.title,
    title: "Not earned yet, keep on track!",
    requirements: [
      { title: "Reach the passing grade", detail: "0% now · 70% needed", percent: 0 },
      { title: "Complete the course content", detail: "0 of 34 topics · 0%", percent: 0 },
    ],
  },
  handouts: {
    label: "Handouts",
    items: [
      "Deliverability checklist (PDF)",
      "Sample contact list, 500 records (CSV)",
      "Flow templates: welcome, abandoned cart, win-back (PDF)",
      "Lifecycle map template (XLSX)",
    ],
  },
  upcomingDates: {
    label: "Upcoming dates",
    items: [
      {
        id: "suggested-start",
        iso: "2027-03-08",
        day: "01",
        month: "FEB",
        title: "Suggested start",
        detail: "Program pace · after course 5",
        relative: "In 5 months",
        relativeColor: "gray",
      },
      {
        id: "assignment-01",
        iso: "2027-03-14",
        day: "07",
        month: "FEB",
        title: "Assignment 01 · Welcome series",
        detail: "Assignment due · 23:59 your time",
        relative: "In 5 months",
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
      counts: "0 complete · 24 incomplete · 10 locked",
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
      // Two homework assignments, two graded quizzes, the final project and the final
      // assessment. Nothing is submitted yet.
      rows: [
        { type: "Homework", weight: "40%", grade: "0%", weighted: "0%" },
        { type: "Graded Quiz", weight: "20%", grade: "0%", weighted: "0%" },
        { type: "Final Project", weight: "25%", grade: "0%", weighted: "0%" },
        { type: "Final Assessment", weight: "15%", grade: "0%", weighted: "0%" },
      ],
      sections: [
        {
          title: "Module 1 · Email Foundations & Deliverability",
          items: [
            { title: "Assignment 01 · Welcome series", score: "0/100 · 0%" },
            { title: "Graded Quiz: Email foundations", score: "0/3 · 0%" },
          ],
        },
        {
          title: "Module 2 · CRM, Segmentation & Lifecycle Automation",
          items: [
            { title: "Assignment 02 · Lifecycle map and segments", score: "0/100 · 0%" },
            { title: "Graded Quiz: CRM and automation", score: "0/3 · 0%" },
          ],
        },
        {
          title: "Module 3 · AI Personalisation, Final Project, and Wrap-Up",
          items: [
            { title: "Final Project: Lifecycle email plan", score: "0/20 · 0%" },
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
    // No missed-deadline alert: the course is not started and nothing is due before February.
    pastLabel: "Past",
    past: [
      {
        id: "course-opens",
        iso: "2026-06-27T00:00",
        date: "27 Jun 2026",
        time: "00:00 · your time",
        state: "complete",
        badges: [{ label: "COURSE", color: GRAY }],
        title: "Course opens",
        description: "Open since the program started. You can begin before the suggested date.",
      },
    ],
    todayLabel: "Today · 24 Sep 2026",
    todayIso: "2026-09-24",
    upcomingLabel: "Upcoming",
    upcoming: [
      {
        id: "suggested-start",
        iso: "2027-03-08T00:00",
        date: "08 Mar 2027",
        time: "00:00 · your time",
        state: "upcoming",
        badges: [{ label: "COURSE", color: GRAY }],
        title: "Suggested start",
        description: "The pace of the program reaches course 6 on this date. The due dates below follow from it.",
      },
      {
        id: "assignment-01",
        iso: "2027-03-14T23:59",
        date: "14 Mar 2027",
        time: "23:59 · your time",
        state: "upcoming",
        badges: [
          { label: "DUE DATE", color: GRAY },
          { label: "HOMEWORK", color: GRAY },
          { label: "UPCOMING", color: GRAY },
        ],
        title: "Module 1 · Assignment 01 · Welcome series",
        description: "Three emails for a new subscriber, with the brief, the prompt and the edited draft of each.",
      },
      {
        id: "graded-quiz-foundations",
        iso: "2027-03-16T23:59",
        date: "16 Mar 2027",
        time: "23:59 · your time",
        state: "upcoming",
        badges: [
          { label: "DUE DATE", color: GRAY },
          { label: "GRADED QUIZ", color: GRAY },
          { label: "UPCOMING", color: GRAY },
        ],
        title: "Module 1 · Graded Quiz: Email foundations",
        description: "Two attempts. The best one counts.",
      },
      {
        id: "assignment-02",
        iso: "2027-03-23T23:59",
        date: "23 Mar 2027",
        time: "23:59 · your time",
        state: "upcoming",
        badges: [
          { label: "DUE DATE", color: GRAY },
          { label: "HOMEWORK", color: GRAY },
          { label: "UPCOMING", color: GRAY },
        ],
        title: "Module 2 · Assignment 02 · Lifecycle map and segments",
        description: "The stages of one customer journey, the segment at each stage and the flow that serves it.",
      },
      {
        id: "graded-quiz-crm",
        iso: "2027-03-25T23:59",
        date: "25 Mar 2027",
        time: "23:59 · your time",
        state: "upcoming",
        badges: [
          { label: "DUE DATE", color: GRAY },
          { label: "GRADED QUIZ", color: GRAY },
          { label: "UPCOMING", color: GRAY },
        ],
        title: "Module 2 · Graded Quiz: CRM and automation",
        description: "Two attempts. The best one counts.",
      },
      {
        id: "final-project",
        iso: "2027-04-02T23:59",
        date: "02 Apr 2027",
        time: "23:59 · your time",
        state: "locked",
        badges: [
          { label: "DUE DATE", color: GRAY },
          { label: "FINAL PROJECT", color: GRAY },
          { label: "LOCKED", color: GRAY },
        ],
        title: "Module 3 · Final Project: Lifecycle email plan",
        description: "Unlocks when Module 2 is complete.",
      },
      {
        id: "final-assessment",
        iso: "2027-04-04T23:59",
        date: "04 Apr 2027",
        time: "23:59 · your time",
        state: "locked",
        badges: [
          { label: "DUE DATE", color: GRAY },
          { label: "FINAL EXAM", color: GRAY },
          { label: "LOCKED", color: GRAY },
        ],
        title: "Module 3 · Final Assessment",
        description: "Unlocks when Module 2 is complete. One attempt.",
      },
      {
        id: "certificate-available",
        iso: "2027-04-05T09:00",
        date: "05 Apr 2027",
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
        id: "no-email-platform",
        title: "I have never used an email platform or a CRM. Is that a problem?",
        preview: "Marcus: No. The course works from files, not from a tool.",
        meta: "2 days ago  ·  3 replies",
        answered: true,
        following: true,
        unread: false,
        messages: [
          {
            id: "m1",
            from: "learner",
            author: "You",
            body: "Looking ahead to course 6: I have written newsletters, but I have never set up a flow or worked in a CRM. Should I open a trial account somewhere before I start?",
            time: "2 days ago",
          },
          {
            id: "m2",
            from: "mentor",
            author: "Marcus Lee",
            label: "STAFF",
            accepted: true,
            body: "There is no need. The course teaches the ideas that every tool shares: contacts and properties, segments, triggers, delays and exits. You build segments from a sample contact list in a spreadsheet and you draw flows on a template. If you later use a real platform, you will recognise each part.",
            time: "2 days ago",
          },
          {
            id: "m3",
            from: "learner",
            author: "You",
            body: "That helps. Can I use my own subscriber list for the assignments?",
            time: "yesterday",
          },
          {
            id: "m4",
            from: "mentor",
            author: "Marcus Lee",
            label: "STAFF",
            body: "Use the sample list for anything you submit. Real contacts are personal data, and a peer will read your final project. You can apply the same steps to your own list in private.",
            time: "yesterday",
          },
        ],
      },
      {
        id: "course-5-first",
        title: "Do I have to finish course 5 before this one?",
        preview: "Marcus: It is the suggested order, not a lock.",
        meta: "5 days ago  ·  2 replies  ·  1 unread",
        answered: true,
        following: false,
        unread: true,
      },
      {
        id: "final-project-scope",
        title: "How many emails does the final project need?",
        preview: "You: Asked today, no reply yet.",
        meta: "today  ·  1 reply",
        answered: false,
        following: false,
        unread: false,
      },
    ],
    mentorLine: "Marcus Lee · your mentor · typically responds within 1 day",
  },
};
