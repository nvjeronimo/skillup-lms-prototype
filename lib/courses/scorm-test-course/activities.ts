import type { CourseActivity } from "@/lib/courses/kit";

/**
 * The four packages, by topic id. Each plays the real package from public/scorm/ through the
 * SCORM 1.2 API of lib/scorm-runtime. What each one reports was read from its own code
 * (4 Nov 2026); the steps say it for the learner and for whoever tests.
 */
export const activities: Record<string, CourseActivity> = {
  "sct-m2-t1": {
    kind: "scorm",
    packageUrl: "/scorm/m4-l2-a1-board-narrative/index.html",
    packageLabel: "SCORM 1.2 package",
    packageSizeLabel: "44 KB",
    intro: "Turn a finance export into a narrative for the board. The package reports incomplete when it starts and completed on its last screen.",
    steps: [
      { title: "Start the activity", detail: "The package sets its status to incomplete as soon as it loads." },
      { title: "Reach the last screen", detail: "On its last screen it reports completed, and the topic completes by itself." },
    ],
  },
  "sct-m3-t1": {
    kind: "scorm",
    packageUrl: "/scorm/m5-l4-a1-reading-the-signal/index.html",
    packageLabel: "SCORM 1.2 package",
    packageSizeLabel: "44 KB",
    intro: "Read the signal in a set of figures. The package reports incomplete when it starts and completed on its last screen.",
    steps: [
      { title: "Start the activity", detail: "The package sets its status to incomplete as soon as it loads." },
      { title: "Reach the last screen", detail: "On its last screen it reports completed, and the topic completes by itself." },
    ],
  },
  "sct-m4-t1": {
    kind: "scorm",
    packageUrl: "/scorm/m10-l2-a3-clear-the-prompt-queue/index.html",
    packageLabel: "SCORM 1.2 package",
    packageSizeLabel: "160 KB",
    intro: "Work through a queue of prompts with a token budget. The package reports completed when you finish the queue.",
    steps: [
      { title: "Start the activity", detail: "The package connects to the platform when it loads." },
      { title: "Finish the queue", detail: "When the queue is done it reports completed, and the topic completes by itself." },
    ],
  },
  "sct-m5-t1": {
    kind: "scorm",
    packageUrl: "/scorm/m12-l5-a2-clearing-the-deck/index.html",
    packageLabel: "SCORM 1.2 package",
    packageSizeLabel: "40 KB",
    // This package has no SCORM calls at all: it plays, but tells the platform nothing.
    reportsCompletion: false,
    intro: "Clear the deck. This package never reports to the platform, so the topic is completed by hand.",
    steps: [
      { title: "Go through the activity", detail: "The package plays, but it never sends a status." },
      { title: "Mark it complete", detail: "Select Mark as Complete at the end, or answer the question Next asks." },
    ],
  },
};
