/**
 * "The Training Block" lab world — the plan model behind /lab/training/*.
 *
 * The weekly plan, cohort position and race day are MOCK: edX has no schedule, no due dates and no cohort
 * pace today (see MOCK in dashboard-mock.ts). Course titles, next topics, progress and certificate status
 * reuse the persona data, which marks what is real.
 */
import { MOCK, getPersona, nextAction, type Persona, type PersonaId } from "@/lib/lab/dashboard-mock";

export type SessionState = "done" | "planned" | "today" | "moved" | "live" | "missed";

export interface Session {
  id: string;
  title: string;
  course: string;
  kind: string;
  minutes: number;
  state: SessionState;
  /** e.g. "16:00" for live sessions */
  time?: string;
  href: string;
}

export interface PlanDay {
  key: string;
  short: string;
  date: number;
  isToday: boolean;
  isPast: boolean;
  sessions: Session[];
}

export interface Replan {
  moved: number;
  from: string;
  message: string;
}

export interface TrainingPlan {
  persona: Persona;
  weekOf: string;
  weekIndex: number;
  weeksTotal: number;
  cohortWeek: number;
  raceDay: string;
  status: { word: string; line: string; tone: "on" | "ahead" | "replanned" | "not-started" };
  loadPlanned: number;
  loadDone: number;
  days: PlanDay[];
  today?: Session;
  then: Session[];
  replan?: Replan;
  mock: string;
}

const MOCK_TODAY_INDEX = 1; // Tuesday 30 Sep (mock) — matches the other lab directions
const DAY_KEYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
const DAY_SHORT = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const DATES = [29, 30, 1, 2, 3, 4, 5];

const S = (id: string, title: string, course: string, kind: string, minutes: number, state: SessionState, href = "#", time?: string): Session => ({
  id, title, course, kind, minutes, state, href, time,
});

const SIX = "Six Sigma";
const topic = (id: string) => `/course/six-sigma/topic/${id}`;

type Week = Record<string, Session[]>;

const WEEKS: Record<PersonaId, Week> = {
  noah: {
    mon: [],
    tue: [S("n1", "What is Six Sigma?", SIX, "Reading", 8, "today", topic("m1-t1"))],
    wed: [],
    thu: [S("n2", "The cost of poor quality", SIX, "Video", 5, "planned")],
    fri: [],
    sat: [S("n3", "Why certification matters", SIX, "Reading", 6, "planned")],
    sun: [],
  },
  maya: {
    mon: [S("m1", "The define phase", SIX, "Video", 5, "done")],
    tue: [
      S("m2", "Introduction to the DMAIC methodology", SIX, "Video", 4, "today", topic("m3-t1")),
      S("m3", "DMAIC in practice — Q&A", SIX, "Live session", 45, "live", "#", "16:00"),
    ],
    wed: [],
    thu: [
      S("m4", "Module 3 checkpoint quiz", SIX, "Quiz", 20, "planned"),
      S("m5", "Measure phase clinic", SIX, "Live session", 45, "live", "#", "18:00"),
    ],
    fri: [],
    sat: [],
    sun: [
      S("m6", "The measure phase", SIX, "Reading", 8, "planned"),
      S("m7", "Plotting a control chart", SIX, "Video", 18, "planned"),
    ],
  },
  dev: {
    mon: [S("d1", "Module 2 checkpoint quiz", SIX, "Quiz", 20, "missed")],
    tue: [S("d2", "Lean principles overview", SIX, "Video", 12, "today", topic("m2-t1"))],
    wed: [S("d3", "Module 2 checkpoint quiz", SIX, "Quiz", 20, "moved"), S("d4", "Office hours", "Data Analytics", "Live session", 30, "live", "#", "17:30")],
    thu: [S("d5", "Plotting a control chart", SIX, "Video", 18, "moved")],
    fri: [S("d6", "SQL joins assignment", "Data Analytics", "Assignment", 40, "planned")],
    sat: [S("d7", "Measure phase clinic — recording", SIX, "Recording", 52, "moved")],
    sun: [],
  },
  priya: {
    mon: [S("p1", "Practice Quiz: Analyze", SIX, "Quiz", 15, "done"), S("p2", "Regions and zones", "Cloud Essentials", "Video", 12, "done")],
    tue: [
      S("p3", "Certification prep", SIX, "Live session", 60, "live", "#", "Live now"),
      S("p4", "Practice Quiz: Analyze — review", SIX, "Quiz", 10, "today", "#"),
    ],
    wed: [S("p5", "Designing the prototype", SIX, "Live session", 30, "planned")],
    thu: [S("p6", "Availability sets", "Cloud Essentials", "Video", 14, "planned")],
    fri: [],
    sat: [S("p7", "Conducting user testing", SIX, "Project", 25, "planned")],
    sun: [],
  },
};

const META: Record<PersonaId, Omit<TrainingPlan, "persona" | "days" | "today" | "then" | "loadPlanned" | "loadDone" | "weekOf" | "weeksTotal" | "raceDay" | "mock">> = {
  noah: { weekIndex: 0, cohortWeek: 3, status: { word: "Ready when you are", line: "Your plan starts the day you do. Three short sessions this week are enough.", tone: "not-started" } },
  maya: { weekIndex: 6, cohortWeek: 6, status: { word: "On plan", line: "You and your cohort are both in week 6.", tone: "on" } },
  dev: {
    weekIndex: 4,
    cohortWeek: 6,
    status: { word: "Re-planned", line: "We moved three sessions into this week so you land back on the cohort's week by 17 Oct.", tone: "replanned" },
    replan: { moved: 3, from: "last week", message: "3 sessions moved from last week into Wed, Thu and Sat." },
  },
  priya: { weekIndex: 7, cohortWeek: 6, status: { word: "A week ahead", line: "You are in week 7; your cohort is in week 6.", tone: "ahead" } },
};

export function getPlan(id: string | null | undefined): TrainingPlan {
  const persona = getPersona(id);
  const pid = persona.id;
  const week = WEEKS[pid];
  const days: PlanDay[] = DAY_KEYS.map((k, i) => ({
    key: k,
    short: DAY_SHORT[i],
    date: DATES[i],
    isToday: i === MOCK_TODAY_INDEX,
    isPast: i < MOCK_TODAY_INDEX,
    sessions: week[k] ?? [],
  }));
  const all = days.flatMap((d) => d.sessions).filter((s) => s.state !== "live");
  const loadPlanned = all.filter((s) => s.state !== "missed").reduce((a, s) => a + s.minutes, 0);
  const loadDone = all.filter((s) => s.state === "done").reduce((a, s) => a + s.minutes, 0);
  const todayDay = days[MOCK_TODAY_INDEX];
  const today = todayDay.sessions.find((s) => s.state === "today");
  const then = days
    .slice(MOCK_TODAY_INDEX)
    .flatMap((d) => d.sessions.map((s) => ({ ...s, day: d.short })))
    .filter((s) => s.state !== "today" && s.state !== "done")
    .slice(0, 3);
  return {
    persona,
    weekOf: "29 Sep – 5 Oct",
    weeksTotal: 12,
    raceDay: "Fri 19 Dec",
    loadPlanned,
    loadDone,
    days,
    today,
    then,
    mock: `${MOCK.pace} · ${MOCK.due}`,
    ...META[pid],
  };
}

export { nextAction };
