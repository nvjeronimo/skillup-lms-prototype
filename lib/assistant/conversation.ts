import { parseModelReply } from "./model-reply";
import { answerScripted } from "./scripted";
import type { Answer, ChatMessage, LearnerSnapshot } from "./types";

/** The conversation is kept for the tab (session storage), not in the persisted demo store. */
export const STORAGE_KEY = "sk-assistant-chat";

function isMessage(value: unknown): value is ChatMessage {
  if (typeof value !== "object" || value === null) return false;
  const m = value as Record<string, unknown>;
  return typeof m.id === "string" && (m.role === "user" || m.role === "assistant") && typeof m.text === "string";
}

/** Blocked storage, nothing stored, or anything that is not a list of messages: start empty. */
export function loadMessages(storage: Pick<Storage, "getItem"> | undefined): ChatMessage[] {
  try {
    const parsed: unknown = JSON.parse(storage?.getItem(STORAGE_KEY) ?? "null");
    return Array.isArray(parsed) && parsed.every(isMessage) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveMessages(storage: Pick<Storage, "setItem"> | undefined, messages: ChatMessage[]): void {
  try {
    storage?.setItem(STORAGE_KEY, JSON.stringify(messages));
  } catch {
    /* storage blocked or full: the conversation still works for this visit */
  }
}

/**
 * One question, one answer. With a model, its reply; if the model cannot be reached, refuses
 * or says nothing, the script answers that question instead, so the chat never breaks.
 */
export async function resolveAnswer(opts: {
  question: string;
  snapshot: LearnerSnapshot;
  mode: "script" | "model";
  askModel: (onDelta: (shown: string) => void) => Promise<string>;
  onDelta?: (shown: string) => void;
}): Promise<Answer> {
  const { question, snapshot, mode, askModel, onDelta = () => {} } = opts;
  if (mode === "model") {
    try {
      const answer = parseModelReply(await askModel(onDelta), snapshot.actions);
      if (answer.text !== "") return answer;
    } catch {
      /* fall through to the script */
    }
  }
  return answerScripted(question, snapshot);
}
