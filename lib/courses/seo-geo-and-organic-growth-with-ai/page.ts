import { GRAY, SIX_SIGMA, THIS_WEEK, modulesFromOutline, playerHref, week } from "@/lib/courses/kit";
import type { CourseDetail, WeeklyGoal } from "@/lib/courses/kit";
import { outline } from "./outline";

/**
 * "SEO, GEO, and Organic Growth with AI": course 3 of 7 of the AI Augmented Digital
 * Marketing program, not started. Its figures follow its row in the program file
 * (lib/programs/ai-driven-digital-marketing): 4 modules, 43 topics, about 13 hours, nothing
 * done. Today is 24 Sep 2026. The learner is still in course 2, whose certificate date is
 * 12 Oct 2026, so the dates below follow the suggested pace: this course from 13 Oct 2026.
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
  imageSrc: "/platform/covers/program-course-3-seo-geo-organic-growth.jpg",
  partners: [],
  deliveryMode: "Flexible Learning",
  difficulty: "Beginner",
  stats: { structure: "4 modules · 43 topics", duration: "~ 13 hours", org: "SkillUp · ADM-03" },
  progress: {
    percent: 0,
    label: "Course progress",
    eyebrow: "Go to first topic",
    cta: "Start course",
    href: playerHref(outline),
    notPassing: "Not passing yet · 0% of 70%",
    done: "0 of 43 topics",
    timeLeft: "~ 13h left",
  },
  search: SIX_SIGMA.search,
  program: {
    slug: "ai-driven-digital-marketing",
    title: "Certificate Program in AI Augmented Digital Marketing",
  },

  update: {
    title: "Course update",
    body: "This course is open and you can start it at any time. The suggested pace of the program places it after course 2, from 13 October 2026. The sample site used in the assignments is in Handouts.",
  },
  intro: {
    title: "What you'll learn",
    lead: "Four modules on being found without paying for the click: how search works and which keywords to go after, the pages and the site behind them, generative engine optimization with authority and measurement, and a final organic growth plan. Work through them at your own pace.",
  },
  modules: modulesFromOutline(outline, [
    { duration: "3h 09m", defaultOpen: true },
    { duration: "3h 41m" },
    { duration: "2h 58m" },
    { duration: "3h 14m", lockReason: "Complete “Module 3 · GEO, Authority and Measurement” to unlock" },
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
      { title: "Complete the course content", detail: "0 of 43 topics · 0%", percent: 0 },
    ],
  },
  handouts: {
    label: "Handouts",
    items: [
      "Keyword map template (XLSX)",
      "On-page audit checklist (PDF)",
      "Content brief template for search (DOCX)",
      "Sample site: pages and search report (ZIP)",
    ],
  },
  upcomingDates: {
    label: "Upcoming dates",
    items: [
      {
        id: "suggested-start",
        iso: "2026-10-13",
        day: "13",
        month: "OCT",
        title: "Suggested start",
        detail: "The day after the certificate date of course 2",
        relative: "In 19 days",
        relativeColor: "gray",
      },
      {
        id: "assignment-01",
        iso: "2026-10-25",
        day: "25",
        month: "OCT",
        title: "Assignment 01 · Keyword map",
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
      counts: "0 complete · 37 incomplete · 6 locked",
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
          title: "Module 1 · How Search Works & Keyword Strategy",
          items: [
            { title: "Assignment 01 · Keyword map", score: "0/100 · 0%" },
            { title: "Graded Quiz: Search and keyword strategy", score: "0/3 · 0%" },
          ],
        },
        {
          title: "Module 2 · On-Page, Technical and Content SEO",
          items: [{ title: "Assignment 02 · On-page audit", score: "0/100 · 0%" }],
        },
        {
          title: "Module 3 · GEO, Authority and Measurement",
          items: [{ title: "Graded Quiz: GEO, authority and measurement", score: "0/3 · 0%" }],
        },
        {
          title: "Module 4 · Final Project, Assessment, and Wrap-Up",
          items: [
            { title: "Final Project: Organic growth plan", score: "0/20 · 0%" },
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
    // No missed-deadline alert: the course is not started and nothing is due yet.
    pastLabel: "Past",
    past: [
      {
        id: "enrolled",
        iso: "2026-06-27T00:00",
        date: "27 Jun 2026",
        time: "00:00 · your time",
        state: "complete",
        badges: [{ label: "COURSE", color: GRAY }],
        title: "Enrolled with the program",
        description: "You were enrolled in every course of the program on the day it started.",
      },
    ],
    todayLabel: "Today · 24 Sep 2026",
    todayIso: "2026-09-24",
    upcomingLabel: "Upcoming",
    upcoming: [
      {
        id: "suggested-start",
        iso: "2026-10-13T00:00",
        date: "13 Oct 2026",
        time: "00:00 · your time",
        state: "upcoming",
        badges: [{ label: "COURSE", color: GRAY }],
        title: "Suggested start",
        description: "The day after the certificate date of course 2. The course is open now, and the due dates below follow this start.",
      },
      {
        id: "assignment-01",
        iso: "2026-10-25T23:59",
        date: "25 Oct 2026",
        time: "23:59 · your time",
        state: "upcoming",
        badges: [
          { label: "DUE DATE", color: GRAY },
          { label: "HOMEWORK", color: GRAY },
          { label: "UPCOMING", color: GRAY },
        ],
        title: "Module 1 · Assignment 01 · Keyword map",
        description: "Thirty keywords for the sample site, grouped into clusters, each with its intent and a target page.",
        link: "Open the assignment",
      },
      {
        id: "graded-quiz-search",
        iso: "2026-10-27T23:59",
        date: "27 Oct 2026",
        time: "23:59 · your time",
        state: "upcoming",
        badges: [
          { label: "DUE DATE", color: GRAY },
          { label: "GRADED QUIZ", color: GRAY },
          { label: "UPCOMING", color: GRAY },
        ],
        title: "Module 1 · Graded Quiz: Search and keyword strategy",
        description: "Two attempts. The best one counts.",
      },
      {
        id: "assignment-02",
        iso: "2026-11-08T23:59",
        date: "08 Nov 2026",
        time: "23:59 · your time",
        state: "upcoming",
        badges: [
          { label: "DUE DATE", color: GRAY },
          { label: "HOMEWORK", color: GRAY },
          { label: "UPCOMING", color: GRAY },
        ],
        title: "Module 2 · Assignment 02 · On-page audit",
        description: "An audit of three pages of the sample site, with the five fixes you would make first.",
        link: "Open the assignment",
      },
      {
        id: "graded-quiz-geo",
        iso: "2026-11-15T23:59",
        date: "15 Nov 2026",
        time: "23:59 · your time",
        state: "upcoming",
        badges: [
          { label: "DUE DATE", color: GRAY },
          { label: "GRADED QUIZ", color: GRAY },
          { label: "UPCOMING", color: GRAY },
        ],
        title: "Module 3 · Graded Quiz: GEO, authority and measurement",
        description: "Two attempts. The best one counts.",
      },
      {
        id: "final-project",
        iso: "2026-11-22T23:59",
        date: "22 Nov 2026",
        time: "23:59 · your time",
        state: "locked",
        badges: [
          { label: "DUE DATE", color: GRAY },
          { label: "FINAL PROJECT", color: GRAY },
          { label: "LOCKED", color: GRAY },
        ],
        title: "Module 4 · Final Project: Organic growth plan",
        description: "Unlocks when Module 3 is complete.",
      },
      {
        id: "final-assessment",
        iso: "2026-11-23T23:59",
        date: "23 Nov 2026",
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
        iso: "2026-11-24T09:00",
        date: "24 Nov 2026",
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
        id: "own-website",
        title: "Do I need a website of my own for this course?",
        preview: "Marcus: No. Every exercise can be done on the sample site.",
        meta: "3 days ago  ·  2 replies",
        answered: true,
        following: true,
        unread: false,
        messages: [
          {
            id: "m1",
            from: "learner",
            author: "You",
            body: "I am about to finish course 2 and I am looking ahead. I do not run a website. Can I still do the keyword map and the on-page audit?",
            time: "3 days ago",
          },
          {
            id: "m2",
            from: "mentor",
            author: "Marcus Lee",
            label: "STAFF",
            accepted: true,
            body: "Yes. The Handouts include a sample site for a small online plant shop: its pages and three months of its search report. Both assignments and the final project can be done on it. If you do have a site, you may use it instead, as long as you can see its search report.",
            time: "2 days ago",
          },
        ],
      },
      {
        id: "paid-seo-tools",
        title: "Will I have to pay for a keyword tool?",
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
