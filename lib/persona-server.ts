import { cookies } from "next/headers";
import { PERSONA_COOKIE, parsePersonaId, type PersonaId } from "./personas";

/**
 * The persona of this request, from the `sk-persona` cookie (Nelson, 25 Oct 2026), or null.
 * Server components only: the platform layout passes it to PersonaGate, and the pages that read
 * their data on the server (My Learning rows, Dashboard resume, course, program and certificate
 * pages) apply it before handing the data to the browser.
 */
export function requestPersonaId(): PersonaId | null {
  return parsePersonaId(cookies().get(PERSONA_COOKIE)?.value);
}
