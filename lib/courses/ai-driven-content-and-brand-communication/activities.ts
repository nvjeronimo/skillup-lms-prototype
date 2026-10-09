import type { CourseActivity } from "@/lib/courses/kit";

/** The Activity topics of the course, by topic id (lib/courses/README.md). */
export const activities: Record<string, CourseActivity> = {
  "acb-m1-t6": {
    file: { name: "voice-chart-brightwell.docx", size: "38 KB" },
    intro:
      "You describe the voice of Brightwell Refill in three traits and start the voice chart you will reuse in Module 2. The point is to turn a feeling about a brand into something a colleague or an AI assistant can follow.",
    steps: [
      { title: "Read the three samples", detail: "Open the voice chart in the Downloads tab and read the three pieces of Brightwell Refill copy at the top: a welcome email, a product page and a reply to a complaint. Underline the phrases that sound most like the brand." },
      { title: "Name three traits", detail: "Choose three adjectives that fit all three samples, for example practical, warm, direct. Drop any trait that only fits one sample, and any trait every brand would claim, such as friendly or professional." },
      { title: "Write what each trait means, and what it does not", detail: "For each trait fill one row: what it means in a sentence, one thing the brand does because of it, and one thing it never does. “Direct: we say the price in the first line. We do not use urgency we cannot back.”" },
      { title: "Add one before and after", detail: "Take the generic sentence at the bottom of the chart and rewrite it in the voice. Keep the facts the same and change only the wording." },
      { title: "Check the result", detail: "A good chart fits on half a page, has three traits that do not overlap, and gives a do and a do not for each. Someone who has never read the brand should be able to write your after sentence from the chart alone." },
    ],
  },
  "acb-m2-t7": {
    file: { name: "segment-rewrite-worksheet.docx", size: "41 KB" },
    intro:
      "You take one Brightwell Refill announcement and rewrite it for three audience segments with an AI assistant. The facts stay identical in every version; only the emphasis changes.",
    steps: [
      { title: "List the fixed facts", detail: "Open the worksheet in the Downloads tab. From the base message, copy out the facts that may not change: the product, the price, the date and the offer. You will check each version against this list." },
      { title: "Write one line per segment", detail: "For each of the three segments in the worksheet, write what that reader cares about most and the one objection they are likely to raise. This line is the context you give the assistant." },
      { title: "Prompt for three versions", detail: "Give the assistant the base message, your voice chart from Module 1, the segment lines and a length limit of 60 words each. Ask for three versions and for a note saying what it emphasised in each." },
      { title: "Edit and mark your changes", detail: "Correct each version by hand. Remove any claim that is not in your list of facts, and restore the voice where it drifted. Highlight every sentence you changed." },
      { title: "Check the result", detail: "A good result is three versions that open differently, carry exactly the same facts, and still sound like one brand. If you can swap two versions between segments and nobody would notice, the emphasis is not specific enough." },
    ],
  },
  "acb-m3-t4": {
    file: { name: "image-check-sheet.docx", size: "2.4 MB" },
    intro:
      "You review four AI-generated images against the visual section of the Brightwell Refill brand guide and decide which can be used. The skill is giving a reason someone else can act on, not a like or a dislike.",
    steps: [
      { title: "Read the visual rules", detail: "Open the check sheet in the Downloads tab. Read the five visual rules on the first page: colour palette, lighting, how the product is shown, how people are shown, and what never appears." },
      { title: "Score each image against each rule", detail: "For each of the four images, mark every rule as met, not met or cannot tell. Look at the details generated images often get wrong: text on labels, hands, and the shape of the bottle." },
      { title: "Decide: use, fix or reject", detail: "Give each image one verdict. Use means no rule is broken. Fix means one rule is broken and a new prompt could correct it. Reject means the product is misrepresented or the image could mislead a customer." },
      { title: "Write the fix as a prompt change", detail: "For each image marked fix, write the one sentence you would add to or remove from the prompt. Name the rule it answers." },
      { title: "Check the result", detail: "A good sheet has a verdict for all four images, a rule named for every not met, and at least one image you rejected or fixed. If all four pass, read the rule on product accuracy again." },
    ],
  },
};
