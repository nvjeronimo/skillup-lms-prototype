import { GRAY, SIX_SIGMA, THIS_WEEK, modulesFromOutline, playerHref, week } from "@/lib/courses/kit";
import type { CourseDetail, WeeklyGoal } from "@/lib/courses/kit";
import { outline } from "./outline";
import { SAMPLE_TODAY, relativeColor, relativeLabel, todayLabel } from "@/lib/sample-time";

/**
 * "Capstone Project: AI-First Marketing System": course 7 of 7 of the AI Augmented Digital
 * Marketing program, not started. Its figures follow its row on the Program page
 * (lib/programs/ai-driven-digital-marketing): 4 modules, 11 topics, about 6 hours, no
 * progress, next up "Course Introduction". The grade is the project: three milestones, the
 * final submission, graded by a mentor. Nothing is done, graded or overdue. Today is
 * 24 Oct 2026; the due dates are those of the suggested pace of the program, which reaches
 * the capstone on 5 May 2027 (sample data: the program file gives only its start and end).
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
  imageSrc: "/platform/covers/program-course-7-capstone.jpg",
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
    body: "The capstone is one project built in three milestones. Before you start, collect the work you kept from courses 1 to 6: most of it goes into the project. The rubric your mentor uses for every milestone and for the final submission is in Handouts.",
  },
  intro: {
    title: "What you'll build",
    lead: "An AI-first marketing system for one business: the strategy, the channels, the content, the customer lifecycle and the measurement, with a log of where AI did the work and where you checked it. Four modules: the brief, two stages of building, and the final submission, graded by your mentor.",
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
        iso: "2027-05-05",
        day: "05",
        month: "MAY",
        title: "Suggested start",
        detail: "Program pace · after course 6",
        relative: relativeLabel("2027-05-05"),
        relativeColor: relativeColor("2027-05-05"),
      },
      {
        id: "milestone-1",
        iso: "2027-05-11",
        day: "11",
        month: "MAY",
        title: "Milestone 1 · Strategy and channel plan",
        detail: "Assignment due · 11:59 PM · your time",
        relative: relativeLabel("2027-05-11"),
        relativeColor: relativeColor("2027-05-11"),
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
      incomplete: 9,
      locked: 2,
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
      // Three milestones at 15% each and the final submission, all graded by a mentor (peer and
      // self assessment are off on SkillUp courses). The practice quiz is not graded.
      rows: [
        { type: "Milestone", weight: "45%", grade: "0%", weighted: "0%" },
        { type: "Final Submission", weight: "55%", grade: "0%", weighted: "0%" },
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
          title: "Module 4 · Final Submission & Grading",
          items: [{ title: "Final Submission: AI-first marketing system", score: "0/20 · 0%" }],
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
        time: "12:00 AM · your time",
        state: "complete",
        badges: [{ label: "Course", color: GRAY }],
        title: "Course opens",
        description: "Open since the program started. The capstone draws on courses 1 to 6, so it is best taken last.",
      },
    ],
    todayLabel: todayLabel(),
    todayIso: SAMPLE_TODAY,
    upcomingLabel: "Upcoming",
    upcoming: [
      {
        id: "suggested-start",
        iso: "2027-05-05T00:00",
        date: "05 May 2027",
        time: "12:00 AM · your time",
        state: "upcoming",
        badges: [{ label: "Course", color: GRAY }],
        title: "Suggested start",
        description: "The pace of the program reaches the capstone on this date. The due dates below follow from it.",
      },
      {
        id: "milestone-1",
        iso: "2027-05-11T23:59",
        date: "11 May 2027",
        time: "11:59 PM · your time",
        state: "upcoming",
        badges: [
          { label: "Due date", color: GRAY },
          { label: "Milestone", color: GRAY },
          { label: "Upcoming", color: GRAY },
        ],
        title: "Module 2 · Milestone 1 · Strategy and channel plan",
        description: "The business, its audience and objective, and the channels you chose, with the reason for each.",
      },
      {
        id: "milestone-2",
        iso: "2027-05-18T23:59",
        date: "18 May 2027",
        time: "11:59 PM · your time",
        state: "upcoming",
        badges: [
          { label: "Due date", color: GRAY },
          { label: "Milestone", color: GRAY },
          { label: "Upcoming", color: GRAY },
        ],
        title: "Module 2 · Milestone 2 · Content and campaign assets",
        description: "One finished asset per channel of your plan, each with its brief and prompt.",
      },
      {
        id: "milestone-3",
        iso: "2027-05-23T23:59",
        date: "23 May 2027",
        time: "11:59 PM · your time",
        state: "upcoming",
        badges: [
          { label: "Due date", color: GRAY },
          { label: "Milestone", color: GRAY },
          { label: "Upcoming", color: GRAY },
        ],
        title: "Module 3 · Milestone 3 · Measurement plan and AI workflow log",
        description: "One metric per objective, how you will read it, and the log of every AI-assisted step.",
      },
      {
        id: "final-submission",
        iso: "2027-05-28T23:59",
        date: "28 May 2027",
        time: "11:59 PM · your time",
        state: "locked",
        badges: [
          { label: "Due date", color: GRAY },
          { label: "Final submission", color: GRAY },
          { label: "Locked", color: GRAY },
        ],
        title: "Module 4 · Final Submission: AI-first marketing system",
        description: "Unlocks when Module 3 is complete. The three milestones, revised and joined into one document.",
      },
      {
        id: "certificate-available",
        iso: "2027-06-02T09:00",
        date: "02 Jun 2027",
        time: "9:00 AM · your time",
        state: "upcoming",
        badges: [{ label: "Certificate", color: GRAY }],
        title: "Certificate available",
        description: "Your certificate is issued after this date if you have a passing grade.",
      },
      {
        id: "course-ends",
        iso: "2027-10-31T23:59",
        date: "31 Oct 2027",
        time: "11:59 PM · your time",
        state: "upcoming",
        badges: [{ label: "Course", color: GRAY }],
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
            label: "Staff",
            accepted: true,
            body: "A real business usually makes a stronger project, and you may use your employer if they agree. Your mentor will read your submission, so leave out real customer data, budgets and anything not already public. Replace figures with rounded or sample numbers and say that you did.",
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
            label: "Staff",
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
        unread: true,
      },
      {
        id: "milestone-resubmit",
        title: "Can a milestone be resubmitted after it is graded?",
        preview: "You: Asked today, no reply yet.",
        meta: "today  ·  1 reply",
        answered: false,
        unread: false,
      },
    ],
    mentorLine: "Marcus Lee · your mentor · typically responds within 1 day",
  },
};
