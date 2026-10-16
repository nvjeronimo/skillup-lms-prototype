import type { CourseActivity } from "@/lib/courses/kit";

/** The Activity topics of the course, by topic id (lib/courses/README.md). */
export const activities: Record<string, CourseActivity> = {
  "smec-m1-t6": {
    file: { name: "audience-platform-map.docx", size: "31 KB" },
    intro:
      "You map three audiences of your chosen business, or of the case-study shop, to the platforms they actually use. Choosing platforms from the audience outward keeps a small team from spreading itself across all of them.",
    steps: [
      { title: "Describe three audiences", detail: "Open the map in the Downloads tab. For each audience write who they are, what they buy and what they want to know before buying." },
      { title: "Find where they spend time", detail: "For each audience name the one or two platforms they use most, and what they do there: watch, search, ask others or shop. Give your evidence, such as shop data, a survey or the comments you see." },
      { title: "Match a format", detail: "Write the format that fits each audience on its platform: short video, carousel, live session or community post." },
      { title: "Choose what to leave out", detail: "Name one platform the business will not use for now and say why." },
      { title: "Check the result", detail: "A good map has three audiences that differ from each other, a platform and a format for each with a reason, and one platform deliberately left out. “Everyone is on it” is not a reason." },
    ],
  },
  "smec-m1-t12": {
    file: { name: "competitor-audit-two-brands.xlsx", size: "35 KB" },
    intro:
      "You compare two competitors with the social audit template. The aim is to find what they do that works and what they leave open, not to copy them.",
    steps: [
      { title: "Choose two competitors", detail: "Open the audit in the Downloads tab. Pick two competitors of your business, or use the two fictional shops described on the first sheet." },
      { title: "Record the basics", detail: "For each, on its main platform, note the number of followers, how often it posts, and the formats it uses, over the last thirty days." },
      { title: "Look at what gets a response", detail: "Find the three posts with the most comments or shares for each. Note the topic, the format and the opening line." },
      { title: "Read the comments", detail: "Note two questions or complaints that customers raise and the brand does not answer." },
      { title: "Check the result", detail: "A good audit has the same rows filled in for both competitors, three top posts each, and ends with one thing to learn from them and one gap your business could fill." },
    ],
  },
  "smec-m2-t5": {
    file: { name: "one-article-five-posts.docx", size: "36 KB" },
    intro:
      "You turn one article into five social posts, with an AI assistant for the first drafts. Repurposing well means choosing five different points, not cutting one text into five pieces.",
    steps: [
      { title: "Pick five points", detail: "Open the file in the Downloads tab and read the article. Mark five things a reader could use on their own: a tip, a number, a mistake, a how-to step, a question." },
      { title: "Give each point a format", detail: "Assign each point a format and a platform: a carousel, a short video script, a single image with a caption, a poll, a text post." },
      { title: "Draft with the assistant", detail: "Give the assistant the article, the five points and the formats, with a length limit for each. Ask it to keep every fact as the article states it." },
      { title: "Edit for voice and accuracy", detail: "Rewrite each opening line so it works without the article. Check every number against the source and remove hashtags that add nothing." },
      { title: "Check the result", detail: "A good result is five posts that each stand alone, open differently and carry a single point. Someone who sees all five in a week would not feel they had read the same post five times." },
    ],
  },
  "smec-m2-t12": {
    file: { name: "creator-brief-template.docx", size: "34 KB" },
    intro:
      "You write a one-page brief for a creator who will present one product. A good brief says what must be true and leaves the creator free in how to say it.",
    steps: [
      { title: "State the goal and the audience", detail: "Open the template in the Downloads tab. Write what the collaboration should achieve, in one sentence, and who should see it." },
      { title: "List the must-haves", detail: "Write the three facts about the product that have to be right, the one action viewers should take, and the link or code to use." },
      { title: "List the must-nots", detail: "Write what the creator may not claim, for example health benefits or comparisons with named competitors. Add that the post must be clearly labelled as a paid partnership." },
      { title: "Set deliverables and dates", detail: "Say how many pieces, in which format, the date for the draft, the date for posting, and how long the business may reuse the content." },
      { title: "Check the result", detail: "A good brief fits on one page, has at most three required messages, includes the disclosure rule, and does not contain a script. A creator could start work without asking a question." },
    ],
  },
  "smec-m3-t5": {
    file: { name: "three-posts-to-tag.docx", size: "1.8 MB" },
    intro:
      "You tag products in three sample posts of the case-study shop, using its catalogue. A tag is only useful if it leads to the exact product in the picture and that product can be bought.",
    steps: [
      { title: "Open the posts and the catalogue", detail: "Open the file in the Downloads tab for the three posts, and the shop catalogue from Handouts. For each post list every product you can see." },
      { title: "Match each product to a catalogue line", detail: "Find the exact line in the catalogue: the right variant, size and colour. Write its product id next to the item." },
      { title: "Check that it can be sold", detail: "Look at the stock and price columns. Do not tag a product that is out of stock or whose price in the post differs from the catalogue." },
      { title: "Place the tags", detail: "Mark on each post where the tag sits. Keep to five tags or fewer per post, and do not cover a face or the product itself." },
      { title: "Check the result", detail: "A good result has every tag pointing to one catalogue id in stock, the right variant for what is shown, and a note on anything you chose not to tag and why." },
    ],
  },
  "smec-m3-t11": {
    file: { name: "product-page-and-questions.docx", size: "42 KB" },
    intro:
      "You rewrite a product page of the case-study shop from the questions its customers ask. The questions people send before buying are a list of what the page fails to say.",
    steps: [
      { title: "Read the page and the questions", detail: "Open the file in the Downloads tab. Read the current product page, then the twenty customer questions collected from email and comments." },
      { title: "Group the questions", detail: "Sort the questions into groups such as size, materials, delivery, returns and care. Count each group." },
      { title: "Answer the top groups on the page", detail: "Rewrite the description so that the three largest groups are answered in the first screen, in plain words and with figures where the question asks for one." },
      { title: "Move the rest to a short list", detail: "Put the remaining answers in a list of questions and answers lower on the page. Remove sentences that answer nothing." },
      { title: "Check the result", detail: "A good page answers the three most frequent questions before the buy button, states sizes and delivery times as numbers, and invents no fact that is not in the file. It is no longer than the original." },
    ],
  },
  "smec-m4-t5": {
    file: { name: "store-funnel-one-month.xlsx", size: "29 KB" },
    intro:
      "You find the biggest leak in the funnel of the case-study shop for one month: sessions, product views, carts, checkouts started and orders. Knowing which step loses the most shoppers tells you where a change is worth testing.",
    steps: [
      { title: "Enter the five counts", detail: "Open the worksheet in the Downloads tab. It holds the month of store data from Handouts, with one count for each of the five steps." },
      { title: "Work out the four step rates", detail: "Divide each step by the one before it. Write each rate as a percentage with one decimal." },
      { title: "Compare with the benchmark", detail: "Set each rate against the typical range given on the second sheet. Mark the step that falls furthest below its range." },
      { title: "Split the weak step", detail: "Use the device columns to see whether the weak step is worse on mobile or on desktop." },
      { title: "Check the result", detail: "A good result is four rates, one step named as the biggest leak with the figure behind it, where it is worst, and one thing you would look at on that page. The step with the lowest percentage is not always the leak." },
    ],
  },
  "smec-m4-t12": {
    file: { name: "campaign-links-to-tag.xlsx", size: "22 KB" },
    intro:
      "You tag five campaign links and then find them in a traffic report. Tags are what let a report say which post or email brought an order, and a single spelling mistake splits one campaign into two.",
    steps: [
      { title: "Set the naming rules", detail: "Open the worksheet in the Downloads tab. Write the rules first: lower case only, hyphens for spaces, and one fixed list of sources and mediums." },
      { title: "Tag the five links", detail: "For each of the five placements add a source, a medium and a campaign name to the link. Use the same campaign name on all five." },
      { title: "Check each link", detail: "Read each finished link character by character: one question mark, an ampersand between tags, no spaces. Open it to confirm the page still loads." },
      { title: "Find them in the report", detail: "On the second sheet, the sample traffic report, find the rows for your campaign. Note which source brought the most sessions and which the most orders." },
      { title: "Check the result", detail: "A good result is five links that follow one set of rules and appear in the report as one campaign with five sources. If you see two campaign names, one link has a different spelling." },
    ],
  },
  "smec-m5-t3": {
    file: { name: "launch-timeline.xlsx", size: "27 KB" },
    intro:
      "You draft the timeline for the launch you plan in the final project. Working back from the launch day shows early whether the plan fits in the time you have.",
    steps: [
      { title: "Fix the launch day", detail: "Open the timeline in the Downloads tab. Enter the launch day and the three phases: two weeks before, launch week, and two weeks after." },
      { title: "List what has to exist", detail: "List every asset the launch needs: product pages, posts, creator content, emails, tagged links. Give each an owner." },
      { title: "Work backwards", detail: "For each asset set the date it must be ready and the date work on it must start. Allow time for one review." },
      { title: "Mark the dependencies", detail: "Mark what cannot start before something else is finished, such as posts that need product photos." },
      { title: "Check the result", detail: "A good timeline has a date and an owner on every line, no asset due on launch day itself, and the after-launch phase filled in, including the day you read the results." },
    ],
  },
};
