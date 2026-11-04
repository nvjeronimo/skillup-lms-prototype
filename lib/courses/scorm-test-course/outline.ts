import type { Course } from "@/lib/courses/kit";

/**
 * "SCORM Test Course": a course made only to test real SCORM 1.2 packages in the player
 * (meeting of 4 Nov 2026; packages from the content team, GenAI for Finance). One module per
 * package, named after where the package sits in its own course (M4.L2.A1 and so on), plus a
 * reading that says what each package does. Not started, nothing locked, so any topic opens.
 * Course 2 of the SCORM and YouTube Test Program (4 Nov 2026), which My Learning lists.
 */
export const outline: Course = {
  id: "sct",
  slug: "scorm-test-course",
  title: "SCORM Test Course",
  provider: "SkillUp",
  courseType: "Course",
  difficulty: "Beginner",
  deliveryMode: "Flexible Learning",
  overallProgressPct: 0,
  modulesCompleted: 0,
  modulesTotal: 5,
  modules: [
    {
      id: "sct-m1",
      label: "MODULE 01",
      title: "About this test course",
      topicsCompleted: 0,
      topicsTotal: 1,
      isCompleted: false,
      lessons: [
        {
          id: "sct-m1-l1",
          label: "Read first",
          topics: [
            { id: "sct-m1-t1", type: "Reading", title: "What each package does, and what to check", duration: "4 min read approx.", completed: false },
          ],
        },
      ],
    },
    {
      id: "sct-m2",
      label: "MODULE 02",
      title: "M4 · From Export to Board Narrative",
      topicsCompleted: 0,
      topicsTotal: 1,
      isCompleted: false,
      lessons: [
        {
          id: "sct-m2-l1",
          label: "M4.L2.A1",
          topics: [
            { id: "sct-m2-t1", type: "Activity", title: "Activity: From Export to Board Narrative", duration: "15 min approx.", completed: false },
          ],
        },
      ],
    },
    {
      id: "sct-m3",
      label: "MODULE 03",
      title: "M5 · Reading the Signal",
      topicsCompleted: 0,
      topicsTotal: 1,
      isCompleted: false,
      lessons: [
        {
          id: "sct-m3-l1",
          label: "M5.L4.A1",
          topics: [
            { id: "sct-m3-t1", type: "Activity", title: "Activity: Reading the Signal", duration: "15 min approx.", completed: false },
          ],
        },
      ],
    },
    {
      id: "sct-m4",
      label: "MODULE 04",
      title: "M10 · Clear the Prompt Queue",
      topicsCompleted: 0,
      topicsTotal: 1,
      isCompleted: false,
      lessons: [
        {
          id: "sct-m4-l1",
          label: "M10.L2.A3",
          topics: [
            { id: "sct-m4-t1", type: "Activity", title: "Activity: Clear the Prompt Queue", duration: "20 min approx.", completed: false },
          ],
        },
      ],
    },
    {
      id: "sct-m5",
      label: "MODULE 05",
      title: "M12 · Clearing the Deck",
      topicsCompleted: 0,
      topicsTotal: 1,
      isCompleted: false,
      lessons: [
        {
          id: "sct-m5-l1",
          label: "M12.L5.A2",
          topics: [
            { id: "sct-m5-t1", type: "Activity", title: "Activity: Clearing the Deck", duration: "15 min approx.", completed: false },
          ],
        },
      ],
    },
  ],
};
