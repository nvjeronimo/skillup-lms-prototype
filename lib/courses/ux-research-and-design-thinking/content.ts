import type { CourseContent } from "@/lib/courses/kit";

export const content: CourseContent = {
  byline: {
    author: "Dr. Marta Silva",
    role: "Lead instructor · UX Research and Design Thinking",
    updated: "September 2026",
  },
  quiz: [
    {
      question: "What is the purpose of the Empathize stage in design thinking?",
      platformPrompt: "Choose the correct option",
      explanation:
        "Empathize comes first so that the problem you define is one real people have. Ideas, prototypes and tests all come after it.",
      options: [
        {
          id: "a",
          label: "To understand people's needs and context before defining the problem",
          correct: true,
          feedback: "Correct. The later stages build on what you learn here.",
        },
        { id: "b", label: "To test a finished prototype", feedback: "That is the Test stage, at the other end of the process." },
        { id: "c", label: "To generate as many ideas as possible", feedback: "That is Ideate. It needs a defined problem to work on." },
        { id: "d", label: "To choose the visual style", feedback: "Visual style is a design decision made much later." },
      ],
    },
    {
      question: "Which of these is the strongest evidence for a design decision?",
      platformPrompt: "Choose the correct option",
      explanation:
        "Observed behaviour across several participants is stronger than opinion, prediction or what another product does.",
      options: [
        { id: "a", label: "What one stakeholder believes users want", feedback: "A belief is a hypothesis to test, not evidence." },
        { id: "b", label: "What participants say they would do in future", feedback: "People are poor at predicting their own behaviour." },
        { id: "c", label: "What several participants were observed doing", correct: true, feedback: "Correct. Behaviour, seen more than once, is the firmest ground." },
        { id: "d", label: "What a competitor has launched", feedback: "A competitor's choice tells you about their users and constraints, not yours." },
      ],
    },
    {
      question: "A persona should be based on…",
      explanation:
        "A persona summarises patterns found across research participants. Without that link to evidence it is a character the team invented.",
      options: [
        { id: "a", label: "The team's ideal customer", feedback: "That describes who the team hopes for, not who was found." },
        { id: "b", label: "Demographic data alone", feedback: "Age and location say little about goals and behaviour." },
        { id: "c", label: "Patterns found in research with real users", correct: true, feedback: "Correct. Each trait should trace back to participants." },
        { id: "d", label: "A single memorable interview", feedback: "One person is a case, not a pattern." },
      ],
    },
  ],
  articles: {
    "uxr-m1-t4": {
      lede: "An interview guide is a one-page plan for a conversation. It keeps you on the research question when the conversation wanders, and it makes five interviews comparable. It is not a script to read aloud.",
      sections: [
        {
          heading: "Start from what you need to learn",
          paragraphs: [
            "Write the research question at the top of the page: the thing the team does not know and has to decide on. “How do people choose where to book a table for a group?” is a research question. “Would people use our group-booking feature?” is not: it asks for a prediction, and people are poor at predicting their own behaviour.",
            "Under it, list three or four topics you need to cover. Topics, not questions: how they do it today, what goes wrong, what they have tried, who else is involved.",
          ],
        },
        {
          heading: "Write questions that ask for stories",
          paragraphs: [
            "For each topic, write one opening question about a specific past occasion: “Tell me about the last time you organised a dinner for more than four people.” Then note two or three follow-ups to use if the story stalls: what happened next, what was hard about that, how they decided.",
            "Check each question against three rules. It is open, so it cannot be answered with yes or no. It is neutral, so it does not suggest the answer. It asks one thing at a time.",
          ],
        },
        {
          heading: "Shape the session",
          paragraphs: [
            "Order the guide the way a conversation flows: an introduction that explains the purpose and asks for consent to take notes or record, a warm-up about the person, the main topics from the general to the specific, and a close that asks what you missed.",
            "Run one pilot interview with a colleague before the first real session. You will find the question nobody understands and the topic that takes twice as long as planned. Change the guide, then keep it stable for the rest of the round.",
          ],
        },
      ],
      pullQuote: {
        text: "Ask about the last time, not about next time.",
        attribution: "Course notes, Module 1",
      },
      takeaways: [
        "Put the research question at the top; every question in the guide should serve it.",
        "Plan topics first, then one story question and a few follow-ups for each.",
        "Keep questions open, neutral and single.",
        "Pilot the guide once before the first real interview.",
      ],
    },
  },
  quizzes: {
    "uxr-m1-t5": [
      {
        question: "Which of these is a leading question?",
        platformPrompt: "Choose the correct option",
        hints: [
          "A leading question suggests its own answer.",
          "Look for the question that names a feeling the person has not mentioned.",
        ],
        explanation:
          "A leading question carries the answer inside it. Asking what happened, and how it went, lets the person supply the feeling themselves.",
        reviewTopicId: "uxr-m1-t3",
        reviewTopicTitle: "Discovery interview techniques",
        options: [
          { id: "a", label: "Tell me about the last time you booked a table for a group.", feedback: "Open and neutral: it asks for a story." },
          {
            id: "b",
            label: "Don't you find it frustrating when booking sites hide the price?",
            correct: true,
            feedback: "Correct. It tells the person what to feel before they answer.",
          },
          { id: "c", label: "What did you do after the booking failed?", feedback: "A neutral follow-up about what happened." },
          { id: "d", label: "Who else was involved in the decision?", feedback: "Open and neutral." },
        ],
      },
      {
        question: "Why ask about a specific past occasion rather than what someone usually does?",
        platformPrompt: "Choose the correct option",
        explanation:
          "“Usually” invites a tidy summary. A specific occasion brings back the steps, the tools and what went wrong, which is the material you need.",
        reviewTopicId: "uxr-m1-t3",
        reviewTopicTitle: "Discovery interview techniques",
        options: [
          { id: "a", label: "It makes the interview shorter.", feedback: "Stories often take longer. The gain is detail, not time." },
          {
            id: "b",
            label: "A specific occasion gives steps and details; “usually” gives a summary and opinions.",
            correct: true,
            feedback: "Correct. Detail from a real occasion is evidence.",
          },
          { id: "c", label: "People prefer talking about the past.", feedback: "Preference is not the reason. The quality of the detail is." },
          { id: "d", label: "It removes the need for follow-up questions.", feedback: "Follow-ups are still how you get to the reasons." },
        ],
      },
      {
        question: "Where does the research question go in an interview guide?",
        explanation:
          "The research question is for the team: it sits at the top of the guide and every interview question is checked against it. Participants are asked about their own experience.",
        reviewTopicId: "uxr-m1-t4",
        reviewTopicTitle: "Writing an interview guide",
        options: [
          {
            id: "a",
            label: "At the top of the guide, as the test every question has to pass",
            correct: true,
            feedback: "Correct. It keeps the guide, and the conversation, on course.",
          },
          { id: "b", label: "It is the first question you ask the participant", feedback: "Participants get questions about their own experience, not the team's question." },
          { id: "c", label: "In the closing section", feedback: "The close asks what you missed. The research question frames the whole guide." },
          { id: "d", label: "It is agreed by the team but not written down", feedback: "Unwritten, it drifts from one interview to the next." },
        ],
      },
    ],
  },
  assignments: {},
  ora: {
    "uxr-m1-t10": {
      brief:
        "Using the five interview transcripts of the case study (or your own interviews, if you have run at least three), draft one persona. Show the evidence behind it: the patterns you found across participants, and the quotes or observations that support each one.",
      deliverable:
        "Submit a PDF or DOCX of 1–2 pages: the persona (goals, behaviours, pain points, context) and an evidence table that links each trait to at least two participants.",
      dueLabel: "Due 24 Sep 2026",
      requiredReviews: 1,
      acceptedTypes: [".pdf", ".docx", ".png", ".jpg"],
      overallCommentPrompt: "Which part of your peer's persona was best supported by evidence?",
      criteria: [
        {
          id: "c1",
          label: "Task 1 · Ground the persona in evidence",
          maxPoints: 6,
          options: [
            { points: 6, label: "Every trait is linked to two or more participants" },
            { points: 4, label: "Most traits are linked to evidence; some rest on one participant" },
            { points: 2, label: "Evidence is mentioned but not linked to traits" },
            { points: 0, label: "Not attempted" },
          ],
        },
        {
          id: "c2",
          label: "Task 2 · Describe goals and behaviours",
          maxPoints: 5,
          options: [
            { points: 5, label: "Goals and behaviours are specific and come from the interviews" },
            { points: 3, label: "Goals are clear; behaviours are generic" },
            { points: 0, label: "Missing or invented" },
          ],
        },
        {
          id: "c3",
          label: "Task 3 · Put the pain points in context",
          maxPoints: 5,
          options: [
            { points: 5, label: "Each pain point is tied to a situation and a consequence" },
            { points: 3, label: "Pain points are listed without context" },
            { points: 0, label: "Not attempted" },
          ],
        },
        {
          id: "c4",
          label: "Task 4 · Keep the persona usable",
          maxPoints: 4,
          options: [
            { points: 4, label: "One page, easy to scan, no invented detail" },
            { points: 2, label: "Complete, but padded with detail the research does not support" },
            { points: 0, label: "Not attempted" },
          ],
        },
      ],
    },
  },
};
