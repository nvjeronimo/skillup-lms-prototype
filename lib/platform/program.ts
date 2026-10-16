/**
 * The Program page: its tabs and, re-exported at the end, the shape of a program and the
 * registry of programs. Each program's data is a file under lib/programs.
 */

/** Printed in place of a body the design does not provide. */
export const CONTENT_PENDING = "Content to be provided.";

export const PROGRAM_TABS = [
  { id: "courses", label: "Courses" },
  { id: "certificates", label: "Certificates" },
  { id: "faqs", label: "FAQs" },
  { id: "about", label: "About" },
] as const;

export type ProgramTabId = (typeof PROGRAM_TABS)[number]["id"];

export const DEFAULT_PROGRAM_TAB: ProgramTabId = "courses";

export function isProgramTab(value: string | null | undefined): value is ProgramTabId {
  return PROGRAM_TABS.some((t) => t.id === value);
}

/* The shape of a program (`Program` and its parts) is in lib/programs/types; each program is
 * a file under lib/programs, listed in lib/programs/index (lib/courses/README.md). */
export * from "@/lib/programs/types";
export { PROGRAMS, getProgramBySlug } from "@/lib/programs";
