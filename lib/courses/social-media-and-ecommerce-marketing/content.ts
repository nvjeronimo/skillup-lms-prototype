import type { CourseContent, OraContent } from "@/lib/courses/kit";

/** The final project, as the Project topic and the Peer Review topic after it both show it. */
const FINAL_PROJECT: OraContent = {
  brief:
    "Plan the launch of one product for the business you have worked on in this course. The plan joins your four assignments: the audience and the leading job, a two-week content calendar around the launch, the product page and the shop listing, and the funnel numbers you will watch in the first month.",
  deliverable:
    "Submit a PDF or DOCX of 4 to 6 pages using the launch plan template: objective, audience, channels, calendar, product page, measurement, and a short note on where you used AI and what you changed in its drafts.",
  dueLabel: "Due 6 Mar 2027",
  requiredReviews: 2,
  acceptedTypes: [".pdf", ".docx"],
  overallCommentPrompt: "Which part of your peer's launch plan would you act on first, and why?",
  criteria: [
    {
      id: "c1",
      label: "Task 1 · Set the objective and the audience",
      maxPoints: 6,
      options: [
        { points: 6, label: "One objective with a person and an action; the audience is described by need or situation" },
        { points: 4, label: "The objective is clear; the audience is a demographic only" },
        { points: 2, label: "Several objectives, none leading" },
        { points: 0, label: "Not attempted" },
      ],
    },
    {
      id: "c2",
      label: "Task 2 · Plan the content and the channels",
      maxPoints: 5,
      options: [
        { points: 5, label: "Each channel has a job and the calendar builds towards the launch day" },
        { points: 3, label: "A full calendar, but the posts could be for any product" },
        { points: 0, label: "Not attempted" },
      ],
    },
    {
      id: "c3",
      label: "Task 3 · Prepare the product page and the listing",
      maxPoints: 5,
      options: [
        { points: 5, label: "The page answers the customer's questions and every claim can be supported" },
        { points: 3, label: "Complete, but some claims are vague or unsupported" },
        { points: 0, label: "Not attempted" },
      ],
    },
    {
      id: "c4",
      label: "Task 4 · Say how you will measure it",
      maxPoints: 4,
      options: [
        { points: 4, label: "The funnel steps to watch, with a number that would count as a good first month" },
        { points: 2, label: "Metrics are listed without a target" },
        { points: 0, label: "Not attempted" },
      ],
    },
  ],
};

export const content: CourseContent = {
  byline: {
    author: "Rajesh Menon",
    role: "Lead instructor · AI Augmented Digital Marketing",
    updated: "September 2026",
  },
  quiz: [
    {
      question: "Which of these is a social media objective, not a metric?",
      platformPrompt: "Choose the correct option",
      explanation:
        "An objective says what the business wants from the channel. A metric is how you tell whether it is happening. Followers, reach and clicks are metrics that serve an objective.",
      options: [
        { id: "a", label: "Follower count", feedback: "A metric. It says how many, not what for." },
        {
          id: "b",
          label: "Get first-time buyers to visit the shop from social posts",
          correct: true,
          feedback: "Correct. It names who, and what you want them to do.",
        },
        { id: "c", label: "Engagement rate", feedback: "A metric. It can serve several different objectives." },
        { id: "d", label: "Number of posts per week", feedback: "That is an activity: something you do, not something you get." },
      ],
    },
    {
      question: "A shopper adds a product to the cart and leaves. Which stage of the funnel did they reach?",
      platformPrompt: "Choose the correct option",
      explanation:
        "The ecommerce funnel runs from session to product view, add to cart, checkout started and order. Leaving after adding to the cart is cart abandonment; the checkout was never started.",
      options: [
        { id: "a", label: "Session only", feedback: "They went further: they viewed a product and added it." },
        { id: "b", label: "Add to cart", correct: true, feedback: "Correct. The next step, starting the checkout, did not happen." },
        { id: "c", label: "Checkout started", feedback: "They left before opening the checkout." },
        { id: "d", label: "Order", feedback: "No order was placed." },
      ],
    },
    {
      question: "An AI assistant drafts a product description that says a jacket is waterproof. The supplier sheet says water-resistant. What do you publish?",
      explanation:
        "A product description is a set of claims a customer relies on. The supplier sheet is the source; the draft is not. Publish what you can support.",
      options: [
        { id: "a", label: "Waterproof: it reads better", feedback: "It is also untrue, and it is the claim a customer will return the jacket over." },
        { id: "b", label: "Water-resistant, as the supplier sheet says", correct: true, feedback: "Correct. The source decides, not the draft." },
        { id: "c", label: "Both, in different places on the page", feedback: "A page that contradicts itself loses the customer's trust." },
        { id: "d", label: "Neither: leave the property out", feedback: "It is a fact customers look for. State it accurately." },
      ],
    },
  ],
  articles: {
    "smec-m1-t2": {
      lede: "Most businesses open social accounts because everyone else has them, and then wonder what to post. This reading starts one step earlier. Social media can do three jobs for a business. Decide which one you need most before you choose a platform or write a post.",
      sections: [
        {
          heading: "Three jobs: reach, relationship, revenue",
          paragraphs: [
            "Reach is being seen by people who do not know you yet. On most platforms today, a post is shown to people who do not follow the account when the feed predicts they will watch or read it. That makes social media one of the few places where a small brand can be discovered without paying for every view.",
            "Relationship is staying in touch with people who already know you: followers, customers, members of a community. Here the measure is not how many people saw a post but whether the right people replied, saved it or came back.",
            "Revenue is selling: sending a visitor to a product page, or selling inside the platform through a shop or a product tag. This job has the clearest numbers and the least patience. A feed is not a shop window, and an account that only sells is quickly ignored.",
          ],
        },
        {
          heading: "One job leads, the others support",
          paragraphs: [
            "The three jobs compete for the same few posts a week. A new brand with no audience needs reach first, because there is nobody yet to build a relationship with. A local service with loyal customers may need relationship most, because referrals come from people who remember it. A shop with steady traffic and a weak conversion rate needs help with revenue.",
            "Write the leading job as one sentence that names a person and an action: “People who cook at home discover our spice kits through short recipe videos.” The sentence tells you what to post, where, and what to count. It also tells you what to leave out.",
          ],
        },
        {
          heading: "What this changes in practice",
          paragraphs: [
            "The job decides the metric. For reach, count how many people outside your followers saw the post and how long they stayed. For relationship, count replies, saves and returning viewers. For revenue, count visits to the shop and orders that started from social, which Module 4 shows you how to trace.",
            "It also decides how you brief an AI assistant. “Write a post about our spice kit” gives the assistant no job to aim at. “Write a 20-second recipe video script for people who have never heard of us; the goal is that they watch to the end” does. You will use this pattern in every assignment of the course.",
          ],
        },
      ],
      pullQuote: {
        text: "A social account with no job posts whatever is easiest to make.",
        attribution: "Course notes, Module 1",
      },
      takeaways: [
        "Social media does three jobs: reach, relationship and revenue.",
        "Choose the one the business needs most now; the others support it.",
        "Write the job as one sentence with a person and an action.",
        "The job decides the metric, and it belongs in every brief you give an AI assistant.",
      ],
    },
    "smec-m4-t2": {
      lede: "A funnel report is a short table: how many sessions, how many product views, how many carts, how many checkouts, how many orders. The numbers matter less than the steps between them. This reading shows how to find the step that loses the most shoppers, and what each kind of loss usually means.",
      sections: [
        {
          heading: "Read the steps, not the totals",
          paragraphs: [
            "Take the case-study shop for one month: 20,000 sessions, 9,000 product views, 1,400 carts, 700 checkouts started, 420 orders. The overall conversion rate is 420 out of 20,000, or 2.1%. That figure tells you how the shop is doing. It does not tell you what to fix.",
            "Now divide each step by the one before it. Sessions to product view: 45%. Product view to cart: about 16%. Cart to checkout: 50%. Checkout to order: 60%. Each of these is a different question put to the shopper, and each has different causes when the answer is no.",
          ],
        },
        {
          heading: "What each drop usually means",
          paragraphs: [
            "A low share of sessions reaching a product means visitors arrive and do not find something to look at: the wrong audience, a landing page that does not match the post that sent them, or navigation that hides the range.",
            "A low share of product views becoming carts points at the product page itself: the price, the photos, missing answers about size, delivery or returns. A low share of carts reaching the checkout often means the cart revealed something unwelcome, most often the delivery cost. A low share of checkouts becoming orders points at the checkout: too many fields, a missing payment method, an account the shopper is forced to create.",
          ],
        },
        {
          heading: "Choose one leak and one test",
          paragraphs: [
            "Compare each step with the same step last month and, where you have it, by device and by traffic source. A step that is weak everywhere is a problem with the store. A step that is weak only on phones, or only for visitors from one platform, is a narrower problem and often a cheaper one to fix.",
            "Then choose the one step where a small improvement would produce the most extra orders, and write one change to test there. In the example, half of all carts never reach the checkout. Showing the delivery cost on the product page is a single change aimed at that step. Assignment 04 asks you for exactly this: the leak, the evidence, and the one test.",
          ],
        },
      ],
      pullQuote: {
        text: "The overall conversion rate tells you how the shop is doing. The steps tell you what to fix.",
        attribution: "Course notes, Module 4",
      },
      takeaways: [
        "Divide each funnel step by the one before it; do not stop at the overall rate.",
        "Each drop has its own usual causes: audience, product page, cart surprises, checkout friction.",
        "Split a weak step by device and by traffic source before deciding it is a store-wide problem.",
        "Pick one leak and one change to test, and say what result would count as a win.",
      ],
    },
  },
  quizzes: {
    "smec-m1-t7": [
      {
        question: "A new brand with no followers wants to be discovered by people who cook at home. Which job should lead its social plan?",
        platformPrompt: "Choose the correct option",
        hints: [
          "Think about who the brand can talk to today.",
          "You cannot keep in touch with an audience you do not have yet.",
        ],
        explanation:
          "With no audience, there is nobody to build a relationship with and few visitors to sell to. Reach comes first; the other two jobs follow once people know the brand.",
        reviewTopicId: "smec-m1-t2",
        reviewTopicTitle: "What social media is for: reach, relationship and revenue",
        options: [
          { id: "a", label: "Reach", correct: true, feedback: "Correct. Being discovered is the job when nobody knows you yet." },
          { id: "b", label: "Relationship", feedback: "There is no audience yet to keep in touch with." },
          { id: "c", label: "Revenue", feedback: "Selling to people who have never heard of the brand is the hardest place to start." },
          { id: "d", label: "All three equally", feedback: "A few posts a week cannot do three jobs well. One has to lead." },
        ],
      },
      {
        question: "What is the best reason to choose a platform for a brand?",
        platformPrompt: "Choose the correct option",
        explanation:
          "A platform is worth the effort when the audience you want is there and the formats it favours suit the job. Trends, competitors and personal habit are not evidence of either.",
        reviewTopicId: "smec-m1-t3",
        reviewTopicTitle: "Choosing platforms by audience and job, not by trend",
        options: [
          { id: "a", label: "It is the fastest-growing platform this year", feedback: "Growth says nothing about whether your audience is among the new users." },
          { id: "b", label: "A competitor is active there", feedback: "They may be there for a different job, or by habit." },
          {
            id: "c",
            label: "The audience you want uses it, and its formats suit the job you chose",
            correct: true,
            feedback: "Correct. Audience and job, in that order.",
          },
          { id: "d", label: "The team already uses it personally", feedback: "Convenient, but the team is not the audience." },
        ],
      },
      {
        question: "The objective is “people who cook at home discover our spice kits through short recipe videos”. Which metric fits it best?",
        explanation:
          "The objective is discovery by people who do not know the brand. The metric that matches is how many viewers outside the followers saw the videos and how much of each they watched.",
        reviewTopicId: "smec-m1-t5",
        reviewTopicTitle: "Setting social objectives and the metrics behind them",
        options: [
          { id: "a", label: "Replies from existing customers", feedback: "A relationship metric. The objective is about people who are new." },
          {
            id: "b",
            label: "Views from non-followers and the share of each video they watched",
            correct: true,
            feedback: "Correct. It measures discovery, and whether the video held attention.",
          },
          { id: "c", label: "Number of videos published", feedback: "That counts your effort, not the result." },
          { id: "d", label: "Average order value", feedback: "A store metric. It matters later in the journey." },
        ],
      },
    ],
  },
  assignments: {
    "smec-m1-t13": {
      brief:
        "Choose the business you will work on for the whole course: your own, your employer's, or the case-study shop in Handouts. Audit its presence on two social platforms with the audit template: who each profile reaches, what it posts, what earns a response and what does not. Use an AI assistant to summarise the last 20 posts on each platform, then check the summary against the posts yourself. End with the one job (reach, relationship or revenue) that should lead the plan, written as one sentence, and the two metrics you would follow. Submit your work as a PDF or DOCX.",
      requirements: [
        "The completed audit template for two platforms, with one audience described for each",
        "The prompt you gave the assistant and two corrections you made to its summary",
        "The leading job as one sentence, and two metrics that fit it",
        "Counts toward your final grade",
      ],
    },
    "smec-m4-t14": {
      brief:
        "Using the month of sample store data in Handouts, work out the rate of each funnel step and find the step that loses the most shoppers. Split that step by device and by traffic source, say what you think causes the loss, and propose one change to test, with the result that would count as a win. Then add one idea to bring a first-time buyer back for a second order. Submit your work as a PDF or DOCX.",
      requirements: [
        "A table of the five funnel steps with the rate of each",
        "The biggest leak, split by device and by traffic source",
        "One test and one retention idea, each in three sentences or fewer",
        "Counts toward your final grade",
      ],
    },
  },
  ora: {
    "smec-m5-t4": FINAL_PROJECT,
    "smec-m5-t5": FINAL_PROJECT,
  },
};
