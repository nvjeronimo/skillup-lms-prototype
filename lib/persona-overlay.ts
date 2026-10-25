import type { MyLearningCourse } from "@/lib/platform/my-learning";
import type { Program, ProgramCertificate, ProgramCourse, ProgramModule } from "@/lib/programs/types";
import { certificatePageHref, coursePageHref, coursePlayerHref, programCertificatePageHref } from "@/lib/platform/hrefs";
import type { Persona, PersonaPercent } from "./personas";

/**
 * The persona overlay (Nelson, 25 Oct 2026): pure functions that put a synthetic persona's
 * progress on the prototype's own data, so every figure derived from it (the catalogue, the
 * Dashboard glance, My Learning, the program and course pages, the Certificates page) follows.
 * The data modules call them at import with the active persona (lib/persona-active); the server
 * pages call them with the request's persona (lib/persona-server). Without a persona nothing
 * here runs and the data is exactly as written.
 */

type Issued = Extract<ProgramCertificate, { status: "issued" }>;

/** The day a persona's synthesized certificates are issued (sample, before SAMPLE_TODAY). */
export const PERSONA_ISSUED_ON = "2 October 2026";
const PERSONA_ISSUED_SHORT = "Issued 2 Oct 2026";

const inProgress = (pct: PersonaPercent) => pct !== null && pct > 0 && pct < 100;
const isComplete = (pct: PersonaPercent) => pct !== null && pct >= 100;

/** The card's action for a progress: Start (not started), Review (complete), Resume. */
export function ctaFor(pct: PersonaPercent): MyLearningCourse["cta"] {
  return pct === null || pct <= 0 ? "Start" : pct >= 100 ? "Review" : "Resume";
}

/**
 * A course card at the persona's progress: the bar, the action and where it goes, and the line
 * under the bar (the certificate once complete; the first topic when the card had a certificate
 * line and is no longer complete, or was started and no longer is). Unchanged when the progress is the same.
 */
export function overlayCard(card: MyLearningCourse, pct: PersonaPercent, slug: string): MyLearningCourse {
  if (pct === card.progressPct) return card;
  const cta = ctaFor(pct);
  const hadCertificate = "certificate" in card.upNext;
  const upNext: MyLearningCourse["upNext"] = isComplete(pct)
    ? hadCertificate
      ? card.upNext
      : { certificate: PERSONA_ISSUED_SHORT }
    : hadCertificate || (pct === null && card.progressPct !== null)
      ? { title: "Course Introduction", type: "Video" }
      : card.upNext;
  return { ...card, progressPct: pct, cta, upNext, href: cta === "Review" ? coursePageHref(slug) : coursePlayerHref(slug) };
}

/** "12 topics" → 12, "3 of 10 topics" → 10. */
const topicTotal = (topics: string) => Number(/(\d+)\s+topics/.exec(topics)?.[1] ?? 0);

/**
 * A course row of a program at the persona's progress: the card, and the modules bar from the
 * outline — the share of modules complete follows the percentage and the next one is current.
 */
export function overlayProgramCourse(pc: ProgramCourse, pct: PersonaPercent): ProgramCourse {
  const card = overlayCard(pc.card, pct, pc.slug);
  if (card === pc.card) return pc;
  const n = pc.modules?.length ?? 0;
  // Still in progress: the written modules bar stays, as the outline's active topic (where Resume
  // lands, and what the Dashboard names) decides it.
  if (!pc.modules || !n || (inProgress(pct) && inProgress(pc.card.progressPct))) return { ...pc, card };
  const done = pct === null ? 0 : isComplete(pct) ? n : Math.min(n - 1, Math.floor((pct / 100) * n));
  const current = inProgress(pct) ? done : -1;
  const modules: ProgramModule[] = pc.modules.map(({ current: _was, ...m }, i) => ({
    ...m,
    // "3 of 10 topics" belongs to the module the learner was in: the count alone elsewhere.
    topics: i === current ? m.topics : `${topicTotal(m.topics)} topics`,
    complete: i < done,
    ...(i === current ? { current: true } : {}),
  }));
  const topics = pc.modules.reduce((sum, m) => sum + topicTotal(m.topics), 0);
  return {
    ...pc,
    card,
    modules,
    position: current >= 0 ? `Module ${current + 1} of ${n}` : `${n} modules`,
    detail:
      current >= 0
        ? modules[current].title.replace(/^Module \d+\s*·\s*/, "")
        : `${isComplete(pct) ? "All complete · " : ""}${topics} topics`,
  };
}

/** A course certificate for a course the persona completed and the data has none for. */
export function synthesizeCertificate(
  template: Issued,
  persona: Persona,
  course: { number?: number; slug: string; title: string; initials: string; hours?: string },
): Issued {
  const label = course.number ? `Course ${course.number} · ${course.title}` : course.title;
  return {
    status: "issued",
    courseId: course.number ? `course-${course.number}` : `course-${course.slug}`,
    courseLabel: label,
    title: course.title,
    issuedLine: `Issued ${PERSONA_ISSUED_ON}.`,
    viewHref: certificatePageHref(course.slug),
    document: {
      ...template.document,
      learner: persona.name,
      courseTitle: course.title,
      summary: course.hours ?? template.document.summary,
      issuedOn: PERSONA_ISSUED_ON,
      certificateId: `SKL-${persona.id}-${course.initials}-2610`,
    },
  };
}

/** An issued certificate printed for the persona. */
const forLearner = (c: Issued, persona: Persona): Issued => ({ ...c, document: { ...c.document, learner: persona.name } });

/**
 * A program at the persona's progress: its course rows, its progress card (status, action,
 * footer), the course certificates (issued for a course complete, not earned for one started,
 * none for one not started) and the program certificate (only once every course is complete).
 */
export function overlayProgram(program: Program, persona: Persona, template: Issued): Program {
  const pcts = persona.programs[program.slug];
  const courses = program.courses.map((c, i) =>
    overlayProgramCourse(c, pcts && i < pcts.length ? pcts[i] : c.card.progressPct),
  );
  const pctOf = (c: ProgramCourse) => c.card.progressPct;
  const firstOpen = courses.findIndex((c) => inProgress(pctOf(c)));
  const withOpen = courses.map((c, i) => ({ ...c, defaultOpen: i === firstOpen || undefined }));

  const total = courses.length;
  const complete = courses.filter((c) => isComplete(pctOf(c))).length;
  const notStarted = courses.filter((c) => !pctOf(c)).length;
  const current = firstOpen >= 0 ? courses[firstOpen] : courses.find((c) => !pctOf(c));

  let progress: Program["progress"];
  if (complete === total) {
    progress = {
      ...program.progress,
      status: program.progress.percent === 100 ? program.progress.status : "All courses complete",
      cta: "View certificate",
      href: programCertificatePageHref(program.slug),
    };
  } else if (current) {
    const started = complete > 0 || firstOpen >= 0;
    progress = {
      ...program.progress,
      status:
        firstOpen >= 0
          ? `Course ${current.number} of ${total} · in progress`
          : started
            ? `Course ${current.number} of ${total} · up next`
            : program.progress.percent === 0
              ? program.progress.status
              : "Not started",
      cta: firstOpen >= 0 ? "Resume course" : "Start course",
      href: coursePlayerHref(current.slug),
    };
  } else {
    progress = program.progress;
  }
  progress = { ...progress, percent: total ? Math.round((complete / total) * 100) : 0, footer: `${complete} of ${total} courses complete` };

  const certificates: ProgramCertificate[] = courses.flatMap((c): ProgramCertificate[] => {
    const pct = pctOf(c);
    const own = program.certificates.find((x) => x.courseId === c.id);
    if (isComplete(pct)) {
      if (own?.status === "issued") return [forLearner(own, persona)];
      return [
        synthesizeCertificate(template, persona, {
          number: c.number,
          slug: c.slug,
          title: c.card.title,
          initials: c.card.initials,
          hours: c.card.progressMeta,
        }),
      ];
    }
    if (inProgress(pct)) {
      if (own?.status === "not-earned") return [own];
      return [
        {
          status: "not-earned" as const,
          courseId: c.id,
          courseLabel: `Course ${c.number} · ${c.card.title}`,
          title: "Not earned yet, keep on track!",
          requirements: [{ title: "Complete the course content", detail: `${pct}% complete`, percent: pct ?? 0 }],
        },
      ];
    }
    return [];
  });

  return {
    ...program,
    progress,
    courses: withOpen,
    certificates,
    certificatesNote:
      notStarted === 0
        ? "Every course of the program is started: each certificate shows here."
        : `Certificates for the ${notStarted} ${notStarted === 1 ? "course" : "courses"} you have not started appear here once you begin them.`,
    programCertificate:
      complete === total && program.programCertificate ? forLearner(program.programCertificate, persona) : undefined,
  };
}

/** The first issued course certificate of the data: the template of a synthesized one. */
export function certificateTemplate(programs: Program[]): Issued {
  for (const p of programs) {
    const hit = p.certificates.find((c): c is Issued => c.status === "issued");
    if (hit) return hit;
  }
  throw new Error("persona overlay: no issued certificate to copy");
}

/** The progress card of a course page at the catalogue's percentage. */
export function courseProgressCta(pct: PersonaPercent): string {
  return pct === null ? "Start course" : pct >= 100 ? "Review course" : "Resume course";
}
