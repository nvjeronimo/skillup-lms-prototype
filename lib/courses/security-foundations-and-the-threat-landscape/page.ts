import { GRAY, SIX_SIGMA, THIS_WEEK, modulesFromOutline, playerHref, week } from "@/lib/courses/kit";
import type { CourseDetail, WeeklyGoal } from "@/lib/courses/kit";
import { outline } from "./outline";

/**
 * "Security Foundations and the Threat Landscape":
 * course 1 of 5 of the Cybersecurity Fundamentals Certificate, not started. Its figures follow
 * the course row of the Program page (lib/programs/cybersecurity-fundamentals): 39 topics
 * in 4 modules, about 9 hours, nothing completed and nothing graded. Today is
 * 24 Sep 2026 and the suggested schedule of the course starts on 5 Oct 2026, so every
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
  imageSrc: "/platform/covers/business-analytics-with-python.jpg",
  partners: [],
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
    body: "The suggested schedule of this course starts on 5 Oct 2026, with the program; you can open the first topics before then. The risk register template and the Fernhill Bakery case file for Assignment 01 are in Handouts.",
  },
  intro: {
    title: "What you'll learn",
    lead: "Four modules that build the vocabulary of the field: what security protects and how risk is weighed, who attacks organisations and how, the human side of defence, and the frameworks and laws that shape the work. Work through them at your own pace.",
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
        iso: "2026-10-05",
        day: "05",
        month: "OCT",
        title: "Course starts",
        detail: "Suggested schedule begins",
        relative: "In 11 days",
        relativeColor: "gray",
      },
      {
        id: "graded-quiz-principles-and-risk",
        iso: "2026-10-11",
        day: "11",
        month: "OCT",
        title: "Graded Quiz: Principles and risk",
        detail: "Assignment due · 23:59 your time",
        relative: "In 2 weeks",
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
        iso: "2026-10-05T00:00",
        date: "05 Oct 2026",
        time: "00:00 · your time",
        state: "upcoming",
        badges: [{ label: "COURSE", color: GRAY }, { label: "UPCOMING", color: GRAY }],
        title: "Course starts",
        description: "The program begins and the suggested schedule of this course starts. Due dates are counted from this day.",
      },
      {
        id: "graded-quiz-principles-and-risk",
        iso: "2026-10-11T23:59",
        date: "11 Oct 2026",
        time: "23:59 · your time",
        state: "upcoming",
        badges: [{ label: "DUE DATE", color: GRAY }, { label: "GRADED QUIZ", color: GRAY }, { label: "UPCOMING", color: GRAY }],
        title: "Module 1 · Graded Quiz: Principles and risk",
        description: "Two attempts. The best one counts.",
      },
      {
        id: "assignment-01-risk-register-for-a-small-business",
        iso: "2026-10-16T23:59",
        date: "16 Oct 2026",
        time: "23:59 · your time",
        state: "upcoming",
        badges: [{ label: "DUE DATE", color: GRAY }, { label: "ASSIGNMENT", color: GRAY }, { label: "UPCOMING", color: GRAY }],
        title: "Module 2 · Assignment 01 · Risk register for a small business",
        description: "Submit the risk register for Fernhill Bakery in the template from Handouts.",
      },
      {
        id: "graded-quiz-the-threat-landscape",
        iso: "2026-10-18T23:59",
        date: "18 Oct 2026",
        time: "23:59 · your time",
        state: "upcoming",
        badges: [{ label: "DUE DATE", color: GRAY }, { label: "GRADED QUIZ", color: GRAY }, { label: "UPCOMING", color: GRAY }],
        title: "Module 2 · Graded Quiz: The threat landscape",
        description: "Two attempts. The best one counts.",
      },
      {
        id: "graded-quiz-the-human-factor",
        iso: "2026-10-22T23:59",
        date: "22 Oct 2026",
        time: "23:59 · your time",
        state: "upcoming",
        badges: [{ label: "DUE DATE", color: GRAY }, { label: "GRADED QUIZ", color: GRAY }, { label: "UPCOMING", color: GRAY }],
        title: "Module 3 · Graded Quiz: The human factor",
        description: "Two attempts. The best one counts.",
      },
      {
        id: "acceptable-use-policy-draft",
        iso: "2026-10-25T23:59",
        date: "25 Oct 2026",
        time: "23:59 · your time",
        state: "locked",
        badges: [{ label: "DUE DATE", color: GRAY }, { label: "PEER ASSESSMENT", color: GRAY }, { label: "LOCKED", color: GRAY }],
        title: "Module 4 · Acceptable use policy draft",
        description: "Unlocks when Module 3 is complete.",
      },
      {
        id: "graded-quiz-frameworks-law-and-ethics",
        iso: "2026-10-25T23:59",
        date: "25 Oct 2026",
        time: "23:59 · your time",
        state: "locked",
        badges: [{ label: "DUE DATE", color: GRAY }, { label: "GRADED QUIZ", color: GRAY }, { label: "LOCKED", color: GRAY }],
        title: "Module 4 · Graded Quiz: Frameworks, law and ethics",
        description: "Unlocks when Module 3 is complete.",
      },
      {
        id: "certificate-available",
        iso: "2026-11-02T09:00",
        date: "02 Nov 2026",
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
            body: "I work in office administration and have never done IT work. The program starts on 5 Oct. Is there anything I should study first?",
            time: "3 days ago",
          },
          {
            id: "m2",
            from: "mentor",
            author: "David Chen",
            label: "STAFF",
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
        title: "Do the due dates move if I start after 5 Oct?",
        preview: "You: Asked today, no reply yet.",
        meta: "today  ·  1 reply",
        answered: false,
        following: false,
        unread: false,
      },
    ],
  },
};
