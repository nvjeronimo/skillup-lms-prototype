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
 */
type Issued = Extract<ProgramCertificate, { status: "issued" }>;

export interface EarnedCertificate {
  id: string;
  kind: "course" | "program";
  certificate: Issued;
  /** The program a course certificate belongs to. */
  program?: { slug: string; title: string; number: number; total: number };
  viewHref: string;
}

export interface CertificateInProgress {
  id: string;
  kind: "course" | "program";
  title: string;
  /** "Course 2 of 7 · <program>" or "5 courses". */
  context?: string;
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
  context: c.program ? `Course ${c.program.number} of ${c.program.total} · ${c.program.title}` : undefined,
  percent: c.percent ?? 0,
  detail: `${c.percent}% of the course complete`,
  href: coursePageHref(c.slug),
}));

export const certificatesInProgress: CertificateInProgress[] = [...programsInProgress, ...coursesInProgress];
