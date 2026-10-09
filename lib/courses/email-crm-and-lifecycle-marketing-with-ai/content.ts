import type { CourseContent, OraContent } from "@/lib/courses/kit";

/** The final project, as the Project topic and the Peer Review topic after it both show it. */
const FINAL_PROJECT: OraContent = {
  brief:
    "Design the lifecycle email plan for one customer journey of a business you know, or of the case-study shop. Start from the lifecycle map of Assignment 02. For each stage, name the segment, the flow that serves it, what triggers the flow and what ends it. Write two of the emails in full.",
  deliverable:
    "Submit a PDF or DOCX of 3 to 5 pages using the lifecycle map template: the map, the flows, two finished emails with subject line and preview text, one test you would run, and a short note on where you used AI and what you changed in its drafts. Use the sample contact list, not real contacts.",
  dueLabel: "Due 2 Apr 2027",
  requiredReviews: 2,
  acceptedTypes: [".pdf", ".docx"],
  overallCommentPrompt: "Which email in your peer's plan would you most like to receive, and what makes it work?",
  criteria: [
    {
      id: "c1",
      label: "Task 1 · Map the lifecycle and the segments",
      maxPoints: 6,
      options: [
        { points: 6, label: "Each stage has a segment defined by behaviour, and a clear rule for entering and leaving it" },
        { points: 4, label: "Stages and segments are named; the rules are vague" },
        { points: 2, label: "One list for everyone, split by stage in name only" },
        { points: 0, label: "Not attempted" },
      ],
    },
    {
      id: "c2",
      label: "Task 2 · Design the flows",
      maxPoints: 5,
      options: [
        { points: 5, label: "Every flow has a trigger, delays, an exit and a frequency limit" },
        { points: 3, label: "Triggers and messages are given; exits or limits are missing" },
        { points: 0, label: "Not attempted" },
      ],
    },
    {
      id: "c3",
      label: "Task 3 · Write two emails",
      maxPoints: 5,
      options: [
        { points: 5, label: "One reader, one action; subject line and preview text work together; every claim can be supported" },
        { points: 3, label: "Readable, but the email asks for several things at once" },
        { points: 0, label: "Not attempted" },
      ],
    },
    {
      id: "c4",
      label: "Task 4 · Plan one test and its measure",
      maxPoints: 4,
      options: [
        { points: 4, label: "One variable, a measure that does not rely on opens, and what result would decide it" },
        { points: 2, label: "A test is named without a measure" },
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
      question: "What makes an email list an owned audience?",
      platformPrompt: "Choose the correct option",
      explanation:
        "You hold the addresses and the permission that came with them, so you can reach those people without a platform deciding who sees the message. They can withdraw the permission at any time.",
      options: [
        { id: "a", label: "You paid for the addresses", feedback: "A bought list has no permission behind it, and sending to it damages your reputation." },
        {
          id: "b",
          label: "People gave you their address and permission, and no feed decides who sees your message",
          correct: true,
          feedback: "Correct. Permission and direct delivery are what you own.",
        },
        { id: "c", label: "The list is stored on your own computer", feedback: "Where the file sits does not matter. Permission does." },
        { id: "d", label: "Subscribers cannot leave", feedback: "They can, and an unsubscribe link has to make it easy." },
      ],
    },
    {
      question: "Which of these is a behavioural segment?",
      platformPrompt: "Choose the correct option",
      explanation:
        "A behavioural segment is defined by what people did: bought, opened, browsed, stopped. It changes as they act, which is why it suits automated flows.",
      options: [
        { id: "a", label: "Subscribers aged 25 to 34", feedback: "That is a demographic. It does not say what they did." },
        { id: "b", label: "Subscribers in one city", feedback: "That is a location. Useful for an event, but not behaviour." },
        {
          id: "c",
          label: "Customers who bought once, more than 90 days ago, and not since",
          correct: true,
          feedback: "Correct. It is defined by actions and by time, and people move in and out of it.",
        },
        { id: "d", label: "Everyone on the list", feedback: "That is the list, not a segment." },
      ],
    },
    {
      question: "An AI assistant suggests the subject line “Your order has shipped!” for a promotional email. What is wrong with it?",
      explanation:
        "A subject line is a promise about what is inside. One that imitates a transactional message gets the open and loses the trust, and it is the kind of line that earns spam complaints.",
      options: [
        { id: "a", label: "It is too short", feedback: "Length is not the problem." },
        {
          id: "b",
          label: "It misleads the reader about what the email contains",
          correct: true,
          feedback: "Correct. The open is won by a false promise, and complaints follow.",
        },
        { id: "c", label: "It has an exclamation mark", feedback: "A matter of style. The deception is the issue." },
        { id: "d", label: "Nothing, if it raises the open rate", feedback: "An open that ends in an unsubscribe or a complaint is a loss." },
      ],
    },
  ],
  articles: {
    "crm-m1-t2": {
      lede: "Every few years someone announces that email is finished. Meanwhile it remains the channel most businesses rely on to bring customers back. This reading explains why, and what the advantage depends on.",
      sections: [
        {
          heading: "An audience you own",
          paragraphs: [
            "On a social platform or a search engine, you reach people on someone else's terms. A change to how a feed ranks posts can halve the number of followers who see yours, and there is nothing to appeal. An email list is different. When you send to 5,000 subscribers, the message is delivered to 5,000 inboxes, provided you have looked after your sending reputation.",
            "That is what marketers mean by an owned audience. You do not own the people. You hold their address and their permission, and both stay with you if you change tools or if a platform changes its rules.",
          ],
        },
        {
          heading: "Permission is the asset",
          paragraphs: [
            "The value of a list is not its size. It is the number of people on it who expect to hear from you and are glad when they do. A list of 2,000 people who signed up for a weekly recipe is worth more than 20,000 addresses collected from a prize draw, because the second group never asked for your emails and will ignore them or mark them as spam.",
            "Spam complaints and ignored messages are how mailbox providers judge a sender. Send to people who did not ask, and your messages to the people who did start landing in the junk folder too. This is why the course begins with consent and deliverability, before a word of copy.",
          ],
        },
        {
          heading: "Low cost, so the limit is attention",
          paragraphs: [
            "Sending one more email costs almost nothing, which is the channel's strength and its trap. Because another send is nearly free, the temptation is to send more. The real cost is paid by the reader, in attention, and it comes back to you as unsubscribes.",
            "An AI assistant makes this sharper. It can draft ten emails in the time it took to write one. The question is no longer whether you can produce the message but whether this person, at this point in their relationship with you, has a reason to open it. The rest of the course is about answering that question: with segments in Module 2, and with personalisation and testing in Module 3.",
          ],
        },
      ],
      pullQuote: {
        text: "You do not own the people. You hold their address and their permission.",
        attribution: "Course notes, Module 1",
      },
      takeaways: [
        "Email reaches the inbox directly; no feed decides who sees it.",
        "The asset is permission, not the number of addresses.",
        "Sending to people who did not ask harms delivery to those who did.",
        "Sending is cheap, so the limit is the reader's attention: send for a reason.",
      ],
    },
    "crm-m2-t8": {
      lede: "An automated flow is a message, or a short series, that is sent when a person does something, not when the marketing calendar says so. A business can run dozens of them. Five do most of the work, and they are the ones to build first.",
      sections: [
        {
          heading: "Welcome, and the first purchase",
          paragraphs: [
            "The welcome flow starts when someone subscribes. It is the email most likely to be opened, because the person has just asked to hear from you. Use it to deliver what you promised on the sign-up form, to say what you will send and how often, and to invite one small next step.",
            "The post-purchase flow starts with an order. Its first job is practical: confirm, say when the order will arrive, explain how to use the product. Only later does it ask for a review or suggest something that goes with what was bought. A customer whose first order went smoothly is the most likely to place a second.",
          ],
        },
        {
          heading: "Abandoned cart and browse reminders",
          paragraphs: [
            "The abandoned cart flow starts when a known contact adds a product to the cart and does not order within a set time, often an hour. The first message is a reminder, not an offer: many people were simply interrupted. Answer the likely doubt, such as delivery cost or returns, before you consider a discount, or customers learn to leave carts on purpose.",
            "A browse reminder is the lighter version, for someone who viewed a product more than once without adding it. It needs a gentler tone and a stricter limit, because the signal is weaker and the message can feel like being watched.",
          ],
        },
        {
          heading: "Win-back, and when to stop",
          paragraphs: [
            "The win-back flow starts when a customer has gone quiet for longer than is normal for your business: 90 days for a shop people buy from monthly, a year for one they buy from each season. It asks one question, in effect: do you still want to hear from us?",
            "Every flow needs an exit and a limit. A person who orders must leave the abandoned cart flow at once. Someone who is in two flows should not receive two emails on the same day. And a contact who does not respond to the win-back should be moved to a sunset segment and, in time, removed. A smaller list of people who read your emails is delivered better than a large one that does not.",
          ],
        },
      ],
      pullQuote: {
        text: "A flow is sent because a person did something, not because the calendar said so.",
        attribution: "Course notes, Module 2",
      },
      takeaways: [
        "Build five flows first: welcome, post-purchase, abandoned cart, browse reminder and win-back.",
        "Each flow needs a trigger, a delay, a message with one action, and an exit.",
        "Remind before you discount, or you teach customers to wait for the offer.",
        "Set a frequency limit across flows, and retire contacts who no longer respond.",
      ],
    },
  },
  quizzes: {
    "crm-m1-t9": [
      {
        question: "What do SPF, DKIM and DMARC have in common?",
        platformPrompt: "Choose the correct option",
        hints: [
          "They are set up once, on the sending domain, not in each email.",
          "They answer a question the receiving mail server asks about the sender.",
        ],
        explanation:
          "All three are records published for the sending domain. They let a receiving server check that a message really comes from the domain it claims, and tell it what to do when the check fails.",
        reviewTopicId: "crm-m1-t3",
        reviewTopicTitle: "How an email reaches the inbox: authentication, reputation, filters",
        options: [
          { id: "a", label: "They are spam filters run by mailbox providers", feedback: "Filters use them, but they are records the sender publishes." },
          {
            id: "b",
            label: "They let a receiving server verify that a message comes from the domain it claims",
            correct: true,
            feedback: "Correct. They are how a sender proves who it is.",
          },
          { id: "c", label: "They are rules for writing subject lines", feedback: "They concern the sending domain, not the content." },
          { id: "d", label: "They guarantee delivery to the inbox", feedback: "Authentication is necessary, not sufficient. Reputation and content still count." },
        ],
      },
      {
        question: "Which way of growing a list protects deliverability best?",
        platformPrompt: "Choose the correct option",
        explanation:
          "Double opt-in asks a new subscriber to confirm by clicking a link in a first email. It removes mistyped and fake addresses and proves the person wants the emails, at the cost of a slightly smaller list.",
        reviewTopicId: "crm-m1-t5",
        reviewTopicTitle: "Growing a list without buying one: forms, offers and double opt-in",
        options: [
          { id: "a", label: "Buying a list of contacts in your industry", feedback: "None of them asked to hear from you. Expect complaints and blocked sends." },
          { id: "b", label: "Adding everyone who has ever emailed your support team", feedback: "Asking for help is not asking for marketing." },
          {
            id: "c",
            label: "A sign-up form with a clear promise, confirmed by double opt-in",
            correct: true,
            feedback: "Correct. Every address is real and every subscriber chose to be there.",
          },
          { id: "d", label: "A pre-ticked box at checkout", feedback: "A pre-ticked box is not a choice, and in many places it is not valid consent." },
        ],
      },
      {
        question: "A subscriber clicks Unsubscribe. What must happen?",
        explanation:
          "Unsubscribing has to be easy and has to be honoured promptly, without asking the person to log in or explain. Making it hard turns an unsubscribe into a spam complaint, which costs far more.",
        reviewTopicId: "crm-m1-t4",
        reviewTopicTitle: "Consent, unsubscribes and the rules you must follow",
        options: [
          {
            id: "a",
            label: "They are removed from marketing emails promptly, with no further steps required",
            correct: true,
            feedback: "Correct. Easy to leave is the rule, and it protects your reputation.",
          },
          { id: "b", label: "They are asked to log in to confirm", feedback: "A barrier. Many will mark the next email as spam instead." },
          { id: "c", label: "They receive three emails asking them to stay", feedback: "They asked you to stop. More emails are the opposite." },
          { id: "d", label: "They are moved to a different marketing list", feedback: "That ignores the request. They unsubscribed from your marketing, not from one list." },
        ],
      },
    ],
  },
  assignments: {
    "crm-m1-t11": {
      brief:
        "Write the welcome series for a new subscriber of a business you know, or of the case-study shop: three emails sent over the first week. For each one, write the content brief (the reader, the one action, the one message), the prompt you gave an AI assistant, and the draft you would send after editing, with its subject line and preview text. Say when each email is sent and what makes a subscriber leave the series early. Submit your work as a PDF or DOCX.",
      requirements: [
        "Three emails, each with a brief, a prompt, and an edited draft with subject line and preview text",
        "The timing of each email and the exit rule of the series",
        "One sentence per email on what you changed in the AI draft, and why",
        "Counts toward your final grade",
      ],
    },
    "crm-m2-t11": {
      brief:
        "Draw the lifecycle of one customer journey on the lifecycle map template: the stages a person passes through, from new subscriber to repeat customer and to lapsed. Using the sample contact list, define one segment for each stage by behaviour (what the person did, and when), and count how many of the 500 contacts fall into it. For each stage, name the flow that serves the segment. Submit the completed template as a PDF or DOCX.",
      requirements: [
        "At least four lifecycle stages, each with the rule for entering and leaving it",
        "One behavioural segment per stage, with the number of sample contacts in it",
        "The flow for each stage: trigger, first message and exit",
        "Counts toward your final grade",
      ],
    },
  },
  ora: {
    "crm-m3-t7": FINAL_PROJECT,
    "crm-m3-t8": FINAL_PROJECT,
  },
};
