import type { Course } from "@/lib/courses/kit";

/**
 * "Leadership in Remote Teams": a stand-alone course on My Learning and on the Dashboard's
 * resume list, in progress. 25 topics, 13 done: Modules 1 and 2 complete; the learner is on
 * the first topic of Module 3.
 */
export const outline: Course = {
  id: "lrt",
  slug: "leadership-in-remote-teams",
  title: "Leadership in Remote Teams",
  provider: "SkillUp",
  courseType: "Course",
  difficulty: "Intermediate",
  deliveryMode: "Flexible Learning",
  overallProgressPct: 52,
  modulesCompleted: 2,
  modulesTotal: 4,
  modules: [
    {
      id: "lrt-m1",
      label: "MODULE 01",
      title: "Trust and Expectations at a Distance",
      topicsCompleted: 6,
      topicsTotal: 6,
      isCompleted: true,
      lessons: [
        {
          id: "lrt-m1-l1",
          label: "What changes when the team is remote",
          topics: [
            { id: "lrt-m1-t1", type: "Video", title: "Course Introduction", duration: "4 min", completed: true },
            { id: "lrt-m1-t2", type: "Reading", title: "What a remote team loses, and what it gains", duration: "approx. 10 min read", completed: true },
            { id: "lrt-m1-t3", type: "Video", title: "Trust without the corridor: reliability, openness and care", duration: "12 min", completed: true },
          ],
        },
        {
          id: "lrt-m1-l2",
          label: "Agreeing how you work",
          topics: [
            { id: "lrt-m1-t4", type: "Reading", title: "Writing a team working agreement", duration: "approx. 12 min read", completed: true },
            { id: "lrt-m1-t5", type: "Activity", title: "Draft the working agreement for a team of six", duration: "approx. 20 min", completed: true },
            { id: "lrt-m1-t6", type: "Quiz", title: "Graded Quiz: Trust and expectations", duration: "approx. 10 min", completed: true },
          ],
        },
      ],
    },
    {
      id: "lrt-m2",
      label: "MODULE 02",
      title: "Communication Norms",
      topicsCompleted: 7,
      topicsTotal: 7,
      isCompleted: true,
      lessons: [
        {
          id: "lrt-m2-l1",
          label: "Choosing the channel",
          topics: [
            { id: "lrt-m2-t1", type: "Video", title: "Sync or async: choosing the channel for the message", duration: "12 min", completed: true },
            { id: "lrt-m2-t2", type: "Reading", title: "Writing messages that do not need a meeting", duration: "approx. 12 min read", completed: true },
            { id: "lrt-m2-t3", type: "Video", title: "Time zones, overlap hours and response times", duration: "10 min", completed: true },
            { id: "lrt-m2-t4", type: "Practice Assignment", title: "Practice Quiz: Channels and response times", duration: "approx. 8 min", completed: true },
          ],
        },
        {
          id: "lrt-m2-l2",
          label: "Making work visible",
          topics: [
            { id: "lrt-m2-t5", type: "Reading", title: "Documentation as the team's memory", duration: "approx. 10 min read", completed: true },
            { id: "lrt-m2-t6", type: "Video", title: "Decisions in writing: the decision log", duration: "11 min", completed: true },
            { id: "lrt-m2-t7", type: "Graded Assignment", title: "Assignment 01 · Team communication charter", duration: "approx. 40 min", completed: true },
          ],
        },
      ],
    },
    {
      id: "lrt-m3",
      label: "MODULE 03",
      title: "Meetings, Rituals and Async Work",
      topicsCompleted: 0,
      topicsTotal: 6,
      isCompleted: false,
      lessons: [
        {
          id: "lrt-m3-l1",
          label: "Rituals across time zones",
          topics: [
            {
              id: "lrt-m3-t1",
              type: "Video",
              title: "Async standups",
              duration: "10 min",
              completed: false,
              active: true,
              transcript: [
                { id: "lrt-m3-t1-ln1", ts: "0:00", text: "A standup exists so that people can coordinate. It was never meant to be a report to the manager, and moving it online does not change that." },
                { id: "lrt-m3-t1-ln2", ts: "0:14", text: "In a team spread over time zones, the daily call costs someone their early morning or their evening. An async standup keeps the purpose and drops the call." },
                { id: "lrt-m3-t1-ln3", ts: "0:31", text: "Each person posts once a day, in one thread, before a set hour in their own time zone. Three lines: what I finished, what I am doing next, what is in my way." },
                { id: "lrt-m3-t1-ln4", ts: "0:50", text: "The third line is the one that matters. Ask for it by name, and ask who can help. A blocker with no person attached stays a blocker." },
                { id: "lrt-m3-t1-ln5", ts: "1:08", text: "Your job as the lead is to read every post and to answer blockers within the working day. If nobody replies, people stop writing anything real." },
                { id: "lrt-m3-t1-ln6", ts: "1:25", text: "Watch for two signs that it is not working: posts that only list tasks, and blockers that appear for the first time in a one-to-one. Both mean the thread does not feel safe or useful." },
                { id: "lrt-m3-t1-ln7", ts: "1:44", text: "Keep one live call a week for what text does badly: disagreement, planning and seeing each other. The next reading helps you decide which other meetings to keep." },
              ],
            },
            { id: "lrt-m3-t2", type: "Reading", title: "Which meetings to keep, shorten or replace", duration: "approx. 12 min read", completed: false },
            { id: "lrt-m3-t3", type: "Activity", title: "Redesign a weekly calendar for a team in three time zones", duration: "approx. 20 min", completed: false },
          ],
        },
        {
          id: "lrt-m3-l2",
          label: "One-to-ones and belonging",
          topics: [
            { id: "lrt-m3-t4", type: "Video", title: "One-to-ones that are not status updates", duration: "12 min", completed: false },
            { id: "lrt-m3-t5", type: "Reading", title: "Belonging and informal contact at a distance", duration: "approx. 10 min read", completed: false },
            { id: "lrt-m3-t6", type: "Quiz", title: "Graded Quiz: Meetings and rituals", duration: "approx. 10 min", completed: false },
          ],
        },
      ],
    },
    {
      id: "lrt-m4",
      label: "MODULE 04",
      title: "Performance, Feedback and Wellbeing",
      topicsCompleted: 0,
      topicsTotal: 6,
      isCompleted: false,
      lessons: [
        {
          id: "lrt-m4-l1",
          label: "Managing by outcomes",
          topics: [
            { id: "lrt-m4-t1", type: "Video", title: "Outcomes over hours: setting goals you can see", duration: "12 min", completed: false, locked: true },
            { id: "lrt-m4-t2", type: "Reading", title: "Giving feedback in writing and on a call", duration: "approx. 12 min read", completed: false, locked: true },
            { id: "lrt-m4-t3", type: "Video", title: "Spotting overload and isolation early", duration: "11 min", completed: false, locked: true },
          ],
        },
        {
          id: "lrt-m4-l2",
          label: "Final project",
          topics: [
            { id: "lrt-m4-t4", type: "Project", title: "Final Project: 30-day plan for a remote team", duration: "approx. 1 h", completed: false, locked: true },
            { id: "lrt-m4-t5", type: "Peer Review", title: "Review two 30-day plans", duration: "approx. 15 min", completed: false, locked: true },
            { id: "lrt-m4-t6", type: "Video", title: "Course wrap-up and next steps", duration: "5 min", completed: false, locked: true },
          ],
        },
      ],
    },
  ],
};
