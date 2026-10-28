import { GRAY, SIX_SIGMA, THIS_WEEK, modulesFromOutline, playerHref, week } from "@/lib/courses/kit";
import type { CourseDetail, WeeklyGoal } from "@/lib/courses/kit";
import { outline } from "./outline";
import { SAMPLE_TODAY, relativeColor, relativeLabel, todayLabel } from "@/lib/sample-time";

/**
 * "Identity, Access and Cloud Security":
 * course 3 of 5 of the Cybersecurity Fundamentals Certificate, not started. Its figures follow
 * the course row of the Program page (lib/programs/cybersecurity-fundamentals): 39 topics
 * in 4 modules, about 9 hours, nothing completed and nothing graded. Today is
 * 24 Oct 2026 and the suggested schedule of the course starts on 16 Dec 2026, so every
 * due date is still to come and none is missed.
 */
const WEEKLY_GOAL: WeeklyGoal = {
  state: "set",
  title: "Your weekly goal",
  body: "A day counts when you open any lesson in this course.",
  week: THIS_WEEK,
  days: week(["missed", "missed", "missed", "missed", "missed", "today", "upcoming"]),
  count: "0 of 3 days this week",
  lastWeek: "Last week: 0 of 3",
  plan: "Regular · 3 days a week.",
};

export const page: CourseDetail = {
  slug: outline.slug,
  title: outline.title,
  imageSrc: "/platform/covers/project-management-with-ai-tools.jpg",
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
    body: "The suggested schedule of this course starts on 16 Dec 2026, after Course 2. The cloud exercises use exported settings from a sample account, so you do not need a cloud subscription.",
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
        iso: "2026-12-16",
        day: "16",
        month: "DEC",
        title: "Course starts",
        detail: "Suggested schedule begins",
        relative: relativeLabel("2026-12-16"),
        relativeColor: relativeColor("2026-12-16"),
      },
      {
        id: "graded-quiz-identity-and-authentication",
        iso: "2026-12-22",
        day: "22",
        month: "DEC",
        title: "Graded Quiz: Identity and authentication",
        detail: "Assignment due · 11:59 PM · your time",
        relative: relativeLabel("2026-12-22"),
        relativeColor: relativeColor("2026-12-22"),
      },
    ],
    cta: "All dates",
  },
  tools: SIX_SIGMA.tools,

  progressTab: {
    title: "Your progress",
    completion: {
      title: "Course completion",
      complete: 0,
      incomplete: 29,
      locked: 10,
    },
    passAlert: { title: "A weighted grade of 70% is required to pass", body: "Your current weighted grade is 0%." },
    grade: {
      title: "Your grade",
      percent: 0,
      passPercent: 70,
      passLabel: "Pass 70%",
      columns: SIX_SIGMA.progressTab.grade.columns,
      rows: [
        { type: "Graded Quiz", weight: "40%", grade: "0%", weighted: "0%" },
        { type: "Assignment", weight: "30%", grade: "0%", weighted: "0%" },
        { type: "Project", weight: "30%", grade: "0%", weighted: "0%" },
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
        time: "10:30 AM · your time",
        state: "complete",
        badges: [{ label: "Program", color: GRAY }],
        title: "Enrolled in the program",
        description: "You joined the Cybersecurity Fundamentals Certificate. Its five courses follow one another from 4 Nov 2026.",
      },
    ],
    todayLabel: todayLabel(),
    todayIso: SAMPLE_TODAY,
    upcomingLabel: "Upcoming",
    upcoming: [
      {
        id: "course-starts",
        iso: "2026-12-16T00:00",
        date: "16 Dec 2026",
        time: "12:00 AM · your time",
        state: "upcoming",
        badges: [{ label: "Course", color: GRAY }, { label: "Upcoming", color: GRAY }],
        title: "Course starts",
        description: "The suggested schedule of this course starts, after Course 2. Due dates are counted from this day.",
      },
      {
        id: "graded-quiz-identity-and-authentication",
        iso: "2026-12-22T23:59",
        date: "22 Dec 2026",
        time: "11:59 PM · your time",
        state: "upcoming",
        badges: [{ label: "Due date", color: GRAY }, { label: "Graded quiz", color: GRAY }, { label: "Upcoming", color: GRAY }],
        title: "Module 1 · Graded Quiz: Identity and authentication",
        description: "Two attempts. The best one counts.",
      },
      {
        id: "assignment-01-access-model-for-a-30-person-company",
        iso: "2026-12-27T23:59",
        date: "27 Dec 2026",
        time: "11:59 PM · your time",
        state: "upcoming",
        badges: [{ label: "Due date", color: GRAY }, { label: "Assignment", color: GRAY }, { label: "Upcoming", color: GRAY }],
        title: "Module 2 · Assignment 01 · Access model for a 30-person company",
        description: "Submit the role matrix for Quillhaven Publishing and a one-page rationale.",
      },
      {
        id: "graded-quiz-access-control",
        iso: "2026-12-29T23:59",
        date: "29 Dec 2026",
        time: "11:59 PM · your time",
        state: "upcoming",
        badges: [{ label: "Due date", color: GRAY }, { label: "Graded quiz", color: GRAY }, { label: "Upcoming", color: GRAY }],
        title: "Module 2 · Graded Quiz: Access control",
        description: "Two attempts. The best one counts.",
      },
      {
        id: "graded-quiz-cloud-security-fundamentals",
        iso: "2027-01-02T23:59",
        date: "02 Jan 2027",
        time: "11:59 PM · your time",
        state: "upcoming",
        badges: [{ label: "Due date", color: GRAY }, { label: "Graded quiz", color: GRAY }, { label: "Upcoming", color: GRAY }],
        title: "Module 3 · Graded Quiz: Cloud security fundamentals",
        description: "Two attempts. The best one counts.",
      },
      {
        id: "cloud-account-security-review",
        iso: "2027-01-05T23:59",
        date: "05 Jan 2027",
        time: "11:59 PM · your time",
        state: "locked",
        badges: [{ label: "Due date", color: GRAY }, { label: "Project", color: GRAY }, { label: "Locked", color: GRAY }],
        title: "Module 4 · Cloud account security review",
        description: "Unlocks when Module 3 is complete.",
      },
      {
        id: "graded-quiz-protecting-data",
        iso: "2027-01-05T23:59",
        date: "05 Jan 2027",
        time: "11:59 PM · your time",
        state: "locked",
        badges: [{ label: "Due date", color: GRAY }, { label: "Graded quiz", color: GRAY }, { label: "Locked", color: GRAY }],
        title: "Module 4 · Graded Quiz: Protecting data",
        description: "Unlocks when Module 3 is complete.",
      },
      {
        id: "certificate-available",
        iso: "2027-01-13T09:00",
        date: "13 Jan 2027",
        time: "9:00 AM · your time",
        state: "upcoming",
        badges: [{ label: "Certificate", color: GRAY }],
        title: "Certificate available",
        description: "Your certificate is issued after this date if you have a passing grade.",
      },
      {
        id: "course-ends",
        iso: "2027-09-30T23:59",
        date: "30 Sep 2027",
        time: "11:59 PM · your time",
        state: "upcoming",
        badges: [{ label: "Course", color: GRAY }],
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
            label: "Staff",
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
