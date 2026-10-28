import type { SearchScope } from "@/components/platform/harbor/HarborSearch";
import type { Course } from "./types";

/**
 * The player bar's search scope for a course (Nelson, 26 Oct 2026): every topic by title, with
 * its module and type, linking into the player. Shared by the player and the certificate page,
 * which carries the same full bar (Figma 3830:77023; Nelson's SKO match review, 28 Oct 2026).
 */
export function courseSearchScope(course: Course, courseSlug: string): SearchScope {
  return {
    kind: "course",
    title: course.title,
    topics: course.modules.flatMap((m) =>
      (m.topics ?? m.lessons?.flatMap((l) => l.topics) ?? []).map((t) => ({
        id: t.id,
        title: t.title,
        meta: [m.implicit ? null : m.label, t.type].filter(Boolean).join(" · "),
        href: `/course/${courseSlug}/topic/${t.id}`,
      })),
    ),
  };
}
