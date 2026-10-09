/**
 * The addresses of a course, with no data behind them (so any data file can use them):
 * its page (`homeUrl` in Open edX) and its player (`resumeUrl`).
 * The prototype has one set of player content, so every course opens the same topics under
 * its own address and its own title.
 */
export const DEFAULT_PLAYER_TOPIC = "m3-t1";

export const coursePageHref = (slug: string) => `/platform/course/${slug}`;
export const coursePlayerHref = (slug: string, topicId: string = DEFAULT_PLAYER_TOPIC) =>
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
