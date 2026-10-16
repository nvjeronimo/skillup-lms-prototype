import { GRAY, SIX_SIGMA, THIS_WEEK, modulesFromOutline, playerHref, week } from "@/lib/courses/kit";
import type { CourseDetail, WeeklyGoal } from "@/lib/courses/kit";
import { outline } from "./outline";

/**
 * "Identity, Access and Cloud Security":
 * course 3 of 5 of the Cybersecurity Fundamentals Certificate, not started. Its figures follow
 * the course row of the Program page (lib/programs/cybersecurity-fundamentals): 39 topics
 * in 4 modules, about 9 hours, nothing completed and nothing graded. Today is
 * 24 Sep 2026 and the suggested schedule of the course starts on 16 Nov 2026, so every
 * due date is still to come and none is missed.
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
  imageSrc: "/platform/covers/project-management-with-ai-tools.jpg",
  partners: [],
  deliveryMode: "Flexible Learning",
  difficulty: "Beginner",
  stats: { structure: "4 modules · 39 topics", duration: "~ 9 hours", org: "SkillUp · SEC-03" },
  progress: {
    percent: 0,
    label: "Course progress",
    eyebrow: "Start with the first topic",
    cta: "Start course",
    href: playerHref(outline),
    notPassing: "Not started · 0% of 70%",
    done: "0 of 39 topics",
    timeLeft: "~ 9h left",
  },
  search: SIX_SIGMA.search,
  program: { slug: "cybersecurity-fundamentals", title: "Cybersecurity Fundamentals Certificate" },

  update: {
    title: "Course update",
    body: "The suggested schedule of this course starts on 16 Nov 2026, after Course 2. The cloud exercises use exported settings from a sample account, so you do not need a cloud subscription.",
  },
  intro: {
    title: "What you'll learn",
    lead: "Four modules on the controls that decide who gets in and what they can reach: authentication, access control, the security of cloud services and the protection of data. The examples are provider-neutral.",
  },
  modules: modulesFromOutline(outline, [
    { duration: "1h 43m", defaultOpen: true },
    { duration: "2h 54m" },
    { duration: "2h 00m" },
    { duration: "2h 25m", lockReason: "Complete “Module 3 · Cloud Security Fundamentals” to unlock" },
  ]),
  mentor: SIX_SIGMA.mentor,
  team: {
    label: "Course team",
    people: [{ name: "Dr. Amara Okafor", role: "Lead instructor · SkillUp" }, { name: "Priya Raman", role: "Course author · SkillUp" }],
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
      { title: "Complete the course content", detail: "0 of 39 topics · 0%", percent: 0 },
    ],
  },
  handouts: {
    label: "Handouts",
    items: [
      "Case file: Quillhaven Publishing (PDF)",
      "Role matrix template (XLSX)",
      "Shared responsibility worksheet (PDF)",
      "Cloud account review checklist (PDF)",
    ],
  },
  upcomingDates: {
    label: "Upcoming dates",
    items: [
      {
        id: "course-starts",
        iso: "2026-11-16",
        day: "16",
        month: "NOV",
        title: "Course starts",
        detail: "Suggested schedule begins",
        relative: "In 7 weeks",
        relativeColor: "gray",
      },
      {
        id: "graded-quiz-identity-and-authentication",
        iso: "2026-11-22",
        day: "22",
        month: "NOV",
        title: "Graded Quiz: Identity and authentication",
        detail: "Assignment due · 23:59 your time",
        relative: "In 8 weeks",
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
      counts: "0 complete · 29 incomplete · 10 locked",
      percent: 0,
    },
    passAlert: { title: "A weighted grade of 70% is required to pass", body: "Your current weighted grade is 0%." },
    grade: {
      title: "Your grade",
      badge: "0% · below the 70% pass mark",
      percent: 0,
      passPercent: 70,
      currentLabel: "Current 0%",
      passLabel: "Pass 70%",
      columns: SIX_SIGMA.progressTab.grade.columns,
      rows: [
        { type: "Graded Quiz", weight: "40%", grade: "0%", weighted: "0%" },
        { type: "Assignment", weight: "30%", grade: "0%", weighted: "0%" },
        { type: "Peer Assessment", weight: "30%", grade: "0%", weighted: "0%" },
      ],
      sections: [
        {
          title: "Module 1 · Identity and Authentication",
          items: [{ title: "Graded Quiz: Identity and authentication", score: "0/10 · 0%" }],
        },
        {
          title: "Module 2 · Access Control",
          items: [
            { title: "Assignment 01 · Access model for a 30-person company", score: "0/20 · 0%" },
            { title: "Graded Quiz: Access control", score: "0/10 · 0%" },
          ],
        },
        {
          title: "Module 3 · Cloud Security Fundamentals",
          items: [{ title: "Graded Quiz: Cloud security fundamentals", score: "0/10 · 0%" }],
        },
        {
          title: "Module 4 · Protecting Data",
          items: [
            { title: "Cloud account security review", score: "0/20 · 0%" },
            { title: "Graded Quiz: Protecting data", score: "0/10 · 0%" },
          ],
        },
      ],
    },
    note: SIX_SIGMA.progressTab.note,
    weeklyGoal: WEEKLY_GOAL,
  },

  datesTab: {
    title: "Important Dates",
    pastLabel: "Past",
    past: [
      {
        id: "enrolled",
        iso: "2026-09-14T10:30",
        date: "14 Sep 2026",
        time: "10:30 · your time",
        state: "complete",
        badges: [{ label: "PROGRAM", color: GRAY }],
        title: "Enrolled in the program",
        description: "You joined the Cybersecurity Fundamentals Certificate. Its five courses follow one another from 5 Oct 2026.",
      },
    ],
    todayLabel: "Today · 24 Sep 2026",
    todayIso: "2026-09-24",
    upcomingLabel: "Upcoming",
    upcoming: [
      {
        id: "course-starts",
        iso: "2026-11-16T00:00",
        date: "16 Nov 2026",
        time: "00:00 · your time",
        state: "upcoming",
        badges: [{ label: "COURSE", color: GRAY }, { label: "UPCOMING", color: GRAY }],
        title: "Course starts",
        description: "The suggested schedule of this course starts, after Course 2. Due dates are counted from this day.",
      },
      {
        id: "graded-quiz-identity-and-authentication",
        iso: "2026-11-22T23:59",
        date: "22 Nov 2026",
        time: "23:59 · your time",
        state: "upcoming",
        badges: [{ label: "DUE DATE", color: GRAY }, { label: "GRADED QUIZ", color: GRAY }, { label: "UPCOMING", color: GRAY }],
        title: "Module 1 · Graded Quiz: Identity and authentication",
        description: "Two attempts. The best one counts.",
      },
      {
        id: "assignment-01-access-model-for-a-30-person-company",
        iso: "2026-11-27T23:59",
        date: "27 Nov 2026",
        time: "23:59 · your time",
        state: "upcoming",
        badges: [{ label: "DUE DATE", color: GRAY }, { label: "ASSIGNMENT", color: GRAY }, { label: "UPCOMING", color: GRAY }],
        title: "Module 2 · Assignment 01 · Access model for a 30-person company",
        description: "Submit the role matrix for Quillhaven Publishing and a one-page rationale.",
      },
      {
        id: "graded-quiz-access-control",
        iso: "2026-11-29T23:59",
        date: "29 Nov 2026",
        time: "23:59 · your time",
        state: "upcoming",
        badges: [{ label: "DUE DATE", color: GRAY }, { label: "GRADED QUIZ", color: GRAY }, { label: "UPCOMING", color: GRAY }],
        title: "Module 2 · Graded Quiz: Access control",
        description: "Two attempts. The best one counts.",
      },
      {
        id: "graded-quiz-cloud-security-fundamentals",
        iso: "2026-12-03T23:59",
        date: "03 Dec 2026",
        time: "23:59 · your time",
        state: "upcoming",
        badges: [{ label: "DUE DATE", color: GRAY }, { label: "GRADED QUIZ", color: GRAY }, { label: "UPCOMING", color: GRAY }],
        title: "Module 3 · Graded Quiz: Cloud security fundamentals",
        description: "Two attempts. The best one counts.",
      },
      {
        id: "cloud-account-security-review",
        iso: "2026-12-06T23:59",
        date: "06 Dec 2026",
        time: "23:59 · your time",
        state: "locked",
        badges: [{ label: "DUE DATE", color: GRAY }, { label: "PEER ASSESSMENT", color: GRAY }, { label: "LOCKED", color: GRAY }],
        title: "Module 4 · Cloud account security review",
        description: "Unlocks when Module 3 is complete.",
      },
      {
        id: "graded-quiz-protecting-data",
        iso: "2026-12-06T23:59",
        date: "06 Dec 2026",
        time: "23:59 · your time",
        state: "locked",
        badges: [{ label: "DUE DATE", color: GRAY }, { label: "GRADED QUIZ", color: GRAY }, { label: "LOCKED", color: GRAY }],
        title: "Module 4 · Graded Quiz: Protecting data",
        description: "Unlocks when Module 3 is complete.",
      },
      {
        id: "certificate-available",
        iso: "2026-12-14T09:00",
        date: "14 Dec 2026",
        time: "09:00 · your time",
        state: "upcoming",
        badges: [{ label: "CERTIFICATE", color: GRAY }],
        title: "Certificate available",
        description: "Your certificate is issued after this date if you have a passing grade.",
      },
      {
        id: "course-ends",
        iso: "2027-09-30T23:59",
        date: "30 Sep 2027",
        time: "23:59 · your time",
        state: "upcoming",
        badges: [{ label: "COURSE", color: GRAY }],
        title: "Course ends",
        description: "The program closes on this date. Content stays readable; graded work closes.",
      },
    ],
    timezoneNote: SIX_SIGMA.datesTab.timezoneNote,
  },

  qaTab: {
    ...SIX_SIGMA.qaTab,
    threads: [
      {
        id: "cloud-account",
        title: "Do I need a paid cloud account for the exercises?",
        preview: "David: No. The exercises use exported settings from a sample account.",
        meta: "yesterday  ·  2 replies",
        answered: true,
        following: true,
        unread: false,
        messages: [
          {
            id: "m1",
            from: "learner",
            author: "You",
            body: "Module 3 is about cloud security. Do I have to open an account with a cloud provider, and will it cost anything?",
            time: "yesterday",
          },
          {
            id: "m2",
            from: "mentor",
            author: "David Chen",
            label: "STAFF",
            accepted: true,
            body: "No. The cloud exercises use screenshots and exported settings from a sample account, so there is nothing to sign up for and nothing to pay. If you already have access to a cloud account at work, do not change its settings for this course.",
            time: "yesterday",
          },
        ],
      },
      {
        id: "which-provider",
        title: "Does the course teach one cloud provider or several?",
        preview: "David: The concepts are provider-neutral.",
        meta: "last week  ·  2 replies  ·  1 unread",
        answered: true,
        following: false,
        unread: true,
      },
      {
        id: "matrix-format",
        title: "Can I submit the role matrix as a spreadsheet?",
        preview: "You: Asked today, no reply yet.",
        meta: "today  ·  1 reply",
        answered: false,
        following: false,
        unread: false,
      },
    ],
  },
};
