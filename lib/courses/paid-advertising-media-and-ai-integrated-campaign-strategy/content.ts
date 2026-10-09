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
    "paid-m1-t4": {
      lede: "Ad platforms charge in three main ways: for every thousand times the ad is shown, for every click, or for every action a visitor takes. The model decides who carries the risk if the ad does not work. This reading explains each one and how to compare offers priced in different ways.",
      sections: [
        {
          heading: "Cost per thousand impressions",
          paragraphs: [
            "CPM is the price of a thousand impressions, the M standing for the Latin word for thousand. An impression is one showing of the ad. With CPM you pay to be seen, whether or not anyone clicks.",
            "Spend divided by impressions, times a thousand, gives the figure: 200 spent on 50,000 impressions is a CPM of 4. It is the usual model for display, video and awareness campaigns on social platforms, where the aim is reach. The advertiser carries the risk: a dull ad costs the same as a good one.",
          ],
        },
        {
          heading: "Cost per click",
          paragraphs: [
            "With CPC you pay only when someone clicks. It is the standard model for search ads, where a click means a person with a need has chosen your answer. Spend divided by clicks gives the average: 200 spent for 250 clicks is a CPC of 0.80.",
            "The risk is shared. The platform earns nothing from an ad nobody clicks, which is one reason it rewards relevant ads in the auction. You still carry the risk of what happens after the click.",
          ],
        },
        {
          heading: "Cost per action",
          paragraphs: [
            "CPA is the cost of one result you care about: an order, a sign-up, a booked call. Few platforms sell actions directly. More often you tell an automated bidding strategy the CPA you are aiming for, and it sets click or impression bids to reach it on average.",
            "That needs reliable conversion tracking and enough conversions for the system to learn from. Without both, a target CPA is a wish.",
          ],
        },
        {
          heading: "Comparing one with another",
          paragraphs: [
            "Whatever you are charged, convert everything to the cost of a result. Suppose a display placement costs a CPM of 5. If 0.4% of impressions are clicked, a thousand impressions give 4 clicks at 1.25 each. If 2% of those visitors buy, each order costs 62.50.",
            "A search campaign at a CPC of 1.50 looks expensive beside it. But if 5% of its visitors buy, each order costs 30. The cheaper click was the dearer customer. Compare on the last number, not the first.",
          ],
        },
      ],
      pullQuote: {
        text: "The pricing model tells you what you are billed for. Only the cost of a result tells you what you paid.",
        attribution: "Course notes, Module 1",
      },
      takeaways: [
        "CPM pays for being seen, CPC for a visit, CPA for a result.",
        "The further down the funnel you pay, the more of the risk the platform shares.",
        "A target CPA needs working conversion tracking and enough conversions.",
        "Convert every offer to the cost of one result before comparing.",
      ],
    },
    "paid-m1-t8": {
      lede: "Your keywords say what you hope people search for. The search terms report shows what they typed before your ad appeared. The gap between the two is where a search budget leaks, and negative keywords are how you close it.",
      sections: [
        {
          heading: "What the report shows",
          paragraphs: [
            "For each search that triggered an ad, the report lists the words typed, the keyword it matched, and the impressions, clicks, cost and conversions that followed. Platforms hide the rarest searches for privacy reasons, so the list is never complete. It is still the most useful page in the account.",
            "Read it sorted by cost, highest first. You are looking for two things: searches that spend and never convert, and searches that convert and are not yet keywords of their own.",
          ],
        },
        {
          heading: "What a negative keyword does",
          paragraphs: [
            "A negative keyword tells the platform when not to show an ad. A shop that sells new running shoes adds “free”, “repair” and “second hand” as negatives, and stops paying for people who were never going to buy.",
            "Negatives have match types too, and they are stricter than you may expect: they do not stretch to cover close variants in the way ordinary keywords do. If you exclude “repair”, add “repairs” and “repairing” as well.",
          ],
        },
        {
          heading: "Where to put them",
          paragraphs: [
            "Some negatives apply everywhere: jobs, free, how to make. Keep those in a shared list applied to every campaign. Others apply to one ad group only, and these do a second job. Adding “trail” as a negative in the road shoes group makes sure a trail search reaches the trail ad and not the wrong one.",
            "Be careful with single words. Excluding “cheap” sounds sensible for a premium brand until you notice it also blocks “cheap delivery” and the buyers behind it. Look at the full searches a word appears in before you exclude it.",
          ],
        },
        {
          heading: "A weekly routine",
          paragraphs: [
            "In a new campaign, read the report twice a week for the first month, then weekly. Each time, add negatives for searches that are plainly irrelevant, and add converting searches as exact-match keywords so that you can write an ad for them.",
            "An AI assistant speeds up the sorting. Export the report and ask the assistant to group the searches into relevant, irrelevant and unclear. You decide on the unclear ones, and you apply the changes.",
          ],
        },
      ],
      pullQuote: {
        text: "The keyword is what you asked for. The search term is what you paid for.",
        attribution: "Course notes, Module 1",
      },
      takeaways: [
        "The search terms report lists the real searches behind your clicks; read it by cost.",
        "Negative keywords stop ads showing; add plurals and variants yourself.",
        "Use a shared list for account-wide negatives and ad group negatives to steer traffic.",
        "Promote converting searches to keywords, and review weekly.",
      ],
    },
    "paid-m1-t10": {
      lede: "An ad makes a promise in thirty characters. The landing page is where the visitor finds out whether it was true. Most wasted ad spend is lost here, after the click has been paid for. This reading describes what a landing page has to do and how to check one in a few minutes.",
      sections: [
        {
          heading: "Message match",
          paragraphs: [
            "The visitor arrives with the words of the ad still in mind. If the ad said “Trail running shoes, free 30-day returns”, the page should show trail running shoes and the returns promise before any scrolling. The same words, not a clever paraphrase.",
            "Sending every ad to the home page breaks this. The visitor asked a specific question and is handed a table of contents. Each ad group should lead to the page that answers its searches.",
          ],
        },
        {
          heading: "One page, one action",
          paragraphs: [
            "A landing page for a campaign has one job: the order, the sign-up, the booking. Decide which, and make that action the most visible thing on the page. Every additional choice lowers the share of visitors who take the one you paid for.",
            "Say what happens next. “Add to basket” and “Book a free 15-minute call” are clear. “Submit” and “Learn more” are not.",
          ],
        },
        {
          heading: "Reasons to believe",
          paragraphs: [
            "A stranger who clicked an ad owes you no trust. Give evidence near the action: reviews with a number and a rating, the price with delivery costs included, the returns policy in one line, and a way to reach a person.",
            "Keep forms short. Each field you add is a reason to leave. Ask only for what you need to fulfil this request. The rest can wait until the person is a customer.",
          ],
        },
        {
          heading: "Speed and small screens",
          paragraphs: [
            "Most ad clicks come from phones, often on a mobile connection. A page that takes several seconds to show its main content loses visitors who have already cost you a click each. Compress images, cut scripts you do not need, and test on a real phone, not on an office computer.",
            "A quick check for any landing page: open it on a phone from the ad itself. Within five seconds, can you say what is offered, why to trust it and what to press? If not, fix the page before raising the budget.",
          ],
        },
      ],
      pullQuote: {
        text: "The ad is a promise the page has to keep within one screen.",
        attribution: "Course notes, Module 1",
      },
      takeaways: [
        "Repeat the ad's words and offer at the top of the page.",
        "Give the page one action and make it the most visible element.",
        "Put proof, full price and returns next to the action; keep forms short.",
        "Test from the ad, on a phone, with the five-second check.",
      ],
    },
    "paid-m1-t13": {
      lede: "Two advertisers can hold the same position and pay different prices for it. The difference is quality: the platform's estimate of how useful your ad will be to the person searching. Raise it, and the same budget buys more clicks. This reading explains what is measured and what you can do about each part.",
      sections: [
        {
          heading: "What the platform estimates",
          paragraphs: [
            "Search platforms describe quality in three parts. Expected click-through rate: how likely this ad is to be clicked for this search, compared with others in the same position. Ad relevance: how closely the ad matches what was searched. Landing page experience: how useful and usable the page is for someone who clicks.",
            "Many platforms show a quality score from 1 to 10 for each keyword. It is a summary for diagnosis, not the number used in the auction, which is recalculated for every search. Use it to find weak spots, not as a target in itself.",
          ],
        },
        {
          heading: "Raising expected click-through rate",
          paragraphs: [
            "People click the ad that looks like the answer to what they typed. Put the words of the search in a headline. State a concrete benefit or offer. Add the extra elements platforms allow, such as links to specific pages, short highlights and a phone number: they make the ad larger and give more reasons to click.",
            "Negative keywords help here as well. Every irrelevant search that shows your ad and is ignored drags the rate down.",
          ],
        },
        {
          heading: "Raising ad relevance",
          paragraphs: [
            "Relevance is mostly a matter of structure. A small ad group of closely related keywords can have an ad written for exactly those searches. A group of forty mixed keywords cannot.",
            "If a keyword shows below-average relevance, the usual cure is to move it to its own ad group with its own ad, written around that keyword and leading to a page about it.",
          ],
        },
        {
          heading: "Improving the landing page",
          paragraphs: [
            "The page should carry on from the ad: the same product, the same offer, visible at once. It should load quickly on a phone, be easy to use, and say plainly who the business is and how to reach it. A page that sends visitors straight back to the results counts against you.",
            "These are the changes that make visitors buy as well. Work on quality is rarely wasted even if the score does not move, because the conversion rate usually does.",
          ],
        },
      ],
      pullQuote: {
        text: "A relevant ad pays less for the same place. Relevance is the one discount you can earn yourself.",
        attribution: "Course notes, Module 1",
      },
      takeaways: [
        "Quality has three parts: expected click-through rate, ad relevance, landing page experience.",
        "The visible 1 to 10 score is a diagnostic; fix the part marked below average.",
        "Tight ad groups, the searcher's words in the headline and negative keywords raise the first two.",
        "A fast page that continues the ad raises the third, and the conversion rate with it.",
      ],
    },
    "paid-m2-t2": {
      lede: "In search advertising you choose keywords and the person finds you. In paid social nobody is searching, so you choose people. Platforms offer three main ways to do it: by what people seem interested in, by lists you already hold, and by resemblance to your best customers. This reading compares them.",
      sections: [
        {
          heading: "Interest and behaviour audiences",
          paragraphs: [
            "The platform sorts its users by what they follow, watch, click and buy, and lets you select groups: people interested in trail running, new parents, people who shop online often. You can narrow by place, age range and language.",
            "These audiences are the place to start when you have no data of your own. They are also guesses made by the platform. “Interested in running” includes someone who watched one marathon clip. Expect to test several against each other and keep the one or two that convert.",
          ],
        },
        {
          heading: "Customer lists and site visitors",
          paragraphs: [
            "A custom audience is built from people you already know: a list of customers, newsletter subscribers, or visitors recorded by the platform's tag on your site. A list is matched in hashed form, so the platform does not receive readable addresses, and only people it can match will see the ad.",
            "These are small audiences that convert well, because they know you. Use them for a second purchase, a reminder, or a new product. Use them also as exclusions: there is no reason to pay for an introductory offer shown to someone who bought last week.",
            "Only upload contacts who agreed to marketing use, and say in your privacy notice that you advertise this way. Consent given for order emails does not cover it.",
          ],
        },
        {
          heading: "Lookalike audiences",
          paragraphs: [
            "A lookalike starts from a source list and asks the platform to find other users who resemble it. The quality of the source decides the result. A list of your 500 best repeat customers is a better seed than 50,000 people who once visited the home page.",
            "You choose how close the match should be. A narrow lookalike is smaller and more similar. A wide one reaches more people who are less alike. Start narrow, and widen when the narrow audience has seen the ads too often.",
          ],
        },
        {
          heading: "Broad targeting and the role of creative",
          paragraphs: [
            "Platforms increasingly do well with very little targeting: a country, an age range and a conversion goal. The delivery system then finds buyers from the way people respond to the ad itself. In that setting the creative does the targeting. An ad that opens with “New to trail running?” selects its own audience.",
            "A workable starting plan has three ad sets: one interest audience, one narrow lookalike of customers, and one broad. Give each the same ads and budget, exclude existing customers from all three, and compare the cost of a result after two weeks.",
          ],
        },
      ],
      pullQuote: {
        text: "A lookalike is only as good as the list it is asked to look like.",
        attribution: "Course notes, Module 2",
      },
      takeaways: [
        "Interest audiences need no data and are the platform's guess; test several.",
        "Customer lists and site visitors convert well, need consent and work as exclusions too.",
        "Seed lookalikes with your best customers, and start narrow.",
        "With broad targeting, the opening of the ad selects the audience.",
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
    "paid-m1-t16": [
      {
        question: "A display campaign spent 300 and was shown 60,000 times. What is its CPM?",
        platformPrompt: "Choose the correct option",
        explanation:
          "CPM is the cost of a thousand impressions: spend ÷ impressions × 1,000. Here 300 ÷ 60,000 = 0.005 per impression, or 5 per thousand.",
        reviewTopicId: "paid-m1-t4",
        reviewTopicTitle: "Pricing models: cost per thousand, per click and per action",
        options: [
          { id: "a", label: "0.005", feedback: "That is the cost of one impression. CPM is the cost of a thousand." },
          { id: "b", label: "5", correct: true, feedback: "Correct. 300 ÷ 60,000 × 1,000 = 5." },
          { id: "c", label: "50", feedback: "Check the calculation: 300 ÷ 60,000 × 1,000 gives 5." },
          { id: "d", label: "200", feedback: "That is impressions divided by spend: how many showings each unit of budget bought." },
        ],
      },
      {
        question: "The keyword is trail running shoes, on phrase match. Which search can trigger the ad?",
        platformPrompt: "Choose the correct option",
        explanation:
          "Phrase match shows the ad when a search includes the meaning of the keyword, with other words before or after it.",
        reviewTopicId: "paid-m1-t7",
        reviewTopicTitle: "Keywords and match types",
        options: [
          {
            id: "a",
            label: "best trail running shoes for women",
            correct: true,
            feedback: "Correct. The search contains the meaning of the keyword, with words added around it.",
          },
          { id: "b", label: "running shorts", feedback: "The search does not include the meaning of the keyword. Broad match might reach it; phrase match should not." },
          { id: "c", label: "trail mix recipe", feedback: "It shares one word and nothing of the meaning." },
          { id: "d", label: "shoe repair near me", feedback: "A different need altogether. Phrase match requires the meaning of the whole keyword." },
        ],
      },
      {
        question: "A new campaign gets about eight conversions a month. Which bid strategy is the most sensible starting point?",
        explanation:
          "Conversion-based strategies learn from conversion data. With very few conversions, start with a simpler goal and move to a target once tracking has collected enough results.",
        reviewTopicId: "paid-m1-t12",
        reviewTopicTitle: "Budgets, bid strategies and automated bidding",
        options: [
          { id: "a", label: "Target return on ad spend", feedback: "It needs a steady flow of conversions with values. Eight a month is too few to learn from." },
          {
            id: "b",
            label: "Target cost per acquisition, adjusted every two days",
            feedback: "There is too little data, and every change restarts the learning period.",
          },
          {
            id: "c",
            label: "Maximise clicks with a bid limit, until there are enough conversions to learn from",
            correct: true,
            feedback: "Correct. Start simple, keep tracking, and move to a conversion goal when the data allows.",
          },
          { id: "d", label: "The highest manual bid on every keyword", feedback: "That buys position at any price, with no link to results." },
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
    "paid-m2-t16": {
      brief:
        "Write the brief for a two-week paid social campaign for the sample online shop in the Handouts, or for a business you know. State one objective with a number, and the result you will count as a conversion. Define three audiences to test: one built on interests, one from a customer list or site visitors, and one lookalike or broad audience, and say whom you exclude. For one of them, write two ad concepts using hook, proof and offer, and name the format of each. Add the total budget, how you split it across the audiences, and the landing page each ad leads to. Close with a note on any step where you used an AI assistant and what you changed. Submit the brief as a PDF or DOCX.",
      requirements: [
        "One objective with a number, and the conversion you will count",
        "Three audiences, each with its source and its exclusions",
        "Two ad concepts, each with hook, proof, offer and format",
        "The budget split, the landing pages and the metric that decides the winning audience",
        "A note of up to 150 words on your use of AI",
        "Counts toward your final grade",
      ],
    },
  },
  ora: {},
};
