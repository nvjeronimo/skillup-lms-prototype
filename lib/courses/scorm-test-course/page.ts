import { GRAY, SIX_SIGMA, modulesFromOutline, playerHref } from "@/lib/courses/kit";
import type { CourseDetail } from "@/lib/courses/kit";
import { outline } from "./outline";
import { SAMPLE_TODAY, todayLabel } from "@/lib/sample-time";

/**
 * "SCORM Test Course": five modules, five topics (a reading and four SCORM packages), not
 * started, ungraded (none of the packages reports a score). Self-paced: no dates beyond the
 * course opening (decision 036). Parts the test does not need come from SIX_SIGMA.
 */
export const page: CourseDetail = {
  slug: outline.slug,
  title: outline.title,
  imageSrc: "/platform/covers/business-analytics-with-python.jpg",
  deliveryMode: "Flexible Learning",
  difficulty: "Beginner",
  stats: { structure: "5 modules · 5 topics", duration: "~ 1 hour", org: "SkillUp · SCORM-TEST" },
  progress: {
    percent: 0,
    label: "Course progress",
    eyebrow: "Start with the first topic",
    cta: "Start course",
    href: playerHref(outline),
    notPassing: "Ungraded · completion only",
    done: "0 of 5 topics",
    timeLeft: "~ 1h left",
  },
  search: SIX_SIGMA.search,

  update: {
    title: "Course update",
    body: "A test course: each module plays one real SCORM 1.2 package from the GenAI for Finance course, with a test panel under it that shows what the package reports.",
  },
  intro: {
    title: "What this course tests",
    lead: "How the player runs real SCORM packages: loading, fullscreen, a new window, resuming, and the completion each package reports. One package never reports, to test the fallback.",
  },
  modules: modulesFromOutline(outline, [
    { duration: "4m", defaultOpen: true },
    { duration: "15m", defaultOpen: true },
    { duration: "15m", defaultOpen: true },
    { duration: "20m", defaultOpen: true },
    { duration: "15m", defaultOpen: true },
  ]),
  mentor: SIX_SIGMA.mentor,
  team: {
    label: "Course team",
    people: [{ name: "Nelson Jerónimo", role: "Design · SkillUp" }],
    cta: "Ask the course team",
  },
  certificate: {
    status: "not-earned",
    courseId: outline.slug,
    courseLabel: outline.title,
    title: "No certificate for a test course",
    requirements: [{ title: "Complete the course content", detail: "0 of 5 topics · 0%", percent: 0 }],
  },
  handouts: { label: "Handouts", items: ["The four SCORM 1.2 packages (ZIP)"] },
  upcomingDates: { label: "Upcoming dates", items: [], cta: "All dates" },
  tools: SIX_SIGMA.tools,

  progressTab: {
    title: "Your progress",
    completion: { title: "Course completion", complete: 0, incomplete: 5, locked: 0 },
    passAlert: {
      title: "This course is not graded",
      body: "It completes when all five topics are complete.",
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

  // The Q&A tab needs at least one thread to open: the sample ones.
  qaTab: SIX_SIGMA.qaTab,
};
