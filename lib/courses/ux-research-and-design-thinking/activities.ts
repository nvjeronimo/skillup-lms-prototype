import type { CourseActivity } from "@/lib/courses/kit";

/** The Activity topics of the course, by topic id (lib/courses/README.md). */
export const activities: Record<string, CourseActivity> = {
  "uxr-m1-t7": {
    file: { name: "interview-notes-to-sort.docx", size: "44 KB" },
    intro:
      "You sort 24 notes taken from the five case-study interviews, with people who organise meals out for a group, into themes. This is the first step from what people said to what the team should pay attention to.",
    steps: [
      { title: "Read every note once", detail: "Open the notes in the Downloads tab. Each note is one observation or quote with the number of the interview it came from. Read all 24 before you group anything." },
      { title: "Group by meaning", detail: "Put notes together when they describe the same behaviour or the same problem, not when they share a word. Aim for four to six groups, and leave a note on its own if it fits nowhere." },
      { title: "Name each theme as a sentence", detail: "Give each group a name that says something: “Organisers confirm everything twice because they do not trust the count” is a theme. “Communication” is a label." },
      { title: "Count the people behind each theme", detail: "Next to each theme write how many of the five organisers it comes from. A theme held by one person is a lead to follow, not yet a pattern." },
      { title: "Check the result", detail: "A good result is four to six themes written as sentences, each backed by notes from at least two interviews, with the outliers kept visible. If one group holds half the notes, split it." },
    ],
  },
  "uxr-m2-t5": {
    file: { name: "journey-map-template.docx", size: "52 KB" },
    intro:
      "You map the journey of one case-study organiser, from the idea of a group meal to the day after it. A journey map shows where the experience breaks, so the team knows where a problem statement should point.",
    steps: [
      { title: "Choose one organiser and one outing", detail: "Open the template in the Downloads tab and pick one of the five transcripts. Map one real outing that person described, not an average of all five." },
      { title: "Lay out the stages", detail: "Write the stages across the top in the organiser's own order, for example: propose, collect answers, choose a place, book, remind, meet, settle the bill." },
      { title: "Fill in actions, thoughts and feelings", detail: "Under each stage note what the organiser did, a short quote for what they were thinking, and whether the moment was easy, neutral or painful. Use the transcript, and leave a cell empty if it says nothing." },
      { title: "Mark the two lowest points", detail: "Circle the two stages where the feeling is worst and write next to each what caused it." },
      { title: "Check the result", detail: "A good map has five to seven stages, a quote in most of them, and two low points with a cause. Every cell should trace to a line of the transcript; anything you assumed is marked as an assumption." },
    ],
  },
  "uxr-m3-t3": {
    file: { name: "crazy-8s-sheet.pdf", size: "64 KB" },
    intro:
      "You run one round of Crazy 8s on your own: eight sketched ideas in eight minutes for one problem statement. The time limit is the method. It pushes you past the first obvious idea.",
    steps: [
      { title: "Set up", detail: "Print the sheet from the Downloads tab or fold a sheet of paper into eight panels. Write at the top the problem statement you drafted in Module 2, or the sample one on the sheet." },
      { title: "Sketch eight ideas, one minute each", detail: "Start a timer for eight minutes. Draw one idea per panel and move on when the minute ends, finished or not. Boxes, arrows and a few words are enough." },
      { title: "Do not go back", detail: "Do not erase or improve an earlier panel during the round. If you run out of ideas, vary one you already drew: change who uses it, when, or on which device." },
      { title: "Pick two", detail: "When the timer stops, mark the two panels you would take further and write one sentence each on what they would let the organiser do." },
      { title: "Check the result", detail: "A good round has all eight panels filled, at least three clearly different approaches, and two chosen ideas that answer the problem statement. Rough drawings are expected." },
    ],
  },
  "uxr-m4-t5": {
    file: { name: "five-findings-to-rate.docx", size: "36 KB" },
    intro:
      "You rate five findings from a usability test by severity, so that the team fixes the right thing first. Severity depends on what happened to the tester, not on how easy the fix is.",
    steps: [
      { title: "Read the five findings", detail: "Open the findings in the Downloads tab. Each one says what the tester tried to do, what happened, and how many of the five testers met the problem." },
      { title: "Rate the impact", detail: "For each finding decide: did it stop the task, slow it down, or only irritate? A tester who gave up is a stopped task even if they stayed polite about it." },
      { title: "Combine impact and frequency", detail: "Give each finding a severity from 1, cosmetic, to 4, blocks the task for most people. A problem that stopped two of five testers outranks one that annoyed all five." },
      { title: "Order the list", detail: "Sort the findings from most to least severe and write one line of evidence next to each rating." },
      { title: "Check the result", detail: "A good result uses at least three different severity levels, puts a task-stopping problem first, and has a line of evidence for every rating." },
    ],
  },
};
