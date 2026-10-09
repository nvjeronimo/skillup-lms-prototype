import type { Course } from "@/lib/courses/kit";

/**
 * "Capstone Project: AI-First Marketing System": course 7, the last of the AI Augmented
 * Digital Marketing program, not started. A project, not a lecture course: 11 topics in
 * 4 modules (a brief, three graded milestones, a final submission and a peer review), none
 * done; Module 4 is locked until Module 3 is complete. It opens on "Course Introduction",
 * as the Program page says.
 */
export const outline: Course = {
  id: "cps",
  slug: "capstone-project-ai-first-marketing-system",
  title: "Capstone Project: AI-First Marketing System",
  provider: "SkillUp",
  courseType: "Course",
  difficulty: "Beginner",
  deliveryMode: "Flexible Learning",
  overallProgressPct: 0,
  modulesCompleted: 0,
  modulesTotal: 4,
  modules: [
    {
      id: "cps-m1",
      label: "MODULE 01",
      title: "Project Brief & Planning",
      topicsCompleted: 0,
      topicsTotal: 3,
      isCompleted: false,
      lessons: [
        {
          id: "cps-m1-l1",
          label: "The brief",
          topics: [
            {
              id: "cps-m1-t1",
              type: "Video",
              title: "Course Introduction",
              duration: "6 min",
              completed: false,
              transcript: [
                { id: "cps-m1-t1-ln1", ts: "0:00", text: "Welcome to the capstone. There are no new lectures to get through here. This course is one project, built in stages, and it is the piece of the program you will show to an employer." },
                { id: "cps-m1-t1-ln2", ts: "0:18", text: "The project is an AI-first marketing system for one business. A system, not a campaign: a strategy, the channels that carry it, the content, the customer lifecycle and the way you will measure it." },
                { id: "cps-m1-t1-ln3", ts: "0:37", text: "AI-first does not mean AI-only. For every part of the system you say where an AI tool does the work, where a person checks it, and what you would never hand over." },
                { id: "cps-m1-t1-ln4", ts: "0:54", text: "You build it in three milestones. Milestone 1 is the strategy and the channel plan. Milestone 2 is the content and campaign assets. Milestone 3 is the measurement plan and your AI workflow log." },
                { id: "cps-m1-t1-ln5", ts: "1:13", text: "Each milestone is graded with a rubric you can read before you start, and each comes back with comments. Use them: the final submission is the three milestones revised and joined into one document." },
                { id: "cps-m1-t1-ln6", ts: "1:32", text: "After you submit, you review the projects of two peers with the same rubric, and two peers review yours. Reading other people's systems is part of the learning." },
                { id: "cps-m1-t1-ln7", ts: "1:48", text: "Most of what you need already exists. The voice guide from course 2, your search work from course 3, your campaign work from course 4, the launch plan and the lifecycle plan from courses 5 and 6. Collect them now." },
                { id: "cps-m1-t1-ln8", ts: "2:07", text: "Start with the brief in the next topic. It says exactly what to hand in, and what a good project looks like." },
              ],
            },
            { id: "cps-m1-t2", type: "Reading", title: "Capstone brief: an AI-first marketing system for one business", duration: "approx. 15 min read", completed: false },
            { id: "cps-m1-t3", type: "Activity", title: "Choose your business and write the one-page plan", duration: "approx. 30 min", completed: false },
          ],
        },
      ],
    },
    {
      id: "cps-m2",
      label: "MODULE 02",
      title: "Build: Strategy, Channels & Content",
      topicsCompleted: 0,
      topicsTotal: 3,
      isCompleted: false,
      lessons: [
        {
          id: "cps-m2-l1",
          label: "Milestones 1 and 2",
          topics: [
            { id: "cps-m2-t1", type: "Reading", title: "How the milestones are graded: the rubric, with examples", duration: "approx. 12 min read", completed: false },
            { id: "cps-m2-t2", type: "Graded Assignment", title: "Milestone 1 · Strategy and channel plan", duration: "approx. 60 min", completed: false },
            { id: "cps-m2-t3", type: "Graded Assignment", title: "Milestone 2 · Content and campaign assets", duration: "approx. 75 min", completed: false },
          ],
        },
      ],
    },
    {
      id: "cps-m3",
      label: "MODULE 03",
      title: "Measure, Document & Check",
      topicsCompleted: 0,
      topicsTotal: 3,
      isCompleted: false,
      lessons: [
        {
          id: "cps-m3-l1",
          label: "Milestone 3",
          topics: [
            { id: "cps-m3-t1", type: "Video", title: "Writing a measurement plan and an AI workflow log", duration: "12 min", completed: false },
            { id: "cps-m3-t2", type: "Graded Assignment", title: "Milestone 3 · Measurement plan and AI workflow log", duration: "approx. 45 min", completed: false },
            { id: "cps-m3-t3", type: "Practice Assignment", title: "Practice Quiz: Is your project ready to submit?", duration: "approx. 10 min", completed: false },
          ],
        },
      ],
    },
    {
      id: "cps-m4",
      label: "MODULE 04",
      title: "Final Submission & Peer Review",
      topicsCompleted: 0,
      topicsTotal: 2,
      isCompleted: false,
      lessons: [
        {
          id: "cps-m4-l1",
          label: "Submit and review",
          topics: [
            { id: "cps-m4-t1", type: "Project", title: "Final Submission: AI-first marketing system", duration: "approx. 75 min", completed: false, locked: true },
            { id: "cps-m4-t2", type: "Peer Review", title: "Review two capstone projects", duration: "approx. 30 min", completed: false, locked: true },
          ],
        },
      ],
    },
  ],
};
