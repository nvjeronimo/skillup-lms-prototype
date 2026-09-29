/**
 * The Six Sigma course read as a 12-week training block.
 *
 * REAL: modules, lessons, topic titles, types, durations and `locked` come from lib/data-model.json.
 * MOCK: which week each topic sits in, the persona's done set and the re-plan moves. edX has no schedule
 * and no due dates (MOCK.due), and no cohort pace (MOCK.pace).
 */
import { course } from "@/lib/data";
import type { Topic } from "@/lib/types";
import type { PersonaId } from "@/lib/lab/dashboard-mock";

export type TopicState = "done" | "next" | "todo" | "locked" | "live";

export interface PlanTopic {
  id: string;
  title: string;
  type: string;
  /** The duration exactly as the course data gives it. */
  duration: string;
  /** Whole minutes, or null when the data has no time for it. */
  minutes: number | null;
  state: TopicState;
  week: number;
  /** Present when the re-plan moved this topic. */
  movedFrom?: number;
  /** Words shown before the click when locked (edX `gated_content.prereq_section_name`). */
  lockedBy?: string;
  graded: boolean;
  href: string;
}

export interface WeekRow {
  week: number;
  topics: PlanTopic[];
  /** Every topic planned here was moved to this week. */
  movedTo?: number;
}

export interface Segment {
  id: string;
  /** Lesson name; absent when the module holds topics directly. */
  label?: string;
  rows: WeekRow[];
}

export interface PlanModule {
  id: string;
  number: string;
  title: string;
  segments: Segment[];
  topics: PlanTopic[];
  weekFrom: number;
  weekTo: number;
  done: number;
}

export interface CoursePlanModel {
  modules: PlanModule[];
  topics: PlanTopic[];
  next?: PlanTopic;
  nextModuleId?: string;
  done: number;
  total: number;
  minutesLeft: number;
  minutesTotal: number;
  graded: PlanTopic[];
  moved: PlanTopic[];
}

/** MOCK: the cohort plan — which week each topic is planned for. Race day is week 12. */
const BASE_WEEK: Record<string, number> = {
  "m1-t1": 1, "m1-t2": 1, "m1-t3": 2,
  "m2-t1": 3, "m2-t2": 4, "m2-t3": 5,
  "m3-t1": 6, "m3-t2": 6, "m3-t3": 6, "m3-t4": 6,
  "m3-t4j": 7, "m3-t4k": 7, "m3-t4b": 7,
  "m3-t4c": 8, "m3-t4d": 8, "m3-t4e": 8,
  "m3-t4f": 9, "m3-t4g": 9, "m3-t4i": 9,
  "m3-t5": 10, "m3-t6": 10, "m3-t7": 10,
  "m3-t8": 11, "m3-t9": 11, "m3-t10": 11,
};

const M1 = ["m1-t1", "m1-t2", "m1-t3"];
const M2 = ["m2-t1", "m2-t2", "m2-t3"];

/** MOCK: what each persona has finished. Maya matches the real `completed` flags. */
const DONE: Record<PersonaId, string[]> = {
  noah: [],
  maya: [...M1, ...M2],
  dev: [...M1],
  priya: [...M1, ...M2, "m3-t1", "m3-t2", "m3-t3", "m3-t4", "m3-t4j", "m3-t4k", "m3-t4b"],
};

/** MOCK: Dev's re-plan after a 19-day break — nothing dropped, two topics a week later. */
const MOVES: Partial<Record<PersonaId, Record<string, number>>> = {
  dev: { "m2-t1": 4, "m2-t2": 5 },
};

/** "approx. 8 min read" → 8, "3m 20s" → 4, "approx. 3 h" → 180, "" or a date → null. */
export function toMinutes(d: string): number | null {
  const h = d.match(/(\d+)\s*h\b/);
  if (h) return Number(h[1]) * 60;
  const ms = d.match(/(\d+)m\s*(\d+)s/);
  if (ms) return Math.ceil(Number(ms[1]) + Number(ms[2]) / 60);
  const m = d.match(/(\d+)\s*min/);
  if (m) return Number(m[1]);
  return null;
}

export function formatMinutes(total: number): string {
  const h = Math.floor(total / 60);
  const m = total % 60;
  if (!h) return `${m} min`;
  return m ? `${h} h ${m} min` : `${h} h`;
}

export const pad = (n: number) => String(n).padStart(2, "0");

const isLive = (t: Topic) => t.type === "VILT-Live Session";
const isGraded = (t: Topic) =>
  /Graded|Peer|Project/.test(t.type) || /^(Graded|Final Exam|Final Project)/.test(t.title);

export function getCoursePlan(personaId: PersonaId): CoursePlanModel {
  const done = new Set(DONE[personaId]);
  const moves = MOVES[personaId] ?? {};
  const modules: PlanModule[] = [];
  const all: PlanTopic[] = [];

  course.modules.forEach((mod, mi) => {
    const groups = mod.lessons
      ? mod.lessons.map((l) => ({ id: l.id, label: l.label as string | undefined, topics: l.topics }))
      : [{ id: `${mod.id}-all`, label: undefined as string | undefined, topics: mod.topics ?? [] }];

    const planTopics: PlanTopic[] = [];
    const segments: Segment[] = groups.map((g, gi) => {
      const prereq = gi > 0 ? groups[gi - 1].label : mi > 0 ? course.modules[mi - 1].title : undefined;
      const topics = g.topics.map<PlanTopic>((t) => {
        const base = BASE_WEEK[t.id] ?? 12;
        const moved = moves[t.id];
        const pt: PlanTopic = {
          id: t.id,
          title: t.title,
          type: t.type,
          duration: t.duration,
          minutes: toMinutes(t.duration),
          state: done.has(t.id) ? "done" : t.locked ? "locked" : isLive(t) ? "live" : "todo",
          week: moved ?? base,
          movedFrom: moved !== undefined && moved !== base ? base : undefined,
          lockedBy: t.locked ? prereq : undefined,
          graded: isGraded(t),
          href: `/course/${course.slug}/topic/${t.id}`,
        };
        return pt;
      });
      planTopics.push(...topics);

      // A row for every week this segment touches — including weeks the re-plan emptied.
      const weeks = new Set<number>();
      topics.forEach((t) => {
        weeks.add(t.week);
        if (t.movedFrom) weeks.add(t.movedFrom);
      });
      const rows = Array.from(weeks)
        .sort((a, b) => a - b)
        .map<WeekRow>((w) => {
          const here = topics.filter((t) => t.week === w);
          const left = topics.filter((t) => t.movedFrom === w);
          return { week: w, topics: here, movedTo: here.length === 0 && left.length ? left[0].week : undefined };
        });
      return { id: g.id, label: g.label, rows };
    });

    const weeks = planTopics.flatMap((t) => (t.movedFrom ? [t.week, t.movedFrom] : [t.week]));
    modules.push({
      id: mod.id,
      number: mod.label.replace(/\D+/g, ""),
      title: mod.title,
      segments,
      topics: planTopics,
      weekFrom: Math.min(...weeks),
      weekTo: Math.max(...weeks),
      done: planTopics.filter((t) => t.state === "done").length,
    });
    all.push(...planTopics);
  });

  const next = all.find((t) => t.state === "todo");
  if (next) next.state = "next";
  const nextModuleId = next ? modules.find((m) => m.topics.includes(next))?.id : undefined;
  const known = (ts: PlanTopic[]) => ts.reduce((a, t) => a + (t.minutes ?? 0), 0);

  return {
    modules,
    topics: all,
    next,
    nextModuleId,
    done: all.filter((t) => t.state === "done").length,
    total: all.length,
    minutesLeft: known(all.filter((t) => t.state !== "done")),
    minutesTotal: known(all),
    graded: all.filter((t) => t.graded),
    moved: all.filter((t) => t.movedFrom !== undefined),
  };
}
