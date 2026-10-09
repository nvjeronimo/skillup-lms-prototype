import raw from "./data-model.json";
import type {
  Course,
  DataModel,
  DownloadFile,
  FlatTopic,
  Module,
  Note,
  NotificationModel,
  Partner,
  SavedNoteModel,
  SavedTopicModel,
  Topic,
  User,
} from "./types";

const model = raw as unknown as DataModel;

export const course: Course = model.course;
export const notesSeed: Note[] = model.notes;
export const downloads: DownloadFile[] = model.downloads;
export const user: User = model.user;

/* ----------------------------------------------------------------------------
 * Demo courses for the Sidebar content-shape preview (Showcases & Diagrams).
 * `course` above is the 5-level shape (Course → Module → Lesson → Topics).
 * ---------------------------------------------------------------------------- */

/** 4-level: Course → Module → Topics (no Lesson layer). */
export const fourLevelCourse: Course = {
  id: "cap",
  slug: "capstone",
  title: "Capstone Project Workshop",
  provider: "SkillUp",
  // Co-delivered course: the Course Header shows every partner, in order.
  partners: [{ name: "SkillUp" }, { name: "Microsoft" }],
  courseType: "Course",
  difficulty: "Intermediate",
  deliveryMode: "Flexible Learning",
  overallProgressPct: 67,
  modulesCompleted: 2,
  modulesTotal: 3,
  modules: [
    {
      id: "cap-m1",
      label: "Module 01",
      title: "Scoping your project",
      topicsCompleted: 2,
      topicsTotal: 2,
      isCompleted: true,
      topics: [
        { id: "cap-t1", type: "Video", title: "Framing the brief", duration: "3m 20s", completed: true },
        { id: "cap-t2", type: "Reading", title: "Choosing a measurable goal", duration: "8 min", completed: true },
      ],
    },
    {
      id: "cap-m2",
      label: "Module 02",
      title: "Building the deliverable",
      topicsCompleted: 2,
      topicsTotal: 2,
      isCompleted: true,
      topics: [
        { id: "cap-t3", type: "Video", title: "From outline to draft", duration: "3m 20s", completed: true },
        { id: "cap-t4", type: "Activity", title: "Draft your one-pager", duration: "10 min", completed: true },
      ],
    },
    {
      id: "cap-m3",
      label: "Module 03",
      title: "Peer review assignment",
      topicsCompleted: 0,
      topicsTotal: 3,
      isCompleted: false,
      topics: [
        { id: "cap-t5", type: "Video", title: "Submit your work", duration: "3m 20s", completed: false, active: true },
        { id: "cap-t6", type: "Peer Review", title: "Review 2 peer submissions", duration: "3m 20s", completed: false },
        { id: "cap-t7", type: "Graded Assignment", title: "Reflection essay (300 words)", duration: "3m 20s", completed: false, locked: true },
      ],
    },
  ],
};

/** 3-level: Course → Topics (no Module, no Lesson — implicit module). */
export const threeLevelCourse: Course = {
  id: "qs",
  slug: "quick-start",
  title: "Quick-start onboarding",
  provider: "SkillUp",
  courseType: "Course",
  difficulty: "Beginner",
  deliveryMode: "Flexible Learning",
  overallProgressPct: 25,
  modulesCompleted: 0,
  modulesTotal: 1,
  modules: [
    {
      id: "qs-m",
      label: "",
      title: "",
      implicit: true,
      topicsCompleted: 1,
      topicsTotal: 4,
      isCompleted: false,
      topics: [
        { id: "qs-t1", type: "Video", title: "Introduction to the DMAIC methodology", duration: "3m 20s", completed: true },
        { id: "qs-t2", type: "Quiz", title: "Practice Quiz: Define and Measure", duration: "3m 20s", completed: false, active: true },
        { id: "qs-t3", type: "Reading", title: "Reading: Hierarchy in mockups", duration: "3m 20s", completed: false },
        { id: "qs-t4", type: "Video", title: "Capstone reflection", duration: "3m 20s", completed: false, locked: true },
      ],
    },
  ],
};

/* ----------------------------------------------------------------------------
 * Platform courses with an outline of their own (asked by Nelson on 9 Oct 2026).
 * Every other course of the catalogue still plays `course` above under its own
 * title (lib/platform/catalog). The course's page prints its syllabus from this
 * outline (lib/platform/course-detail), so the two cannot disagree; the topic
 * flagged `active` is where its Resume button lands (`resumeTopicId`). Ids are prefixed so they stay unique
 * across courses: `getCourseForTopic` finds a course by topic id alone.
 * ---------------------------------------------------------------------------- */

/**
 * "AI-Driven Content and Brand Communication": course 2 of the AI Augmented Digital
 * Marketing program. 38 topics, 15 done: Module 1 complete, 3 of 10 in Module 2.
 */
export const aiContentCourse: Course = {
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

/**
 * "UX Research and Design Thinking": a stand-alone course on My Learning, just started.
 * 40 topics, 2 done; the learner is on the third topic of Module 1.
 */
export const uxResearchCourse: Course = {
  id: "uxr",
  slug: "ux-research-and-design-thinking",
  title: "UX Research and Design Thinking",
  provider: "SkillUp",
  courseType: "Course",
  difficulty: "Beginner",
  deliveryMode: "Flexible Learning",
  overallProgressPct: 5,
  modulesCompleted: 0,
  modulesTotal: 4,
  modules: [
    {
      id: "uxr-m1",
      label: "MODULE 01",
      title: "Empathize: Understanding Users",
      topicsCompleted: 2,
      topicsTotal: 10,
      isCompleted: false,
      lessons: [
        {
          id: "uxr-m1-l1",
          label: "Talking to users",
          topics: [
            { id: "uxr-m1-t1", type: "Video", title: "Course Introduction", duration: "6 min", completed: true },
            { id: "uxr-m1-t2", type: "Reading", title: "What UX research is, and what it is not", duration: "approx. 12 min read", completed: true },
            {
              id: "uxr-m1-t3",
              type: "Video",
              title: "Discovery interview techniques",
              duration: "14 min",
              completed: false,
              active: true,
              transcript: [
                { id: "uxr-m1-t3-ln1", ts: "0:00", text: "A discovery interview is a conversation about what someone already does, not a pitch for what you plan to build." },
                { id: "uxr-m1-t3-ln2", ts: "0:17", text: "Start with a warm-up. Ask about their role and a normal day, so the person is talking about familiar ground before you get specific." },
                { id: "uxr-m1-t3-ln3", ts: "0:36", text: "Then ask for a story: “Tell me about the last time you did this.” A specific occasion gives you steps, tools and feelings. A general question gives you opinions." },
                { id: "uxr-m1-t3-ln4", ts: "0:58", text: "Avoid leading questions. “Would you like a faster way to do this?” already holds the answer. Ask how it went, and what they did next." },
                { id: "uxr-m1-t3-ln5", ts: "1:18", text: "Follow up with “why?”, or with “tell me more about that”. When the person goes quiet, wait. People often fill a silence with the detail you needed." },
                { id: "uxr-m1-t3-ln6", ts: "1:39", text: "Do not ask people to design the solution or to predict what they would use. Past behaviour is evidence; a prediction is a guess." },
                { id: "uxr-m1-t3-ln7", ts: "1:58", text: "Close by asking what you should have asked. Then write up your notes the same day, while you still remember the tone as well as the words." },
              ],
            },
            { id: "uxr-m1-t4", type: "Reading", title: "Writing an interview guide", duration: "approx. 15 min read", completed: false },
            { id: "uxr-m1-t5", type: "Practice Assignment", title: "Practice Quiz: Interview questions", duration: "approx. 8 min", completed: false },
          ],
        },
        {
          id: "uxr-m1-l2",
          label: "From conversations to evidence",
          topics: [
            { id: "uxr-m1-t6", type: "Video", title: "Observing users in context", duration: "12 min", completed: false },
            { id: "uxr-m1-t7", type: "Activity", title: "Sort interview notes into themes", duration: "approx. 20 min", completed: false },
            { id: "uxr-m1-t8", type: "Reading", title: "Personas that come from evidence", duration: "approx. 13 min read", completed: false },
            { id: "uxr-m1-t9", type: "Quiz", title: "Graded Quiz: Research foundations", duration: "approx. 10 min", completed: false },
            { id: "uxr-m1-t10", type: "Peer-graded", title: "Persona research draft", duration: "approx. 45 min", completed: false },
          ],
        },
      ],
    },
    {
      id: "uxr-m2",
      label: "MODULE 02",
      title: "Define: From Research to Problem Statements",
      topicsCompleted: 0,
      topicsTotal: 10,
      isCompleted: false,
      lessons: [
        {
          id: "uxr-m2-l1",
          label: "Synthesis",
          topics: [
            { id: "uxr-m2-t1", type: "Video", title: "From findings to insights", duration: "14 min", completed: false },
            { id: "uxr-m2-t2", type: "Reading", title: "Affinity mapping step by step", duration: "approx. 15 min read", completed: false },
            { id: "uxr-m2-t3", type: "Video", title: "Building a persona from research data", duration: "16 min", completed: false },
            { id: "uxr-m2-t4", type: "Reading", title: "Journey maps: stages, actions and pain points", duration: "approx. 15 min read", completed: false },
            { id: "uxr-m2-t5", type: "Activity", title: "Map one journey from the case study", duration: "approx. 25 min", completed: false },
          ],
        },
        {
          id: "uxr-m2-l2",
          label: "Framing the problem",
          topics: [
            { id: "uxr-m2-t6", type: "Video", title: "Writing a problem statement", duration: "12 min", completed: false },
            { id: "uxr-m2-t7", type: "Reading", title: "How Might We questions", duration: "approx. 10 min read", completed: false },
            { id: "uxr-m2-t8", type: "Practice Assignment", title: "Practice Quiz: Define", duration: "approx. 8 min", completed: false },
            { id: "uxr-m2-t9", type: "Video", title: "Prioritising problems with your team", duration: "20 min", completed: false },
            { id: "uxr-m2-t10", type: "Quiz", title: "Graded Quiz: Synthesis and problem framing", duration: "approx. 15 min", completed: false },
          ],
        },
      ],
    },
    {
      id: "uxr-m3",
      label: "MODULE 03",
      title: "Ideate and Prototype",
      topicsCompleted: 0,
      topicsTotal: 11,
      isCompleted: false,
      lessons: [
        {
          id: "uxr-m3-l1",
          label: "Generating ideas",
          topics: [
            { id: "uxr-m3-t1", type: "Video", title: "Divergent and convergent thinking", duration: "12 min", completed: false },
            { id: "uxr-m3-t2", type: "Reading", title: "Ideation methods: Crazy 8s, brainwriting and SCAMPER", duration: "approx. 15 min read", completed: false },
            { id: "uxr-m3-t3", type: "Activity", title: "Run a Crazy 8s round", duration: "approx. 20 min", completed: false },
            { id: "uxr-m3-t4", type: "Video", title: "Choosing ideas: impact and effort", duration: "10 min", completed: false },
            { id: "uxr-m3-t5", type: "Reading", title: "Storyboards and user flows", duration: "approx. 12 min read", completed: false },
          ],
        },
        {
          id: "uxr-m3-l2",
          label: "Prototyping",
          topics: [
            { id: "uxr-m3-t6", type: "Video", title: "Low-fidelity prototyping on paper", duration: "14 min", completed: false },
            { id: "uxr-m3-t7", type: "Video", title: "Clickable prototypes: how much fidelity you need", duration: "16 min", completed: false },
            { id: "uxr-m3-t8", type: "Reading", title: "Prototype to learn, not to impress", duration: "approx. 10 min read", completed: false },
            { id: "uxr-m3-t9", type: "Practice Assignment", title: "Practice Quiz: Ideation and prototyping", duration: "approx. 8 min", completed: false },
            { id: "uxr-m3-t10", type: "Peer-graded", title: "Prototype critique", duration: "approx. 35 min", completed: false },
            { id: "uxr-m3-t11", type: "Quiz", title: "Graded Quiz: Ideate and prototype", duration: "approx. 13 min", completed: false },
          ],
        },
      ],
    },
    {
      id: "uxr-m4",
      label: "MODULE 04",
      title: "Test, Iterate, and Final Project",
      topicsCompleted: 0,
      topicsTotal: 9,
      isCompleted: false,
      lessons: [
        {
          id: "uxr-m4-l1",
          label: "Usability testing",
          topics: [
            { id: "uxr-m4-t1", type: "Video", title: "Planning a usability test", duration: "12 min", completed: false, locked: true },
            { id: "uxr-m4-t2", type: "Reading", title: "Writing tasks and a test script", duration: "approx. 10 min read", completed: false, locked: true },
            { id: "uxr-m4-t3", type: "Video", title: "Moderating a session without leading", duration: "12 min", completed: false, locked: true },
            { id: "uxr-m4-t4", type: "Reading", title: "Reading the results: severity and frequency", duration: "approx. 8 min read", completed: false, locked: true },
            { id: "uxr-m4-t5", type: "Activity", title: "Rate five findings by severity", duration: "approx. 10 min", completed: false, locked: true },
          ],
        },
        {
          id: "uxr-m4-l2",
          label: "Final project",
          topics: [
            { id: "uxr-m4-t6", type: "Reading", title: "Final project brief: a research-backed redesign", duration: "approx. 8 min read", completed: false, locked: true },
            { id: "uxr-m4-t7", type: "Project", title: "Final Project: Research-backed redesign", duration: "approx. 50 min", completed: false, locked: true },
            { id: "uxr-m4-t8", type: "Peer Review", title: "Review two final projects", duration: "approx. 15 min", completed: false, locked: true },
            { id: "uxr-m4-t9", type: "Video", title: "Course wrap-up and next steps", duration: "5 min", completed: false, locked: true },
          ],
        },
      ],
    },
  ],
};

/** A module's topics whether stored flat or grouped under lessons. */
/** Partners for the Course Header: the explicit list, else the provider alone. */
export function coursePartners(c: Course): Partner[] {
  return c.partners ?? [{ name: c.provider }];
}

export function moduleTopics(mod: Module): Topic[] {
  if (mod.topics) return mod.topics;
  if (mod.lessons) return mod.lessons.flatMap((l) => l.topics);
  return [];
}

/** Flatten every topic in course order, with module/lesson context + index. */
export function flatTopics(c: Course = course): FlatTopic[] {
  const out: FlatTopic[] = [];
  let index = 0;
  for (const mod of c.modules) {
    if (mod.lessons) {
      for (const lesson of mod.lessons) {
        for (const topic of lesson.topics) {
          out.push({
            ...topic,
            moduleId: mod.id,
            moduleLabel: mod.label,
            moduleTitle: mod.title,
            lessonLabel: lesson.label,
            index: index++,
          });
        }
      }
    } else if (mod.topics) {
      for (const topic of mod.topics) {
        out.push({
          ...topic,
          moduleId: mod.id,
          moduleLabel: mod.label,
          moduleTitle: mod.title,
          index: index++,
        });
      }
    }
  }
  return out;
}

/** Every course the app can render, addressable by slug. */
export const allCourses: Course[] = [course, fourLevelCourse, threeLevelCourse, aiContentCourse, uxResearchCourse];
export const coursesBySlug: Record<string, Course> = Object.fromEntries(
  allCourses.map((c) => [c.slug, c]),
);
export function getCourseBySlug(slug: string): Course {
  return coursesBySlug[slug] ?? course;
}
export function getCourseForTopic(topicId: string): Course {
  return allCourses.find((c) => flatTopics(c).some((t) => t.id === topicId)) ?? course;
}

export function getTopic(topicId: string, c?: Course): FlatTopic | undefined {
  for (const courseToSearch of c ? [c] : allCourses) {
    const found = flatTopics(courseToSearch).find((t) => t.id === topicId);
    if (found) return found;
  }
  return undefined;
}

export function getAdjacentTopics(topicId: string, c?: Course) {
  const all = flatTopics(c ?? getCourseForTopic(topicId));
  const i = all.findIndex((t) => t.id === topicId);
  return {
    current: all[i],
    previous: i > 0 ? all[i - 1] : undefined,
    next: i >= 0 && i < all.length - 1 ? all[i + 1] : undefined,
    total: all.length,
    position: i + 1,
  };
}

export function topicNotes(topicId: string, allNotes: Note[] = notesSeed): Note[] {
  return allNotes.filter((n) => n.topicId === topicId);
}

export function topicDownloads(topicId: string): DownloadFile[] {
  return downloads.filter((d) => d.topicId === topicId);
}

/** Build the "Course · Module · Lesson" path string for a topic. */
export function topicPath(topicId: string, c: Course = course): string {
  const t = getTopic(topicId, c);
  if (!t) return c.title;
  return [c.title, t.moduleTitle, t.lessonLabel].filter(Boolean).join(" · ");
}

/* ---- Default topic the app redirects to (the Active video) ---- */
export const DEFAULT_TOPIC_ID = "m3-t1";
export const DEFAULT_COURSE_SLUG = course.slug;

/**
 * The topic a course's player opens on (`resumeUrl`): the one its outline flags `active`,
 * else its first topic still to do. A slug with no outline of its own plays the sample
 * course, so it opens where the sample does.
 */
export function resumeTopicId(slug: string): string {
  const own = coursesBySlug[slug];
  if (!own) return DEFAULT_TOPIC_ID;
  const topics = flatTopics(own);
  const resume = topics.find((t) => t.active) ?? topics.find((t) => !t.completed && !t.locked) ?? topics[0];
  return resume?.id ?? DEFAULT_TOPIC_ID;
}

/* ---- Certificate (Section 07) ---- */
export const certificate = {
  learnerName: user.name,
  courseTitle: course.title,
  provider: course.provider,
  dateLabel: "June 22, 2026",
  certificateId: "ID-SKL-SIXSIGMA-0622",
  stats: {
    modules: course.modulesTotal,
    topics: flatTopics().length,
    time: "4h 22m",
    avgQuiz: "96%",
  },
};

/** Map a notification type to its hybrid-tab activity category. */
export function notificationCategory(
  type: NotificationModel["type"],
): "discussions" | "grading" | "updates" {
  switch (type) {
    case "discussion-reply":
      return "discussions";
    case "assignment-due":
    case "peer-review-received":
      return "grading";
    default:
      return "updates";
  }
}

/* ---- Mock notifications for the Notifications panel ---- */
export const notifications: NotificationModel[] = [
  {
    id: "n1",
    type: "live-now",
    title: "Live now: Office hours with Sarah",
    body: "Drop in for Q&A on the DMAIC define phase.",
    timestamp: "Just now",
    unread: true,
    href: "/course/six-sigma/topic/m3-t1",
    group: "today",
  },
  {
    id: "n2",
    type: "discussion-reply",
    title: "Carlos M. replied to your discussion",
    body: "“Great point on measurement systems analysis, but what about gauge R&R?”",
    timestamp: "25 min ago",
    unread: true,
    href: "/course/six-sigma/topic/m3-t1",
    group: "today",
  },
  {
    id: "n3",
    type: "assignment-due",
    title: "Practice Quiz: Define and measure is due in 2 days",
    body: "Module 03 · Define and measure",
    timestamp: "2 hours ago",
    unread: true,
    href: "/course/six-sigma/topic/m3-t4",
    group: "today",
  },
  {
    id: "n4",
    type: "course-update",
    title: "Sarah added new content: Prompt review recording",
    body: "A new recording was added to Module 03.",
    timestamp: "Yesterday, 4:10 PM",
    unread: false,
    href: "/course/six-sigma/topic/m3-t2",
    group: "yesterday",
  },
  {
    id: "n5",
    type: "peer-review-received",
    title: "Anonymous peer rated your submission 4/5",
    body: "“Clear analysis, tighten the control plan.”",
    timestamp: "Yesterday, 9:02 AM",
    unread: false,
    href: "/course/six-sigma/topic/m3-t7",
    group: "yesterday",
  },
  {
    id: "n6",
    type: "syllabus-change",
    title: "Module 04 syllabus updated",
    body: "Two readings were re-ordered and one was added.",
    timestamp: "Mon, 11:30 AM",
    unread: false,
    href: "/course/six-sigma/topic/m3-t1",
    group: "this-week",
  },
];

/* ---- Mock saved topics for the Saved panel ---- */
export const savedTopics: SavedTopicModel[] = [
  {
    id: "st1",
    topicId: "m3-t3",
    topicType: "Reading",
    duration: "approx. 8 min read",
    title: "The measure phase",
    path: "Six Sigma · DMAIC for process improvement · Define and measure",
    savedAt: "2 days ago",
  },
  {
    id: "st2",
    topicId: "m1-t2",
    topicType: "Video",
    duration: "5 min",
    title: "History and origins",
    path: "Six Sigma · Introduction to ASQ-Certified Six Sigma Black Belt",
    savedAt: "1 week ago",
  },
  {
    id: "st3",
    topicId: "m3-t7",
    topicType: "Graded Assignment",
    duration: "approx. 20 min",
    title: "The control phase",
    path: "Six Sigma · DMAIC for process improvement · Analyze, improve, and control",
    savedAt: "1 week ago",
  },
];

/** Saved notes are derived from seed notes but carry display metadata. */
export const savedNotes: SavedNoteModel[] = notesSeed.map((n, i) => ({
  id: `sn${i + 1}`,
  noteId: n.id,
  topicId: n.topicId,
  topicTitle: "Introduction to the DMAIC methodology",
  ts: n.ts,
  anchorQuote: n.anchorQuote,
  text: n.text,
  tags: n.tags,
  savedAt: i === 0 ? "3 days ago" : "3 days ago",
}));
