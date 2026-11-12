import { GRAY, SIX_SIGMA, modulesFromOutline, playerHref } from "@/lib/courses/kit";
import type { CourseDetail } from "@/lib/courses/kit";
import { outline } from "./outline";
import { SAMPLE_TODAY, todayLabel } from "@/lib/sample-time";

/**
 * "YouTube Video Test": one module, three topics (a reading, a YouTube embed, and a lesson page
 * with text, the embed and a quick check), not
 * started, ungraded. Course 1 of the SCORM and YouTube Test Program. Self-paced: no dates beyond
 * the course opening (decision 036). Parts the test does not need come from SIX_SIGMA.
 */
export const page: CourseDetail = {
  slug: outline.slug,
  title: outline.title,
  imageSrc: "/platform/covers/ux-research-and-design-thinking.jpg",
  deliveryMode: "Flexible Learning",
  difficulty: "Beginner",
  stats: { structure: "1 module · 3 topics", duration: "~ 40 min", org: "SkillUp · YOUTUBE-TEST" },
  progress: {
    percent: 0,
    label: "Course progress",
    eyebrow: "Start with the first topic",
    cta: "Start course",
    href: playerHref(outline),
    notPassing: "Ungraded · completion only",
    done: "0 of 3 topics",
    timeLeft: "~ 40m left",
  },
  program: { slug: "scorm-and-youtube-tests", title: "SCORM and YouTube Test Program" },
  search: SIX_SIGMA.search,

  update: {
    title: "Course update",
    body: "A test course: a public YouTube video in YouTube’s official embed. YouTube inside our own player was withdrawn on 12 Nov 2026. A lesson page mixes the video with text and a quick check."
  },
  intro: {
    title: "What this course tests",
    lead: "How a YouTube embed behaves in the player: progress is not tracked, the learner marks it complete, and Next asks."
  },
  modules: modulesFromOutline(outline, [{ duration: "35m", defaultOpen: true }]),
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
    requirements: [{ title: "Complete the course content", detail: "0 of 3 topics · 0%", percent: 0 }],
  },
  handouts: { label: "Handouts", items: [] },
  upcomingDates: { label: "Upcoming dates", items: [], cta: "All dates" },
  tools: SIX_SIGMA.tools,

  progressTab: {
    title: "Your progress",
    completion: { title: "Course completion", complete: 0, incomplete: 3, locked: 0 },
    passAlert: {
      title: "This course is not graded",
      body: "It completes when all three topics are complete.",
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
