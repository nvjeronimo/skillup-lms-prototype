import { coursesBySlug, course as sampleCourse, getCourseBySlug } from "@/lib/data";
import type { Course } from "@/lib/types";
import { myLearningCourses } from "./my-learning";
import { PROGRAMS, type ProgramCertificate } from "./program";

/**
 * Every course the platform pages name, so each one has a page and a player under its own
 * title (decided by Nelson on 9 Oct 2026: a card must not land on another course).
 *
 * The prototype still has one set of sample content: the body of every course page and
 * every player topic is the Six Sigma sample. Only the identity is the course's own: its
 * title, its picture, its progress and, for a course of a program, the program it belongs to.
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
 * The course the player shows for a slug. A catalogue course plays the sample content under
 * its own slug and title, so the sidebar, the exit and the certificate name the right course.
 */
export function playerCourse(slug: string): Course {
  if (coursesBySlug[slug]) return coursesBySlug[slug];
  const entry = getCatalogCourse(slug);
  return entry ? { ...sampleCourse, slug, title: entry.title } : getCourseBySlug(slug);
}

/** The issued certificate of a course, looked up in the programs. */
export function getIssuedCertificate(
  courseSlug: string,
): { certificate: Extract<ProgramCertificate, { status: "issued" }>; course: CatalogCourse } | undefined {
  const course = getCatalogCourse(courseSlug);
  if (!course?.program) return undefined;
  const program = PROGRAMS.find((p) => p.slug === course.program?.slug);
  const certificate = program?.certificates.find(
    (c) => c.status === "issued" && c.courseId === `course-${course.program?.number}`,
  );
  return certificate && certificate.status === "issued" ? { certificate, course } : undefined;
}
