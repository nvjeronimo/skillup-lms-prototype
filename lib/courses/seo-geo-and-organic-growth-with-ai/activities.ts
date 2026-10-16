import type { CourseActivity } from "@/lib/courses/kit";

/** The Activity topics of the course, by topic id (lib/courses/README.md). */
export const activities: Record<string, CourseActivity> = {
  "seo-m1-t5": {
    file: { name: "ten-queries-intent.xlsx", size: "24 KB" },
    intro:
      "You label the intent behind ten queries from the search report of the sample plant shop. Intent decides what kind of page can rank for a query, so it comes before any keyword choice.",
    steps: [
      { title: "Read the ten queries", detail: "Open the worksheet in the Downloads tab. Each row is a query people typed before reaching the plant shop, with its monthly impressions." },
      { title: "Label each one", detail: "Mark each query as informational, navigational, commercial or transactional. Ask what the person wants to have at the end: an answer, a specific site, a comparison or a purchase." },
      { title: "Check the results page", detail: "For the three you were least sure about, search the query and look at what ranks: guides, shop pages or brand pages. The results page shows how the search engine read the intent." },
      { title: "Match a page type", detail: "Next to each query write the page of the shop that should answer it: a guide, a category page, a product page or the home page." },
      { title: "Check the result", detail: "A good result uses at least three of the four labels, has a page type for every query, and notes the queries with mixed intent. No informational query is pointed at a product page." },
    ],
  },
  "seo-m2-t5": {
    file: { name: "on-page-audit-sheet.xlsx", size: "31 KB" },
    intro:
      "You audit one page of the sample plant shop against the on-page checklist. This is a practice run for Assignment 02, on a page chosen for you so that you can compare your findings with the example.",
    steps: [
      { title: "Open the page and the checklist", detail: "Open the audit sheet in the Downloads tab. It names the page to audit, in the sample site from Handouts, and the keyword it targets." },
      { title: "Record what is there", detail: "For each item write what the page has now: address, title tag, meta description, headings, opening paragraph, image alt text, internal links, and whether it can be indexed." },
      { title: "Judge each item", detail: "Mark each item as fine, weak or missing. A title that leaves out the keyword or is cut off in the results is weak. A page with no H1 is missing one." },
      { title: "Write the three fixes that matter most", detail: "Choose the three changes you would make first and write the new text for each, for example the new title tag in full." },
      { title: "Check the result", detail: "A good audit covers all eight items, gives the current text as evidence, and ends with three fixes written out in full. Compare it with the worked example on the last sheet." },
    ],
  },
  "seo-m3-t4": {
    file: { name: "assistant-answers-log.xlsx", size: "25 KB" },
    intro:
      "You test how AI assistants describe a brand: your own, or the sample plant shop. What an assistant says about a business is now part of how people find it, and you can only improve what you have recorded.",
    steps: [
      { title: "Write five questions", detail: "Open the log in the Downloads tab. Write five questions a customer might ask: two that name the brand, and three that describe a need without naming it." },
      { title: "Ask two assistants", detail: "Put each question to two different AI assistants, in a new conversation each time. Paste the answers into the log with the date." },
      { title: "Record what each answer does", detail: "For each answer note whether the brand is mentioned, whether the facts are right, which sources are cited, and which competitors appear in its place." },
      { title: "Trace one error to its source", detail: "Pick one wrong or missing fact and look for where it could come from: an old page, a listing with outdated details, or no page that answers the question at all." },
      { title: "Check the result", detail: "A good log has ten answers recorded as they were given, a count of mentions and of errors, and one concrete page to create or correct. Answers change from day to day, so the date matters." },
    ],
  },
};
