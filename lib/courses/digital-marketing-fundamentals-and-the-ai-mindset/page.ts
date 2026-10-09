import { GRAY, SIX_SIGMA, modulesFromOutline, playerHref } from "@/lib/courses/kit";
import type { CourseDetail } from "@/lib/courses/kit";
import { outline } from "./outline";

/**
 * "Digital Marketing Fundamentals and the AI Mindset": course 1 of 7 of the AI Augmented
 * Digital Marketing program, completed. Its figures follow its row and its certificate in
 * the program file (lib/programs/ai-driven-digital-marketing): 4 modules, 36 topics, about
 * 12 hours, all complete, certificate issued 12 September 2026. The course opened with the
 * program on 27 June 2026. Today is 24 Sep 2026. The weighted grade is 91% against the 70%
 * needed.
 *
 * Since 10 Oct 2026 the page shows a PROPOSAL of the passed state (`passed`), which has no
 * Figma screen: the pass line, the grade badge and the alert in the success tokens, and no
 * weekly goal, since nothing is left to plan.
 */

export const page: CourseDetail = {
  slug: outline.slug,
  title: outline.title,
  imageSrc: "/platform/covers/program-course-1-digital-marketing-fundamentals.jpg",
  partners: [],
  deliveryMode: "Flexible Learning",
  difficulty: "Beginner",
  stats: { structure: "4 modules · 36 topics", duration: "~ 12 hours", org: "SkillUp · ADM-01" },
  progress: {
    percent: 100,
    label: "Course progress",
    eyebrow: "Go to first topic",
    cta: "Review course",
    href: playerHref(outline),
    notPassing: "Passed · 91%, 70% needed",
    done: "36 of 36 topics",
    timeLeft: "Completed 12 Sep 2026",
  },
  search: SIX_SIGMA.search,
  passed: true,
  program: {
    slug: "ai-driven-digital-marketing",
    title: "Certificate Program in AI Augmented Digital Marketing",
  },

  update: {
    title: "Course update",
    body: "You completed this course on 12 September 2026 and your certificate is issued. Every topic stays open for review until the program ends. Course 2, AI-Driven Content and Brand Communication, is your next course.",
  },
  intro: {
    title: "What you learned",
    lead: "Four modules that take you from how digital marketing works to using AI with judgement: the channels and the customer journey, goals and measurement, the AI mindset and a one-page marketing plan. All of them stay open for review.",
  },
  modules: modulesFromOutline(outline, [
    { duration: "2h 53m", defaultOpen: true },
    { duration: "3h 21m" },
    { duration: "2h 40m" },
    { duration: "3h 14m" },
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
  // The same certificate as the program file lists for course 1: every value below is a copy,
  // but the learner's name, which the sheet reads from `user`.
  certificate: {
    status: "issued",
    courseId: outline.slug,
    viewHref: `/platform/certificate/${outline.slug}`,
    courseLabel: outline.title,
    title: outline.title,
    issuedLine: "Issued 12 September 2026.",
    document: {
      courseTitle: outline.title,
      summary: "4 modules  ·  about 12 hours",
      issuedOn: "12 September 2026",
      certificateId: "SKL-ADM01-2609-7F3K",
      verifyUrl: "skillup.online/certificates/7f3k9c2a",
      partnerLogoSrc: "/platform/certificate-partner-ibm.svg",
      partnerName: "IBM",
      signatories: [
        {
          name: "Priya Raman",
          role: "Head of Learning, SkillUp Online",
          signatureSrc: "/platform/certificate-signature-1.svg",
        },
        {
          name: "Signatory name",
          role: "Programme lead, IBM",
          signatureSrc: "/platform/certificate-signature-2.svg",
        },
      ],
    },
  },
  handouts: {
    label: "Handouts",
    items: [
      "Customer journey map template (PPTX)",
      "Measurement plan template (XLSX)",
      "Prompt checklist: role, task, context, format (PDF)",
      "One-page marketing plan template (DOCX)",
    ],
  },
  upcomingDates: {
    label: "Upcoming dates",
    items: [
      {
        id: "course-ends",
        iso: "2027-10-31",
        day: "31",
        month: "OCT",
        title: "Course ends",
        detail: "Access to the course closes with the program",
        relative: "In 13 months",
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
      counts: "36 complete · 0 incomplete · 0 locked",
      percent: 100,
    },
    passAlert: {
      title: "You passed this course",
      body: "Your weighted grade is 91%. A weighted grade of 70% was required to pass.",
    },
    grade: {
      title: "Your grade",
      badge: "91% · above the 70% pass mark",
      percent: 91,
      passPercent: 70,
      currentLabel: "Final 91%",
      passLabel: "Pass 70%",
      columns: SIX_SIGMA.progressTab.grade.columns,
      // Two homework assignments (88 and 92) average 90%, two graded quizzes 100%, the final
      // project 16 of 20 and the final assessment 3 of 3. 36% + 20% + 20% + 15% = the 91%
      // of the header.
      rows: [
        { type: "Homework", weight: "40%", grade: "90%", weighted: "36%" },
        { type: "Graded Quiz", weight: "20%", grade: "100%", weighted: "20%" },
        { type: "Final Project", weight: "25%", grade: "80%", weighted: "20%" },
        { type: "Final Assessment", weight: "15%", grade: "100%", weighted: "15%" },
      ],
      sections: [
        {
          title: "Module 1 · The Digital Marketing Landscape",
          items: [
            { title: "Assignment 01 · Customer journey map", score: "88/100 · 88%" },
            { title: "Graded Quiz: The digital marketing landscape", score: "3/3 · 100%" },
          ],
        },
        {
          title: "Module 2 · Goals, Funnels and Measurement",
          items: [{ title: "Assignment 02 · Measurement plan", score: "92/100 · 92%" }],
        },
        {
          title: "Module 3 · The AI Mindset for Marketers",
          items: [{ title: "Graded Quiz: The AI mindset", score: "3/3 · 100%" }],
        },
        {
          title: "Module 4 · Final Project, Assessment, and Wrap-Up",
          items: [
            { title: "Final Project: One-page marketing plan", score: "16/20 · 80%" },
            { title: "Final Assessment", score: "3/3 · 100%" },
          ],
        },
      ],
    },
    note: SIX_SIGMA.progressTab.note,
  },

  datesTab: {
    title: "Important Dates",
    // No missed-deadline alert: every deadline of this course was met.
    pastLabel: "Past",
    past: [
      {
        id: "course-starts",
        iso: "2026-06-27T00:00",
        date: "27 Jun 2026",
        time: "00:00 · your time",
        state: "complete",
        badges: [{ label: "COURSE", color: GRAY }],
        title: "Course starts",
        description: "Opened on the day the program started.",
      },
      {
        id: "assignment-01",
        iso: "2026-07-12T23:59",
        date: "12 Jul 2026",
        time: "23:59 · your time",
        state: "complete",
        badges: [
          { label: "DUE DATE", color: GRAY },
          { label: "HOMEWORK", color: GRAY },
          { label: "COMPLETE", color: "success" },
        ],
        title: "Module 1 · Assignment 01 · Customer journey map",
        description: "Submitted 2 days early. Graded 88/100.",
        link: "Open the assignment",
      },
      {
        id: "graded-quiz-landscape",
        iso: "2026-07-19T23:59",
        date: "19 Jul 2026",
        time: "23:59 · your time",
        state: "complete",
        badges: [
          { label: "DUE DATE", color: GRAY },
          { label: "GRADED QUIZ", color: GRAY },
          { label: "COMPLETE", color: "success" },
        ],
        title: "Module 1 · Graded Quiz: The digital marketing landscape",
        description: "Submitted on the due date. 3 of 3 correct.",
        link: "Open the assignment",
      },
      {
        id: "assignment-02",
        iso: "2026-08-09T23:59",
        date: "09 Aug 2026",
        time: "23:59 · your time",
        state: "complete",
        badges: [
          { label: "DUE DATE", color: GRAY },
          { label: "HOMEWORK", color: GRAY },
          { label: "COMPLETE", color: "success" },
        ],
        title: "Module 2 · Assignment 02 · Measurement plan",
        description: "Submitted 1 day early. Graded 92/100.",
        link: "Open the assignment",
      },
      {
        id: "graded-quiz-ai-mindset",
        iso: "2026-08-23T23:59",
        date: "23 Aug 2026",
        time: "23:59 · your time",
        state: "complete",
        badges: [
          { label: "DUE DATE", color: GRAY },
          { label: "GRADED QUIZ", color: GRAY },
          { label: "COMPLETE", color: "success" },
        ],
        title: "Module 3 · Graded Quiz: The AI mindset",
        description: "Submitted 3 days early. 3 of 3 correct.",
        link: "Open the assignment",
      },
      {
        id: "final-project",
        iso: "2026-09-06T23:59",
        date: "06 Sep 2026",
        time: "23:59 · your time",
        state: "complete",
        badges: [
          { label: "DUE DATE", color: GRAY },
          { label: "FINAL PROJECT", color: GRAY },
          { label: "COMPLETE", color: "success" },
        ],
        title: "Module 4 · Final Project: One-page marketing plan",
        description: "Submitted on the due date. Graded 16/20 by a peer.",
        link: "Open the assignment",
      },
      {
        id: "final-assessment",
        iso: "2026-09-11T23:59",
        date: "11 Sep 2026",
        time: "23:59 · your time",
        state: "complete",
        badges: [
          { label: "DUE DATE", color: GRAY },
          { label: "FINAL EXAM", color: GRAY },
          { label: "COMPLETE", color: "success" },
        ],
        title: "Module 4 · Final Assessment",
        description: "Taken on the due date, in one attempt. 3 of 3 correct.",
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
          { label: "COMPLETE", color: "success" },
        ],
        title: "Certificate issued",
        description: "You passed with a weighted grade of 91%. Course 2 of the program opened the next day.",
      },
    ],
    todayLabel: "Today · 24 Sep 2026",
    todayIso: "2026-09-24",
    upcomingLabel: "Upcoming",
    upcoming: [
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
        id: "cpa-or-roas",
        title: "Cost per acquisition or return on ad spend: which one goes in my measurement plan?",
        preview: "Marcus: It depends on what the objective asks for.",
        meta: "7 weeks ago  ·  4 replies",
        answered: true,
        following: true,
        unread: false,
        messages: [
          {
            id: "m1",
            from: "learner",
            author: "You",
            body: "For Assignment 02 my objective is 200 new subscribers a month for a meal-kit service. I listed both cost per acquisition and return on ad spend as the main metric. Do I need both?",
            time: "7 weeks ago",
          },
          {
            id: "m2",
            from: "mentor",
            author: "Marcus Lee",
            label: "STAFF",
            accepted: true,
            body: "Pick the one your objective asks for. Yours counts new subscribers, so cost per acquisition is the main metric: what you spend to win one subscriber. Return on ad spend compares revenue with spend, which fits an objective set in revenue.",
            time: "7 weeks ago",
          },
          {
            id: "m3",
            from: "learner",
            author: "You",
            body: "That makes sense. Where does lifetime value go, then?",
            time: "7 weeks ago",
          },
          {
            id: "m4",
            from: "mentor",
            author: "Marcus Lee",
            label: "STAFF",
            body: "Use it to set the limit. If a subscriber is worth 120 over their lifetime, a cost per acquisition of 150 loses money however many you win. Put it in the plan as the ceiling for the main metric.",
            time: "7 weeks ago",
          },
        ],
      },
      {
        id: "journey-map-stages",
        title: "How many stages should the customer journey map have?",
        preview: "Marcus: Five is enough: awareness to advocacy.",
        meta: "2 months ago  ·  2 replies",
        answered: true,
        following: false,
        unread: false,
      },
      {
        id: "paste-customer-list",
        title: "Can I paste a customer list into an AI assistant to segment it?",
        preview: "Marcus: Not with names or emails in it.",
        meta: "5 weeks ago  ·  3 replies",
        answered: true,
        following: true,
        unread: false,
      },
      {
        id: "certificate-name",
        title: "Which name appears on the certificate?",
        preview: "Marcus: The full name on your profile.",
        meta: "2 weeks ago  ·  2 replies",
        answered: true,
        following: false,
        unread: false,
      },
    ],
    mentorLine: "Marcus Lee · your mentor · typically responds within 1 day",
  },
};
