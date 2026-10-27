import { GRAY, SIX_SIGMA, THIS_WEEK, modulesFromOutline, playerHref, week } from "@/lib/courses/kit";
import type { CourseDetail, WeeklyGoal } from "@/lib/courses/kit";
import { outline } from "./outline";
import { SAMPLE_TODAY, relativeColor, relativeLabel, todayLabel } from "@/lib/sample-time";

/**
 * "Security Foundations and the Threat Landscape":
 * course 1 of 5 of the Cybersecurity Fundamentals Certificate, not started. Its figures follow
 * the course row of the Program page (lib/programs/cybersecurity-fundamentals): 39 topics
 * in 4 modules, about 9 hours, nothing completed and nothing graded. Today is
 * 24 Oct 2026 and the suggested schedule of the course starts on 4 Nov 2026, so every
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
  imageSrc: "/platform/covers/business-analytics-with-python.jpg",
  deliveryMode: "Flexible Learning",
  difficulty: "Beginner",
  stats: { structure: "4 modules · 39 topics", duration: "~ 9 hours", org: "SkillUp · SEC-01" },
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
    body: "The suggested schedule of this course starts on 4 Nov 2026, with the program; you can open the first topics before then. The risk register template and the Fernhill Bakery case file for Assignment 01 are in Handouts.",
  },
  intro: {
    title: "What you'll learn",
    lead: "Four modules that build the vocabulary of the field: what security protects and how risk is weighed, who attacks organizations and how, the human side of defense, and the frameworks and laws that shape the work. Work through them at your own pace.",
  },
  modules: modulesFromOutline(outline, [
    { duration: "1h 42m", defaultOpen: true },
    { duration: "2h 56m" },
    { duration: "1h 57m" },
    { duration: "2h 22m", lockReason: "Complete “Module 3 · The Human Factor” to unlock" },
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
      "Glossary of security terms (PDF)",
      "Risk register template (XLSX)",
      "Case file: Fernhill Bakery (PDF)",
      "Acceptable use policy outline (DOCX)",
    ],
  },
  upcomingDates: {
    label: "Upcoming dates",
    items: [
      {
        id: "course-starts",
        iso: "2026-11-04",
        day: "04",
        month: "NOV",
        title: "Course starts",
        detail: "Suggested schedule begins",
        relative: relativeLabel("2026-11-04"),
        relativeColor: relativeColor("2026-11-04"),
      },
      {
        id: "graded-quiz-principles-and-risk",
        iso: "2026-11-10",
        day: "10",
        month: "NOV",
        title: "Graded Quiz: Principles and risk",
        detail: "Assignment due · 11:59 PM · your time",
        relative: relativeLabel("2026-11-10"),
        relativeColor: relativeColor("2026-11-10"),
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
        { type: "Peer Assessment", weight: "30%", grade: "0%", weighted: "0%" },
      ],
      sections: [
        {
          title: "Module 1 · Security Principles and Risk",
          items: [{ title: "Graded Quiz: Principles and risk", score: "0/10 · 0%" }],
        },
        {
          title: "Module 2 · The Threat Landscape",
          items: [
            { title: "Assignment 01 · Risk register for a small business", score: "0/20 · 0%" },
            { title: "Graded Quiz: The threat landscape", score: "0/10 · 0%" },
          ],
        },
        { title: "Module 3 · The Human Factor", items: [{ title: "Graded Quiz: The human factor", score: "0/10 · 0%" }] },
        {
          title: "Module 4 · Frameworks, Law and Ethics",
          items: [
            { title: "Acceptable use policy draft", score: "0/20 · 0%" },
            { title: "Graded Quiz: Frameworks, law and ethics", score: "0/10 · 0%" },
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
        iso: "2026-11-04T00:00",
        date: "04 Nov 2026",
        time: "12:00 AM · your time",
        state: "upcoming",
        badges: [{ label: "Course", color: GRAY }, { label: "Upcoming", color: GRAY }],
        title: "Course starts",
        description: "The program begins and the suggested schedule of this course starts. Due dates are counted from this day.",
      },
      {
        id: "graded-quiz-principles-and-risk",
        iso: "2026-11-10T23:59",
        date: "10 Nov 2026",
        time: "11:59 PM · your time",
        state: "upcoming",
        badges: [{ label: "Due date", color: GRAY }, { label: "Graded quiz", color: GRAY }, { label: "Upcoming", color: GRAY }],
        title: "Module 1 · Graded Quiz: Principles and risk",
        description: "Two attempts. The best one counts.",
      },
      {
        id: "assignment-01-risk-register-for-a-small-business",
        iso: "2026-11-15T23:59",
        date: "15 Nov 2026",
        time: "11:59 PM · your time",
        state: "upcoming",
        badges: [{ label: "Due date", color: GRAY }, { label: "Assignment", color: GRAY }, { label: "Upcoming", color: GRAY }],
        title: "Module 2 · Assignment 01 · Risk register for a small business",
        description: "Submit the risk register for Fernhill Bakery in the template from Handouts.",
      },
      {
        id: "graded-quiz-the-threat-landscape",
        iso: "2026-11-17T23:59",
        date: "17 Nov 2026",
        time: "11:59 PM · your time",
        state: "upcoming",
        badges: [{ label: "Due date", color: GRAY }, { label: "Graded quiz", color: GRAY }, { label: "Upcoming", color: GRAY }],
        title: "Module 2 · Graded Quiz: The threat landscape",
        description: "Two attempts. The best one counts.",
      },
      {
        id: "graded-quiz-the-human-factor",
        iso: "2026-11-21T23:59",
        date: "21 Nov 2026",
        time: "11:59 PM · your time",
        state: "upcoming",
        badges: [{ label: "Due date", color: GRAY }, { label: "Graded quiz", color: GRAY }, { label: "Upcoming", color: GRAY }],
        title: "Module 3 · Graded Quiz: The human factor",
        description: "Two attempts. The best one counts.",
      },
      {
        id: "acceptable-use-policy-draft",
        iso: "2026-11-24T23:59",
        date: "24 Nov 2026",
        time: "11:59 PM · your time",
        state: "locked",
        badges: [{ label: "Due date", color: GRAY }, { label: "Peer assessment", color: GRAY }, { label: "Locked", color: GRAY }],
        title: "Module 4 · Acceptable use policy draft",
        description: "Unlocks when Module 3 is complete.",
      },
      {
        id: "graded-quiz-frameworks-law-and-ethics",
        iso: "2026-11-24T23:59",
        date: "24 Nov 2026",
        time: "11:59 PM · your time",
        state: "locked",
        badges: [{ label: "Due date", color: GRAY }, { label: "Graded quiz", color: GRAY }, { label: "Locked", color: GRAY }],
        title: "Module 4 · Graded Quiz: Frameworks, law and ethics",
        description: "Unlocks when Module 3 is complete.",
      },
      {
        id: "certificate-available",
        iso: "2026-12-02T09:00",
        date: "02 Dec 2026",
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
        id: "technical-background",
        title: "Do I need a technical background before the course starts?",
        preview: "David: No. Course 1 assumes you can use a computer and a browser.",
        meta: "3 days ago  ·  2 replies",
        answered: true,
        following: true,
        unread: false,
        messages: [
          {
            id: "m1",
            from: "learner",
            author: "You",
            body: "I work in office administration and have never done IT work. The program starts on 4 Nov. Is there anything I should study first?",
            time: "3 days ago",
          },
          {
            id: "m2",
            from: "mentor",
            author: "David Chen",
            label: "Staff",
            accepted: true,
            body: "No. Course 1 assumes you can use a computer and a browser, nothing more. If you want a head start, read the glossary in Handouts and mark the terms you have already met at work.",
            time: "3 days ago",
          },
          {
            id: "m3",
            from: "learner",
            author: "You",
            body: "Thanks. I have opened the glossary; about a third of it is familiar.",
            time: "2 days ago",
          },
        ],
      },
      {
        id: "own-employer",
        title: "Can I use my own employer for the risk register?",
        preview: "David: Use the Fernhill Bakery case file for the graded version.",
        meta: "last week  ·  2 replies  ·  1 unread",
        answered: true,
        following: false,
        unread: true,
      },
      {
        id: "due-dates",
        title: "Do the due dates move if I start after 4 Nov?",
        preview: "You: Asked today, no reply yet.",
        meta: "today  ·  1 reply",
        answered: false,
        following: false,
        unread: false,
      },
    ],
  },
};
