import type { CourseActivity } from "@/lib/courses/kit";

/** The Activity topics of the course, by topic id (lib/courses/README.md). */
export const activities: Record<string, CourseActivity> = {
  "dmf-m1-t5": {
    file: { name: "channel-map-worksheet.docx", size: "39 KB" },
    intro:
      "You map the channels a brand already uses, for a small business you know or for the case-study bakery in Handouts. Before choosing new channels, a marketer needs to see what is already there and what each one is for.",
    steps: [
      { title: "List every channel", detail: "Open the worksheet in the Downloads tab. List each place the business shows up: website, search listing, social profiles, email, marketplaces, paid ads, printed material, the shop window." },
      { title: "Sort into owned, earned and paid", detail: "Mark each channel as owned, earned or paid. A review page is earned, a newsletter is owned, a boosted post is paid." },
      { title: "Give each channel a job", detail: "For each channel write the stage of the journey it serves: being found, being considered, buying, or coming back. One line each." },
      { title: "Mark gaps and overlaps", detail: "Circle the stage with no channel serving it, and any two channels doing the same job for the same people." },
      { title: "Check the result", detail: "A good map lists at least six channels, has each one sorted and given a job, and ends with one gap and one overlap. It describes what the business does today, not what it should do." },
    ],
  },
  "dmf-m2-t4": {
    file: { name: "funnel-rates-worksheet.xlsx", size: "27 KB" },
    intro:
      "You work out the conversion rates of a five-step funnel and choose the step to fix first. The numbers are simple; the judgement is in deciding which rate matters.",
    steps: [
      { title: "Read the funnel", detail: "Open the worksheet in the Downloads tab. It gives one month of counts for five steps: visits, product views, baskets, checkouts started and orders." },
      { title: "Work out each step rate", detail: "Divide each step by the step before it and write the result as a percentage with one decimal." },
      { title: "Work out the overall rate", detail: "Divide orders by visits. Check that multiplying the four step rates gives the same figure." },
      { title: "Choose the step to fix", detail: "Compare each rate with the typical range on the second sheet. Pick the step that is furthest below its range, not simply the lowest percentage." },
      { title: "Check the result", detail: "A good result has four step rates and one overall rate that agree with each other, and one sentence naming the step you would fix first and what you would look at there. Early steps always lose the most people, so the lowest rate is not automatically the problem." },
    ],
  },
  "dmf-m3-t4": {
    file: { name: "three-weak-prompts.docx", size: "35 KB" },
    intro:
      "You rewrite three weak prompts with the prompt checklist: role, task, context and format. A better prompt is mostly a clearer brief, the same one you would give a new colleague.",
    steps: [
      { title: "Diagnose each prompt", detail: "Open the file in the Downloads tab. For each of the three prompts, tick which of the four parts it has and which it lacks." },
      { title: "Rewrite with all four parts", detail: "Rewrite each prompt so it names the role, states one task, gives the context the assistant cannot guess (audience, product, tone) and fixes the format and length." },
      { title: "Run before and after", detail: "Run the weak prompt and your rewrite in an AI assistant. Paste both outputs into the worksheet." },
      { title: "Check the facts", detail: "Read the better output for anything invented: a price, a statistic, a customer quote. Mark it. A clearer prompt reduces invention; it does not remove it." },
      { title: "Check the result", detail: "A good rewrite is three to six sentences, could be handed to a person as a brief, and produces an output you would need to edit only lightly. You can say in one line what changed between the two outputs." },
    ],
  },
};
