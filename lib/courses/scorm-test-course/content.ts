import type { CourseContent } from "@/lib/courses/kit";
import { activities } from "./activities";

/** The reading that opens the course: what each package does and what to check. No quiz. */
export const content: CourseContent = {
  byline: {
    author: "Nelson Jerónimo",
    role: "Design · SCORM Test Course",
    updated: "November 2026",
  },
  quiz: [],
  articles: {
    "sct-m1-t1": {
      lede: "This course exists to test real SCORM packages in the player. Each of the next four modules holds one package from the GenAI for Finance course, played as Open edX plays it: in an iframe, talking to the platform through the SCORM 1.2 API.",
      sections: [
        {
          heading: "What each package does",
          paragraphs: [
            "From Export to Board Narrative (M4.L2.A1) and Reading the Signal (M5.L4.A1) report incomplete when they start and completed on their last screen. They write incomplete again every time they start, so a finished topic must stay finished when you open it again.",
            "Clear the Prompt Queue (M10.L2.A3) reports incomplete when it starts and completed when the queue is done.",
            "Clearing the Deck (M12.L5.A2) never talks to the platform. The topic falls back to the rule for topics we cannot measure: Mark as Complete, and Next asks.",
          ],
        },
        {
          heading: "What to check",
          paragraphs: [
            "Under each package, a test panel shows what the package reported (lesson_status, score) and its last calls. Reset this package clears what it stored, so it starts again from nothing.",
            "Check that the topic completes by itself when the package reports, that the sidebar and the course progress follow, that Fullscreen and Launch unit in new window both work, and that a package opened again picks up where it left off.",
            "None of these packages reports a score, so the course has no graded items.",
          ],
        },
      ],
      pullQuote: {
        text: "We control the frame, not what is inside the package.",
        attribution: "Activity (SCORM) screens, 19 Oct 2026",
      },
      takeaways: [
        "Three packages report completion; one never does.",
        "A completion, once reported, stays.",
        "The test panel is a testing aid, not part of the design.",
      ],
    },
  },
  quizzes: {},
  assignments: {},
  ora: {},
  activities,
};
