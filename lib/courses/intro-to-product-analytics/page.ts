import { GRAY, SIX_SIGMA, THIS_WEEK, modulesFromOutline, playerHref, week } from "@/lib/courses/kit";
import type { CourseDetail, WeeklyGoal } from "@/lib/courses/kit";
import { outline } from "./outline";

/**
 * "Intro to Product Analytics": a stand-alone course of My Learning, completed. Its figures
 * follow the My Learning card: 100% (32 of 32 topics), 8 hours in all, certificate issued on
 * 12 Sep 2026. The weighted grade is 88% against the 70% needed. Today is 24 Sep 2026, the
 * day of the Dashboard: every deadline of the course is in the past.
 *
 * The page has no drawn state for a passed course, so three parts say it in words only: the
 * line under the button (`progress.notPassing`), the grade badge and the Certificate card,
 * which uses the "not-earned" shape with both requirements met. The "issued" shape needs a
 * partner logo, and this course has no partner.
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
  imageSrc: "/platform/covers/intro-to-product-analytics.jpg",
  partners: [],
  deliveryMode: "Flexible Learning",
  difficulty: "Beginner",
  stats: { structure: "4 modules · 32 topics", duration: "~ 8 hours", org: "SkillUp · IPA-01" },
  progress: {
    percent: 100,
    label: "Course progress",
    eyebrow: "Go back to any topic",
    cta: "Review course",
    href: playerHref(outline),
    notPassing: "Passed · 88%, with 70% needed",
    done: "32 of 32 topics",
    timeLeft: "Certificate issued 12 Sep 2026",
  },
  search: SIX_SIGMA.search,

  update: {
    title: "Course update",
    body: "You completed this course and your certificate was issued on 12 Sep 2026. All the content stays open: the cohort table worksheet and the tracking plan template are still in Handouts.",
  },
  intro: {
    title: "What you'll learn",
    lead: "Four modules on reading what people do in a product: how events are recorded, where people drop out of a funnel, who comes back, and how to test a change. You have completed all of them and can reopen any topic.",
  },
  modules: modulesFromOutline(outline, [
    { duration: "1h 37m", defaultOpen: true },
    { duration: "2h 21m" },
    { duration: "1h 46m" },
    { duration: "2h 16m" },
  ]),
  mentor: SIX_SIGMA.mentor,
  team: {
    label: "Course team",
    people: [
      { name: "Kenji Watanabe", role: "Lead instructor · SkillUp" },
      { name: "Leila Haddad", role: "Mentor · SkillUp" },
    ],
    cta: "Ask the course team",
  },
  weeklyGoal: WEEKLY_GOAL,
  certificate: {
    status: "not-earned",
    courseId: outline.slug,
    courseLabel: outline.title,
    title: "Issued 12 Sep 2026",
    requirements: [
      { title: "Reach the passing grade", detail: "88% reached · 70% needed", percent: 100 },
      { title: "Complete the course content", detail: "32 of 32 topics · 100%", percent: 100 },
    ],
  },
  handouts: {
    label: "Handouts",
    items: [
      "Tracking plan template (XLSX)",
      "Cohort table worksheet (XLSX)",
      "Metric definitions cheat sheet (PDF)",
    ],
  },
  upcomingDates: {
    label: "Upcoming dates",
    items: [
      {
        id: "course-ends",
        iso: "2027-12-31",
        day: "31",
        month: "DEC",
        title: "Course ends",
        detail: "Content stays readable · 23:59 your time",
        relative: "In 15 months",
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
      counts: "32 complete · 0 incomplete · 0 locked",
      percent: 100,
    },
    passAlert: {
      title: "A weighted grade of 70% is required to pass",
      body: "Your final weighted grade is 88%. You passed the course.",
    },
    grade: {
      title: "Your grade",
      badge: "88% · above the 70% pass mark",
      percent: 88,
      passPercent: 70,
      currentLabel: "Final 88%",
      passLabel: "Pass 70%",
      columns: SIX_SIGMA.progressTab.grade.columns,
      // Two graded quizzes (3/3 and 2/3: 83%, so 25% of 30%), one homework (90%, so 27% of
      // 30%) and the final project (18/20: 90%, so 36% of 40%). 25% + 27% + 36% = 88%.
      rows: [
        { type: "Graded Quiz", weight: "30%", grade: "83%", weighted: "25%" },
        { type: "Homework", weight: "30%", grade: "90%", weighted: "27%" },
        { type: "Final Project", weight: "40%", grade: "90%", weighted: "36%" },
      ],
      sections: [
        {
          title: "Module 1 · What Product Analytics Is For",
          items: [{ title: "Graded Quiz: Analytics foundations", score: "3/3 · 100%" }],
        },
        {
          title: "Module 2 · Acquisition, Activation and Funnels",
          items: [{ title: "Assignment 01 · Funnel analysis", score: "90/100 · 90%" }],
        },
        {
          title: "Module 3 · Retention and Engagement",
          items: [{ title: "Graded Quiz: Retention and engagement", score: "2/3 · 67%" }],
        },
        {
          title: "Module 4 · Experiments and Telling the Story",
          items: [{ title: "Final Project: Product health report", score: "18/20 · 90%" }],
        },
      ],
    },
    note: SIX_SIGMA.progressTab.note,
    weeklyGoal: WEEKLY_GOAL,
  },

  datesTab: {
    title: "Important Dates",
    // No missed-deadline alert: every deadline was met.
    pastLabel: "Past",
    past: [
      {
        id: "course-starts",
        iso: "2026-08-03T00:00",
        date: "03 Aug 2026",
        time: "00:00 · your time",
        state: "complete",
        badges: [{ label: "COURSE", color: GRAY }],
        title: "Course starts",
        description: "Enrolment opened and all module content became available.",
      },
      {
        id: "graded-quiz-foundations",
        iso: "2026-08-16T23:59",
        date: "16 Aug 2026",
        time: "23:59 · your time",
        state: "complete",
        badges: [
          { label: "DUE DATE", color: GRAY },
          { label: "GRADED QUIZ", color: GRAY },
          { label: "COMPLETE", color: "success" },
        ],
        title: "Module 1 · Graded Quiz: Analytics foundations",
        description: "Submitted 4 days early. 3 of 3 correct.",
        link: "Open the assignment",
      },
      {
        id: "assignment-01",
        iso: "2026-08-26T23:59",
        date: "26 Aug 2026",
        time: "23:59 · your time",
        state: "complete",
        badges: [
          { label: "DUE DATE", color: GRAY },
          { label: "HOMEWORK", color: GRAY },
          { label: "COMPLETE", color: "success" },
        ],
        title: "Module 2 · Assignment 01 · Funnel analysis",
        description: "Submitted 1 day early. Graded 90/100.",
        link: "Open the assignment",
      },
      {
        id: "graded-quiz-retention",
        iso: "2026-09-02T23:59",
        date: "02 Sep 2026",
        time: "23:59 · your time",
        state: "complete",
        badges: [
          { label: "DUE DATE", color: GRAY },
          { label: "GRADED QUIZ", color: GRAY },
          { label: "COMPLETE", color: "success" },
        ],
        title: "Module 3 · Graded Quiz: Retention and engagement",
        description: "Submitted on the due date. 2 of 3 correct on the best attempt.",
        link: "Open the assignment",
      },
      {
        id: "final-project",
        iso: "2026-09-09T23:59",
        date: "09 Sep 2026",
        time: "23:59 · your time",
        state: "complete",
        badges: [
          { label: "DUE DATE", color: GRAY },
          { label: "FINAL PROJECT", color: GRAY },
          { label: "COMPLETE", color: "success" },
        ],
        title: "Module 4 · Final Project: Product health report",
        description: "Submitted 2 days early. Two peers reviewed it: 18/20.",
        link: "Open the assignment",
      },
      {
        id: "certificate-issued",
        iso: "2026-09-12T09:00",
        date: "12 Sep 2026",
        time: "09:00 · your time",
        state: "complete",
        badges: [
          { label: "CERTIFICATE", color: GRAY },
          { label: "ISSUED", color: "success" },
        ],
        title: "Certificate issued",
        description: "You passed with a weighted grade of 88%.",
      },
    ],
    todayLabel: "Today · 24 Sep 2026",
    todayIso: "2026-09-24",
    upcomingLabel: "Upcoming",
    upcoming: [
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
        id: "retention-denominator",
        title: "My week 4 retention is higher than week 3. Is that possible?",
        preview: "Leila: Yes, if you count people active in that week, not in every week.",
        meta: "3 weeks ago  ·  4 replies",
        answered: true,
        following: true,
        unread: false,
        messages: [
          {
            id: "m1",
            from: "learner",
            author: "You",
            body: "In my cohort table for the final project, 31% of the August cohort is active in week 3 and 34% in week 4. I thought a retention curve could only go down. Did I make a mistake in the table?",
            time: "3 weeks ago",
          },
          {
            id: "m2",
            from: "mentor",
            author: "Leila Haddad",
            label: "STAFF",
            accepted: true,
            body: "Not necessarily. It depends on the definition. If week 4 counts everyone from the cohort who was active in that week, people who skipped week 3 and came back are counted again, so the curve can rise. If it counts only people active in every week so far, it can only fall. Both are valid. Say which one you used.",
            time: "3 weeks ago",
          },
          {
            id: "m3",
            from: "learner",
            author: "You",
            body: "I used active in that week. So the rise means some people came back after a week away?",
            time: "3 weeks ago",
          },
          {
            id: "m4",
            from: "mentor",
            author: "Leila Haddad",
            label: "STAFF",
            body: "Yes, and that is a finding worth a line in your report: check what happened in week 4. A reminder email or a release often explains it. Put the definition in the chart title so the reader does not have the same doubt you had.",
            time: "3 weeks ago",
          },
        ],
      },
      {
        id: "funnel-window",
        title: "How long should the conversion window of a funnel be?",
        preview: "Leila: As long as the slowest normal user takes, and say so on the chart.",
        meta: "last month  ·  3 replies",
        answered: true,
        following: false,
        unread: false,
      },
      {
        id: "sample-size",
        title: "My A/B test has 200 users per variant. Can I trust the result?",
        preview: "You: Clear, the difference is inside the noise.",
        meta: "3 weeks ago  ·  2 replies",
        answered: true,
        following: false,
        unread: false,
      },
      {
        id: "certificate-linkedin",
        title: "Can I add the certificate to my professional profile?",
        preview: "Leila: Yes. Use the title and the issue date as printed on it.",
        meta: "last week  ·  2 replies  ·  1 unread",
        answered: true,
        following: false,
        unread: true,
      },
    ],
    mentorLine: "Leila Haddad · your mentor · typically responds within 1 day",
  },
};
