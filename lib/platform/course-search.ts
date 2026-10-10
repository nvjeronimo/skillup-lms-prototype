/**
 * Content search of a course (feature 33; Figma section 6837:27914; metadata map §39).
 *
 * In the product the request is `POST {LMS}/search/{course_id}` with `search_string`,
 * `page_size` 20 and `page_index`; each result brings `content_type`, `display_name`, an
 * `excerpt` with the matches marked, `location[]` and `url`; the page brings `total` and
 * `access_denied_count`. The prototype has no index: it filters the course's own outline,
 * every lesson and topic title plus what the player shows in each topic, so a result is
 * always a real topic and opens it. Until 10 Oct 2026 Six Sigma searched a separate sample
 * written to match the screens ("control chart", 20 of 29); the screens keep those figures.
 */
import { getActivity, getArticle, getAssignmentBrief, getLab, getLessonPage, getOra, getPodcast, getQuiz, getTranscript } from "@/lib/content";
import { COURSES } from "@/lib/courses";
import { playerTopicHref } from "@/lib/courses/outline";
import type { CourseEntry } from "@/lib/courses/types";
import { DEFAULT_COURSE_SLUG, flatTopics, getCourseBySlug } from "@/lib/data";
import type { Course, FlatTopic, Topic, TopicType } from "@/lib/types";

/** `content_type` as the screens name it: Text, Video, CAPA (Quiz), Sequence (Lesson). */
export type SearchContentType = "Text" | "Video" | "Quiz" | "Lesson";

export interface SearchDoc {
  id: string;
  type: SearchContentType;
  title: string;
  /** The text the search looks in besides the title. A Lesson (a sequence) has none. */
  text?: string;
  /** `location[]`: module › lesson › topic. */
  location: string[];
  /** `url`: the topic the result opens. Without it the result opens where the course resumes. */
  href?: string;
  /** The learner cannot open it yet: left out of the results and counted. */
  locked?: boolean;
}

export interface SearchResult extends SearchDoc {
  /** How many times the words were found in the title and the text. */
  matches: number;
}

export interface SearchPage {
  results: SearchResult[];
  total: number;
  /** Results in content the learner cannot open: removed and counted (`access_denied_count`). */
  accessDenied: number;
}

export const SEARCH_PAGE_SIZE = 20;
/** Typing this word makes the request fail, so the error state can be shown in a session. */
export const SEARCH_FAIL_WORD = "fail";

const QUIZ_TYPES: TopicType[] = ["Quiz", "Practice Assignment", "Graded Assignment"];
const typeOf = (topic: Topic): SearchContentType =>
  topic.type === "Video" || topic.type === "VILT-Recording" ? "Video" : QUIZ_TYPES.includes(topic.type) ? "Quiz" : "Text";

/** Every sentence in a piece of content: the strings of an object, whatever its shape. */
function sentences(value: unknown): string[] {
  if (typeof value === "string") return value.includes(" ") ? [value] : [];
  if (Array.isArray(value)) return value.flatMap(sentences);
  if (value && typeof value === "object") return Object.values(value).flatMap(sentences);
  return [];
}

/**
 * What a course with content of its own wrote for a topic. A topic without an entry shows
 * neutral wording in the player, the same on every topic, so it is searched by title only.
 */
function writtenBody(topic: Topic, { content }: CourseEntry): unknown[] {
  const id = topic.id;
  return [
    (topic.transcript ?? []).map((line) => line.text),
    content.articles[id],
    (content.quizzes[id] ?? []).map((q) => q.question),
    content.assignments[id],
    content.ora[id]?.brief,
    content.labs?.[id],
    content.podcasts?.[id],
    content.lessonPages?.[id],
  ];
}

/** What the player shows for a topic of the original sample (Six Sigma and the demo courses). */
function sampleBody(topic: FlatTopic): unknown[] {
  switch (topic.type) {
    case "Video":
    case "VILT-Recording":
      return [getTranscript(topic).map((line) => line.text)];
    case "Reading":
      return [getArticle(topic)];
    case "Quiz":
    case "Practice Assignment":
      return [getQuiz(topic).map((q) => q.question)];
    case "Graded Assignment":
      return [getAssignmentBrief(topic)];
    case "Activity":
      return [getActivity(topic)];
    case "Lab":
      return [getLab(topic)];
    case "Podcast":
      return [getPodcast(topic)];
    case "Lesson Page":
      return [getLessonPage(topic)];
    case "Peer-graded":
    case "Project":
      return [getOra(topic).brief];
    default:
      return [];
  }
}

/**
 * A course as search content, in course order: each lesson, then its topics. Every result is
 * a real topic of the player and opens it, on every course (asked by Nelson on 10 Oct 2026).
 */
function docsOf(outline: Course): SearchDoc[] {
  const entry = COURSES.find((c) => c.outline.slug === outline.slug);
  const docs: SearchDoc[] = [];
  let lesson = "";
  for (const topic of flatTopics(outline)) {
    const href = playerTopicHref(outline.slug, topic.id);
    const key = `${topic.moduleId}/${topic.lessonLabel ?? ""}`;
    if (topic.lessonLabel && key !== lesson) {
      docs.push({ id: `lesson:${key}`, type: "Lesson", title: topic.lessonLabel, location: [topic.moduleTitle], href, locked: topic.locked });
    }
    lesson = key;
    const text = sentences(entry ? writtenBody(topic, entry) : sampleBody(topic)).join(" ");
    docs.push({
      id: topic.id,
      type: typeOf(topic),
      title: topic.title,
      text: text || undefined,
      location: [topic.moduleTitle, topic.lessonLabel, topic.title].filter((part): part is string => Boolean(part)),
      href,
      locked: topic.locked,
    });
  }
  return docs;
}

const DOCS = new Map<string, SearchDoc[]>();
function docsFor(slug?: string): SearchDoc[] {
  const outline = getCourseBySlug(slug ?? DEFAULT_COURSE_SLUG);
  if (!DOCS.has(outline.slug)) DOCS.set(outline.slug, docsOf(outline));
  return DOCS.get(outline.slug)!;
}

const STOP = new Set(["about", "after", "before", "between", "check", "course", "first", "graded", "introduction", "module", "practice", "their", "these", "through", "using", "where", "which", "with", "your", "assignment", "final", "project", "review"]);

/**
 * Prototype only: searches known to give each state on this course, offered when the field
 * is empty so a reviewer does not have to guess. Worked out from the course: the two words
 * its titles use most, one word found only in a topic body, then no results and the failure.
 */
export function searchSamples(slug?: string): { query: string; gives: string }[] {
  const docs = docsFor(slug);
  const words = (text: string) => text.toLowerCase().match(/[a-z]{5,}/g) ?? [];
  const inTitles = new Map<string, number>();
  for (const d of docs) for (const w of new Set(words(d.title))) if (!STOP.has(w)) inTitles.set(w, (inTitles.get(w) ?? 0) + 1);
  const common = [...inTitles.entries()].sort((a, b) => b[1] - a[1]).slice(0, 2).map(([w]) => w);
  const bodyOnly = docs.flatMap((d) => words(d.text ?? "")).find((w) => w.length >= 7 && !STOP.has(w) && !inTitles.has(w));
  const count = (q: string) => {
    const n = searchCourse(q, 0, slug).total;
    return `${n} ${n === 1 ? "result" : "results"}`;
  };
  return [
    ...common.map((query) => ({ query, gives: count(query) })),
    ...(bodyOnly ? [{ query: bodyOnly, gives: `${count(bodyOnly)}, in a topic body` }] : []),
    { query: "kanbam", gives: "no results" },
    { query: SEARCH_FAIL_WORD, gives: "the search fails" },
  ];
}

const escape = (word: string) => word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** The words of the search string, as a pattern that also finds the plural. */
export function searchPattern(query: string): RegExp | null {
  const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (words.length === 0) return null;
  return new RegExp(words.map(escape).join("\\s+") + "s?", "gi");
}

function countMatches(text: string | undefined, pattern: RegExp): number {
  if (!text) return 0;
  return (text.match(pattern) ?? []).length;
}

/** Every result for the search string, in relevance order. */
function findAll(query: string, slug?: string): SearchResult[] {
  const pattern = searchPattern(query);
  if (!pattern) return [];
  return docsFor(slug).map((d) => ({ ...d, matches: countMatches(d.title, pattern) + countMatches(d.text, pattern) })).filter(
    (r) => r.matches > 0,
  );
}

/** One page of results, as `page_index` 0, 1, … of the platform's search. */
export function searchCourse(query: string, pageIndex: number, slug?: string): SearchPage {
  const found = findAll(query, slug);
  // Results in topics the learner cannot open yet are left out and counted (`access_denied_count`).
  const all = found.filter((r) => !r.locked);
  const start = pageIndex * SEARCH_PAGE_SIZE;
  return {
    results: all.slice(start, start + SEARCH_PAGE_SIZE),
    total: all.length,
    accessDenied: found.length - all.length,
  };
}

/** The part of the text around the first match, as the platform's `excerpt` does. */
export function excerptOf(text: string, query: string): string {
  const pattern = searchPattern(query);
  const at = pattern ? text.search(pattern) : -1;
  if (at < 0) return text;
  const from = Math.max(0, text.lastIndexOf(" ", Math.max(0, at - 40)));
  const to = Math.min(text.length, at + 110);
  const end = to < text.length ? text.lastIndexOf(" ", to) : to;
  let part = text.slice(from, end > at ? end : to).trim();
  // Stop at the end of the sentence the match is in, when it ends inside the window.
  const local = part.search(pattern!);
  const stop = part.indexOf(". ", local < 0 ? 0 : local);
  if (stop > 0) part = part.slice(0, stop);
  part = part.charAt(0).toLowerCase() + part.slice(1);
  return `…${part.replace(/[.,;:]$/, "")}…`;
}
