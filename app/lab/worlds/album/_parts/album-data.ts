/**
 * The Album world's reading of the lab data. Nothing new is invented here: Six Sigma's tracks, types,
 * durations and locks come from the real course (via getCoursePlan); the played set per persona is the
 * plan model's MOCK; other courses use the persona's enrolment fields.
 */
import { getPersona, type Enrolment, type Persona, type PersonaId } from "@/lib/lab/dashboard-mock";
import { getCoursePlan, type PlanModule, type PlanTopic } from "@/app/lab/training/course/six-sigma/plan-model";

export const SIX_SIGMA_ID = "six-sigma";

export interface Track extends PlanTopic {
  /** 1-based position on the album. */
  no: number;
}

export interface Side {
  letter: string;
  module: PlanModule;
  lessons: { id: string; label?: string; tracks: Track[] }[];
  done: number;
  total: number;
}

export interface SixSigmaAlbum {
  persona: Persona;
  enrolment?: Enrolment;
  title: string;
  provider: string;
  sides: Side[];
  tracks: Track[];
  next?: Track;
  done: number;
  total: number;
  /** Sum of the durations the data gives. */
  knownMinutes: number;
  /** Tracks whose duration is missing or is a date (live sessions). */
  untimed: number;
}

const LETTERS = "ABCDEFGH";

export function getSixSigmaAlbum(personaId: string | null | undefined): SixSigmaAlbum {
  const persona = getPersona(personaId);
  const plan = getCoursePlan(persona.id as PersonaId);
  const enrolment = persona.enrolments.find((e) => e.id === SIX_SIGMA_ID);
  let n = 0;
  const tracks: Track[] = [];
  const sides: Side[] = plan.modules.map((module, i) => {
    const lessons = module.lessons.map((l) => ({
      id: l.id,
      label: l.label,
      tracks: l.topics.map((t) => {
        const track = { ...t, no: ++n };
        tracks.push(track);
        return track;
      }),
    }));
    return { letter: LETTERS[i] ?? String(i + 1), module, lessons, done: module.done, total: module.topics.length };
  });
  return {
    persona,
    enrolment,
    title: enrolment?.title ?? "Six Sigma for Process Improvement",
    provider: enrolment?.provider ?? "SkillUp",
    sides,
    tracks,
    next: tracks.find((t) => t.state === "next"),
    done: plan.done,
    total: plan.total,
    knownMinutes: tracks.reduce((a, t) => a + (t.minutes ?? 0), 0),
    untimed: tracks.filter((t) => t.minutes === null).length,
  };
}

/** "approx. 8 min read" → "8 min"; "3m 20s" → "3:20"; a live session's date stays a date. */
export function trackTime(t: PlanTopic): string {
  const d = t.duration.trim();
  if (!d) return "";
  const ms = d.match(/^(\d+)m\s*(\d+)s$/);
  if (ms) return `${ms[1]}:${ms[2].padStart(2, "0")}`;
  return d.replace(/^approx\.\s*/i, "").replace(/\s*read$/i, "");
}

const TYPE_WORDS: Record<string, string> = {
  "VILT-Live Session": "Live session",
  "VILT-Recording": "Recording",
  "Lesson Page": "Lesson",
  "Practice Assignment": "Practice",
  "Graded Assignment": "Graded assignment",
  "Programming Assignment": "Programming",
  "Peer-graded": "Peer review",
};

export function typeWord(type: string): string {
  return TYPE_WORDS[type] ?? type;
}

/** 519 → "8 h 39 min". */
export function hoursMinutes(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (!h) return `${m} min`;
  return m ? `${h} h ${m} min` : `${h} h`;
}

export const pad2 = (n: number) => String(n).padStart(2, "0");

/** The cover to print for a course named in the week plan (which uses short course names). */
export function coverIdFor(courseName: string): string {
  const map: Record<string, string> = {
    "Six Sigma": SIX_SIGMA_ID,
    "Data Analytics": "data-analytics",
    "Cloud Essentials": "cloud",
  };
  return map[courseName] ?? courseName.toLowerCase().replace(/\s+/g, "-");
}

/** State in words, never colour alone. */
export function enrolmentState(e: Enrolment): string {
  switch (e.status) {
    case "in-progress":
      return `In progress, last played ${e.lastActive.toLowerCase() === "today" ? "today" : e.lastActive}`;
    case "not-started":
      return "Not started";
    case "completed":
      if (e.cert === "downloadable") return "Finished, certificate ready";
      if (e.cert === "generating") return "Finished, certificate on its way";
      return "Finished";
    case "locked":
      return e.lockedBy ? `Locked until you finish ${e.lockedBy}` : "Locked";
  }
}

/** "Last played 19 days ago" / "Not started yet". */
export function lastPlayed(e?: Enrolment): string {
  if (!e || e.status === "not-started") return "Not started yet";
  const when = e.lastActive.toLowerCase() === "today" ? "today" : e.lastActive;
  return `Last played ${when}`;
}
