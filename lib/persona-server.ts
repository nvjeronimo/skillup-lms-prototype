import { cookies } from "next/headers";
import { PERSONA_COOKIE, parsePersonaIds, type PersonaId } from "./personas";

/**
 * The personas of this request, from the `sk-persona` cookie (Nelson, 25 Oct 2026). Server
 * components only: the platform layout passes them to PersonaGate, and the pages that read
 * their data on the server (My Learning rows, Dashboard resume, course, program and certificate
 * pages) apply the first one before handing it to the browser.
 */
export function requestPersonaIds(): PersonaId[] {
  return parsePersonaIds(cookies().get(PERSONA_COOKIE)?.value);
}

/** The persona that provides the learner data on this request, or null. */
export function requestPersonaId(): PersonaId | null {
  return requestPersonaIds()[0] ?? null;
}
