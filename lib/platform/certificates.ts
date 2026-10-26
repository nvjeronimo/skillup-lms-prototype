import { CATALOG, getIssuedCertificate, getProgramCertificate } from "./catalog";
import { certificatePageHref, coursePageHref, programCertificatePageHref } from "./hrefs";
import { PROGRAMS, type ProgramCertificate } from "./program";

/**
 * The Certificates page (Nelson, 19 Oct 2026): every certificate of the learner in one place,
 * from the Dashboard's Certificates tile and the profile menu.
 *
 * Open edX: course certificates come from the Certificates API (`/api/certificates/v0/
 * certificates/{username}/`, one row per course); program certificates from Credentials,
 * which is not configured on dev (LMS-HANDOFF/course-details-metadata-map.md: "no program
 * certificate and no Learner Record"). So the program rows here are sample data, as on the
 * program page.
 *
 * - Earned: every issued certificate, programs first, then courses, each once (a course of a
 *   program reads it from the program; a course of no program from its own page).
 * - In progress: the courses started and not complete, and the programs not earned yet that
 *   the learner has started, with how far they are.
 * - Both tabs group them by program (Nelson, 26 Oct 2026: "group the course certificates that
 *   belonged to a program"): `groupCertificates` below.
 */
type Issued = Extract<ProgramCertificate, { status: "issued" }>;

/** The program a certificate belongs to; `number` is the course's place in it (a course only). */
export interface CertificateProgram {
  slug: string;
  title: string;
  /** Courses in the program. */
  total: number;
  number?: number;
}

export interface EarnedCertificate {
  id: string;
  kind: "course" | "program";
  certificate: Issued;
  /** A course certificate: the program it belongs to. A program certificate: its program. */
  program?: CertificateProgram;
  viewHref: string;
}

export interface CertificateInProgress {
  id: string;
  kind: "course" | "program";
  title: string;
  /** "Course 2 of 7" or "5 courses". */
  context?: string;
  /** As on EarnedCertificate. */
  program?: CertificateProgram;
  percent: number;
  /** What the bar means, read out with it. */
  detail: string;
  href: string;
}

const earnedPrograms: EarnedCertificate[] = PROGRAMS.flatMap((p) =>
  p.programCertificate
    ? [
        {
          id: `program-${p.slug}`,
          kind: "program" as const,
          certificate: p.programCertificate,
          program: { slug: p.slug, title: p.title, total: p.courses.length },
          viewHref: programCertificatePageHref(p.slug),
        },
      ]
    : [],
);

const earnedCourses: EarnedCertificate[] = CATALOG.flatMap((c) => {
  const found = getIssuedCertificate(c.slug);
  return found
    ? [
        {
          id: `course-${c.slug}`,
          kind: "course" as const,
          certificate: found.certificate,
          program: c.program,
          viewHref: certificatePageHref(c.slug),
        },
      ]
    : [];
});

export const earnedCertificates: EarnedCertificate[] = [...earnedPrograms, ...earnedCourses];

const programsInProgress: CertificateInProgress[] = PROGRAMS.flatMap((p) => {
  const state = getProgramCertificate(p.slug);
  if (!state || state.certificate.status === "issued") return [];
  const started = state.courses.some((c) => (c.percent ?? 0) > 0);
  if (!started) return [];
  const total = state.courses.length;
  return [
    {
      id: `program-${p.slug}`,
      kind: "program" as const,
      title: p.title,
      context: `${total} courses`,
      program: { slug: p.slug, title: p.title, total },
      percent: total ? Math.round((state.complete / total) * 100) : 0,
      detail: `${state.complete} of ${total} courses complete`,
      href: programCertificatePageHref(p.slug),
    },
  ];
});

const coursesInProgress: CertificateInProgress[] = CATALOG.filter(
  (c) => c.percent !== null && c.percent > 0 && c.percent < 100,
).map((c) => ({
  id: `course-${c.slug}`,
  kind: "course" as const,
  title: c.title,
  context: c.program ? `Course ${c.program.number} of ${c.program.total}` : undefined,
  program: c.program,
  percent: c.percent ?? 0,
  detail: `${c.percent}% of the course complete`,
  href: coursePageHref(c.slug),
}));

export const certificatesInProgress: CertificateInProgress[] = [...programsInProgress, ...coursesInProgress];

/* ── By program (Nelson, 26 Oct 2026) ─────────────────────────────────────────────────── */

const MONTHS = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];

/** "30 September 2026" → a sortable number (0 when it does not read as a date). */
export function issuedOnValue(issuedOn: string): number {
  const m = /^(\d{1,2})\s+([a-z]+)\s+(\d{4})$/i.exec(issuedOn.trim());
  const month = m ? MONTHS.indexOf(m[2].toLowerCase()) : -1;
  return m && month >= 0 ? Date.UTC(Number(m[3]), month, Number(m[1])) : 0;
}

/** When an earned certificate was issued, for sorting the program blocks. */
export const earnedIssuedValue = (e: EarnedCertificate) => issuedOnValue(e.certificate.document.issuedOn);

interface Groupable {
  id: string;
  kind: "course" | "program";
  program?: CertificateProgram;
}

export interface ProgramCertificateGroup<T extends Groupable> {
  program: CertificateProgram;
  /** The program's own certificate in this tab: earned (Earned) or on the way (In progress). */
  programItem?: T;
  /** Its course certificates in this tab, in course order. */
  courses: T[];
}

export interface GroupedCertificates<T extends Groupable> {
  programs: ProgramCertificateGroup<T>[];
  /** The course certificates of no program, in the order given. */
  standalone: T[];
}

/**
 * One block per program the learner has a certificate in (its own or a course's), then the
 * courses of no program. A block holds the program's certificate, if it is in the list, and its
 * course certificates in course order. Blocks with the program certificate come first, then the
 * one with the most recent certificate (`recency`, when given), then the order given.
 * A program with nothing in the list has no block, so a persona with no program progress shows
 * none.
 */
export function groupCertificates<T extends Groupable>(
  items: T[],
  recency?: (item: T) => number,
): GroupedCertificates<T> {
  const bySlug = new Map<string, ProgramCertificateGroup<T>>();
  const standalone: T[] = [];
  for (const item of items) {
    const p = item.program;
    if (!p) {
      if (item.kind === "course") standalone.push(item);
      continue;
    }
    let group = bySlug.get(p.slug);
    if (!group) {
      group = { program: { slug: p.slug, title: p.title, total: p.total }, courses: [] };
      bySlug.set(p.slug, group);
    }
    if (item.kind === "program") group.programItem = item;
    else group.courses.push(item);
  }
  const groups = [...bySlug.values()];
  for (const g of groups) g.courses.sort((a, b) => (a.program?.number ?? 0) - (b.program?.number ?? 0));
  const latest = (g: ProgramCertificateGroup<T>) =>
    recency ? Math.max(0, ...(g.programItem ? [g.programItem] : []).concat(g.courses).map(recency)) : 0;
  // Array.prototype.sort is stable: equal blocks keep the order given.
  groups.sort((a, b) => Number(!!b.programItem) - Number(!!a.programItem) || latest(b) - latest(a));
  return { programs: groups, standalone };
}
