import { getKnowledge } from "./knowledge";
import { STEPS, stepAction } from "@/lib/first-steps/steps";
import { nextStep } from "./next-step";
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
  /** Whole words or phrases; a plain word alone is not enough where it is common in other questions. */
  keywords: RegExp;
  /** `null` when the intent does not apply here (a summary with no topic): the fallback answers. */
  reply: (snapshot: LearnerSnapshot) => Reply;
}

const lines = (items: string[]) => items.map((item) => `• ${item}`).join("\n");
const fromKnowledge = (id: string, actionIds?: string[]): Reply => ({ text: getKnowledge(id).answer, actionIds });

/** In matching order: the first intent that matches the question and applies on this page answers it. */
const INTENTS: Intent[] = [
  {
    suggestion: "How do I get started?",
    keywords: /\b(get started|getting started|first steps?|where do i (start|begin))\b/,
    reply: (snapshot) => {
      const left = snapshot.firstSteps?.left;
      if (!left?.length) return null;
      // The button of the first step that has somewhere to go.
      const target = STEPS.filter((step) => left.includes(step.label))
        .map((step) => stepAction(step.id, snapshot))
        .find((action): action is ActionEntry => action !== null && action !== "ask");
      return {
        text: `You have ${left.length} first ${left.length === 1 ? "step" : "steps"} left:\n${lines(left)}`,
        actionIds: target ? [target.id] : [],
      };
    },
  },
  {
    suggestion: "Summarise this topic",
    keywords: /\b(summar\w*|takeaways?|recap)\b/,
    reply: ({ topic }) =>
      topic && topic.takeaways.length
        ? { text: `The key points of "${topic.title}":\n${lines(topic.takeaways)}` }
        : null,
  },
  {
    suggestion: "What is due this week?",
    keywords: /\b(due|deadlines?|assignments?)\b/,
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
    keywords: /\b(what (should|do|can) i do|what now|do next|next step)\b/,
    reply: (snapshot) => {
      const next = nextStep(snapshot);
      return next
        ? { text: next.text, actionIds: [next.actionId] }
        : { text: "You are up to date: nothing is due and every course is complete.", actionIds: ["my-learning"] };
    },
  },
  {
    suggestion: "Where did I stop?",
    keywords: /\b(where (did|was) i|resume|left off|pick up where)\b/,
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
    keywords: /\b(progress|how far|percent\w*)\b/,
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
    keywords: /\bcertificates?\b/,
    reply: ({ actions }) =>
      fromKnowledge(
        "certificate",
        actions.filter((a) => a.id.startsWith("certificate:")).map((a) => a.id),
      ),
  },
  {
    suggestion: "How do I complete this topic?",
    keywords: /\b(complete|completed|completing|mark as)\b/,
    reply: ({ topic }) => fromKnowledge(topic?.completesByHand ? "completion-by-hand" : "completion"),
  },
  {
    suggestion: "Which courses am I enrolled in?",
    keywords: /\b(enrolled|my courses|which courses)\b/,
    reply: ({ courses }) => ({
      text: `You are enrolled in ${courses.length} courses:\n${lines(
        courses.map((c) => `${c.title} (${statusLabel(c)})`),
      )}`,
      actionIds: ["my-learning"],
    }),
  },
  {
    suggestion: "Where are my saved topics?",
    keywords: /\b(saved|bookmarks?|bookmarked)\b/,
    reply: () => fromKnowledge("saved"),
  },
  { suggestion: "How do notes work?", keywords: /\bnotes?\b/, reply: () => fromKnowledge("notes") },
  { suggestion: "Why is my lab not complete?", keywords: /\blabs?\b/, reply: () => fromKnowledge("lab") },
  {
    suggestion: "What can you do?",
    keywords: /\b(help|what can you)\b/,
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

/** The intents a question may mean, best first: its exact suggestion, then every keyword match. */
function findIntents(question: string): Intent[] {
  const q = question.trim().toLowerCase();
  if (!q) return [];
  const exact = INTENTS.filter((i) => i.suggestion.toLowerCase() === q);
  return exact.length ? exact : INTENTS.filter((i) => i.keywords.test(q));
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
  // An intent that does not apply here (a summary with no topic) hands over to the next match.
  let reply: Reply = null;
  for (const intent of findIntents(question)) {
    reply = intent.reply(snapshot);
    if (reply) break;
  }
  if (!reply) {
    return { text: `${FALLBACK_LEAD}\n${lines(suggestionsFor(snapshot))}`, actions: [], source: "script" };
  }
  const actions = (reply.actionIds ?? [])
    .map((id) => snapshot.actions.find((a) => a.id === id))
    .filter((a): a is ActionEntry => Boolean(a));
  return { text: reply.text, actions, source: "script" };
}
