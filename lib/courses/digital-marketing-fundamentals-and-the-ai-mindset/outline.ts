import type { Course } from "@/lib/courses/kit";

/**
 * "Digital Marketing Fundamentals and the AI Mindset": course 1 of the AI Augmented Digital
 * Marketing program. 36 topics, all done: the learner finished it and holds its certificate.
 * No topic is flagged `active`: Review opens the course on its first topic.
 */
export const outline: Course = {
  id: "dmf",
  slug: "digital-marketing-fundamentals-and-the-ai-mindset",
  title: "Digital Marketing Fundamentals and the AI Mindset",
  provider: "SkillUp",
  courseType: "Course",
  difficulty: "Beginner",
  deliveryMode: "Flexible Learning",
  overallProgressPct: 100,
  modulesCompleted: 4,
  modulesTotal: 4,
  modules: [
    {
      id: "dmf-m1",
      label: "MODULE 01",
      title: "The Digital Marketing Landscape",
      topicsCompleted: 10,
      topicsTotal: 10,
      isCompleted: true,
      lessons: [
        {
          id: "dmf-m1-l1",
          label: "How digital marketing works",
          topics: [
            {
              id: "dmf-m1-t1",
              type: "Video",
              title: "Course Introduction",
              duration: "6 min",
              completed: true,
              transcript: [
                { id: "dmf-m1-t1-ln1", ts: "0:00", text: "Welcome to the first course of the program. Over four modules you will learn how digital marketing works and where AI fits into it." },
                { id: "dmf-m1-t1-ln2", ts: "0:17", text: "We start with the landscape: the channels a brand can use, and the journey a customer takes from first hearing of you to recommending you." },
                { id: "dmf-m1-t1-ln3", ts: "0:36", text: "Module 2 is about numbers. You will turn a business goal into objectives, read a funnel and work out what a customer costs to win." },
                { id: "dmf-m1-t1-ln4", ts: "0:55", text: "Module 3 introduces the AI mindset. An AI assistant drafts, sorts and summarises quickly. It does not know your customer, and it does not check its own facts." },
                { id: "dmf-m1-t1-ln5", ts: "1:16", text: "So the rule for this whole program is simple: you set the task, the assistant does a first pass, and you review before anything is published." },
                { id: "dmf-m1-t1-ln6", ts: "1:34", text: "Each module has short videos, readings, one activity and a practice quiz. Two assignments, two graded quizzes, a final project and a final assessment make up your grade." },
                { id: "dmf-m1-t1-ln7", ts: "1:55", text: "You need 70% to pass. The first reading is next: what digital marketing is, and what it is not." },
              ],
            },
            { id: "dmf-m1-t2", type: "Reading", title: "What digital marketing is, and what it is not", duration: "approx. 12 min read", completed: true },
            { id: "dmf-m1-t3", type: "Video", title: "Owned, earned and paid media", duration: "14 min", completed: true },
            { id: "dmf-m1-t4", type: "Reading", title: "The channels at a glance: search, social, email and display", duration: "approx. 15 min read", completed: true },
            { id: "dmf-m1-t5", type: "Activity", title: "Map the channels a brand already uses", duration: "approx. 25 min", completed: true },
          ],
        },
        {
          id: "dmf-m1-l2",
          label: "Customers and journeys",
          topics: [
            { id: "dmf-m1-t6", type: "Video", title: "The customer journey: from awareness to advocacy", duration: "16 min", completed: true },
            { id: "dmf-m1-t7", type: "Reading", title: "Personas and the job a customer wants done", duration: "approx. 15 min read", completed: true },
            { id: "dmf-m1-t8", type: "Practice Assignment", title: "Practice Quiz: Channels and journeys", duration: "approx. 10 min", completed: true },
            { id: "dmf-m1-t9", type: "Graded Assignment", title: "Assignment 01 · Customer journey map", duration: "approx. 45 min", completed: true },
            { id: "dmf-m1-t10", type: "Quiz", title: "Graded Quiz: The digital marketing landscape", duration: "approx. 15 min", completed: true },
          ],
        },
      ],
    },
    {
      id: "dmf-m2",
      label: "MODULE 02",
      title: "Goals, Funnels and Measurement",
      topicsCompleted: 10,
      topicsTotal: 10,
      isCompleted: true,
      lessons: [
        {
          id: "dmf-m2-l1",
          label: "Setting goals",
          topics: [
            { id: "dmf-m2-t1", type: "Video", title: "From business goals to marketing objectives", duration: "14 min", completed: true },
            { id: "dmf-m2-t2", type: "Reading", title: "Specific objectives and the metrics that follow", duration: "approx. 15 min read", completed: true },
            { id: "dmf-m2-t3", type: "Video", title: "The funnel and its conversion rates", duration: "18 min", completed: true },
            { id: "dmf-m2-t4", type: "Activity", title: "Calculate the conversion rates of a funnel", duration: "approx. 30 min", completed: true },
            { id: "dmf-m2-t5", type: "Reading", title: "Cost per acquisition, lifetime value and return on ad spend", duration: "approx. 18 min read", completed: true },
          ],
        },
        {
          id: "dmf-m2-l2",
          label: "Reading the numbers",
          topics: [
            { id: "dmf-m2-t6", type: "Video", title: "A first look at a web analytics report", duration: "20 min", completed: true },
            { id: "dmf-m2-t7", type: "Reading", title: "Attribution: which channel gets the credit for a sale", duration: "approx. 15 min read", completed: true },
            { id: "dmf-m2-t8", type: "Practice Assignment", title: "Practice Quiz: Metrics and funnels", duration: "approx. 10 min", completed: true },
            { id: "dmf-m2-t9", type: "Video", title: "Privacy, consent and first-party data", duration: "16 min", completed: true },
            { id: "dmf-m2-t10", type: "Graded Assignment", title: "Assignment 02 · Measurement plan", duration: "approx. 45 min", completed: true },
          ],
        },
      ],
    },
    {
      id: "dmf-m3",
      label: "MODULE 03",
      title: "The AI Mindset for Marketers",
      topicsCompleted: 10,
      topicsTotal: 10,
      isCompleted: true,
      lessons: [
        {
          id: "dmf-m3-l1",
          label: "What AI can do for a marketer",
          topics: [
            { id: "dmf-m3-t1", type: "Video", title: "What generative AI is, in plain terms", duration: "15 min", completed: true },
            { id: "dmf-m3-t2", type: "Reading", title: "Where AI helps in marketing, and where it does not", duration: "approx. 15 min read", completed: true },
            {
              id: "dmf-m3-t3",
              type: "Video",
              title: "Your first prompts: role, task, context and format",
              duration: "18 min",
              completed: true,
              transcript: [
                { id: "dmf-m3-t3-ln1", ts: "0:00", text: "In this video you write your first prompts for a marketing task. We use four parts: role, task, context and format." },
                { id: "dmf-m3-t3-ln2", ts: "0:15", text: "Start with a weak prompt: write a post about our new running shoe. The assistant has to guess the reader, the length and the point." },
                { id: "dmf-m3-t3-ln3", ts: "0:33", text: "Role first. Tell the assistant who it is working as: a copywriter for a small sports shop. That sets the vocabulary and the level of detail." },
                { id: "dmf-m3-t3-ln4", ts: "0:51", text: "Then the task, as one verb and one output: write three versions of a social post that announce the shoe." },
                { id: "dmf-m3-t3-ln5", ts: "1:08", text: "Context is what only you know: the reader runs twice a week, the shoe is lighter than last year's model, and stock arrives on Friday." },
                { id: "dmf-m3-t3-ln6", ts: "1:27", text: "Format closes the prompt: up to forty words each, no hashtags, one clear call to action. Limits given as numbers are followed far more often." },
                { id: "dmf-m3-t3-ln7", ts: "1:46", text: "Compare the two results side by side. The second set is usable, and it still needs you: check the facts, then pick one." },
              ],
            },
            { id: "dmf-m3-t4", type: "Activity", title: "Rewrite three weak prompts", duration: "approx. 25 min", completed: true },
            { id: "dmf-m3-t5", type: "Reading", title: "The marketer as supervisor: review before you publish", duration: "approx. 12 min read", completed: true },
          ],
        },
        {
          id: "dmf-m3-l2",
          label: "Using AI responsibly",
          topics: [
            { id: "dmf-m3-t6", type: "Video", title: "Bias, accuracy and made-up facts", duration: "16 min", completed: true },
            { id: "dmf-m3-t7", type: "Reading", title: "Customer data and AI tools: what not to paste", duration: "approx. 12 min read", completed: true },
            { id: "dmf-m3-t8", type: "Practice Assignment", title: "Practice Quiz: Prompting basics", duration: "approx. 10 min", completed: true },
            { id: "dmf-m3-t9", type: "Video", title: "An AI-assisted workflow, start to finish", duration: "22 min", completed: true },
            { id: "dmf-m3-t10", type: "Quiz", title: "Graded Quiz: The AI mindset", duration: "approx. 15 min", completed: true },
          ],
        },
      ],
    },
    {
      id: "dmf-m4",
      label: "MODULE 04",
      title: "Final Project, Assessment, and Wrap-Up",
      topicsCompleted: 6,
      topicsTotal: 6,
      isCompleted: true,
      lessons: [
        {
          id: "dmf-m4-l1",
          label: "Final project",
          topics: [
            { id: "dmf-m4-t1", type: "Reading", title: "Final project brief: a one-page marketing plan", duration: "approx. 15 min read", completed: true },
            { id: "dmf-m4-t2", type: "Video", title: "Planning your one-page marketing plan", duration: "14 min", completed: true },
            { id: "dmf-m4-t3", type: "Project", title: "Final Project: One-page marketing plan", duration: "approx. 2 h", completed: true },
            { id: "dmf-m4-t4", type: "Peer Review", title: "Review two marketing plans", duration: "approx. 20 min", completed: true },
          ],
        },
        {
          id: "dmf-m4-l2",
          label: "Assessment and wrap-up",
          topics: [
            { id: "dmf-m4-t5", type: "Quiz", title: "Final Assessment", duration: "approx. 20 min", completed: true },
            { id: "dmf-m4-t6", type: "Video", title: "Course wrap-up and next steps", duration: "5 min", completed: true },
          ],
        },
      ],
    },
  ],
};
