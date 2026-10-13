/**
 * What the assistant knows and says (docs/superpowers/specs/2026-10-13-assistant-design.md).
 * One snapshot of the learner feeds both the scripted answers and the model.
 */

/** Where the assistant was opened. `platform` is any other platform page (a certificate, the index). */
export type PageContext =
  | { kind: "dashboard" }
  | { kind: "my-learning" }
  | { kind: "platform" }
  | { kind: "program"; slug: string }
  | { kind: "course"; slug: string }
  | { kind: "player"; courseSlug: string; topicId: string };

/** A place an answer may point to. Answers pick these by id: they never write a label or an address. */
export interface ActionEntry {
  id: string;
  label: string;
  href: string;
}

export interface LearnerSnapshot {
  learner: { firstName: string; role: string };
  page: PageContext;
  programs: {
    slug: string;
    title: string;
    percent: number;
    /** "1 of 5 courses complete", as My Learning writes it. */
    coursesLine: string;
    upNext?: string;
    href?: string;
  }[];
  courses: {
    slug: string;
    title: string;
    status: "not-started" | "in-progress" | "completed";
    percent: number;
    upNext?: string;
    playerHref?: string;
    href?: string;
  }[];
  due: { id: string; title: string; meta: string; when: string; href: string }[];
  /** Only in the player, and only for a topic the course really has. */
  topic?: {
    id: string;
    title: string;
    type: string;
    module: string;
    course: string;
    completed: boolean;
    completesByHand: boolean;
    takeaways: string[];
  };
  actions: ActionEntry[];
}

export interface Answer {
  text: string;
  actions: ActionEntry[];
  source: "script" | "model";
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  actions?: ActionEntry[];
  source?: "script" | "model";
}
