/**
 * Exhibition world — reading the lab data as exhibitions, rooms and wall labels.
 *
 * REAL: Six Sigma's modules (rooms), topics (labels), types and times (plan-model, from lib/data-model.json);
 * enrolment status, progress counts, last visit and certificate status (dashboard-mock marks these REAL).
 * MOCK: which topics each persona has finished (plan-model), live sessions (MOCK.live), Dev's re-plan.
 */
import { MOCK, getPersona, nextAction, type Enrolment, type Persona, type PersonaId } from "@/lib/lab/dashboard-mock";
import { getCoursePlan, type CoursePlanModel, type PlanModule, type PlanTopic } from "@/app/lab/training/course/six-sigma/plan-model";

export const BASE = "/lab/worlds/exhibition";
export const SIX_SIGMA = "six-sigma";

export const q = (p: Persona) => `?persona=${p.id}`;

const NUMBER_WORDS = ["no", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];
export const numberWord = (n: number) => NUMBER_WORDS[n] ?? String(n);

/** The type as a visitor would say it. */
export function typeLabel(t: string): string {
  const map: Record<string, string> = {
    "VILT-Live Session": "Live session",
    "VILT-Recording": "Recording",
    "Lesson Page": "Lesson page",
    "Peer-graded": "Peer review",
  };
  return map[t] ?? t;
}

/** "12 min", "3 h", or the data's own words (a live session's date) when it has no length. */
export function timeLabel(t: PlanTopic): string | null {
  if (t.minutes == null) return t.duration.trim() || null;
  if (t.minutes < 60) return `${t.minutes} min`;
  const h = Math.floor(t.minutes / 60);
  const m = t.minutes % 60;
  return m ? `${h} h ${m} min` : `${h} h`;
}

export const medium = (t: PlanTopic) => [typeLabel(t.type), timeLabel(t)].filter(Boolean).join(" · ");

export interface SixSigmaNow {
  plan: CoursePlanModel;
  /** 0-based index of the room holding the next topic (the room you are in). */
  roomIndex: number;
  room?: PlanModule;
  topic?: PlanTopic;
  started: boolean;
}

export function sixSigmaNow(id: PersonaId): SixSigmaNow {
  const plan = getCoursePlan(id);
  const roomIndex = Math.max(0, plan.modules.findIndex((m) => m.id === plan.nextModuleId));
  return { plan, roomIndex, room: plan.modules[roomIndex], topic: plan.next, started: plan.done > 0 };
}

export type Wing = "on-view" | "coming-up" | "past";

export function wingOf(e: Enrolment): Wing {
  if (e.status === "in-progress") return "on-view";
  if (e.status === "completed") return "past";
  return "coming-up";
}

/** A calm sentence about the last visit. Never counts days against the learner. */
export function returnNote(p: Persona, e: Enrolment, started: boolean): string | null {
  if (!started) return "Nothing to catch up on. The exhibition opens when you do.";
  if (/days? ago|weeks? ago|months? ago/.test(e.lastActive)) {
    return `Welcome back, ${p.firstName}. Your last visit was ${e.lastActive}; the room is as you left it.`;
  }
  return null;
}

/** Today's live talk in this course, if the persona has one (MOCK.live). */
export function liveToday(p: Persona, courseShort: string): string | null {
  const s = p.live.value.find((l) => (l.state === "today" || l.state === "live") && l.course === courseShort);
  if (!s) return null;
  if (s.state === "live") return `A live talk is on now: ${s.title}, with ${s.host} (${s.when.replace("Live now · ", "")}).`;
  return `Also today, a live talk: ${s.title}, with ${s.host} at ${s.when.replace("Today · ", "")}.`;
}

export const FINISHED_MOCK = "Which topics each persona has finished is lab data; the rooms, labels, types and times are the real Six Sigma course";

export function mockReason(parts: (string | null | false | undefined)[]): string {
  return parts.filter(Boolean).join(" · ");
}

export { MOCK, getPersona, nextAction };
export type { Enrolment, Persona, PersonaId, PlanModule, PlanTopic };
