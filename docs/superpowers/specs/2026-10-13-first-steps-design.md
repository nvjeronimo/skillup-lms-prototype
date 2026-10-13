# First steps: the assistant shows a new learner how to start, and what to do next

Date: 13 Oct 2026 · Status: approved by Nelson on 13 Oct 2026 (proposals A to E accepted) · Scope: prototype only (`skillup-lms-prototype`)

Spec 2 of 2. It builds on the assistant of spec 1
(`2026-10-13-assistant-design.md`, merged in PR 127) and reuses its snapshot, its window and
its launcher.

## 1. What it is for

A learner who has just arrived does not know where to begin. The assistant gives them five
real things to do, ticks each one off when they do it, and after that keeps answering one
question in one line: what should I do next?

Success, in the prototype:

- On a first visit the learner sees, without asking, a short list of first steps and where each
  one happens.
- Each step ticks itself when the learner does the real thing on the real page. Nothing is
  ticked by hand.
- At any time, new or not, the assistant shows one next step with a button that goes there.
- It never blocks the page and can be dismissed for good.

## 2. Decisions already taken (Nelson, 13 Oct 2026)

| # | Decision |
|---|---|
| 1 | **Checklist + next step.** Not a guided tour, not a conversation that walks the learner through. |
| 2 | **Floating, like the assistant.** No card on the Dashboard. |
| 3 | From spec 1: one assistant; it answers and routes, never acts; prototype keeps it while no Figma screen carries it. |

## 3. Proposals in this spec that need your yes or no

These are mine; nothing is built until you answer.

| # | Proposal | Why | The alternative |
|---|---|---|---|
| A | **Same launcher, same window.** First steps is a view inside the assistant's window, not a second floating element. | Two launchers in one corner compete, and "one assistant" was your decision. | A second floating chip above the launcher. |
| B | **The window opens by itself once**, on the learner's first platform page, on desktop and tablet only. On a phone the launcher shows a badge instead, because the window is a full-screen sheet there. | Without it a new learner may never press the launcher. Once only, and closing it is remembered. | Never open by itself: badge only, everywhere. |
| C | **Five steps** (§5), all detectable from what the learner does. | Each one is a thing they need in week one and each can tick itself. | Fewer, or different ones. |
| D | **A "new learner" is simulated only as far as the first steps go.** The demo menu gets *Restart first steps*; the pages keep showing the sample learner who is part-way through. | Every figure on Dashboard and My Learning is fixed sample data; a true empty account is a separate, large piece of work. | Build an empty-account data set (not in this spec). |
| E | **Figma comes after you have seen it running**: one more block on the *Feature preview* page and one more state of `Assistant-Chat`. | Same order as spec 1. | Design first. |

## 4. How it looks and behaves

**The launcher.** Unchanged, plus a small count badge (steps left: 5 … 1) while first steps
are active. The accessible name becomes "Ask the assistant, 3 first steps left". No badge once
they are done or dismissed.

**The window, while first steps are active.** The body has two views, switched by two tabs
under the header: **First steps** (default until done) and **Ask**. *Ask* is the chat of spec 1,
untouched.

*First steps* view, top to bottom:

1. One line: "Welcome, John. Five things to get you started."
2. A progress line: "2 of 5 done" with the DS progress bar (fill `bg/info`, never `bg/primary`).
3. The five steps, in order. Each row: a status mark (done / to do), the step in a few words,
   one line of why, and a button that goes to where it happens ("Open your program"). A done
   row keeps its text, loses its button and reads "Done".
4. A quiet link at the bottom: "Skip first steps".

**When the fifth step is done.** The view shows "You're set." with the next step (below) and a
button "Ask the assistant" that switches to the chat. The next time the window opens, the tabs
are gone and the window is the chat of spec 1.

**Next step, always.** At the top of the chat's empty state, above the suggestions, a card:
"Next: “Persona research draft” is due tonight." with one button. It is there for every
learner, new or not, on every page, and it is the same answer the assistant gives to "What
should I do next?" (one function, §6.3). In the player it is hidden when the next step is the
topic already open.

**Opening by itself (proposal B).** Once, on the first platform page after first steps start,
on viewports of 768 px and wider, 600 ms after the page is ready, without taking the keyboard
focus. Closing it, by any means, is remembered; it never opens by itself again.

**Dismissing.** "Skip first steps" asks nothing and hides the view, the tabs and the badge for
good. The demo menu's *Restart first steps* brings everything back (prototype only, in the
menu's existing demo section, never on the page).

## 5. The five steps

| # | Step (label) | Why (one line under it) | Button | It is done when |
|---|---|---|---|---|
| 1 | Open your program | See the courses ahead and the certificate at the end. | Open your program → the program page | A program page is visited. |
| 2 | Open a course | Its page has your progress, dates and grades. | Open a course → the course in progress | A course page is visited. |
| 3 | Start a topic | Learning happens in the player. | Start learning → the resume topic | Any player topic is visited. |
| 4 | Complete a topic | Completed topics move your progress. | Resume → the resume topic | One topic becomes complete that was not complete when first steps started. |
| 5 | Ask the assistant | Deadlines, certificates, where you stopped. | Ask a question → the *Ask* tab | The learner sends one question. |

Order is the order shown, but any step can be done at any time. Steps 1 to 3 tick on a visit
even if the learner got there without the button.

## 6. Units

### 6.1 `lib/first-steps/steps.ts`

The five steps as data: `id`, `label`, `why`, `cta`, and `actionId` (an id of
`snapshot.actions`, so the address always comes from the snapshot, as in spec 1) or
`"ask"` for step 5. Pure, no React.

### 6.2 `lib/first-steps/progress.ts`

```ts
interface FirstStepsState {
  status: "active" | "done" | "dismissed";
  done: StepId[];
  /** Topics already complete when first steps started: step 4 needs a new one. */
  baseline: string[];
  /** The window has opened by itself, or the learner has closed it. */
  greeted: boolean;
}
type FirstStepsEvent =
  | { type: "visited"; page: PageContext }
  | { type: "completed"; completedTopics: string[] }
  | { type: "asked" } | { type: "greeted" } | { type: "dismissed" } | { type: "restarted"; completedTopics: string[] };

reduce(state, event): FirstStepsState     // pure; status becomes "done" when the fifth is in
load(storage): FirstStepsState            // junk or nothing → a fresh active state
save(storage, state): void                // never throws
```

Kept in `localStorage` under `sk-first-steps`, apart from the demo store: no store version
bump, and *Reset demo* also restarts it.

### 6.3 `lib/assistant/next-step.ts`

`nextStep(snapshot): { text: string; actionId: string } | null`, moved out of the `next`
intent of `scripted.ts` (same order: a deadline today, else the course in progress, else the
first course not started, else nothing). The scripted intent and the card both call it. `null`
when everything is complete: the card is not shown.

### 6.4 `lib/first-steps/useFirstSteps.ts`

Client hook: loads the state after mount, feeds `reduce` from the page context (the address),
the store's `completedTopics` and the assistant's `ask`, saves on change, and exposes
`{ state, steps, left, dismiss, restart, markGreeted }`.

### 6.5 `lib/assistant/types.ts` + `snapshot.ts`

`LearnerSnapshot.firstSteps?: { done: string[]; left: string[] }`, present only while active,
so in model mode Claude can answer "what should I do first?" from the same list. The scripted
side gains one intent, `first-steps` ("How do I get started?"), answered from it.

### 6.6 UI

- `components/assistant/FirstStepsView.tsx`: presentational, the view of §4.
- `components/assistant/NextStepCard.tsx`: the card.
- `AssistantWindow`: tabs when `firstSteps.status === "active"`; the card in the empty state.
- `AssistantLauncher`: the badge and the longer accessible name.
- `AssistantChat`: wires `useFirstSteps`, the open-once rule, and passes `ask` through so
  step 5 ticks.
- `DemoControlsMenu`: *Restart first steps*.

Accessibility: the tabs are a real tablist; a step that ticks is announced once through the
window's polite live region ("Done: Open your program. 3 steps left."); status marks are not
colour alone (icon + the word "Done"); every target is at least 44 px; the open-by-itself
window does not move focus and is announced as a status, not an alert.

## 7. Out of scope

A true empty account · a guided tour or coach marks · proactive nudges after first steps end ·
email or notifications · streaks, points or any reward · remembering first steps across devices
· the Figma component (after review, proposal E) · changing the Dashboard.

## 8. Open edX

Nothing serves a first-steps list. What the steps read exists: page visits are the client's own,
completion comes from the Completion API, the next step from Learner Home (resume) and the
Dates API. Where the state lives in the product (a user preference, not local storage) is a
question for the vendor.

## 9. Checks

- Unit tests (vitest) for `reduce` (each event, each step, the baseline rule of step 4, done at
  five, dismissed stays dismissed, restart), `load` on junk, `nextStep` on each branch, the new
  scripted intent.
- `next build`, `next lint`, `tsc --noEmit`, `lint:tokens`.
- In the browser, desktop and phone, light and dark: a fresh state opens the window once; each
  of the five steps ticks by doing the real thing; the badge counts down; skip hides
  everything; restart brings it back; the next-step card matches the answer to "What should I
  do next?"; the chat of spec 1 still passes its own checks.

## 10. Delivery

One PR to `main`, squash-merged by Nelson. Then, if proposal E stands, the Figma block and the
`Assistant-Chat` state in a second pass.

## 11. What the build changed

- **Restart first steps is in two menus**: the player's demo menu and the profile panel of the
  platform top bar. The demo menu exists in the player only, and a new learner starts on a
  platform page.
- **Opening the window on the First steps tab puts the focus on that tab**; there is no input
  on it. When the window opens by itself the focus stays on the page.
- **The baseline is read from the stored progress**, not from the first render: otherwise a
  topic completed on an earlier visit ticked "Complete a topic" at once.
- **A fresh state is written only once something happens** (a step, the greeting, a skip).
- **The Next card is not shown when the next step is the page the learner is on.**

## 12. After the independent review (13 Oct 2026)

- **Two browser tabs agree.** Every change is reduced from what is stored, and a tab picks up
  what another tab wrote: a skip or a finished list in one tab is no longer undone by the other.
- **"You're set." is shown once.** After the window closes, the next opening is the chat alone.
- **The step announced is the one that has just ticked**, not the last done step of the list.
- **The window opening by itself is said to a screen reader** ("SkillUp Assistant opened: 5
  first steps to get you started.") through a status region; the focus stays on the page.
- **Only the learner's own open or close counts as greeted.** The sheet closing on navigation
  on a phone does not.
- **"How do I get started?" no longer takes other questions**: "the first step to get my
  certificate" gets the certificate answer; "What should I do first?" gets the first steps.
- **A stored state is cleaned on read** (a step listed twice; five done but still active).
- **After Skip, the focus goes to the chat's input.** After a restart, the page the learner is
  on counts at once.
- **Not done, known:** buttons in the view are 36 px on desktop (44 px with larger targets on,
  as everywhere); the count badge uses the error colour; a course added to the prototype later
  seeds completions that can tick "Complete a topic"; with storage blocked the window opens by
  itself on every full load; "How do I get started?" is not offered as a suggestion.
