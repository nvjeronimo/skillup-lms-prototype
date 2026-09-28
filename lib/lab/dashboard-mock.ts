/**
 * Lab data for the Dashboard directions (/lab/dashboard/*).
 *
 * Every field is either REAL (an edX API returns it today — see
 * LMS-HANDOFF/course-details-metadata-map.md in the PRD repo) or MOCK. A mock value carries the reason it
 * is mocked, so the UI can show it next to the value with <MockTag />. Never read mock values as a promise.
 */

export type PersonaId = "noah" | "maya" | "dev" | "priya";

/** edX `cert_status` values — REAL (Progress API). */
export type CertStatus = "notpassing" | "audit_passing" | "generating" | "downloadable";

export type EnrolmentStatus = "not-started" | "in-progress" | "completed" | "locked";

/** Reasons, written once so every direction says the same thing. */
export const MOCK = {
  pace: "Cohort pace has no API yet — mocked in Phase 1 (ADR 010)",
  due: "edX returns no due dates today (`due` is null on every block)",
  live: "VILT is outside the MVP and there is no session-schedule endpoint",
  program: "No API groups courses into programmes",
  timeLeft: "`effort_time` is null — no time-left estimate exists",
  weeklyGoal: "The edX weekly goal exists but is switched off on SkillUp courses",
  streak: "No days-active data exists",
} as const;

export interface Mocked<T> {
  value: T;
  /** Present when the value is mocked. */
  mock?: string;
}

export interface Enrolment {
  id: string;
  title: string;
  provider: string;
  /** REAL: `pacing` / `is_self_paced`. */
  selfPaced: boolean;
  status: EnrolmentStatus;
  /** REAL: Progress API `completion_summary`. */
  pct: number;
  /** REAL: Navigation API `complete` / `completion_stat`. */
  topicsDone: number;
  topicsTotal: number;
  /** REAL: `resume_course.url` target — the next topic. */
  nextTopic?: { type: string; title: string; href: string };
  /** REAL: `accessible:false` + `gated_content.prereq_section_name`. */
  lockedBy?: string;
  /** REAL: `cert_status`. */
  cert: CertStatus;
  /** MOCK: programme membership. */
  program?: Mocked<string>;
  /** Last activity, relative. REAL (`last_visited` on the resume block). */
  lastActive: string;
}

export interface DueItem {
  id: string;
  title: string;
  course: string;
  kind: "Quiz" | "Project" | "Assignment" | "Exam";
  dueLabel: string;
  state: "due-soon" | "overdue" | "upcoming";
  href: string;
}

export interface LiveSession {
  id: string;
  title: string;
  course: string;
  when: string;
  state: "live" | "today" | "upcoming" | "recording";
  host: string;
}

export interface Persona {
  id: PersonaId;
  name: string;
  firstName: string;
  blurb: string;
  enrolments: Enrolment[];
  pace: Mocked<{ state: "ahead" | "on-track" | "behind"; label: string; detail: string }>;
  weeklyGoal: Mocked<{ daysTarget: number; daysDone: number }>;
  due: Mocked<DueItem[]>;
  live: Mocked<LiveSession[]>;
  /** REAL: certificates with `cert_status = downloadable`. */
  certificatesEarned: number;
}

const topic = (slug: string, id: string) => `/course/${slug}/topic/${id}`;

const sixSigma = (over: Partial<Enrolment>): Enrolment => ({
  id: "six-sigma",
  title: "Six Sigma for Process Improvement",
  provider: "SkillUp",
  selfPaced: true,
  status: "in-progress",
  pct: 38,
  topicsDone: 16,
  topicsTotal: 42,
  nextTopic: { type: "Video", title: "Introduction to the DMAIC methodology", href: topic("six-sigma", "m3-t1") },
  cert: "notpassing",
  program: { value: "Operational Excellence", mock: MOCK.program },
  lastActive: "Today",
  ...over,
});

export const personas: Record<PersonaId, Persona> = {
  noah: {
    id: "noah",
    name: "Noah Carter",
    firstName: "Noah",
    blurb: "Cautious newcomer · back after a long pause · two courses not started",
    enrolments: [
      sixSigma({ status: "not-started", pct: 0, topicsDone: 0, lastActive: "14 months ago" }),
      {
        id: "cyber-foundations",
        title: "Cybersecurity Foundations",
        provider: "SkillUp",
        selfPaced: true,
        status: "not-started",
        pct: 0,
        topicsDone: 0,
        topicsTotal: 28,
        nextTopic: { type: "Reading", title: "What attackers want", href: "#" },
        cert: "notpassing",
        lastActive: "Never opened",
      },
    ],
    pace: { value: { state: "on-track", label: "Not started", detail: "Your cohort started 3 weeks ago" }, mock: MOCK.pace },
    weeklyGoal: { value: { daysTarget: 2, daysDone: 0 }, mock: MOCK.weeklyGoal },
    due: { value: [], mock: MOCK.due },
    live: { value: [], mock: MOCK.live },
    certificatesEarned: 0,
  },
  maya: {
    id: "maya",
    name: "Maya Ferreira",
    firstName: "Maya",
    blurb: "Consistent achiever · on cohort pace · the baseline happy path",
    enrolments: [
      sixSigma({}),
      {
        id: "remote-teams",
        title: "Leadership in Remote Teams",
        provider: "SkillUp",
        selfPaced: true,
        status: "completed",
        pct: 100,
        topicsDone: 24,
        topicsTotal: 24,
        cert: "downloadable",
        lastActive: "3 months ago",
      },
      {
        id: "data-storytelling",
        title: "Data Storytelling",
        provider: "SkillUp",
        selfPaced: true,
        status: "locked",
        pct: 0,
        topicsDone: 0,
        topicsTotal: 30,
        lockedBy: "Six Sigma for Process Improvement",
        cert: "notpassing",
        program: { value: "Operational Excellence", mock: MOCK.program },
        lastActive: "—",
      },
    ],
    pace: { value: { state: "on-track", label: "On track", detail: "You and your cohort are both in Module 3" }, mock: MOCK.pace },
    weeklyGoal: { value: { daysTarget: 3, daysDone: 2 }, mock: MOCK.weeklyGoal },
    due: {
      value: [
        { id: "d1", title: "Module 3 checkpoint quiz", course: "Six Sigma", kind: "Quiz", dueLabel: "Thu, 2 Oct", state: "due-soon", href: "#" },
        { id: "d2", title: "Control plan project", course: "Six Sigma", kind: "Project", dueLabel: "Mon, 13 Oct", state: "upcoming", href: "#" },
      ],
      mock: MOCK.due,
    },
    live: {
      value: [
        { id: "l1", title: "DMAIC in practice — Q&A", course: "Six Sigma", when: "Today · 16:00", state: "today", host: "Olivia Rhye" },
        { id: "l2", title: "Measure phase clinic", course: "Six Sigma", when: "Thu · 18:00", state: "upcoming", host: "Marcus Lee" },
      ],
      mock: MOCK.live,
    },
    certificatesEarned: 1,
  },
  dev: {
    id: "dev",
    name: "Dev Okafor",
    firstName: "Dev",
    blurb: "Stall-and-returner · behind pace · missed a live session",
    enrolments: [
      sixSigma({ pct: 12, topicsDone: 5, lastActive: "19 days ago", nextTopic: { type: "Reading", title: "The measure phase", href: topic("six-sigma", "m2-t3") } }),
      {
        id: "data-analytics",
        title: "Data Analytics with SQL",
        provider: "SkillUp",
        selfPaced: true,
        status: "in-progress",
        pct: 54,
        topicsDone: 19,
        topicsTotal: 35,
        nextTopic: { type: "Lab", title: "Joins in practice", href: "#" },
        cert: "notpassing",
        lastActive: "11 days ago",
      },
    ],
    pace: { value: { state: "behind", label: "2 weeks behind", detail: "Your cohort is in Module 4; you are in Module 2" }, mock: MOCK.pace },
    weeklyGoal: { value: { daysTarget: 3, daysDone: 0 }, mock: MOCK.weeklyGoal },
    due: {
      value: [
        { id: "d1", title: "Module 2 checkpoint quiz", course: "Six Sigma", kind: "Quiz", dueLabel: "Was due Mon, 22 Sep", state: "overdue", href: "#" },
        { id: "d2", title: "SQL joins assignment", course: "Data Analytics", kind: "Assignment", dueLabel: "Fri, 3 Oct", state: "due-soon", href: "#" },
      ],
      mock: MOCK.due,
    },
    live: {
      value: [
        { id: "l1", title: "Measure phase clinic", course: "Six Sigma", when: "Recorded 24 Sep · 52 min", state: "recording", host: "Marcus Lee" },
        { id: "l2", title: "Office hours", course: "Data Analytics", when: "Wed · 17:30", state: "upcoming", host: "Priya Raman" },
      ],
      mock: MOCK.live,
    },
    certificatesEarned: 0,
  },
  priya: {
    id: "priya",
    name: "Priya Nair",
    firstName: "Priya",
    blurb: "Credential collector · ahead of cohort · six enrolments",
    enrolments: [
      sixSigma({ pct: 71, topicsDone: 30, nextTopic: { type: "Quiz", title: "Practice Quiz: Analyze", href: "#" }, cert: "audit_passing" }),
      { id: "remote-teams", title: "Leadership in Remote Teams", provider: "SkillUp", selfPaced: true, status: "completed", pct: 100, topicsDone: 24, topicsTotal: 24, cert: "downloadable", lastActive: "2 months ago" },
      { id: "agile", title: "Agile Delivery", provider: "SkillUp", selfPaced: true, status: "completed", pct: 100, topicsDone: 20, topicsTotal: 20, cert: "downloadable", lastActive: "4 months ago" },
      { id: "sql", title: "Data Analytics with SQL", provider: "SkillUp", selfPaced: true, status: "completed", pct: 100, topicsDone: 35, topicsTotal: 35, cert: "generating", lastActive: "Yesterday" },
      { id: "cloud", title: "Cloud Essentials", provider: "SkillUp", selfPaced: true, status: "in-progress", pct: 22, topicsDone: 7, topicsTotal: 32, nextTopic: { type: "Video", title: "Regions and zones", href: "#" }, cert: "notpassing", lastActive: "3 days ago" },
      { id: "story", title: "Data Storytelling", provider: "SkillUp", selfPaced: true, status: "not-started", pct: 0, topicsDone: 0, topicsTotal: 30, nextTopic: { type: "Reading", title: "Why stories stick", href: "#" }, cert: "notpassing", lastActive: "Never opened" },
    ],
    pace: { value: { state: "ahead", label: "1 week ahead", detail: "You are in Module 5; your cohort is in Module 4" }, mock: MOCK.pace },
    weeklyGoal: { value: { daysTarget: 4, daysDone: 4 }, mock: MOCK.weeklyGoal },
    due: {
      value: [{ id: "d1", title: "Final project · Cloud Essentials", course: "Cloud Essentials", kind: "Project", dueLabel: "Fri, 17 Oct", state: "upcoming", href: "#" }],
      mock: MOCK.due,
    },
    live: {
      value: [{ id: "l1", title: "Certification prep", course: "Six Sigma", when: "Live now · ends 16:30", state: "live", host: "Olivia Rhye" }],
      mock: MOCK.live,
    },
    certificatesEarned: 3,
  },
};

export const personaIds = Object.keys(personas) as PersonaId[];

export function getPersona(id: string | null | undefined): Persona {
  return personas[(id as PersonaId) ?? "maya"] ?? personas.maya;
}

/** The single next action: the in-progress enrolment touched most recently, else the first not started. */
export function nextAction(p: Persona): Enrolment | undefined {
  return (
    p.enrolments.find((e) => e.status === "in-progress") ??
    p.enrolments.find((e) => e.status === "not-started")
  );
}
