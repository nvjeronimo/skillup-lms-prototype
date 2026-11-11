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
 * Course 7, Golf Explained (9 Nov 2026), is the one package with ITS OWN SIDEBAR: Rustici's public
 * golf sample (SCORM 1.2, CC BY 3.0) with a course menu added to its launch page, the way Rise
 * exports a whole course. Nelson and Navdeep found on 6 Nov that this case had never been tested:
 * our collapsed sidebar next to the package's menu. See public/scorm/golf-explained-rustici.
 *
 * Courses 8 and 9 (10 Nov 2026) are the content team's own exports, received from Nelson:
 * - POSH: Prevention of Sexual Harassment, a whole course exported from Articulate Rise (SCORM 1.2,
 *   Rustici scormdriver, videos inside): the real case of a package with its own menu.
 * - Final quiz (ungraded): the POSH course's final assessment, a separate package exported from
 *   Articulate Storyline (SCORM 1.2, 10 scenario questions, mastery score 80, repeat as often as
 *   needed). So the real POSH course comes as TWO packages, not one: see Kirti's open question.
 *
 * One file for all of them, not a folder each (lib/courses/README.md): they differ only in the
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

/** The content team's POSH course (Articulate Rise, SCORM 1.2): courses 8 and 10. */
const POSH_ACTIVITY: CourseActivity = {
  kind: "scorm",
  packageUrl: "/scorm/posh-prevention-of-sexual-harassment/scormdriver/indexAPI.html",
  packageLabel: "SCORM 1.2 package",
  packageSizeLabel: "99 MB",
  intro: "A whole course exported from Articulate Rise by the content team, with its own menu of lessons and videos inside. It resumes where you left off and reports completed when its own completion rule is met.",
  steps: [
    { title: "Use its menu", detail: "The package has its own sidebar of lessons, next to our collapsed sidebar. On a narrow screen Rise hides it behind its own menu button." },
    { title: "Finish the course", detail: "When Rise's completion rule is met it reports completed: the course goes to 100% by itself." },
  ],
};

/** POSH's final assessment (Articulate Storyline, SCORM 1.2): courses 9 and 11. */
const QUIZ_ACTIVITY: CourseActivity = {
  kind: "scorm",
  packageUrl: "/scorm/final-quiz-ungraded/index_lms.html",
  packageLabel: "SCORM 1.2 package",
  packageSizeLabel: "7 MB",
  intro: "The final assessment of the POSH course, exported from Articulate Storyline by the content team as a package of its own: 10 scenario questions, pass mark 80%, repeat as often as needed. It reports the score and passed or failed.",
  steps: [
    { title: "Answer the questions", detail: "The package connects to the platform when it loads and keeps your answers if you leave." },
    { title: "Submit the quiz", detail: "It reports the score, then passed (80% or more) or failed. You can retry as often as you like." },
  ],
};

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
  coursePackage({
    id: "pkg5",
    slug: "golf-explained",
    title: "Golf Explained",
    minutes: 30,
    cover: "ux-research-and-design-thinking",
    activity: {
      kind: "scorm",
      packageUrl: "/scorm/golf-explained-rustici/shared/launchpage.html",
      packageLabel: "SCORM 1.2 package",
      packageSizeLabel: "560 KB",
      intro: "A whole course with its own menu: 15 pages in five sections and a final quiz. Rustici Software's public golf sample, with a course menu added. It resumes where you left off, reports completed on its last page and passed or failed with the quiz score.",
      steps: [
        { title: "Use its menu", detail: "The package has its own sidebar of sections and pages, next to our collapsed sidebar. On a narrow screen it becomes a drawer behind its hamburger." },
        { title: "Reach the last page", detail: "On the final quiz it reports completed, then passed (70% or more) or failed with the score: the course goes to 100% by itself." },
      ],
    },
  }),
  coursePackage({
    id: "pkg6",
    slug: "posh-prevention-of-sexual-harassment",
    title: "POSH: Prevention of Sexual Harassment",
    minutes: 45,
    cover: "leadership-in-remote-teams",
    activity: POSH_ACTIVITY,
  }),
  coursePackage({
    id: "pkg7",
    slug: "final-quiz-ungraded",
    title: "Final Quiz (Ungraded)",
    minutes: 10,
    cover: "intro-to-product-analytics",
    activity: QUIZ_ACTIVITY,
  }),
];

/**
 * Courses 10 and 11: the improved flow for course packages, PROPOSED on 11 Nov 2026 after the SCORM
 * progress check (Jaspinder's question; docs: meeting-2026-11-04-scorm-youtube.md). A SCORM 1.2
 * package reports a status, never a percentage, and when it reports "completed" is the export's
 * setting (POSH: when its Storyline block is finished). Figma: Activity · SCORM, frame "Proposal ·
 * improved package flow". Not decided: these courses are where the proposal is referenced.
 *
 * - Course 10, POSH as one package: the course shows a status (Started) and never a share; in the
 *   player nothing of ours surrounds the package (no sidebar, no Course Journey, no ring, no
 *   footer). The top bar's close is the way out.
 * - Course 11, POSH as it really arrives, two packages (the Rise course and the Storyline quiz) as
 *   two topics of one module, with our normal sidebar and footer: Next asks before leaving a package
 *   that has not reported completion yet.
 */
function proposalAlone(): CourseEntry {
  const entry = coursePackage({
    id: "pkg8",
    slug: "posh-proposed-flow-one-package",
    title: "POSH · proposed flow, one package",
    minutes: 45,
    cover: "leadership-in-remote-teams",
    activity: POSH_ACTIVITY,
  });
  entry.outline.packageFlow = "proposal";
  entry.page.progress = {
    ...entry.page.progress,
    // Sample state: the learner has opened the package. Open edX knows it (Begin vs Resume).
    status: "Started",
    label: "Course status",
    eyebrow: "Pick up where you left off",
    cta: "Resume course",
    done: "Completes when the package reports it",
    timeLeft: "~ 45 min",
  };
  entry.page.intro = {
    title: "What this course proposes",
    lead: "Proposal, 11 Nov 2026: a course that is one SCORM package shows a status, never a percentage, and the package gets the whole screen, with no sidebar or footer of ours.",
  };
  entry.page.stats = { ...entry.page.stats, structure: "1 SCORM package · proposal" };
  return entry;
}

function proposalTwoPackages(): CourseEntry {
  const entry = coursePackage({
    id: "pkg9",
    slug: "posh-proposed-flow-two-packages",
    title: "POSH · proposed flow, two packages",
    minutes: 55,
    cover: "intro-to-product-analytics",
    activity: POSH_ACTIVITY,
  });
  const mod = entry.outline.modules[0];
  const [rise] = mod.topics ?? [];
  const quizId = "pkg9-m1-t2";
  entry.outline.packageFlow = "proposal";
  entry.outline.modules = [
    {
      ...mod,
      label: "M1",
      title: "POSH: Prevention of Sexual Harassment",
      implicit: false,
      topicsTotal: 2,
      topics: [
        { ...rise, title: "POSH: Prevention of Sexual Harassment", duration: "45 min approx." },
        { id: quizId, type: "Activity", title: "Final Quiz (Ungraded)", duration: "10 min approx.", completed: false },
      ],
    },
  ];
  entry.page.modules = modulesFromOutline(entry.outline, [{ duration: "55m", defaultOpen: true }]);
  entry.page.stats = { ...entry.page.stats, structure: "2 SCORM packages · proposal" };
  entry.page.intro = {
    title: "What this course proposes",
    lead: "Proposal, 11 Nov 2026: POSH as it really arrives, two packages as two topics. Next asks before you leave a package that has not reported completion yet.",
  };
  entry.content.activities = { ...entry.content.activities, [quizId]: QUIZ_ACTIVITY };
  return entry;
}

scormCoursePackages.push(proposalAlone(), proposalTwoPackages());
