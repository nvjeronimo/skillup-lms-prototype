/**
 * Lightweight analytics shim (Phase 1 spec, §4 of phase1-readiness.md).
 *
 * A unified `track(event, properties)` API. In the prototype this logs to the
 * console; in production it would forward to the analytics provider. `courseId`,
 * `topicId` and `userId` are merged in automatically when set via `setContext`.
 *
 * Honors Do-Not-Track: when the browser sets DNT, events are dropped.
 */

export type AnalyticsEvent =
  | "course_enter"
  | "topic_enter"
  | "topic_complete"
  | "topic_submit"
  | "module_complete"
  | "course_complete"
  | "video_play"
  | "video_pause"
  | "video_seek"
  | "video_speed_change"
  | "video_cc_toggle"
  | "video_language_change"
  | "video_complete"
  | "transcript_line_click"
  | "note_add"
  | "note_edit"
  | "note_delete"
  | "bookmark_add"
  | "bookmark_remove"
  | "panel_open"
  | "notification_click"
  | "download_file"
  | "download_transcript"
  | "certificate_view"
  | "certificate_share"
  | "certificate_print"
  | "sidebar_collapse"
  | "module_expand"
  | "module_collapse"
  | "mobile_drawer_open"
  | "mobile_drawer_close"
  | "ai_panel_open"
  | "ai_query_submit"
  | "demo_reset"
  | "device_mode_change"
  | "sidebar_shape_change";

type Props = Record<string, unknown>;

let context: Props = {};

export function setAnalyticsContext(ctx: Props) {
  context = { ...context, ...ctx };
}

function doNotTrack(): boolean {
  if (typeof navigator === "undefined") return false;
  // @ts-expect-error vendor-prefixed in some browsers
  const dnt = navigator.doNotTrack || window.doNotTrack || navigator.msDoNotTrack;
  return dnt === "1" || dnt === "yes";
}

export function track(event: AnalyticsEvent, properties: Props = {}) {
  if (doNotTrack()) return;
  const payload = { event, ...context, ...properties };
  // Prototype sink: console. Swap for a real provider in production.
  // eslint-disable-next-line no-console
  if (typeof window !== "undefined") console.debug("[analytics]", payload);
}
