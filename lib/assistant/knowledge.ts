/**
 * The platform's rules, as the assistant states them. Hand-written from the product decisions
 * (00-decisions 001, 004, 006, 009), LMS-HANDOFF/platform-navigation-flow.md and
 * LMS-HANDOFF/lab-third-party-platforms.md §4, and from what the prototype's screens do where
 * no decision speaks (`source: "prototype"`). It goes stale when one of them changes: update
 * the entry with the decision.
 */
export interface KnowledgeEntry {
  id: string;
  question: string;
  answer: string;
  source: string;
}

export const KNOWLEDGE: KnowledgeEntry[] = [
  {
    id: "completion",
    question: "How does a topic get completed?",
    answer:
      "Quizzes, assignments and open responses complete when you submit them and, where they are graded, once the grade is in. Readings, lesson pages, labs, activities, videos and podcasts are completed by you, with Mark as Complete at the end of the content.",
    source: "lab-third-party-platforms.md §4",
  },
  {
    id: "completion-by-hand",
    question: "How do I complete this topic?",
    answer:
      "Use Mark as Complete at the end of the content. If you press Next without it, a dialog asks whether to mark the topic complete before moving on; you can also move on and come back later.",
    source: "lab-third-party-platforms.md §4",
  },
  {
    id: "certificate",
    question: "How do I get my certificate?",
    answer:
      "A course certificate is issued when you complete the course with a passing grade. Once issued, it appears on the course page and in the Certificates tab of its program, where you can open it.",
    source: "prototype",
  },
  {
    id: "program-certificate",
    question: "How do I get the program certificate?",
    answer:
      "The program certificate is issued when every course of the program is complete. The Certificates tab of the program page shows which course certificates you already hold and which are still to come.",
    source: "prototype",
  },
  {
    id: "saved",
    question: "Where are my saved topics?",
    answer:
      "Saving a topic is a marker to come back later: it does not change the topic's progress. Your saved topics and your notes are together in the Saved panel, opened with the bookmark icon in the course player's top bar.",
    source: "decision 009",
  },
  {
    id: "notes",
    question: "How do notes work?",
    answer:
      "On videos, recordings and podcasts a note is attached to a line of the transcript, so opening the note takes you back to that moment. You write notes from the transcript and find them again in the Notes tab of the topic and in the Saved panel.",
    source: "decision 001",
  },
  {
    id: "lab",
    question: "Why is my lab not complete?",
    answer:
      "A lab on a partner's platform opens in a new tab and nothing comes back from the partner, so opening it does not complete it. When you have finished the lab there, come back and use Mark as Complete.",
    source: "lab-third-party-platforms.md §4",
  },
  {
    id: "duration",
    question: "What does approx. mean on a duration?",
    answer:
      "Readings, labs, activities and projects show an approximate time, marked approx., because how long they take depends on you. Videos, recordings, live sessions and timed quizzes show their exact length.",
    source: "decision 004",
  },
  {
    id: "navigation",
    question: "How do I move around?",
    answer:
      "A course title opens the course page; the Resume or Start button opens the player where you left off. Closing the player takes you back to the course page. In the player, Previous and Next at the bottom move between topics.",
    source: "platform-navigation-flow.md",
  },
  {
    id: "progress",
    question: "How is my progress counted?",
    answer:
      "A course's progress is the share of its topics you have completed. A program's progress is the number of its courses you have completed. Both are shown on My Learning and on the course and program pages.",
    source: "prototype",
  },
  {
    id: "due-dates",
    question: "Where do I see what is due?",
    answer:
      "The Dashboard lists your upcoming deadlines across all your courses, the nearest first. Each course page also has a Dates tab with that course's own deadlines.",
    source: "prototype",
  },
  {
    id: "quiz-attempts",
    question: "How many attempts do I get on a quiz?",
    answer:
      "It depends on the quiz: each one states its number of attempts before you start, and how many you have left once you have begun. A timed exam gives one attempt unless it says otherwise.",
    source: "prototype",
  },
  {
    id: "status-badges",
    question: "What do the status badges mean?",
    answer:
      "Completed means the topic is done. Under Review means you have submitted graded work and the grade is not released yet. A lock means the topic opens later, on a date or after an earlier topic.",
    source: "prototype",
  },
  {
    id: "open-response",
    question: "How does an open response work?",
    answer:
      "You submit your response, then review the work of your peers, then receive your own grade. The topic completes by itself once the reviews are given and the grade is released; there is nothing to mark by hand.",
    source: "prototype",
  },
  {
    id: "live-sessions",
    question: "How do live sessions work?",
    answer:
      "A live session shows a countdown until it starts, and Join unlocks a few minutes before. After the session its recording replaces the live view, so you can watch it later in the same topic.",
    source: "prototype",
  },
  {
    id: "support",
    question: "What if the assistant does not know?",
    answer:
      "I do not have that information. For anything about your account, payments or technical problems, the Services section in the top bar is the place to ask.",
    source: "prototype",
  },
];

export function getKnowledge(id: string): KnowledgeEntry {
  const entry = KNOWLEDGE.find((k) => k.id === id);
  if (!entry) throw new Error(`assistant knowledge: no entry "${id}"`);
  return entry;
}

/** One block for the model's prompt. */
export function knowledgeText(): string {
  return KNOWLEDGE.map((k) => `Q: ${k.question}\nA: ${k.answer}`).join("\n\n");
}
