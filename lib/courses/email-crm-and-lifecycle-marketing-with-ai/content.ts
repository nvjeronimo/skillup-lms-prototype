import type { CourseContent, OraContent } from "@/lib/courses/kit";
import { activities } from "./activities";

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
    "crm-m1-t4": {
      lede: "Email marketing is regulated almost everywhere, and the rules differ from one country to the next. This reading is not legal advice. It sets out the principles that the main laws share, so that you know what to ask before a list is used and can recognise a practice that will cause trouble.",
      sections: [
        {
          heading: "Consent, and what counts as it",
          paragraphs: [
            "In many countries, including those of the European Union and the United Kingdom, you need a person's consent before sending them marketing email. Consent means a clear action for a stated purpose: a box the person ticks themselves, next to words that say what they will receive. A box ticked in advance does not count, and neither does a line buried in the terms.",
            "Some laws allow a narrow exception for existing customers: you may email about similar products if the person was offered a way to refuse when they gave the address, and in every message since. Other countries, such as the United States, permit email without prior consent and regulate its content and the opt-out. When your list crosses borders, working to the stricter standard is the simplest policy.",
          ],
        },
        {
          heading: "Proof and purpose",
          paragraphs: [
            "Keep a record for each contact: when they signed up, on which form, and what the form said. If a subscriber or a regulator asks, “they must have opted in” is not an answer.",
            "Consent is tied to its purpose. Someone who gave an address to receive a receipt has not agreed to a weekly newsletter. Someone who downloaded a guide from a partner has not agreed to hear from you. Bought and scraped lists fail on both counts, and they wreck deliverability as well.",
          ],
        },
        {
          heading: "Unsubscribes",
          paragraphs: [
            "Every marketing email needs a working way to stop that is easy to find and takes one or two clicks. Do not ask for a login, a reason or a password. Honour the request quickly: the law allows a set number of days in some countries, and good systems do it at once.",
            "Large mailbox providers also expect bulk senders to support one-click unsubscribe in the message header, which shows as an unsubscribe link beside the sender's name. An unsubscribe is a better outcome than a spam complaint. Make it the easier of the two.",
          ],
        },
        {
          heading: "Honest identification",
          paragraphs: [
            "The message must say who sent it. Use a real sender name, a subject line that matches the content, and a postal address for the business where the law asks for one. A subject line that imitates an order update to win an open is deceptive, and filters as well as regulators treat it that way.",
            "Transactional messages such as receipts and password resets are treated differently from marketing, because the customer needs them. Keep promotion out of them, or the distinction is lost.",
            "An AI assistant has no idea who on your list agreed to what. It will draft the message. Whether it may be sent to this person is a question for your records.",
          ],
        },
      ],
      pullQuote: {
        text: "A person who cannot leave your list easily will leave it through the spam button.",
        attribution: "Course notes, Module 1",
      },
      takeaways: [
        "Rules differ by country; when unsure, work to the stricter one and take advice.",
        "Consent is a clear action for a stated purpose, and you keep the proof.",
        "Every marketing email carries an easy unsubscribe, honoured promptly.",
        "Identify the sender honestly and keep promotion out of transactional mail.",
      ],
    },
    "crm-m1-t7": {
      lede: "In a crowded inbox an email is three pieces of text: who it is from, the subject line and the preview. The reader decides on those alone whether to open, ignore or delete. This reading takes them in the order the eye does.",
      sections: [
        {
          heading: "The sender name",
          paragraphs: [
            "People look at the sender first, and open mail from names they recognise. Use the name subscribers know you by, and keep it the same from one send to the next. “Green Corner” or “Maya at Green Corner” works. A bare “noreply” does not, and it also tells the reader that nobody will see a reply.",
            "Send from an address on your own domain that accepts replies. Replies are a strong positive signal to mailbox providers, and some of the most useful customer feedback arrives that way.",
          ],
        },
        {
          heading: "The subject line",
          paragraphs: [
            "Phones show about 30 to 40 characters of a subject line, so put the point in the first few words. Be specific about what is inside: “Three plants that survive a dark hallway” tells the reader more than “Our March newsletter”.",
            "Curiosity can work if the email pays it off. What does not work for long is the trick: “Re:” on a message that is no reply, false urgency, capitals and rows of exclamation marks. They may win one open. They lose trust, and filters treat them as marks of spam.",
          ],
        },
        {
          heading: "The preview text",
          paragraphs: [
            "The preview is the grey line after the subject. If you do not set it, the mail app fills it with whatever comes first in the message, which is often “View this email in your browser”.",
            "Write it as the second half of the subject line. If the subject is “Three plants that survive a dark hallway”, the preview might be “And the one mistake that kills all of them”. Do not repeat the subject, and do not waste the space on housekeeping.",
          ],
        },
        {
          heading: "Testing, with care",
          paragraphs: [
            "Most email tools will send two subject lines to a small part of the list and the better one to the rest. Use it, and change only one thing between the two versions.",
            "Be careful what you count. Some mail apps load messages in the background for privacy, which records an open that no person made. Judge a subject line by the clicks and orders that follow, not by opens alone. An AI assistant is a quick source of twenty candidate lines. Choosing two worth testing, and checking that they are honest, is your part.",
          ],
        },
      ],
      pullQuote: {
        text: "The subject line makes a promise. The first screen of the email has to keep it.",
        attribution: "Course notes, Module 1",
      },
      takeaways: [
        "Keep a recognisable sender name and a reply address that someone reads.",
        "Put the point of the subject line in the first 30 to 40 characters, and be specific.",
        "Write the preview text as a continuation of the subject.",
        "Test one change at a time, and judge by clicks and orders.",
      ],
    },
    "crm-m1-t10": {
      lede: "Your email will be opened on a phone more often than on a computer, sometimes with the colours inverted, sometimes read aloud by software, and often with images switched off. A design that only works in the preview window of your email tool will fail many of its readers. This reading covers the three conditions to design for.",
      sections: [
        {
          heading: "Small screens",
          paragraphs: [
            "Use a single column. Side-by-side columns shrink to unreadable strips on a phone. Set body text at 16 pixels or more, keep paragraphs short, and leave space between them.",
            "Make the main action a button that a thumb can hit: around 44 pixels tall, with room around it, and with words that say what happens, such as “Read the watering guide”. Put it high enough that most readers see it without scrolling far.",
          ],
        },
        {
          heading: "Dark mode",
          paragraphs: [
            "Many readers set their mail app to a dark theme, and the app may then change your colours for you. Black text on a transparent background can become black on black. A logo with dark lettering can vanish.",
            "A few habits prevent most of this. Use real text, not text inside images. Give logos a transparent background and make sure they are readable on both light and dark, or add a light outline. Avoid pure white and pure black blocks, which invert harshly. Then test in both modes before sending.",
          ],
        },
        {
          heading: "Screen readers and images off",
          paragraphs: [
            "A screen reader reads the email aloud in the order of its code. Use real headings, write link text that makes sense out of context, and give every meaningful image a short description in its alternative text. Decorative images get an empty one, so that the software skips them.",
            "The same alternative text is what readers see when images are blocked, which some work mail systems do by default. An email that is one large picture then shows as an empty box. Keep the message in text, and let images support it.",
            "Contrast matters to everyone reading in sunlight. Aim for a ratio of at least 4.5 to 1 between text and its background, and do not rely on colour alone to mark a link.",
          ],
        },
        {
          heading: "Test before you send",
          paragraphs: [
            "Send the email to yourself and open it on a phone in light mode, then dark. Turn images off. If you can, listen to it with the phone's screen reader for one minute. Each check takes less time than fixing a campaign after it has gone to the whole list.",
            "An AI assistant can draft alternative text from a description of the image and can point out vague link text. It cannot see how your email renders in a particular mail app. Only a test send shows that.",
          ],
        },
      ],
      pullQuote: {
        text: "An email that only works with images on, in light mode, on a wide screen was designed for the person who made it.",
        attribution: "Course notes, Module 1",
      },
      takeaways: [
        "One column, text of 16 pixels or more, and a button a thumb can hit.",
        "Use real text and logos that survive a dark background; test both modes.",
        "Write alternative text and meaningful link text; keep the message out of images.",
        "Send a test and check phone, dark mode and images off before every campaign.",
      ],
    },
    "crm-m2-t2": {
      lede: "A customer's relationship with a business changes over time, and the right message changes with it. Lifecycle stages are a small set of labels that say where each contact stands today. They let you stop sending one newsletter to everyone and start answering the question each person has now.",
      sections: [
        {
          heading: "The stages",
          paragraphs: [
            "A simple model for a shop has six. A subscriber has given an address and not bought. A first-time customer has placed one order. A repeat customer has placed two or more. A loyal customer buys regularly and often spends more. An at-risk customer used to buy and has gone quiet. A lapsed customer has been quiet for so long that you should assume they have left.",
            "Your business may need different names. A service might have lead, trial, client and renewal. Keep the list short enough that everyone can recite it.",
          ],
        },
        {
          heading: "Rules, not impressions",
          paragraphs: [
            "A stage is only useful if a rule decides it. “Repeat customer: two or more orders, the latest within 120 days” can be applied by software. “Engaged customer” cannot.",
            "Take the time limits from your own data. If most customers who reorder do so within 45 days, someone silent for 90 is at risk. For a shop that sells mattresses the same gap means nothing. Each contact should sit in exactly one stage at a time, and move automatically when the rule says so.",
          ],
        },
        {
          heading: "The question at each stage",
          paragraphs: [
            "A subscriber is asking whether to trust you with a first order: show what you sell, proof from other customers, and a reason to try. A first-time customer is asking whether they chose well: help them use the product, then suggest the natural next one.",
            "A repeat customer wants to be recognised, not treated like a stranger: early access, a restock reminder, fewer generic promotions. An at-risk customer needs a reason to return and a simple way to say what went wrong. A lapsed customer gets one last invitation, and then silence.",
          ],
        },
        {
          heading: "The moves that matter most",
          paragraphs: [
            "Count how many contacts sit in each stage and how many move each month. Two moves usually deserve the most attention. Subscriber to first order, because a list that never buys is a cost. And first order to second, because in most shops a customer who has bought twice is much more likely to keep buying than one who has bought once.",
            "This map of stages, rules and messages is what you will draw in Assignment 02.",
          ],
        },
      ],
      pullQuote: {
        text: "A lifecycle stage is a rule about what someone has done, not an opinion about who they are.",
        attribution: "Course notes, Module 2",
      },
      takeaways: [
        "Stages label where each contact stands: subscriber, first-time, repeat, loyal, at-risk, lapsed.",
        "Define each stage by a rule on orders and dates, drawn from your own data.",
        "Each stage has its own question, and the message answers it.",
        "Watch two moves closely: subscriber to first order, and first order to second.",
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
    "crm-m1-t12": [
      {
        question: "Which of these most damages a sender's reputation with mailbox providers?",
        platformPrompt: "Choose the correct option",
        explanation:
          "Reputation is built from how recipients treat your mail. Spam complaints and messages to dead addresses lower it. Opens, replies and clicks raise it.",
        reviewTopicId: "crm-m1-t3",
        reviewTopicTitle: "How an email reaches the inbox: authentication, reputation, filters",
        options: [
          { id: "a", label: "Sending at the same time every week", feedback: "A regular rhythm is normal and does no harm." },
          { id: "b", label: "Subscribers replying to the emails", feedback: "Replies are a positive signal." },
          {
            id: "c",
            label: "A rising share of recipients marking the messages as spam",
            correct: true,
            feedback: "Correct. Complaints are the clearest sign that the mail is unwanted.",
          },
          { id: "d", label: "Using a recognisable sender name", feedback: "Recognition helps opens and lowers complaints." },
        ],
      },
      {
        question: "A customer typed an email address at checkout to receive a receipt. The form said nothing else. Under a consent-based law, what may the shop send?",
        platformPrompt: "Choose the correct option",
        explanation:
          "Under consent-based rules, permission covers the purpose stated when it was given. An address supplied for a receipt allows order messages. Marketing needs its own consent or a limited existing-customer exception.",
        reviewTopicId: "crm-m1-t4",
        reviewTopicTitle: "Consent, unsubscribes and the rules you must follow",
        options: [
          { id: "a", label: "A weekly newsletter, since the shop now has the address", feedback: "Holding an address is not consent. It was given for a receipt." },
          {
            id: "b",
            label: "Messages about the order. Marketing needs consent, or a narrow exception the customer was told about and could refuse",
            correct: true,
            feedback: "Correct. Consent is tied to the purpose stated when the address was given.",
          },
          {
            id: "c",
            label: "Anything, as long as there is an unsubscribe link",
            feedback: "An unsubscribe link is required, but it does not replace permission where consent is the rule.",
          },
          { id: "d", label: "Offers from partner companies", feedback: "The customer never agreed to hear from third parties." },
        ],
      },
      {
        question: "An email is a single large image that contains all the text. Which readers receive an empty or unusable message?",
        explanation:
          "Text inside an image cannot be read by a screen reader and disappears when images are blocked. Keep the message in real text and give images alternative text.",
        reviewTopicId: "crm-m1-t10",
        reviewTopicTitle: "Designing for small screens, dark mode and screen readers",
        options: [
          { id: "a", label: "Only people on slow connections", feedback: "They wait longer. Others get nothing at all." },
          { id: "b", label: "Nobody: all mail apps show images", feedback: "Some block images by default, especially at work." },
          { id: "c", label: "Only people using dark mode", feedback: "Dark mode may alter colours, but the bigger failures are blocked images and screen readers." },
          {
            id: "d",
            label: "People whose mail app blocks images, and people using a screen reader",
            correct: true,
            feedback: "Correct. Neither can get at text that exists only as a picture.",
          },
        ],
      },
    ],
    "crm-m2-t6": [
      {
        question: "In a CRM, which of these is an event and not a property?",
        platformPrompt: "Choose the correct option",
        hints: [
          "An event happened at a moment in time.",
          "A property has one current value.",
        ],
        explanation:
          "An event is something that happened, with a time, and events accumulate. A property describes the contact now and has a single current value.",
        reviewTopicId: "crm-m2-t1",
        reviewTopicTitle: "What a CRM holds: contacts, events and properties",
        options: [
          { id: "a", label: "Country: Portugal", feedback: "A property: one current value that describes the contact." },
          { id: "b", label: "Lifecycle stage: repeat customer", feedback: "A property, worked out from the order events." },
          { id: "c", label: "Placed an order on 3 March", correct: true, feedback: "Correct. It happened at a moment in time and joins the contact's history." },
          { id: "d", label: "Total spent: 240", feedback: "A property, calculated from all the order events." },
        ],
      },
      {
        question: "A customer placed nine orders last year with a high total, and has not ordered for five months. Which description fits?",
        platformPrompt: "Choose the correct option",
        explanation:
          "Recency is time since the last order, frequency the number of orders, value the amount spent. Someone who used to buy often and has stopped is high on frequency and value and low on recency.",
        reviewTopicId: "crm-m2-t3",
        reviewTopicTitle: "Segmenting by behaviour: recency, frequency and value",
        options: [
          {
            id: "a",
            label: "High recency, high frequency, high value: a best customer",
            feedback: "Recency measures time since the last order. Five months is not recent.",
          },
          {
            id: "b",
            label: "Low recency, high frequency, high value: a valuable customer at risk",
            correct: true,
            feedback: "Correct. This is the group a win-back message is for.",
          },
          { id: "c", label: "High recency, low frequency, low value: a new customer", feedback: "Nine orders and a high total describe an established customer." },
          { id: "d", label: "Low on all three: email rarely", feedback: "Frequency and value are high. Only recency is low." },
        ],
      },
      {
        question: "Which definition of a lifecycle stage can a system apply automatically?",
        explanation:
          "A stage needs a rule based on recorded events and dates, so that every contact falls into exactly one stage and moves when the rule is met.",
        reviewTopicId: "crm-m2-t2",
        reviewTopicTitle: "Lifecycle stages: from subscriber to repeat customer",
        options: [
          { id: "a", label: "Engaged customer: someone who likes the brand", feedback: "Liking cannot be measured from a record." },
          { id: "b", label: "Good customer: someone worth keeping", feedback: "That is an opinion with no rule behind it." },
          { id: "c", label: "Warm lead: seems interested", feedback: "“Seems” is an impression. A rule needs events and dates." },
          {
            id: "d",
            label: "Repeat customer: two or more orders, the latest within 120 days",
            correct: true,
            feedback: "Correct. Orders and dates are on the record, so software can apply the rule.",
          },
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
  activities,
};
