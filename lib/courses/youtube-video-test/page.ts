import { GRAY, SIX_SIGMA, modulesFromOutline, playerHref } from "@/lib/courses/kit";
import type { CourseDetail } from "@/lib/courses/kit";
import { outline } from "./outline";
import { SAMPLE_TODAY, todayLabel } from "@/lib/sample-time";

/**
 * "YouTube Video Test": one module, four topics (a reading and three YouTube videos), not
 * started, ungraded. Course 1 of the SCORM and YouTube Test Program. Self-paced: no dates beyond
 * the course opening (decision 036). Parts the test does not need come from SIX_SIGMA.
 */
export const page: CourseDetail = {
  slug: outline.slug,
  title: outline.title,
  imageSrc: "/platform/covers/ux-research-and-design-thinking.jpg",
  deliveryMode: "Flexible Learning",
  difficulty: "Beginner",
  stats: { structure: "1 module · 4 topics", duration: "~ 1 hour", org: "SkillUp · YOUTUBE-TEST" },
  progress: {
    percent: 0,
    label: "Course progress",
    eyebrow: "Start with the first topic",
    cta: "Start course",
    href: playerHref(outline),
    notPassing: "Ungraded · completion only",
    done: "0 of 4 topics",
    timeLeft: "~ 1h left",
  },
  program: { slug: "scorm-and-youtube-tests", title: "SCORM and YouTube Test Program" },
  search: SIX_SIGMA.search,

  update: {
    title: "Course update",
    body: "A test course: the same public YouTube video added as an embed in a Text component and as a Video component, and a video that is no longer available.",
  },
  intro: {
    title: "What this course tests",
    lead: "How YouTube videos behave in the player: which ones complete by themselves, which ones ask, and what a learner sees when a video has gone.",
  },
  modules: modulesFromOutline(outline, [{ duration: "1h 07m", defaultOpen: true }]),
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
    requirements: [{ title: "Complete the course content", detail: "0 of 4 topics · 0%", percent: 0 }],
  },
  handouts: { label: "Handouts", items: [] },
  upcomingDates: { label: "Upcoming dates", items: [], cta: "All dates" },
  tools: SIX_SIGMA.tools,

  progressTab: {
    title: "Your progress",
    completion: { title: "Course completion", complete: 0, incomplete: 4, locked: 0 },
    passAlert: {
      title: "This course is not graded",
      body: "It completes when all four topics are complete.",
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
        description: "Opened for the YouTube tests of 4 Nov 2026.",
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
