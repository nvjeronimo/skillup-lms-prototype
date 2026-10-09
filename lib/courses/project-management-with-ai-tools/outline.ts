import type { Course } from "@/lib/courses/kit";

/**
 * "Project Management with AI Tools": a stand-alone course on My Learning, in progress.
 * 40 topics, 14 done: Module 1 complete and 6 of 8 in Module 2; the learner is on the
 * sprint planning video, the last one before Assignment 01.
 */
export const outline: Course = {
  id: "pma",
  slug: "project-management-with-ai-tools",
  title: "Project Management with AI Tools",
  provider: "SkillUp",
  courseType: "Course",
  difficulty: "Intermediate",
  deliveryMode: "Flexible Learning",
  overallProgressPct: 35,
  modulesCompleted: 1,
  modulesTotal: 5,
  modules: [
    {
      id: "pma-m1",
      label: "MODULE 01",
      title: "Project Foundations and Where AI Fits",
      topicsCompleted: 8,
      topicsTotal: 8,
      isCompleted: true,
      lessons: [
        {
          id: "pma-m1-l1",
          label: "The shape of a project",
          topics: [
            { id: "pma-m1-t1", type: "Video", title: "Course Introduction", duration: "5 min", completed: true },
            { id: "pma-m1-t2", type: "Reading", title: "Scope, time, cost and quality: the trade-offs a project manager owns", duration: "approx. 12 min read", completed: true },
            { id: "pma-m1-t3", type: "Video", title: "Predictive, agile and hybrid delivery", duration: "14 min", completed: true },
            { id: "pma-m1-t4", type: "Reading", title: "What AI assistants can and cannot do for a project manager", duration: "approx. 15 min read", completed: true },
          ],
        },
        {
          id: "pma-m1-l2",
          label: "Working with an AI assistant",
          topics: [
            { id: "pma-m1-t5", type: "Video", title: "Giving an assistant project context", duration: "16 min", completed: true },
            { id: "pma-m1-t6", type: "Activity", title: "Turn a kickoff email into a one-page charter", duration: "approx. 25 min", completed: true },
            { id: "pma-m1-t7", type: "Practice Assignment", title: "Practice Quiz: Project foundations", duration: "approx. 8 min", completed: true },
            { id: "pma-m1-t8", type: "Quiz", title: "Graded Quiz: Foundations and AI basics", duration: "approx. 10 min", completed: true },
          ],
        },
      ],
    },
    {
      id: "pma-m2",
      label: "MODULE 02",
      title: "Planning and Estimating with AI",
      topicsCompleted: 6,
      topicsTotal: 8,
      isCompleted: false,
      lessons: [
        {
          id: "pma-m2-l1",
          label: "From scope to backlog",
          topics: [
            { id: "pma-m2-t1", type: "Video", title: "Breaking scope into a work breakdown structure", duration: "15 min", completed: true },
            { id: "pma-m2-t2", type: "Reading", title: "Drafting a WBS with an AI assistant, and checking it", duration: "approx. 15 min read", completed: true },
            { id: "pma-m2-t3", type: "Video", title: "Estimating: three-point estimates and reference classes", duration: "16 min", completed: true },
            { id: "pma-m2-t4", type: "Activity", title: "Estimate a backlog of twelve items", duration: "approx. 25 min", completed: true },
          ],
        },
        {
          id: "pma-m2-l2",
          label: "Schedules and sprints",
          topics: [
            { id: "pma-m2-t5", type: "Reading", title: "Dependencies, critical path and buffers", duration: "approx. 18 min read", completed: true },
            { id: "pma-m2-t6", type: "Practice Assignment", title: "Practice Quiz: Planning and estimating", duration: "approx. 10 min", completed: true },
            {
              id: "pma-m2-t7",
              type: "Video",
              title: "AI-assisted sprint planning",
              duration: "18 min",
              completed: false,
              active: true,
              transcript: [
                { id: "pma-m2-t7-ln1", ts: "0:00", text: "Sprint planning answers two questions: what can the team finish in the next two weeks, and how will it get done." },
                { id: "pma-m2-t7-ln2", ts: "0:15", text: "An AI assistant can prepare the meeting. It cannot commit for the team. Keep that line clear and it saves you an hour." },
                { id: "pma-m2-t7-ln3", ts: "0:32", text: "Start with capacity. Give the assistant the working days of each person, minus leave and support duty, and ask for the hours available. Check the sum yourself." },
                { id: "pma-m2-t7-ln4", ts: "0:54", text: "Next, the sprint goal. Paste the top of the backlog and ask for three candidate goals of one sentence each. The product owner picks one, or writes a fourth." },
                { id: "pma-m2-t7-ln5", ts: "1:15", text: "Then ask the assistant to split each selected story into tasks and to list what it assumed. The assumptions are the useful part: they are the questions for the meeting." },
                { id: "pma-m2-t7-ln6", ts: "1:38", text: "Compare the estimate with your last three sprints. If the plan needs more than the team has ever delivered, the plan is wrong, however tidy the list looks." },
                { id: "pma-m2-t7-ln7", ts: "1:58", text: "Finish in the room: the team reads the plan, changes it and commits. In the assignment that follows you prepare a sprint plan this way and mark every line the assistant drafted." },
              ],
            },
            { id: "pma-m2-t8", type: "Graded Assignment", title: "Assignment 01 · Sprint plan with an AI assistant", duration: "approx. 45 min", completed: false },
          ],
        },
      ],
    },
    {
      id: "pma-m3",
      label: "MODULE 03",
      title: "Risks, Stakeholders and Communication",
      topicsCompleted: 0,
      topicsTotal: 8,
      isCompleted: false,
      lessons: [
        {
          id: "pma-m3-l1",
          label: "Risks and stakeholders",
          topics: [
            { id: "pma-m3-t1", type: "Video", title: "Building a risk register that gets used", duration: "14 min", completed: false },
            { id: "pma-m3-t2", type: "Reading", title: "Using an AI assistant to surface risks you have not thought of", duration: "approx. 15 min read", completed: false },
            { id: "pma-m3-t3", type: "Activity", title: "Score ten risks by probability and impact", duration: "approx. 20 min", completed: false },
            { id: "pma-m3-t4", type: "Video", title: "Stakeholder mapping: power, interest and what each one needs", duration: "15 min", completed: false },
          ],
        },
        {
          id: "pma-m3-l2",
          label: "Communication",
          topics: [
            { id: "pma-m3-t5", type: "Reading", title: "Status reports people read", duration: "approx. 12 min read", completed: false },
            { id: "pma-m3-t6", type: "Video", title: "Meeting notes, decisions and actions with an AI assistant", duration: "16 min", completed: false },
            { id: "pma-m3-t7", type: "Practice Assignment", title: "Practice Quiz: Risk and communication", duration: "approx. 10 min", completed: false },
            { id: "pma-m3-t8", type: "Quiz", title: "Graded Quiz: Risks and stakeholders", duration: "approx. 12 min", completed: false },
          ],
        },
      ],
    },
    {
      id: "pma-m4",
      label: "MODULE 04",
      title: "Tracking, Reporting and Responsible Use",
      topicsCompleted: 0,
      topicsTotal: 8,
      isCompleted: false,
      lessons: [
        {
          id: "pma-m4-l1",
          label: "Tracking delivery",
          topics: [
            { id: "pma-m4-t1", type: "Video", title: "Burndown, velocity and earned value in plain terms", duration: "16 min", completed: false },
            { id: "pma-m4-t2", type: "Reading", title: "Forecasting a finish date from real progress", duration: "approx. 15 min read", completed: false },
            { id: "pma-m4-t3", type: "Video", title: "Automating routine updates without losing the facts", duration: "14 min", completed: false },
            { id: "pma-m4-t4", type: "Activity", title: "Find the three errors in an AI-written status report", duration: "approx. 20 min", completed: false },
          ],
        },
        {
          id: "pma-m4-l2",
          label: "Change and responsible use",
          topics: [
            { id: "pma-m4-t5", type: "Reading", title: "Confidential data, client contracts and AI tools", duration: "approx. 14 min read", completed: false },
            { id: "pma-m4-t6", type: "Video", title: "When the plan changes: change requests and replanning", duration: "15 min", completed: false },
            { id: "pma-m4-t7", type: "Graded Assignment", title: "Assignment 02 · Risk register and status report", duration: "approx. 50 min", completed: false },
            { id: "pma-m4-t8", type: "Quiz", title: "Graded Quiz: Tracking and reporting", duration: "approx. 12 min", completed: false },
          ],
        },
      ],
    },
    {
      id: "pma-m5",
      label: "MODULE 05",
      title: "Final Project and Wrap-Up",
      topicsCompleted: 0,
      topicsTotal: 8,
      isCompleted: false,
      lessons: [
        {
          id: "pma-m5-l1",
          label: "Final project",
          topics: [
            { id: "pma-m5-t1", type: "Reading", title: "Final project brief: plan a product launch", duration: "approx. 12 min read", completed: false, locked: true },
            { id: "pma-m5-t2", type: "Video", title: "Planning your project pack", duration: "12 min", completed: false, locked: true },
            { id: "pma-m5-t3", type: "Project", title: "Final Project: Project plan pack", duration: "approx. 1 h 30 min", completed: false, locked: true },
            { id: "pma-m5-t4", type: "Peer Review", title: "Review two project plan packs", duration: "approx. 25 min", completed: false, locked: true },
          ],
        },
        {
          id: "pma-m5-l2",
          label: "Retrospective and wrap-up",
          topics: [
            { id: "pma-m5-t5", type: "Video", title: "Running a retrospective that changes something", duration: "14 min", completed: false, locked: true },
            { id: "pma-m5-t6", type: "Reading", title: "Lessons learned: what to keep for the next project", duration: "approx. 10 min read", completed: false, locked: true },
            { id: "pma-m5-t7", type: "Quiz", title: "Final Assessment", duration: "approx. 15 min", completed: false, locked: true },
            { id: "pma-m5-t8", type: "Video", title: "Course wrap-up and next steps", duration: "5 min", completed: false, locked: true },
          ],
        },
      ],
    },
  ],
};
