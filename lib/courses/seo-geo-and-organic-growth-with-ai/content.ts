import type { CourseContent } from "@/lib/courses/kit";
import { activities } from "./activities";

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
    "seo-m1-t4": {
      lede: "Two people can type nearly the same words and want different things. One wants to learn, one wants to find a site, one is comparing, one is ready to pay. Search engines try to work out which, and they rank pages that match. This reading describes the four kinds of intent and how to recognise each.",
      sections: [
        {
          heading: "Informational and navigational",
          paragraphs: [
            "An informational search asks a question: “why are my plant's leaves turning yellow”, “how to repot an orchid”. The person wants an answer, not a product. Guides, explanations and step-by-step articles fit. A product page almost never ranks here, however good it is.",
            "A navigational search looks for one known place: a brand name, a login page, a shop's name followed by “returns”. The person has already chosen. You should appear first for your own name, and there is little to gain from chasing someone else's.",
          ],
        },
        {
          heading: "Commercial and transactional",
          paragraphs: [
            "A commercial search weighs options before a purchase: “best indoor plants for low light”, “ceramic or plastic pots”. Words such as best, top, review, compare and versus are the usual signs. Comparisons and buying guides fit.",
            "A transactional search is ready to act: “buy monstera online”, “plant delivery today”, a product name with “price” or “discount”. Category pages and product pages fit. An article here is in the way.",
          ],
        },
        {
          heading: "How to tell which it is",
          paragraphs: [
            "Read the words first, then check the results page. If the first results for a query are all guides, the search engine has learned that people asking it want to learn. If they are all shops, people want to buy. The results page is the best evidence you have, and it costs nothing.",
            "Some queries are mixed. “Snake plant” alone may show care guides, shops and images together, because different people mean different things by it. Mixed queries are harder to rank for. A more specific phrase usually has one clear intent and less competition.",
          ],
        },
        {
          heading: "Why it decides what you write",
          paragraphs: [
            "Intent tells you the type of page before you write a word. A page that ignores it does not rank, whatever else you do well. A shop that wants to appear for “how to repot an orchid” needs a guide, and can link from the guide to its pots.",
            "It also tells you what to expect. Informational pages bring many visitors, and few buy that day. Transactional pages bring fewer, and more of them buy. A healthy site has both, and links them.",
          ],
        },
      ],
      pullQuote: {
        text: "The keyword tells you the topic. The intent tells you what kind of page to build.",
        attribution: "Course notes, Module 1",
      },
      takeaways: [
        "Informational: wants to know. Navigational: wants one site. Commercial: is comparing. Transactional: is ready to act.",
        "Check the live results page to see which intent the search engine has settled on.",
        "Match the page type to the intent before writing anything.",
        "Informational pages bring reach, transactional pages bring orders; link one to the other.",
      ],
    },
    "seo-m1-t8": {
      lede: "A keyword list of two hundred phrases is not a plan. You can write perhaps four good pages a month, so you have to choose. Three measures do most of the choosing: how many people search for the phrase, how hard it is to rank for, and what a visit is worth to the business.",
      sections: [
        {
          heading: "Volume: how many people ask",
          paragraphs: [
            "Search volume is an estimate of how many times a phrase is searched in a month, in a given country. Keyword tools calculate it from samples, and two tools will often disagree. Use it to compare phrases with one another, not as a forecast of visits.",
            "Even the first result receives only a share of the searches, and answer boxes and ads take part of the rest. A phrase with 1,000 searches a month might send the top page a few hundred visits. Lower positions get far less.",
          ],
        },
        {
          heading: "Difficulty: who is already there",
          paragraphs: [
            "Keyword tools give a difficulty score, usually from 0 to 100, based mostly on how many links point to the pages that rank today. Treat it as a first filter. Then look for yourself: search the phrase and read the first page of results.",
            "If every result is a national retailer or a large publisher, a new site will wait a long time. If you see forum threads, thin pages or sites the size of yours, there is room. That reading of the results page is worth more than the score.",
          ],
        },
        {
          heading: "Business value: what a visit is worth",
          paragraphs: [
            "A simple scale is enough. Score 3 if the searcher wants something you sell. Score 2 if your product is one sensible answer to their problem. Score 1 if the topic is related and a sale is unlikely. Score 0 if you have nothing for them.",
            "For the plant shop, “buy low light plants online” is a 3. “Plants for a dark hallway” is a 2. “Why do leaves turn yellow” is a 1: useful for reach and trust, unlikely to sell that day. “Plant cell diagram” is a 0, whatever its volume.",
          ],
        },
        {
          heading: "Choosing with all three",
          paragraphs: [
            "Put the three in one table and sort. The best first targets have a value of 2 or 3, a difficulty your site can meet, and enough volume to matter. For a small site these are usually longer, specific phrases: fewer searches each, and far more of them within reach.",
            "High-volume, high-difficulty phrases are not thrown away. They become the long-term goal of a cluster of pages, which is the subject of the next reading.",
          ],
        },
      ],
      pullQuote: {
        text: "A keyword you cannot rank for and a keyword that cannot sell are equally poor choices, however large the number beside them.",
        attribution: "Course notes, Module 1",
      },
      takeaways: [
        "Volume is an estimate for comparing phrases; it is not a forecast of visits.",
        "Check difficulty by reading the results page, not only by the score.",
        "Score business value from 0 to 3 by how close the search is to something you sell.",
        "Start with specific phrases of real value that your site can reach.",
      ],
    },
    "seo-m1-t9": {
      lede: "After choosing keywords, the natural mistake is to write one page for each. Search engines do not rank phrases. They rank pages for needs, and many phrases express the same need. A topic cluster groups keywords so that each page has one job and the pages support one another.",
      sections: [
        {
          heading: "One page per need, not per keyword",
          paragraphs: [
            "“How often to water a snake plant”, “snake plant watering schedule” and “when to water snake plant” are one question. One good page can rank for all three. Three separate pages would compete with each other and split whatever links and visits they earn. This is called cannibalisation.",
            "The test is the results page. Search two phrases. If mostly the same pages rank for both, the search engine treats them as one need, and so should you. If the results differ, they deserve separate pages.",
          ],
        },
        {
          heading: "Pillar and supporting pages",
          paragraphs: [
            "A cluster has one broad page, often called the pillar, and several narrower pages around it. For the plant shop, the pillar might be a complete guide to low-light indoor plants. Supporting pages go deeper: the best plants for a windowless bathroom, how to tell if a plant needs more light, care for one named species.",
            "The pillar targets the broad, harder phrase. The supporting pages target the specific, easier ones. Each supporting page links to the pillar, and the pillar links to each of them.",
          ],
        },
        {
          heading: "Why clusters work",
          paragraphs: [
            "For the reader, a cluster means the next question is one click away. For the search engine, the links show that the site covers the subject in depth, and they pass authority from the pages that rank early to the pillar that ranks late.",
            "Clusters also make planning simpler. In place of two hundred keywords you manage five or six subjects, each with a list of pages that exist and pages still to write.",
          ],
        },
        {
          heading: "Building the map",
          paragraphs: [
            "An AI assistant is a good first sorter. Give it the keyword list and ask it to group phrases that one page could satisfy, and to name each group. Then correct it: check doubtful pairs against the results page, and move commercial phrases away from informational ones even when the topic is the same.",
            "Record the result as a keyword map: one row per page, with its main keyword, its secondary keywords, the intent, and the address of the page or the word “new”. This map is what you submit in Assignment 01.",
          ],
        },
      ],
      pullQuote: {
        text: "Many phrases, one need, one page.",
        attribution: "Course notes, Module 1",
      },
      takeaways: [
        "Phrases that return the same results belong on one page.",
        "A cluster is one broad pillar page with narrower pages linked to and from it.",
        "Supporting pages rank sooner and lift the pillar over time.",
        "The keyword map lists each page with its main keyword, secondary keywords and intent.",
      ],
    },
    "seo-m2-t2": {
      lede: "Ranking puts your page on the results page. The title and the description decide whether anyone clicks it. They are the only parts of your page a searcher reads before choosing, and they take a few minutes to write well. This reading covers each one, and the headings that take over once the visitor arrives.",
      sections: [
        {
          heading: "The title tag",
          paragraphs: [
            "The title tag is the clickable headline of the result. Put the main keyword near the start, say what the page offers, and stop before it is cut off: about 50 to 60 characters is a safe length. Every page on the site needs a title of its own.",
            "Compare “Home | Green Corner” with “Low-Light Indoor Plants: 12 That Thrive in Shade | Green Corner”. The second names the topic, makes a specific promise and still shows the brand. Search engines sometimes rewrite a title they judge unhelpful, and a clear, accurate one is the best protection against that.",
          ],
        },
        {
          heading: "The meta description",
          paragraphs: [
            "The description is the short text under the title. It does not affect ranking directly. It affects whether the result gets clicked, and a result that gets clicked is doing its job.",
            "Write it as a short pitch of up to about 155 characters: what the page contains, for whom, and one reason to choose it. Use the words of the query, because search engines show matching words in bold. If you leave it empty, the search engine picks a passage from the page, and it does not always pick well.",
          ],
        },
        {
          heading: "Headings on the page",
          paragraphs: [
            "The main heading, the H1, confirms that the visitor has landed in the right place. It can be longer and warmer than the title tag, and it should say the same thing. Use one H1 per page.",
            "Subheadings, H2 and H3, divide the page into parts a reader can scan. Write them as statements or as the questions people ask: “How much light does a snake plant need?” is a better heading than “Light”. Clear question headings are also what answer boxes and AI summaries tend to lift.",
          ],
        },
        {
          heading: "Drafting with an AI assistant",
          paragraphs: [
            "This is a good task to share. Give the assistant the main keyword, the intent and the page's outline, and ask for ten titles under 60 characters and five descriptions under 155. Count the characters yourself: assistants are unreliable at counting.",
            "Then check each candidate against the page. A title that promises “12 plants” above an article that lists nine earns the click and loses the visitor. The promise in the result and the content of the page have to match.",
          ],
        },
      ],
      pullQuote: {
        text: "The title earns the click. The page has to deserve it.",
        attribution: "Course notes, Module 2",
      },
      takeaways: [
        "Title tag: main keyword early, a specific promise, about 50 to 60 characters, unique per page.",
        "Meta description: a pitch of up to about 155 characters; it earns clicks, not rank.",
        "One H1 that matches the title; subheadings written as the questions readers ask.",
        "Let an assistant draft options, then count the characters and check the promise.",
      ],
    },
    "seo-m3-t2": {
      lede: "More searches now end with a written answer: a summary at the top of a results page, or a reply from an AI assistant that names a few sources. Generative engine optimization, GEO, is the work of being one of those sources. This reading sets it beside SEO, so that you can see which habits carry over and which need to change.",
      sections: [
        {
          heading: "How an answer engine uses your page",
          paragraphs: [
            "A classic search engine ranks whole pages and shows a list of them. An answer engine does something different with the same material. It retrieves a set of pages, takes passages from several, and writes one reply. Your page may supply a sentence without being visited at all.",
            "So the unit of competition gets smaller. In SEO you compete to be the best page for a query. In GEO you compete to hold the clearest passage on a point, on a site the engine has reason to trust.",
          ],
        },
        {
          heading: "What stays the same",
          paragraphs: [
            "The foundations are shared. A page that cannot be crawled cannot be quoted. A page that is slow, thin or copied is passed over by both systems. Expertise, a named author, dates and sources count in both, and so do links and mentions from respected sites.",
            "This is why the course teaches them together. Most of what Module 2 asked of you is the entry ticket to GEO as well.",
          ],
        },
        {
          heading: "What changes",
          paragraphs: [
            "Structure matters more. Passages that state a point completely in two or three sentences are easy to lift. A point spread across a page of storytelling is not. Put the direct answer first, then the explanation.",
            "Being mentioned matters more. Answer engines learn what a brand is from everything written about it across the web, not only from its own site. A consistent description of who you are and what you sell, repeated on your profiles, in directories and in the press, makes you easier to name.",
            "And measurement changes. An answer that names you may send no click. Rankings and visits still count, and beside them you now track whether assistants mention the brand and whether what they say is right.",
          ],
        },
        {
          heading: "What not to do",
          paragraphs: [
            "Do not treat GEO as a new set of tricks. Hidden text aimed at AI crawlers, pages stuffed with questions nobody asks, and invented statistics added to look quotable all fail the same way old SEO tricks did, and the last one damages trust with readers too.",
            "The honest summary is short. Be the clearest, best-supported source on your subject, and make that easy for a machine to see.",
          ],
        },
      ],
      pullQuote: {
        text: "SEO asks whether your page is the best result. GEO asks whether your sentence is the best source.",
        attribution: "Course notes, Module 3",
      },
      takeaways: [
        "Answer engines assemble a reply from passages; you compete at the level of the passage.",
        "Crawlability, quality, expertise and reputation count in both SEO and GEO.",
        "For GEO, lead with the answer, keep passages self-contained and describe the brand consistently everywhere.",
        "Track mentions and their accuracy beside rankings and visits.",
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
    "seo-m1-t12": [
      {
        question: "A page was published a month ago and does not appear for any search, even for its exact title. Which step has most likely not happened?",
        platformPrompt: "Choose the correct option",
        explanation:
          "A page has to be crawled and added to the index before it can rank. If it appears for nothing at all, check first whether it is indexed.",
        reviewTopicId: "seo-m1-t2",
        reviewTopicTitle: "How a search engine crawls, indexes and ranks",
        options: [
          { id: "a", label: "Ranking", feedback: "A page that is indexed and ranks poorly still appears somewhere for its exact title." },
          { id: "b", label: "Indexing", correct: true, feedback: "Correct. A page that is not in the index cannot be shown for any query." },
          { id: "c", label: "Keyword research", feedback: "Research helps you choose topics. It does not decide whether a page can be shown at all." },
          { id: "d", label: "Link building", feedback: "Links help a page rank higher. They are not required for it to appear for its own title." },
        ],
      },
      {
        question: "You search a keyword and the results page shows a row of products with prices, several shop category pages and a map. What does this tell you?",
        platformPrompt: "Choose the correct option",
        explanation:
          "The layout of a results page reflects what the search engine has learned people want. Products, shops and maps signal a purchase, so the matching page is a category or product page.",
        reviewTopicId: "seo-m1-t3",
        reviewTopicTitle: "Reading a results page: links, snippets and AI answers",
        options: [
          { id: "a", label: "A long guide is the best page to write", feedback: "Guides win where the results page shows answers and articles. This page shows shops." },
          {
            id: "b",
            label: "People searching it mostly want to buy, so a category or product page fits",
            correct: true,
            feedback: "Correct. The layout shows the intent the search engine has settled on.",
          },
          { id: "c", label: "The keyword has no competition", feedback: "Product rows and shop pages show that retailers are competing for it." },
          { id: "d", label: "The search engine could not work out the intent", feedback: "The layout is consistent: products, shops, a map. The intent is clear." },
        ],
      },
      {
        question: "“Monstera care”, “how to care for a monstera” and “monstera plant care guide” return almost the same results. How should you treat them?",
        explanation:
          "When the same pages rank for several phrases, the search engine treats them as one need. One page should target them, with one main keyword and the rest as secondary keywords.",
        reviewTopicId: "seo-m1-t9",
        reviewTopicTitle: "Grouping keywords into topic clusters",
        options: [
          { id: "a", label: "Write three pages, one per phrase", feedback: "Three pages for one need compete with each other and split their links." },
          {
            id: "b",
            label: "Target all three with one page",
            correct: true,
            feedback: "Correct. The same results mean one need, and one good page can rank for all of them.",
          },
          { id: "c", label: "Pick one phrase and ignore the others", feedback: "You can keep all three: use the others as secondary keywords on the same page." },
          {
            id: "d",
            label: "Put each phrase in a different cluster",
            feedback: "They are the same need, so they belong on the same page, not only in the same cluster.",
          },
        ],
      },
    ],
    "seo-m2-t11": [
      {
        question: "A shop's test site is launched as the live site. A week later no page appears in search. What do you check first?",
        platformPrompt: "Choose the correct option",
        hints: [
          "Which file can keep a crawler out of an entire site with one rule?",
          "Test sites are often blocked on purpose.",
        ],
        explanation:
          "When a whole site is missing, look for something that blocks everything: a rule in the robots file or a noindex tag carried over from the test version.",
        reviewTopicId: "seo-m2-t7",
        reviewTopicTitle: "Crawling and indexing: robots rules, sitemaps and canonical tags",
        options: [
          {
            id: "a",
            label: "Whether the meta descriptions are too long",
            feedback: "A long description is cut off in the result. It does not remove a page from search.",
          },
          {
            id: "b",
            label: "Whether the robots file still blocks the whole site",
            correct: true,
            feedback: "Correct. A blanket rule left over from testing stops crawlers at the door.",
          },
          {
            id: "c",
            label: "Whether the images have alternative text",
            feedback: "Missing alternative text weakens image search and accessibility. It does not hide the site.",
          },
          {
            id: "d",
            label: "Whether the site has enough links from other sites",
            feedback: "Links affect how well pages rank, not whether an open site can be crawled at all.",
          },
        ],
      },
      {
        question: "Which title tag is best for a guide to repotting houseplants on the site of a shop called Green Corner?",
        platformPrompt: "Choose the correct option",
        explanation:
          "A good title puts the main keyword early, says what the page offers, fits in about 50 to 60 characters and is unique on the site.",
        reviewTopicId: "seo-m2-t2",
        reviewTopicTitle: "Titles, headings and meta descriptions that earn the click",
        options: [
          { id: "a", label: "Home", feedback: "It names neither the topic nor the brand, and probably repeats on other pages." },
          { id: "b", label: "Repotting repot plants repotting guide repot houseplant", feedback: "Repeating the keyword reads as spam to people and to search engines." },
          {
            id: "c",
            label: "How to Repot a Houseplant in 6 Steps | Green Corner",
            correct: true,
            feedback: "Correct. Keyword first, a specific promise, the brand, and about fifty characters.",
          },
          {
            id: "d",
            label: "Everything you could ever want to know about moving your beloved plants into new pots at home",
            feedback: "It buries the keyword and will be cut off long before the end.",
          },
        ],
      },
      {
        question: "One product can be reached at four addresses because of filters and tracking codes. What tells the search engine which address should rank?",
        explanation:
          "The canonical tag names the preferred address among near-identical pages, so that ranking signals are gathered on one page.",
        reviewTopicId: "seo-m2-t7",
        reviewTopicTitle: "Crawling and indexing: robots rules, sitemaps and canonical tags",
        options: [
          { id: "a", label: "The meta description", feedback: "The description is the text under the title in a result. It says nothing about duplicates." },
          { id: "b", label: "The sitemap alone", feedback: "Listing the main address helps, but the sitemap does not say what the other three are." },
          {
            id: "c",
            label: "A canonical tag on each version, pointing to the main address",
            correct: true,
            feedback: "Correct. It names the preferred version and gathers the links of the others.",
          },
          { id: "d", label: "A longer title on the main version", feedback: "Title length does not tell a search engine which duplicate to prefer." },
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
    "seo-m2-t13": {
      brief:
        "Audit one page against the on-page checklist from this module. Use a page of the sample plant shop in the Handouts, or a page of your own site that targets a keyword from your Assignment 01 map. Record what you find for the address, the title tag, the meta description, the headings, the opening paragraph, the images, the internal links and whether the page can be indexed. For each item, say what is there now, what is wrong with it and what you would change. Then write the new title tag and meta description in full, and rank your changes by expected effect. Submit the audit as a PDF or DOCX.",
      requirements: [
        "The page's address, its main keyword and the intent it should serve",
        "Eight checklist items, each with the finding, the problem and the fix",
        "A rewritten title tag of up to 60 characters and a meta description of up to 155",
        "The three changes you would make first, with your reason",
        "Counts toward your final grade",
      ],
    },
  },
  ora: {},
  activities,
};
