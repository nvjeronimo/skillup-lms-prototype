import type { CourseActivity } from "@/lib/courses/kit";

/** The Activity topics of the course, by topic id (lib/courses/README.md). */
export const activities: Record<string, CourseActivity> = {
  "sec4-m1-t8": {
    file: { name: "eight-events-log-sources.xlsx", size: "22 KB" },
    intro:
      "You match eight events to the log source that would record them. An analyst who knows where an event leaves a trace knows where to look first, and what a missing log would hide.",
    steps: [
      { title: "Read the eight events", detail: "Open the worksheet in the Downloads tab. Each row describes something that happened, such as a failed sign-in from abroad, a new program started on a laptop, or a rule that forwards mail outside the company." },
      { title: "Match the main source", detail: "For each event choose the source that records it most directly: the sign-in log, the endpoint log, the email log, the firewall log, the DNS log or the audit log of a cloud service." },
      { title: "Add a second source", detail: "Where another log would confirm the event, write it too. A download shows in the proxy or firewall log and on the endpoint." },
      { title: "Name the fields you would read", detail: "For each event list the two or three fields that matter: the account, the time, the source address, the device, the result." },
      { title: "Check the result", detail: "A good result gives each event a main source and the fields to read, a second source for at least four of them, and names the one event that no log on the list would record." },
    ],
  },
  "sec4-m2-t8": {
    file: { name: "alert-queue-ten-alerts.xlsx", size: "58 KB" },
    intro:
      "You triage ten alerts from the sample queue. Triage is a quick, recorded decision about each alert: close it, look further or escalate. It is not a full investigation.",
    steps: [
      { title: "Read the queue", detail: "Open the workbook in the Downloads tab. The first sheet is the queue of ten alerts. The others are the log extracts each alert refers to." },
      { title: "Check each alert against its log", detail: "For each alert find the matching lines in the extract. Ask who, what, when and from where, and whether it is normal for that account or device." },
      { title: "Give a verdict and a severity", detail: "Mark each alert as a false positive, a benign true positive or a true positive, and give the true positives a severity from the scale in the triage note template." },
      { title: "Write the note", detail: "Write two lines for each alert: what you checked and what you concluded. For anything you escalate, add what you would want the next person to know first." },
      { title: "Check the result", detail: "A good result has a verdict and a note for all ten alerts, links the two alerts that belong to the same event, and escalates anything that involves a privileged account. A closed alert without a reason is not triaged." },
    ],
  },
  "sec4-m3-t9": {
    file: { name: "containment-steps-to-order.docx", size: "30 KB" },
    intro:
      "You put the steps of a containment plan in order, for a laptop that shows signs of ransomware. In containment the order matters: the right action at the wrong moment can destroy evidence or warn nobody in time.",
    steps: [
      { title: "Read the scenario and the steps", detail: "Open the file in the Downloads tab. Read the scenario, then the nine steps listed in random order." },
      { title: "Decide what comes first", detail: "Place first the steps that stop the spread without losing information: isolate the device from the network and leave it powered on." },
      { title: "Order the rest", detail: "Put the remaining steps in sequence: tell the incident lead, record what is on screen and the time, disable the user's sessions, check the file shares the laptop could reach, check that backups are intact." },
      { title: "Separate containment from recovery", detail: "Draw a line where containment ends. Rebuilding the laptop and restoring files come after it, once the cause is understood." },
      { title: "Check the result", detail: "A good order isolates before anything else, records before it changes anything, and notifies early. Nothing is wiped or restored above the line, and each step names who carries it out." },
    ],
  },
};
