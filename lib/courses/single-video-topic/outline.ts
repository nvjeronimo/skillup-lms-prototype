import type { Course } from "@/lib/courses/kit";

/**
 * "Single video topic": one module and one video, so the player can show the non-SCORM
 * single-topic rule (no sidebar, progress ring and footer stay). The picture is the same
 * file every other Video topic plays (lib/playback/sampleVideo, the Course Introduction of
 * Digital Marketing Fundamentals, topic dmf-m1-t1). No package, no new asset.
 */
export const outline: Course = {
  id: "svt",
  slug: "single-video-topic",
  title: "Single video topic",
  provider: "SkillUp",
  courseType: "Course",
  difficulty: "Beginner",
  deliveryMode: "Flexible Learning",
  overallProgressPct: 0,
  modulesCompleted: 0,
  modulesTotal: 1,
  modules: [
    {
      id: "svt-m1",
      label: "MODULE 01",
      title: "The video",
      topicsCompleted: 0,
      topicsTotal: 1,
      isCompleted: false,
      lessons: [
        {
          id: "svt-m1-l1",
          label: "Watch",
          topics: [
            {
              id: "svt-m1-t1",
              type: "Video",
              title: "Course Introduction",
              duration: "6 min",
              completed: false,
              active: true,
              transcript: [
                { id: "svt-m1-t1-ln1", ts: "0:00", text: "Welcome to the first course of the program. Over four modules you will learn how digital marketing works and where AI fits into it." },
                { id: "svt-m1-t1-ln2", ts: "0:17", text: "We start with the landscape: the channels a brand can use, and the journey a customer takes from first hearing of you to recommending you." },
                { id: "svt-m1-t1-ln3", ts: "0:36", text: "Module 2 is about numbers. You will turn a business goal into objectives, read a funnel and work out what a customer costs to win." },
                { id: "svt-m1-t1-ln4", ts: "0:55", text: "Module 3 introduces the AI mindset. An AI assistant drafts, sorts and summarizes quickly. It does not know your customer, and it does not check its own facts." },
                { id: "svt-m1-t1-ln5", ts: "1:16", text: "So the rule for this whole program is simple: you set the task, the assistant does a first pass, and you review before anything is published." },
                { id: "svt-m1-t1-ln6", ts: "1:34", text: "Each module has short videos, readings, one activity and a practice quiz. Two assignments, two graded quizzes, a final project and a final assessment make up your grade." },
                { id: "svt-m1-t1-ln7", ts: "1:55", text: "You need 70% to pass. The first reading is next: what digital marketing is, and what it is not." },
              ],
            },
          ],
        },
      ],
    },
  ],
};
