import { PERSONA_COOKIE, getPersona, parsePersonaId, type Persona, type PersonaId } from "./personas";

/**
 * The persona active in this browser (Nelson, 25 Oct 2026; one at a time since the same day),
 * read once, synchronously, when the module loads: in the browser from the `sk-persona` cookie
 * that Apply sets; on the server always none, since a module is shared by every request. So the
 * data modules that apply it at import (lib/data, lib/programs, lib/platform/*) follow it in the
 * browser only; a server page that hands data to the browser applies it itself, from the
 * request's cookie (lib/persona-server), and the platform pages render their content after
 * mount while a persona is on (PersonaGate in lib/persona-gate), so the server HTML never
 * disagrees. Apply and Clear reload the page, which loads the modules again.
 */
function readCookie(): string | null {
  if (typeof document === "undefined") return null;
  const hit = document.cookie.split("; ").find((c) => c.startsWith(`${PERSONA_COOKIE}=`));
  return hit ? hit.slice(PERSONA_COOKIE.length + 1) : null;
}

/** The active persona's id; null on the server and with no persona on. */
export const ACTIVE_PERSONA_ID: PersonaId | null = parsePersonaId(readCookie());

/** The active persona: its conditions and its learner data. */
export const ACTIVE_PERSONA: Persona | null = getPersona(ACTIVE_PERSONA_ID) ?? null;
