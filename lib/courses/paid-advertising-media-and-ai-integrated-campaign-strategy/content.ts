import type { CourseContent } from "@/lib/courses/kit";

export const content: CourseContent = {
  byline: {
    author: "Rajesh Menon",
    role: "Lead instructor · AI Augmented Digital Marketing",
    updated: "September 2026",
  },
  quiz: [
    {
      question: "In a search ad auction, what decides the position of an ad?",
      platformPrompt: "Choose the correct option",
      explanation:
        "Ad rank combines the bid with the quality of the ad and of its landing page. A relevant ad with a lower bid can appear above a weaker ad with a higher one, and pay less per click.",
      reviewTopicId: "paid-m1-t3",
      reviewTopicTitle: "How an ad auction works: bids, quality and rank",
      options: [
        { id: "a", label: "The highest bid alone", feedback: "The bid is one part. Quality is the other, and it can outweigh a higher bid." },
        { id: "b", label: "The bid together with the quality of the ad and its landing page", correct: true, feedback: "Correct. Rank is bid and quality combined." },
        { id: "c", label: "How long the advertiser has had an account", feedback: "The age of the account is not what the auction ranks." },
        { id: "d", label: "The size of the monthly budget", feedback: "The budget limits how often you enter auctions, not where you rank in one." },
      ],
    },
    {
      question: "A campaign spent 500 and produced 2,000 in revenue. What is its return on ad spend?",
      platformPrompt: "Choose the correct option",
      explanation:
        "Return on ad spend is revenue divided by spend: 2,000 ÷ 500 = 4, usually written as 4:1 or 400%.",
      reviewTopicId: "paid-m3-t4",
      reviewTopicTitle: "Return on ad spend, cost per acquisition and incrementality",
      options: [
        { id: "a", label: "0.25", feedback: "That is spend divided by revenue. Turn it around." },
        { id: "b", label: "2.5", feedback: "Check the division: 2,000 ÷ 500." },
        { id: "c", label: "4", correct: true, feedback: "Correct. Every unit spent brought back four in revenue." },
        { id: "d", label: "1,500", feedback: "That is revenue minus spend, not the return on ad spend, which is a ratio." },
      ],
    },
    {
      question: "You hand a campaign to automated bidding. Which of these stays your decision?",
      explanation:
        "Automation chooses bids and placements within the limits you give it. The goal, the budget, the conversion you count and the exclusions that protect the brand are set by you, and reviewed by you.",
      reviewTopicId: "paid-m3-t11",
      reviewTopicTitle: "Automated campaign types: what you control and what you do not",
      options: [
        { id: "a", label: "The bid in each individual auction", feedback: "That is exactly what automated bidding takes over." },
        {
          id: "b",
          label: "The goal, the budget and the limits the campaign must respect",
          correct: true,
          feedback: "Correct. You set the target and the guardrails. The system works inside them.",
        },
        { id: "c", label: "Nothing: the system decides everything", feedback: "A system with no goal and no limits spends money without direction." },
        { id: "d", label: "The exact minute each ad is shown", feedback: "Timing at that level is left to the system." },
      ],
    },
  ],
  articles: {
    "paid-m1-t2": {
      lede: "Paid media is attention you rent. The moment the budget stops, the visits stop with it. That makes it the fastest channel to switch on and the easiest one to waste money in. This reading places paid media beside the channels you already know and sets out when it earns its cost.",
      sections: [
        {
          heading: "What you are buying",
          paragraphs: [
            "With owned media you build an audience over time, and with earned media other people bring it to you. Paid media skips the wait. You pay a platform to put a message in front of people you choose: people searching for a phrase, people who match an audience, people who visited your site last week.",
            "You pay in one of three ways: for each thousand times the ad is shown, for each click, or for each action such as a sale or a sign-up. The model you choose should follow the objective. If the aim is to be known, pay for views. If the aim is visits or sales, pay for clicks or actions.",
          ],
        },
        {
          heading: "What paid media is good at",
          paragraphs: [
            "Speed: a campaign can be live the same day, where a new page may take months to rank in search. Control: you choose who sees the ad, where, when, and how much you are willing to spend. Evidence: within days you know which message brought clicks and which brought sales.",
            "That makes paid media a good way to test. A headline that wins in an ad is a strong candidate for a page title or an email subject line. A product that does not sell with paid visits is unlikely to sell with organic ones.",
          ],
        },
        {
          heading: "What it will not do",
          paragraphs: [
            "It will not fix a weak offer or a slow, confusing page. An ad can bring the right person to the door. What happens after the click depends on the page and the product, and you pay for the click either way.",
            "It will not build anything that lasts on its own. A plan that relies only on paid visits pays again for every customer, every month. The strongest plans use paid media to start, to test and to scale what works, while owned and earned channels grow underneath.",
            "And it will not run itself. Platforms now automate bidding, placements and even the creative. You still decide the goal, the budget, what counts as a conversion and where the brand must not appear. Module 3 calls these the guardrails.",
          ],
        },
      ],
      pullQuote: {
        text: "An ad brings the right person to the door. The page and the product decide what happens next.",
        attribution: "Course notes, Module 1",
      },
      takeaways: [
        "Paid media is rented attention: fast to start, gone when the budget stops.",
        "Choose the pricing model from the objective: views, clicks or actions.",
        "Use paid campaigns to test messages and offers before you invest elsewhere.",
        "Automation works inside the goal, budget and limits that you set.",
      ],
    },
  },
  quizzes: {
    "paid-m1-t14": [
      {
        question: "Two advertisers bid on the same search. A bids 2.00 with a low quality score. B bids 1.50 with a high quality score. What can happen?",
        platformPrompt: "Choose the correct option",
        hints: [
          "Position is not decided by the bid alone.",
          "Think about what the platform wants the searcher to see.",
        ],
        explanation:
          "Ad rank combines bid and quality. A more relevant ad and landing page can outrank a higher bid, because the platform earns only when people find the ad worth clicking.",
        reviewTopicId: "paid-m1-t3",
        reviewTopicTitle: "How an ad auction works: bids, quality and rank",
        options: [
          { id: "a", label: "A always appears above B, because A bids more.", feedback: "The bid is only one part of ad rank." },
          { id: "b", label: "B can appear above A, and pay less per click.", correct: true, feedback: "Correct. Quality can outweigh a higher bid." },
          { id: "c", label: "Neither ad is shown.", feedback: "Both are eligible. The auction decides their order." },
          { id: "d", label: "They are shown in alphabetical order.", feedback: "The order comes from ad rank, not from the names." },
        ],
      },
      {
        question: "A shop sells running shoes only. Its search terms report shows clicks from “free running shoes giveaway”. What is the right fix?",
        platformPrompt: "Choose the correct option",
        explanation:
          "A negative keyword stops ads from showing on searches that include it. Adding “free” and “giveaway” as negatives removes clicks that cannot become sales, without touching the keywords that work.",
        reviewTopicId: "paid-m1-t8",
        reviewTopicTitle: "Negative keywords and the search terms report",
        options: [
          { id: "a", label: "Raise the bid on “running shoes”.", feedback: "That buys more of the same unwanted clicks." },
          { id: "b", label: "Pause the whole campaign.", feedback: "That also stops the searches that do lead to sales." },
          {
            id: "c",
            label: "Add “free” and “giveaway” as negative keywords.",
            correct: true,
            feedback: "Correct. The ads stop showing on searches that cannot convert.",
          },
          { id: "d", label: "Change the ad headline to mention a giveaway.", feedback: "The shop is not running one. The ad would promise something the page does not offer." },
        ],
      },
      {
        question: "An AI assistant drafts a search ad headline: “The cheapest running shoes online, guaranteed”. What do you check before using it?",
        explanation:
          "A superlative or a guarantee in an ad is a claim. It must be true, the landing page must back it up, and it must be allowed by the advertising policy of the platform. If any of the three fails, reword it.",
        reviewTopicId: "paid-m1-t9",
        reviewTopicTitle: "Writing search ads with an AI assistant",
        options: [
          { id: "a", label: "Only that it fits the character limit.", feedback: "Length matters, and it is the least of the problems here." },
          {
            id: "b",
            label: "That the claim is true, that the landing page supports it and that the platform's policy allows it.",
            correct: true,
            feedback: "Correct. You answer for every claim in an ad you publish.",
          },
          { id: "c", label: "Nothing: the assistant knows the advertising rules.", feedback: "It does not know your prices or the current policy. It writes what sounds persuasive." },
          { id: "d", label: "That it contains the keyword at least twice.", feedback: "Repeating a keyword does not make a claim acceptable." },
        ],
      },
    ],
  },
  assignments: {
    "paid-m1-t15": {
      brief:
        "Plan one search campaign for the sample online shop in the Handouts, or for a business you know. State the objective and the monthly budget. Build three ad groups, each around one theme, with five to ten keywords and their match types and at least three negative keywords. For each ad group, write two ads: draft them with an AI assistant from a short brief, then edit them, and include the prompt you used. Name the landing page each ad group sends people to and say why it matches the ads. Submit the plan as a PDF or DOCX.",
      requirements: [
        "One objective with a number, a monthly budget and the bid strategy you would choose",
        "Three ad groups: keywords with match types, negatives and two edited ads each",
        "The prompt behind the ads and a note on what you changed in the drafts",
        "Counts toward your final grade",
      ],
    },
  },
  ora: {},
};
