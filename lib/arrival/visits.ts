/**
 * First visit of a page in this session (motion-matrix §7.9, decision 2): the skeleton,
 * the cascade and the counters play once per page per session, like a real API with a
 * client cache. The visited pages live in sessionStorage under VISITED_KEY as a JSON list
 * of pathnames (no query: a filter in the address is the same page).
 */
export const VISITED_KEY = "sk-arrival-visited";

/** The page a path belongs to: decoded, no query, no hash, no trailing slash ("/" stays). */
export function arrivalKey(path: string): string {
  let bare = path.split(/[?#]/)[0].replace(/\/+$/, "");
  // Decoded, so "/caf%C3%A9" and "/café" are one page (the pre-paint script decodes too).
  try {
    bare = decodeURI(bare);
  } catch {
    /* malformed escape: keep the path as written */
  }
  return bare || "/";
}

/** The visited set from its storage text; empty for nothing or junk. */
export function parseVisited(raw: string | null): Set<string> {
  if (!raw) return new Set();
  try {
    const list: unknown = JSON.parse(raw);
    return Array.isArray(list) ? new Set(list.filter((p): p is string => typeof p === "string")) : new Set();
  } catch {
    return new Set();
  }
}

export function serializeVisited(visited: Set<string>): string {
  return JSON.stringify([...visited]);
}

export function isFirstVisit(path: string, visited: Set<string>): boolean {
  return !visited.has(arrivalKey(path));
}

/** A new set with the path's page added. */
export function markVisited(path: string, visited: Set<string>): Set<string> {
  return new Set(visited).add(arrivalKey(path));
}
