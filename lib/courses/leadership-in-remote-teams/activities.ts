import type { CourseActivity } from "@/lib/courses/kit";

/** The Activity topics of the course, by topic id (lib/courses/README.md). */
export const activities: Record<string, CourseActivity> = {
  "lrt-m1-t5": {
    file: { name: "working-agreement-draft.docx", size: "40 KB" },
    intro:
      "You draft a working agreement for a remote team of six, described on the first page of the file. A working agreement replaces guesses about each other with a few rules the team chose.",
    steps: [
      { title: "Read the team profile", detail: "Open the file in the Downloads tab and read the profile: six people, their roles, their working hours, and the three frictions they reported last month." },
      { title: "Write one rule per friction", detail: "For each of the three frictions, write a rule that would have prevented it. Say who does what and by when: “We answer a direct question within one working day.”" },
      { title: "Cover the basics", detail: "Add a line each for core hours, where decisions are written down, how to signal that you are unavailable, and what counts as urgent." },
      { title: "Remove what you cannot observe", detail: "Delete any rule you could not check from the outside, such as “be respectful” or “stay engaged”. Replace it with a behaviour or drop it." },
      { title: "Check the result", detail: "A good agreement has six to eight rules on one page, each one a behaviour someone could notice, and a date on which the team reviews it. It is written as “we”, not as instructions from the manager." },
    ],
  },
  "lrt-m3-t3": {
    file: { name: "weekly-calendar-three-time-zones.xlsx", size: "30 KB" },
    intro:
      "You redesign the weekly calendar of the case-study team, which is spread over three time zones and shares two hours a day. The aim is fewer meetings in the shared hours and none outside them.",
    steps: [
      { title: "Mark the overlap", detail: "Open the calendar in the Downloads tab. The working hours of each zone are already shaded. Outline the two hours a day in which everyone is at work." },
      { title: "Sort the current meetings", detail: "For each of the eight recurring meetings on the sheet, decide: keep live, shorten, make it every two weeks, or move to writing. A meeting that only shares status moves to writing." },
      { title: "Place what stays live", detail: "Put the meetings you kept inside the overlap. Leave at least two overlap hours a week free for conversations nobody planned." },
      { title: "Describe the async replacements", detail: "For each meeting you moved to writing, say where it happens, who posts, and by when people reply." },
      { title: "Check the result", detail: "A good calendar has no recurring meeting outside anyone's working hours, at least a third fewer live hours than before, and a written replacement for each meeting you removed. Nobody carries the early or late slot every week." },
    ],
  },
};
