import type { Course } from "@/lib/courses/kit";

/**
 * "UX Research and Design Thinking": a stand-alone course on My Learning, just started.
 * 40 topics, 2 done; the learner is on the third topic of Module 1.
 */
export const outline: Course = {
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
