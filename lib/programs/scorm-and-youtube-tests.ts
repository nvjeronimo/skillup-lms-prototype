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
 * - Courses 5 and 6: the same exports again, as one package and as two packages. See
 *   lib/courses/scorm-course-packages.
 * - Course 7, Single video topic: one module and one video (the Course Introduction already
 *   used by Digital Marketing Fundamentals). No package. The sidebar is hidden; the ring and
 *   the footer stay.
 * Removed on 11 Nov 2026 (Nelson): the four GenAI activities as whole courses and Golf Explained,
 * which had no zip from SkillUp behind them as courses.
 *
 * Nothing is started. Each course row agrees with the outline of its folder under lib/courses.
 */

const program: Program = {
  slug: "scorm-and-youtube-tests",
  // Not one of the prototype's programs: personas do not map it (lib/personas.test.ts).
  testOnly: true,
  title: "SCORM and YouTube Test Program",
  imageSrc: "/platform/covers/project-management-with-ai-tools.jpg",
  deliveryMode: "Flexible Learning",
  difficulty: "Beginner",
  stats: { courses: "7 courses", duration: "~ 4.6 hours", org: "SkillUp" },
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
    lead: "Seven test courses: a YouTube video in YouTube’s official embed, the four SCORM packages inside the units of a course, two real exports from the content team (a Rise course and a Storyline quiz), those same exports again as one package and as two packages (courses 5 and 6), and one video on its own (course 7). Take them in any order.",
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
      progressAs: "status",
      upNext: { title: "POSH: Prevention of Sexual Harassment", type: "Activity" },
      position: "1 SCORM package",
      detail: "1 topic · Rise, no sidebar",
      modules: [{ number: 1, title: "Module 1 · POSH: Prevention of Sexual Harassment", complete: false, topics: "1 topic", duration: "45m" }],
    }),
    programCourse(4, "Final Quiz (Ungraded)", "FQ", "intro-to-product-analytics", {
      progressMeta: "10 min total",
      progressAs: "status",
      upNext: { title: "Final Quiz (Ungraded)", type: "Activity" },
      position: "1 SCORM package",
      detail: "1 topic · quiz, no sidebar",
      modules: [{ number: 1, title: "Module 1 · Final Quiz (Ungraded)", complete: false, topics: "1 topic", duration: "10m" }],
    }),
    // One package reports a status, so the card says Started, with no share.
    programCourse(5, "POSH · one package", "P1", "leadership-in-remote-teams", {
      progressMeta: "45 min total",
      progressPct: 0,
      progressAs: "status",
      cta: "Resume",
      upNext: { title: "POSH: Prevention of Sexual Harassment", type: "Activity" },
      position: "1 SCORM package",
      detail: "1 topic · no sidebar, ring or footer",
      modules: [{ number: 1, title: "Module 1 · POSH · one package", complete: false, topics: "1 topic", duration: "45m" }],
    }),
    programCourse(6, "POSH · two packages", "P2", "intro-to-product-analytics", {
      progressMeta: "55 min total",
      upNext: { title: "POSH: Prevention of Sexual Harassment", type: "Activity" },
      position: "2 SCORM packages",
      detail: "2 topics · Next asks before leaving",
      modules: [{ number: 1, title: "Module 1 · POSH: Prevention of Sexual Harassment", complete: false, topics: "2 topics", duration: "55m" }],
    }),
    programCourse(7, "Single video topic", "SV", "ux-research-and-design-thinking", {
      progressMeta: "6 min total",
      upNext: { title: "Course Introduction", type: "Video" },
      position: "1 module",
      detail: "1 video · no sidebar, ring and footer stay",
      modules: [{ number: 1, title: "Module 1 · Single video topic", complete: false, topics: "1 topic", duration: "6m" }],
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
        "POSH: Prevention of Sexual Harassment: the content team's real Rise course, with its own menu and videos, as one course package: one topic named after the course. The course shows a status, never a percentage, and the player has no sidebar, ring or footer.",
        "Final Quiz (Ungraded): the POSH course's final assessment, a separate Storyline package (10 questions, pass mark 80%, repeat as needed), as one course package that reports a score. Same player: no sidebar, ring or footer.",
        "POSH · one package: the same Rise course, opened already, so the page says Started. A SCORM 1.2 package reports a status, never a percentage, and in the player nothing of ours surrounds the package: no sidebar, no ring, no footer.",
        "POSH · two packages: POSH as it arrives, the Rise course and the Storyline quiz as two topics with the sidebar. Next asks before you leave a package that has not reported completion yet: stay, or continue anyway.",
        "Single video topic: one video, the Course Introduction already used by Digital Marketing Fundamentals. No SCORM package. The sidebar and Course Journey are hidden. The progress ring and the footer stay.",
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
  included: ["1 YouTube video", "4 SCORM packages in units", "4 SCORM course packages", "2 readings", "1 single video"],
  instructors: [{ name: "Nelson Jerónimo", role: "Design · SkillUp" }],
};

export default program;
