import type { MyLearningCourse } from "@/lib/platform/my-learning";
import { coursePageHref, coursePlayerHref, slugify } from "@/lib/platform/hrefs";
import type { ProgramCourse } from "./types";

/**
 * Everything a program file may import (lib/courses/README.md). A program file never imports
 * lib/platform/program, lib/platform/catalog or lib/platform/course-detail: they read the
 * registry (lib/programs/index), so that would close an import cycle.
 */

export { user } from "@/lib/data";
export { certificatePageHref, coursePageHref, coursePlayerHref, slugify } from "@/lib/platform/hrefs";
export type * from "./types";

/**
 * A course row of the program. Every course is SkillUp · Beginner · Flexible Learning as
 * drawn; a course not started yet opens on its "Course Introduction" video. The cover is the
 * placeholder picture of the Figma screens (the field is the course's own `course_image`).
 */
export function programCourse(
  number: number,
  title: string,
  initials: string,
  cover: string,
  {
    position,
    detail,
    modules,
    defaultOpen,
    ...card
  }: Pick<ProgramCourse, "position" | "detail" | "modules" | "defaultOpen"> &
    Pick<MyLearningCourse, "progressMeta"> &
    Partial<Pick<MyLearningCourse, "progressPct" | "upNext" | "cta" | "href">>,
): ProgramCourse {
  const slug = slugify(title);
  return {
    id: `course-${number}`,
    slug,
    number,
    card: {
      id: `course-${number}`,
      title,
      initials,
      imageSrc: `/platform/covers/${cover}.jpg`,
      provider: "SkillUp",
      difficulty: "Beginner",
      delivery: "Flexible Learning",
      progressPct: null,
      upNext: { title: "Course Introduction", type: "Video" },
      cta: "Start",
      ...card,
      // A finished course is reviewed from its page; the others open the player.
      href: card.cta === "Review" ? coursePageHref(slug) : coursePlayerHref(slug),
      detailHref: coursePageHref(slug),
    },
    position,
    detail,
    modules,
    defaultOpen,
  };
}
