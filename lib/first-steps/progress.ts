import type { PageContext } from "@/lib/assistant/types";
import { STEP_IDS, type StepId } from "./steps";

/** Kept in local storage, apart from the demo store: no store version to bump. */
export const STORAGE_KEY = "sk-first-steps";

export interface FirstStepsState {
  status: "active" | "done" | "dismissed";
  /** In the order of the steps, each once. */
  done: StepId[];
  /** Topics already complete when first steps started: "Complete a topic" needs a new one. */
  baseline: string[];
  /** The window has opened once, by itself or by the learner: it never opens by itself again. */
  greeted: boolean;
}

export type FirstStepsEvent =
  | { type: "visited"; page: PageContext }
  | { type: "completed"; completedTopics: string[] }
  | { type: "asked" }
  | { type: "greeted" }
  | { type: "dismissed" }
  | { type: "restarted"; completedTopics: string[] };

export function createState(completedTopics: string[]): FirstStepsState {
  return { status: "active", done: [], baseline: [...completedTopics], greeted: false };
}

const STEP_OF_PAGE: Partial<Record<PageContext["kind"], StepId>> = {
  program: "program",
  course: "course",
  player: "topic",
};

function tick(state: FirstStepsState, id: StepId | undefined): FirstStepsState {
  if (!id || state.done.includes(id)) return state;
  const done = STEP_IDS.filter((step) => step === id || state.done.includes(step));
  return { ...state, done, status: done.length === STEP_IDS.length ? "done" : "active" };
}

/** Returns the same object when the event changes nothing, so a caller can skip the save. */
export function reduce(state: FirstStepsState, event: FirstStepsEvent): FirstStepsState {
  if (event.type === "restarted") return createState(event.completedTopics);
  if (event.type === "greeted") return state.greeted ? state : { ...state, greeted: true };
  // Once done or dismissed, nothing the learner does brings the steps back.
  if (state.status !== "active") return state;
  switch (event.type) {
    case "dismissed":
      return { ...state, status: "dismissed" };
    case "visited":
      return tick(state, STEP_OF_PAGE[event.page.kind]);
    case "completed":
      return event.completedTopics.some((id) => !state.baseline.includes(id)) ? tick(state, "complete") : state;
    case "asked":
      return tick(state, "ask");
  }
}

function isState(value: unknown): value is FirstStepsState {
  if (typeof value !== "object" || value === null) return false;
  const s = value as Record<string, unknown>;
  return (
    (s.status === "active" || s.status === "done" || s.status === "dismissed") &&
    Array.isArray(s.done) &&
    s.done.every((id) => STEP_IDS.includes(id as StepId)) &&
    Array.isArray(s.baseline) &&
    s.baseline.every((id) => typeof id === "string") &&
    typeof s.greeted === "boolean"
  );
}

/**
 * The state in storage, or null when there is none, storage is blocked, or what is there is
 * not a state. Steps come back in their own order, each once, and five of them mean done.
 */
export function loadStored(storage: Pick<Storage, "getItem"> | undefined): FirstStepsState | null {
  try {
    const parsed: unknown = JSON.parse(storage?.getItem(STORAGE_KEY) ?? "null");
    if (!isState(parsed)) return null;
    const done = STEP_IDS.filter((id) => parsed.done.includes(id));
    const status = parsed.status === "active" && done.length === STEP_IDS.length ? "done" : parsed.status;
    return { ...parsed, done, status };
  } catch {
    return null;
  }
}

/** Nothing usable in storage: start fresh from today's completions. */
export function load(storage: Pick<Storage, "getItem"> | undefined, completedTopics: string[]): FirstStepsState {
  return loadStored(storage) ?? createState(completedTopics);
}

export function save(storage: Pick<Storage, "setItem"> | undefined, state: FirstStepsState): void {
  try {
    storage?.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* storage blocked or full: first steps still work for this visit */
  }
}
