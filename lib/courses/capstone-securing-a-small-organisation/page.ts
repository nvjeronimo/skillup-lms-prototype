import { GRAY, SIX_SIGMA, THIS_WEEK, modulesFromOutline, playerHref, week } from "@/lib/courses/kit";
import type { CourseDetail, WeeklyGoal } from "@/lib/courses/kit";
import { outline } from "./outline";
import { SAMPLE_TODAY, relativeColor, relativeLabel, todayLabel } from "@/lib/sample-time";

/**
 * "Capstone: Securing a Small Organisation":
 * the capstone (course 5 of 5) of the Cybersecurity Fundamentals Certificate, not started. Its figures follow
 * the course row of the Program page (lib/programs/cybersecurity-fundamentals): 25 topics
 * in 4 modules, about 12 hours, nothing completed and nothing graded. Today is
 * 24 Oct 2026 and the suggested schedule of the course starts on 10 Feb 2027, so every
 * due date is still to come and none is missed.
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
    body: "The suggested schedule of the capstone starts on 10 Feb 2027, after Course 4. The Tidewater Veterinary Group case file is in Handouts; read it before the first milestone.",
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
        iso: "2027-02-10",
        day: "10",
        month: "FEB",
        title: "Course starts",
        detail: "Suggested schedule begins",
        relative: relativeLabel("2027-02-10"),
        relativeColor: relativeColor("2027-02-10"),
      },
      {
        id: "milestone-1-asset-inventory-and-risk-register",
        iso: "2027-02-16",
        day: "16",
        month: "FEB",
        title: "Milestone 1 · Asset inventory and risk register",
        detail: "Milestone due · 11:59 PM · your time",
        relative: relativeLabel("2027-02-16"),
        relativeColor: relativeColor("2027-02-16"),
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
      incomplete: 20,
      locked: 5,
    },
    passAlert: { title: "A weighted grade of 70% is required to pass", body: "Your current weighted grade is 0%." },
    grade: {
      title: "Your grade",
      percent: 0,
      passPercent: 70,
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
        time: "10:30 AM · your time",
        state: "complete",
        badges: [{ label: "Program", color: GRAY }],
        title: "Enrolled in the program",
        description: "You joined the Cybersecurity Fundamentals Certificate. Its five courses follow one another from 4 Nov 2026.",
      },
    ],
    todayLabel: todayLabel(),
    todayIso: SAMPLE_TODAY,
    upcomingLabel: "Upcoming",
    upcoming: [
      {
        id: "course-starts",
        iso: "2027-02-10T00:00",
        date: "10 Feb 2027",
        time: "12:00 AM · your time",
        state: "upcoming",
        badges: [{ label: "Course", color: GRAY }, { label: "Upcoming", color: GRAY }],
        title: "Course starts",
        description: "The suggested schedule of this course starts, after Course 4. Due dates are counted from this day.",
      },
      {
        id: "milestone-1-asset-inventory-and-risk-register",
        iso: "2027-02-16T23:59",
        date: "16 Feb 2027",
        time: "11:59 PM · your time",
        state: "upcoming",
        badges: [{ label: "Due date", color: GRAY }, { label: "Milestone", color: GRAY }, { label: "Upcoming", color: GRAY }],
        title: "Module 1 · Milestone 1 · Asset inventory and risk register",
        description: "Submit the asset inventory and the risk register in the milestone template.",
      },
      {
        id: "milestone-2-network-and-access-design",
        iso: "2027-02-23T23:59",
        date: "23 Feb 2027",
        time: "11:59 PM · your time",
        state: "upcoming",
        badges: [{ label: "Due date", color: GRAY }, { label: "Milestone", color: GRAY }, { label: "Upcoming", color: GRAY }],
        title: "Module 2 · Milestone 2 · Network and access design",
        description: "Submit the zone diagram, the flow table and the access matrix as one PDF or DOCX.",
      },
      {
        id: "peer-review-two-control-designs",
        iso: "2027-02-26T23:59",
        date: "26 Feb 2027",
        time: "11:59 PM · your time",
        state: "upcoming",
        badges: [{ label: "Due date", color: GRAY }, { label: "Peer review", color: GRAY }, { label: "Upcoming", color: GRAY }],
        title: "Module 2 · Peer review: two control designs",
        description: "Review the designs of two peers against the rubric in the peer review guide.",
      },
      {
        id: "milestone-3-monitoring-and-incident-response-plan",
        iso: "2027-03-02T23:59",
        date: "02 Mar 2027",
        time: "11:59 PM · your time",
        state: "upcoming",
        badges: [{ label: "Due date", color: GRAY }, { label: "Milestone", color: GRAY }, { label: "Upcoming", color: GRAY }],
        title: "Module 3 · Milestone 3 · Monitoring and incident response plan",
        description: "Submit the monitoring plan, two playbooks and the recovery plan.",
      },
      {
        id: "graded-quiz-capstone-checkpoint",
        iso: "2027-03-02T23:59",
        date: "02 Mar 2027",
        time: "11:59 PM · your time",
        state: "upcoming",
        badges: [{ label: "Due date", color: GRAY }, { label: "Checkpoint quiz", color: GRAY }, { label: "Upcoming", color: GRAY }],
        title: "Module 3 · Graded Quiz: Capstone checkpoint",
        description: "Two attempts. The best one counts.",
      },
      {
        id: "final-project-security-plan-for-tidewater-veterinary-group",
        iso: "2027-03-09T23:59",
        date: "09 Mar 2027",
        time: "11:59 PM · your time",
        state: "locked",
        badges: [{ label: "Due date", color: GRAY }, { label: "Final project", color: GRAY }, { label: "Locked", color: GRAY }],
        title: "Module 4 · Final Project: Security plan for Tidewater Veterinary Group",
        description: "Unlocks when Module 3 is complete.",
      },
      {
        id: "peer-review-two-final-plans",
        iso: "2027-03-12T23:59",
        date: "12 Mar 2027",
        time: "11:59 PM · your time",
        state: "locked",
        badges: [{ label: "Due date", color: GRAY }, { label: "Peer review", color: GRAY }, { label: "Locked", color: GRAY }],
        title: "Module 4 · Peer review: two final plans",
        description: "Unlocks when Module 3 is complete.",
      },
      {
        id: "certificate-available",
        iso: "2027-03-17T09:00",
        date: "17 Mar 2027",
        time: "9:00 AM · your time",
        state: "upcoming",
        badges: [{ label: "Certificate", color: GRAY }],
        title: "Certificate available",
        description: "Your certificate is issued after this date if you have a passing grade.",
      },
      {
        id: "course-ends",
        iso: "2027-09-30T23:59",
        date: "30 Sep 2027",
        time: "11:59 PM · your time",
        state: "upcoming",
        badges: [{ label: "Course", color: GRAY }],
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
            label: "Staff",
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
