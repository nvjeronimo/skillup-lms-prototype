import { COURSES as OWN_COURSES } from "@/lib/courses";
import { flattenOutline } from "@/lib/courses/outline";
import type { TopicType } from "@/lib/types";
import { getCourseDetailBySlug } from "./course-detail";
import { dashboardResume, type DashboardResumeCourse } from "./dashboard";

/**
 * The rows of "Pick up where you left off". Decided by Nelson on 12 Oct 2026: the row says
 * where the learner stopped, so its headline is the module and the line under it is the
 * course and, when the course belongs to one, the program (DS `LMS/Platform/Discovery/
 * Course-Row` v2.0 and `LMS/Platform/Dashboard/Resume-Row` v1.1). Above the headline the
 * Course-Row prints the type and the length of the topic Resume lands on.
 *
 * Nothing about the module is written here: it is the module of the course's own page that
 * holds the topic the outline flags `active`, where Resume lands, as on My Learning
 * (./my-learning-rows). A course with no active topic keeps its own title as the headline.
 *
 * In a file of its own for the reason given in ./my-learning-rows: the Dashboard page (a
 * server component) reads it and hands the rows to the view, so the outlines stay out of
 * the browser bundle.
 */
export interface DashboardResumeRow extends DashboardResumeCourse {
  /** The module the learner left off in, e.g. "Module 2 · AI-Assisted Content Development". */
  headline: string;
  /** "Course · Program", or the course alone. Absent when the headline is the course itself. */
  context?: string;
  /** The topic Resume lands on: its type and its length as the outline prints it, above the headline. */
  next?: { type: TopicType; duration?: string };
}

function rowOf(course: DashboardResumeCourse): DashboardResumeRow {
  const page = getCourseDetailBySlug(course.slug);
  const outline = OWN_COURSES.find((c) => c.outline.slug === course.slug)?.outline;
  const active = outline ? flattenOutline(outline).find((t) => t.active) : undefined;
  const current = active ? page?.modules.find((m) => m.id === active.moduleId) : undefined;
  if (!current) return { ...course, headline: course.title, context: page?.program?.title };

  const headline = /^Module \d/.test(current.title) ? current.title : `Module ${current.number} · ${current.title}`;
  const context = page?.program ? `${course.title} · ${page.program.title}` : course.title;
  return { ...course, headline, context, next: active ? { type: active.type, duration: active.duration } : undefined };
}

/** One row per course of `dashboardResume`, in its order. */
export const dashboardResumeRows: DashboardResumeRow[] = dashboardResume.map(rowOf);
