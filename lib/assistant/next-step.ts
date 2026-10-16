import type { LearnerSnapshot } from "./types";

const isToday = (when: string) => when === "Today" || when === "Tonight";

/**
 * The one thing to do next, with the button that goes there (an id of `snapshot.actions`):
 * a deadline of today, else the course in progress, else a course not started. `null` when
 * nothing is left. The assistant's answer to "What should I do next?" and the Next card of
 * the chat both read this, so they can never disagree.
 */
export function nextStep(snapshot: LearnerSnapshot): { text: string; actionId: string } | null {
  const urgent = snapshot.due.find((d) => isToday(d.when));
  if (urgent) {
    return { text: `"${urgent.title}" is due ${urgent.when.toLowerCase()}. Start there.`, actionId: `due:${urgent.id}` };
  }
  const current = snapshot.courses.find((c) => c.status === "in-progress");
  if (current) {
    return {
      text: `Carry on with ${current.title}${current.upNext ? `: "${current.upNext}" is up next` : ""}.`,
      actionId: `resume:${current.slug}`,
    };
  }
  const fresh = snapshot.courses.find((c) => c.status === "not-started");
  return fresh ? { text: `Start ${fresh.title}.`, actionId: `resume:${fresh.slug}` } : null;
}
