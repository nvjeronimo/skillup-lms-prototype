import { resumeTopicId } from "@/lib/data";

/**
 * The addresses of a course: its page (`homeUrl` in Open edX) and its player (`resumeUrl`).
 * They read the player's outline only (lib/data, which imports nothing from the platform
 * files), so any data file can use them. Without a topic, the player opens where the course
 * resumes: a course with an outline of its own on its own topic, every other course on the
 * sample topic, under its own address and its own title.
 */
export const coursePageHref = (slug: string) => `/platform/course/${slug}`;
export const coursePlayerHref = (slug: string, topicId: string = resumeTopicId(slug)) =>
  `/course/${slug}/topic/${topicId}`;
export const programPageHref = (slug: string) => `/platform/program/${slug}`;
export const certificatePageHref = (courseSlug: string) => `/platform/certificate/${courseSlug}`;

/** "AI-Driven Content and Brand Communication" → "ai-driven-content-and-brand-communication". */
export const slugify = (title: string) =>
  title
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
