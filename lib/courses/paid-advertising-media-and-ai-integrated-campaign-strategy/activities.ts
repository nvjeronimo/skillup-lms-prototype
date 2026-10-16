import type { CourseActivity } from "@/lib/courses/kit";

/** The Activity topics of the course, by topic id (lib/courses/README.md). */
export const activities: Record<string, CourseActivity> = {
  "paid-m1-t6": {
    file: { name: "twenty-keywords-to-sort.xlsx", size: "23 KB" },
    intro:
      "You sort twenty keywords of the sample online shop into ad groups. Tight ad groups let each ad answer the search that triggered it, which is what makes an ad relevant.",
    steps: [
      { title: "Read the keyword list", detail: "Open the worksheet in the Downloads tab. Read the twenty keywords with their monthly searches and note which product or need each one is about." },
      { title: "Group by what the searcher wants", detail: "Make four to six ad groups. Put keywords together when one ad and one landing page could answer all of them. Split by product first, then by intent." },
      { title: "Name each group and its landing page", detail: "Give each ad group a plain name and write the page of the shop its ads should lead to." },
      { title: "Set aside what does not belong", detail: "Move any keyword the shop cannot serve, such as a repair or a free version, to a negative list." },
      { title: "Check the result", detail: "A good result has four to six ad groups of two to six keywords, one landing page per group, and at least two negatives. You can write one headline per group that fits every keyword in it." },
    ],
  },
  "paid-m1-t11": {
    file: { name: "search-ad-brief-and-variants.docx", size: "37 KB" },
    intro:
      "You draft three search ad variants from one brief, with an AI assistant, and check each against the limits and the facts. The three should test different reasons to click, not three wordings of one reason.",
    steps: [
      { title: "Read the brief", detail: "Open the file in the Downloads tab. Note the product, the price, the offer, the audience, and the claims the shop is allowed to make." },
      { title: "Choose three angles", detail: "Pick three reasons to click, for example price, speed of delivery and proof from reviews. Write one line for each." },
      { title: "Draft with the assistant", detail: "Give the assistant the brief and the angles. Ask for three headlines of at most 30 characters and two descriptions of at most 90 for each angle." },
      { title: "Check limits and claims", detail: "Count the characters. Remove any claim that is not in the brief, such as a discount, a guarantee or “best”. Make sure each ad has a clear action." },
      { title: "Check the result", detail: "A good result is three ads within the limits, each led by a different angle, with every fact traceable to the brief. A reader can tell at a glance what each variant is testing." },
    ],
  },
  "paid-m2-t5": {
    file: { name: "hooks-worksheet.docx", size: "33 KB" },
    intro:
      "You write opening hooks for one product of the sample online shop and three audiences. On a social feed the first line or the first two seconds decide whether the rest is seen.",
    steps: [
      { title: "Read the product and the audiences", detail: "Open the worksheet in the Downloads tab. Read the product sheet and the three audience notes: what each person is doing when the ad appears, and what they care about." },
      { title: "Write three hooks per audience", detail: "For each audience write three opening lines of at most twelve words. Try a question, a problem said in their words, and a result." },
      { title: "Say what is on screen", detail: "Next to each hook describe the first two seconds of the picture or video in one line. A hook that needs sound to work is a weak hook." },
      { title: "Choose one per audience", detail: "Pick the strongest hook for each audience and write why it fits that audience and not the other two." },
      { title: "Check the result", detail: "A good result is nine hooks and three chosen ones that are clearly different from each other. None starts with the brand name, and none promises something the product sheet does not support." },
    ],
  },
  "paid-m2-t15": {
    file: { name: "media-plan-one-month.xlsx", size: "34 KB" },
    intro:
      "You build a one-month media plan for the sample online shop from a fixed budget. A media plan is a set of choices you can defend: where the money goes, why, and what it should return.",
    steps: [
      { title: "Read the goal and the budget", detail: "Open the plan in the Downloads tab. The first sheet gives the monthly budget, the goal for the month and last quarter's cost per order by channel." },
      { title: "Split the budget", detail: "Divide the budget between search, paid social and one other channel of your choice. Write one line of reasoning for each share." },
      { title: "Estimate the result", detail: "Using last quarter's figures, estimate the clicks and orders each line should bring. Leave the estimate as a range, not a single number." },
      { title: "Hold back a test budget", detail: "Reserve about a tenth of the budget for one test and say what you want to learn from it." },
      { title: "Check the result", detail: "A good plan adds up to the budget exactly, has a reason and an expected range for every line, and names one test with its question. The goal of the month can be traced through the numbers." },
    ],
  },
  "paid-m3-t5": {
    file: { name: "campaign-report-month.xlsx", size: "120 KB" },
    intro:
      "You read one month of the sample ad account and find where money is being wasted. Waste is spend that could not have led to an order, and most accounts have some.",
    steps: [
      { title: "Start from the totals", detail: "Open the report in the Downloads tab. Note the total spend, the orders and the cost per order, then the same three figures for each campaign." },
      { title: "Look at the search terms", detail: "Sort the search terms sheet by spend. Mark the terms with spend and no orders that the shop could never serve." },
      { title: "Look at placements, devices and hours", detail: "Do the same on the other three sheets. Look for a placement, a device or a time of day that takes a large share of spend and returns almost nothing." },
      { title: "Add up the waste", detail: "List your three largest findings with the amount spent on each, and say what you would do: add a negative, exclude a placement, or change the schedule." },
      { title: "Check the result", detail: "A good result names three sources of waste with a figure and an action each, and states their share of the month's spend. A term with few clicks and no orders yet is not waste; it is too early to say." },
    ],
  },
  "paid-m3-t15": {
    file: { name: "automation-guardrails.docx", size: "32 KB" },
    intro:
      "You write the guardrails for a campaign that sets its own bids and chooses its own placements. Automation does what the goal says, so the limits you set are where your judgement goes.",
    steps: [
      { title: "Read the campaign set-up", detail: "Open the file in the Downloads tab. Read what the automated campaign is allowed to decide: bids, audiences, placements and which creative to show." },
      { title: "Set the spending limits", detail: "Write the daily budget cap, the highest acceptable cost per order, and the point at which the campaign pauses itself." },
      { title: "Set the brand limits", detail: "List what must never happen: placements to exclude, claims no generated ad may make, and audiences that must not be targeted." },
      { title: "Decide who checks what, and when", detail: "Write the weekly check: which three numbers a person looks at, who that person is, and what they do if a number is outside its limit." },
      { title: "Check the result", detail: "A good set of guardrails fits on one page, puts a number on every limit, and names a person and a day for the check. Each rule says what happens when it is broken." },
    ],
  },
};
