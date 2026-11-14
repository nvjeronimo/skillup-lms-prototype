/**
 * A progress ring on a first visit (motion-matrix §7.9) and in the completion chain (§7.2):
 *
 *   armed    before it shows: drawn empty, no transition (the empty arc is its first paint)
 *   sweep    it has shown: the arc sweeps to the value at long2, standard-decelerate, at once
 *   settled  afterwards: a change of value is the chain's last beat (the same transition,
 *            short4 after the badge pops); this is also the phase of a revisit
 *
 * A value that changes during the sweep is a completion: it goes straight to the chain, so
 * the two never run one over the other with different delays.
 */
import styles from "./ring.module.css";

export type RingPhase = "armed" | "sweep" | "settled";

export function nextRingPhase(prev: RingPhase, armed: boolean, valueChanged: boolean): RingPhase {
  if (armed) return "armed";
  if (prev === "armed") return "sweep";
  if (prev === "sweep" && !valueChanged) return "sweep";
  return "settled";
}

/** The percentage the arc draws in a phase. */
export function ringShownPct(phase: RingPhase, pct: number): number {
  return phase === "armed" ? 0 : pct;
}

/** The arc's transition classes in a phase (motion tokens only, ring.module.css). */
export function ringTransitionClass(phase: RingPhase): string {
  if (phase === "armed") return "";
  return phase === "sweep" ? styles.arc : `${styles.arc} ${styles.chain}`;
}
