import { flattenOutline, playerTopicHref } from "@/lib/courses/outline";
import { playerCourse } from "@/lib/platform/catalog";

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

/**
 * The player address of each topic of a course, for the outline, the Dates tab and search.
 * A topic the player's outline does not hold (a course page drawn ahead of its content)
 * falls back to where the course resumes, so a link never breaks.
 */
export function topicLinks(slug: string, fallback: string) {
  const flat = flattenOutline(playerCourse(slug));
  const ids = new Set(flat.map((t) => t.id));
  const byTitle = new Map(flat.map((t) => [norm(t.title), t.id]));
  const titleToId = (title: string) => {
    const key = norm(title);
    if (byTitle.has(key)) return byTitle.get(key);
    // "Assignment 02: Persona draft" on a date row, "Persona draft" in the outline.
    for (const [t, id] of byTitle) if (t.length > 6 && (key.includes(t) || t.includes(key))) return id;
    return undefined;
  };
  return {
    byId: (id: string) => (ids.has(id) ? playerTopicHref(slug, id) : fallback),
    byTitle: (title: string) => {
      const id = titleToId(title);
      return id ? playerTopicHref(slug, id) : fallback;
    },
  };
}
