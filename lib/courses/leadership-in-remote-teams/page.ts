import { GRAY, SIX_SIGMA, THIS_WEEK, modulesFromOutline, playerHref, week } from "@/lib/courses/kit";
import type { CourseDetail, WeeklyGoal } from "@/lib/courses/kit";
import { outline } from "./outline";

/**
 * "Leadership in Remote Teams": a stand-alone course of My Learning, in progress, also on
 * the Dashboard's resume list. Its figures follow both: 52% (13 of 25 topics), 6 hours in
 * all, next up "Async standups". One graded quiz of two and the one homework are done,
 * which is the 39% of the grade. Today is 24 Sep 2026, the day of the Dashboard: it lists
 * nothing of this course as due this week, so the next deadline here falls on 4 Oct.
 */
const WEEKLY_GOAL: WeeklyGoal = {
  state: "met",
  title: "You met your goal this week",
  body: "Take a moment to celebrate your progress.",
  week: THIS_WEEK,
  days: week(["done", "missed", "done", "today-done", "upcoming", "upcoming", "upcoming"]),
  count: "3 of 3 days this week",
  lastWeek: "Last week: 2 of 3",
  plan: "Regular · 3 days a week.",
};

export const page: CourseDetail = {
  slug: outline.slug,
  title: outline.title,
  imageSrc: "/platform/covers/leadership-in-remote-teams.jpg",
  partners: [],
  deliveryMode: "Flexible Learning",
  difficulty: "Intermediate",
  stats: { structure: "4 modules · 25 topics", duration: "~ 6 hours", org: "SkillUp · LRT-01" },
  progress: {
    percent: 52,
    label: "Course progress",
    eyebrow: "Go to last topic",
    cta: "Resume course",
    href: playerHref(outline),
    notPassing: "Not passing yet · 39% of 70%",
    done: "13 of 25 topics",
    timeLeft: "~ 3h 10m left",
  },
  search: SIX_SIGMA.search,

  update: {
    title: "Course update",
    body: "Your Assignment 01 has been graded: the comments are on the assignment itself. The weekly calendar for the Module 3 activity is in Handouts, with the working hours of each time zone already marked.",
  },
  intro: {
    title: "What you'll learn",
    lead: "Four modules for people who lead a team they rarely meet in person: building trust, agreeing how the team communicates, choosing which meetings to keep, and managing by outcomes while looking after the people. Work through them at your own pace.",
  },
  modules: modulesFromOutline(outline, [
    { duration: "1h 08m" },
    { duration: "1h 43m" },
    { duration: "1h 14m", defaultOpen: true },
    { duration: "1h 55m", lockReason: "Complete “Module 3 · Meetings, Rituals and Async Work” to unlock" },
  ]),
  mentor: SIX_SIGMA.mentor,
  team: {
    label: "Course team",
    people: [
      { name: "Nadia Petrova", role: "Lead instructor · SkillUp" },
      { name: "Tomás Ribeiro", role: "Mentor · SkillUp" },
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
      { title: "Reach the passing grade", detail: "39% now · 70% needed", percent: 39 },
      { title: "Complete the course content", detail: "13 of 25 topics · 52%", percent: 52 },
    ],
  },
  handouts: {
    label: "Handouts",
    items: [
      "Team working agreement template (DOCX)",
      "Communication charter template (DOCX)",
      "Weekly calendar for three time zones (XLSX)",
    ],
  },
  upcomingDates: {
    label: "Upcoming dates",
    items: [
      {
        id: "graded-quiz-meetings",
        iso: "2026-10-04",
        day: "04",
        month: "OCT",
        title: "Graded Quiz: Meetings and rituals",
        detail: "Assignment due · 23:59 your time",
        relative: "In 10 days",
        relativeColor: "gray",
      },
      {
        id: "final-project",
        iso: "2026-10-18",
        day: "18",
        month: "OCT",
        title: "Final Project: 30-day plan for a remote team",
        detail: "Project due · 23:59 your time",
        relative: "In 24 days",
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
      counts: "13 complete · 6 incomplete · 6 locked",
      percent: 52,
    },
    passAlert: {
      title: "A weighted grade of 70% is required to pass",
      body: "Your current weighted grade is 39%.",
    },
    grade: {
      title: "Your grade",
      badge: "39% · below the 70% pass mark",
      percent: 39,
      passPercent: 70,
      currentLabel: "Current 39%",
      passLabel: "Pass 70%",
      columns: SIX_SIGMA.progressTab.grade.columns,
      // Two graded quizzes, one done with full marks: half of the type, so 15% of its 30%.
      // The one homework scored 80%, so 24% of its 30%. 15% + 24% = the 39% of the header.
      rows: [
        { type: "Graded Quiz", weight: "30%", grade: "50%", weighted: "15%" },
        { type: "Homework", weight: "30%", grade: "80%", weighted: "24%" },
        { type: "Final Project", weight: "40%", grade: "0%", weighted: "0%" },
      ],
      sections: [
        {
          title: "Module 1 · Trust and Expectations at a Distance",
          items: [{ title: "Graded Quiz: Trust and expectations", score: "3/3 · 100%" }],
        },
        {
          title: "Module 2 · Communication Norms",
          items: [{ title: "Assignment 01 · Team communication charter", score: "80/100 · 80%" }],
        },
        {
          title: "Module 3 · Meetings, Rituals and Async Work",
          items: [{ title: "Graded Quiz: Meetings and rituals", score: "0/3 · 0%" }],
        },
        {
          title: "Module 4 · Performance, Feedback and Wellbeing",
          items: [{ title: "Final Project: 30-day plan for a remote team", score: "0/20 · 0%" }],
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
        iso: "2026-08-24T00:00",
        date: "24 Aug 2026",
        time: "00:00 · your time",
        state: "complete",
        badges: [{ label: "COURSE", color: GRAY }],
        title: "Course starts",
        description: "Enrolment opened and all module content became available.",
      },
      {
        id: "graded-quiz-trust",
        iso: "2026-09-06T23:59",
        date: "06 Sep 2026",
        time: "23:59 · your time",
        state: "complete",
        badges: [
          { label: "DUE DATE", color: GRAY },
          { label: "GRADED QUIZ", color: GRAY },
          { label: "COMPLETE", color: "success" },
        ],
        title: "Module 1 · Graded Quiz: Trust and expectations",
        description: "Submitted 3 days early. 3 of 3 correct.",
        link: "Open the assignment",
      },
      {
        id: "assignment-01",
        iso: "2026-09-20T23:59",
        date: "20 Sep 2026",
        time: "23:59 · your time",
        state: "complete",
        badges: [
          { label: "DUE DATE", color: GRAY },
          { label: "HOMEWORK", color: GRAY },
          { label: "COMPLETE", color: "success" },
        ],
        title: "Module 2 · Assignment 01 · Team communication charter",
        description: "Submitted 2 days early. Graded 80/100.",
        link: "Open the assignment",
      },
    ],
    todayLabel: "Today · 24 Sep 2026",
    todayIso: "2026-09-24",
    upcomingLabel: "Upcoming",
    upcoming: [
      {
        id: "graded-quiz-meetings",
        iso: "2026-10-04T23:59",
        date: "04 Oct 2026",
        time: "23:59 · your time",
        state: "upcoming",
        badges: [
          { label: "DUE DATE", color: GRAY },
          { label: "GRADED QUIZ", color: GRAY },
          { label: "UPCOMING", color: GRAY },
        ],
        title: "Module 3 · Graded Quiz: Meetings and rituals",
        description: "Two attempts. The best one counts.",
        link: "Open the assignment",
      },
      {
        id: "final-project",
        iso: "2026-10-18T23:59",
        date: "18 Oct 2026",
        time: "23:59 · your time",
        state: "locked",
        badges: [
          { label: "DUE DATE", color: GRAY },
          { label: "FINAL PROJECT", color: GRAY },
          { label: "LOCKED", color: GRAY },
        ],
        title: "Module 4 · Final Project: 30-day plan for a remote team",
        description: "Unlocks when Module 3 is complete. You then review the plans of two peers.",
      },
      {
        id: "certificate-available",
        iso: "2026-10-21T09:00",
        date: "21 Oct 2026",
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
        id: "quiet-team-member",
        title: "One person never posts in the team channel. How do I bring them in?",
        preview: "Tomás: Ask in a one-to-one first, and ask about the channel, not about them.",
        meta: "yesterday  ·  4 replies",
        answered: true,
        following: true,
        unread: false,
        messages: [
          {
            id: "m1",
            from: "learner",
            author: "You",
            body: "One of my engineers does good work but never writes in the team channel. On calls she speaks when asked. Since we went remote I only learn what she is doing from the task board. Should I ask her to post more?",
            time: "2 days ago",
          },
          {
            id: "m2",
            from: "mentor",
            author: "Tomás Ribeiro",
            label: "STAFF",
            accepted: true,
            body: "Ask in a one-to-one first, and ask about the channel, not about her: what would make it worth posting there? Often the answer is practical. The channel moves too fast, or it feels like a stage, or English is a second language and writing in public takes effort.",
            time: "2 days ago",
          },
          {
            id: "m3",
            from: "learner",
            author: "You",
            body: "It was the second one. She said every message felt like an announcement to twelve people.",
            time: "yesterday",
          },
          {
            id: "m4",
            from: "mentor",
            author: "Tomás Ribeiro",
            label: "STAFF",
            body: "Then lower the stakes. A daily thread with a fixed format, like the async standup in Module 3, gives everyone the same three lines to write, so no post stands out. Reply to hers the same day so she can see it was read.",
            time: "yesterday",
          },
        ],
      },
      {
        id: "overlap-hours",
        title: "My team has only two hours of overlap. Is that enough?",
        preview: "Tomás: Yes, if you protect them for the work that needs a live call.",
        meta: "4 days ago  ·  3 replies  ·  1 unread",
        answered: true,
        following: false,
        unread: true,
      },
      {
        id: "charter-feedback",
        title: "Assignment 01: why did my charter lose points on response times?",
        preview: "You: Understood, I had one response time for every channel.",
        meta: "3 days ago  ·  2 replies",
        answered: true,
        following: false,
        unread: false,
      },
      {
        id: "cameras-on",
        title: "Should I ask people to keep their cameras on?",
        preview: "You: Asked today, no reply yet.",
        meta: "today  ·  1 reply",
        answered: false,
        following: false,
        unread: false,
      },
    ],
    mentorLine: "Tomás Ribeiro · your mentor · typically responds within 1 day",
  },
};
