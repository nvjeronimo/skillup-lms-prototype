import { getKnowledge } from "./knowledge";
import type { ActionEntry, Answer, LearnerSnapshot } from "./types";

/**
 * The assistant with no model behind it: a fixed set of questions, answered from the snapshot
 * and the platform's rules. The default of the public prototype, and what a question falls
 * back to when the model cannot be reached. It never invents an answer.
 */

export const FALLBACK_LEAD = "This prototype answers a fixed set of questions. Try one of these:";

type Reply = { text: string; actionIds?: string[] } | null;

interface Intent {
  suggestion: string;
  keywords: string[];
  /** `null` when the intent does not apply here (a summary with no topic): the fallback answers. */
  reply: (snapshot: LearnerSnapshot) => Reply;
}

const lines = (items: string[]) => items.map((item) => `• ${item}`).join("\n");
const fromKnowledge = (id: string, actionIds?: string[]): Reply => ({ text: getKnowledge(id).answer, actionIds });
const isToday = (when: string) => when === "Today" || when === "Tonight";

/** In matching order: the first intent whose keyword the question contains answers it. */
const INTENTS: Intent[] = [
  {
    suggestion: "Summarise this topic",
    keywords: ["summar", "takeaway", "recap"],
    reply: ({ topic }) =>
      topic && topic.takeaways.length
        ? { text: `The key points of "${topic.title}":\n${lines(topic.takeaways)}` }
        : null,
  },
  {
    suggestion: "What is due this week?",
    keywords: ["due", "deadline", "assignment"],
    reply: ({ due }) =>
      due.length
        ? {
            text: `You have ${due.length} ${due.length === 1 ? "deadline" : "deadlines"} coming up:\n${lines(
              due.map((d) => `${d.title} (${d.when})`),
            )}`,
            actionIds: due.map((d) => `due:${d.id}`),
          }
        : { text: "Nothing is due at the moment.", actionIds: ["dashboard"] },
  },
  {
    suggestion: "What should I do next?",
    keywords: ["next", "what should", "what now"],
    reply: ({ due, courses }) => {
      const urgent = due.find((d) => isToday(d.when));
      if (urgent) {
        return {
          text: `"${urgent.title}" is due ${urgent.when.toLowerCase()}. Start there.`,
          actionIds: [`due:${urgent.id}`],
        };
      }
      const current = courses.find((c) => c.status === "in-progress");
      if (current) {
        return {
          text: `Carry on with ${current.title}${current.upNext ? `: "${current.upNext}" is up next` : ""}.`,
          actionIds: [`resume:${current.slug}`],
        };
      }
      const fresh = courses.find((c) => c.status === "not-started");
      if (fresh) return { text: `Start ${fresh.title}.`, actionIds: [`resume:${fresh.slug}`] };
      return { text: "You are up to date: nothing is due and every course is complete.", actionIds: ["my-learning"] };
    },
  },
  {
    suggestion: "Where did I stop?",
    keywords: ["stop", "resume", "continue", "left off"],
    reply: ({ courses }) => {
      const current = courses.find((c) => c.status === "in-progress");
      if (!current) return { text: "You have no course in progress.", actionIds: ["my-learning"] };
      return {
        text: `You are ${current.percent}% through ${current.title}${
          current.upNext ? `. Up next: "${current.upNext}"` : ""
        }.`,
        actionIds: [`resume:${current.slug}`],
      };
    },
  },
  {
    suggestion: "How far am I in my program?",
    keywords: ["progress", "how far", "percent"],
    reply: ({ programs }) =>
      programs.length
        ? {
            text: lines(programs.map((p) => `${p.title}: ${p.percent}% (${p.coursesLine})`)),
            actionIds: programs.map((p) => `program:${p.slug}`),
          }
        : { text: "You are not enrolled in a program.", actionIds: ["my-learning"] },
  },
  {
    suggestion: "How do I get my certificate?",
    keywords: ["certificate"],
    reply: ({ actions }) =>
      fromKnowledge(
        "certificate",
        actions.filter((a) => a.id.startsWith("certificate:")).map((a) => a.id),
      ),
  },
  {
    suggestion: "How do I complete this topic?",
    keywords: ["complete", "mark as"],
    reply: ({ topic }) => fromKnowledge(topic?.completesByHand ? "completion-by-hand" : "completion"),
  },
  {
    suggestion: "Which courses am I enrolled in?",
    keywords: ["enrol", "my courses", "which courses"],
    reply: ({ courses }) => ({
      text: `You are enrolled in ${courses.length} courses:\n${lines(
        courses.map((c) => `${c.title} (${statusLabel(c)})`),
      )}`,
      actionIds: ["my-learning"],
    }),
  },
  {
    suggestion: "Where are my saved topics?",
    keywords: ["saved", "bookmark"],
    reply: () => fromKnowledge("saved"),
  },
  { suggestion: "How do notes work?", keywords: ["note"], reply: () => fromKnowledge("notes") },
  { suggestion: "Why is my lab not complete?", keywords: ["lab"], reply: () => fromKnowledge("lab") },
  {
    suggestion: "What can you do?",
    keywords: ["help", "what can you"],
    reply: (snapshot) => ({
      text: `I can answer questions about the platform and your courses. For example:\n${lines(
        suggestionsFor(snapshot).filter((s) => s !== "What can you do?"),
      )}`,
    }),
  },
];

function statusLabel(c: LearnerSnapshot["courses"][number]): string {
  if (c.status === "completed") return "complete";
  return c.status === "in-progress" ? `${c.percent}%` : "not started";
}

const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

function findIntent(question: string): Intent | undefined {
  const q = question.trim().toLowerCase();
  if (!q) return undefined;
  return (
    INTENTS.find((i) => i.suggestion.toLowerCase() === q) ??
    // A keyword counts at the start of a word only: "lab" is not in "available".
    INTENTS.find((i) => i.keywords.some((k) => new RegExp(`\\b${escapeRegExp(k)}`).test(q)))
  );
}

/** Four questions for the page, each one the script can answer there. */
export function suggestionsFor(snapshot: LearnerSnapshot): string[] {
  if (snapshot.topic) {
    return ["Summarise this topic", "How do I complete this topic?", "What is due this week?", "What can you do?"];
  }
  if (snapshot.page.kind === "program") {
    return [
      "How far am I in my program?",
      "What should I do next?",
      "How do I get my certificate?",
      "What is due this week?",
    ];
  }
  return ["What is due this week?", "Where did I stop?", "What should I do next?", "How do I get my certificate?"];
}

export function answerScripted(question: string, snapshot: LearnerSnapshot): Answer {
  const reply = findIntent(question)?.reply(snapshot);
  if (!reply) {
    return { text: `${FALLBACK_LEAD}\n${lines(suggestionsFor(snapshot))}`, actions: [], source: "script" };
  }
  const actions = (reply.actionIds ?? [])
    .map((id) => snapshot.actions.find((a) => a.id === id))
    .filter((a): a is ActionEntry => Boolean(a));
  return { text: reply.text, actions, source: "script" };
}
