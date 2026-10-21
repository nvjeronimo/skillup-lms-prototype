import { RESUME_SAVE_EVERY_SECONDS, addPlayed, reachedAutoComplete, type Interval } from "./coverage";

/**
 * The players advance every 250 ms; writing each tick to the store would re-serialise the
 * persisted state four times a second. They keep the open played stretch here instead and hand
 * it to the store (recordPlayback) in `flush`: every RESUME_SAVE_EVERY_SECONDS of play, when a
 * seek breaks the stretch, and at once when it takes coverage to 90% (BR-01), so the completion
 * is never late. Pause, end, a hidden tab and unmount flush whatever is pending.
 */
export function bufferStretch(
  pending: Interval | null,
  from: number,
  to: number,
  ctx: { stored: readonly Interval[]; duration: number; completed: boolean },
): { pending: Interval | null; flush: Interval[] } {
  const flush: Interval[] = [];
  let open: Interval;
  if (pending && Math.abs(from - pending[1]) < 1e-6) open = [pending[0], to];
  else {
    // Not continuous: the learner jumped between ticks. The jump itself is not played time.
    if (pending) flush.push(pending);
    open = [from, to];
  }
  const long = open[1] - open[0] >= RESUME_SAVE_EVERY_SECONDS;
  const reaches =
    !ctx.completed && reachedAutoComplete(addPlayed([...ctx.stored, ...flush], open[0], open[1]), ctx.duration);
  if (long || reaches) return { pending: null, flush: [...flush, open] };
  return { pending: open, flush };
}
