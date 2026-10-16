import { COURSES as OWN_COURSES } from "@/lib/courses";
import { coursesBySlug, course as sampleCourse, getCourseBySlug } from "@/lib/data";
import type { Course } from "@/lib/types";
import { myLearningCourses } from "./my-learning";
import { PROGRAMS, type Program, type ProgramCertificate } from "./program";

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

const fromPrograms: CatalogCourse[] = PROGRAMS.flatMap((program) =>
  program.courses.map((c) => ({
    slug: c.slug,
    title: c.card.title,
    imageSrc: c.card.imageSrc,
    percent: c.card.progressPct,
    program: { slug: program.slug, title: program.title, number: c.number, total: program.courses.length },
  })),
);

const fromMyLearning: CatalogCourse[] = myLearningCourses.map((c) => ({
  slug: c.id,
  title: c.title,
  imageSrc: c.imageSrc,
  percent: c.progressPct,
}));

const CATALOG: CatalogCourse[] = [...fromPrograms, ...fromMyLearning];

export function getCatalogCourse(slug: string): CatalogCourse | undefined {
  return CATALOG.find((c) => c.slug === slug);
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
): { certificate: Extract<ProgramCertificate, { status: "issued" }>; course: CatalogCourse } | undefined {
  const course = getCatalogCourse(courseSlug);
  if (!course) return undefined;
  const program = PROGRAMS.find((p) => p.slug === course.program?.slug);
  const certificate = program
    ? program.certificates.find((c) => c.status === "issued" && c.courseId === `course-${course.program?.number}`)
    : OWN_COURSES.find((c) => c.page.slug === courseSlug)?.page.certificate;
  return certificate && certificate.status === "issued" ? { certificate, course } : undefined;
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
export function getProgramCertificate(programSlug: string): ProgramCertificateState | undefined {
  const program = PROGRAMS.find((p) => p.slug === programSlug);
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
