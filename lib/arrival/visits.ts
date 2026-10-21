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

/**
 * The arrival page of a player address: the topic itself (`/course/<slug>/topic/<id>`), so its
 * Notes and Downloads tabs are the same visit; null outside a topic.
 */
export function topicArrivalPath(path: string): string | null {
  const m = /^\/course\/[^/?#]+\/topic\/[^/?#]+/.exec(path);
  return m ? m[0] : null;
}

/**
 * The course of the player (its shell: top bar and sidebar rings): `/course/<slug>`. Its first
 * visit in the session is the first topic opened in it; later topics are revisits of the course
 * even when they are first visits of their own body.
 */
export function courseArrivalPath(slug: string): string {
  return `/course/${slug}`;
}

/** Whether `key` is a first visit, and the visited set with it marked (unchanged on a revisit). */
export function decideVisit(key: string, visited: Set<string>): { first: boolean; visited: Set<string> } {
  const first = isFirstVisit(key, visited);
  return { first, visited: first ? markVisited(key, visited) : visited };
}
