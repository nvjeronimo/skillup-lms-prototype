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
    "smec-m1-t4": {
      lede: "Almost no one sees posts in the order they were published. A ranking system chooses, for each person, the few posts most likely to hold their attention out of thousands available. You cannot control that system. You can understand what it looks for, and stop spending effort on what it ignores.",
      sections: [
        {
          heading: "What a feed is trying to do",
          paragraphs: [
            "A platform earns money when people stay and come back. So its feed predicts, for each person and each post, how likely that person is to watch, read, reply, share or save, and it shows the posts with the best predictions first.",
            "This means a post is not ranked once. It is ranked separately for every viewer. The same video can be at the top for one person and never shown to their neighbour.",
          ],
        },
        {
          heading: "Signals you can influence",
          paragraphs: [
            "Attention is the first. For video, how much of it people watch and whether they watch again. For a carousel, whether they swipe to the end. The opening seconds decide most of this, which is why hooks get so much space in Module 2.",
            "Actions that take effort come next. A share, a save or a comment of some length says more than a tap on a like. Posts that give people something worth sending to a friend or keeping for later earn these.",
            "Clarity helps too. A caption, on-screen text and spoken words that state the subject let the system work out who might care. So does posting regularly on a small number of subjects, which is one reason content pillars matter.",
          ],
        },
        {
          heading: "Signals you cannot influence",
          paragraphs: [
            "Much of the prediction depends on the viewer: what they watched last week, whom they message, how long they have today. You have no say in it.",
            "The platform's own priorities also shift. A new format is often given extra reach for a time, and the rules change without notice. Advice that promises a fixed best hour or a magic number of hashtags is describing last year's system, if it ever described one.",
          ],
        },
        {
          heading: "What to do with this",
          paragraphs: [
            "Make posts for a specific person and judge them by the signals of real interest: watch time, shares and saves. Ignore tricks that ask for engagement without earning it. Platforms have said for years that they demote posts that beg for comments.",
            "Read your own results over a month. One post's reach tells you little, because luck plays a part every time. A pattern across twenty posts tells you what your audience stays for.",
          ],
        },
      ],
      pullQuote: {
        text: "The feed does not rank your post. It ranks your post for one person at a time.",
        attribution: "Course notes, Module 1",
      },
      takeaways: [
        "Feeds predict what each person will pay attention to, post by post.",
        "You influence attention, effortful actions such as shares and saves, and clarity of subject.",
        "You do not influence the viewer's history or the platform's shifting priorities.",
        "Judge by patterns over many posts, and skip engagement tricks.",
      ],
    },
    "smec-m1-t9": {
      lede: "A brand that posts about anything is remembered for nothing. Content pillars are the three to five subjects a brand returns to again and again. They make planning easier, they tell followers what to expect, and they give the feed a clear idea of who should see the posts. Choosing them also means deciding what to leave out.",
      sections: [
        {
          heading: "What a pillar is",
          paragraphs: [
            "A pillar is a subject, not a format and not a product. “Videos” is a format. “Our spice kits” is a product. “Weeknight dinners in thirty minutes” is a subject: it can be a video, a carousel or a live session, and it can feature a product without being about it.",
            "Good pillars sit where two things overlap: what your audience cares about, and what your business knows or sells. Outside the first, nobody watches. Outside the second, you gain followers who will never buy.",
          ],
        },
        {
          heading: "Choosing three to five",
          paragraphs: [
            "For a shop that sells spice kits, the pillars might be: quick weeknight recipes, how spices work, where the ingredients come from, and customers' own dishes. Each serves a job. Recipes bring reach, the spice lessons build trust, sourcing stories show what is different, and customers' dishes are proof.",
            "Give each pillar a rough share of the calendar, such as four posts in ten for recipes and two each for the others. The shares follow the leading job you chose earlier in this module. A brand that needs reach leans on the pillar that travels furthest.",
          ],
        },
        {
          heading: "What the brand does not talk about",
          paragraphs: [
            "Write the exclusions down next to the pillars. For the spice shop: no diet or health claims, no comment on news unrelated to food, no jokes at the expense of other cuisines. This list saves time on the day something tempting trends.",
            "Exclusions are also instructions for an AI assistant. Without them it will happily draft a post that says turmeric cures colds, because such posts are common. With the list in the prompt, and a person checking, that draft does not go out.",
          ],
        },
        {
          heading: "Testing and adjusting",
          paragraphs: [
            "Label every post with its pillar when you schedule it. After a month, compare pillars on the metric that matches your objective, not on likes. You may find one pillar brings nearly all the saves and another brings nothing.",
            "Change one pillar at a time and give the new one a month. If you find yourself adding a sixth, ask which of the five it replaces.",
          ],
        },
      ],
      pullQuote: {
        text: "A pillar tells the team what to post on a slow day, and what to refuse on a tempting one.",
        attribution: "Course notes, Module 1",
      },
      takeaways: [
        "A pillar is a recurring subject where audience interest and business knowledge overlap.",
        "Three to five pillars, each tied to a job and given a share of the calendar.",
        "Write down what the brand does not talk about, and put it in every prompt.",
        "Label posts by pillar and compare them monthly on the metric of your objective.",
      ],
    },
    "smec-m1-t11": {
      lede: "Before a brand says anything, its audience is already talking: about the problem it solves, about its competitors, sometimes about the brand itself. Social listening is the habit of reading those conversations on purpose and using them to decide what to make and what to fix.",
      sections: [
        {
          heading: "Monitoring and listening",
          paragraphs: [
            "Monitoring is reactive. Someone mentions or tags the brand, and you answer. It belongs to community management, which Module 2 covers.",
            "Listening is wider. You read what people say about a subject whether or not they name you: what they ask, what annoys them, the words they use. The first keeps customers. The second tells you what to do next.",
          ],
        },
        {
          heading: "Where to listen",
          paragraphs: [
            "Start with what you own: the comments and messages on your accounts and the reviews of your products. Then go where your audience talks to each other: the comment sections of well-known creators in your field, community forums, groups, and reviews of competing products.",
            "Searching a platform for the problem works better than searching for the product. People do not post “I need a spice kit”. They post “I cook the same four dinners every week”.",
          ],
        },
        {
          heading: "What to collect",
          paragraphs: [
            "Keep a simple sheet with four columns: the question or complaint, the exact words used, where you saw it, and how often it comes up. The exact words are the valuable part. If twenty people write “I never know what to cook on a Wednesday”, that sentence is your next hook.",
            "Look for three things: questions that keep returning, which become posts; complaints about competitors, which show where you can be better; and words you did not expect, which show how customers think about the product.",
          ],
        },
        {
          heading: "Using an AI assistant, and the limits",
          paragraphs: [
            "Sorting is the slow part, and an assistant does it well. Paste in a hundred comments with usernames removed and ask for the recurring questions, with a count and two example quotes for each. Check the quotes against the originals: an assistant will sometimes tidy a quote, or write one that nobody said.",
            "Respect the setting. Public comments can be read and summarised. Private groups have their own rules, and people's names and profiles do not belong in your notes. And remember who is missing: people who post are a loud minority. Listening tells you what to test, not what everyone thinks.",
          ],
        },
      ],
      pullQuote: {
        text: "Your next ten posts are already written, in other people's comments.",
        attribution: "Course notes, Module 1",
      },
      takeaways: [
        "Monitoring answers mentions; listening studies the wider conversation.",
        "Search for the problem in the audience's words, not for the product.",
        "Record the exact words, the place and how often a theme returns.",
        "Let an assistant sort anonymised comments, and verify every quote.",
      ],
    },
    "smec-m2-t2": {
      lede: "A social post has three moments. The hook earns the first two seconds. The caption, or the body of the video, pays off what the hook promised. The call to action says what to do next. Posts usually fail at the first and forget the third. This reading takes them in order.",
      sections: [
        {
          heading: "The hook",
          paragraphs: [
            "The hook is the first line of text, the first frame, the first words spoken. It should tell the right viewer “this is for you” before they have decided to stay. Four kinds work reliably: a problem (“Rice always sticky?”), a result (“Dinner in twelve minutes, one pan”), a surprising claim you can support (“You are adding your garlic too early”), and a question people already ask.",
            "Avoid openings that delay: greetings, the brand name, “in today's video”. And avoid hooks the post cannot honour. A viewer who feels tricked leaves, and the platform notices how quickly.",
          ],
        },
        {
          heading: "The caption",
          paragraphs: [
            "Write the caption for someone who will read only its first line, because that is all the feed shows before “more”. Put the main point there. Then add what the image or video cannot carry: the quantities, the steps, the reason.",
            "Short lines and plain words read best on a phone. Include the words people would search for, since platforms use captions to decide what a post is about and who might want it. Two or three specific hashtags do as much as twenty general ones.",
          ],
        },
        {
          heading: "The call to action",
          paragraphs: [
            "One post, one request. Decide what you want the viewer to do, and ask for only that: save this for Wednesday, send it to whoever cooks with you, tell us what you would add, tap the link for the kit.",
            "Match the request to the job of the post. A recipe meant for reach asks for a share or a save. A product post asks for the click. Asking for the sale at the end of every post teaches followers to stop reading before the end.",
          ],
        },
        {
          heading: "Drafting with an AI assistant",
          paragraphs: [
            "Hooks are a good task to hand over, because you want many and will keep one. Give the assistant the subject, the audience, the pillar and your list of exclusions, and ask for ten hooks of different kinds, each under ten words.",
            "Read them aloud. Remove anything that exaggerates, anything that sounds like every other account, and anything the post does not deliver. Then write the caption yourself from the facts, or have the assistant draft it from your notes and check each detail.",
          ],
        },
      ],
      pullQuote: {
        text: "The hook makes a promise, the caption keeps it, and the call to action says what to do about it.",
        attribution: "Course notes, Module 2",
      },
      takeaways: [
        "Open with the viewer's problem, a result, a supportable surprise or their own question.",
        "Put the main point in the first line of the caption; add what the visual cannot say.",
        "One call to action per post, matched to the post's job.",
        "Ask an assistant for many hooks, then cut what exaggerates or cannot be honoured.",
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
    "smec-m1-t14": [
      {
        question: "A two-person team wants reach among home cooks. Nobody on the team can film video. Which plan is the most realistic?",
        platformPrompt: "Choose the correct option",
        explanation:
          "Choose platforms by where the audience is, the job to be done and what the team can keep up. A format nobody can produce rules a platform out, however large its audience.",
        reviewTopicId: "smec-m1-t3",
        reviewTopicTitle: "Choosing platforms by audience and job, not by trend",
        options: [
          {
            id: "a",
            label: "Open accounts on every platform and post the same image on each",
            feedback: "Five neglected accounts do worse than one that is looked after.",
          },
          { id: "b", label: "Commit to daily short videos anyway", feedback: "A plan the team cannot sustain stops within weeks." },
          {
            id: "c",
            label: "Choose one platform whose format the team can produce every week, and do it well",
            correct: true,
            feedback: "Correct. Audience, job and what you can sustain decide the platform.",
          },
          {
            id: "d",
            label: "Wait for a new platform with less competition",
            feedback: "Being early does not help if the audience is not there or the team cannot make the format.",
          },
        ],
      },
      {
        question: "Which of these signals is a brand most able to influence?",
        platformPrompt: "Choose the correct option",
        explanation:
          "A feed predicts attention for each viewer. You influence it through the post itself: its opening, its clarity and whether it is worth sharing or saving.",
        reviewTopicId: "smec-m1-t4",
        reviewTopicTitle: "How feeds rank content: signals you can and cannot influence",
        options: [
          { id: "a", label: "What a viewer watched last week", feedback: "That is the viewer's history. It shapes their feed and you have no say in it." },
          {
            id: "b",
            label: "How much of a video people watch, through a stronger opening",
            correct: true,
            feedback: "Correct. Attention to the post is the signal you shape most directly.",
          },
          { id: "c", label: "The platform's decision to favour a new format this month", feedback: "Platforms change priorities without notice. You can only respond." },
          { id: "d", label: "How much free time the viewer has today", feedback: "That belongs to the viewer." },
        ],
      },
      {
        question: "Which of these is a content pillar?",
        explanation:
          "A pillar is a recurring subject where the audience's interests and the brand's knowledge overlap. Formats, products and single promotions are not pillars.",
        reviewTopicId: "smec-m1-t9",
        reviewTopicTitle: "Content pillars: what the brand talks about, and what it does not",
        options: [
          { id: "a", label: "Carousels", feedback: "That is a format. A pillar is a subject that can take any format." },
          { id: "b", label: "Our autumn discount code", feedback: "That is one promotion, not a subject to return to all year." },
          { id: "c", label: "Whatever is trending this week", feedback: "A pillar is chosen in advance. Trends are judged against it." },
          { id: "d", label: "Weeknight dinners in thirty minutes", correct: true, feedback: "Correct. It is a subject the brand can return to in any format." },
        ],
      },
    ],
    "smec-m3-t6": [
      {
        question: "What does a product catalogue hold?",
        platformPrompt: "Choose the correct option",
        hints: [
          "Think of what a product card shows when someone taps a tag.",
          "It has to stay in step with the store.",
        ],
        explanation:
          "The catalogue is the platform's copy of your product data. Shops and product tags are built from it, so it has to match the store's prices and stock.",
        reviewTopicId: "smec-m3-t1",
        reviewTopicTitle: "From post to purchase: how social commerce works",
        options: [
          { id: "a", label: "The brand's scheduled posts for the month", feedback: "That is the content calendar." },
          {
            id: "b",
            label: "The products with their names, prices, images and availability, kept in step with the store",
            correct: true,
            feedback: "Correct. Shops and product tags both draw on it.",
          },
          { id: "c", label: "A list of followers who have bought before", feedback: "That would be a customer list, which lives in the store or the CRM." },
          { id: "d", label: "The comments left under product posts", feedback: "Comments belong to posts. The catalogue describes products." },
        ],
      },
      {
        question: "A shop tags a product in a video. The product sold out yesterday, and the tag still shows it as available. What is the underlying problem?",
        platformPrompt: "Choose the correct option",
        explanation:
          "Tags and shops show what the catalogue says. If the catalogue is not updated from the store, shoppers see prices and stock that are no longer true.",
        reviewTopicId: "smec-m3-t3",
        reviewTopicTitle: "Setting up a product catalogue and keeping it in sync",
        options: [
          { id: "a", label: "The video is too long", feedback: "Length does not affect what the product card shows." },
          {
            id: "b",
            label: "The tag was placed too early in the video",
            feedback: "Placement affects whether people notice the tag, not whether the stock figure is right.",
          },
          { id: "c", label: "The catalogue is not in sync with the store's stock", correct: true, feedback: "Correct. The tag repeats whatever the catalogue holds." },
          { id: "d", label: "The shop has too few followers", feedback: "Follower count has nothing to do with stock data." },
        ],
      },
      {
        question: "What is the main trade-off of letting customers pay inside the social app, compared with paying on your own site?",
        explanation:
          "In-app checkout removes steps, which helps conversion. In exchange the platform handles payment, charges a fee and stands between you and the customer.",
        reviewTopicId: "smec-m3-t1",
        reviewTopicTitle: "From post to purchase: how social commerce works",
        options: [
          {
            id: "a",
            label: "It is slower for the buyer and cheaper for the seller",
            feedback: "In-app checkout is the quicker path for the buyer, and platforms usually charge for it.",
          },
          { id: "b", label: "There is no difference", feedback: "Who takes the payment changes the fees, the data you hold and the steps the buyer takes." },
          { id: "c", label: "Orders no longer need to be fulfilled by the seller", feedback: "The seller still ships the order and answers the customer." },
          {
            id: "d",
            label: "Fewer steps for the buyer, and more dependence on the platform for payment, fees and customer data",
            correct: true,
            feedback: "Correct. Speed for the buyer is paid for with control.",
          },
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
    "smec-m2-t14": {
      brief:
        "Plan two weeks of social content for the business you chose in Assignment 01, on the platforms you audited there. For every post give the date, the platform, the content pillar, the format, the hook, a one-line summary of the caption and the call to action. Write two of the posts in full, with the caption and any on-screen text. Show who approves each post before it goes out, and name the person who answers comments in the first hours after publishing. Add a note on where an AI assistant drafted or sorted anything, and what you changed. Submit the calendar as a PDF or DOCX.",
      requirements: [
        "At least eight posts over fourteen days, each labelled with its pillar and format",
        "A hook and one call to action for every post",
        "Two posts written in full",
        "The approval step and the person responsible for replies",
        "A note of up to 150 words on your use of AI",
        "Counts toward your final grade",
      ],
    },
  },
  ora: {
    "smec-m5-t4": FINAL_PROJECT,
    "smec-m5-t5": FINAL_PROJECT,
  },
};
