import { knowledgeText } from "./knowledge";
import type { ActionEntry, Answer, LearnerSnapshot } from "./types";

/**
 * The contract with the model, shared by the route (the prompt) and the browser (reading the
 * reply). The model never writes a button: it ends its reply with `ACTIONS: id, id`, and each
 * id is looked up in the snapshot. One that is not there is dropped.
 */

const MARKER = "ACTIONS:";
// A marker line, however the model decorates it: "ACTIONS: a", "**Actions:** a", "- ACTIONS: a".
const ACTIONS_LINE = /^\W*actions:\W*(.*)$/i;
const MAX_ACTIONS = 3;

export function buildSystemPrompt(snapshot: LearnerSnapshot): string {
  const { actions, ...facts } = snapshot;
  return [
    "You are the assistant of SkillUp, an online learning platform. You answer one learner's questions about the platform and about their own courses and programs.",
    [
      "Rules:",
      "- Answer only from the platform rules and the learner data below. If the answer is not there, say you do not know and suggest the Services section.",
      "- At most 90 words. Plain English. No markdown headings or tables; a short list with a bullet per line is fine.",
      "- You only answer. Never say you did, changed, saved, submitted or completed anything.",
      `- If a button would help, end with one last line: "${MARKER} id, id", using only ids from the button list, at most ${MAX_ACTIONS}. Otherwise write no such line.`,
    ].join("\n"),
    `Platform rules:\n${knowledgeText()}`,
    `Learner data (JSON):\n${JSON.stringify(facts)}`,
    `Buttons (id — label):\n${actions.map((a) => `${a.id} — ${a.label}`).join("\n")}`,
  ].join("\n\n");
}

/** The model's whole reply, as an answer. Marker lines never show; only a last one gives buttons. */
export function parseModelReply(raw: string, actions: ActionEntry[]): Answer {
  const rows = raw.trimEnd().split("\n");
  const match = ACTIONS_LINE.exec(rows[rows.length - 1].trim());
  const text = rows
    .filter((row) => !ACTIONS_LINE.test(row.trim()))
    .join("\n")
    .trim();
  if (!match) return { text, actions: [], source: "model" };
  const ids = Array.from(new Set(match[1].split(",").map((id) => id.replace(/^[^\w]+|[^\w]+$/g, ""))));
  const picked = ids
    .map((id) => actions.find((a) => a.id === id))
    .filter((a): a is ActionEntry => Boolean(a))
    .slice(0, MAX_ACTIONS);
  return { text, actions: picked, source: "model" };
}

/** What to show of a reply still arriving: no marker line, and no last line that may become one. */
export function visibleText(partial: string): string {
  const rows = partial.split("\n");
  const last = (rows.pop() ?? "").trim().replace(/^\W+/, "").toLowerCase();
  const mayBeMarker = last !== "" && (last.startsWith("actions:") || "actions:".startsWith(last));
  const shown = rows.filter((row) => !ACTIONS_LINE.test(row.trim()));
  if (!mayBeMarker) shown.push(partial.slice(partial.lastIndexOf("\n") + 1));
  return shown.join("\n").trimEnd();
}
