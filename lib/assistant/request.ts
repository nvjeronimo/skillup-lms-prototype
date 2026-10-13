import type { ActionEntry, LearnerSnapshot } from "./types";

/**
 * What the model route accepts. Everything here ends up in a prompt that costs money, so
 * every part has a size: the route is public and must not become a general-purpose proxy.
 */
export const MAX_QUESTION = 500;
export const MAX_ANSWER = 4000;
export const MAX_TURNS = 10;
/** The real snapshot is about a quarter of this. */
export const MAX_SNAPSHOT_BYTES = 40_000;

export interface Turn {
  role: "user" | "assistant";
  text: string;
}

export type ParsedRequest =
  | { ok: true; turns: Turn[]; snapshot: LearnerSnapshot }
  | { ok: false; error: string };

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null;

function isTurn(value: unknown): value is Turn {
  return (
    isRecord(value) && (value.role === "user" || value.role === "assistant") && typeof value.text === "string"
  );
}

export function isAction(value: unknown): value is ActionEntry {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.label === "string" &&
    typeof value.href === "string" &&
    value.href.startsWith("/")
  );
}

function isSnapshot(value: unknown): value is LearnerSnapshot {
  if (!isRecord(value)) return false;
  const { learner, actions, courses, programs, due, page } = value;
  return (
    isRecord(learner) &&
    typeof learner.firstName === "string" &&
    typeof learner.role === "string" &&
    isRecord(page) &&
    Array.isArray(actions) &&
    actions.every(isAction) &&
    [courses, programs, due].every((list) => Array.isArray(list) && list.every(isRecord)) &&
    JSON.stringify(value).length <= MAX_SNAPSHOT_BYTES
  );
}

export function parseRequest(body: unknown): ParsedRequest {
  if (!isRecord(body)) return { ok: false, error: "The request needs messages and a snapshot." };
  const { messages, snapshot } = body;
  if (!Array.isArray(messages) || !messages.every(isTurn)) return { ok: false, error: "The messages are not valid." };
  if (!isSnapshot(snapshot)) return { ok: false, error: "The snapshot is missing, malformed or too large." };

  const turns = messages.slice(-MAX_TURNS).filter((m) => m.text.trim() !== "");
  // The conversation the model sees starts with the learner and ends with their question.
  while (turns.length && turns[0].role !== "user") turns.shift();
  const question = turns[turns.length - 1];
  if (!question || question.role !== "user") return { ok: false, error: "The last message must be a question." };
  if (turns.some((m) => m.text.length > (m.role === "user" ? MAX_QUESTION : MAX_ANSWER))) {
    return { ok: false, error: "A message is too long." };
  }
  return { ok: true, turns: turns.map(({ role, text }) => ({ role, text })), snapshot };
}
