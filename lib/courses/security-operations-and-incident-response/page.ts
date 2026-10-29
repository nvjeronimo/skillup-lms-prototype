import { GRAY, SIX_SIGMA, THIS_WEEK, modulesFromOutline, playerHref, week } from "@/lib/courses/kit";
import type { CourseDetail, WeeklyGoal } from "@/lib/courses/kit";
import { outline } from "./outline";
import { SAMPLE_TODAY, relativeColor, relativeLabel, todayLabel } from "@/lib/sample-time";

/**
 * "Security Operations and Incident Response":
 * course 4 of 5 of the Cybersecurity Fundamentals Certificate, not started. Its figures follow
 * the course row of the Program page (lib/programs/cybersecurity-fundamentals): 39 topics
 * in 4 modules, about 10 hours, nothing completed and nothing graded. Today is
 * 24 Oct 2026 and the suggested schedule of the course starts on 6 Jan 2027, so every
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
  imageSrc: "/platform/covers/intro-to-product-analytics.jpg",
  deliveryMode: "Flexible Learning",
  difficulty: "Beginner",
  stats: { structure: "4 modules · 39 topics", duration: "~ 10 hours", org: "SkillUp · SEC-04" },
  progress: {
    percent: 0,
    label: "Course progress",
    eyebrow: "Start with the first topic",
    cta: "Start course",
    href: playerHref(outline),
    notPassing: "Not started · 0% of 70%",
    done: "0 of 39 topics",
    timeLeft: "~ 10h left",
  },
  search: SIX_SIGMA.search,
  program: { slug: "cybersecurity-fundamentals", title: "Cybersecurity Fundamentals Certificate" },

  update: {
    title: "Course update",
    body: "The suggested schedule of this course starts on 6 Jan 2027, after Course 3. No work is due between 20 Jan and 1 Feb. The sample alert queue for Assignment 01 is in Handouts.",
  },
  intro: {
    title: "What you'll learn",
    lead: "Four modules on what happens when a defense is tested: how a security operations team works, how alerts are triaged, how an incident is contained and recovered from, and how evidence and communication are handled.",
  },
  modules: modulesFromOutline(outline, [
    { duration: "1h 41m", defaultOpen: true },
    { duration: "3h 11m" },
    { duration: "2h 01m" },
    { duration: "2h 39m", lockReason: "Complete “Module 3 · The Incident Response Lifecycle” to unlock" },
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
      "Sample alert queue and log extracts (XLSX)",
      "Triage note template (DOCX)",
      "Incident response plan outline (DOCX)",
      "Tabletop exercise scenario (PDF)",
    ],
  },
  upcomingDates: {
    label: "Upcoming dates",
    items: [
      {
        id: "course-starts",
        iso: "2027-01-06",
        day: "06",
        month: "JAN",
        title: "Course starts",
        detail: "Suggested schedule begins",
        relative: relativeLabel("2027-01-06"),
        relativeColor: relativeColor("2027-01-06"),
      },
      {
        id: "graded-quiz-security-operations",
        iso: "2027-01-12",
        day: "12",
        month: "JAN",
        title: "Graded Quiz: Security operations",
        detail: "Assignment due · 11:59 PM · your time",
        relative: relativeLabel("2027-01-12"),
        relativeColor: relativeColor("2027-01-12"),
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
          title: "Module 1 · Inside Security Operations",
          items: [{ title: "Graded Quiz: Security operations", score: "0/10 · 0%" }],
        },
        {
          title: "Module 2 · Detection and Triage",
          items: [
            { title: "Assignment 01 · Triage report for three alerts", score: "0/20 · 0%" },
            { title: "Graded Quiz: Detection and triage", score: "0/10 · 0%" },
          ],
        },
        {
          title: "Module 3 · The Incident Response Lifecycle",
          items: [{ title: "Graded Quiz: Incident response", score: "0/10 · 0%" }],
        },
        {
          title: "Module 4 · Evidence, Communication and Learning",
          items: [
            { title: "Tabletop exercise: incident summary", score: "0/20 · 0%" },
            { title: "Graded Quiz: Evidence and communication", score: "0/10 · 0%" },
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
        iso: "2027-01-06T00:00",
        date: "06 Jan 2027",
        time: "12:00 AM · your time",
        state: "upcoming",
        badges: [{ label: "Course", color: GRAY }, { label: "Upcoming", color: GRAY }],
        title: "Course starts",
        description: "The suggested schedule of this course starts, after Course 3. Due dates are counted from this day.",
      },
      {
        id: "graded-quiz-security-operations",
        iso: "2027-01-12T23:59",
        date: "12 Jan 2027",
        time: "11:59 PM · your time",
        state: "upcoming",
        badges: [{ label: "Due date", color: GRAY }, { label: "Graded quiz", color: GRAY }, { label: "Upcoming", color: GRAY }],
        title: "Module 1 · Graded Quiz: Security operations",
        description: "Two attempts. The best one counts.",
      },
      {
        id: "assignment-01-triage-report-for-three-alerts",
        iso: "2027-01-17T23:59",
        date: "17 Jan 2027",
        time: "11:59 PM · your time",
        state: "upcoming",
        badges: [{ label: "Due date", color: GRAY }, { label: "Assignment", color: GRAY }, { label: "Upcoming", color: GRAY }],
        title: "Module 2 · Assignment 01 · Triage report for three alerts",
        description: "Submit one report on the three alerts of the sample queue in Handouts.",
      },
      {
        id: "graded-quiz-detection-and-triage",
        iso: "2027-01-19T23:59",
        date: "19 Jan 2027",
        time: "11:59 PM · your time",
        state: "upcoming",
        badges: [{ label: "Due date", color: GRAY }, { label: "Graded quiz", color: GRAY }, { label: "Upcoming", color: GRAY }],
        title: "Module 2 · Graded Quiz: Detection and triage",
        description: "Two attempts. The best one counts.",
      },
      {
        id: "graded-quiz-incident-response",
        iso: "2027-02-02T23:59",
        date: "02 Feb 2027",
        time: "11:59 PM · your time",
        state: "upcoming",
        badges: [{ label: "Due date", color: GRAY }, { label: "Graded quiz", color: GRAY }, { label: "Upcoming", color: GRAY }],
        title: "Module 3 · Graded Quiz: Incident response",
        description: "Two attempts. The best one counts.",
      },
      {
        id: "tabletop-exercise-incident-summary",
        iso: "2027-02-09T23:59",
        date: "09 Feb 2027",
        time: "11:59 PM · your time",
        state: "locked",
        badges: [{ label: "Due date", color: GRAY }, { label: "Project", color: GRAY }, { label: "Locked", color: GRAY }],
        title: "Module 4 · Tabletop exercise: incident summary",
        description: "Unlocks when Module 3 is complete.",
      },
      {
        id: "graded-quiz-evidence-and-communication",
        iso: "2027-02-09T23:59",
        date: "09 Feb 2027",
        time: "11:59 PM · your time",
        state: "locked",
        badges: [{ label: "Due date", color: GRAY }, { label: "Graded quiz", color: GRAY }, { label: "Locked", color: GRAY }],
        title: "Module 4 · Graded Quiz: Evidence and communication",
        description: "Unlocks when Module 3 is complete.",
      },
      {
        id: "certificate-available",
        iso: "2027-02-17T09:00",
        date: "17 Feb 2027",
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
        id: "live-siem",
        title: "Will we work on a live SIEM in this course?",
        preview: "David: No. You work on exported log extracts and a sample alert queue.",
        meta: "2 days ago  ·  2 replies",
        answered: true,
        unread: false,
        messages: [
          {
            id: "m1",
            from: "learner",
            author: "You",
            body: "My company uses a SIEM but I have no access to it. Do I need a login to a tool for the triage assignment?",
            time: "2 days ago",
          },
          {
            id: "m2",
            from: "mentor",
            author: "David Chen",
            label: "Staff",
            accepted: true,
            body: "No. You work on exported log extracts and a sample alert queue in a spreadsheet, so no tool license is needed. The aim is the reasoning: what fired, what you checked, what you concluded. That carries over to whichever product you meet later.",
            time: "2 days ago",
          },
        ],
      },
      {
        id: "tabletop-group",
        title: "Is the tabletop exercise done in a group?",
        preview: "David: You run it alone from the scenario pack; your mentor grades your summary.",
        meta: "last week  ·  2 replies  ·  1 unread",
        answered: true,
        unread: true,
      },
      {
        id: "december-break",
        title: "Is anything due over the December break?",
        preview: "You: Asked today, no reply yet.",
        meta: "today  ·  1 reply",
        answered: false,
        unread: false,
      },
    ],
  },
};
