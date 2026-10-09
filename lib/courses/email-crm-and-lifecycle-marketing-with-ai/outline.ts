import type { Course } from "@/lib/courses/kit";

/**
 * "Email, CRM, and Lifecycle Marketing with AI": course 6 of the AI Augmented Digital
 * Marketing program, not started. 34 topics in 3 modules, none done; Module 3 is locked
 * until Module 2 is complete. It opens on "Course Introduction", as the Program page says.
 */
export const outline: Course = {
  id: "crm",
  slug: "email-crm-and-lifecycle-marketing-with-ai",
  title: "Email, CRM, and Lifecycle Marketing with AI",
  provider: "SkillUp",
  courseType: "Course",
  difficulty: "Beginner",
  deliveryMode: "Flexible Learning",
  overallProgressPct: 0,
  modulesCompleted: 0,
  modulesTotal: 3,
  modules: [
    {
      id: "crm-m1",
      label: "MODULE 01",
      title: "Email Foundations & Deliverability",
      topicsCompleted: 0,
      topicsTotal: 12,
      isCompleted: false,
      lessons: [
        {
          id: "crm-m1-l1",
          label: "Permission and the inbox",
          topics: [
            {
              id: "crm-m1-t1",
              type: "Video",
              title: "Course Introduction",
              duration: "6 min",
              completed: false,
              transcript: [
                { id: "crm-m1-t1-ln1", ts: "0:00", text: "Welcome to course 6. The channels you have studied so far bring people to the brand. This course is about what happens after they arrive: the messages you send to people who asked to hear from you." },
                { id: "crm-m1-t1-ln2", ts: "0:20", text: "Email is the main one. It is the only large channel where you own the audience: a list of people who gave you their address and can take it back at any time." },
                { id: "crm-m1-t1-ln3", ts: "0:37", text: "Module 1 covers the foundations: permission, how a message reaches the inbox or fails to, and how to write an email that gets opened." },
                { id: "crm-m1-t1-ln4", ts: "0:52", text: "Module 2 adds the customer record. A CRM stores who each person is and what they have done, and that is what lets you send different messages to different people, automatically." },
                { id: "crm-m1-t1-ln5", ts: "1:10", text: "Module 3 is where AI does the most work: personalisation, send times, subject lines and testing. It ends with your final project, a lifecycle email plan for one customer journey." },
                { id: "crm-m1-t1-ln6", ts: "1:29", text: "One rule runs through the course. An AI assistant can draft an email in seconds, but it cannot tell you whether the person agreed to receive it. Permission is always your job." },
                { id: "crm-m1-t1-ln7", ts: "1:47", text: "You do not need an email platform to follow along. The sample contact list and the flow templates are in Handouts. Let's begin with why email still pays." },
              ],
            },
            { id: "crm-m1-t2", type: "Reading", title: "Why email still pays: an audience you own", duration: "approx. 12 min read", completed: false },
            { id: "crm-m1-t3", type: "Video", title: "How an email reaches the inbox: authentication, reputation, filters", duration: "16 min", completed: false },
            { id: "crm-m1-t4", type: "Reading", title: "Consent, unsubscribes and the rules you must follow", duration: "approx. 14 min read", completed: false },
            { id: "crm-m1-t5", type: "Video", title: "Growing a list without buying one: forms, offers and double opt-in", duration: "14 min", completed: false },
            { id: "crm-m1-t6", type: "Activity", title: "Check a sending domain against the deliverability checklist", duration: "approx. 20 min", completed: false },
          ],
        },
        {
          id: "crm-m1-l2",
          label: "Emails people open",
          topics: [
            { id: "crm-m1-t7", type: "Reading", title: "Subject lines, preview text and sender names", duration: "approx. 12 min read", completed: false },
            { id: "crm-m1-t8", type: "Video", title: "Drafting an email with an AI assistant: brief, draft, edit", duration: "16 min", completed: false },
            { id: "crm-m1-t9", type: "Practice Assignment", title: "Practice Quiz: Deliverability and consent", duration: "approx. 10 min", completed: false },
            { id: "crm-m1-t10", type: "Reading", title: "Designing for small screens, dark mode and screen readers", duration: "approx. 12 min read", completed: false },
            { id: "crm-m1-t11", type: "Graded Assignment", title: "Assignment 01 · Welcome series", duration: "approx. 45 min", completed: false },
            { id: "crm-m1-t12", type: "Quiz", title: "Graded Quiz: Email foundations", duration: "approx. 10 min", completed: false },
          ],
        },
      ],
    },
    {
      id: "crm-m2",
      label: "MODULE 02",
      title: "CRM, Segmentation & Lifecycle Automation",
      topicsCompleted: 0,
      topicsTotal: 12,
      isCompleted: false,
      lessons: [
        {
          id: "crm-m2-l1",
          label: "One record per customer",
          topics: [
            { id: "crm-m2-t1", type: "Video", title: "What a CRM holds: contacts, events and properties", duration: "14 min", completed: false },
            { id: "crm-m2-t2", type: "Reading", title: "Lifecycle stages: from subscriber to repeat customer", duration: "approx. 14 min read", completed: false },
            { id: "crm-m2-t3", type: "Video", title: "Segmenting by behaviour: recency, frequency and value", duration: "16 min", completed: false },
            { id: "crm-m2-t4", type: "Reading", title: "Keeping data clean: duplicates, bounces and stale contacts", duration: "approx. 12 min read", completed: false },
            { id: "crm-m2-t5", type: "Activity", title: "Build three segments from the sample contact list", duration: "approx. 25 min", completed: false },
            { id: "crm-m2-t6", type: "Practice Assignment", title: "Practice Quiz: Segments and lifecycle stages", duration: "approx. 10 min", completed: false },
          ],
        },
        {
          id: "crm-m2-l2",
          label: "Automated flows",
          topics: [
            { id: "crm-m2-t7", type: "Video", title: "Triggers, delays and exits: how a flow is built", duration: "16 min", completed: false },
            { id: "crm-m2-t8", type: "Reading", title: "The five flows most businesses need first", duration: "approx. 15 min read", completed: false },
            { id: "crm-m2-t9", type: "Video", title: "Abandoned cart and win-back flows, step by step", duration: "16 min", completed: false },
            { id: "crm-m2-t10", type: "Reading", title: "How often is too often: frequency caps and sunset rules", duration: "approx. 12 min read", completed: false },
            { id: "crm-m2-t11", type: "Graded Assignment", title: "Assignment 02 · Lifecycle map and segments", duration: "approx. 45 min", completed: false },
            { id: "crm-m2-t12", type: "Quiz", title: "Graded Quiz: CRM and automation", duration: "approx. 10 min", completed: false },
          ],
        },
      ],
    },
    {
      id: "crm-m3",
      label: "MODULE 03",
      title: "AI Personalisation, Final Project, and Wrap-Up",
      topicsCompleted: 0,
      topicsTotal: 10,
      isCompleted: false,
      lessons: [
        {
          id: "crm-m3-l1",
          label: "Personalisation and testing with AI",
          topics: [
            { id: "crm-m3-t1", type: "Video", title: "Personalisation beyond the first name", duration: "14 min", completed: false, locked: true },
            { id: "crm-m3-t2", type: "Reading", title: "Using AI for send times, subject lines and product picks", duration: "approx. 15 min read", completed: false, locked: true },
            { id: "crm-m3-t3", type: "Video", title: "Testing an email: one variable, enough recipients, a clear winner", duration: "15 min", completed: false, locked: true },
            { id: "crm-m3-t4", type: "Reading", title: "Measuring email when open rates cannot be trusted", duration: "approx. 12 min read", completed: false, locked: true },
            { id: "crm-m3-t5", type: "Practice Assignment", title: "Practice Quiz: Testing and measurement", duration: "approx. 10 min", completed: false, locked: true },
          ],
        },
        {
          id: "crm-m3-l2",
          label: "Final project and assessment",
          topics: [
            { id: "crm-m3-t6", type: "Reading", title: "Final project brief: a lifecycle email plan", duration: "approx. 12 min read", completed: false, locked: true },
            { id: "crm-m3-t7", type: "Project", title: "Final Project: Lifecycle email plan", duration: "approx. 90 min", completed: false, locked: true },
            { id: "crm-m3-t8", type: "Peer Review", title: "Review two lifecycle email plans", duration: "approx. 25 min", completed: false, locked: true },
            { id: "crm-m3-t9", type: "Quiz", title: "Final Assessment", duration: "approx. 20 min", completed: false, locked: true },
            { id: "crm-m3-t10", type: "Video", title: "Course wrap-up and next steps", duration: "5 min", completed: false, locked: true },
          ],
        },
      ],
    },
  ],
};
