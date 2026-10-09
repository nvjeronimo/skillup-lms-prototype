import { GRAY, SIX_SIGMA, THIS_WEEK, modulesFromOutline, playerHref, week } from "@/lib/courses/kit";
import type { CourseDetail, WeeklyGoal } from "@/lib/courses/kit";
import { outline } from "./outline";

/**
 * "Capstone: Securing a Small Organisation":
 * the capstone (course 5 of 5) of the Cybersecurity Fundamentals Certificate, not started. Its figures follow
 * the course row of the Program page (lib/programs/cybersecurity-fundamentals): 25 topics
 * in 4 modules, about 12 hours, nothing completed and nothing graded. Today is
 * 24 Sep 2026 and the suggested schedule of the course starts on 11 Jan 2027, so every
 * due date is still to come and none is missed.
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
  stats: { structure: "4 modules · 25 topics", duration: "~ 12 hours", org: "SkillUp · SEC-05" },
  progress: {
    percent: 0,
    label: "Course progress",
    eyebrow: "Start with the first topic",
    cta: "Start course",
    href: playerHref(outline),
    notPassing: "Not started · 0% of 70%",
    done: "0 of 25 topics",
    timeLeft: "~ 12h left",
  },
  search: SIX_SIGMA.search,
  program: { slug: "cybersecurity-fundamentals", title: "Cybersecurity Fundamentals Certificate" },

  update: {
    title: "Course update",
    body: "The suggested schedule of the capstone starts on 11 Jan 2027, after Course 4. The Tidewater Veterinary Group case file is in Handouts; read it before the first milestone.",
  },
  intro: {
    title: "What you'll learn",
    lead: "Four modules, one client. You assess a fictional veterinary practice, design its controls, plan how it detects and responds to incidents, and deliver a security plan its owner can act on. Two rounds of peer review are built in.",
  },
  modules: modulesFromOutline(outline, [
    { duration: "2h 51m", defaultOpen: true },
    { duration: "3h 32m" },
    { duration: "2h 47m" },
    { duration: "3h 08m", lockReason: "Complete “Module 3 · Detect, Respond, Recover” to unlock" },
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
      { title: "Complete the course content", detail: "0 of 25 topics · 0%", percent: 0 },
    ],
  },
  handouts: {
    label: "Handouts",
    items: [
      "Case file: Tidewater Veterinary Group (PDF)",
      "Milestone templates: inventory, register and design (XLSX)",
      "Security plan outline (DOCX)",
      "Peer review guide (PDF)",
    ],
  },
  upcomingDates: {
    label: "Upcoming dates",
    items: [
      {
        id: "course-starts",
        iso: "2027-01-11",
        day: "11",
        month: "JAN",
        title: "Course starts",
        detail: "Suggested schedule begins",
        relative: "In 4 months",
        relativeColor: "gray",
      },
      {
        id: "milestone-1-asset-inventory-and-risk-register",
        iso: "2027-01-17",
        day: "17",
        month: "JAN",
        title: "Milestone 1 · Asset inventory and risk register",
        detail: "Milestone due · 23:59 your time",
        relative: "In 4 months",
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
      counts: "0 complete · 20 incomplete · 5 locked",
      percent: 0,
    },
    passAlert: { title: "A weighted grade of 70% is required to pass", body: "Your current weighted grade is 0%." },
    grade: {
      title: "Your grade",
      badge: "0% · below the 70% pass mark",
      percent: 0,
      passPercent: 70,
      currentLabel: "Current 0%",
      passLabel: "Pass 70%",
      columns: SIX_SIGMA.progressTab.grade.columns,
      rows: [
        { type: "Milestone", weight: "45%", grade: "0%", weighted: "0%" },
        { type: "Checkpoint Quiz", weight: "5%", grade: "0%", weighted: "0%" },
        { type: "Peer Review", weight: "10%", grade: "0%", weighted: "0%" },
        { type: "Final Project", weight: "40%", grade: "0%", weighted: "0%" },
      ],
      sections: [
        {
          title: "Module 1 · The Brief and the Assessment",
          items: [{ title: "Milestone 1 · Asset inventory and risk register", score: "0/30 · 0%" }],
        },
        {
          title: "Module 2 · Designing the Controls",
          items: [
            { title: "Milestone 2 · Network and access design", score: "0/30 · 0%" },
            { title: "Peer review: two control designs", score: "0/10 · 0%" },
          ],
        },
        {
          title: "Module 3 · Detect, Respond, Recover",
          items: [
            { title: "Milestone 3 · Monitoring and incident response plan", score: "0/30 · 0%" },
            { title: "Graded Quiz: Capstone checkpoint", score: "0/10 · 0%" },
          ],
        },
        {
          title: "Module 4 · Final Submission and Review",
          items: [
            { title: "Final Project: Security plan for Tidewater Veterinary Group", score: "0/40 · 0%" },
            { title: "Peer review: two final plans", score: "0/10 · 0%" },
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
        time: "10:30 · your time",
        state: "complete",
        badges: [{ label: "PROGRAM", color: GRAY }],
        title: "Enrolled in the program",
        description: "You joined the Cybersecurity Fundamentals Certificate. Its five courses follow one another from 5 Oct 2026.",
      },
    ],
    todayLabel: "Today · 24 Sep 2026",
    todayIso: "2026-09-24",
    upcomingLabel: "Upcoming",
    upcoming: [
      {
        id: "course-starts",
        iso: "2027-01-11T00:00",
        date: "11 Jan 2027",
        time: "00:00 · your time",
        state: "upcoming",
        badges: [{ label: "COURSE", color: GRAY }, { label: "UPCOMING", color: GRAY }],
        title: "Course starts",
        description: "The suggested schedule of this course starts, after Course 4. Due dates are counted from this day.",
      },
      {
        id: "milestone-1-asset-inventory-and-risk-register",
        iso: "2027-01-17T23:59",
        date: "17 Jan 2027",
        time: "23:59 · your time",
        state: "upcoming",
        badges: [{ label: "DUE DATE", color: GRAY }, { label: "MILESTONE", color: GRAY }, { label: "UPCOMING", color: GRAY }],
        title: "Module 1 · Milestone 1 · Asset inventory and risk register",
        description: "Submit the asset inventory and the risk register in the milestone template.",
      },
      {
        id: "milestone-2-network-and-access-design",
        iso: "2027-01-24T23:59",
        date: "24 Jan 2027",
        time: "23:59 · your time",
        state: "upcoming",
        badges: [{ label: "DUE DATE", color: GRAY }, { label: "MILESTONE", color: GRAY }, { label: "UPCOMING", color: GRAY }],
        title: "Module 2 · Milestone 2 · Network and access design",
        description: "Submit the zone diagram, the flow table and the access matrix as one PDF.",
      },
      {
        id: "peer-review-two-control-designs",
        iso: "2027-01-27T23:59",
        date: "27 Jan 2027",
        time: "23:59 · your time",
        state: "upcoming",
        badges: [{ label: "DUE DATE", color: GRAY }, { label: "PEER REVIEW", color: GRAY }, { label: "UPCOMING", color: GRAY }],
        title: "Module 2 · Peer review: two control designs",
        description: "Review the designs of two peers against the rubric in the peer review guide.",
      },
      {
        id: "milestone-3-monitoring-and-incident-response-plan",
        iso: "2027-01-31T23:59",
        date: "31 Jan 2027",
        time: "23:59 · your time",
        state: "upcoming",
        badges: [{ label: "DUE DATE", color: GRAY }, { label: "MILESTONE", color: GRAY }, { label: "UPCOMING", color: GRAY }],
        title: "Module 3 · Milestone 3 · Monitoring and incident response plan",
        description: "Submit the monitoring plan, two playbooks and the recovery plan.",
      },
      {
        id: "graded-quiz-capstone-checkpoint",
        iso: "2027-01-31T23:59",
        date: "31 Jan 2027",
        time: "23:59 · your time",
        state: "upcoming",
        badges: [{ label: "DUE DATE", color: GRAY }, { label: "CHECKPOINT QUIZ", color: GRAY }, { label: "UPCOMING", color: GRAY }],
        title: "Module 3 · Graded Quiz: Capstone checkpoint",
        description: "Two attempts. The best one counts.",
      },
      {
        id: "final-project-security-plan-for-tidewater-veterinary-group",
        iso: "2027-02-07T23:59",
        date: "07 Feb 2027",
        time: "23:59 · your time",
        state: "locked",
        badges: [{ label: "DUE DATE", color: GRAY }, { label: "FINAL PROJECT", color: GRAY }, { label: "LOCKED", color: GRAY }],
        title: "Module 4 · Final Project: Security plan for Tidewater Veterinary Group",
        description: "Unlocks when Module 3 is complete.",
      },
      {
        id: "peer-review-two-final-plans",
        iso: "2027-02-10T23:59",
        date: "10 Feb 2027",
        time: "23:59 · your time",
        state: "locked",
        badges: [{ label: "DUE DATE", color: GRAY }, { label: "PEER REVIEW", color: GRAY }, { label: "LOCKED", color: GRAY }],
        title: "Module 4 · Peer review: two final plans",
        description: "Unlocks when Module 3 is complete.",
      },
      {
        id: "certificate-available",
        iso: "2027-02-15T09:00",
        date: "15 Feb 2027",
        time: "09:00 · your time",
        state: "upcoming",
        badges: [{ label: "CERTIFICATE", color: GRAY }],
        title: "Certificate available",
        description: "Your certificate is issued after this date if you have a passing grade.",
      },
      {
        id: "course-ends",
        iso: "2027-09-30T23:59",
        date: "30 Sep 2027",
        time: "23:59 · your time",
        state: "upcoming",
        badges: [{ label: "COURSE", color: GRAY }],
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
        id: "start-early",
        title: "Can I start the capstone before finishing Course 4?",
        preview: "David: You can read the brief, but the milestones assume Courses 1 to 4.",
        meta: "4 days ago  ·  2 replies",
        answered: true,
        following: true,
        unread: false,
        messages: [
          {
            id: "m1",
            from: "learner",
            author: "You",
            body: "I would like to see what the capstone asks for before the program starts, so I know what to keep notes on. Is that allowed?",
            time: "4 days ago",
          },
          {
            id: "m2",
            from: "mentor",
            author: "David Chen",
            label: "STAFF",
            accepted: true,
            body: "Yes, read the brief and the case file whenever you like. The milestones themselves assume Courses 1 to 4: the risk register comes from Course 1, the zones from Course 2, the access model from Course 3 and the response plan from Course 4. Keeping your assignments from those courses will save you time.",
            time: "4 days ago",
          },
        ],
      },
      {
        id: "real-company",
        title: "Is Tidewater Veterinary Group a real company?",
        preview: "David: No. It was written for this course; work only from the case file.",
        meta: "last week  ·  2 replies  ·  1 unread",
        answered: true,
        following: false,
        unread: true,
      },
      {
        id: "peer-review-grade",
        title: "How do the two peer reviews count towards the grade?",
        preview: "You: Asked today, no reply yet.",
        meta: "today  ·  1 reply",
        answered: false,
        following: false,
        unread: false,
      },
    ],
  },
};
