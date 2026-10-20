/**
 * Open edX "Shift due dates", as the platform does it (Nelson, 20 Oct 2026: exactly what Open edX
 * allows, the way it works, nothing custom).
 *
 * Source: frontend-app-learning `ShiftDatesAlert` / `UpgradeToShiftDatesAlert` and edx-platform
 * `reset_course_deadlines` (openedx/features/course_experience/api/v1/views.py).
 * - Shown per course, on its Course (outline) tab and its Dates tab, when the course is self-paced,
 *   has assignment due dates, `dates_banner_info.missed_deadlines` is true, `missed_gated_content`
 *   is false and the course has not ended. A warning alert, not dismissible.
 * - The button posts `POST /api/course_experience/v1/reset_course_deadlines` with `course_key`
 *   (one course per call; no confirmation). The schedule restarts today, so the past-due dates and
 *   the ones after them move forward. On success the response's header shows as a toast with its
 *   link ("View all dates" → the course's Dates tab), and the dates are reloaded. On error Open edX
 *   only logs it.
 * - With content type gating and missed gated content (an audit learner) the same alert asks to
 *   upgrade instead (`verified_upgrade_link`).
 * The strings are the platform's own (English defaults).
 */
export const SHIFT_DATES = {
  title: "It looks like you missed some important deadlines based on our suggested schedule.",
  body:
    "To keep yourself on track, you can update this schedule and shift the past due assignments into the future. " +
    "Don’t worry—you won’t lose any of the progress you’ve made when you shift your due dates.",
  button: "Shift due dates",
  upgradeButton: "Upgrade to shift due dates",
  toast: "Your due dates have been successfully shifted to help you stay on track.",
  toastLink: "View all dates",
} as const;
