/**
 * The first-visit cascade (motion-matrix §7.9): sections enter one after another, half a
 * short2 apart, at most eight steps (past eight a cascade reads as lag, as in §7.5).
 * A section marks its place with `data-arrive={n}`; the controller in
 * components/platform/arrival decides when each one runs.
 */
export const MAX_ARRIVE_STEPS = 8;

/** A whole step in 0…7. */
export function clampStep(step: number): number {
  if (!Number.isFinite(step)) return 0;
  return Math.min(Math.max(Math.floor(step), 0), MAX_ARRIVE_STEPS - 1);
}

/** The entrance delay of a step, as a token expression (never a raw ms). */
export function arriveDelay(step: number): string {
  return `calc(var(--motion-duration-short2) / 2 * ${clampStep(step)})`;
}

/**
 * The delay steps of sections that start together (a batch coming into view): their rank
 * by step, so the batch starts at once from the moment it shows, in page order.
 */
export function batchSteps(steps: number[]): number[] {
  const order = steps.map((step, i) => ({ step, i })).sort((a, b) => a.step - b.step || a.i - b.i);
  const ranks = new Array<number>(steps.length);
  order.forEach(({ i }, rank) => (ranks[i] = clampStep(rank)));
  return ranks;
}

export type ArrivePlan = { run: true; delayStep: number } | { run: false };

/**
 * At the end of the load: the sections in view run as one batch; the ones below the fold
 * wait until they scroll into view (each later batch through `batchSteps` again).
 */
export function planArrival(items: { step: number; inView: boolean }[]): ArrivePlan[] {
  const inView = items.map((it, i) => ({ ...it, i })).filter((it) => it.inView);
  const ranks = batchSteps(inView.map((it) => it.step));
  const plan: ArrivePlan[] = items.map(() => ({ run: false }));
  inView.forEach((it, k) => (plan[it.i] = { run: true, delayStep: ranks[k] }));
  return plan;
}
