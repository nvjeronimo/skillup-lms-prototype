/**
 * The simulated load of the platform pages (motion-matrix §7.9, decision 1): a short wait
 * with the page's skeleton, as a real API would take. The demo menu switches it off or to
 * slow for a review; the choice is kept per browser in localStorage under LOAD_MODE_KEY
 * (outside the zustand store, so the pre-paint script can read it as plain text).
 */
export type LoadMode = "normal" | "off" | "slow";

export const LOAD_MODE_KEY = "sk-arrival-load";

export const LOAD_MODES: { value: LoadMode; label: string }[] = [
  { value: "normal", label: "Normal" },
  { value: "off", label: "Off" },
  { value: "slow", label: "Slow (2 s)" },
];

export function parseLoadMode(raw: string | null): LoadMode {
  return raw === "off" || raw === "slow" ? raw : "normal";
}

/**
 * How long the simulated request takes. A timer standing in for the network, not a motion
 * duration, so it is not on the motion scale.
 */
export function loadDelayMs(mode: LoadMode): number {
  return mode === "off" ? 0 : mode === "slow" ? 2000 : 500;
}

/** The skeleton shows on a first visit only, and never with the load switched off. */
export function shouldShowSkeleton(firstVisit: boolean, mode: LoadMode): boolean {
  return firstVisit && mode !== "off";
}
