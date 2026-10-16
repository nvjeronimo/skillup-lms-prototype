import type { CourseActivity } from "@/lib/courses/kit";

/** The Activity topics of the course, by topic id (lib/courses/README.md). */
export const activities: Record<string, CourseActivity> = {
  "ipa-m1-t6": {
    file: { name: "sign-up-flow-tracking-plan.xlsx", size: "29 KB" },
    intro:
      "You name the events the sign-up flow of the sample meal-planning app needs. Every metric later in the course is built from events, so their names and properties decide what you will be able to ask.",
    steps: [
      { title: "Walk through the flow", detail: "Open the tracking plan in the Downloads tab. The first sheet shows the five screens of the sign-up flow. List what a person can do on each one." },
      { title: "Name the events", detail: "Write one event for each action that matters, as an object and a past-tense verb in one style: signup_started, email_submitted, signup_completed. Six to eight events are enough." },
      { title: "Add properties", detail: "For each event list the properties you would need to split it later, such as the sign-up method, the plan chosen and the platform. Do not record anything that identifies a person beyond the user id." },
      { title: "Say when each event fires", detail: "In one line per event, say the exact moment it fires: when the button is pressed, or when the server confirms. The two give different counts." },
      { title: "Check the result", detail: "A good plan lets you count how many people started, finished and dropped at each screen, uses one naming style throughout, and has a trigger for every event. No two events mean the same thing." },
    ],
  },
  "ipa-m2-t4": {
    file: { name: "event-table-funnel.xlsx", size: "310 KB" },
    intro:
      "You build a four-step funnel for the sample meal-planning app from its event table: visit, sign-up, first recipe added, first plan saved. A funnel shows where people stop, which is where the next question starts.",
    steps: [
      { title: "Look at the event table", detail: "Open the workbook in the Downloads tab. Each row of the event table is one event with a user id, an event name and a time. Find the four event names the funnel uses." },
      { title: "Count unique users per step", detail: "For each step, count the people who did it at least once in the month. Count users, not events: one person who visits ten times is one visitor." },
      { title: "Keep the order", detail: "Count a person at a step only if they also did the step before it, earlier in time. The second sheet has a column that helps you check the order." },
      { title: "Work out the rates", detail: "Divide each step by the one before it for the step rate, and the last step by the first for the overall rate." },
      { title: "Check the result", detail: "A good funnel has four counts that only go down, three step rates and one overall rate, and a sentence naming the step with the largest drop. If a count goes up, you are counting events or ignoring the order." },
    ],
  },
  "ipa-m3-t3": {
    file: { name: "cohort-table-worksheet.xlsx", size: "33 KB" },
    intro:
      "You read a cohort table for the sample meal-planning app: eight weekly sign-up cohorts followed for eight weeks. Reading one well tells you whether the product keeps people, and whether that is changing.",
    steps: [
      { title: "Find your way around", detail: "Open the worksheet in the Downloads tab. Each row is the group of people who signed up in one week. Each column is a week since sign-up. A cell is the share of the group still active." },
      { title: "Read across one row", detail: "Follow the first cohort from week 0 to week 8. Note where the steep drop ends and the line flattens." },
      { title: "Read down one column", detail: "Compare week 4 for every cohort that has reached it. Say whether newer cohorts keep more people, fewer, or the same." },
      { title: "Find the odd cohort", detail: "One cohort behaves differently from the rest. Find it and write one possible reason you would check, such as a campaign or a release that week." },
      { title: "Check the result", detail: "A good reading is three sentences: where retention levels off, whether it is improving across cohorts, and which cohort stands out and why you would look into it. You do not compare cells that are not yet complete." },
    ],
  },
};
