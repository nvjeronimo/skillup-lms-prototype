# First Steps Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Inside the assistant's window, a *First steps* view with five steps that tick themselves as the learner does them, and a *Next* card that always says what to do next.

**Architecture:** A pure reducer holds the first-steps state (which steps are done, the completion baseline, greeted, dismissed) and is fed three kinds of events: the page visited (from the address), the store's completed topics, and a question asked. The state lives in `localStorage`, apart from the demo store. The "what next" rule is pulled out of the scripted `next` intent into one function that the intent and the card both call. The existing window gains two tabs while first steps are active; the launcher gains a badge.

**Tech Stack:** Next 14.2, React 18, TypeScript, Tailwind (`sko-*`, `sk-text-*`), zustand (read only), vitest. No new dependency.

**Spec:** `docs/superpowers/specs/2026-10-13-first-steps-design.md` (approved 13 Oct 2026, proposals A to E accepted). Spec 1, which this extends: `docs/superpowers/specs/2026-10-13-assistant-design.md`.

## Global Constraints

- Nothing here changes the learner's data: no store action is called except reading `completedTopics`.
- Every address comes from `snapshot.actions`. A step whose action is not in the snapshot shows no button.
- State key: `localStorage` `sk-first-steps`. The demo store's `version` (4) does not change.
- Copy, verbatim: view intro `Welcome, {firstName}. Five things to get you started.` · progress `{n} of 5 done` · done row `Done` · skip `Skip first steps` · finished `You're set.` · finished button `Ask the assistant` · tabs `First steps`, `Ask` · card lead `Next:` · demo menu `Restart first steps` · launcher name `Ask the assistant, {n} first steps left` (singular `1 first step left`).
- Progress fill is `bg-sko-bg-info`, never `bg-sko-bg-primary`: use `components/platform/PlatformProgressBar`.
- The window opens by itself once only, on viewports ≥ 768 px, 600 ms after mount, and does not take the focus. On a phone: badge only.
- Targets ≥ 44 px. Status is never colour alone (icon + the word `Done`).
- Colours and type through `sko-*` / `sk-text-*`; `node scripts/check-tokens.mjs` reports no new hit.
- `package-lock.json` is never committed; add paths explicitly.
- Checks before the PR: `./node_modules/.bin/next build` (stop the dev server first, `rm -rf .next` after), `next lint`, `tsc --noEmit`, `node scripts/check-tokens.mjs`, `./node_modules/.bin/vitest run`.
- Commits end with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Review Focus

1. **A learner who already did things before first steps existed** (returning browser, topics complete, no `sk-first-steps`): starts fresh at 0 of 5 with today's completed topics as the baseline; old completions do not tick step 4. → Task 2.
2. **Stored state that is junk, from another shape, or names steps that do not exist**: a fresh state, no crash; the chat still works. → Task 2.
3. **Events after the end**: once `done` or `dismissed`, visits, completions and questions change nothing; only `restarted` does. A step never ticks twice. → Task 2.
4. **A snapshot with no program, no course in progress, or nothing left to do**: steps without a target show no button and can still tick; `nextStep` returns `null` and the card is not rendered. → Tasks 1 and 3.
5. **The window opening by itself at a bad moment**: on a phone, with first steps done or dismissed, when the learner already opened or closed the window, or on a second page load. It must not open. It must never steal the focus. → Task 5 (browser).

## File Structure

```
lib/assistant/next-step.ts            nextStep(snapshot)                      (new; scripted.ts uses it)
lib/first-steps/steps.ts              STEPS, StepId, stepAction(id, snapshot)
lib/first-steps/progress.ts           FirstStepsState, reduce, createState, load, save, STORAGE_KEY
lib/first-steps/useFirstSteps.ts      the client hook + restartFirstSteps()
lib/assistant/types.ts                + LearnerSnapshot.firstSteps            (modify)
lib/assistant/snapshot.ts             + optional third argument               (modify)
lib/assistant/scripted.ts             next intent → nextStep; + first-steps intent (modify)
components/assistant/FirstStepsView.tsx, NextStepCard.tsx                     (new)
components/assistant/AssistantWindow.tsx, AssistantLauncher.tsx, AssistantChat.tsx   (modify)
components/molecules/DemoControlsMenu.tsx                                     (modify)
```

---

### Task 1: The next step, in one place

**Files:**
- Create: `lib/assistant/next-step.ts`
- Modify: `lib/assistant/scripted.ts` (the `What should I do next?` intent)
- Test: `lib/assistant/next-step.test.ts`

**Interfaces:**
- Consumes: `LearnerSnapshot` (`lib/assistant/types`).
- Produces: `nextStep(snapshot: LearnerSnapshot): { text: string; actionId: string } | null`.

Order and wording are the ones the intent has today: a deadline whose `when` is `Today` or `Tonight` (`"<title>" is due <when, lower case>. Start there.` → `due:<id>`); else the first course in progress (`Carry on with <title>: "<upNext>" is up next.` or without the second half → `resume:<slug>`); else the first course not started (`Start <title>.` → `resume:<slug>`); else `null`. The intent keeps its own sentence for `null`: `You are up to date: nothing is due and every course is complete.` with `my-learning`.

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, it } from "vitest";
import { nextStep } from "./next-step";
import { answerScripted } from "./scripted";
import { buildSnapshot } from "./snapshot";

const base = buildSnapshot({ completedTopics: new Set(), bookmarks: new Set() }, { kind: "dashboard" });
const calm = { ...base, due: base.due.map((d) => ({ ...d, when: "Sat" })) };

describe("nextStep", () => {
  it("puts a deadline of today first", () => {
    const urgent = base.due.find((d) => d.when === "Today" || d.when === "Tonight")!;
    expect(nextStep(base)).toEqual({ text: expect.stringContaining(urgent.title), actionId: `due:${urgent.id}` });
  });
  it("then the course in progress", () => {
    const current = calm.courses.find((c) => c.status === "in-progress")!;
    expect(nextStep(calm)).toEqual({ text: expect.stringContaining(current.title), actionId: `resume:${current.slug}` });
  });
  it("then a course not started", () => {
    const fresh = calm.courses.find((c) => c.status === "not-started")!;
    const s = { ...calm, courses: calm.courses.filter((c) => c.status !== "in-progress") };
    expect(nextStep(s)).toEqual({ text: `Start ${fresh.title}.`, actionId: `resume:${fresh.slug}` });
  });
  it("is null when nothing is left", () => {
    expect(nextStep({ ...calm, courses: calm.courses.filter((c) => c.status === "completed") })).toBeNull();
  });
  it("is what the assistant answers to the question", () => {
    expect(answerScripted("What should I do next?", base).text).toBe(nextStep(base)!.text);
    expect(answerScripted("What should I do next?", base).actions.map((a) => a.id)).toEqual([nextStep(base)!.actionId]);
  });
});
```

- [ ] **Step 2: Run it.** `./node_modules/.bin/vitest run lib/assistant/next-step.test.ts` → FAIL, module not found.
- [ ] **Step 3: Write `next-step.ts`; make the intent call it.**
- [ ] **Step 4: Run the whole suite.** `./node_modules/.bin/vitest run` → PASS (the 86 existing tests included).
- [ ] **Step 5: Commit** `lib/assistant/next-step.ts lib/assistant/next-step.test.ts lib/assistant/scripted.ts` — `refactor(assistant): the next step is one function`.

---

### Task 2: Steps and their progress

**Files:**
- Create: `lib/first-steps/steps.ts`, `lib/first-steps/progress.ts`
- Test: `lib/first-steps/progress.test.ts`, `lib/first-steps/steps.test.ts`

**Interfaces:**
- Consumes: `PageContext`, `LearnerSnapshot`, `ActionEntry` (`lib/assistant/types`).
- Produces, in `steps.ts`:

```ts
export type StepId = "program" | "course" | "topic" | "complete" | "ask";
export interface Step { id: StepId; label: string; why: string; cta: string }
export const STEPS: Step[];                       // in this order, copy from spec §5
export function stepAction(id: StepId, snapshot: LearnerSnapshot): ActionEntry | "ask" | null;
```

`stepAction`: `program` → the first `program:*` action; `course` → `course:<slug>` of the first course in progress, else the first `course:*`; `topic` and `complete` → `resume:<slug>` of the first course in progress, else the first `resume:*`; `ask` → `"ask"`; anything missing → `null`.

- Produces, in `progress.ts`:

```ts
export const STORAGE_KEY = "sk-first-steps";
export interface FirstStepsState { status: "active" | "done" | "dismissed"; done: StepId[]; baseline: string[]; greeted: boolean }
export type FirstStepsEvent =
  | { type: "visited"; page: PageContext }
  | { type: "completed"; completedTopics: string[] }
  | { type: "asked" } | { type: "greeted" } | { type: "dismissed" }
  | { type: "restarted"; completedTopics: string[] };
export function createState(completedTopics: string[]): FirstStepsState;
export function reduce(state: FirstStepsState, event: FirstStepsEvent): FirstStepsState;
export function load(storage: Pick<Storage, "getItem"> | undefined, completedTopics: string[]): FirstStepsState;
export function save(storage: Pick<Storage, "setItem"> | undefined, state: FirstStepsState): void;
```

Rules: `visited` ticks `program` / `course` / `topic` for page kinds `program` / `course` / `player`; `completed` ticks `complete` when a topic is in `completedTopics` and not in `baseline`; `asked` ticks `ask`. `done` keeps the order of `STEPS`, never repeats. When all five are in, `status` is `"done"`. Unless `status === "active"`, every event but `restarted` returns the same object. `greeted` sets the flag in any status. `reduce` returns the same object when nothing changed (so the hook can skip a save).

- [ ] **Step 1: Write the failing tests**

```ts
// progress.test.ts
import { describe, expect, it } from "vitest";
import { STORAGE_KEY, createState, load, reduce, save } from "./progress";

const start = createState(["t1", "t2"]);
const visit = (kind: "program" | "course", slug = "x") => ({ type: "visited" as const, page: { kind, slug } });
const player = { type: "visited" as const, page: { kind: "player" as const, courseSlug: "c", topicId: "t9" } };

describe("reduce", () => {
  it("starts empty, active, with the baseline", () => {
    expect(start).toEqual({ status: "active", done: [], baseline: ["t1", "t2"], greeted: false });
  });
  it("ticks a visit, once, in the order of the steps", () => {
    let s = reduce(start, player); s = reduce(s, visit("program")); s = reduce(s, player);
    expect(s.done).toEqual(["program", "topic"]);
  });
  it("ignores pages that are no step", () => {
    expect(reduce(start, { type: "visited", page: { kind: "dashboard" } })).toBe(start);
  });
  it("ticks completion only for a topic that is new since the start", () => {
    expect(reduce(start, { type: "completed", completedTopics: ["t1", "t2"] })).toBe(start);
    expect(reduce(start, { type: "completed", completedTopics: ["t1", "t2", "t3"] }).done).toEqual(["complete"]);
  });
  it("is done at five", () => {
    let s = start;
    for (const e of [visit("program"), visit("course"), player, { type: "completed" as const, completedTopics: ["t3"] }, { type: "asked" as const }]) s = reduce(s, e);
    expect(s).toMatchObject({ status: "done", done: ["program", "course", "topic", "complete", "ask"] });
    expect(reduce(s, visit("program"))).toBe(s);
  });
  it("stays dismissed", () => {
    const d = reduce(start, { type: "dismissed" });
    expect(d.status).toBe("dismissed");
    expect(reduce(d, { type: "asked" })).toBe(d);
  });
  it("remembers the greeting in any status", () => {
    expect(reduce(start, { type: "greeted" }).greeted).toBe(true);
    expect(reduce(reduce(start, { type: "dismissed" }), { type: "greeted" }).greeted).toBe(true);
  });
  it("restarts from today's completions", () => {
    const d = reduce(reduce(start, { type: "dismissed" }), { type: "greeted" });
    expect(reduce(d, { type: "restarted", completedTopics: ["t1", "t2", "t3"] })).toEqual(createState(["t1", "t2", "t3"]));
  });
});

describe("storage", () => {
  it("round-trips", () => {
    const mem: Record<string, string> = {};
    const s = reduce(start, visit("program"));
    save({ setItem: (k, v) => void (mem[k] = v) }, s);
    expect(Object.keys(mem)).toEqual([STORAGE_KEY]);
    expect(load({ getItem: (k) => mem[k] ?? null }, ["zzz"])).toEqual(s);
  });
  it.each([
    ["missing", undefined],
    ["empty", { getItem: () => null }],
    ["blocked", { getItem: () => { throw new Error("denied"); } }],
    ["junk", { getItem: () => "{nope" }],
    ["another shape", { getItem: () => JSON.stringify({ status: "active" }) }],
    ["an unknown status", { getItem: () => JSON.stringify({ status: "paused", done: [], baseline: [], greeted: false }) }],
    ["an unknown step", { getItem: () => JSON.stringify({ status: "active", done: ["dance"], baseline: [], greeted: false }) }],
  ])("starts fresh from today's completions when storage is %s", (_n, storage) => {
    expect(load(storage, ["t1"])).toEqual(createState(["t1"]));
  });
  it("does not throw when it cannot save", () => {
    expect(() => save({ setItem: () => { throw new Error("full"); } }, start)).not.toThrow();
  });
});
```

```ts
// steps.test.ts
import { describe, expect, it } from "vitest";
import { STEPS, stepAction } from "./steps";
import { buildSnapshot } from "@/lib/assistant/snapshot";

const snap = buildSnapshot({ completedTopics: new Set(), bookmarks: new Set() }, { kind: "dashboard" });

describe("steps", () => {
  it("are the five of the spec, in order", () => {
    expect(STEPS.map((s) => s.id)).toEqual(["program", "course", "topic", "complete", "ask"]);
    expect(STEPS.map((s) => s.label)).toEqual(["Open your program", "Open a course", "Start a topic", "Complete a topic", "Ask the assistant"]);
  });
  it("point at places the snapshot has", () => {
    const current = snap.courses.find((c) => c.status === "in-progress")!;
    expect(stepAction("program", snap)).toMatchObject({ id: expect.stringMatching(/^program:/) });
    expect(stepAction("course", snap)).toMatchObject({ id: `course:${current.slug}` });
    expect(stepAction("topic", snap)).toMatchObject({ id: `resume:${current.slug}` });
    expect(stepAction("complete", snap)).toMatchObject({ id: `resume:${current.slug}` });
    expect(stepAction("ask", snap)).toBe("ask");
  });
  it("have no target when the snapshot has none", () => {
    const bare = { ...snap, actions: [] };
    expect(stepAction("program", bare)).toBeNull();
    expect(stepAction("topic", bare)).toBeNull();
    expect(stepAction("ask", bare)).toBe("ask");
  });
});
```

- [ ] **Step 2: Run them** → FAIL, modules not found.
- [ ] **Step 3: Write `steps.ts` and `progress.ts`.**
- [ ] **Step 4: Run them** → PASS; `tsc --noEmit` clean.
- [ ] **Step 5: Commit** the four files — `feat(first-steps): five steps and the state that ticks them`.

---

### Task 3: The assistant knows the first steps

**Files:**
- Modify: `lib/assistant/types.ts`, `lib/assistant/snapshot.ts`, `lib/assistant/scripted.ts`
- Test: add to `lib/assistant/snapshot.test.ts` and `lib/assistant/scripted.test.ts`

**Interfaces:**
- Consumes: `FirstStepsState` (Task 2), `STEPS` (Task 2).
- Produces: `LearnerSnapshot.firstSteps?: { done: string[]; left: string[] }` (step labels, present only while `status === "active"`); `buildSnapshot(state, page, firstSteps?: FirstStepsState)`; scripted intent with suggestion `How do I get started?`, keywords `/\b(get started|getting started|first steps?|where do i (start|begin))\b/`, placed first in `INTENTS`.

The intent answers, while active: `You have {n} first steps left:` and the labels still to do, one per line, with the action of the first one that has a target; when `firstSteps` is absent it returns `null` (hands over). `request.ts` needs no change: extra snapshot fields pass.

- [ ] **Step 1: Write the failing tests** (append)

```ts
// snapshot.test.ts
it("carries the first steps only while they are active", () => {
  const fs = { status: "active" as const, done: ["program" as const], baseline: [], greeted: true };
  expect(buildSnapshot(empty, { kind: "dashboard" }, fs).firstSteps).toEqual({
    done: ["Open your program"],
    left: ["Open a course", "Start a topic", "Complete a topic", "Ask the assistant"],
  });
  expect(buildSnapshot(empty, { kind: "dashboard" }, { ...fs, status: "dismissed" }).firstSteps).toBeUndefined();
  expect(buildSnapshot(empty, { kind: "dashboard" }).firstSteps).toBeUndefined();
});
```

```ts
// scripted.test.ts
it("lists the first steps that are left, while there are any", () => {
  const fs = { status: "active" as const, done: ["program" as const], baseline: [], greeted: true };
  const active = buildSnapshot(state, { kind: "dashboard" }, fs);
  const a = answerScripted("How do I get started?", active);
  expect(a.text).toContain("4 first steps left");
  expect(a.text).toContain("Open a course");
  expect(a.text).not.toContain("Open your program");
  expect(a.actions).toHaveLength(1);
  expect(answerScripted("How do I get started?", dash).text).toContain(FALLBACK_LEAD);
});
```

- [ ] **Step 2: Run them** → FAIL. **Step 3: Implement.** **Step 4: Run the whole suite** → PASS.
- [ ] **Step 5: Commit** — `feat(first-steps): the assistant can say which first steps are left`.

---

### Task 4: The hook

**Files:**
- Create: `lib/first-steps/useFirstSteps.ts`

**Interfaces:**
- Consumes: `reduce`, `load`, `save`, `createState`, `FirstStepsState` (Task 2); `PageContext`.
- Produces:

```ts
export const RESTART_EVENT = "sk-first-steps-restart";
/** For the demo menu: fresh state from today's completions, and tell any mounted hook. */
export function restartFirstSteps(completedTopics: string[]): void;
export function useFirstSteps(page: PageContext, completedTopics: Set<string>): {
  state: FirstStepsState | null;      // null until loaded after mount (server and first render agree)
  left: number;                       // 0 unless active
  justFinished: boolean;              // became "done" during this mount: the view shows "You're set."
  asked: () => void; greeted: () => void; dismiss: () => void;
};
```

The hook loads after mount; dispatches `visited` when `page` changes and `completed` when `completedTopics` changes; saves only when `reduce` returns a new object; listens for `RESTART_EVENT` on `window` and reloads. No test file: its logic is `reduce`, tested in Task 2; it is exercised in the browser in Task 5.

- [ ] **Step 1: Write the hook.** **Step 2:** `tsc --noEmit` and `next lint` clean.
- [ ] **Step 3: Commit** — `feat(first-steps): the hook that feeds the steps from the page, the store and the chat`.

---

### Task 5: The view, the card, the badge

**Files:**
- Create: `components/assistant/FirstStepsView.tsx`, `components/assistant/NextStepCard.tsx`
- Modify: `components/assistant/AssistantWindow.tsx`, `AssistantLauncher.tsx`, `AssistantChat.tsx`, `AssistantWindow.stories.tsx`, `components/molecules/DemoControlsMenu.tsx`

**Interfaces:**
- Consumes: `useFirstSteps`, `restartFirstSteps` (Task 4); `STEPS`, `stepAction` (Task 2); `nextStep` (Task 1); `buildSnapshot` third argument (Task 3).
- Produces:

```ts
FirstStepsView(props: {
  firstName: string;
  rows: { id: string; label: string; why: string; cta: string; done: boolean; href?: string; ask?: boolean }[];
  finished: boolean;                         // "You're set." state
  next: { text: string; action: ActionEntry } | null;
  onAsk: () => void;                         // step 5's button and the finished button: switch to the Ask tab
  onSkip: () => void;
}): JSX.Element
NextStepCard(props: { text: string; action: ActionEntry }): JSX.Element
// AssistantWindow gains:
  firstSteps?: FirstStepsViewProps | null;   // null/absent: no tabs, the chat of spec 1
  next?: { text: string; action: ActionEntry } | null;
  takeFocus?: boolean;                       // default true; false when the window opened by itself
// AssistantLauncher gains:
  badge?: number;                            // steps left; 0 or absent: no badge
```

Decisions:

- **Before writing**, read `components/platform/PlatformTabs.tsx` and `PlatformProgressBar.tsx`. Use `PlatformTabs` for the two tabs (its tablist, ids and roving focus) at its smallest size, and `PlatformProgressBar` (`height={4}`, `label="First steps"`) for the progress line. If `PlatformTabs` cannot be made to fit a 380 px window, write a plain two-tab `role="tablist"` in the window and say so in the PR.
- The window keeps which tab is shown in its own state: `First steps` by default while `firstSteps` is present, `Ask` once the learner switches or presses a step-5 / finished button. The input row shows on the `Ask` tab only.
- A step row: 44 px minimum height; a check-in-circle icon (`text-sko-icon-success`) and the word `Done` when done, an empty circle (`border-sko-border-default`) when not; label `sk-text-body-medium-semibold`, why `sk-text-body-small-regular text-sko-text-subtle`; the button is `ButtonLink` secondary sm (with the same `!h-auto min-h-9 py-1.5` as answer buttons) or, for step 5, a `Button` secondary sm.
- `NextStepCard`: `rounded-lg border border-sko-border-subtle bg-sko-bg-faint p-4`, the lead `Next:` in `sk-text-body-small-medium uppercase text-sko-text-subtle`, the text, one `ButtonLink`. Rendered at the top of the chat's empty state, and in the finished state of the view. Not rendered when `next` is null or when `action.href` is the page the learner is on.
- The live region of the window also announces a tick while the window is open: `Done: {label}. {n} steps left.`
- Badge: a 20 px circle top right of the launcher, `bg-sko-bg-error text-sko-text-on-error sk-text-body-small-semibold`, `aria-hidden`; the count is in the launcher's accessible name.
- `AssistantChat`: builds the snapshot with the first-steps state; calls `firstSteps.asked()` inside the `ask` it hands to the window; calls `greeted()` whenever the window opens or closes; the open-once effect (`state?.status === "active" && !state.greeted && !isPhone`, 600 ms timer, cleared on unmount, sets open and `takeFocus={false}` for that opening only).
- `DemoControlsMenu`: a `Restart first steps` button next to `Reset demo`, same classes, calling `restartFirstSteps([...completedTopics])`; `Reset demo` calls it too, after `resetDemo()`.
- Stories: add `FirstSteps` (2 of 5 done), `FirstStepsFinished`, `EmptyWithNext`.

- [ ] **Step 1: Write the two components and the changes.**
- [ ] **Step 2: Static checks.** `tsc --noEmit`, `next lint`, `node scripts/check-tokens.mjs`, `vitest run` → all pass.
- [ ] **Step 3: Verify in the browser** (`preview_start` → `lms-prototype-assistant`; measure with `getBoundingClientRect`). Start each run from `localStorage.removeItem("sk-first-steps")` and `sessionStorage.clear()`, then reload:
  - Desktop 1280 × 800, `/platform/dashboard`: the window opens by itself within a second; `document.activeElement` is not inside it; the launcher's name is `Ask the assistant, 5 first steps left` and its badge reads 5; the view shows `0 of 5 done` and five rows with buttons.
  - Reload: the window does not open by itself again.
  - Follow `Open your program`: the address is a program page; row 1 reads `Done`; badge 4; progress `1 of 5 done`.
  - Visit a course page, then a player topic: rows 2 and 3 done, badge 2.
  - Mark a topic complete (a reading: Mark as Complete): row 4 done.
  - Press `Ask a question`: the `Ask` tab shows; send `What should I do next?`: row 5 done; the view shows `You're set.`; the answer's text equals the `Next:` card's text on a fresh empty chat.
  - Close and reopen: no tabs, no badge, launcher name `Ask the assistant`.
  - Demo menu → `Restart first steps`: badge 5 again, the view is back. `Skip first steps`: no tabs, no badge; a visit to a program page changes nothing.
  - Phone 375 × 812 from a fresh state: the window does not open; the badge shows 5; opening it shows the view full screen.
  - Dark theme screenshot of the view; `read_console_messages` with `onlyErrors` and `pattern: "first-steps|assistant"`: none.
  - Spec 1 regressions: Esc closes and returns focus; a button under an answer navigates; the conversation survives a reload.
- [ ] **Step 4: Fix what the checks found; re-run steps 2 and 3.**
- [ ] **Step 5: Commit** the two new files and the five modified ones — `feat(first-steps): a First steps view, a Next card and a badge on the launcher`.

---

### Task 6: Documents and the pull request

**Files:**
- Modify: `README.md` (the assistant paragraph gains one sentence), `docs/superpowers/specs/2026-10-13-first-steps-design.md` (status line; a last section "What the build changed" if anything departed)

- [ ] **Step 1: Documents.**
- [ ] **Step 2: Full checks** (Global Constraints). Stop the dev server before `next build`; `rm -rf .next` after.
- [ ] **Step 3: Push and open the PR** to `main` (`gh pr list --state open` first). Title: `First steps: five things that tick themselves, and what to do next`. Body: what it does, the five steps and how each ticks, what was verified and how, what was not, the proposals D and E as known limits (the pages still show the sample learner; no Figma yet). Ends with `🤖 Generated with [Claude Code](https://claude.com/claude-code)`. Nelson merges.
- [ ] **Step 4: Tell Nelson** that the Figma block (proposal E) and the ICP Hub line are the next step, once he has seen it running.
