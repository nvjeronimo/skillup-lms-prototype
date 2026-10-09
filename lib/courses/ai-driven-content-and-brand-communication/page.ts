import { GRAY, SIX_SIGMA, THIS_WEEK, modulesFromOutline, playerHref, week } from "@/lib/courses/kit";
import type { CourseDetail, WeeklyGoal } from "@/lib/courses/kit";
import { outline } from "./outline";

/**
 * "AI-Driven Content and Brand Communication": course 2 of 7 of the AI Augmented Digital
 * Marketing program, in progress. Its figures follow the module rows of the Program page
 * (lib/platform/program): 38 topics, Module 1 complete and 3 of 10 topics of Module 2,
 * about 13 hours, a weighted grade of 28% against the 70% needed. Today is 24 Sep 2026, the
 * day of the Dashboard, whose due item is Assignment 02 on the 26th.
 */
const WEEKLY_GOAL: WeeklyGoal = {
  state: "met",
  title: "You met your goal this week",
  body: "Take a moment to celebrate your progress.",
  week: THIS_WEEK,
  days: week(["done", "done", "missed", "today-done", "upcoming", "upcoming", "upcoming"]),
  count: "3 of 3 days this week",
  lastWeek: "Last week: 3 of 3",
  plan: "Regular · 3 days a week.",
};

export const page: CourseDetail = {
  slug: outline.slug,
  title: outline.title,
  imageSrc: "/platform/covers/program-course-2-ai-driven-content.jpg",
  partners: [],
  deliveryMode: "Flexible Learning",
  difficulty: "Beginner",
  stats: { structure: "4 modules · 38 topics", duration: "~ 13 hours", org: "SkillUp · ADM-02" },
  progress: {
    percent: 40,
    label: "Course progress",
    eyebrow: "Go to last topic",
    cta: "Resume course",
    href: playerHref(outline),
    notPassing: "Not passing yet · 28% of 70%",
    done: "15 of 38 topics",
    timeLeft: "~ 9h left",
  },
  search: SIX_SIGMA.search,
  program: {
    slug: "ai-driven-digital-marketing",
    title: "Certificate Program in AI Augmented Digital Marketing",
  },

  update: {
    title: "Course update",
    body: "The content brief and prompt template in Handouts has a new section for format limits. Assignment 02, at the end of Module 2, counts towards your grade.",
  },
  intro: {
    title: "What you'll learn",
    lead: "Four modules that take a brand from its voice to finished content: a voice system, copy drafted with an AI assistant, visual content and a final content kit. Work through them at your own pace.",
  },
  modules: modulesFromOutline(outline, [
    { duration: "3h 13m" },
    { duration: "3h 22m", defaultOpen: true },
    { duration: "3h 04m" },
    { duration: "3h 14m", lockReason: "Complete “Module 3 · AI for Visual Content” to unlock" },
  ]),
  mentor: SIX_SIGMA.mentor,
  team: {
    label: "Course team",
    people: [
      { name: "Rajesh Menon", role: "Lead instructor · SkillUp" },
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
      { title: "Reach the passing grade", detail: "28% now · 70% needed", percent: 28 },
      { title: "Complete the course content", detail: "15 of 38 topics · 40%", percent: 40 },
    ],
  },
  handouts: {
    label: "Handouts",
    items: [
      "Brand voice guide template (DOCX)",
      "Content brief and prompt template (DOCX)",
      "Prompt library starter (XLSX)",
    ],
  },
  upcomingDates: {
    label: "Upcoming dates",
    items: [
      {
        id: "assignment-02",
        iso: "2026-09-26",
        day: "26",
        month: "SEP",
        title: "Assignment 02 · Audience segmentation",
        detail: "Assignment due · 23:59 your time",
        relative: "In 2 days",
        relativeColor: "yellow",
      },
      {
        id: "graded-quiz-visual",
        iso: "2026-10-04",
        day: "04",
        month: "OCT",
        title: "Graded Quiz: AI for visual content",
        detail: "Assignment due · 23:59 your time",
        relative: "In 10 days",
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
      counts: "15 complete · 17 incomplete · 6 locked",
      percent: 40,
    },
    passAlert: {
      title: "A weighted grade of 70% is required to pass",
      body: "Your current weighted grade is 28%.",
    },
    grade: {
      title: "Your grade",
      badge: "28% · below the 70% pass mark",
      percent: 28,
      passPercent: 70,
      currentLabel: "Current 28%",
      passLabel: "Pass 70%",
      columns: SIX_SIGMA.progressTab.grade.columns,
      // Two homework assignments and two graded quizzes: one of each is done, so each type
      // is at half of what its one result earned. 18% + 10% = the 28% of the header.
      rows: [
        { type: "Homework", weight: "40%", grade: "45%", weighted: "18%" },
        { type: "Graded Quiz", weight: "20%", grade: "50%", weighted: "10%" },
        { type: "Final Project", weight: "25%", grade: "0%", weighted: "0%" },
        { type: "Final Assessment", weight: "15%", grade: "0%", weighted: "0%" },
      ],
      sections: [
        {
          title: "Module 1 · Brand Strategy & Voice Systems",
          items: [
            { title: "Assignment 01 · Brand voice guide", score: "90/100 · 90%" },
            { title: "Graded Quiz: Brand strategy and voice", score: "3/3 · 100%" },
          ],
        },
        {
          title: "Module 2 · AI-Assisted Content Development",
          items: [{ title: "Assignment 02 · Audience segmentation", score: "0/100 · 0%" }],
        },
        {
          title: "Module 3 · AI for Visual Content",
          items: [{ title: "Graded Quiz: AI for visual content", score: "0/3 · 0%" }],
        },
        {
          title: "Module 4 · Final Project, Assessment, and Wrap-Up",
          items: [
            { title: "Final Project: Brand content kit", score: "0/20 · 0%" },
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
        iso: "2026-09-13T00:00",
        date: "13 Sep 2026",
        time: "00:00 · your time",
        state: "complete",
        badges: [{ label: "COURSE", color: GRAY }],
        title: "Course starts",
        description: "Opened the day after you completed course 1 of the program.",
      },
      {
        id: "assignment-01",
        iso: "2026-09-18T23:59",
        date: "18 Sep 2026",
        time: "23:59 · your time",
        state: "complete",
        badges: [
          { label: "DUE DATE", color: GRAY },
          { label: "HOMEWORK", color: GRAY },
          { label: "COMPLETE", color: "success" },
        ],
        title: "Module 1 · Assignment 01 · Brand voice guide",
        description: "Submitted 1 day early. Graded 90/100.",
        link: "Open the assignment",
      },
      {
        id: "graded-quiz-brand",
        iso: "2026-09-20T23:59",
        date: "20 Sep 2026",
        time: "23:59 · your time",
        state: "complete",
        badges: [
          { label: "DUE DATE", color: GRAY },
          { label: "GRADED QUIZ", color: GRAY },
          { label: "COMPLETE", color: "success" },
        ],
        title: "Module 1 · Graded Quiz: Brand strategy and voice",
        description: "Submitted on the due date. 3 of 3 correct.",
        link: "Open the assignment",
      },
    ],
    todayLabel: "Today · 24 Sep 2026",
    todayIso: "2026-09-24",
    upcomingLabel: "Upcoming",
    upcoming: [
      {
        id: "assignment-02",
        iso: "2026-09-26T23:59",
        date: "26 Sep 2026",
        time: "23:59 · your time",
        state: "upcoming",
        badges: [
          { label: "DUE DATE", color: GRAY },
          { label: "HOMEWORK", color: GRAY },
          { label: "UPCOMING", color: GRAY },
        ],
        title: "Module 2 · Assignment 02 · Audience segmentation",
        description: "Three segments, with the brief, the prompt and the edited draft for each.",
        link: "Open the assignment",
      },
      {
        id: "graded-quiz-visual",
        iso: "2026-10-04T23:59",
        date: "04 Oct 2026",
        time: "23:59 · your time",
        state: "upcoming",
        badges: [
          { label: "DUE DATE", color: GRAY },
          { label: "GRADED QUIZ", color: GRAY },
          { label: "UPCOMING", color: GRAY },
        ],
        title: "Module 3 · Graded Quiz: AI for visual content",
        description: "Two attempts. The best one counts.",
      },
      {
        id: "final-project",
        iso: "2026-10-10T23:59",
        date: "10 Oct 2026",
        time: "23:59 · your time",
        state: "locked",
        badges: [
          { label: "DUE DATE", color: GRAY },
          { label: "FINAL PROJECT", color: GRAY },
          { label: "LOCKED", color: GRAY },
        ],
        title: "Module 4 · Final Project: Brand content kit",
        description: "Unlocks when Module 3 is complete.",
      },
      {
        id: "final-assessment",
        iso: "2026-10-11T23:59",
        date: "11 Oct 2026",
        time: "23:59 · your time",
        state: "locked",
        badges: [
          { label: "DUE DATE", color: GRAY },
          { label: "FINAL EXAM", color: GRAY },
          { label: "LOCKED", color: GRAY },
        ],
        title: "Module 4 · Final Assessment",
        description: "Unlocks when Module 3 is complete. One attempt.",
      },
      {
        id: "certificate-available",
        iso: "2026-10-12T09:00",
        date: "12 Oct 2026",
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
        id: "brand-voice-drafts",
        title: "My AI drafts all sound the same. How do I get our voice in?",
        preview: "Marcus: Add one sentence you would publish and one you would not.",
        meta: "2 days ago  ·  4 replies",
        answered: true,
        following: true,
        unread: false,
        messages: [
          {
            id: "m1",
            from: "learner",
            author: "You",
            body: "Whatever I ask for, the drafts come back in the same polite, generic tone. I pasted the three voice traits from my guide into the prompt. What am I missing?",
            time: "2 days ago",
          },
          {
            id: "m2",
            from: "mentor",
            author: "Marcus Lee",
            label: "STAFF",
            accepted: true,
            body: "Traits on their own are too abstract for an assistant. Add one sentence you would publish and one you would not, and say why the second one fails. Examples steer the draft more than adjectives do.",
            time: "2 days ago",
          },
          {
            id: "m3",
            from: "learner",
            author: "You",
            body: "I added both. Much closer, but the headlines are still too long.",
            time: "2 days ago",
          },
          {
            id: "m4",
            from: "mentor",
            author: "Marcus Lee",
            label: "STAFF",
            body: "Then give the limit as a number: headlines of up to six words. Ask for the output with labels as well, so you can check each line against the limit.",
            time: "yesterday",
          },
        ],
      },
      {
        id: "segments-count",
        title: "How many segments should Assignment 02 cover?",
        preview: "Marcus: Three, split by need or situation.",
        meta: "4 days ago  ·  3 replies  ·  1 unread",
        answered: true,
        following: false,
        unread: true,
      },
      {
        id: "ai-disclosure",
        title: "Do I have to say that copy was drafted with AI?",
        preview: "You: Thanks, the Module 1 reading covers it.",
        meta: "last week  ·  2 replies",
        answered: true,
        following: false,
        unread: false,
      },
      {
        id: "practice-quiz-grade",
        title: "Does the practice quiz count towards the grade?",
        preview: "You: Asked yesterday, no reply yet.",
        meta: "yesterday  ·  1 reply",
        answered: false,
        following: false,
        unread: false,
      },
    ],
    mentorLine: "Marcus Lee · your mentor · typically responds within 1 day",
  },
};
