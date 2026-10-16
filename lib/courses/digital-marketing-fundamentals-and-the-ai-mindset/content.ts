import type { CourseContent } from "@/lib/courses/kit";
import { activities } from "./activities";

export const content: CourseContent = {
  byline: {
    author: "Rajesh Menon",
    role: "Lead instructor · Digital Marketing Fundamentals and the AI Mindset",
    updated: "June 2026",
  },
  quiz: [
    {
      question: "A brand's own website and its email newsletter are examples of which kind of media?",
      platformPrompt: "Choose the correct option",
      explanation:
        "Owned media are the channels a brand controls: its website, its app, its email list. Paid media are bought placements, and earned media are what other people say or share about the brand.",
      reviewTopicId: "dmf-m1-t3",
      reviewTopicTitle: "Owned, earned and paid media",
      options: [
        { id: "a", label: "Owned media", correct: true, feedback: "Correct. The brand controls both and pays no one for the placement." },
        { id: "b", label: "Paid media", feedback: "Paid media are placements the brand buys, such as a search ad or a sponsored post." },
        { id: "c", label: "Earned media", feedback: "Earned media come from other people: a review, a share, a press mention." },
        { id: "d", label: "Shared media", feedback: "The site and the newsletter belong to the brand alone. They are owned." },
      ],
    },
    {
      question: "A landing page had 4,000 visits and 120 purchases last month. What is its conversion rate?",
      platformPrompt: "Choose the correct option",
      explanation:
        "The conversion rate is the number of conversions divided by the number of visits: 120 ÷ 4,000 = 0.03, which is 3%.",
      reviewTopicId: "dmf-m2-t3",
      reviewTopicTitle: "The funnel and its conversion rates",
      options: [
        { id: "a", label: "0.3%", feedback: "Check the decimal point: 120 ÷ 4,000 = 0.03, and 0.03 is 3%." },
        { id: "b", label: "3%", correct: true, feedback: "Correct. 120 purchases out of 4,000 visits is 3%." },
        { id: "c", label: "30%", feedback: "That would need 1,200 purchases from 4,000 visits." },
        { id: "d", label: "33%", feedback: "That is 4,000 ÷ 120, the number of visits per purchase, not a rate." },
      ],
    },
    {
      question: "An AI assistant drafts a product description that includes a battery life figure you did not give it. What should you do?",
      explanation:
        "An assistant writes what sounds plausible, and it can produce a figure that has no source. Whoever publishes the copy answers for it, so every fact is checked against the product sheet first.",
      reviewTopicId: "dmf-m3-t6",
      reviewTopicTitle: "Bias, accuracy and made-up facts",
      options: [
        { id: "a", label: "Publish it: the assistant found the figure somewhere.", feedback: "It may have invented the figure. It cannot tell you where it came from." },
        { id: "b", label: "Ask the assistant whether the figure is right.", feedback: "It cannot check facts about your product. It will often just agree." },
        {
          id: "c",
          label: "Check the figure against the product sheet, and correct or remove it.",
          correct: true,
          feedback: "Correct. You review before anything is published.",
        },
        { id: "d", label: "Round the figure down to be safe.", feedback: "A rounded guess is still a guess. Use the figure from the product sheet." },
      ],
    },
  ],
  articles: {
    "dmf-m1-t2": {
      lede: "Digital marketing is often described as a list of tools: a website, a social account, some ads. That description misses the point. It is the work of finding the people a business can serve and earning their attention and trust through the channels they already use. This reading sets out what that covers, and what it does not.",
      sections: [
        {
          heading: "Marketing first, digital second",
          paragraphs: [
            "The questions of marketing have not changed. Who is the customer? What do they need? Why should they choose you, and how will they hear about you? A business that cannot answer these will not be rescued by a new channel or a new tool.",
            "What digital adds is reach, speed and evidence. A small bakery can be found by someone searching two streets away. A message can be changed in an afternoon. And almost every step leaves a trace: who saw the post, who clicked, who ordered. That evidence is what Module 2 of this course is about.",
          ],
        },
        {
          heading: "What it covers",
          paragraphs: [
            "The channels fall into three groups. Owned media are the ones you control: your website, your app, your email list. Paid media are placements you buy: a search ad, a sponsored post, a banner. Earned media are what others say about you: a review, a share, an article. Most plans use all three, and each one makes the others work harder.",
            "Around the channels sit the activities that feed them: understanding the customer, writing and designing content, setting objectives and measuring results. The later courses of this program take them one at a time. This course gives you the map.",
          ],
        },
        {
          heading: "What it is not",
          paragraphs: [
            "It is not the same as being present everywhere. A brand with five neglected social accounts does worse than a brand with one that it looks after. Choose channels by where your customers are, not by what is new.",
            "It is not free. Organic channels cost time and skill instead of media budget, and that time has to be planned for.",
            "And it is not automatic. AI assistants now draft copy, sort audiences and summarise reports in seconds. They do not know your customer and they do not answer for the result. Deciding what to ask for, and checking what comes back, stays with you. The course calls this the AI mindset, and Module 3 returns to it.",
          ],
        },
      ],
      pullQuote: {
        text: "A new channel does not answer an old question: who is this for, and why should they care?",
        attribution: "Course notes, Module 1",
      },
      takeaways: [
        "Digital marketing is marketing: start from the customer, not from the tool.",
        "Channels are owned, paid or earned, and a plan usually needs all three.",
        "Being on fewer channels and looking after them beats being everywhere.",
        "An AI assistant speeds up the work. The decisions and the checking stay with you.",
      ],
    },
    "dmf-m1-t4": {
      lede: "Four channels carry most digital marketing: search, social, email and display. Each one meets the customer in a different frame of mind, and that matters more than any feature of the platform. This reading gives you a working picture of each, enough to choose between them.",
      sections: [
        {
          heading: "Search: answering a question someone already has",
          paragraphs: [
            "A person who types a query has told you what they want, in their own words, at the moment they want it. No other channel gives you that. Search has two halves. Organic results are earned by having the page that best answers the query. Search ads are bought, and appear above or beside those results for the queries you choose.",
            "Search is strong when demand already exists. It is weak for a product nobody knows to look for: if no one searches for it, there is nothing to appear for. Organic search is slow to build and lasts. Search ads start the same day and stop with the budget.",
          ],
        },
        {
          heading: "Social: a place in someone's feed",
          paragraphs: [
            "On social platforms people are not looking for you. They are scrolling, and you either interrupt or earn a moment of interest. That makes social good at discovery, at showing what a product looks like in use, and at conversation with people who already follow you.",
            "It also comes in two halves. Organic posts reach your followers and whoever the feed decides to show them to. Paid social buys reach among people chosen by interest or behaviour. Neither works with copy written for a brochure. A post has about two seconds to earn the third.",
          ],
        },
        {
          heading: "Email: the people who asked to hear from you",
          paragraphs: [
            "Email reaches people who gave you their address. It is owned media: no feed decides who sees the message, and you do not pay for each click as you do with an ad. It is the main channel for bringing existing customers back.",
            "Its limit is permission. A list grows one sign-up at a time, and every message that does not earn its place pushes someone to unsubscribe. Email does little for a business with no list. It does a great deal for one that has spent a year building one.",
          ],
        },
        {
          heading: "Display: being seen while people do something else",
          paragraphs: [
            "Display ads are the banners and video placements on news sites, blogs, apps and video platforms. The reader came for the article, not for you, so few people click. What display buys is repeated visibility: awareness among people who match an audience, and reminders to people who visited your site and left.",
            "Judge it accordingly. A display campaign measured only on clicks looks like a failure. Measured on whether more people search for the brand or return to finish an order, it may be doing its job.",
          ],
        },
      ],
      pullQuote: {
        text: "Search catches demand that exists. Social and display create it. Email keeps it.",
        attribution: "Course notes, Module 1",
      },
      takeaways: [
        "Search reaches people at the moment they ask; it needs existing demand.",
        "Social is for discovery and conversation; people there are not looking for you.",
        "Email is owned and permission-based: the channel for bringing customers back.",
        "Display buys visibility and reminders, and should not be judged on clicks alone.",
      ],
    },
    "dmf-m1-t7": {
      lede: "A persona is a short description of one kind of customer, written so that a team can picture the same person when they make a decision. Most personas fail because they describe who the customer is and not what the customer is trying to get done. This reading shows how to write one that is useful.",
      sections: [
        {
          heading: "What a persona is for",
          paragraphs: [
            "A persona exists to settle arguments. Should the headline talk about price or about time saved? Should the brand be on a professional network or a video platform? If the persona cannot help answer questions like these, it is decoration.",
            "That is why a list of demographics is a weak start. “Women aged 25 to 40 in cities” fits a student, a surgeon and a new parent. They do not share a need, a budget or a free hour in the day.",
          ],
        },
        {
          heading: "The job to be done",
          paragraphs: [
            "People do not want products. They want a result in their own life, and they take on a product to get it. Nobody wants a meal kit. A parent who gets home at seven wants dinner on the table by half past without having to plan it. That is the job.",
            "A job has three parts worth writing down: the situation that triggers it, the result the person wants, and what they use today instead. The last part is your real competition. For the meal kit it is not only other kits. It is a frozen pizza, a takeaway and a phone call to a grandparent.",
          ],
        },
        {
          heading: "Writing one from evidence",
          paragraphs: [
            "Build the persona from what customers have said and done, not from a meeting room. Useful sources are close at hand: the questions people ask before they buy, the words they use in reviews, the searches that bring them to the site, and five short conversations with real customers.",
            "Keep it to half a page: a name, the situation, the job, what gets in the way, where they look for help, and one sentence in their own words. Two or three personas are enough for most small businesses. A fourth usually means two of them are the same person.",
          ],
        },
        {
          heading: "Where an AI assistant fits",
          paragraphs: [
            "An assistant is good at sorting. Paste in fifty review comments and ask it to group the reasons people gave for buying, and you will have a first draft of the jobs in minutes. Remove names, email addresses and order numbers first.",
            "It is poor at inventing customers. Ask it to write a persona from nothing and it will produce a plausible stranger built from averages. Treat such a draft as a list of guesses to test, never as research.",
          ],
        },
      ],
      pullQuote: {
        text: "A persona that fits everyone helps you decide nothing.",
        attribution: "Course notes, Module 1",
      },
      takeaways: [
        "Describe the customer by situation and need; demographics alone decide nothing.",
        "A job has a trigger, a wanted result and whatever the person uses today instead.",
        "Write personas from reviews, questions, searches and conversations.",
        "Let an assistant sort real comments; do not let it invent the customer.",
      ],
    },
    "dmf-m2-t5": {
      lede: "Three numbers tell you whether marketing spend is paying for itself: what a customer costs to win, what a customer is worth over time, and what each unit of ad spend brings back. This reading defines each one, works an example and shows how they limit one another.",
      sections: [
        {
          heading: "Cost per acquisition",
          paragraphs: [
            "Cost per acquisition, or CPA, is what you spent divided by the number of customers that spend won. A campaign that cost 1,200 and brought 40 new customers has a CPA of 30.",
            "Be exact about what counts. If the 1,200 is media spend only, say so: the fee for the designer and the hours spent writing ads are costs too. And count customers, not clicks or sign-ups, unless a sign-up is what you set out to buy.",
          ],
        },
        {
          heading: "Customer lifetime value",
          paragraphs: [
            "Lifetime value, or LTV, is what one customer is worth to the business across the whole relationship. A simple version multiplies three figures: the average order value, the number of orders a customer places in a year, and the number of years they stay.",
            "Take a coffee subscription shop: an average order of 25, six orders a year, a customer who stays two years. That is 300 in revenue. Revenue is not what the business keeps, so apply the gross margin. At a 40% margin, the customer is worth 120.",
            "LTV is an estimate. A new business has no two-year history to measure, so it uses a cautious guess and corrects it as real data arrives.",
          ],
        },
        {
          heading: "Return on ad spend",
          paragraphs: [
            "Return on ad spend, or ROAS, is the revenue a campaign produced divided by what it cost. Spend 500, earn 2,000 in tracked sales, and the ROAS is 4, often written 4:1 or 400%.",
            "ROAS looks at one campaign and at first orders. It ignores margin, and it ignores whether the customer comes back. A ROAS of 4 on a product with a 20% margin loses money: 2,000 in sales leaves 400 of margin against 500 of spend.",
          ],
        },
        {
          heading: "Using the three together",
          paragraphs: [
            "LTV sets the ceiling for CPA. If a customer is worth 120 in margin, paying 30 to win one leaves room. Paying 130 does not. A common working rule is to keep CPA at or below a third of lifetime value, which leaves margin for everything else the business has to pay for.",
            "This also explains why two businesses can look at the same CPA and reach opposite decisions. A shop whose customers buy once can afford far less than a subscription whose customers stay for years.",
          ],
        },
      ],
      pullQuote: {
        text: "What you can afford to pay for a customer depends on what the customer is worth, not on what the click costs.",
        attribution: "Course notes, Module 2",
      },
      takeaways: [
        "CPA is spend divided by customers won; say which costs are in it.",
        "LTV is order value × orders per year × years, taken at margin, not at revenue.",
        "ROAS is revenue over ad spend; it says nothing about margin or repeat orders.",
        "Lifetime value sets the most you can pay to win a customer.",
      ],
    },
    "dmf-m3-t2": {
      lede: "A generative AI assistant produces text, images and summaries by predicting what a plausible answer looks like. That makes it fast and fluent, and it sets clear limits on what you can trust it with. This reading sorts everyday marketing tasks into three groups: good to hand over, good with a check, and yours to keep.",
      sections: [
        {
          heading: "Where it helps: first drafts and volume",
          paragraphs: [
            "The assistant is strongest when the task is to produce many reasonable versions of something. Ten subject lines for one email. Five ways to open a product description. A long article cut to a post of fifty words. You would write three by hand; it gives you twenty to choose from, in seconds.",
            "It is also good at changing form. It can turn meeting notes into a brief, a brief into an outline, and a paragraph into plain language for a general reader. The meaning comes from you. The assistant does the reshaping.",
          ],
        },
        {
          heading: "Where it helps: sorting and summarising",
          paragraphs: [
            "Give it a pile of text and a question, and it will find the pattern. Two hundred survey answers grouped by theme. A month of support messages sorted into complaints, questions and praise. A long report reduced to the five points a manager needs.",
            "Check a sample of what it sorted. It will sometimes place a sarcastic comment under praise, or merge two themes that you would keep apart. Ten minutes of checking tells you how far to trust the rest.",
          ],
        },
        {
          heading: "Where it does not help: facts, judgement and your customer",
          paragraphs: [
            "The assistant does not know your product, your prices or your stock unless you tell it. Asked for a detail it was not given, it will often supply one that sounds right. Every figure, date, name and claim in a draft is unverified until you check it against a source.",
            "It does not know your customer either. It knows how people in general write about running shoes. It has not read your reviews or sat in on your customer calls. And it cannot decide what the brand should say no to: which joke is off-tone, which claim a regulator would question, which offer the business cannot afford.",
          ],
        },
        {
          heading: "A simple test before you delegate",
          paragraphs: [
            "Ask two questions about any task. If the output is wrong, how would I know? And who is harmed if I do not notice? A weak subject line is easy to spot and costs little. A wrong dosage on a health product page is hard to spot and costs a great deal.",
            "Hand over the first kind freely. For the second kind, use the assistant for structure and wording only, and take every fact from a document you trust.",
          ],
        },
      ],
      pullQuote: {
        text: "The assistant is quick at producing options and has no stake in which one is true.",
        attribution: "Course notes, Module 3",
      },
      takeaways: [
        "Use an assistant for drafts, variations, reshaping, sorting and summaries.",
        "Check a sample of anything it sorted, and every fact in anything it wrote.",
        "It does not know your product, your customer or your limits unless you tell it.",
        "Before delegating, ask how you would spot an error and who it would harm.",
      ],
    },
    "dmf-m4-t1": {
      lede: "The final project asks you to put the course on a single page: a marketing plan for one small business, short enough that its owner would read it and specific enough that someone could start work from it on Monday. This reading explains what goes on the page and how it is assessed.",
      sections: [
        {
          heading: "What the page contains",
          paragraphs: [
            "The plan has six parts. One: the customer, as a persona with a job to be done. Two: one business goal and two marketing objectives, each with a number and a date. Three: the channels you will use, no more than three, with the reason for each and its type: owned, paid or earned.",
            "Four: the message, in two sentences a customer would understand. Five: how you will measure each objective, with the metric and where you will read it. Six: where an AI assistant helps in carrying out the plan, and what you will check before anything is published.",
          ],
        },
        {
          heading: "Choosing the business",
          paragraphs: [
            "Use the business from Assignments 01 and 02 if you can. You already have its persona, its journey map and its measurement plan, and the project is largely a matter of making them agree with one another. You may also choose a new one, as long as you can describe its customers from what you know and not from guesswork.",
            "Small and specific works best. A plan for a neighbourhood bakery with one objective can be judged. A plan for a global brand you know only from its ads cannot.",
          ],
        },
        {
          heading: "What makes a plan strong",
          paragraphs: [
            "The parts must agree. If the persona never opens email, the plan should not lean on a newsletter. If the objective is repeat orders, the metric should not be followers. A reviewer looks first for these links between the parts.",
            "Decisions count for more than coverage. Saying why you left a channel out shows more understanding than listing six. And one page means one page: the limit is part of the task, because choosing what to leave out is the skill being assessed.",
          ],
        },
        {
          heading: "How it is assessed",
          paragraphs: [
            "You submit the plan as a PDF or DOCX, and it is graded by a peer with a short rubric that follows the parts of the page. The project is worth 25% of your course grade. In the topic after it, you review two plans yourself, which is the quickest way to see what a clear plan looks like from the outside.",
            "Watch the planning video next. It shows the order in which to fill in the page, and where most first drafts run long.",
          ],
        },
      ],
      pullQuote: {
        text: "If the plan needs a second page, it still holds a decision you have not made.",
        attribution: "Final project brief",
      },
      takeaways: [
        "One page, six parts: customer, objectives, channels, message, measurement, AI use.",
        "At most three channels, each with a reason and a type.",
        "The parts must agree with one another; a reviewer checks the links first.",
        "Submit as PDF or DOCX; a peer grades your plan and you review two.",
      ],
    },
  },
  quizzes: {
    "dmf-m1-t8": [
      {
        question: "A customer writes a five-star review of a shop on a public review site. For the shop, which kind of media is this?",
        platformPrompt: "Choose the correct option",
        hints: [
          "Ask who wrote it and who controls where it appears.",
          "The shop did not pay for it and cannot edit it.",
        ],
        explanation:
          "Earned media is attention that other people give a brand: reviews, shares, press mentions. The brand can encourage it and cannot control it.",
        reviewTopicId: "dmf-m1-t3",
        reviewTopicTitle: "Owned, earned and paid media",
        options: [
          { id: "a", label: "Owned media", feedback: "The shop does not control the review site or what the customer wrote." },
          { id: "b", label: "Paid media", feedback: "Nothing was bought. A paid placement would be an ad on the review site." },
          { id: "c", label: "Earned media", correct: true, feedback: "Correct. The customer gave it freely and the shop cannot edit it." },
          { id: "d", label: "It is not media at all", feedback: "A public review reaches future customers, so it is media, and often the most trusted kind." },
        ],
      },
      {
        question: "Someone compares three meal-kit services, reading reviews and price pages. Which stage of the customer journey are they in?",
        platformPrompt: "Choose the correct option",
        explanation:
          "In the consideration stage the customer knows the need and is weighing options. Content that helps them compare, such as reviews, price pages and comparisons, matters most here.",
        reviewTopicId: "dmf-m1-t6",
        reviewTopicTitle: "The customer journey: from awareness to advocacy",
        options: [
          { id: "a", label: "Awareness", feedback: "At awareness they are only learning that the option exists. Here they are already comparing." },
          { id: "b", label: "Consideration", correct: true, feedback: "Correct. They know what they need and are weighing the options." },
          { id: "c", label: "Purchase", feedback: "They have not chosen yet. Purchase is the moment of ordering." },
          { id: "d", label: "Advocacy", feedback: "Advocacy comes after a good experience, when the customer recommends the brand." },
        ],
      },
      {
        question: "Which statement is the most useful start for a persona?",
        explanation:
          "A persona is useful when it describes a situation and a job the customer wants done. Age and location alone say little about what to write or where to publish it.",
        reviewTopicId: "dmf-m1-t7",
        reviewTopicTitle: "Personas and the job a customer wants done",
        options: [
          { id: "a", label: "Women aged 25 to 40 who live in cities.", feedback: "A demographic range fits millions of people with very different needs." },
          { id: "b", label: "Everyone who likes good food.", feedback: "A persona that includes everyone gives you nothing to decide with." },
          {
            id: "c",
            label: "A parent who gets home at seven and wants dinner on the table in twenty minutes without planning it.",
            correct: true,
            feedback: "Correct. It names a situation and a job to be done, which tells you what to say.",
          },
          { id: "d", label: "Our ideal customer, who loves our brand.", feedback: "That describes what the brand hopes for, not what the customer needs." },
        ],
      },
    ],
    "dmf-m1-t10": [
      {
        question: "A bakery pays a food blogger to publish a sponsored post about its new loaf. For the bakery, which kind of media is this?",
        platformPrompt: "Choose the correct option",
        explanation:
          "What decides the type is who controls the space and whether it was paid for. A sponsored post sits on someone else's channel and was bought, so it is paid media.",
        reviewTopicId: "dmf-m1-t3",
        reviewTopicTitle: "Owned, earned and paid media",
        options: [
          { id: "a", label: "Owned media", feedback: "The bakery does not control the blog. It bought a place on it." },
          { id: "b", label: "Paid media", correct: true, feedback: "Correct. The placement was bought, so it is paid media even though it sits on someone else's site." },
          { id: "c", label: "Earned media", feedback: "Earned media is given freely. A post that was paid for is labelled as sponsored and counts as paid." },
          { id: "d", label: "Both owned and earned", feedback: "Neither applies: the space belongs to the blogger and the post was bought." },
        ],
      },
      {
        question: "A customer bought a coffee grinder last month. Today she receives an email that shows how to clean it and offers replacement burrs. Which stage of the journey does the email serve?",
        platformPrompt: "Choose the correct option",
        explanation:
          "Retention covers everything that keeps a customer after the first order: help in using the product, and a relevant reason to buy again.",
        reviewTopicId: "dmf-m1-t6",
        reviewTopicTitle: "The customer journey: from awareness to advocacy",
        options: [
          { id: "a", label: "Consideration", feedback: "She has already chosen and bought. Consideration is the comparing before the order." },
          { id: "b", label: "Purchase", feedback: "The purchase happened last month. This message comes after it." },
          { id: "c", label: "Retention", correct: true, feedback: "Correct. It helps her get value from what she bought and gives her a reason to return." },
          { id: "d", label: "Advocacy", feedback: "Advocacy is when she recommends the brand to others. The email may lead there, but it does not ask for it." },
        ],
      },
      {
        question: "A gym writes a persona and lists what its customer uses today in place of a membership. Which list describes the real competition best?",
        explanation:
          "The competition for a job is whatever the person does today to get the same result, including doing nothing. It is often not a business in the same category.",
        reviewTopicId: "dmf-m1-t7",
        reviewTopicTitle: "Personas and the job a customer wants done",
        options: [
          { id: "a", label: "The two other gyms in the same street", feedback: "They are competitors, but the person may never consider a gym at all." },
          {
            id: "b",
            label: "Running outdoors, a home workout app, and doing nothing",
            correct: true,
            feedback: "Correct. These are the ways the person gets the job done today, or avoids it.",
          },
          { id: "c", label: "Gyms in other cities", feedback: "The customer cannot use them, so they are not an alternative." },
          { id: "d", label: "Any business that sells to people aged 25 to 40", feedback: "Sharing an age range does not make a business an alternative for this job." },
        ],
      },
    ],
    "dmf-m2-t8": [
      {
        question: "A campaign cost 900 and brought in 30 new customers. What is the cost per acquisition?",
        platformPrompt: "Choose the correct option",
        hints: [
          "Divide the spend by the number of customers.",
          "900 ÷ 30.",
        ],
        explanation:
          "Cost per acquisition is the spend divided by the customers it won: 900 ÷ 30 = 30.",
        reviewTopicId: "dmf-m2-t5",
        reviewTopicTitle: "Cost per acquisition, lifetime value and return on ad spend",
        options: [
          { id: "a", label: "3", feedback: "Check the division: 900 ÷ 30 is 30, not 3." },
          { id: "b", label: "30", correct: true, feedback: "Correct. 900 spent for 30 customers is 30 per customer." },
          { id: "c", label: "270", feedback: "That is 30% of 900. CPA is spend divided by customers." },
          { id: "d", label: "27,000", feedback: "That multiplies the two numbers. CPA divides spend by customers." },
        ],
      },
      {
        question: "A funnel shows 5,000 visits, 1,000 product views, 100 carts and 60 orders. Which step loses the largest share of people?",
        platformPrompt: "Choose the correct option",
        explanation:
          "Work out each step rate: 1,000 ÷ 5,000 = 20%, 100 ÷ 1,000 = 10%, 60 ÷ 100 = 60%. The product page turns the fewest of its visitors into the next step, so that is where to look first.",
        reviewTopicId: "dmf-m2-t3",
        reviewTopicTitle: "The funnel and its conversion rates",
        options: [
          { id: "a", label: "Visits to product views", feedback: "That step keeps 20% and loses 80%. One step loses more." },
          { id: "b", label: "Product views to carts", correct: true, feedback: "Correct. Only 10% of product views become a cart, the lowest rate of the three steps." },
          { id: "c", label: "Carts to orders", feedback: "60% of carts become orders. This is the strongest step of the three." },
          { id: "d", label: "They all lose the same share", feedback: "Work out each step: 20%, 10% and 60%." },
        ],
      },
      {
        question: "Which of these is a specific marketing objective?",
        explanation:
          "An objective is specific when it names a metric, a number to reach and a date. Without them a team cannot tell whether it succeeded.",
        reviewTopicId: "dmf-m2-t1",
        reviewTopicTitle: "From business goals to marketing objectives",
        options: [
          { id: "a", label: "Grow our presence on social media", feedback: "There is no number and no date, so nobody can say whether it was met." },
          { id: "b", label: "Get more traffic than last year", feedback: "More by how much, by when, and traffic from whom?" },
          {
            id: "c",
            label: "Raise newsletter sign-ups from 200 to 300 a month by 30 June",
            correct: true,
            feedback: "Correct. It has a metric, a starting point, a target and a date.",
          },
          { id: "d", label: "Be the best-known bakery in town", feedback: "That is an ambition. It names no measure and no deadline." },
        ],
      },
    ],
  },
  assignments: {
    "dmf-m1-t9": {
      brief:
        "Choose a small business you know, or use the case-study bakery from the Handouts. Describe one customer as a persona, then map that customer's journey through five stages: awareness, consideration, purchase, retention and advocacy. For each stage, say what the customer is trying to do, which channel they meet the business on, whether that channel is owned, paid or earned, and one thing the business could improve. Submit your map as a PDF or DOCX.",
      requirements: [
        "One persona, described by situation and need, not by age alone",
        "Five stages, each with the customer's goal, the channel and its type",
        "One improvement per stage, with your reason",
        "Counts toward your final grade",
      ],
    },
    "dmf-m2-t10": {
      brief:
        "Write a measurement plan for the business of Assignment 01. Start from one business goal and turn it into two marketing objectives, each with a number and a date. For each objective, name the main metric, the funnel step it measures, where the data comes from and how often you would check it. Close with the cost per acquisition you could afford, worked out from the lifetime value of a customer. Submit your plan as a PDF or DOCX.",
      requirements: [
        "One business goal and two objectives, each with a number and a date",
        "The main metric, its data source and its review rhythm for each objective",
        "The affordable cost per acquisition, with the calculation shown",
        "Counts toward your final grade",
      ],
    },
  },
  ora: {},
  activities,
};
