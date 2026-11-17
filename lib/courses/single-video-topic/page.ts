import { GRAY, SIX_SIGMA, modulesFromOutline, playerHref } from "@/lib/courses/kit";
import type { CourseDetail } from "@/lib/courses/kit";
import { SAMPLE_TODAY, todayLabel } from "@/lib/sample-time";
import { outline } from "./outline";

/** One video. A share of topics, not a SCORM status: this course is not a package. */
export const page: CourseDetail = {
  slug: outline.slug,
  title: outline.title,
  imageSrc: "/platform/covers/ux-research-and-design-thinking.jpg",
  deliveryMode: "Flexible Learning",
  difficulty: "Beginner",
  stats: { structure: "1 module · 1 topic", duration: "~ 6 min", org: "SkillUp · VIDEO-TEST" },
  progress: {
    percent: 0,
    label: "Course progress",
    eyebrow: "Start the video",
    cta: "Start course",
    href: playerHref(outline),
    notPassing: "Ungraded · completion only",
    done: "0 of 1 topics",
    timeLeft: "~ 6 min left",
  },
  program: { slug: "scorm-and-youtube-tests", title: "SCORM and YouTube Test Program" },
  search: SIX_SIGMA.search,
  update: {
    title: "Course update",
    body: "A test course: one video. The player hides the sidebar and keeps the progress ring and the footer. The picture is the Course Introduction already used by Digital Marketing Fundamentals.",
  },
  intro: {
    title: "What this course tests",
    lead: "One module and one video, and no SCORM package. The sidebar and Course Journey are hidden. The progress ring and the footer stay.",
  },
  modules: modulesFromOutline(outline, [{ duration: "6m", defaultOpen: true }]),
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
    requirements: [{ title: "Complete the video", detail: "0 of 1 topics · 0%", percent: 0 }],
  },
  handouts: { label: "Handouts", items: [] },
  upcomingDates: { label: "Upcoming dates", items: [], cta: "All dates" },
  tools: SIX_SIGMA.tools,
  progressTab: {
    title: "Your progress",
    completion: { title: "Course completion", complete: 0, incomplete: 1, locked: 0 },
    passAlert: {
      title: "This course is not graded",
      body: "It completes when the video is complete.",
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
        iso: "2026-11-16T00:00",
        date: "16 Nov 2026",
        time: "12:00 AM · your time",
        state: "complete",
        badges: [{ label: "Course", color: GRAY }],
        title: "Course opens",
        description: "Opened so a single video topic can be seen in the player.",
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
