"use client";

import * as React from "react";
import { ACTIVE_PERSONA } from "./persona-active";
import { DEFAULT_PLATFORM_USER, platformUser, type PlatformUser } from "./platform/user";
import type { Persona, PersonaId } from "./personas";

/**
 * Hydration safety for the synthetic personas (Nelson, 25 Oct 2026). The data modules carry the
 * active persona in the browser only (lib/persona-active), so whatever reads them must not be
 * part of the server HTML while a persona is on:
 * - the platform layout reads the cookie on the server and passes the id here; PlatformPage
 *   renders its content only after mount while one is on (its skeleton until then);
 * - the few places outside that content (the top bars' learner, the assistant) read the learner
 *   through `useLearner()`: the written one while hydrating, the persona right after.
 * With no persona on, nothing changes: the content renders on the server as before.
 */
const PersonaIdContext = React.createContext<PersonaId | null>(null);

export function PersonaGateProvider({ id, children }: { id: PersonaId | null; children: React.ReactNode }) {
  return <PersonaIdContext.Provider value={id}>{children}</PersonaIdContext.Provider>;
}

const noop = () => () => {};

/** False on the server and while hydrating, true after (and at once on a client navigation). */
export function useHydrated(): boolean {
  return React.useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
}

/** True while a persona is on and the page is still hydrating: hold the content back. */
export function usePersonaGated(): boolean {
  const id = React.useContext(PersonaIdContext);
  const hydrated = useHydrated();
  return id !== null && !hydrated;
}

/** The learner to print outside the gated content: the persona once hydrated. */
export function useLearner(): PlatformUser {
  return useHydrated() ? platformUser : DEFAULT_PLATFORM_USER;
}

/** The active persona; none while hydrating. */
export function useActivePersona(): Persona | null {
  return useHydrated() ? ACTIVE_PERSONA : null;
}
