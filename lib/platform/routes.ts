import { getCourseDetailBySlug } from "./course-detail";

/**
 * Where the learner goes, in one place (LMS-HANDOFF/platform-navigation-flow.md).
 *
 * Open edX gives every enrolment three addresses (Learner Home): `homeUrl`, the course's own
 * page; `resumeUrl`, the last unit in the player; `progressUrl`. The prototype follows them:
 * a title opens the course page, a Resume or Start button opens the player, and leaving the
 * player goes back to the course page it was opened for.
 */
export const DASHBOARD_HREF = "/platform/dashboard";
export const MY_LEARNING_HREF = "/platform/my-learning";
export const MY_LEARNING_PROGRAMS_HREF = "/platform/my-learning?tab=programs";

/** `homeUrl`: the course's page. A course without one in the prototype falls back to My Learning. */
export function courseHomeHref(courseSlug: string): string {
  return getCourseDetailBySlug(courseSlug) ? `/platform/course/${courseSlug}` : MY_LEARNING_HREF;
}
