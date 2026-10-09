import type { Program } from "./types";
import aiDrivenDigitalMarketing from "./ai-driven-digital-marketing";
import cybersecurityFundamentals from "./cybersecurity-fundamentals";

/**
 * The registry of programs: every program that has a page (/platform/program/<slug>).
 * To add one, add its file next to this one and one import and one entry here
 * (lib/courses/README.md). The catalogue (lib/platform/catalog) reads its courses from here.
 */
export const PROGRAMS: Program[] = [
  aiDrivenDigitalMarketing,
  cybersecurityFundamentals,
];

export function getProgramBySlug(slug: string): Program | undefined {
  return PROGRAMS.find((p) => p.slug === slug);
}
