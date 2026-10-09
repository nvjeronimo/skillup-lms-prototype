import { GRAY, SIX_SIGMA, THIS_WEEK, modulesFromOutline, playerHref, week } from "@/lib/courses/kit";
import type { CourseDetail, WeeklyGoal } from "@/lib/courses/kit";
import { outline } from "./outline";

/**
 * "Capstone Project: AI-First Marketing System": course 7 of 7 of the AI Augmented Digital
 * Marketing program, not started. Its figures follow its row on the Program page
 * (lib/programs/ai-driven-digital-marketing): 4 modules, 11 topics, about 6 hours, no
 * progress, next up "Course Introduction". The grade is the project: three milestones, the
 * final submission and the peer reviews given. Nothing is done, graded or overdue. Today is
 * 24 Sep 2026; the due dates are those of the suggested pace of the program, which reaches
 * the capstone on 5 Apr 2027 (sample data: the program file gives only its start and end).
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
  imageSrc: "/platform/covers/program-course-7-capstone.jpg",
  partners: [],
  deliveryMode: "Flexible Learning",
  difficulty: "Beginner",
  stats: { structure: "4 modules · 11 topics", duration: "~ 6 hours", org: "SkillUp · ADM-07" },
  progress: {
    percent: 0,
    label: "Course progress",
    eyebrow: "Start with the first topic",
    cta: "Start course",
    href: playerHref(outline),
    notPassing: "Not passing yet · 0% of 70%",
    done: "0 of 11 topics",
    timeLeft: "~ 6h left",
  },
  search: SIX_SIGMA.search,
  program: {
    slug: "ai-driven-digital-marketing",
    title: "Certificate Program in AI Augmented Digital Marketing",
  },

  update: {
    title: "Course update",
    body: "The capstone is one project built in three milestones. Before you start, collect the work you kept from courses 1 to 6: most of it goes into the project. The rubric used for every milestone and for the peer review is in Handouts.",
  },
  intro: {
    title: "What you'll build",
    lead: "An AI-first marketing system for one business: the strategy, the channels, the content, the customer lifecycle and the measurement, with a log of where AI did the work and where you checked it. Four modules: the brief, two stages of building, and the final submission with a peer review.",
  },
  modules: modulesFromOutline(outline, [
    { duration: "51m", defaultOpen: true },
    { duration: "2h 27m" },
    { duration: "1h 07m" },
    { duration: "1h 45m", lockReason: "Complete Module 3 to unlock" },
  ]),
  mentor: SIX_SIGMA.mentor,
  team: {
    label: "Course team",
    people: [
      { name: "Rajesh Menon", role: "Lead instructor · SkillUp" },
      { name: "Priya Raman", role: "Capstone reviewer · SkillUp" },
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
      { title: "Complete the course content", detail: "0 of 11 topics · 0%", percent: 0 },
    ],
  },
  handouts: {
    label: "Handouts",
    items: [
      "Capstone brief and rubric (PDF)",
      "Marketing system template (DOCX)",
      "AI workflow log template (XLSX)",
      "Three business scenarios to choose from (PDF)",
    ],
  },
  upcomingDates: {
    label: "Upcoming dates",
    items: [
      {
        id: "suggested-start",
        iso: "2027-04-05",
        day: "01",
        month: "MAR",
        title: "Suggested start",
        detail: "Program pace · after course 6",
        relative: "In 6 months",
        relativeColor: "gray",
      },
      {
        id: "milestone-1",
        iso: "2027-04-11",
        day: "07",
        month: "MAR",
        title: "Milestone 1 · Strategy and channel plan",
        detail: "Assignment due · 23:59 your time",
        relative: "In 6 months",
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
      counts: "0 complete · 9 incomplete · 2 locked",
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
      // Three milestones at 15% each, the final submission and the two reviews the learner
      // gives. The practice quiz is not graded. Nothing is submitted yet.
      rows: [
        { type: "Milestone", weight: "45%", grade: "0%", weighted: "0%" },
        { type: "Final Submission", weight: "45%", grade: "0%", weighted: "0%" },
        { type: "Peer Review", weight: "10%", grade: "0%", weighted: "0%" },
      ],
      sections: [
        {
          title: "Module 2 · Build: Strategy, Channels & Content",
          items: [
            { title: "Milestone 1 · Strategy and channel plan", score: "0/100 · 0%" },
            { title: "Milestone 2 · Content and campaign assets", score: "0/100 · 0%" },
          ],
        },
        {
          title: "Module 3 · Measure, Document & Check",
          items: [{ title: "Milestone 3 · Measurement plan and AI workflow log", score: "0/100 · 0%" }],
        },
        {
          title: "Module 4 · Final Submission & Peer Review",
          items: [
            { title: "Final Submission: AI-first marketing system", score: "0/20 · 0%" },
            { title: "Review two capstone projects", score: "0/2 · 0%" },
          ],
        },
      ],
    },
    note: SIX_SIGMA.progressTab.note,
    weeklyGoal: WEEKLY_GOAL,
  },

  datesTab: {
    title: "Important Dates",
    // No missed-deadline alert: the course is not started and nothing is due before March.
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
        description: "Open since the program started. The capstone draws on courses 1 to 6, so it is best taken last.",
      },
    ],
    todayLabel: "Today · 24 Sep 2026",
    todayIso: "2026-09-24",
    upcomingLabel: "Upcoming",
    upcoming: [
      {
        id: "suggested-start",
        iso: "2027-04-05T00:00",
        date: "05 Apr 2027",
        time: "00:00 · your time",
        state: "upcoming",
        badges: [{ label: "COURSE", color: GRAY }],
        title: "Suggested start",
        description: "The pace of the program reaches the capstone on this date. The due dates below follow from it.",
      },
      {
        id: "milestone-1",
        iso: "2027-04-11T23:59",
        date: "11 Apr 2027",
        time: "23:59 · your time",
        state: "upcoming",
        badges: [
          { label: "DUE DATE", color: GRAY },
          { label: "MILESTONE", color: GRAY },
          { label: "UPCOMING", color: GRAY },
        ],
        title: "Module 2 · Milestone 1 · Strategy and channel plan",
        description: "The business, its audience and objective, and the channels you chose, with the reason for each.",
      },
      {
        id: "milestone-2",
        iso: "2027-04-18T23:59",
        date: "18 Apr 2027",
        time: "23:59 · your time",
        state: "upcoming",
        badges: [
          { label: "DUE DATE", color: GRAY },
          { label: "MILESTONE", color: GRAY },
          { label: "UPCOMING", color: GRAY },
        ],
        title: "Module 2 · Milestone 2 · Content and campaign assets",
        description: "One finished asset per channel of your plan, each with its brief and prompt.",
      },
      {
        id: "milestone-3",
        iso: "2027-04-23T23:59",
        date: "23 Apr 2027",
        time: "23:59 · your time",
        state: "upcoming",
        badges: [
          { label: "DUE DATE", color: GRAY },
          { label: "MILESTONE", color: GRAY },
          { label: "UPCOMING", color: GRAY },
        ],
        title: "Module 3 · Milestone 3 · Measurement plan and AI workflow log",
        description: "One metric per objective, how you will read it, and the log of every AI-assisted step.",
      },
      {
        id: "final-submission",
        iso: "2027-04-28T23:59",
        date: "28 Apr 2027",
        time: "23:59 · your time",
        state: "locked",
        badges: [
          { label: "DUE DATE", color: GRAY },
          { label: "FINAL SUBMISSION", color: GRAY },
          { label: "LOCKED", color: GRAY },
        ],
        title: "Module 4 · Final Submission: AI-first marketing system",
        description: "Unlocks when Module 3 is complete. The three milestones, revised and joined into one document.",
      },
      {
        id: "peer-reviews",
        iso: "2027-05-02T23:59",
        date: "02 May 2027",
        time: "23:59 · your time",
        state: "locked",
        badges: [
          { label: "DUE DATE", color: GRAY },
          { label: "PEER REVIEW", color: GRAY },
          { label: "LOCKED", color: GRAY },
        ],
        title: "Module 4 · Review two capstone projects",
        description: "Opens when you have submitted your own project.",
      },
      {
        id: "certificate-available",
        iso: "2027-05-03T09:00",
        date: "03 May 2027",
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
        id: "which-business",
        title: "Can the capstone be about the business I work for?",
        preview: "Marcus: Yes, if you leave out anything confidential.",
        meta: "3 days ago  ·  3 replies",
        answered: true,
        following: true,
        unread: false,
        messages: [
          {
            id: "m1",
            from: "learner",
            author: "You",
            body: "I am only on course 2, but I would like to keep the right material as I go. Can I build the capstone around my employer, or does it have to be one of the scenarios?",
            time: "3 days ago",
          },
          {
            id: "m2",
            from: "mentor",
            author: "Marcus Lee",
            label: "STAFF",
            accepted: true,
            body: "A real business usually makes a stronger project, and you may use your employer if they agree. Two peers will read your submission, so leave out real customer data, budgets and anything not already public. Replace figures with rounded or sample numbers and say that you did.",
            time: "3 days ago",
          },
          {
            id: "m3",
            from: "learner",
            author: "You",
            body: "Understood. What should I be keeping from the courses before it?",
            time: "2 days ago",
          },
          {
            id: "m4",
            from: "mentor",
            author: "Marcus Lee",
            label: "STAFF",
            body: "Keep each graded assignment with the comments you received, and the prompts you used to make it. The capstone asks for an AI workflow log, and it is much easier to keep one as you go than to rebuild it at the end.",
            time: "2 days ago",
          },
        ],
      },
      {
        id: "reuse-earlier-work",
        title: "Am I allowed to reuse my assignments from courses 1 to 6?",
        preview: "Marcus: Yes. Revise them and say what changed.",
        meta: "last week  ·  2 replies  ·  1 unread",
        answered: true,
        following: false,
        unread: true,
      },
      {
        id: "milestone-resubmit",
        title: "Can a milestone be resubmitted after it is graded?",
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
