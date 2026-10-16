/**
 * The number shown `elapsedMs` into a count-up from 0 to `target` that lasts `durationMs`:
 * a whole number, eased like standard-decelerate (approximated by `1 - (1 - t)^3`, fast
 * then settling), clamped to [0, target], and exactly `target` once the time is up.
 */
export function countUpValue(target: number, elapsedMs: number, durationMs: number): number {
  if (durationMs <= 0 || elapsedMs >= durationMs) return target;
  const t = Math.max(0, elapsedMs / durationMs);
  const eased = 1 - Math.pow(1 - t, 3);
  const value = Math.round(target * eased);
  return Math.min(Math.max(value, 0), target);
}
