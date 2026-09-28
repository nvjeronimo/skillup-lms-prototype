import type { PersonaId } from "@/lib/lab/dashboard-mock";

/**
 * Direction B only: module positions behind the you-vs-cohort track, the catch-up step and the
 * week pattern. All derived from the persona's mocked `pace.detail` / `weeklyGoal`, so all MOCK.
 */
export interface PaceTrackData {
  /** Module you are in; 0 = not started. */
  you: number;
  cohort: number;
  total: number;
}

export const TRACK: Record<PersonaId, PaceTrackData> = {
  noah: { you: 0, cohort: 2, total: 6 },
  maya: { you: 3, cohort: 3, total: 6 },
  dev: { you: 2, cohort: 4, total: 6 },
  priya: { you: 5, cohort: 4, total: 6 },
};

/** Topics left to finish the module you are in (drives the first catch-up step). */
export const TOPICS_TO_NEXT_MODULE: Record<PersonaId, number> = { noah: 0, maya: 0, dev: 3, priya: 0 };

/** The last seven days, ending on the mocked "today" (Tue 30 Sep). */
export const WEEK_DAYS = [
  { short: "Wed", long: "Wednesday 24 Sep" },
  { short: "Thu", long: "Thursday 25 Sep" },
  { short: "Fri", long: "Friday 26 Sep" },
  { short: "Sat", long: "Saturday 27 Sep" },
  { short: "Sun", long: "Sunday 28 Sep" },
  { short: "Mon", long: "Monday 29 Sep" },
  { short: "Tue", long: "Tuesday 30 Sep (today)" },
] as const;

/** Indexes into WEEK_DAYS on which the learner was active; length matches `weeklyGoal.daysDone`. */
export const ACTIVE_DAYS: Record<PersonaId, number[]> = {
  noah: [],
  maya: [4, 6],
  dev: [],
  priya: [0, 2, 5, 6],
};
