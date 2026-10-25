import type { Program } from "./types";
import aiDrivenDigitalMarketing from "./ai-driven-digital-marketing";
import cybersecurityFundamentals from "./cybersecurity-fundamentals";
import dataAnalyticsFoundations from "./data-analytics-foundations";
import { ACTIVE_PERSONA_ID } from "@/lib/persona-active";
import { certificateTemplate, overlayProgram } from "@/lib/persona-overlay";
import { getPersona } from "@/lib/personas";

/** The programs as their files write them, before any persona. */
const WRITTEN: Program[] = [
  aiDrivenDigitalMarketing,
  cybersecurityFundamentals,
  dataAnalyticsFoundations,
];

/** The issued certificate a persona's synthesized certificates copy (sheet, signatories). */
export const CERTIFICATE_TEMPLATE = certificateTemplate(WRITTEN);

const byPersona = new Map<string, Program[]>();

/**
 * The programs at a synthetic persona's progress (Nelson, 25 Oct 2026; lib/persona-overlay);
 * the written ones with none. Kept per persona, so a server page asking twice gets the same objects.
 */
export function programsFor(personaId: string | null | undefined): Program[] {
  const persona = getPersona(personaId);
  if (!persona) return WRITTEN;
  let hit = byPersona.get(persona.id);
  if (!hit) {
    hit = WRITTEN.map((p) => overlayProgram(p, persona, CERTIFICATE_TEMPLATE));
    byPersona.set(persona.id, hit);
  }
  return hit;
}

/**
 * The registry of programs: every program that has a page (/platform/program/<slug>).
 * To add one, add its file next to this one and one import and one entry in WRITTEN
 * (lib/courses/README.md). The catalogue (lib/platform/catalog) reads its courses from here.
 * In the browser it carries the active persona's progress (lib/persona-active); on the server none.
 */
export const PROGRAMS: Program[] = programsFor(ACTIVE_PERSONA_ID);

/** A program; `personaId` lets a server page ask for the request's persona. */
export function getProgramBySlug(slug: string, personaId: string | null = ACTIVE_PERSONA_ID): Program | undefined {
  return programsFor(personaId).find((p) => p.slug === slug);
}
