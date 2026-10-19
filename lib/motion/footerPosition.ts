/**
 * The footer's "n of N" across topic remounts. The player lives in [topicId]/layout, so moving
 * to another topic remounts the footer; the number last shown is kept here, per course, so a
 * new number cross-fades in. Only within one visit to one course's player: another course
 * never fades, and the player's session boundary (app/course/[courseSlug]/topic/layout)
 * forgets it when the learner leaves, so coming back from /platform paints still.
 */
let last: { courseSlug: string; position: number } | null = null;

/** True when a footer mounting with this course and number should fade the number in. */
export function fadesOnMount(courseSlug: string, position: number): boolean {
  return last !== null && last.courseSlug === courseSlug && last.position !== position;
}

export function rememberFooterPosition(courseSlug: string, position: number): void {
  last = { courseSlug, position };
}

export function forgetFooterPosition(): void {
  last = null;
}
