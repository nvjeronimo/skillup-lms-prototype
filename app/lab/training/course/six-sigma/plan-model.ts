/**
 * The Six Sigma course read as a 12-week plan: modules, and the topics left in each.
 *
 * REAL: modules, lessons, topic titles, types, durations and `locked` come from lib/data-model.json.
 * MOCK: which week each topic sits in, the persona's done set and the re-plan moves. edX has no schedule
 * and no due dates (MOCK.due), and no cohort pace (MOCK.pace).
 */
import { course } from "@/lib/data";
import type { Topic } from "@/lib/types";
import type { PersonaId } from "@/lib/lab/dashboard-mock";

export type TopicState = "done" | "next" | "todo" | "locked";

export interface PlanTopic {
  id: string;
  title: string;
  type: string;
  /** The duration exactly as the course data gives it. */
  duration: string;
  /** Whole minutes, or null when the data has no time for it. */
  minutes: number | null;
  state: TopicState;
  live: boolean;
  week: number;
  /** Present when the re-plan moved this topic. */
  movedFrom?: number;
  /** Words shown before the click when locked (edX `gated_content.prereq_section_name`). */
  lockedBy?: string;
  graded: boolean;
  href: string;
}

export interface Lesson {
  id: string;
  /** Lesson name; absent when the module holds topics directly. */
  label?: string;
  topics: PlanTopic[];
}

export interface PlanModule {
  id: string;
  title: string;
  lessons: Lesson[];
  topics: PlanTopic[];
  done: number;
}

export interface CoursePlanModel {
  modules: PlanModule[];
  next?: PlanTopic;
  nextModuleId?: string;
  done: number;
  total: number;
  moved: number;
}

/** MOCK: the cohort plan — which week each topic is planned for. */
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

    const lessons: Lesson[] = groups.map((g, gi) => {
      const prereq = gi > 0 ? groups[gi - 1].label : mi > 0 ? course.modules[mi - 1].title : undefined;
      const topics = g.topics.map<PlanTopic>((t) => {
        const base = BASE_WEEK[t.id] ?? 12;
        const moved = moves[t.id];
        return {
          id: t.id,
          title: t.title,
          type: t.type,
          duration: t.duration,
          minutes: toMinutes(t.duration),
          state: done.has(t.id) ? "done" : t.locked ? "locked" : "todo",
          live: isLive(t),
          week: moved ?? base,
          movedFrom: moved !== undefined && moved !== base ? base : undefined,
          lockedBy: t.locked ? prereq : undefined,
          graded: isGraded(t),
          href: `/course/${course.slug}/topic/${t.id}`,
        };
      });
      return { id: g.id, label: g.label, topics };
    });

    const topics = lessons.flatMap((l) => l.topics);
    modules.push({
      id: mod.id,
      title: mod.title,
      lessons,
      topics,
      done: topics.filter((t) => t.state === "done").length,
    });
    all.push(...topics);
  });

  // The next topic is the first one still to do that isn't a scheduled live session.
  const next = all.find((t) => t.state === "todo" && !t.live);
  if (next) next.state = "next";
  const nextModuleId = next ? modules.find((m) => m.topics.includes(next))?.id : undefined;

  return {
    modules,
    next,
    nextModuleId,
    done: all.filter((t) => t.state === "done").length,
    total: all.length,
    moved: all.filter((t) => t.movedFrom !== undefined).length,
  };
}
