import type { DeviceMode, TextSize } from "./store";
import { PERSONA_COOKIE, getPersona, type PersonaConditions, type PersonaId } from "./personas";

/**
 * What the synthetic personas change in the store (Nelson, 25 Oct 2026), and how Apply and
 * Clear keep the learner's own settings. The My Learning list view is not a store setting: the
 * data module reads it (lib/platform/my-learning `MY_LEARNING_DEFAULT_VIEW`).
 */
export interface PersonaSettings {
  deviceMode: DeviceMode;
  textSize: TextSize;
  largeTargetsChoice: boolean | null;
  underlineLinks: boolean;
  reduceMotion: boolean;
}

/** Where the settings from before the first Apply are kept, for Clear to put back. */
export const PERSONA_BEFORE_KEY = "sk-persona-before";

export function snapshotSettings(s: PersonaSettings): PersonaSettings {
  return {
    deviceMode: s.deviceMode,
    textSize: s.textSize,
    largeTargetsChoice: s.largeTargetsChoice,
    underlineLinks: s.underlineLinks,
    reduceMotion: s.reduceMotion,
  };
}

/** The settings a persona's conditions ask for, on top of `base`: each condition only ever switches one on. */
export function settingsFor(conditions: PersonaConditions, base: PersonaSettings): PersonaSettings {
  return {
    deviceMode: conditions.mobile ? "mobile" : base.deviceMode,
    textSize: conditions.largestText ? "xl" : base.textSize,
    largeTargetsChoice: conditions.largeTargets ? true : base.largeTargetsChoice,
    underlineLinks: conditions.underlineLinks ? true : base.underlineLinks,
    reduceMotion: conditions.reduceMotion ? true : base.reduceMotion,
  };
}

/**
 * Apply one persona (one at a time, Nelson 25 Oct 2026): its conditions only, always over the
 * settings from before any persona, so switching from P07 to P02 puts the baseline back first
 * and P07's large text does not leak into P02. Returns the snapshot to keep: the one already
 * kept when a persona was on, else the current settings.
 */
export function applyPlan(
  id: PersonaId,
  current: PersonaSettings,
  kept: PersonaSettings | null,
): { settings: PersonaSettings; before: PersonaSettings } {
  const before = kept ?? snapshotSettings(current);
  return { settings: settingsFor(getPersona(id)?.conditions ?? {}, before), before };
}

/** The cookie Apply writes ("P02", a year, every path); null deletes it. */
export function personaCookie(id: PersonaId | null): string {
  return id
    ? `${PERSONA_COOKIE}=${id}; path=/; max-age=31536000; samesite=lax`
    : `${PERSONA_COOKIE}=; path=/; max-age=0; samesite=lax`;
}

export function readKeptSettings(): PersonaSettings | null {
  try {
    const raw = window.localStorage.getItem(PERSONA_BEFORE_KEY);
    return raw ? (JSON.parse(raw) as PersonaSettings) : null;
  } catch {
    return null;
  }
}

export function writeKeptSettings(s: PersonaSettings | null) {
  try {
    if (s) window.localStorage.setItem(PERSONA_BEFORE_KEY, JSON.stringify(s));
    else window.localStorage.removeItem(PERSONA_BEFORE_KEY);
  } catch {
    /* storage blocked: Clear then keeps the persona's settings */
  }
}
