import { GRAY, SIX_SIGMA, THIS_WEEK, modulesFromOutline, playerHref, week } from "@/lib/courses/kit";
import type { CourseDetail, WeeklyGoal } from "@/lib/courses/kit";
import { outline } from "./outline";

/**
 * "Network Security and Defence":
 * course 2 of 5 of the Cybersecurity Fundamentals Certificate, not started. Its figures follow
 * the course row of the Program page (lib/programs/cybersecurity-fundamentals): 39 topics
 * in 4 modules, about 9 hours, nothing completed and nothing graded. Today is
 * 24 Sep 2026 and the suggested schedule of the course starts on 26 Oct 2026, so every
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
  imageSrc: "/platform/covers/program-ai-digital-marketing.jpg",
  partners: [],
  deliveryMode: "Flexible Learning",
  difficulty: "Beginner",
  stats: { structure: "4 modules · 39 topics", duration: "~ 9 hours", org: "SkillUp · SEC-02" },
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
    body: "The suggested schedule of this course starts on 26 Oct 2026, after Course 1. The Larchfield Architects case file for the segmentation plan is in Handouts, with a reference sheet of common ports.",
  },
  intro: {
    title: "What you'll learn",
    lead: "Four modules that take you from how a network carries data to how it is defended: the working model, threats and segmentation, firewalls and monitoring, then encryption in transit and wireless. No lab equipment is needed.",
  },
  modules: modulesFromOutline(outline, [
    { duration: "1h 45m", defaultOpen: true },
    { duration: "2h 54m" },
    { duration: "2h 06m" },
    { duration: "2h 29m", lockReason: "Complete “Module 3 · Firewalls, Detection and Monitoring” to unlock" },
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
      "Common ports reference sheet (PDF)",
      "Case file: Larchfield Architects (PDF)",
      "Zone and flow table template (XLSX)",
      "Firewall rule review checklist (PDF)",
    ],
  },
  upcomingDates: {
    label: "Upcoming dates",
    items: [
      {
        id: "course-starts",
        iso: "2026-10-26",
        day: "26",
        month: "OCT",
        title: "Course starts",
        detail: "Suggested schedule begins",
        relative: "In 4 weeks",
        relativeColor: "gray",
      },
      {
        id: "graded-quiz-how-networks-work",
        iso: "2026-11-01",
        day: "01",
        month: "NOV",
        title: "Graded Quiz: How networks work",
        detail: "Assignment due · 23:59 your time",
        relative: "In 5 weeks",
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
        { title: "Module 1 · How Networks Work", items: [{ title: "Graded Quiz: How networks work", score: "0/10 · 0%" }] },
        {
          title: "Module 2 · Network Threats and Segmentation",
          items: [
            { title: "Assignment 01 · Segmentation plan for a two-site office", score: "0/20 · 0%" },
            { title: "Graded Quiz: Threats and segmentation", score: "0/10 · 0%" },
          ],
        },
        {
          title: "Module 3 · Firewalls, Detection and Monitoring",
          items: [{ title: "Graded Quiz: Firewalls and monitoring", score: "0/10 · 0%" }],
        },
        {
          title: "Module 4 · Secure Communication and Wireless",
          items: [
            { title: "Network hardening review", score: "0/20 · 0%" },
            { title: "Graded Quiz: Secure communication and wireless", score: "0/10 · 0%" },
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
        iso: "2026-10-26T00:00",
        date: "26 Oct 2026",
        time: "00:00 · your time",
        state: "upcoming",
        badges: [{ label: "COURSE", color: GRAY }, { label: "UPCOMING", color: GRAY }],
        title: "Course starts",
        description: "The suggested schedule of this course starts, after Course 1. Due dates are counted from this day.",
      },
      {
        id: "graded-quiz-how-networks-work",
        iso: "2026-11-01T23:59",
        date: "01 Nov 2026",
        time: "23:59 · your time",
        state: "upcoming",
        badges: [{ label: "DUE DATE", color: GRAY }, { label: "GRADED QUIZ", color: GRAY }, { label: "UPCOMING", color: GRAY }],
        title: "Module 1 · Graded Quiz: How networks work",
        description: "Two attempts. The best one counts.",
      },
      {
        id: "assignment-01-segmentation-plan-for-a-two-site-office",
        iso: "2026-11-06T23:59",
        date: "06 Nov 2026",
        time: "23:59 · your time",
        state: "upcoming",
        badges: [{ label: "DUE DATE", color: GRAY }, { label: "ASSIGNMENT", color: GRAY }, { label: "UPCOMING", color: GRAY }],
        title: "Module 2 · Assignment 01 · Segmentation plan for a two-site office",
        description: "Submit the zone diagram and the flow table for Larchfield Architects as one PDF.",
      },
      {
        id: "graded-quiz-threats-and-segmentation",
        iso: "2026-11-08T23:59",
        date: "08 Nov 2026",
        time: "23:59 · your time",
        state: "upcoming",
        badges: [{ label: "DUE DATE", color: GRAY }, { label: "GRADED QUIZ", color: GRAY }, { label: "UPCOMING", color: GRAY }],
        title: "Module 2 · Graded Quiz: Threats and segmentation",
        description: "Two attempts. The best one counts.",
      },
      {
        id: "graded-quiz-firewalls-and-monitoring",
        iso: "2026-11-12T23:59",
        date: "12 Nov 2026",
        time: "23:59 · your time",
        state: "upcoming",
        badges: [{ label: "DUE DATE", color: GRAY }, { label: "GRADED QUIZ", color: GRAY }, { label: "UPCOMING", color: GRAY }],
        title: "Module 3 · Graded Quiz: Firewalls and monitoring",
        description: "Two attempts. The best one counts.",
      },
      {
        id: "network-hardening-review",
        iso: "2026-11-15T23:59",
        date: "15 Nov 2026",
        time: "23:59 · your time",
        state: "locked",
        badges: [{ label: "DUE DATE", color: GRAY }, { label: "PEER ASSESSMENT", color: GRAY }, { label: "LOCKED", color: GRAY }],
        title: "Module 4 · Network hardening review",
        description: "Unlocks when Module 3 is complete.",
      },
      {
        id: "graded-quiz-secure-communication-and-wireless",
        iso: "2026-11-15T23:59",
        date: "15 Nov 2026",
        time: "23:59 · your time",
        state: "locked",
        badges: [{ label: "DUE DATE", color: GRAY }, { label: "GRADED QUIZ", color: GRAY }, { label: "LOCKED", color: GRAY }],
        title: "Module 4 · Graded Quiz: Secure communication and wireless",
        description: "Unlocks when Module 3 is complete.",
      },
      {
        id: "certificate-available",
        iso: "2026-11-23T09:00",
        date: "23 Nov 2026",
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
        id: "lab-equipment",
        title: "Do I need lab equipment or special software for this course?",
        preview: "David: No. Every exercise uses diagrams and sample data.",
        meta: "2 days ago  ·  2 replies",
        answered: true,
        following: true,
        unread: false,
        messages: [
          {
            id: "m1",
            from: "learner",
            author: "You",
            body: "I only have a work laptop and cannot install anything on it. Will I be able to do the firewall and packet capture exercises?",
            time: "2 days ago",
          },
          {
            id: "m2",
            from: "mentor",
            author: "David Chen",
            label: "STAFF",
            accepted: true,
            body: "Yes. Every exercise uses diagrams and sample data you open in the browser: a packet capture summary, a rule base as a table, a device list. Nothing is installed, and nothing is run against a real network.",
            time: "2 days ago",
          },
          { id: "m3", from: "learner", author: "You", body: "Good, that settles it. Thank you.", time: "yesterday" },
        ],
      },
      {
        id: "subnet-maths",
        title: "How much subnet calculation is in the graded quizzes?",
        preview: "David: Only telling whether two addresses share a subnet.",
        meta: "last week  ·  2 replies  ·  1 unread",
        answered: true,
        following: false,
        unread: true,
      },
      {
        id: "hand-drawn",
        title: "Can the zone diagram for Assignment 01 be hand-drawn?",
        preview: "You: Asked today, no reply yet.",
        meta: "today  ·  1 reply",
        answered: false,
        following: false,
        unread: false,
      },
    ],
  },
};
