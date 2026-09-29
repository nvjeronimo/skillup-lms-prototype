/**
 * /lab/pages — alternative directions for the three learner pages, built in the SkillUp DS
 * (Montserrat, sko-* tokens, one SKO accent). Each option is a different idea, not a restyle.
 */
export type PageKey = "today" | "plans" | "course";
export type OptionKey = "a" | "b" | "c" | "d";

export interface PageOption {
  key: OptionKey;
  name: string;
  /** One sentence: the idea, what the page puts first. */
  idea: string;
}

export const PAGES: Record<PageKey, { label: string; job: string; options: PageOption[] }> = {
  today: {
    label: "Today",
    job: "Start today's learning",
    options: [
      { key: "a", name: "Focus", idea: "One session card in the middle of the page and nothing else; the rest of the week is one line under it." },
      { key: "b", name: "Agenda", idea: "The week as a calm day-by-day list, today open with its Start button, other days folded to one line." },
      { key: "c", name: "Resume shelf", idea: "Continue where you left off: every course in progress as one row with its next step and progress." },
      { key: "d", name: "Checklist", idea: "A short written brief and this week's sessions as a checklist you tick through." },
    ],
  },
  plans: {
    label: "Plans",
    job: "Pick a course to continue",
    options: [
      { key: "a", name: "Progress list", idea: "One list, one row per course: title, progress bar, next step, one button." },
      { key: "b", name: "Course cards", idea: "A two-column grid of equal cards, each with a coloured course tile, progress and one action." },
      { key: "c", name: "Tabs", idea: "In progress / Not started / Finished as tabs, so only one short list is on screen." },
      { key: "d", name: "Up next", idea: "The course to continue first as a large block; everything else as a compact list below." },
    ],
  },
  course: {
    label: "Course plan",
    job: "Continue the course and see what is left",
    options: [
      { key: "a", name: "Syllabus", idea: "Every module and topic visible as a numbered syllabus, with a Continue panel that stays in view." },
      { key: "b", name: "Path", idea: "A vertical path of modules: done ones collapsed, the current one open, later ones waiting." },
      { key: "c", name: "Overview + tabs", idea: "A course header with progress, then tabs: Plan, About, Resources." },
      { key: "d", name: "This module", idea: "Only the current module, large; the other modules as a short list to switch to." },
    ],
  },
};

export const PAGE_KEYS: PageKey[] = ["today", "plans", "course"];
