import type { CourseContent } from "@/lib/courses/kit";

export const content: CourseContent = {
  byline: {
    author: "Nadia Petrova",
    role: "Lead instructor · Leadership in Remote Teams",
    updated: "September 2026",
  },
  quiz: [
    {
      question: "What does a team working agreement record?",
      platformPrompt: "Choose the correct option",
      explanation:
        "A working agreement writes down how the team has chosen to work: hours, channels, response times, how decisions are made. In an office these are picked up by watching. At a distance they have to be said.",
      options: [
        {
          id: "a",
          label: "How the team has agreed to work: hours, channels, response times and decisions",
          correct: true,
          feedback: "Correct. It replaces what people used to learn by sitting near each other.",
        },
        { id: "b", label: "Each person's objectives for the quarter", feedback: "Objectives say what to achieve. The agreement says how the team works together." },
        { id: "c", label: "The company's remote work policy", feedback: "The policy comes from the company. The agreement is written by the team, for the team." },
        { id: "d", label: "The rules the manager expects people to follow", feedback: "An agreement the manager writes alone is a rulebook. The team has to shape it." },
      ],
    },
    {
      question: "Which message is best sent asynchronously?",
      platformPrompt: "Choose the correct option",
      explanation:
        "Information that people need to read, think about and refer back to belongs in writing. Disagreement, bad news and anything personal are handled better live.",
      options: [
        { id: "a", label: "Feedback on a colleague's behaviour in a meeting", feedback: "Personal feedback needs tone and a chance to respond. Do it on a call." },
        { id: "b", label: "A disagreement between two people about priorities", feedback: "Disagreement escalates in text. Talk first, then write down what was agreed." },
        {
          id: "c",
          label: "A proposal with the options and a date by which comments are due",
          correct: true,
          feedback: "Correct. People can read it in their own hours and answer with thought.",
        },
        { id: "d", label: "News that a project has been cancelled", feedback: "Bad news that affects people's work should be heard, with room for questions." },
      ],
    },
    {
      question: "A remote team member's output has dropped over three weeks. What is the first step?",
      explanation:
        "At a distance you see results, not circumstances. A private conversation that starts with a question finds the cause, which may be workload, unclear priorities or something outside work.",
      options: [
        { id: "a", label: "Ask them to report their hours each day", feedback: "Monitoring answers a question you have not asked yet, and it costs trust." },
        { id: "b", label: "Raise it in the team meeting", feedback: "A performance concern is private." },
        { id: "c", label: "A private conversation that starts by asking how things are going", correct: true, feedback: "Correct. Find the cause before you choose the response." },
        { id: "d", label: "Wait another month to see whether it improves", feedback: "Three weeks is already a pattern. Waiting leaves the person alone with it." },
      ],
    },
  ],
  articles: {
    "lrt-m3-t2": {
      lede: "A remote team's calendar fills up for an understandable reason: a meeting is the easiest way to feel in touch. Across time zones each one is paid for in someone's early morning or evening. This reading gives you a way to go through the calendar and decide, meeting by meeting, what to keep, shorten or replace.",
      sections: [
        {
          heading: "Ask what each meeting is for",
          paragraphs: [
            "Take last week's calendar and write one word beside each recurring meeting: inform, decide, create or connect. A meeting that informs passes on news. One that decides ends with a choice. One that creates produces something together. One that connects is there so people know each other.",
            "If you need two words, the meeting is doing two jobs and probably neither well. If you cannot find a word, ask the people who attend what they would miss if it stopped. Sometimes the honest answer is nothing.",
          ],
        },
        {
          heading: "Replace, shorten or keep",
          paragraphs: [
            "Meetings that inform are the first to replace. A written update, read in each person's own hours, carries the same news and leaves a record. The async standup from the previous video is the daily version of this.",
            "Meetings that decide can usually be shortened. Send the proposal and the options two working days before, ask for comments in writing, and use the call only for the points still open. A one-hour decision meeting often becomes twenty minutes.",
            "Meetings that create or connect are the ones to keep and protect. Planning a quarter, working through a disagreement, welcoming a new colleague: these need voices and faces. Put them inside the hours the whole team shares.",
          ],
        },
        {
          heading: "Share the cost of the clock",
          paragraphs: [
            "List the working hours of each person in one row per time zone and mark the overlap. Everything live goes there first. If the overlap is short, it is the most valuable time of the week: do not spend it on status.",
            "When a meeting has to fall outside someone's day, rotate it. If the same two people take the late call every week, the team has decided whose time counts less, without anyone saying so. Record every live meeting that people may miss, and write the decisions in the place the team already reads.",
          ],
        },
      ],
      pullQuote: {
        text: "If the same people always take the late call, the team has decided whose time counts less.",
        attribution: "Course notes, Module 3",
      },
      takeaways: [
        "Label each recurring meeting: inform, decide, create or connect.",
        "Replace meetings that inform with a written update.",
        "Shorten meetings that decide by sending the proposal first.",
        "Keep meetings that create or connect, inside the shared hours, and rotate the awkward times.",
      ],
    },
  },
  quizzes: {
    "lrt-m2-t4": [
      {
        question: "A colleague eight hours ahead of you needs a decision from you to start their day. What should your team's norms make possible?",
        platformPrompt: "Choose the correct option",
        hints: [
          "Think about what they can do while you are asleep.",
          "The answer does not need anyone to change their working hours.",
        ],
        explanation:
          "Across a large time difference a question and its answer can cost a full day each way. Writing the request with its context and a default lets work continue without waiting.",
        reviewTopicId: "lrt-m2-t3",
        reviewTopicTitle: "Time zones, overlap hours and response times",
        options: [
          { id: "a", label: "That they call you when their day starts", feedback: "That is the middle of your night. The norm should not depend on it." },
          {
            id: "b",
            label: "That the request states the context, the deadline and what they will do if they hear nothing",
            correct: true,
            feedback: "Correct. A stated default means nobody loses a day waiting.",
          },
          { id: "c", label: "That you check messages before you go to sleep", feedback: "A norm that relies on one person being always available does not last." },
          { id: "d", label: "That decisions are only taken in the weekly meeting", feedback: "Then every decision waits up to a week." },
        ],
      },
      {
        question: "Which response-time norm is the most useful to write into a communication charter?",
        platformPrompt: "Choose the correct option",
        explanation:
          "One response time for everything makes every channel urgent or none. A norm per channel tells people where to post and how long they can stay focused before checking.",
        reviewTopicId: "lrt-m2-t1",
        reviewTopicTitle: "Sync or async: choosing the channel for the message",
        options: [
          { id: "a", label: "Reply to everything within the hour", feedback: "That makes deep work impossible and treats every message as urgent." },
          { id: "b", label: "Reply when you can", feedback: "Nobody can plan around that." },
          {
            id: "c",
            label: "A time per channel: chat within the working day, email within two, a phone call for what cannot wait",
            correct: true,
            feedback: "Correct. People know where to post and how long they can stay focused.",
          },
          { id: "d", label: "Reply at once to the manager, and to others when possible", feedback: "A norm based on rank teaches people to interrupt each other upward." },
        ],
      },
      {
        question: "You are about to send “Can we talk?” to someone on your team. What is the better message?",
        explanation:
          "A message with no topic leaves the other person to imagine the worst until you speak. Say what it is about, how long it takes and how urgent it is.",
        reviewTopicId: "lrt-m2-t2",
        reviewTopicTitle: "Writing messages that do not need a meeting",
        options: [
          { id: "a", label: "“Call me when you see this.”", feedback: "Still no topic, and now it sounds urgent." },
          {
            id: "b",
            label: "“Can we take 15 minutes today or tomorrow on the release date? Nothing is wrong, I want your view before I answer the client.”",
            correct: true,
            feedback: "Correct. Topic, length, urgency and reassurance, in two sentences.",
          },
          { id: "c", label: "“Are you free?”", feedback: "It asks for a commitment before saying what for." },
          { id: "d", label: "A calendar invitation with no description", feedback: "An unexplained invitation from a manager is the same message, with a time attached." },
        ],
      },
    ],
  },
  assignments: {
    "lrt-m2-t7": {
      brief:
        "Write the communication charter for a remote team: your own, or the case-study team of nine people in three time zones described in the Downloads tab. The charter says which channel is used for what, how fast people are expected to answer in each one, where decisions are recorded and which hours the team shares. Write it so that someone joining next month could follow it without asking. Submit your work as a PDF or DOCX.",
      requirements: [
        "One or two pages, written as agreements (“we…”), not as rules",
        "A channel table: purpose, expected response time, and what does not belong there",
        "The shared hours, and where decisions are written down",
        "Counts toward your final grade",
      ],
    },
  },
  ora: {
    "lrt-m4-t4": {
      brief:
        "You take over a remote team next month: use your own team, or the case-study team from Assignment 01. Write the plan for your first 30 days. Say what you will learn about the team and how, which rituals you will keep, change or start, how the team will know what is expected of each person, and how you will notice if someone is overloaded or isolated.",
      deliverable:
        "Submit a PDF or DOCX of 2 to 3 pages: the plan week by week, the weekly calendar you propose with its time zones, and one paragraph on what you will not change in the first month and why.",
      dueLabel: "Due 18 Oct 2026",
      requiredReviews: 2,
      acceptedTypes: [".pdf", ".docx"],
      overallCommentPrompt: "Which part of your peer's plan would you use with your own team?",
      criteria: [
        {
          id: "c1",
          label: "Task 1 · Learn before changing",
          maxPoints: 5,
          options: [
            { points: 5, label: "The first weeks name who is listened to, about what, and how" },
            { points: 3, label: "Listening is planned but stays general" },
            { points: 0, label: "The plan starts with changes" },
          ],
        },
        {
          id: "c2",
          label: "Task 2 · Design the rituals",
          maxPoints: 6,
          options: [
            { points: 6, label: "Each meeting or async ritual has a purpose and fits the shared hours" },
            { points: 4, label: "Rituals are listed with a purpose; time zones are not accounted for" },
            { points: 2, label: "A calendar with no stated purposes" },
            { points: 0, label: "Not attempted" },
          ],
        },
        {
          id: "c3",
          label: "Task 3 · Make expectations visible",
          maxPoints: 5,
          options: [
            { points: 5, label: "Outcomes per person or role, and where progress can be seen" },
            { points: 3, label: "Expectations are stated as activity or hours" },
            { points: 0, label: "Not attempted" },
          ],
        },
        {
          id: "c4",
          label: "Task 4 · Look after the people",
          maxPoints: 4,
          options: [
            { points: 4, label: "Specific signs of overload or isolation, and what the lead does on seeing them" },
            { points: 2, label: "Wellbeing is mentioned without signs or actions" },
            { points: 0, label: "Not attempted" },
          ],
        },
      ],
    },
  },
};
