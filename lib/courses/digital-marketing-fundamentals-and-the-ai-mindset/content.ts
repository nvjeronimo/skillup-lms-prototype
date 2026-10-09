import type { CourseContent } from "@/lib/courses/kit";

export const content: CourseContent = {
  byline: {
    author: "Rajesh Menon",
    role: "Lead instructor · AI Augmented Digital Marketing",
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
};
