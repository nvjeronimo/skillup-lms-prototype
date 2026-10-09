import type { Course } from "@/lib/courses/kit";

/**
 * "AI-Driven Content and Brand Communication": course 2 of the AI Augmented Digital
 * Marketing program. 38 topics, 15 done: Module 1 complete, 3 of 10 in Module 2.
 */
export const outline: Course = {
  id: "acb",
  slug: "ai-driven-content-and-brand-communication",
  title: "AI-Driven Content and Brand Communication",
  provider: "SkillUp",
  courseType: "Course",
  difficulty: "Beginner",
  deliveryMode: "Flexible Learning",
  overallProgressPct: 40,
  modulesCompleted: 1,
  modulesTotal: 4,
  modules: [
    {
      id: "acb-m1",
      label: "MODULE 01",
      title: "Brand Strategy & Voice Systems",
      topicsCompleted: 12,
      topicsTotal: 12,
      isCompleted: true,
      lessons: [
        {
          id: "acb-m1-l1",
          label: "Brand strategy and voice",
          topics: [
            { id: "acb-m1-t1", type: "Video", title: "Course Introduction", duration: "6 min", completed: true },
            { id: "acb-m1-t2", type: "Reading", title: "What a brand strategy decides", duration: "approx. 12 min read", completed: true },
            { id: "acb-m1-t3", type: "Video", title: "Positioning, promise and proof", duration: "14 min", completed: true },
            { id: "acb-m1-t4", type: "Reading", title: "Defining a brand voice: traits, tone and vocabulary", duration: "approx. 15 min read", completed: true },
            { id: "acb-m1-t5", type: "Video", title: "Turning a voice into a system: the voice chart", duration: "16 min", completed: true },
            { id: "acb-m1-t6", type: "Activity", title: "Describe a voice in three traits", duration: "approx. 20 min", completed: true },
          ],
        },
        {
          id: "acb-m1-l2",
          label: "A voice system for AI tools",
          topics: [
            { id: "acb-m1-t7", type: "Reading", title: "Voice guidelines an AI assistant can follow", duration: "approx. 15 min read", completed: true },
            { id: "acb-m1-t8", type: "Video", title: "Briefing AI tools with brand context", duration: "18 min", completed: true },
            { id: "acb-m1-t9", type: "Practice Assignment", title: "Practice Quiz: Brand voice basics", duration: "approx. 10 min", completed: true },
            { id: "acb-m1-t10", type: "Reading", title: "Responsible use: claims, sources and disclosure", duration: "approx. 12 min read", completed: true },
            { id: "acb-m1-t11", type: "Graded Assignment", title: "Assignment 01 · Brand voice guide", duration: "approx. 45 min", completed: true },
            { id: "acb-m1-t12", type: "Quiz", title: "Graded Quiz: Brand strategy and voice", duration: "approx. 10 min", completed: true },
          ],
        },
      ],
    },
    {
      id: "acb-m2",
      label: "MODULE 02",
      title: "AI-Assisted Content Development",
      topicsCompleted: 3,
      topicsTotal: 10,
      isCompleted: false,
      lessons: [
        {
          id: "acb-m2-l1",
          label: "Prompting for brand copy",
          topics: [
            {
              id: "acb-m2-t1",
              type: "Video",
              title: "From brand voice to content brief",
              duration: "12 min",
              completed: true,
              transcript: [
                { id: "acb-m2-t1-ln1", ts: "0:00", text: "Welcome to Module 2. In Module 1 you wrote a voice guide. In this module you put it to work with an AI writing assistant." },
                { id: "acb-m2-t1-ln2", ts: "0:16", text: "An assistant knows nothing about your brand unless you tell it. The content brief is how you tell it, every time, in the same order." },
                { id: "acb-m2-t1-ln3", ts: "0:34", text: "A brief has five parts: who the reader is, what you want them to do, the one message, the voice traits, and the format and length." },
                { id: "acb-m2-t1-ln4", ts: "0:55", text: "Notice what is not in the brief: the copy itself. You describe the job, the assistant drafts, and you edit." },
                { id: "acb-m2-t1-ln5", ts: "1:12", text: "Let's fill one in for a product update email. The reader is an existing customer who has not opened the app in a month." },
                { id: "acb-m2-t1-ln6", ts: "1:33", text: "The action is one thing only: open the app and try the new feature. If you ask for three things, the draft will try to sell all three." },
                { id: "acb-m2-t1-ln7", ts: "1:52", text: "Keep the brief as a template. In the next reading you turn each of its parts into a line of a prompt." },
              ],
            },
            { id: "acb-m2-t2", type: "Reading", title: "Anatomy of an effective prompt", duration: "approx. 10 min read", completed: true },
            { id: "acb-m2-t3", type: "Video", title: "Drafting long-form content with an AI assistant", duration: "14 min", completed: true },
            { id: "acb-m2-t4", type: "Reading", title: "Creating impactful ad copy with effective prompts", duration: "approx. 15 min read", completed: false, active: true },
            { id: "acb-m2-t5", type: "Practice Assignment", title: "Practice Quiz: Prompting for copy", duration: "approx. 10 min", completed: false },
          ],
        },
        {
          id: "acb-m2-l2",
          label: "Audiences, editing and planning",
          topics: [
            { id: "acb-m2-t6", type: "Video", title: "Segmenting an audience for tailored messaging", duration: "16 min", completed: false },
            { id: "acb-m2-t7", type: "Activity", title: "Rewrite one message for three segments", duration: "approx. 30 min", completed: false },
            { id: "acb-m2-t8", type: "Reading", title: "Editing AI drafts: accuracy, tone and disclosure", duration: "approx. 25 min read", completed: false },
            { id: "acb-m2-t9", type: "Video", title: "Planning a week of content with an AI assistant", duration: "25 min", completed: false },
            { id: "acb-m2-t10", type: "Graded Assignment", title: "Assignment 02 · Audience segmentation", duration: "approx. 45 min", completed: false },
          ],
        },
      ],
    },
    {
      id: "acb-m3",
      label: "MODULE 03",
      title: "AI for Visual Content",
      topicsCompleted: 0,
      topicsTotal: 10,
      isCompleted: false,
      lessons: [
        {
          id: "acb-m3-l1",
          label: "Generating images on brand",
          topics: [
            { id: "acb-m3-t1", type: "Video", title: "What image models can and cannot do", duration: "15 min", completed: false },
            { id: "acb-m3-t2", type: "Reading", title: "Writing prompts for images: subject, style, composition", duration: "approx. 18 min read", completed: false },
            { id: "acb-m3-t3", type: "Video", title: "Keeping visuals on brand: palettes, references and style guides", duration: "18 min", completed: false },
            { id: "acb-m3-t4", type: "Activity", title: "Check four generated images against a brand guide", duration: "approx. 25 min", completed: false },
            { id: "acb-m3-t5", type: "Reading", title: "Rights, likeness and disclosure in generated imagery", duration: "approx. 15 min read", completed: false },
          ],
        },
        {
          id: "acb-m3-l2",
          label: "Motion, accessibility and campaigns",
          topics: [
            { id: "acb-m3-t6", type: "Video", title: "From static to motion: short video and animation tools", duration: "20 min", completed: false },
            { id: "acb-m3-t7", type: "Reading", title: "Alt text and accessible visual content", duration: "approx. 12 min read", completed: false },
            { id: "acb-m3-t8", type: "Practice Assignment", title: "Practice Quiz: Visual prompts", duration: "approx. 10 min", completed: false },
            { id: "acb-m3-t9", type: "Video", title: "Building a campaign visual set end to end", duration: "36 min", completed: false },
            { id: "acb-m3-t10", type: "Quiz", title: "Graded Quiz: AI for visual content", duration: "approx. 15 min", completed: false },
          ],
        },
      ],
    },
    {
      id: "acb-m4",
      label: "MODULE 04",
      title: "Final Project, Assessment, and Wrap-Up",
      topicsCompleted: 0,
      topicsTotal: 6,
      isCompleted: false,
      lessons: [
        {
          id: "acb-m4-l1",
          label: "Final project",
          topics: [
            { id: "acb-m4-t1", type: "Reading", title: "Final project brief: a brand content kit", duration: "approx. 15 min read", completed: false, locked: true },
            { id: "acb-m4-t2", type: "Video", title: "Planning your content kit", duration: "14 min", completed: false, locked: true },
            { id: "acb-m4-t3", type: "Project", title: "Final Project: Brand content kit", duration: "approx. 2 h", completed: false, locked: true },
            { id: "acb-m4-t4", type: "Peer Review", title: "Review two content kits", duration: "approx. 20 min", completed: false, locked: true },
          ],
        },
        {
          id: "acb-m4-l2",
          label: "Assessment and wrap-up",
          topics: [
            { id: "acb-m4-t5", type: "Quiz", title: "Final Assessment", duration: "approx. 20 min", completed: false, locked: true },
            { id: "acb-m4-t6", type: "Video", title: "Course wrap-up and next steps", duration: "5 min", completed: false, locked: true },
          ],
        },
      ],
    },
  ],
};
