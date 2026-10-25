import { COURSES as OWN_COURSES } from "@/lib/courses";
import { coursesBySlug, course as sampleCourse, getCourseBySlug } from "@/lib/data";
import type { Course } from "@/lib/types";
import { ACTIVE_PERSONA_ID } from "@/lib/persona-active";
import { synthesizeCertificate } from "@/lib/persona-overlay";
import { getPersona } from "@/lib/personas";
import { CERTIFICATE_TEMPLATE } from "@/lib/programs";
import { myLearningCoursesFor } from "./my-learning";
import { programsFor, type Program, type ProgramCertificate } from "./program";

/**
 * Every course the platform pages name, so each one has a page and a player under its own
 * title (decided by Nelson on 9 Oct 2026: a card must not land on another course).
 *
 * Two of them have content of their own, on the page (lib/platform/course-detail) and in the
 * player (lib/data): "AI-Driven Content and Brand Communication" and "UX Research and Design
 * Thinking". For every other one the body of the course page and of every player topic is
 * still the Six Sigma sample, and only the identity is the course's own: its title, its
 * picture, its progress and, for a course of a program, the program it belongs to.
 */
export interface CatalogCourse {
  slug: string;
  title: string;
  imageSrc?: string;
  /** 0–100, or null when the course has not been started. */
  percent: number | null;
  /** Set for a course that is part of a program. */
  program?: { slug: string; title: string; number: number; total: number };
}

const byPersona = new Map<string, CatalogCourse[]>();

/**
 * Every course, programs first, at a synthetic persona's progress (Nelson, 25 Oct 2026); as
 * written with none. A server page passes the request's persona (lib/persona-server).
 */
export function catalogFor(personaId: string | null | undefined): CatalogCourse[] {
  const key = getPersona(personaId)?.id ?? "";
  let hit = byPersona.get(key);
  if (hit) return hit;
  const fromPrograms: CatalogCourse[] = programsFor(key || null).flatMap((program) =>
    program.courses.map((c) => ({
      slug: c.slug,
      title: c.card.title,
      imageSrc: c.card.imageSrc,
      percent: c.card.progressPct,
      program: { slug: program.slug, title: program.title, number: c.number, total: program.courses.length },
    })),
  );
  const fromMyLearning: CatalogCourse[] = myLearningCoursesFor(key || null).map((c) => ({
    slug: c.id,
    title: c.title,
    imageSrc: c.imageSrc,
    percent: c.progressPct,
  }));
  hit = [...fromPrograms, ...fromMyLearning];
  byPersona.set(key, hit);
  return hit;
}

/** Every course, programs first; exported for the Certificates page (19 Oct 2026). In the browser at the active persona's progress. */
export const CATALOG: CatalogCourse[] = catalogFor(ACTIVE_PERSONA_ID);

export function getCatalogCourse(slug: string, personaId: string | null = ACTIVE_PERSONA_ID): CatalogCourse | undefined {
  return catalogFor(personaId).find((c) => c.slug === slug);
}

/** The course after this one in its program; undefined for the last one or a course of no program. */
export function nextCourseInProgram(slug: string): CatalogCourse | undefined {
  const current = getCatalogCourse(slug);
  if (!current?.program) return undefined;
  return CATALOG.find(
    (c) => c.program?.slug === current.program?.slug && c.program?.number === (current.program?.number ?? 0) + 1,
  );
}

/**
 * The course the player shows for a slug: its own outline when it has one. Any other
 * catalogue course plays the sample content under its own slug and title, so the sidebar,
 * the exit and the certificate name the right course.
 */
export function playerCourse(slug: string): Course {
  if (coursesBySlug[slug]) return coursesBySlug[slug];
  const entry = getCatalogCourse(slug);
  return entry ? { ...sampleCourse, slug, title: entry.title } : getCourseBySlug(slug);
}

/**
 * The issued certificate of a course: the one its program lists or, for a course of no
 * program, the one on its own page (lib/courses/<slug>/page).
 */
export function getIssuedCertificate(
  courseSlug: string,
  personaId: string | null = ACTIVE_PERSONA_ID,
): { certificate: Extract<ProgramCertificate, { status: "issued" }>; course: CatalogCourse } | undefined {
  const course = getCatalogCourse(courseSlug, personaId);
  if (!course) return undefined;
  const program = programsFor(personaId).find((p) => p.slug === course.program?.slug);
  if (program) {
    const certificate = program.certificates.find((c) => c.status === "issued" && c.courseId === `course-${course.program?.number}`);
    return certificate && certificate.status === "issued" ? { certificate, course } : undefined;
  }
  // A course of no program: its own page's certificate. Under a synthetic persona (25 Oct 2026)
  // only once the persona completed it, printed for the persona, or made from the template
  // when the course page has none.
  const own = OWN_COURSES.find((c) => c.page.slug === courseSlug)?.page.certificate;
  const persona = getPersona(personaId);
  if (persona) {
    if (course.percent !== 100) return undefined;
    if (own && own.status === "issued") return { certificate: { ...own, document: { ...own.document, learner: persona.name } }, course };
    const initials = course.title.split(/\s+/).filter((w) => /^[A-Za-z]/.test(w)).slice(0, 2).map((w) => w[0].toUpperCase()).join("");
    return { certificate: synthesizeCertificate(CERTIFICATE_TEMPLATE, persona, { slug: course.slug, title: course.title, initials }), course };
  }
  return own && own.status === "issued" ? { certificate: own, course } : undefined;
}

/* ── The certificate of a program (PROPOSAL, NOT DESIGNED: 10 Oct 2026) ─────────────── */

export interface ProgramCertificateCourse {
  slug: string;
  number: number;
  title: string;
  /** 0–100, or null when the course has not been started. */
  percent: number | null;
}

export interface ProgramCertificateState {
  program: Program;
  certificate: ProgramCertificate;
  /** Courses complete, of `courses.length`. */
  complete: number;
  courses: ProgramCertificateCourse[];
}

/**
 * The certificate of a program. Issued when the program file carries one
 * (`programCertificate`); otherwise not earned, with what is missing counted from the
 * program's own course rows: a course counts when it is at 100%.
 */
export function getProgramCertificate(
  programSlug: string,
  personaId: string | null = ACTIVE_PERSONA_ID,
): ProgramCertificateState | undefined {
  const program = programsFor(personaId).find((p) => p.slug === programSlug);
  if (!program) return undefined;
  const courses = program.courses.map((c) => ({
    slug: c.slug,
    number: c.number,
    title: c.card.title,
    percent: c.card.progressPct,
  }));
  const total = courses.length;
  const complete = courses.filter((c) => c.percent === 100).length;
  const certificate: ProgramCertificate = program.programCertificate ?? {
    status: "not-earned",
    courseId: `program-${program.slug}`,
    courseLabel: "Program certificate",
    title: complete === total ? "All courses complete: your certificate is being prepared" : "Not earned yet",
    requirements: [
      {
        title: "Complete every course of the program",
        detail: `${complete} of ${total} courses complete`,
        percent: total ? Math.round((complete / total) * 100) : 0,
      },
    ],
  };
  return { program, certificate, complete, courses };
}
