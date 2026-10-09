import { GRAY, SIX_SIGMA, THIS_WEEK, modulesFromOutline, playerHref, week } from "@/lib/courses/kit";
import type { CourseDetail, WeeklyGoal } from "@/lib/courses/kit";
import { outline } from "./outline";

/**
 * "Social Media and Ecommerce Marketing": course 5 of 7 of the AI Augmented Digital
 * Marketing program, not started. Its figures follow its row on the Program page
 * (lib/programs/ai-driven-digital-marketing): 5 modules, 64 topics, about 16 hours, no
 * progress, next up "Course Introduction". Nothing is done, graded or overdue. Today is
 * 24 Sep 2026; the due dates are those of the suggested pace of the program, which reaches
 * this course on 14 Dec 2026 (sample data: the program file gives only its start and end).
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
  imageSrc: "/platform/covers/program-course-5-social-media-ecommerce.jpg",
  partners: [],
  deliveryMode: "Flexible Learning",
  difficulty: "Beginner",
  stats: { structure: "5 modules · 64 topics", duration: "~ 16 hours", org: "SkillUp · ADM-05" },
  progress: {
    percent: 0,
    label: "Course progress",
    eyebrow: "Start with the first topic",
    cta: "Start course",
    href: playerHref(outline),
    notPassing: "Not passing yet · 0% of 70%",
    done: "0 of 64 topics",
    timeLeft: "~ 16h left",
  },
  search: SIX_SIGMA.search,
  program: {
    slug: "ai-driven-digital-marketing",
    title: "Certificate Program in AI Augmented Digital Marketing",
  },

  update: {
    title: "Course update",
    body: "The case-study shop used in the examples is in Handouts, with its product catalogue and one month of sample store data. Choose the business you will work on before Assignment 01: the four assignments and the final project all use the same one.",
  },
  intro: {
    title: "What you'll learn",
    lead: "Five modules that follow a customer from the feed to the order: a social strategy, content and community, selling inside social platforms and on a storefront, then conversion, retention and measurement. The last module is a launch plan of your own. Work through them at your own pace.",
  },
  modules: modulesFromOutline(outline, [
    { duration: "3h 13m", defaultOpen: true },
    { duration: "3h 21m" },
    { duration: "3h 21m" },
    { duration: "3h 23m" },
    { duration: "3h 00m", lockReason: "Complete Module 4 to unlock" },
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
      { title: "Reach the passing grade", detail: "0% now · 70% needed", percent: 0 },
      { title: "Complete the course content", detail: "0 of 64 topics · 0%", percent: 0 },
    ],
  },
  handouts: {
    label: "Handouts",
    items: [
      "Social audit template (XLSX)",
      "Content calendar template (XLSX)",
      "Case study: shop catalogue and store data (ZIP)",
      "Launch plan template (DOCX)",
    ],
  },
  upcomingDates: {
    label: "Upcoming dates",
    items: [
      {
        id: "suggested-start",
        iso: "2026-12-14",
        day: "14",
        month: "DEC",
        title: "Suggested start",
        detail: "Program pace · after course 4",
        relative: "In 3 months",
        relativeColor: "gray",
      },
      {
        id: "assignment-01",
        iso: "2026-12-20",
        day: "20",
        month: "DEC",
        title: "Assignment 01 · Platform and audience audit",
        detail: "Assignment due · 23:59 your time",
        relative: "In 3 months",
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
      counts: "0 complete · 56 incomplete · 8 locked",
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
      // Four homework assignments (one per module), two graded quizzes, the final project
      // and the final assessment. Nothing is submitted yet.
      rows: [
        { type: "Homework", weight: "40%", grade: "0%", weighted: "0%" },
        { type: "Graded Quiz", weight: "20%", grade: "0%", weighted: "0%" },
        { type: "Final Project", weight: "25%", grade: "0%", weighted: "0%" },
        { type: "Final Assessment", weight: "15%", grade: "0%", weighted: "0%" },
      ],
      sections: [
        {
          title: "Module 1 · Social Media Strategy & Platform Fundamentals",
          items: [
            { title: "Assignment 01 · Platform and audience audit", score: "0/100 · 0%" },
            { title: "Graded Quiz: Social strategy and platforms", score: "0/3 · 0%" },
          ],
        },
        {
          title: "Module 2 · Content, Community & Creator Partnerships",
          items: [{ title: "Assignment 02 · Two-week content calendar", score: "0/100 · 0%" }],
        },
        {
          title: "Module 3 · Social Commerce & Ecommerce Storefronts",
          items: [
            { title: "Assignment 03 · Product page and shop listing", score: "0/100 · 0%" },
            { title: "Graded Quiz: Social commerce and storefronts", score: "0/3 · 0%" },
          ],
        },
        {
          title: "Module 4 · Ecommerce Growth: Conversion, Retention & Analytics",
          items: [{ title: "Assignment 04 · Funnel and retention analysis", score: "0/100 · 0%" }],
        },
        {
          title: "Module 5 · Final Project, Assessment, and Wrap-Up",
          items: [
            { title: "Final Project: Social commerce launch plan", score: "0/20 · 0%" },
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
    // No missed-deadline alert: the course is not started and nothing is due before December.
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
        description: "Open since the program started. You can begin before the suggested date.",
      },
    ],
    todayLabel: "Today · 24 Sep 2026",
    todayIso: "2026-09-24",
    upcomingLabel: "Upcoming",
    upcoming: [
      {
        id: "suggested-start",
        iso: "2026-12-14T00:00",
        date: "14 Dec 2026",
        time: "00:00 · your time",
        state: "upcoming",
        badges: [{ label: "COURSE", color: GRAY }],
        title: "Suggested start",
        description: "The pace of the program reaches course 5 on this date. The due dates below follow from it.",
      },
      {
        id: "assignment-01",
        iso: "2026-12-20T23:59",
        date: "20 Dec 2026",
        time: "23:59 · your time",
        state: "upcoming",
        badges: [
          { label: "DUE DATE", color: GRAY },
          { label: "HOMEWORK", color: GRAY },
          { label: "UPCOMING", color: GRAY },
        ],
        title: "Module 1 · Assignment 01 · Platform and audience audit",
        description: "An audit of one business on two platforms, with the audience each one reaches.",
      },
      {
        id: "graded-quiz-strategy",
        iso: "2026-12-22T23:59",
        date: "22 Dec 2026",
        time: "23:59 · your time",
        state: "upcoming",
        badges: [
          { label: "DUE DATE", color: GRAY },
          { label: "GRADED QUIZ", color: GRAY },
          { label: "UPCOMING", color: GRAY },
        ],
        title: "Module 1 · Graded Quiz: Social strategy and platforms",
        description: "Two attempts. The best one counts.",
      },
      {
        id: "assignment-02",
        iso: "2027-01-10T23:59",
        date: "10 Jan 2027",
        time: "23:59 · your time",
        state: "upcoming",
        badges: [
          { label: "DUE DATE", color: GRAY },
          { label: "HOMEWORK", color: GRAY },
          { label: "UPCOMING", color: GRAY },
        ],
        title: "Module 2 · Assignment 02 · Two-week content calendar",
        description: "Ten posts across two platforms, with the brief and the edited draft of three of them.",
      },
      {
        id: "assignment-03",
        iso: "2027-01-17T23:59",
        date: "17 Jan 2027",
        time: "23:59 · your time",
        state: "upcoming",
        badges: [
          { label: "DUE DATE", color: GRAY },
          { label: "HOMEWORK", color: GRAY },
          { label: "UPCOMING", color: GRAY },
        ],
        title: "Module 3 · Assignment 03 · Product page and shop listing",
        description: "One product page rewritten, and the same product as a social shop listing.",
      },
      {
        id: "graded-quiz-commerce",
        iso: "2027-01-19T23:59",
        date: "19 Jan 2027",
        time: "23:59 · your time",
        state: "upcoming",
        badges: [
          { label: "DUE DATE", color: GRAY },
          { label: "GRADED QUIZ", color: GRAY },
          { label: "UPCOMING", color: GRAY },
        ],
        title: "Module 3 · Graded Quiz: Social commerce and storefronts",
        description: "Two attempts. The best one counts.",
      },
      {
        id: "assignment-04",
        iso: "2027-01-24T23:59",
        date: "24 Jan 2027",
        time: "23:59 · your time",
        state: "upcoming",
        badges: [
          { label: "DUE DATE", color: GRAY },
          { label: "HOMEWORK", color: GRAY },
          { label: "UPCOMING", color: GRAY },
        ],
        title: "Module 4 · Assignment 04 · Funnel and retention analysis",
        description: "The biggest leak in the sample funnel, one change to test and one retention idea.",
      },
      {
        id: "final-project",
        iso: "2027-01-30T23:59",
        date: "30 Jan 2027",
        time: "23:59 · your time",
        state: "locked",
        badges: [
          { label: "DUE DATE", color: GRAY },
          { label: "FINAL PROJECT", color: GRAY },
          { label: "LOCKED", color: GRAY },
        ],
        title: "Module 5 · Final Project: Social commerce launch plan",
        description: "Unlocks when Module 4 is complete.",
      },
      {
        id: "final-assessment",
        iso: "2027-01-31T23:59",
        date: "31 Jan 2027",
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
        iso: "2027-02-01T09:00",
        date: "01 Feb 2027",
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
        id: "need-a-store",
        title: "Do I need my own online store to take this course?",
        preview: "Marcus: No. The case-study shop in Handouts is enough.",
        meta: "yesterday  ·  3 replies",
        answered: true,
        following: true,
        unread: false,
        messages: [
          {
            id: "m1",
            from: "learner",
            author: "You",
            body: "I am still on course 2, but I am planning ahead. I do not run a store and my employer does not sell online. Can I still do the ecommerce modules and the assignments?",
            time: "yesterday",
          },
          {
            id: "m2",
            from: "mentor",
            author: "Marcus Lee",
            label: "STAFF",
            accepted: true,
            body: "Yes. Handouts has a case-study shop with a product catalogue and a month of sample store data, and every assignment can be done with it. If you do have a real business in mind, use it for the social modules and the case-study data for the funnel analysis in Module 4.",
            time: "yesterday",
          },
          {
            id: "m3",
            from: "learner",
            author: "You",
            body: "Good. And do I need paid accounts on any social platform?",
            time: "yesterday",
          },
          {
            id: "m4",
            from: "mentor",
            author: "Marcus Lee",
            label: "STAFF",
            body: "No. Nothing in the course asks you to publish or to spend. You plan, draft and audit; the posts stay in your calendar file.",
            time: "yesterday",
          },
        ],
      },
      {
        id: "same-business",
        title: "Can I use the brand from my course 2 voice guide?",
        preview: "Marcus: Yes, and it will save you time in Module 2.",
        meta: "3 days ago  ·  2 replies  ·  1 unread",
        answered: true,
        following: false,
        unread: true,
      },
      {
        id: "start-early",
        title: "Can I start before the suggested date?",
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
