/**
 * The seven synthetic personas (Nelson, 25 Oct 2026; 04-research/personas, INDEX.md and
 * personas.json). Test lenses, not real learners (PRODUCT.md): the profile menu's "Synthetic
 * personas" picks one at a time (Nelson, 25 Oct 2026: "Só podemos escolher uma persona de cada
 * vez"); the prototype takes its conditions (settings it already has) and its learner data (its
 * name and its progress over the prototype's courses).
 *
 * Pure data, no imports: lib/data and lib/programs read it at import, so it must not close a cycle.
 *
 * The progress maps cover the prototype's ACTUAL courses: the courses of each program, in their
 * order (lib/programs), and the five single courses of My Learning (by slug). A persona's
 * portfolio item is mapped to the course of the same meaning (Product Analytics → the Data
 * Analytics program, Intro to SQL / Cloud Security / Data Storytelling → Intro to Product
 * Analytics, the one completed single course); where the persona has nothing similar the course
 * is not started (null). Every persona stays enrolled in every course of the prototype.
 */

export type PersonaId = "P01" | "P02" | "P03" | "P04" | "P05" | "P06" | "P07";

/** 0–100, or null for not started (the prototype's convention, lib/platform/catalog). */
export type PersonaPercent = number | null;

/**
 * What a persona switches on, among the settings the prototype already has (lib/store and the
 * My Learning view).
 */
export interface PersonaConditions {
  /** The 375 mobile preview (lib/store `deviceMode`). */
  mobile?: boolean;
  /** The largest text size, A+ (1.30 scale). */
  largestText?: boolean;
  largeTargets?: boolean;
  underlineLinks?: boolean;
  reduceMotion?: boolean;
  /** My Learning opens in the list view. */
  listView?: boolean;
}

export interface Persona {
  id: PersonaId;
  name: string;
  archetype: string;
  /** One line from the persona file: the behaviour lens and what it stresses. */
  summary: string;
  conditions: PersonaConditions;
  /** The progress of each program's courses, in their order, by program slug. */
  programs: Record<string, PersonaPercent[]>;
  /** The progress of the single courses of My Learning, by slug. */
  courses: Record<string, PersonaPercent>;
}

const NONE_7: PersonaPercent[] = [null, null, null, null, null, null, null];
const NONE_5: PersonaPercent[] = [null, null, null, null, null];

export const PERSONAS: Persona[] = [
  {
    id: "P01",
    name: "Noah Carter",
    archetype: "Cautious Newcomer",
    summary:
      "Explores slowly and commits late; mostly not started. Stresses discoverability, labels, confirmations and an obvious start-here.",
    conditions: { largeTargets: true },
    programs: {
      "ai-driven-digital-marketing": NONE_7,
      "cybersecurity-fundamentals": NONE_5,
      "data-analytics-foundations": NONE_5,
    },
    courses: {
      "ux-research-and-design-thinking": null,
      "project-management-with-ai-tools": 10,
      "leadership-in-remote-teams": null,
      "intro-to-product-analytics": 100,
      "business-analytics-with-python": null,
    },
  },
  {
    id: "P02",
    name: "Maya Ferreira",
    archetype: "Consistent Achiever",
    summary:
      "Steady weekly rhythm, finishes what she starts, on cohort pace. The intended happy path: baseline usability.",
    conditions: {},
    programs: {
      "ai-driven-digital-marketing": [100, 55, null, null, null, null, null],
      "cybersecurity-fundamentals": NONE_5,
      "data-analytics-foundations": NONE_5,
    },
    courses: {
      "ux-research-and-design-thinking": null,
      "project-management-with-ai-tools": null,
      "leadership-in-remote-teams": 100,
      "intro-to-product-analytics": null,
      "business-analytics-with-python": null,
    },
  },
  {
    id: "P03",
    name: "Dev Okafor",
    archetype: "Stall-and-Returner",
    summary:
      "Starts strong, stalls for weeks, returns to catch up; behind pace, one program abandoned. Stresses re-engagement and resuming after a gap.",
    conditions: {},
    programs: {
      "ai-driven-digital-marketing": [100, 12, null, null, null, null, null],
      "cybersecurity-fundamentals": [8, null, null, null, null],
      "data-analytics-foundations": NONE_5,
    },
    courses: {
      "ux-research-and-design-thinking": null,
      "project-management-with-ai-tools": null,
      "leadership-in-remote-teams": null,
      "intro-to-product-analytics": 100,
      "business-analytics-with-python": 35,
    },
  },
  {
    id: "P04",
    name: "Priya Nair",
    archetype: "Credential Collector",
    summary:
      "Finishes prolifically and collects certificates, ahead of pace. Stresses density, the archive of completed courses and what comes next.",
    conditions: { listView: true },
    programs: {
      "ai-driven-digital-marketing": [100, 100, 60, null, null, null, null],
      "cybersecurity-fundamentals": NONE_5,
      "data-analytics-foundations": [100, 100, 100, 100, 100],
    },
    courses: {
      "ux-research-and-design-thinking": 100,
      "project-management-with-ai-tools": 100,
      "leadership-in-remote-teams": 100,
      "intro-to-product-analytics": 100,
      "business-analytics-with-python": 20,
    },
  },
  {
    id: "P05",
    name: "Leo Martins",
    archetype: "Impatient Explorer",
    summary:
      "Wants to jump ahead, binges what is open and clicks locked items. Stresses gates, blocked messages and guardrails against rapid clicks.",
    conditions: {},
    programs: {
      "ai-driven-digital-marketing": [100, 8, null, null, null, null, null],
      "cybersecurity-fundamentals": NONE_5,
      "data-analytics-foundations": [60, null, null, null, null],
    },
    courses: {
      "ux-research-and-design-thinking": 30,
      "project-management-with-ai-tools": null,
      "leadership-in-remote-teams": null,
      "intro-to-product-analytics": 100,
      "business-analytics-with-python": null,
    },
  },
  {
    id: "P06",
    name: "Sara Lindqvist",
    archetype: "Mobile Micro-Learner",
    summary:
      "Phone-first, 10–15 minute bursts, slightly behind. Stresses the 375 layout, touch ergonomics and parity with the desktop.",
    conditions: { mobile: true },
    programs: {
      "ai-driven-digital-marketing": NONE_7,
      "cybersecurity-fundamentals": NONE_5,
      "data-analytics-foundations": [100, 40, null, null, null],
    },
    courses: {
      "ux-research-and-design-thinking": null,
      "project-management-with-ai-tools": 20,
      "leadership-in-remote-teams": null,
      "intro-to-product-analytics": 100,
      "business-analytics-with-python": null,
    },
  },
  {
    id: "P07",
    name: "Helena Costa",
    archetype: "Accessibility-First Senior",
    summary:
      "Slow and persistent, relies on zoom and the keyboard. Stresses WCAG AA: reflow at large text, target size, focus and plain labels.",
    conditions: { largestText: true, largeTargets: true, underlineLinks: true, reduceMotion: true },
    programs: {
      "ai-driven-digital-marketing": NONE_7,
      "cybersecurity-fundamentals": NONE_5,
      "data-analytics-foundations": NONE_5,
    },
    courses: {
      "ux-research-and-design-thinking": null,
      "project-management-with-ai-tools": null,
      "leadership-in-remote-teams": 18,
      "intro-to-product-analytics": 100,
      "business-analytics-with-python": null,
    },
  },
];

export function getPersona(id: string | null | undefined): Persona | undefined {
  return PERSONAS.find((p) => p.id === id);
}

/** The labels of the conditions, as the modal's badges show them. */
export const CONDITION_LABELS: Record<keyof PersonaConditions, string> = {
  mobile: "Mobile 375",
  largestText: "Largest text",
  largeTargets: "Larger targets",
  underlineLinks: "Underlined links",
  reduceMotion: "Reduced motion",
  listView: "My Learning list",
};

/** "Noah Carter" → "Noah". */
export const firstNameOf = (name: string) => name.split(" ")[0] ?? name;

/* ── The cookie ─────────────────────────────────────────────────────────────────────── */

/** The active persona's id: "P02". Set by Apply, read by the browser and the server layout. */
export const PERSONA_COOKIE = "sk-persona";

/**
 * The persona of a cookie value, or null. A cookie from the first version, which held several
 * ("P02,P06"), gives its first known id, so no browser breaks.
 */
export function parsePersonaId(value: string | null | undefined): PersonaId | null {
  if (!value) return null;
  let text = value;
  try {
    text = decodeURIComponent(value);
  } catch {
    /* not encoded: read as it is */
  }
  for (const raw of text.split(",")) {
    const p = getPersona(raw.trim());
    if (p) return p.id;
  }
  return null;
}
