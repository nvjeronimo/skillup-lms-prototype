import { coursePlayerHref, programCourse } from "./kit";
import type { Program } from "./kit";
import { relativeLabel } from "@/lib/sample-time";

/**
 * "SCORM and YouTube Test Program": a program made only to test, in one place, what the meeting of
 * 4 Nov 2026 asked to cover before ICP Phase 1 goes live (Nelson, 4 Nov 2026). Not a SkillUp
 * program and not in Figma: the page is the Program page with this content.
 *
 * - Course 1, YouTube Video Test: a YouTube video in YouTube's official embed (ICP Video row 9; row 10,
 *   YouTube inside our player, withdrawn on 12 Nov 2026).
 * - Course 2, SCORM Test Course: the four packages inside units of a course (Activity groups A–C).
 * - Courses 3 and 4: the content team's POSH course (Rise) and a Storyline final quiz (10 Nov 2026).
 * - Courses 5 and 6: the improved course-package flow, PROPOSED on 11 Nov 2026 (POSH as one
 *   package, then as its real two packages). See lib/courses/scorm-course-packages.
 * Removed on 11 Nov 2026 (Nelson): the four GenAI activities as whole courses and Golf Explained,
 * which had no zip from SkillUp behind them as courses.
 *
 * Nothing is started. Each course row agrees with the outline of its folder under lib/courses.
 */

const program: Program = {
  slug: "scorm-and-youtube-tests",
  title: "SCORM and YouTube Test Program",
  imageSrc: "/platform/covers/project-management-with-ai-tools.jpg",
  deliveryMode: "Flexible Learning",
  difficulty: "Beginner",
  stats: { courses: "6 courses", duration: "~ 4.5 hours", org: "SkillUp" },
  progress: {
    percent: 0,
    label: "Program progress",
    status: "Not started",
    cta: "Start course",
    href: coursePlayerHref("youtube-video-test"),
    footer: "0 of 6 courses complete",
  },

  coursesIntro: {
    title: "Courses in this program",
    lead: "Six test courses: a YouTube video in YouTube’s official embed, the four SCORM packages inside the units of a course, two real exports from the content team (a Rise course and a Storyline quiz), and the improved package flow proposed on 11 Nov 2026 (courses 5 and 6). Take them in any order.",
  },
  courses: [
    programCourse(1, "YouTube Video Test", "YT", "ux-research-and-design-thinking", {
      progressMeta: "40 min total",
      upNext: { title: "What each video tests", type: "Reading" },
      position: "1 module",
      detail: "3 topics",
      modules: [{ number: 1, title: "Module 1 · YouTube videos in the player", complete: false, topics: "3 topics", duration: "35m" }],
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
    programCourse(3, "POSH: Prevention of Sexual Harassment", "PO", "leadership-in-remote-teams", {
      progressMeta: "45 min total",
      upNext: { title: "POSH: Prevention of Sexual Harassment", type: "Activity" },
      position: "1 SCORM package",
      detail: "1 topic · Rise, own menu",
      modules: [{ number: 1, title: "Module 1 · POSH: Prevention of Sexual Harassment", complete: false, topics: "1 topic", duration: "45m" }],
    }),
    programCourse(4, "Final Quiz (Ungraded)", "FQ", "intro-to-product-analytics", {
      progressMeta: "10 min total",
      upNext: { title: "Final Quiz (Ungraded)", type: "Activity" },
      position: "1 SCORM package",
      detail: "1 topic · POSH final quiz",
      modules: [{ number: 1, title: "Module 1 · Final Quiz (Ungraded)", complete: false, topics: "1 topic", duration: "10m" }],
    }),
    // Proposal of 11 Nov 2026: one package reports a status, so the card says Started, with no share.
    programCourse(5, "POSH · proposed flow, one package", "P1", "leadership-in-remote-teams", {
      progressMeta: "45 min total",
      progressPct: 0,
      progressAs: "status",
      cta: "Resume",
      upNext: { title: "POSH: Prevention of Sexual Harassment", type: "Activity" },
      position: "1 SCORM package",
      detail: "1 topic · proposal: no sidebar or footer of ours",
      modules: [{ number: 1, title: "Module 1 · POSH · proposed flow, one package", complete: false, topics: "1 topic", duration: "45m" }],
    }),
    programCourse(6, "POSH · proposed flow, two packages", "P2", "intro-to-product-analytics", {
      progressMeta: "55 min total",
      upNext: { title: "POSH: Prevention of Sexual Harassment", type: "Activity" },
      position: "2 SCORM packages",
      detail: "2 topics · proposal: Next asks",
      modules: [{ number: 1, title: "Module 1 · POSH: Prevention of Sexual Harassment", complete: false, topics: "2 topics", duration: "55m" }],
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
        "Its package makes no SCORM calls, so it never tells the platform it is finished. Its unit in the SCORM Test Course falls back to Mark as Complete, and Next asks.",
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
    lead: "A test program: real SCORM 1.2 packages from the content team, two real Articulate exports (Rise and Storyline) and a public YouTube video, played as Open edX would play them.",
  },
  about: [
    {
      id: "about-1",
      title: "What each course tests",
      body: [
        "YouTube Video Test: a YouTube embed in a Text component (not tracked: Mark as Complete, and Next asks; back from YouTube, the alert asks to mark it complete), and a lesson page with text, the embed and a quick check.",
        "SCORM Test Course: four packages, each inside a unit of one course, with a test panel that shows what each package reports.",
        "POSH: Prevention of Sexual Harassment: the content team's real Rise course, with its own menu and videos, as one course package: one topic named after the course, our sidebar collapsed, 0% until the package reports completion, then 100%.",
        "Final Quiz (Ungraded): the POSH course's final assessment, a separate Storyline package (10 questions, pass mark 80%, repeat as needed), as one course package that reports a score.",
        "POSH · proposed flow, one package (proposal, 11 Nov 2026): a SCORM 1.2 package reports a status, never a percentage, so the course says Not started, Started or Completed instead of a share, and in the player nothing of ours surrounds the package: no sidebar, no ring, no footer.",
        "POSH · proposed flow, two packages (proposal, 11 Nov 2026): POSH as it really arrives, the Rise course and the Storyline quiz as two topics with our normal sidebar. Next asks before you leave a package that has not reported completion yet: stay, or continue anyway.",
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
  included: ["1 YouTube video", "4 SCORM packages in units", "4 SCORM course packages", "2 readings"],
  instructors: [{ name: "Nelson Jerónimo", role: "Design · SkillUp" }],
};

export default program;
