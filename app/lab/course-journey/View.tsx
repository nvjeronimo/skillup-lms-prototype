"use client";

import Link from "next/link";
import { coursePlayerHref } from "@/lib/platform/hrefs";
import { setJourneyProposal, useJourneyProposal } from "@/lib/journeyProposal";

const COURSE = "ai-driven-content-and-brand-communication";

/** The critique's findings and what the proposal does about each (Impeccable, 24 Oct 2026). */
const FIXES: { priority: string; problem: string; change: string; check: string }[] = [
  {
    priority: "P1",
    problem: "The assistant launcher sits over the sidebar (the current row at 960) and over the Course Journey drawer on a phone.",
    change: "In the player it moves to the content card's bottom right, above Previous and Next, and steps away while another dialog is open.",
    check: "Desktop at 960: the current row is clear. Phone: open the drawer, no launcher on it.",
  },
  {
    priority: "P1",
    problem: "The open topic shows the same empty ring as a topic not started; \"Module 5 of 4\" at 100%; nothing says what is next.",
    change: "\"Module N of M\" is the module of the open topic, \"Course completed\" at 100%, plus \"x of y topics done\". A quiet \"Up next\" tag on the next topic.",
    check: "The progress block and the row after the open one.",
  },
  {
    priority: "P1",
    problem: "Every locked row named the same earlier quiz, in a tooltip that covered the next row and left after 3 s.",
    change: "Each locked row says \"Unlocks after <the topic before it>\" under its meta line. A module locked as a whole says it once under its header.",
    check: "Module 04 of this course.",
  },
  {
    priority: "P2",
    problem: "38 topics with no list or headings, and 43 tab stops before the content.",
    change: "Modules are sections with their toggle in a heading, topics are ordered lists, and the list is one tab stop: ↑ ↓ Home End move, → goes to a row's bookmark and opens a module, ← comes back and closes it.",
    check: "Tab into the list, then use the arrows.",
  },
  {
    priority: "P2",
    problem: "Every module open, module context scrolls away, the current row lands at the drawer's edge.",
    change: "Only the module of the open topic is open; completed modules close as you move on. Module headers stick while their topics scroll. The open topic lands a third of the way down when it is out of view.",
    check: "Scroll a long module; open the drawer on a phone.",
  },
  {
    priority: "Minor",
    problem: "Truncated duration on the active row, a green check with no word, a weak lesson level, a doubled \"Course Journey\" / \"COURSE\", inline uppercase, cryptic rail labels, a rail bookmark nobody hears, a trigger named \"Open…\" while open, a bookmark state said twice.",
    change: "Meta lines wrap; Module Info says \"3 of 12 topics\" and \"Completed\"; lesson names are headings; \"Course journey\" names the panel on desktop and the drawer drops the eyebrow; DS Label styles; the rail reads M2 / L1 with spoken groups and bookmarks; the phone trigger is \"Course Journey\" with aria-expanded; the bookmark keeps one name and aria-pressed says the state.",
    check: "Collapse the sidebar to the rail; use a screen reader on a row.",
  },
];

/**
 * /lab/course-journey: the Course Journey proposal (Nelson, 24 Oct 2026: "a separate page with
 * the fixes, for my analysis"). The proposal runs in the real player, behind a flag for this
 * browser tab; this page says what changed and opens the player with and without it.
 */
export function CourseJourneyProposal() {
  const on = useJourneyProposal();
  const href = coursePlayerHref(COURSE);
  return (
    <main id="main" tabIndex={-1} className="mx-auto w-full max-w-4xl flex-1 p-4 outline-none md:p-8">
      <h1 className="sk-text-headline-medium-semibold text-sko-text-default">Course Journey proposal</h1>
      <p className="sk-text-body-large-regular mt-1 max-w-[65ch] text-sko-text-muted">
        The ICP sidebar with every fix from the Impeccable critique of 24 Oct 2026 (27/40). It runs in the
        real player, so it can be compared with the current sidebar on the same course. The choice lasts for
        this browser tab.
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Link
          href={`${href}?journey=proposal`}
          onClick={() => setJourneyProposal(true)}
          className="sk-text-body-medium-semibold inline-flex h-11 items-center rounded-control bg-sko-bg-primary px-4 text-sko-text-on-primary hover:bg-sko-bg-primary-hover"
        >
          Open the proposal
        </Link>
        <Link
          href={`${href}?journey=current`}
          onClick={() => setJourneyProposal(false)}
          className="sk-text-body-medium-semibold inline-flex h-11 items-center rounded-control border border-sko-border-default bg-sko-bg-page px-4 text-sko-text-default hover:bg-sko-bg-hover"
        >
          Open the current sidebar
        </Link>
        <span className="sk-text-body-small-medium text-sko-text-subtle" aria-live="polite">
          This tab shows: {on ? "the proposal" : "the current sidebar"}
        </span>
      </div>

      <h2 className="sk-text-title-medium-semibold mt-10 text-sko-text-default">What changes</h2>
      <ol className="mt-3 flex flex-col gap-3">
        {FIXES.map((f) => (
          <li key={f.problem} className="rounded-card border border-sko-border-subtle bg-sko-bg-page p-4">
            <p className="sk-text-label-small-semibold text-sko-text-subtle">{f.priority}</p>
            <p className="sk-text-body-medium-regular mt-1 text-sko-text-muted">{f.problem}</p>
            <p className="sk-text-body-medium-semibold mt-2 text-sko-text-default">{f.change}</p>
            <p className="sk-text-body-small-regular mt-2 text-sko-text-subtle">To check: {f.check}</p>
          </li>
        ))}
      </ol>

      <h2 className="sk-text-title-medium-semibold mt-10 text-sko-text-default">Not in the proposal</h2>
      <ul className="sk-text-body-medium-regular mt-2 list-disc pl-5 text-sko-text-muted">
        <li>An In Progress ring on the open topic and a &ldquo;Jump to current topic&rdquo; button: refused by the stakeholders (24 Oct 2026).</li>
        <li>Search or filter over the topics (the critique&apos;s efficiency score): one more decision, not a fix.</li>
        <li>The drawer&apos;s close button stays top right; the phone trigger stays top left.</li>
        <li>The lock text follows the order of the outline. Open edX gates a subsection on a prerequisite subsection; which one comes from the course, not from the order (MOCK).</li>
      </ul>
    </main>
  );
}
