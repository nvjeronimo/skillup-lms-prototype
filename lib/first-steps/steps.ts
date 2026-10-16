import type { ActionEntry, LearnerSnapshot } from "@/lib/assistant/types";

/**
 * The five first steps (docs/superpowers/specs/2026-10-13-first-steps-design.md §5). Each is
 * a real thing a learner needs in the first week, and each ticks itself when it is done on
 * the real page: nothing here is ticked by hand.
 */
export type StepId = "program" | "course" | "topic" | "complete" | "ask";

export interface Step {
  id: StepId;
  label: string;
  /** One line under the label: why it matters. */
  why: string;
  /** The label of the button that goes to where it happens. */
  cta: string;
}

export const STEPS: Step[] = [
  {
    id: "program",
    label: "Open your program",
    why: "See the courses ahead and the certificate at the end.",
    cta: "Open your program",
  },
  { id: "course", label: "Open a course", why: "Its page has your progress, dates and grades.", cta: "Open a course" },
  { id: "topic", label: "Start a topic", why: "Learning happens in the player.", cta: "Start learning" },
  { id: "complete", label: "Complete a topic", why: "Completed topics move your progress.", cta: "Resume" },
  {
    id: "ask",
    label: "Ask the assistant",
    why: "Deadlines, certificates, where you stopped.",
    cta: "Ask a question",
  },
];

export const STEP_IDS: StepId[] = STEPS.map((s) => s.id);

/**
 * Where a step's button goes: an action of the snapshot (the address is never written here),
 * `"ask"` for the step done in the chat itself, or `null` when the snapshot has no such place.
 */
export function stepAction(id: StepId, snapshot: LearnerSnapshot): ActionEntry | "ask" | null {
  if (id === "ask") return "ask";
  const first = (prefix: string) => snapshot.actions.find((a) => a.id.startsWith(prefix)) ?? null;
  if (id === "program") return first("program:");
  const current = snapshot.courses.find((c) => c.status === "in-progress");
  const prefix = id === "course" ? "course:" : "resume:";
  return (current && snapshot.actions.find((a) => a.id === `${prefix}${current.slug}`)) || first(prefix);
}
