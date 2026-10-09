import type { Course } from "@/lib/types";
import type { CourseModule, CourseModuleState } from "@/lib/platform/course-detail";
import { moduleTopics, playerTopicHref, resumeTopicOf } from "./outline";

/**
 * Everything a course folder may import (lib/courses/README.md). A course file takes its
 * types and helpers from here and from its own folder, never from lib/data, lib/content,
 * lib/store or lib/platform: those read the registry, so importing them from a course would
 * close an import cycle. `next lint` refuses such an import (.eslintrc.json).
 */

export type { Course, Module, Lesson, Topic, TopicType, TranscriptLine } from "@/lib/types";
export type {
  CourseDate,
  CourseDetail,
  CourseModule,
  CoursePerson,
  CourseSidebarDate,
  GradeRow,
  GradeSection,
  QaMessage,
  QaThread,
  WeekDayState,
  WeeklyGoal,
} from "@/lib/platform/course-detail";
export type { ArticleContent, AssignmentBrief, OraContent, QuizQuestion, TopicByline } from "@/lib/content";
export type { CourseContent, CourseEntry } from "./types";

export { GRAY, SIX_SIGMA, week } from "./sample-page";
export { moduleTopics, resumeTopicOf };

/** `resumeUrl` of a course: its player on the topic it resumes on, or on the topic given. */
export const playerHref = (outline: Course, topicId: string = resumeTopicOf(outline)) =>
  playerTopicHref(outline.slug, topicId);

/** "approx. 15 min read" → "15 min": the page prints the bare effort. */
export const effort = (duration: string) => duration.replace(/^approx\.\s*/, "").replace(/\s*read$/, "");

/**
 * The syllabus of a course, built from its player outline (./outline.ts of its folder): the same
 * modules, lessons, topics and states, so the page and the player cannot disagree. What the
 * outline does not hold comes in `extra`, one entry per module: its duration and, when it
 * applies, that it opens with the page or why it is locked.
 */
export function modulesFromOutline(
  outline: Course,
  extra: Pick<CourseModule, "duration" | "defaultOpen" | "lockReason">[],
): CourseModule[] {
  return outline.modules.map((mod, index) => {
    const topics = moduleTopics(mod);
    const state: CourseModuleState = topics.every((t) => t.completed)
      ? "complete"
      : topics.every((t) => t.locked)
        ? "locked"
        : "incomplete";
    return {
      id: mod.id,
      number: index + 1,
      title: `Module ${index + 1} · ${mod.title}`,
      state,
      topicCount: `${topics.length} topics`,
      ...extra[index],
      lessons: (mod.lessons ?? []).map((lesson) => ({
        id: lesson.id,
        label: lesson.label,
        topics: lesson.topics.map((t) => ({
          id: t.id,
          title: t.title,
          type: t.type,
          duration: effort(t.duration),
          state: t.completed ? "Done" : t.locked ? "Locked" : "Pending",
        })),
      })),
    };
  });
}

/** Both sample weeks run Monday 21 to Sunday 27 September 2026; today is Thursday 24. */
export const THIS_WEEK = "This week · 21–27 Sep";
