import { GRAY, SIX_SIGMA, modulesFromOutline, playerHref } from "@/lib/courses/kit";
import type { Course, CourseActivity, CourseDetail, CourseEntry } from "@/lib/courses/kit";
import { SAMPLE_TODAY, todayLabel } from "@/lib/sample-time";

/**
 * Four course packages: a whole course delivered as one SCORM package (Activity group D; meeting
 * of 4 Nov 2026). In the ICP such a course is ONE topic named after the course, with no modules or
 * lessons of ours; it opens the whole package with its own menu, and the course is 0% until the
 * package reports completion, then 100%. The player starts with our sidebar collapsed and the
 * footer reads "1 of 1" with no Previous (PlayerShell, `coursePackage`). The outline is the 3-level
 * shape (an implicit module, no lesson), so the rail shows the one topic and nothing above it.
 *
 * The packages are the content team's four SCORM 1.2 activities (GenAI for Finance), the same
 * files the SCORM Test Course plays inside units: here each one stands for a whole course. Their
 * topics have ids of their own, so what a package stores here is apart from the other course.
 * Courses 3 to 6 of the SCORM and YouTube Test Program.
 *
 * One file for the four, not a folder each (lib/courses/README.md): they differ only in the
 * package, so `coursePackage` builds the outline, the page and the content of each.
 */

interface PackageSpec {
  /** Prefix of every id of the course. */
  id: string;
  slug: string;
  title: string;
  /** Effort as the card and the page print it: "15 min". */
  minutes: number;
  cover: string;
  activity: CourseActivity;
}

const PROGRAM = { slug: "scorm-and-youtube-tests", title: "SCORM and YouTube Test Program" };

function coursePackage({ id, slug, title, minutes, cover, activity }: PackageSpec): CourseEntry {
  const topicId = `${id}-m1-t1`;
  const outline: Course = {
    id,
    slug,
    title,
    provider: "SkillUp",
    courseType: "Course",
    difficulty: "Beginner",
    deliveryMode: "Flexible Learning",
    overallProgressPct: 0,
    modulesCompleted: 0,
    modulesTotal: 1,
    modules: [
      // 3-level shape (Content Shape Levels): no Module, no Lesson, the one topic straight under the
      // Course Header, so the collapsed rail shows no M1 / L1 for a course that has neither.
      {
        id: `${id}-m1`,
        label: "",
        title: "",
        implicit: true,
        topicsCompleted: 0,
        topicsTotal: 1,
        isCompleted: false,
        topics: [{ id: topicId, type: "Activity", title, duration: `${minutes} min approx.`, completed: false }],
      },
    ],
  };

  const page: CourseDetail = {
    slug,
    title,
    imageSrc: `/platform/covers/${cover}.jpg`,
    deliveryMode: "Flexible Learning",
    difficulty: "Beginner",
    stats: { structure: "1 SCORM package", duration: `~ ${minutes} min`, org: "SkillUp · SCORM-PACKAGE" },
    progress: {
      percent: 0,
      label: "Course progress",
      eyebrow: "Start the course",
      cta: "Start course",
      href: playerHref(outline),
      notPassing: "Ungraded · completion only",
      done: "Not started",
      timeLeft: `~ ${minutes} min left`,
    },
    program: PROGRAM,
    search: SIX_SIGMA.search,
    update: {
      title: "Course update",
      body: "A test course delivered as one SCORM package. It opens the whole package, with its own menu, and completes when the package reports it.",
    },
    intro: {
      title: "What this course tests",
      lead: "A course that is one SCORM package: one topic named after the course, progress 0% until the package reports completion, then 100%.",
    },
    modules: modulesFromOutline(outline, [{ duration: `${minutes}m`, defaultOpen: true }]),
    mentor: SIX_SIGMA.mentor,
    team: {
      label: "Course team",
      people: [{ name: "Nelson Jerónimo", role: "Design · SkillUp" }],
      cta: "Ask the course team",
    },
    certificate: {
      status: "not-earned",
      courseId: slug,
      courseLabel: title,
      title: "No certificate for a test course",
      requirements: [{ title: "Complete the course package", detail: "Not started · 0%", percent: 0 }],
    },
    handouts: { label: "Handouts", items: [] },
    upcomingDates: { label: "Upcoming dates", items: [], cta: "All dates" },
    tools: SIX_SIGMA.tools,
    progressTab: {
      title: "Your progress",
      completion: { title: "Course completion", complete: 0, incomplete: 1, locked: 0 },
      passAlert: {
        title: "This course is not graded",
        body: "It completes when the package reports that it is complete.",
      },
      grade: {
        title: "Your grade",
        percent: 0,
        passPercent: 0,
        passLabel: "Ungraded",
        columns: SIX_SIGMA.progressTab.grade.columns,
        rows: [],
        sections: [],
      },
      note: SIX_SIGMA.progressTab.note,
    },
    datesTab: {
      title: "Important Dates",
      pastLabel: "Past",
      past: [
        {
          id: "course-opens",
          iso: "2026-11-04T00:00",
          date: "04 Nov 2026",
          time: "12:00 AM · your time",
          state: "complete",
          badges: [{ label: "Course", color: GRAY }],
          title: "Course opens",
          description: "Opened for the SCORM tests of 4 Nov 2026.",
        },
      ],
      todayLabel: todayLabel(),
      todayIso: SAMPLE_TODAY,
      upcomingLabel: "Upcoming",
      upcoming: [],
      timezoneNote: SIX_SIGMA.datesTab.timezoneNote,
    },
    qaTab: SIX_SIGMA.qaTab,
  };

  return {
    outline,
    page,
    content: {
      byline: { author: "Nelson Jerónimo", role: "Design · SCORM course package", updated: "November 2026" },
      quiz: [],
      articles: {},
      quizzes: {},
      assignments: {},
      ora: {},
      activities: { [topicId]: activity },
    },
  };
}

const REPORTS: CourseActivity["steps"] = [
  { title: "Start the course", detail: "The package sets its status to incomplete as soon as it loads." },
  { title: "Reach the last screen", detail: "On its last screen it reports completed: the course goes to 100% by itself." },
];

export const scormCoursePackages: CourseEntry[] = [
  coursePackage({
    id: "pkg1",
    slug: "from-export-to-board-narrative",
    title: "From Export to Board Narrative",
    minutes: 15,
    cover: "business-analytics-with-python",
    activity: {
      kind: "scorm",
      packageUrl: "/scorm/m4-l2-a1-board-narrative/index.html",
      packageLabel: "SCORM 1.2 package",
      packageSizeLabel: "44 KB",
      intro: "Turn a finance export into a narrative for the board. The package reports incomplete when it starts and completed on its last screen.",
      steps: REPORTS,
    },
  }),
  coursePackage({
    id: "pkg2",
    slug: "reading-the-signal",
    title: "Reading the Signal",
    minutes: 15,
    cover: "intro-to-product-analytics",
    activity: {
      kind: "scorm",
      packageUrl: "/scorm/m5-l4-a1-reading-the-signal/index.html",
      packageLabel: "SCORM 1.2 package",
      packageSizeLabel: "44 KB",
      intro: "Read the signal in a set of figures. The package reports incomplete when it starts and completed on its last screen.",
      steps: REPORTS,
    },
  }),
  coursePackage({
    id: "pkg3",
    slug: "clear-the-prompt-queue",
    title: "Clear the Prompt Queue",
    minutes: 20,
    cover: "project-management-with-ai-tools",
    activity: {
      kind: "scorm",
      packageUrl: "/scorm/m10-l2-a3-clear-the-prompt-queue/index.html",
      packageLabel: "SCORM 1.2 package",
      packageSizeLabel: "160 KB",
      intro: "Work through a queue of prompts with a token budget. The package reports completed when you finish the queue.",
      steps: [
        { title: "Start the course", detail: "The package connects to the platform when it loads." },
        { title: "Finish the queue", detail: "When the queue is done it reports completed: the course goes to 100% by itself." },
      ],
    },
  }),
  coursePackage({
    id: "pkg4",
    slug: "clearing-the-deck",
    title: "Clearing the Deck",
    minutes: 15,
    cover: "leadership-in-remote-teams",
    activity: {
      kind: "scorm",
      packageUrl: "/scorm/m12-l5-a2-clearing-the-deck/index.html",
      packageLabel: "SCORM 1.2 package",
      packageSizeLabel: "40 KB",
      // This package has no SCORM calls at all: it plays, but tells the platform nothing.
      reportsCompletion: false,
      intro: "Clear the deck. This package never reports to the platform, so the course is completed by hand.",
      steps: [
        { title: "Go through the course", detail: "The package plays, but it never sends a status." },
        { title: "Mark it complete", detail: "Select Mark as Complete at the end, or answer the question Next asks." },
      ],
    },
  }),
];
