/**
 * Dawn: completion is light. The phase is always said in words next to the number, so colour is never
 * the only signal. Thresholds are a design choice, not data.
 */
export type PhaseKey = "night" | "first" | "dawn" | "day";

export interface Phase {
  key: PhaseKey;
  /** The phase name, set in italic. */
  word: string;
}

export const PHASES: Record<PhaseKey, Phase> = {
  night: { key: "night", word: "Night" },
  first: { key: "first", word: "First light" },
  dawn: { key: "dawn", word: "Dawn" },
  day: { key: "day", word: "Day" },
};

/** 0 → night · 1–39 → first light · 40–99 → dawn · 100 → day. */
export function phaseOfLight(light: number): Phase {
  if (light >= 1) return PHASES.day;
  if (light >= 0.4) return PHASES.dawn;
  if (light > 0) return PHASES.first;
  return PHASES.night;
}

export const phaseOfPct = (pct: number) => phaseOfLight(pct / 100);

/** Persona query string that every internal link keeps. */
export const personaQuery = (persona: string | null) => (persona ? `?persona=${encodeURIComponent(persona)}` : "");

export const BASE = "/lab/worlds/dawn";
