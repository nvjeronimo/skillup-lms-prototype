import type { CourseActivity } from "@/lib/courses/kit";

/** The Activity topics of the course, by topic id (lib/courses/README.md). */
export const activities: Record<string, CourseActivity> = {
  "cps-m1-t3": {
    file: { name: "one-page-plan.docx", size: "38 KB" },
    intro:
      "You choose the business for your capstone and write the one-page plan that the three milestones build on. A page is enough to see whether the project is the right size before you spend weeks on it.",
    steps: [
      { title: "Choose the business", detail: "Read the three business scenarios in Handouts and pick one, or use a business you know well. If you use a real one, remove customer data and anything confidential." },
      { title: "State the goal and the audience", detail: "Open the plan in the Downloads tab. Write one goal with a number and a date, and describe the one audience the system will serve first." },
      { title: "Pick the channels", detail: "Choose two or three channels from the ones the program covered (search, paid media, social and email) and say what each does for that audience. More channels do not earn more marks." },
      { title: "Plan where AI helps and where you check", detail: "List three tasks in which you will use an AI assistant, and for each one what you will check by hand. This becomes your AI workflow log." },
      { title: "Check the result", detail: "A good plan fits on one page: one business, one measurable goal, one audience, two or three channels, and three AI tasks with a check for each. You can tell from it what Milestone 1 will contain." },
    ],
  },
};
