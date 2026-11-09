import { coursePlayerHref, programCourse } from "./kit";
import type { Program } from "./kit";
import { relativeLabel } from "@/lib/sample-time";

/**
 * "SCORM and YouTube Test Program": a program made only to test, in one place, what the meeting of
 * 4 Nov 2026 asked to cover before ICP Phase 1 goes live (Nelson, 4 Nov 2026). Not a SkillUp
 * program and not in Figma: the page is the Program page with this content.
 *
 * - Course 1, YouTube Video Test: the two ways to add a YouTube video (ICP Video rows 9 and 10).
 * - Course 2, SCORM Test Course: the four packages inside units of a course (Activity groups A–C).
 * - Courses 3 to 6: each a whole course delivered as one SCORM package (Activity group D).
 * - Course 7, Golf Explained: a course package with its own sidebar (added 9 Nov 2026).
 *
 * Nothing is started. Each course row agrees with the outline of its folder under lib/courses.
 */

const program: Program = {
  slug: "scorm-and-youtube-tests",
  title: "SCORM and YouTube Test Program",
  imageSrc: "/platform/covers/project-management-with-ai-tools.jpg",
  deliveryMode: "Flexible Learning",
  difficulty: "Beginner",
  stats: { courses: "7 courses", duration: "~ 3.5 hours", org: "SkillUp" },
  progress: {
    percent: 0,
    label: "Program progress",
    status: "Not started",
    cta: "Start course",
    href: coursePlayerHref("youtube-video-test"),
    footer: "0 of 7 courses complete",
  },

  coursesIntro: {
    title: "Courses in this program",
    lead: "Seven test courses: YouTube videos added the two ways Studio allows, the four SCORM packages inside the units of a course, the same four packages as whole courses of one topic each, and a whole-course package with its own menu. Take them in any order.",
  },
  courses: [
    programCourse(1, "YouTube Video Test", "YT", "ux-research-and-design-thinking", {
      progressMeta: "1 hour total",
      upNext: { title: "What each video tests", type: "Reading" },
      position: "1 module",
      detail: "4 topics",
      modules: [{ number: 1, title: "Module 1 · YouTube videos in the player", complete: false, topics: "4 topics", duration: "1h 07m" }],
      defaultOpen: true,
    }),
    programCourse(2, "SCORM Test Course", "SC", "business-analytics-with-python", {
      progressMeta: "1 hour total",
      upNext: { title: "What each package does, and what to check", type: "Reading" },
      position: "5 modules",
      detail: "5 topics",
      modules: [
        { number: 1, title: "Module 1 · About this test course", complete: false, topics: "1 topic", duration: "4m" },
        { number: 2, title: "Module 2 · M4 · From Export to Board Narrative", complete: false, topics: "1 topic", duration: "15m" },
        { number: 3, title: "Module 3 · M5 · Reading the Signal", complete: false, topics: "1 topic", duration: "15m" },
        { number: 4, title: "Module 4 · M10 · Clear the Prompt Queue", complete: false, topics: "1 topic", duration: "20m" },
        { number: 5, title: "Module 5 · M12 · Clearing the Deck", complete: false, topics: "1 topic", duration: "15m" },
      ],
    }),
    programCourse(3, "From Export to Board Narrative", "FE", "business-analytics-with-python", {
      progressMeta: "15 min total",
      upNext: { title: "From Export to Board Narrative", type: "Activity" },
      position: "1 SCORM package",
      detail: "1 topic",
      modules: [{ number: 1, title: "Module 1 · From Export to Board Narrative", complete: false, topics: "1 topic", duration: "15m" }],
    }),
    programCourse(4, "Reading the Signal", "RS", "intro-to-product-analytics", {
      progressMeta: "15 min total",
      upNext: { title: "Reading the Signal", type: "Activity" },
      position: "1 SCORM package",
      detail: "1 topic",
      modules: [{ number: 1, title: "Module 1 · Reading the Signal", complete: false, topics: "1 topic", duration: "15m" }],
    }),
    programCourse(5, "Clear the Prompt Queue", "CQ", "project-management-with-ai-tools", {
      progressMeta: "20 min total",
      upNext: { title: "Clear the Prompt Queue", type: "Activity" },
      position: "1 SCORM package",
      detail: "1 topic",
      modules: [{ number: 1, title: "Module 1 · Clear the Prompt Queue", complete: false, topics: "1 topic", duration: "20m" }],
    }),
    programCourse(6, "Clearing the Deck", "CD", "leadership-in-remote-teams", {
      progressMeta: "15 min total",
      upNext: { title: "Clearing the Deck", type: "Activity" },
      position: "1 SCORM package",
      detail: "1 topic · never reports",
      modules: [{ number: 1, title: "Module 1 · Clearing the Deck", complete: false, topics: "1 topic", duration: "15m" }],
    }),
    programCourse(7, "Golf Explained", "GE", "ux-research-and-design-thinking", {
      progressMeta: "30 min total",
      upNext: { title: "Golf Explained", type: "Activity" },
      position: "1 SCORM package",
      detail: "1 topic · own menu",
      modules: [{ number: 1, title: "Module 1 · Golf Explained", complete: false, topics: "1 topic", duration: "30m" }],
    }),
  ],

  certificatesIntro: {
    title: "Certificates",
    lead: "Test courses issue no certificate.",
  },
  certificates: [],
  certificatesNote: "These are test courses: none of them issues a certificate.",

  faqsIntro: { title: "FAQs" },
  faqs: [
    {
      id: "faq-1",
      title: "What is this program for?",
      body: [
        "It gathers the test courses for YouTube videos and SCORM packages, the two content sources the meeting of 4 Nov 2026 asked to cover before ICP Phase 1 goes live.",
      ],
      defaultOpen: true,
    },
    {
      id: "faq-2",
      title: "Why does Clearing the Deck never complete by itself?",
      body: [
        "Its package makes no SCORM calls, so it never tells the platform it is finished. The course falls back to Mark as Complete, and Next asks.",
      ],
    },
    {
      id: "faq-3",
      title: "How do I test a package again from the start?",
      body: [
        "Under each package, the test panel has Reset this package: it clears what the package stored, so it starts from nothing.",
      ],
    },
  ],

  aboutIntro: {
    title: "About this program",
    lead: "A test program: real SCORM 1.2 packages from the content team, a public SCORM sample from Rustici Software and a public YouTube video, played as Open edX would play them.",
  },
  about: [
    {
      id: "about-1",
      title: "What each course tests",
      body: [
        "YouTube Video Test: a YouTube embed in a Text component (not tracked: Mark as Complete, and Next asks), the same video as a Video component (tracked: it completes by itself), and a video that is no longer available.",
        "SCORM Test Course: four packages, each inside a unit of one course, with a test panel that shows what each package reports.",
        "The four course packages: a whole course as one SCORM package. One topic named after the course, our sidebar collapsed, 0% until the package reports completion, then 100%.",
        "Golf Explained: a course package with its own sidebar menu (Rustici Software's public golf sample, CC BY 3.0, with a menu added), to see our collapsed sidebar next to the package's own.",
      ],
      defaultOpen: true,
    },
  ],

  dates: [
    {
      id: "starts",
      iso: "2026-11-04",
      day: "04",
      month: "NOV",
      title: "Program opens",
      detail: "4 Nov 2026 · for the SCORM and YouTube tests",
      relative: relativeLabel("2026-11-04"),
    },
  ],
  included: ["3 YouTube videos", "4 SCORM packages in units", "5 SCORM course packages", "2 readings"],
  instructors: [{ name: "Nelson Jerónimo", role: "Design · SkillUp" }],
};

export default program;
