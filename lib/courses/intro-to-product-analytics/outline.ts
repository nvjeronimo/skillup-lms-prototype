import type { Course } from "@/lib/courses/kit";

/**
 * "Intro to Product Analytics": a stand-alone course on My Learning, completed, with its
 * certificate issued on 12 Sep 2026. 32 topics, all done. No topic is flagged `active`:
 * a learner who reopens the course starts again from the first topic.
 */
export const outline: Course = {
  id: "ipa",
  slug: "intro-to-product-analytics",
  title: "Intro to Product Analytics",
  provider: "SkillUp",
  courseType: "Course",
  difficulty: "Beginner",
  deliveryMode: "Flexible Learning",
  overallProgressPct: 100,
  modulesCompleted: 4,
  modulesTotal: 4,
  modules: [
    {
      id: "ipa-m1",
      label: "MODULE 01",
      title: "What Product Analytics Is For",
      topicsCompleted: 8,
      topicsTotal: 8,
      isCompleted: true,
      lessons: [
        {
          id: "ipa-m1-l1",
          label: "Questions before dashboards",
          topics: [
            {
              id: "ipa-m1-t1",
              type: "Video",
              title: "Course Introduction",
              duration: "5 min",
              completed: true,
              transcript: [
                { id: "ipa-m1-t1-ln1", ts: "0:00", text: "Welcome to Intro to Product Analytics. This course is about one skill: answering a question about a product with the record of what people did in it." },
                { id: "ipa-m1-t1-ln2", ts: "0:14", text: "You do not need to write code. You need to read tables and charts carefully, and to ask what each number counts." },
                { id: "ipa-m1-t1-ln3", ts: "0:28", text: "Module 1 covers how product data is recorded and how to choose a metric. Module 2 follows people through a funnel, from first visit to first value." },
                { id: "ipa-m1-t1-ln4", ts: "0:46", text: "Module 3 asks who comes back, with retention curves and cohort tables. Module 4 covers A/B tests and how to write up what you found." },
                { id: "ipa-m1-t1-ln5", ts: "1:03", text: "There are two graded quizzes, one assignment and a final project: a product health report on a sample dataset, reviewed by two peers." },
                { id: "ipa-m1-t1-ln6", ts: "1:19", text: "The same sample product runs through the whole course, a subscription app for planning meals, so each module adds to what you know about it." },
                { id: "ipa-m1-t1-ln7", ts: "1:34", text: "Start with the next reading, on turning a business question into a metric. Everything else in the course builds on it." },
              ],
            },
            { id: "ipa-m1-t2", type: "Reading", title: "From business question to metric", duration: "approx. 12 min read", completed: true },
            {
              id: "ipa-m1-t3",
              type: "Video",
              title: "Events, users and sessions: how product data is recorded",
              duration: "14 min",
              completed: true,
              transcript: [
                { id: "ipa-m1-t3-ln1", ts: "0:00", text: "Almost everything in product analytics is built from one kind of record: an event. Someone did something, at a time." },
                { id: "ipa-m1-t3-ln2", ts: "0:13", text: "An event has a name, such as “signup_completed”, a timestamp, the user it belongs to, and properties that describe it: the plan, the device, the screen." },
                { id: "ipa-m1-t3-ln3", ts: "0:31", text: "A user is the person behind the events. The hard part is identity: the same person on a phone and on a laptop is two visitors until they log in on both." },
                { id: "ipa-m1-t3-ln4", ts: "0:50", text: "A session is a group of events close together in time. It is a convention, often thirty minutes without activity, and each tool draws the line a little differently." },
                { id: "ipa-m1-t3-ln5", ts: "1:09", text: "This matters when two reports disagree. Before you ask which one is right, ask what each one counts: events, sessions or users." },
                { id: "ipa-m1-t3-ln6", ts: "1:26", text: "Name events for what the person did, in the past tense, and keep one name for one action. “Clicked button” tells nobody anything six months later." },
                { id: "ipa-m1-t3-ln7", ts: "1:44", text: "In the next reading you write a tracking plan: the list of events and properties a team agrees on before anyone builds a chart." },
              ],
            },
            { id: "ipa-m1-t4", type: "Reading", title: "Writing a tracking plan", duration: "approx. 15 min read", completed: true },
          ],
        },
        {
          id: "ipa-m1-l2",
          label: "Metrics worth watching",
          topics: [
            { id: "ipa-m1-t5", type: "Video", title: "North star metrics and the inputs that move them", duration: "13 min", completed: true },
            { id: "ipa-m1-t6", type: "Activity", title: "Name the events for a sign-up flow", duration: "approx. 20 min", completed: true },
            { id: "ipa-m1-t7", type: "Practice Assignment", title: "Practice Quiz: Events and metrics", duration: "approx. 8 min", completed: true },
            { id: "ipa-m1-t8", type: "Quiz", title: "Graded Quiz: Analytics foundations", duration: "approx. 10 min", completed: true },
          ],
        },
      ],
    },
    {
      id: "ipa-m2",
      label: "MODULE 02",
      title: "Acquisition, Activation and Funnels",
      topicsCompleted: 8,
      topicsTotal: 8,
      isCompleted: true,
      lessons: [
        {
          id: "ipa-m2-l1",
          label: "Funnels",
          topics: [
            { id: "ipa-m2-t1", type: "Video", title: "The funnel: where people drop out", duration: "14 min", completed: true },
            { id: "ipa-m2-t2", type: "Reading", title: "Defining activation: the first moment of value", duration: "approx. 12 min read", completed: true },
            { id: "ipa-m2-t3", type: "Video", title: "Reading a funnel chart without fooling yourself", duration: "15 min", completed: true },
            { id: "ipa-m2-t4", type: "Activity", title: "Build a four-step funnel from an event table", duration: "approx. 25 min", completed: true },
          ],
        },
        {
          id: "ipa-m2-l2",
          label: "Segments",
          topics: [
            { id: "ipa-m2-t5", type: "Reading", title: "Segmentation: who behaves differently, and why it matters", duration: "approx. 13 min read", completed: true },
            { id: "ipa-m2-t6", type: "Video", title: "What averages hide: medians, percentiles and distributions", duration: "14 min", completed: true },
            { id: "ipa-m2-t7", type: "Practice Assignment", title: "Practice Quiz: Funnels and segments", duration: "approx. 8 min", completed: true },
            { id: "ipa-m2-t8", type: "Graded Assignment", title: "Assignment 01 · Funnel analysis", duration: "approx. 40 min", completed: true },
          ],
        },
      ],
    },
    {
      id: "ipa-m3",
      label: "MODULE 03",
      title: "Retention and Engagement",
      topicsCompleted: 8,
      topicsTotal: 8,
      isCompleted: true,
      lessons: [
        {
          id: "ipa-m3-l1",
          label: "Retention",
          topics: [
            { id: "ipa-m3-t1", type: "Video", title: "Retention curves and what a flat one tells you", duration: "14 min", completed: true },
            { id: "ipa-m3-t2", type: "Reading", title: "Cohort analysis step by step", duration: "approx. 15 min read", completed: true },
            { id: "ipa-m3-t3", type: "Activity", title: "Read a cohort table", duration: "approx. 20 min", completed: true },
            { id: "ipa-m3-t4", type: "Video", title: "Engagement: DAU, WAU, MAU and stickiness", duration: "12 min", completed: true },
          ],
        },
        {
          id: "ipa-m3-l2",
          label: "Churn and adoption",
          topics: [
            { id: "ipa-m3-t5", type: "Reading", title: "Churn: defining it before you measure it", duration: "approx. 12 min read", completed: true },
            { id: "ipa-m3-t6", type: "Video", title: "Feature adoption and depth of use", duration: "13 min", completed: true },
            { id: "ipa-m3-t7", type: "Practice Assignment", title: "Practice Quiz: Retention", duration: "approx. 8 min", completed: true },
            { id: "ipa-m3-t8", type: "Quiz", title: "Graded Quiz: Retention and engagement", duration: "approx. 12 min", completed: true },
          ],
        },
      ],
    },
    {
      id: "ipa-m4",
      label: "MODULE 04",
      title: "Experiments and Telling the Story",
      topicsCompleted: 8,
      topicsTotal: 8,
      isCompleted: true,
      lessons: [
        {
          id: "ipa-m4-l1",
          label: "A/B tests",
          topics: [
            { id: "ipa-m4-t1", type: "Video", title: "A/B tests: hypothesis, sample and duration", duration: "15 min", completed: true },
            { id: "ipa-m4-t2", type: "Reading", title: "Reading a test result: significance, effect size and patience", duration: "approx. 15 min read", completed: true },
            { id: "ipa-m4-t3", type: "Video", title: "Correlation, causation and the questions data cannot answer", duration: "12 min", completed: true },
            { id: "ipa-m4-t4", type: "Practice Assignment", title: "Practice Quiz: Experiments", duration: "approx. 8 min", completed: true },
          ],
        },
        {
          id: "ipa-m4-l2",
          label: "Final project",
          topics: [
            { id: "ipa-m4-t5", type: "Reading", title: "Writing an analysis people act on", duration: "approx. 12 min read", completed: true },
            { id: "ipa-m4-t6", type: "Project", title: "Final Project: Product health report", duration: "approx. 50 min", completed: true },
            { id: "ipa-m4-t7", type: "Peer Review", title: "Review two product health reports", duration: "approx. 18 min", completed: true },
            { id: "ipa-m4-t8", type: "Video", title: "Course wrap-up and next steps", duration: "6 min", completed: true },
          ],
        },
      ],
    },
  ],
};
