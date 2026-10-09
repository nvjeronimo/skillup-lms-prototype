import type { CourseContent } from "@/lib/courses/kit";

export const content: CourseContent = {
  byline: {
    author: "Rajesh Menon",
    role: "Lead instructor · AI Augmented Digital Marketing",
    updated: "September 2026",
  },
  quiz: [
    {
      question: "In what order does a search engine handle a new page?",
      platformPrompt: "Choose the correct option",
      explanation:
        "A page is first crawled (fetched), then indexed (understood and stored), and only then can it be ranked for a query. A page that is not indexed cannot rank at all.",
      reviewTopicId: "seo-m1-t2",
      reviewTopicTitle: "How a search engine crawls, indexes and ranks",
      options: [
        { id: "a", label: "Rank, index, crawl", feedback: "Ranking comes last. A page has to be fetched and stored before it can be ranked." },
        { id: "b", label: "Crawl, index, rank", correct: true, feedback: "Correct. Fetched, then stored, then ranked for each query." },
        { id: "c", label: "Index, crawl, rank", feedback: "A page cannot be stored before it has been fetched." },
        { id: "d", label: "Crawl, rank, index", feedback: "Only pages in the index are ranked." },
      ],
    },
    {
      question: "Which element of a page is most likely to appear as the headline of its search result?",
      platformPrompt: "Choose the correct option",
      explanation:
        "The title element is what a search engine usually shows as the headline of a result, so it is written for the person deciding whether to click.",
      reviewTopicId: "seo-m2-t2",
      reviewTopicTitle: "Titles, headings and meta descriptions that earn the click",
      options: [
        { id: "a", label: "The title element", correct: true, feedback: "Correct. It is the first thing a searcher reads." },
        { id: "b", label: "The alt text of the first image", feedback: "Alt text describes an image for people who cannot see it. It is not shown as a headline." },
        { id: "c", label: "The footer", feedback: "The footer repeats on every page and says little about this one." },
        { id: "d", label: "The file name of the page", feedback: "The address may be shown, but not as the headline." },
      ],
    },
    {
      question: "What makes a passage more likely to be quoted in an AI-generated answer?",
      explanation:
        "Answer engines pick passages that answer a question directly, stand on their own and come from a source they have reason to trust. A clear statement with its evidence is easier to quote than a long build-up.",
      reviewTopicId: "seo-m3-t3",
      reviewTopicTitle: "Writing content an AI answer can quote",
      options: [
        { id: "a", label: "Repeating the keyword in every sentence", feedback: "Repetition makes a passage harder to read and no easier to quote." },
        { id: "b", label: "Hiding the answer at the end of a long introduction", feedback: "A passage that needs the whole page to make sense is rarely quoted." },
        {
          id: "c",
          label: "Answering the question directly in a passage that makes sense on its own",
          correct: true,
          feedback: "Correct. A direct, self-contained answer with its evidence is what gets quoted.",
        },
        { id: "d", label: "Publishing the page without an author or a date", feedback: "A named author and a date are signals of trust. Removing them does not help." },
      ],
    },
  ],
  articles: {
    "seo-m1-t2": {
      lede: "Before a page can appear for a search, three things have to happen: the search engine has to find it, understand it, and decide it deserves a place among the results. These steps are called crawling, indexing and ranking. Almost every task in this course improves one of the three, so it pays to know which.",
      sections: [
        {
          heading: "Crawling: finding the page",
          paragraphs: [
            "A search engine discovers pages with a program called a crawler, which follows links from pages it already knows and reads the lists of addresses that sites publish as sitemaps. If no link and no sitemap points to a page, the crawler has no way to reach it.",
            "A site can also tell crawlers where not to go, with a small file of rules at its root. This is useful for keeping a basket page or an internal search out of the way. It is also a common accident: one wrong line can close a whole site to crawlers. Module 2 shows you how to check.",
          ],
        },
        {
          heading: "Indexing: understanding the page",
          paragraphs: [
            "Once fetched, the page is read: its title, its headings, its text, its images and the links on it. The search engine works out what the page is about and stores it in its index, a very large catalogue of pages.",
            "Not every crawled page is indexed. A page that copies another, says very little, or asks not to be indexed is left out. A page that is not in the index cannot appear for any search, however good it is. So the first question about a page that gets no visits is not “why does it rank badly?” but “is it indexed?”",
          ],
        },
        {
          heading: "Ranking: choosing the order",
          paragraphs: [
            "When someone searches, the engine picks pages from its index and puts them in order. It weighs many signals, and they come down to three questions. Does the page match what the person is looking for? Is it helpful and trustworthy? Does it work well on the device in their hand?",
            "No one outside the search engine knows the exact weights, and they change. What does not change is the direction: the engine is trying to give the searcher the best answer. Work that makes a page the best answer for a query lasts. Tricks aimed at the weights tend to stop working.",
            "AI answers add a step and do not replace these three. An answer engine still has to find, read and trust a page before it can quote it. Module 3 returns to this.",
          ],
        },
      ],
      pullQuote: {
        text: "A page that is not in the index cannot rank for anything, however good it is.",
        attribution: "Course notes, Module 1",
      },
      takeaways: [
        "Crawling finds a page through links and sitemaps. No link, no visit.",
        "Indexing stores what the page is about. Thin or copied pages are left out.",
        "Ranking orders indexed pages by match, helpfulness and usability.",
        "When a page gets no search visits, check that it is indexed before anything else.",
      ],
    },
  },
  quizzes: {
    "seo-m1-t10": [
      {
        question: "What is the intent behind the search “best running shoes for flat feet”?",
        platformPrompt: "Choose the correct option",
        hints: [
          "Is the person ready to buy one named product, or still choosing?",
          "Words such as “best”, “top” and “compare” point to weighing options.",
        ],
        explanation:
          "This is commercial intent: the person plans to buy and is comparing options first. A comparison or a buying guide fits it better than a single product page.",
        reviewTopicId: "seo-m1-t4",
        reviewTopicTitle: "Search intent: informational, navigational, commercial and transactional",
        options: [
          { id: "a", label: "Navigational", feedback: "A navigational search looks for one known site or page. No brand is named here." },
          { id: "b", label: "Commercial", correct: true, feedback: "Correct. They intend to buy and are still comparing." },
          { id: "c", label: "Transactional", feedback: "A transactional search is ready to act, for example “buy” plus a named model." },
          { id: "d", label: "Informational", feedback: "Close, but “best” plus a product type signals a purchase being weighed, not only a question." },
        ],
      },
      {
        question: "A small plant shop can target one of these keywords first. Which is the best choice?",
        platformPrompt: "Choose the correct option",
        explanation:
          "A good first keyword is one the site can realistically rank for and that brings people likely to buy. A specific phrase with modest volume usually beats a broad one that large sites already own.",
        reviewTopicId: "seo-m1-t8",
        reviewTopicTitle: "Volume, difficulty and business value: choosing keywords",
        options: [
          { id: "a", label: "“plants”: very high volume, very high difficulty", feedback: "Too broad and too contested. Even a visit from it rarely means a sale." },
          {
            id: "b",
            label: "“low light indoor plants for offices”: modest volume, low difficulty, matches a product range",
            correct: true,
            feedback: "Correct. Reachable, specific, and the searcher wants something the shop sells.",
          },
          { id: "c", label: "“photosynthesis explained”: high volume, medium difficulty", feedback: "Plenty of searches, and almost none from people looking to buy a plant." },
          { id: "d", label: "The name of a large competitor", feedback: "People searching for a competitor by name want that competitor." },
        ],
      },
      {
        question: "You ask an AI assistant for keyword ideas and it returns sixty phrases with monthly search volumes. What do you do with the volumes?",
        explanation:
          "An assistant is good at suggesting phrases and grouping them. It has no access to search data unless a tool gives it some, so the volumes it writes are guesses. Take the phrases, and get the numbers from a keyword tool or your own search report.",
        reviewTopicId: "seo-m1-t7",
        reviewTopicTitle: "Building a seed list and expanding it with an AI assistant",
        options: [
          { id: "a", label: "Use them to pick the top ten keywords.", feedback: "The volumes may be invented. Decisions need real data." },
          {
            id: "b",
            label: "Keep the phrases and check the volumes in a keyword tool or a search report.",
            correct: true,
            feedback: "Correct. The assistant supplies ideas, the data source supplies numbers.",
          },
          { id: "c", label: "Ask the assistant to confirm they are accurate.", feedback: "It has no data to check against and will often simply agree." },
          { id: "d", label: "Discard the whole list.", feedback: "The phrases are still useful. Only the numbers need a real source." },
        ],
      },
    ],
  },
  assignments: {
    "seo-m1-t11": {
      brief:
        "Build a keyword map for the sample site in the Handouts, a small online plant shop, or for a site of your own if you can see its search report. Start from a seed list of ten phrases and expand it with an AI assistant to at least thirty keywords. Label the intent of each one, check its volume and difficulty in a keyword tool or in the search report, and group the keywords into four to six topic clusters. For each cluster, name the page that should rank for it: one that exists, or one that needs to be written. Submit the map as a PDF or DOCX, with a short note on how you used the assistant and what you corrected.",
      requirements: [
        "At least thirty keywords, each with intent, volume and difficulty",
        "Four to six clusters, each matched to one existing or planned page",
        "A note of up to 150 words on your prompts and what you changed in the output",
        "Counts toward your final grade",
      ],
    },
  },
  ora: {},
};
