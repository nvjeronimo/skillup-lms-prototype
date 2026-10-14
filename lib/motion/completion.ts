/** The last topic the learner completed, and when (ms since epoch). Session-only. */
export type LastCompleted = { topicId: string; at: number } | null;

/**
 * How long after a completion its chain (badge pop → rail check → ring) may still play.
 * The chain itself runs for well under this; the window only has to cover the renders
 * right after the click (and the move to the next topic from the Next dialog). Once it has
 * passed, going back to the topic shows the finished state without replaying.
 */
export const FRESH_COMPLETION_WINDOW_MS = 1500;

/** True when `topicId` is the one just completed and the window has not passed. */
export function isFreshCompletion(last: LastCompleted, topicId: string, now: number): boolean {
  return last !== null && last.topicId === topicId && now - last.at < FRESH_COMPLETION_WINDOW_MS;
}
