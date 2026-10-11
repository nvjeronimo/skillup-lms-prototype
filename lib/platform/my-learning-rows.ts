import { COURSES as OWN_COURSES } from "@/lib/courses";
import { flattenOutline } from "@/lib/courses/outline";
import type { ProgramCourse, ProgramModule } from "@/lib/programs/types";
import { getCourseDetailBySlug, type CourseModule } from "./course-detail";
import { myLearningCourses, type MyLearningCourse } from "./my-learning";

/**
 * The course rows of My Learning › Courses. Decided by Nelson on 11 Oct 2026: wherever the
 * course card stood on its own it is now a DS `LMS/Platform/Program-Detail/Course-Row`, the
 * row of a program page: the card, the modules bar that says where the learner is, and the
 * modules once the row is opened.
 *
 * Nothing about the modules is written here. The list is the one of the course's own page
 * (`getCourseDetailBySlug(slug).modules`, itself built from the player outline), so the row,
 * the page and the player cannot disagree; the module the learner is in is the one that holds
 * the topic the outline flags `active`, where Resume lands.
 *
 * In a file of its own, not in ./my-learning: lib/platform/catalog reads `myLearningCourses`
 * and lib/platform/course-detail reads the catalogue, so an import of the course pages from
 * ./my-learning would close a cycle. The My Learning page (a server component) reads this
 * file and hands the rows to the Collection, so the outlines stay out of the browser bundle.
 */
export type MyLearningCourseRow = Pick<ProgramCourse, "position" | "detail" | "modules"> & {
  card: MyLearningCourse;
};

/** Topics of a module of the course page: its lessons when it lists them, else its printed count. */
function topicsOf(module: CourseModule): { total: number; done: number } {
  const topics = (module.lessons ?? []).flatMap((lesson) => lesson.topics);
  if (!topics.length) {
    const total = Number.parseInt(module.topicCount, 10) || 0;
    return { total, done: module.state === "complete" ? total : 0 };
  }
  return { total: topics.length, done: topics.filter((t) => t.state === "Done").length };
}

/**
 * The modules bar and the modules of one course, in the convention of the program page
 * (lib/programs): "Module 2 of 5" and the module's name for a course in progress; otherwise
 * "5 modules" and the topic count, with "All complete" in front once every module is done.
 * The module the learner is in reads "3 of 9 topics"; the others their count.
 */
function rowOf(card: MyLearningCourse): MyLearningCourseRow {
  const pageModules = getCourseDetailBySlug(card.id)?.modules ?? [];
  const outline = OWN_COURSES.find((c) => c.outline.slug === card.id)?.outline;
  const active = outline ? flattenOutline(outline).find((t) => t.active) : undefined;
  const current = active ? pageModules.find((m) => m.id === active.moduleId) : undefined;

  const counts = pageModules.map(topicsOf);
  const topics = counts.reduce((sum, c) => sum + c.total, 0);
  const allComplete = pageModules.length > 0 && pageModules.every((m) => m.state === "complete");

  const modules: ProgramModule[] = pageModules.map((m, index) => ({
    number: m.number,
    title: m.title,
    complete: m.state === "complete",
    topics: m === current ? `${counts[index].done} of ${counts[index].total} topics` : m.topicCount,
    duration: m.duration,
    ...(m === current ? { current: true } : {}),
  }));

  return {
    card,
    position: current ? `Module ${current.number} of ${pageModules.length}` : `${pageModules.length} modules`,
    detail: current && active ? active.moduleTitle : `${allComplete ? "All complete · " : ""}${topics} topics`,
    modules: modules.length ? modules : undefined,
  };
}

/** One row per course of My Learning, in the order of `myLearningCourses`. */
export const myLearningCourseRows: MyLearningCourseRow[] = myLearningCourses.map(rowOf);
