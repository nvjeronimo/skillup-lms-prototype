import { GRAY, SIX_SIGMA, THIS_WEEK, modulesFromOutline, playerHref, week } from "@/lib/courses/kit";
import type { CourseDetail, WeeklyGoal } from "@/lib/courses/kit";
import { outline } from "./outline";

/**
 * "Project Management with AI Tools": a stand-alone course of My Learning, in progress.
 * Its figures follow the My Learning card: 35% (14 of 40 topics), 12 hours in all, next up
 * "AI-assisted sprint planning". One graded quiz of three is done, which is the 10% of the
 * grade. Today is 24 Sep 2026, the day of the Dashboard: it lists nothing of this course as
 * due this week, so the next deadline here, Assignment 01, falls on 30 Sep.
 */
const WEEKLY_GOAL: WeeklyGoal = {
  state: "set",
  title: "Your weekly goal",
  body: "A day counts when you open any lesson in this course.",
  week: THIS_WEEK,
  days: week(["done", "missed", "done", "today", "upcoming", "upcoming", "upcoming"]),
  count: "2 of 3 days this week",
  lastWeek: "Last week: 3 of 3",
  plan: "Regular · 3 days a week.",
};

export const page: CourseDetail = {
  slug: outline.slug,
  title: outline.title,
  imageSrc: "/platform/covers/project-management-with-ai-tools.jpg",
  partners: [],
  deliveryMode: "Flexible Learning",
  difficulty: "Intermediate",
  stats: { structure: "5 modules · 40 topics", duration: "~ 12 hours", org: "SkillUp · PMA-01" },
  progress: {
    percent: 35,
    label: "Course progress",
    eyebrow: "Go to last topic",
    cta: "Resume course",
    href: playerHref(outline),
    notPassing: "Not passing yet · 10% of 70%",
    done: "14 of 40 topics",
    timeLeft: "~ 8h 35m left",
  },
  search: SIX_SIGMA.search,

  update: {
    title: "Course update",
    body: "The sprint planning worksheet in Handouts now has a column for the lines an AI assistant drafted. Assignment 01, at the end of Module 2, asks you to fill it in and counts towards your grade.",
  },
  intro: {
    title: "What you'll learn",
    lead: "Five modules that follow a project from charter to retrospective: scope and estimates, a sprint plan, risks and stakeholders, tracking and reporting. In each one you use an AI assistant to prepare the work, and you learn where its drafts need checking. Work through them at your own pace.",
  },
  modules: modulesFromOutline(outline, [
    { duration: "1h 45m" },
    { duration: "2h 42m", defaultOpen: true },
    { duration: "1h 54m" },
    { duration: "2h 36m" },
    { duration: "3h 03m", lockReason: "Complete “Module 4 · Tracking, Reporting and Responsible Use” to unlock" },
  ]),
  mentor: SIX_SIGMA.mentor,
  team: {
    label: "Course team",
    people: [
      { name: "Helena Brandt", role: "Lead instructor · SkillUp" },
      { name: "Samir Okafor", role: "Mentor · SkillUp" },
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
      { title: "Reach the passing grade", detail: "10% now · 70% needed", percent: 10 },
      { title: "Complete the course content", detail: "14 of 40 topics · 35%", percent: 35 },
    ],
  },
  handouts: {
    label: "Handouts",
    items: [
      "Project charter template (DOCX)",
      "Sprint planning worksheet (XLSX)",
      "Risk register template (XLSX)",
      "Prompt sheet for project managers (PDF)",
    ],
  },
  upcomingDates: {
    label: "Upcoming dates",
    items: [
      {
        id: "assignment-01",
        iso: "2026-09-30",
        day: "30",
        month: "SEP",
        title: "Assignment 01 · Sprint plan with an AI assistant",
        detail: "Assignment due · 23:59 your time",
        relative: "In 6 days",
        relativeColor: "yellow",
      },
      {
        id: "graded-quiz-risks",
        iso: "2026-10-11",
        day: "11",
        month: "OCT",
        title: "Graded Quiz: Risks and stakeholders",
        detail: "Assignment due · 23:59 your time",
        relative: "In 17 days",
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
      counts: "14 complete · 18 incomplete · 8 locked",
      percent: 35,
    },
    passAlert: {
      title: "A weighted grade of 70% is required to pass",
      body: "Your current weighted grade is 10%.",
    },
    grade: {
      title: "Your grade",
      badge: "10% · below the 70% pass mark",
      percent: 10,
      passPercent: 70,
      currentLabel: "Current 10%",
      passLabel: "Pass 70%",
      columns: SIX_SIGMA.progressTab.grade.columns,
      // Three graded quizzes, one done with full marks: a third of the type, so 10% of the
      // 30% it weighs. Nothing else is graded yet.
      rows: [
        { type: "Graded Quiz", weight: "30%", grade: "33%", weighted: "10%" },
        { type: "Homework", weight: "30%", grade: "0%", weighted: "0%" },
        { type: "Final Project", weight: "25%", grade: "0%", weighted: "0%" },
        { type: "Final Assessment", weight: "15%", grade: "0%", weighted: "0%" },
      ],
      sections: [
        {
          title: "Module 1 · Project Foundations and Where AI Fits",
          items: [{ title: "Graded Quiz: Foundations and AI basics", score: "3/3 · 100%" }],
        },
        {
          title: "Module 2 · Planning and Estimating with AI",
          items: [{ title: "Assignment 01 · Sprint plan with an AI assistant", score: "0/100 · 0%" }],
        },
        {
          title: "Module 3 · Risks, Stakeholders and Communication",
          items: [{ title: "Graded Quiz: Risks and stakeholders", score: "0/3 · 0%" }],
        },
        {
          title: "Module 4 · Tracking, Reporting and Responsible Use",
          items: [
            { title: "Assignment 02 · Risk register and status report", score: "0/100 · 0%" },
            { title: "Graded Quiz: Tracking and reporting", score: "0/3 · 0%" },
          ],
        },
        {
          title: "Module 5 · Final Project and Wrap-Up",
          items: [
            { title: "Final Project: Project plan pack", score: "0/20 · 0%" },
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
    // No missed-deadline alert: nothing on this learner's schedule is overdue.
    pastLabel: "Past",
    past: [
      {
        id: "course-starts",
        iso: "2026-08-31T00:00",
        date: "31 Aug 2026",
        time: "00:00 · your time",
        state: "complete",
        badges: [{ label: "COURSE", color: GRAY }],
        title: "Course starts",
        description: "Enrolment opened and all module content became available.",
      },
      {
        id: "graded-quiz-foundations",
        iso: "2026-09-13T23:59",
        date: "13 Sep 2026",
        time: "23:59 · your time",
        state: "complete",
        badges: [
          { label: "DUE DATE", color: GRAY },
          { label: "GRADED QUIZ", color: GRAY },
          { label: "COMPLETE", color: "success" },
        ],
        title: "Module 1 · Graded Quiz: Foundations and AI basics",
        description: "Submitted 2 days early. 3 of 3 correct.",
        link: "Open the assignment",
      },
    ],
    todayLabel: "Today · 24 Sep 2026",
    todayIso: "2026-09-24",
    upcomingLabel: "Upcoming",
    upcoming: [
      {
        id: "assignment-01",
        iso: "2026-09-30T23:59",
        date: "30 Sep 2026",
        time: "23:59 · your time",
        state: "upcoming",
        badges: [
          { label: "DUE DATE", color: GRAY },
          { label: "HOMEWORK", color: GRAY },
          { label: "UPCOMING", color: GRAY },
        ],
        title: "Module 2 · Assignment 01 · Sprint plan with an AI assistant",
        description: "A two-week sprint plan for the case-study team, with the lines the assistant drafted marked.",
        link: "Open the assignment",
      },
      {
        id: "graded-quiz-risks",
        iso: "2026-10-11T23:59",
        date: "11 Oct 2026",
        time: "23:59 · your time",
        state: "upcoming",
        badges: [
          { label: "DUE DATE", color: GRAY },
          { label: "GRADED QUIZ", color: GRAY },
          { label: "UPCOMING", color: GRAY },
        ],
        title: "Module 3 · Graded Quiz: Risks and stakeholders",
        description: "Two attempts. The best one counts.",
      },
      {
        id: "assignment-02",
        iso: "2026-10-21T23:59",
        date: "21 Oct 2026",
        time: "23:59 · your time",
        state: "upcoming",
        badges: [
          { label: "DUE DATE", color: GRAY },
          { label: "HOMEWORK", color: GRAY },
          { label: "UPCOMING", color: GRAY },
        ],
        title: "Module 4 · Assignment 02 · Risk register and status report",
        description: "A scored risk register and the one-page status report that goes with it.",
      },
      {
        id: "graded-quiz-tracking",
        iso: "2026-10-23T23:59",
        date: "23 Oct 2026",
        time: "23:59 · your time",
        state: "upcoming",
        badges: [
          { label: "DUE DATE", color: GRAY },
          { label: "GRADED QUIZ", color: GRAY },
          { label: "UPCOMING", color: GRAY },
        ],
        title: "Module 4 · Graded Quiz: Tracking and reporting",
        description: "Two attempts. The best one counts.",
      },
      {
        id: "final-project",
        iso: "2026-11-04T23:59",
        date: "04 Nov 2026",
        time: "23:59 · your time",
        state: "locked",
        badges: [
          { label: "DUE DATE", color: GRAY },
          { label: "FINAL PROJECT", color: GRAY },
          { label: "LOCKED", color: GRAY },
        ],
        title: "Module 5 · Final Project: Project plan pack",
        description: "Unlocks when Module 4 is complete.",
      },
      {
        id: "final-assessment",
        iso: "2026-11-06T23:59",
        date: "06 Nov 2026",
        time: "23:59 · your time",
        state: "locked",
        badges: [
          { label: "DUE DATE", color: GRAY },
          { label: "FINAL EXAM", color: GRAY },
          { label: "LOCKED", color: GRAY },
        ],
        title: "Module 5 · Final Assessment",
        description: "Unlocks when Module 4 is complete. One attempt.",
      },
      {
        id: "certificate-available",
        iso: "2026-11-09T09:00",
        date: "09 Nov 2026",
        time: "09:00 · your time",
        state: "upcoming",
        badges: [{ label: "CERTIFICATE", color: GRAY }],
        title: "Certificate available",
        description: "Your certificate is issued after this date if you have a passing grade.",
      },
      {
        id: "course-ends",
        iso: "2027-12-31T23:59",
        date: "31 Dec 2027",
        time: "23:59 · your time",
        state: "upcoming",
        badges: [{ label: "COURSE", color: GRAY }],
        title: "Course ends",
        description: "After this date the course is archived: content stays readable, graded work closes.",
      },
    ],
    timezoneNote: SIX_SIGMA.datesTab.timezoneNote,
  },

  qaTab: {
    ...SIX_SIGMA.qaTab,
    threads: [
      {
        id: "estimates-too-low",
        title: "The assistant's estimates are always lower than what my team delivers",
        preview: "Samir: Give it your last three sprints as the reference.",
        meta: "yesterday  ·  4 replies",
        answered: true,
        following: true,
        unread: false,
        messages: [
          {
            id: "m1",
            from: "learner",
            author: "You",
            body: "For the backlog activity I asked an assistant to estimate twelve items. Its total came to 60 hours. My team would need closer to 100 for work like this. Am I prompting it badly?",
            time: "2 days ago",
          },
          {
            id: "m2",
            from: "mentor",
            author: "Samir Okafor",
            label: "STAFF",
            accepted: true,
            body: "It is estimating for an ideal team with no meetings, reviews or interruptions, because nothing in the prompt says otherwise. Give it your last three sprints as the reference: what was planned and what was finished. Then ask it to estimate the new items against those, and to say which past item each one resembles.",
            time: "2 days ago",
          },
          {
            id: "m3",
            from: "learner",
            author: "You",
            body: "With the three sprints pasted in, the total is 92 hours and it flagged two items as larger than anything we have done. That feels right.",
            time: "yesterday",
          },
          {
            id: "m4",
            from: "mentor",
            author: "Samir Okafor",
            label: "STAFF",
            body: "Good. Those two flagged items are the ones to split or to discuss in planning. Keep the reference sprints in your prompt sheet: you will reuse them in Assignment 01.",
            time: "yesterday",
          },
        ],
      },
      {
        id: "assignment-01-team",
        title: "Can I use my own team's backlog for Assignment 01?",
        preview: "Samir: Yes, if you remove client names and anything confidential.",
        meta: "3 days ago  ·  2 replies  ·  1 unread",
        answered: true,
        following: false,
        unread: true,
      },
      {
        id: "critical-path-buffer",
        title: "Where does the buffer go: on each task or at the end of the path?",
        preview: "You: Clear now, one buffer at the end of the critical path.",
        meta: "last week  ·  3 replies",
        answered: true,
        following: false,
        unread: false,
      },
      {
        id: "which-assistant",
        title: "Does it matter which AI assistant I use for the course?",
        preview: "You: Asked today, no reply yet.",
        meta: "today  ·  1 reply",
        answered: false,
        following: false,
        unread: false,
      },
    ],
    mentorLine: "Samir Okafor · your mentor · typically responds within 1 day",
  },
};
