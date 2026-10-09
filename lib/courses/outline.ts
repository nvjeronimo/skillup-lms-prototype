import type { Course, FlatTopic, Module, Topic } from "@/lib/types";

/**
 * What can be read from a player outline alone. This file imports nothing but types, so the
 * course folders, lib/data and lib/platform/hrefs can all use it without an import cycle.
 */

/** The topic the Six Sigma sample opens on; where a course with no outline of its own resumes. */
export const DEFAULT_TOPIC_ID = "m3-t1";

/** A module's topics whether stored flat or grouped under lessons. */
export function moduleTopics(mod: Module): Topic[] {
  if (mod.topics) return mod.topics;
  if (mod.lessons) return mod.lessons.flatMap((l) => l.topics);
  return [];
}

/** Flatten every topic in course order, with module/lesson context + index. */
export function flattenOutline(c: Course): FlatTopic[] {
  const out: FlatTopic[] = [];
  let index = 0;
  for (const mod of c.modules) {
    if (mod.lessons) {
      for (const lesson of mod.lessons) {
        for (const topic of lesson.topics) {
          out.push({
            ...topic,
            moduleId: mod.id,
            moduleLabel: mod.label,
            moduleTitle: mod.title,
            lessonLabel: lesson.label,
            index: index++,
          });
        }
      }
    } else if (mod.topics) {
      for (const topic of mod.topics) {
        out.push({
          ...topic,
          moduleId: mod.id,
          moduleLabel: mod.label,
          moduleTitle: mod.title,
          index: index++,
        });
      }
    }
  }
  return out;
}

/**
 * The topic a course resumes on: the one its outline flags `active`, else its first topic
 * still to do.
 */
export function resumeTopicOf(outline: Course): string {
  const topics = flattenOutline(outline);
  const resume = topics.find((t) => t.active) ?? topics.find((t) => !t.completed && !t.locked) ?? topics[0];
  return resume?.id ?? DEFAULT_TOPIC_ID;
}

/** The address of a topic in the player. */
export const playerTopicHref = (slug: string, topicId: string) => `/course/${slug}/topic/${topicId}`;
