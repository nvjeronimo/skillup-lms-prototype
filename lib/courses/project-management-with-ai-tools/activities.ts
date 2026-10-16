import type { CourseActivity } from "@/lib/courses/kit";

/** The Activity topics of the course, by topic id (lib/courses/README.md). */
export const activities: Record<string, CourseActivity> = {
  "pma-m1-t6": {
    file: { name: "kickoff-email-and-charter.docx", size: "46 KB" },
    intro:
      "You turn a long kickoff email from a sponsor into a one-page project charter, using an AI assistant for the first draft. The charter is the page everyone signs up to, so each line has to be something you checked.",
    steps: [
      { title: "Read the email and mark the facts", detail: "Open the file in the Downloads tab. In the kickoff email, mark the goal, the deadline, the budget, the people named and anything described as out of scope." },
      { title: "Ask for a draft charter", detail: "Give the assistant the email and the six headings of the charter template: goal, scope, out of scope, deliverables, people, constraints. Ask it to mark with a question mark anything the email does not say." },
      { title: "Correct the draft against the email", detail: "Check every line of the draft against what you marked. Delete anything the assistant invented, such as a date or an owner the sponsor never gave." },
      { title: "List the open questions", detail: "Under the charter write the three questions you would send back to the sponsor before work starts." },
      { title: "Check the result", detail: "A good charter fits on one page, states the goal as an outcome with a date, lists deliverables and not activities, and contains nothing that is not in the email. The open questions cover what was missing." },
    ],
  },
  "pma-m2-t4": {
    file: { name: "backlog-twelve-items.xlsx", size: "28 KB" },
    intro:
      "You estimate a backlog of twelve items twice, once by comparison and once in three points, and see where the two disagree. The disagreements show you which items nobody understands yet.",
    steps: [
      { title: "Read the twelve items", detail: "Open the backlog in the Downloads tab. Read each item and its acceptance note, and flag any you could not explain to someone else." },
      { title: "Size them by comparison", detail: "Pick the item you understand best as the reference and call it a 3. Give every other item 1, 2, 3, 5 or 8 by comparing it with the reference." },
      { title: "Estimate four of them in three points", detail: "For the four largest items, write an optimistic, a likely and a pessimistic figure in days, and let the sheet work out the weighted figure." },
      { title: "Compare with the assistant", detail: "Ask an AI assistant to estimate the same twelve items from the text alone. Mark every item where its size differs from yours by more than one step." },
      { title: "Check the result", detail: "A good result has all twelve sized, a wide range on at least one of the three-point items, and a note on each disagreement saying what information would settle it. An 8 is a sign the item should be split." },
    ],
  },
  "pma-m3-t3": {
    file: { name: "ten-risks-to-score.xlsx", size: "26 KB" },
    intro:
      "You score ten risks of the case-study project by probability and impact and decide which ones deserve a response. A register is useful only when it tells you where to spend attention.",
    steps: [
      { title: "Rewrite the vague ones", detail: "Open the list in the Downloads tab. Rewrite any risk that is not in the form cause, event, effect. “The supplier is late, so testing starts a week late” can be scored. “Supplier issues” cannot." },
      { title: "Score probability and impact", detail: "Give each risk a probability and an impact from 1 to 5, using the scale on the second sheet. Score impact on the deadline, since that is what the sponsor cares about most." },
      { title: "Rank and draw the line", detail: "Multiply the two scores and sort. Draw a line under the risks you will actively manage; three or four is realistic for a team of this size." },
      { title: "Write a response and an owner", detail: "For each risk above the line, write one response (avoid, reduce, transfer or accept), the first action and the person who owns it." },
      { title: "Check the result", detail: "A good result has ten risks written as cause, event and effect, scores that are not all 3s, and an owner and a first action for the top risks." },
    ],
  },
  "pma-m4-t4": {
    file: { name: "status-report-to-review.docx", size: "34 KB" },
    intro:
      "You review a status report that an AI assistant wrote from a board export and meeting notes, and find the three errors in it. Reports like this read well, which is why they need checking.",
    steps: [
      { title: "Read the sources first", detail: "Open the file in the Downloads tab. Read the board export and the meeting notes before you read the report, so you know what is true." },
      { title: "Check every figure and date", detail: "Compare each number, date and name in the report with the sources. Mark anything that does not match." },
      { title: "Check what the report concludes", detail: "Look at the overall status and at each claim that work is done or on track. Ask whether the sources support it, or whether it only sounds right." },
      { title: "Correct the three errors", detail: "For each error write what the report says, what the source says, and the corrected sentence." },
      { title: "Check the result", detail: "A good review finds one wrong figure or date, one item reported as done that is not, and one conclusion the sources do not support. Each correction names the source line it came from." },
    ],
  },
};
