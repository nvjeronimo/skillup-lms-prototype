import { GRAY, SIX_SIGMA, THIS_WEEK, modulesFromOutline, playerHref, week } from "@/lib/courses/kit";
import type { CourseDetail, WeeklyGoal } from "@/lib/courses/kit";
import { outline } from "./outline";
/**
 * The mentor of this course, in one place (UX audit, 20 Oct 2026): the Q&A tab, the Discussion
 * inbox and the Services page all read it, so the same course never shows two mentors.
 */
export const MENTOR = {
  name: "David Chen",
  firstName: "David",
  role: "UX research and design",
  responds: "typically responds within 1 day",
} as const;

import { SAMPLE_TODAY, relativeColor, relativeLabel, todayLabel } from "@/lib/sample-time";

/**
 * "UX Research and Design Thinking": a stand-alone course of My Learning, just started.
 * Its figures follow the My Learning card: 5% (2 of 40 topics), 10 hours in all, next up
 * "Discovery interview techniques". Nothing is graded yet. Today is 24 Oct 2026, the day of
 * the Dashboard, whose due item is the persona research draft, due tonight; the graded quiz
 * before it is overdue, which is what the missed-deadline alert is about.
 */
const WEEKLY_GOAL: WeeklyGoal = {
  state: "set",
  title: "Your weekly goal",
  body: "A day counts when you open any lesson in this course.",
  week: THIS_WEEK,
  days: week(["missed", "done", "missed", "missed", "missed", "today", "upcoming"]),
  count: "1 of 3 days this week",
  lastWeek: "Last week: 1 of 3",
  plan: "Regular · 3 days a week.",
};

export const page: CourseDetail = {
  slug: outline.slug,
  title: outline.title,
  imageSrc: "/platform/covers/ux-research-and-design-thinking.jpg",
  deliveryMode: "Flexible Learning",
  difficulty: "Beginner",
  stats: { structure: "4 modules · 40 topics", duration: "~ 10 hours", org: "SkillUp · UXR-01" },
  progress: {
    percent: 5,
    label: "Course progress",
    eyebrow: "Go to last topic",
    cta: "Resume course",
    href: playerHref(outline),
    notPassing: "Not passing yet · 0% of 70%",
    done: "2 of 40 topics",
    timeLeft: "~ 9h 40m left",
  },
  search: SIX_SIGMA.search,

  update: {
    title: "Course update",
    body: "The five interview transcripts for the persona research draft are in Handouts. The draft counts towards your grade: once you submit it, you review the draft of one peer.",
  },
  intro: {
    title: "What you'll learn",
    lead: "Four modules that follow the design thinking process: understand the people you design for, define the problem, generate and prototype ideas, then test them. Work through them at your own pace.",
  },
  modules: modulesFromOutline(outline, [
    { duration: "2h 35m", defaultOpen: true },
    { duration: "2h 30m" },
    { duration: "2h 45m" },
    { duration: "2h 10m", lockReason: "Complete “Module 3 · Ideate and Prototype” to unlock" },
  ]),
  mentor: SIX_SIGMA.mentor,
  team: {
    label: "Course team",
    people: [
      { name: "Dr. Marta Silva", role: "Lead instructor · SkillUp" },
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
      { title: "Complete the course content", detail: "2 of 40 topics · 5%", percent: 5 },
    ],
  },
  handouts: {
    label: "Handouts",
    items: [
      "Interview guide template (DOCX)",
      "Case study: five interview transcripts (PDF)",
      "Persona template (PPTX)",
    ],
  },
  upcomingDates: {
    label: "Upcoming dates",
    items: [
      {
        id: "persona-research-draft",
        iso: "2026-10-24",
        day: "24",
        month: "OCT",
        title: "Persona research draft",
        detail: "Peer assessment due · 11:59 PM · your time",
        relative: relativeLabel("2026-10-24"),
        relativeColor: relativeColor("2026-10-24"),
      },
      {
        id: "graded-quiz-define",
        iso: "2026-11-04",
        day: "04",
        month: "NOV",
        title: "Graded Quiz: Synthesis and problem framing",
        detail: "Assignment due · 11:59 PM · your time",
        relative: relativeLabel("2026-11-04"),
        relativeColor: relativeColor("2026-11-04"),
      },
    ],
    cta: "All dates",
  },
  tools: SIX_SIGMA.tools,

  progressTab: {
    title: "Your progress",
    completion: {
      title: "Course completion",
      complete: 2,
      incomplete: 29,
      locked: 9,
    },
    passAlert: {
      title: "A weighted grade of 70% is required to pass",
      body: "Your current weighted grade is 0%.",
    },
    grade: {
      title: "Your grade",
      percent: 0,
      passPercent: 70,
      passLabel: "Pass 70%",
      columns: SIX_SIGMA.progressTab.grade.columns,
      rows: [
        { type: "Graded Quiz", weight: "30%", grade: "0%", weighted: "0%" },
        { type: "Peer Assessment", weight: "40%", grade: "0%", weighted: "0%" },
        { type: "Final Project", weight: "30%", grade: "0%", weighted: "0%" },
      ],
      sections: [
        {
          title: "Module 1 · Empathize: Understanding Users",
          items: [
            { title: "Graded Quiz: Research foundations", score: "0/3 · 0%" },
            { title: "Persona research draft", score: "0/20 · 0%" },
          ],
        },
        {
          title: "Module 2 · Define: From Research to Problem Statements",
          items: [{ title: "Graded Quiz: Synthesis and problem framing", score: "0/3 · 0%" }],
        },
        {
          title: "Module 3 · Ideate and Prototype",
          items: [
            { title: "Prototype critique", score: "0/20 · 0%" },
            { title: "Graded Quiz: Ideate and prototype", score: "0/3 · 0%" },
          ],
        },
        {
          title: "Module 4 · Test, Iterate, and Final Project",
          items: [{ title: "Final Project: Research-backed redesign", score: "0/20 · 0%" }],
        },
      ],
    },
    note: SIX_SIGMA.progressTab.note,
    weeklyGoal: WEEKLY_GOAL,
  },

  datesTab: {
    title: "Important Dates",
    missedAlert: SIX_SIGMA.datesTab.missedAlert,
    pastLabel: "Past",
    past: [
      {
        id: "course-starts",
        iso: "2026-10-07T00:00",
        date: "07 Oct 2026",
        time: "12:00 AM · your time",
        state: "complete",
        badges: [{ label: "Course", color: GRAY }],
        title: "Course starts",
        description: "Enrollment opened and all module content became available.",
      },
      {
        id: "graded-quiz-foundations",
        iso: "2026-10-21T23:59",
        date: "21 Oct 2026",
        time: "11:59 PM · your time",
        state: "overdue",
        badges: [
          { label: "Due date", color: GRAY },
          { label: "Graded quiz", color: GRAY },
          { label: "Overdue", color: "error" },
        ],
        title: "Module 1 · Graded Quiz: Research foundations",
        description: "Past due and not submitted yet.",
        link: "Open the assignment",
      },
    ],
    todayLabel: todayLabel(),
    todayIso: SAMPLE_TODAY,
    upcomingLabel: "Upcoming",
    upcoming: [
      {
        id: "persona-research-draft",
        iso: "2026-10-24T23:59",
        date: "24 Oct 2026",
        time: "11:59 PM · your time",
        state: "upcoming",
        badges: [
          { label: "Due date", color: GRAY },
          { label: "Peer assessment", color: GRAY },
          { label: "Due today", color: "warning" },
        ],
        title: "Module 1 · Persona research draft",
        description: "Submit one persona with its evidence table, then review the draft of one peer.",
        link: "Open the assignment",
      },
      {
        id: "graded-quiz-define",
        iso: "2026-11-04T23:59",
        date: "04 Nov 2026",
        time: "11:59 PM · your time",
        state: "upcoming",
        badges: [
          { label: "Due date", color: GRAY },
          { label: "Graded quiz", color: GRAY },
          { label: "Upcoming", color: GRAY },
        ],
        title: "Module 2 · Graded Quiz: Synthesis and problem framing",
        description: "Two attempts. The best one counts.",
      },
      {
        id: "prototype-critique",
        iso: "2026-11-15T23:59",
        date: "15 Nov 2026",
        time: "11:59 PM · your time",
        state: "upcoming",
        badges: [
          { label: "Due date", color: GRAY },
          { label: "Peer assessment", color: GRAY },
          { label: "Upcoming", color: GRAY },
        ],
        title: "Module 3 · Prototype critique",
        description: "Submit your prototype and the questions it is meant to answer, then review one peer.",
      },
      {
        id: "graded-quiz-prototype",
        iso: "2026-11-17T23:59",
        date: "17 Nov 2026",
        time: "11:59 PM · your time",
        state: "upcoming",
        badges: [
          { label: "Due date", color: GRAY },
          { label: "Graded quiz", color: GRAY },
          { label: "Upcoming", color: GRAY },
        ],
        title: "Module 3 · Graded Quiz: Ideate and prototype",
        description: "Two attempts. The best one counts.",
      },
      {
        id: "final-project",
        iso: "2026-11-29T23:59",
        date: "29 Nov 2026",
        time: "11:59 PM · your time",
        state: "locked",
        badges: [
          { label: "Due date", color: GRAY },
          { label: "Final project", color: GRAY },
          { label: "Locked", color: GRAY },
        ],
        title: "Module 4 · Final Project: Research-backed redesign",
        description: "Unlocks when Module 3 is complete.",
      },
      {
        id: "certificate-available",
        iso: "2026-12-06T09:00",
        date: "06 Dec 2026",
        time: "9:00 AM · your time",
        state: "upcoming",
        badges: [{ label: "Certificate", color: GRAY }],
        title: "Certificate available",
        description: "Your certificate is issued after this date if you have a passing grade.",
      },
      {
        id: "course-ends",
        iso: "2027-12-31T23:59",
        date: "31 Dec 2027",
        time: "11:59 PM · your time",
        state: "upcoming",
        badges: [{ label: "Course", color: GRAY }],
        title: "Course ends",
        description: "After this date the course is archived — content stays readable, graded work closes.",
      },
    ],
    timezoneNote: SIX_SIGMA.datesTab.timezoneNote,
  },

  qaTab: {
    ...SIX_SIGMA.qaTab,
    mentorLine: `${MENTOR.name} · your mentor · ${MENTOR.responds}`,
    threads: [
      {
        id: "interview-count",
        title: "How many interviews do I need for a first persona?",
        preview: `${MENTOR.firstName}: Stop when new interviews stop adding new themes.`,
        meta: "yesterday  ·  4 replies",
        answered: true,
        following: true,
        unread: false,
        messages: [
          {
            id: "m1",
            from: "learner",
            author: "You",
            body: "The brief asks for at least three interviews of my own, or the five of the case study. Is three really enough for a persona?",
            time: "yesterday",
          },
          {
            id: "m2",
            from: "mentor",
            author: MENTOR.name,
            label: "Staff",
            accepted: true,
            body: "For a draft, yes. The number matters less than the pattern: you stop when new interviews stop adding new themes. With three you will see the start of a pattern, and the draft should say so.",
            time: "yesterday",
          },
          {
            id: "m3",
            from: "learner",
            author: "You",
            body: "Two of my three participants do the same job. Is that a problem?",
            time: "yesterday",
          },
          {
            id: "m4",
            from: "mentor",
            author: MENTOR.name,
            label: "Staff",
            body: "Say it in the evidence table. A persona that is open about a narrow sample is more useful than one that hides it. If you can, add one person in a different role before the final version.",
            time: "today",
          },
        ],
      },
      {
        id: "interview-friends",
        title: "Can I interview friends or colleagues for the draft?",
        preview: `${MENTOR.firstName}: Yes, if they really do the activity you are studying.`,
        meta: "3 days ago  ·  2 replies  ·  1 unread",
        answered: true,
        following: false,
        unread: true,
      },
      {
        id: "leading-question",
        title: "Is “How do you feel about slow checkouts?” a leading question?",
        preview: "You: That makes sense, I will ask what happened instead.",
        meta: "last week  ·  3 replies",
        answered: true,
        following: false,
        unread: false,
      },
      {
        id: "peer-anonymous",
        title: "Is the peer assessment anonymous?",
        preview: "You: Asked today, no reply yet.",
        meta: "today  ·  1 reply",
        answered: false,
        following: false,
        unread: false,
      },
    ],
  },
};
