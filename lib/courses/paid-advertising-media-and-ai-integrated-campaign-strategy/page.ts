import { GRAY, SIX_SIGMA, THIS_WEEK, modulesFromOutline, playerHref, week } from "@/lib/courses/kit";
import type { CourseDetail, WeeklyGoal } from "@/lib/courses/kit";
import { outline } from "./outline";

/**
 * "Paid Advertising, Media & AI-Integrated Campaign Strategy": course 4 of 7 of the AI
 * Augmented Digital Marketing program, not started. Its figures follow its row in the
 * program file (lib/programs/ai-driven-digital-marketing): 4 modules, 54 topics, about 15
 * hours, nothing done. Today is 24 Sep 2026. The dates follow the suggested pace of the
 * program: this course after course 3, whose certificate date is 24 Nov 2026, so from
 * 25 Nov 2026.
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
  imageSrc: "/platform/covers/program-course-4-paid-advertising.jpg",
  partners: [],
  deliveryMode: "Flexible Learning",
  difficulty: "Beginner",
  stats: { structure: "4 modules · 54 topics", duration: "~ 15 hours", org: "SkillUp · ADM-04" },
  progress: {
    percent: 0,
    label: "Course progress",
    eyebrow: "Go to first topic",
    cta: "Start course",
    href: playerHref(outline),
    notPassing: "Not passing yet · 0% of 70%",
    done: "0 of 54 topics",
    timeLeft: "~ 15h left",
  },
  search: SIX_SIGMA.search,
  program: {
    slug: "ai-driven-digital-marketing",
    title: "Certificate Program in AI Augmented Digital Marketing",
  },

  update: {
    title: "Course update",
    body: "This course is open and you can start it at any time. The suggested pace of the program places it after course 3, from 25 November 2026. You do not need an advertising account or a budget: the sample account and its reports are in Handouts.",
  },
  intro: {
    title: "What you'll learn",
    lead: "Four modules on buying attention carefully: how ad auctions work and how to build a search campaign, social, display and video with a media plan across them, measurement, testing and automated campaigns with guardrails, and a final integrated campaign plan. Work through them at your own pace.",
  },
  modules: modulesFromOutline(outline, [
    { duration: "4h 05m", defaultOpen: true },
    { duration: "4h 10m" },
    { duration: "3h 37m" },
    {
      duration: "3h 14m",
      lockReason: "Complete “Module 3 · Measurement, Optimization & AI-Integrated Strategy” to unlock",
    },
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
      { title: "Complete the course content", detail: "0 of 54 topics · 0%", percent: 0 },
    ],
  },
  handouts: {
    label: "Handouts",
    items: [
      "Search campaign plan template (XLSX)",
      "Media plan template (XLSX)",
      "Creative brief template for paid social (DOCX)",
      "Sample ad account: reports for three months (ZIP)",
    ],
  },
  upcomingDates: {
    label: "Upcoming dates",
    items: [
      {
        id: "suggested-start",
        iso: "2026-11-25",
        day: "25",
        month: "NOV",
        title: "Suggested start",
        detail: "The day after the certificate date of course 3",
        relative: "In 62 days",
        relativeColor: "gray",
      },
      {
        id: "assignment-01",
        iso: "2026-12-06",
        day: "06",
        month: "DEC",
        title: "Assignment 01 · Search campaign plan",
        detail: "Assignment due · 23:59 your time",
        relative: "In 73 days",
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
      counts: "0 complete · 48 incomplete · 6 locked",
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
          title: "Module 1 · Paid Media Foundations & Search Advertising",
          items: [
            { title: "Assignment 01 · Search campaign plan", score: "0/100 · 0%" },
            { title: "Graded Quiz: Paid media foundations", score: "0/3 · 0%" },
          ],
        },
        {
          title: "Module 2 · Social, Display and Video Advertising",
          items: [{ title: "Assignment 02 · Paid social campaign brief", score: "0/100 · 0%" }],
        },
        {
          title: "Module 3 · Measurement, Optimization & AI-Integrated Strategy",
          items: [{ title: "Graded Quiz: Measurement and AI-integrated strategy", score: "0/3 · 0%" }],
        },
        {
          title: "Module 4 · Final Project, Assessment, and Wrap-Up",
          items: [
            { title: "Final Project: Integrated campaign plan", score: "0/20 · 0%" },
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
        iso: "2026-11-25T00:00",
        date: "25 Nov 2026",
        time: "00:00 · your time",
        state: "upcoming",
        badges: [{ label: "COURSE", color: GRAY }],
        title: "Suggested start",
        description: "The day after the certificate date of course 3. The course is open now, and the due dates below follow this start.",
      },
      {
        id: "assignment-01",
        iso: "2026-12-06T23:59",
        date: "06 Dec 2026",
        time: "23:59 · your time",
        state: "upcoming",
        badges: [
          { label: "DUE DATE", color: GRAY },
          { label: "HOMEWORK", color: GRAY },
          { label: "UPCOMING", color: GRAY },
        ],
        title: "Module 1 · Assignment 01 · Search campaign plan",
        description: "One campaign for the sample shop: three ad groups, their keywords and negatives, two ads each and a monthly budget.",
        link: "Open the assignment",
      },
      {
        id: "graded-quiz-foundations",
        iso: "2026-12-08T23:59",
        date: "08 Dec 2026",
        time: "23:59 · your time",
        state: "upcoming",
        badges: [
          { label: "DUE DATE", color: GRAY },
          { label: "GRADED QUIZ", color: GRAY },
          { label: "UPCOMING", color: GRAY },
        ],
        title: "Module 1 · Graded Quiz: Paid media foundations",
        description: "Two attempts. The best one counts.",
      },
      {
        id: "assignment-02",
        iso: "2026-12-20T23:59",
        date: "20 Dec 2026",
        time: "23:59 · your time",
        state: "upcoming",
        badges: [
          { label: "DUE DATE", color: GRAY },
          { label: "HOMEWORK", color: GRAY },
          { label: "UPCOMING", color: GRAY },
        ],
        title: "Module 2 · Assignment 02 · Paid social campaign brief",
        description: "A brief for one paid social campaign: the audience, three creative concepts and the budget split.",
        link: "Open the assignment",
      },
      {
        id: "graded-quiz-measurement",
        iso: "2027-01-03T23:59",
        date: "03 Jan 2027",
        time: "23:59 · your time",
        state: "upcoming",
        badges: [
          { label: "DUE DATE", color: GRAY },
          { label: "GRADED QUIZ", color: GRAY },
          { label: "UPCOMING", color: GRAY },
        ],
        title: "Module 3 · Graded Quiz: Measurement and AI-integrated strategy",
        description: "Two attempts. The best one counts.",
      },
      {
        id: "final-project",
        iso: "2027-01-10T23:59",
        date: "10 Jan 2027",
        time: "23:59 · your time",
        state: "locked",
        badges: [
          { label: "DUE DATE", color: GRAY },
          { label: "FINAL PROJECT", color: GRAY },
          { label: "LOCKED", color: GRAY },
        ],
        title: "Module 4 · Final Project: Integrated campaign plan",
        description: "Unlocks when Module 3 is complete.",
      },
      {
        id: "final-assessment",
        iso: "2027-01-11T23:59",
        date: "11 Jan 2027",
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
        iso: "2027-01-12T09:00",
        date: "12 Jan 2027",
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
        id: "ad-budget",
        title: "Do I need an advertising account or a budget for this course?",
        preview: "Marcus: No. You plan campaigns and read sample reports.",
        meta: "last week  ·  2 replies",
        answered: true,
        following: true,
        unread: false,
        messages: [
          {
            id: "m1",
            from: "learner",
            author: "You",
            body: "I am planning the rest of the program. I have never run an ad and I do not have a budget to spend. Will the assignments ask me to run real campaigns?",
            time: "last week",
          },
          {
            id: "m2",
            from: "mentor",
            author: "Marcus Lee",
            label: "STAFF",
            accepted: true,
            body: "No. You plan campaigns and read reports, and you do not spend anything. The Handouts include a sample account for a small online shop, with three months of search, social and display reports. Every activity, both assignments and the final project use it.",
            time: "last week",
          },
        ],
      },
      {
        id: "start-before-course-3",
        title: "Can I start this course before I finish course 3?",
        preview: "Marcus: You can. The order is a suggestion.",
        meta: "last week  ·  2 replies",
        answered: true,
        following: false,
        unread: false,
      },
    ],
    mentorLine: "Marcus Lee · your mentor · typically responds within 1 day",
  },
};
