import type { PageContext } from "./types";

/** The assistant shows on the platform pages and in the player, nowhere else (not /lab, not /partner). */
export function isAssistantPath(pathname: string): boolean {
  return pathname === "/platform" || pathname.startsWith("/platform/") || pathname.startsWith("/course/");
}

/** The page context, read from the address, so no page has to hand it over. */
export function pageContextFromPath(pathname: string): PageContext {
  const [, root, section, slug, topicId] = pathname.split("/");
  if (root === "course" && section && slug === "topic" && topicId) {
    return { kind: "player", courseSlug: section, topicId };
  }
  if (root === "platform") {
    if (section === "dashboard") return { kind: "dashboard" };
    if (section === "my-learning") return { kind: "my-learning" };
    if (section === "program" && slug) return { kind: "program", slug };
    if (section === "course" && slug) return { kind: "course", slug };
  }
  return { kind: "platform" };
}
