import { CATALOG, getProgramCertificate } from "./catalog";
import { earnedCertificates, earnedIssuedValue, type EarnedCertificate } from "./certificates";
import { coursePageHref, programPageHref } from "./hrefs";
import { myLearningCourses, myLearningPrograms } from "./my-learning";
import { PROGRAMS } from "./program";

/**
 * The Certificates page read from what the learner is enrolled in (Nelson, 30 Oct 2026, PR 437):
 * one entry per program and per course of no program, each with every certificate it can give,
 * earned or not, so no certificate shows twice and a program is never split by status.
 * CertificatesLedger draws its rows from it.
 */
export type CourseLineState = "earned" | "in-progress" | "not-started";

export interface CourseLine {
  slug: string;
  title: string;
  /** Its place in the program; none for a course of no program. */
  number?: number;
  percent: number;
  state: CourseLineState;
  earned?: EarnedCertificate;
  href: string;
}

export interface Enrolment {
  kind: "program" | "course";
  slug: string;
  title: string;
  initials: string;
  imageSrc?: string;
  href: string;
  /** The certificate this enrolment ends with: the program's, or the course's own. */
  issued?: EarnedCertificate;
  /** A program: its courses, in order. A course: itself, once. */
  courses: CourseLine[];
  complete: number;
  /** 0–100: courses complete of all (program) or the course's progress (course). */
  percent: number;
  /** The newest certificate in it, for sorting (0 when none). */
  latest: number;
}

const courseEarned = new Map(
  earnedCertificates
    .filter((e) => e.kind === "course")
    .map((e) => [e.id.replace(/^course-/, ""), e]),
);
const programEarned = new Map(
  earnedCertificates
    .filter((e) => e.kind === "program" && e.program)
    .map((e) => [e.program!.slug, e]),
);

function line(slug: string, title: string, percent: number | null, number?: number): CourseLine {
  const earned = courseEarned.get(slug);
  const p = percent ?? 0;
  return {
    slug,
    title,
    number,
    percent: p,
    state: earned ? "earned" : p > 0 ? "in-progress" : "not-started",
    earned,
    href: coursePageHref(slug),
  };
}

const initialsOf = (title: string) =>
  title
    .split(/\s+/)
    .filter((w) => /^[A-Za-z]/.test(w))
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");

const programs: Enrolment[] = PROGRAMS.flatMap((p) => {
  const state = getProgramCertificate(p.slug);
  if (!state) return [];
  const courses = state.courses.map((c) => line(c.slug, c.title, c.percent ?? null, c.number));
  const issued = programEarned.get(p.slug);
  if (!issued && !courses.some((c) => c.percent > 0)) return [];
  const card = myLearningPrograms.find((m) => m.id === p.slug);
  const total = courses.length;
  return [
    {
      kind: "program" as const,
      slug: p.slug,
      title: p.title,
      initials: card?.initials ?? initialsOf(p.title),
      imageSrc: card?.imageSrc,
      href: programPageHref(p.slug),
      issued,
      courses,
      complete: state.complete,
      percent: total ? Math.round((state.complete / total) * 100) : 0,
      latest: Math.max(
        0,
        ...[issued, ...courses.map((c) => c.earned)]
          .filter(Boolean)
          .map((e) => earnedIssuedValue(e!)),
      ),
    },
  ];
});

const singles: Enrolment[] = CATALOG.filter((c) => !c.program && c.percent !== null).map((c) => {
  const l = line(c.slug, c.title, c.percent);
  const card = myLearningCourses.find((m) => m.id === c.slug);
  return {
    kind: "course" as const,
    slug: c.slug,
    title: c.title,
    initials: card?.initials ?? initialsOf(c.title),
    imageSrc: card?.imageSrc ?? c.imageSrc,
    href: l.href,
    issued: l.earned,
    courses: [l],
    complete: l.state === "earned" ? 1 : 0,
    percent: l.percent,
    latest: l.earned ? earnedIssuedValue(l.earned) : 0,
  };
});

/** Newest certificate first, then the furthest along: what changed lately leads. */
export const enrolments: Enrolment[] = [...programs, ...singles].sort(
  (a, b) => b.latest - a.latest || b.percent - a.percent,
);
