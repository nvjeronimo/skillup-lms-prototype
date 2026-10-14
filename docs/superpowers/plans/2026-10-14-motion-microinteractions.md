# Motion & Microinteractions Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give the prototype a token-driven motion system, then use it for surfaces that leave the way they came, a visible completion chain, quiz state onsets and a conversational AI Assistant; document it in Figma, the docs repo and the ICP Hub.

**Architecture:** Plain CSS custom properties (`tokens/motion.css`) exposed as Tailwind theme keys; keyframe classes in `app/globals.css` with a `[data-state="closed"]` exit variant; one presence hook (`useExitTransition`) built on a pure state function. Small pure helpers in `lib/motion/` carry the only logic and are the only unit-tested code (vitest is node-only, `lib/**/*.test.ts`); everything visual is verified in the preview.

**Tech Stack:** Next 14.2, React 18.3, Tailwind 3.4, zustand 4.5, vitest, pnpm. No new dependency.

**Spec:** `SkillUp LMS Discovery (1)/03-design-system/motion-matrix.md` (v2, 14 Oct 2026) + `00-decisions/024-motion-scale.md`.

## Global Constraints

- Token values (verbatim, spec §5.4): durations short2 `100ms`, short3 `150ms`, short4 `200ms`, medium2 `300ms`, long2 `500ms`; easings standard `cubic-bezier(0.4, 0, 0.2, 1)`, standard-decelerate `cubic-bezier(0.2, 0.7, 0.2, 1)`, standard-accelerate `cubic-bezier(0.55, 0, 1, 0.45)`, emphasized `cubic-bezier(0.34, 1.3, 0.64, 1)`, linear `linear`; distances nudge `4px`, enter `8px`, surface `16px`.
- CSS names `--motion-duration-*`, `--motion-easing-*`, `--motion-distance-*`. Tailwind keys `duration-short2…long2`, `ease-standard`, `ease-standard-decelerate`, `ease-standard-accelerate`, `ease-emphasized`, `delay-short2…long2`, `translate-x/y-nudge|enter|surface`.
- R1: no raw `ms`, `cubic-bezier`, Tailwind `duration-<n>` / `delay-<n>` / `ease-in|out|in-out` in `components/`, `app/`, `lib/` `.ts(x)`. Raw values live only in `tokens/motion.css` and keyframe blocks in `app/globals.css`. Stagger offsets are `calc()` of a token (chain: `var(--motion-duration-short2)`; assistant actions: `calc(var(--motion-duration-short2) / 2 * i)`).
- R2: never Tailwind's bare `transition` or `transition-all`; name the property (`transition-colors`, `transition-transform`, `transition-opacity`, `transition-[…]`).
- R8/R10: exits use `standard-accelerate` and are shorter than their entrance; they leave toward where they came from.
- R9: `ease-emphasized` is used by nothing in this block.
- Reduced motion (spec §6): under `@media (prefers-reduced-motion: reduce)` **and** `:root[data-reduce-motion]`: distances → `0px`, medium2 and long2 → `150ms`, every travelling/scaling keyframe class → `sk-fade-in`/`sk-fade-out` at short3, typing dots → static word, progress jumps. Keep the existing `transition-property` guard and spinner pulse.
- No per-word animation of streamed assistant text; no shake anywhere; no confetti.
- Every PR: branch off `main`, squash-merged PR on `nvjeronimo/skillup-lms-prototype` with a narrative title, **never `git add -A`** (pnpm-lock is tracked; never commit `package-lock.json`). Before opening: `./node_modules/.bin/next build`, `./node_modules/.bin/next lint`, `./node_modules/.bin/tsc --noEmit`, `node scripts/check-tokens.mjs`, `pnpm test` all pass. Nelson merges.
- Copy stays as it is on screen today (e.g. "Marked as completed", "Thinking…"); new copy is only "New message" (scroll pill).

## Review Focus

1. **Reopen during exit** — the learner clicks the trigger again while a panel/assistant is still closing: it must reopen at once, not unmount underneath. Pinned by `nextPresence` test `close → open while closing`.
2. **`animationend` never fires** (reduced motion, tab hidden, display:none parent): the surface must still unmount. Pinned by the fallback-timeout test.
3. **Completion replays on navigation** — moving to another topic and back must not redraw the rail check. Pinned by `isFreshCompletion` window test.
4. **Learner scrolled up in the assistant while an answer streams** — must not be yanked to the bottom. Pinned by `isNearEnd` tests + the pill.
5. **Toast replaced while exiting** — a second toast arriving during the first's exit must show the new message, not the old. Pinned by Task 3 step (render keeps last toast only while `open` is false).

---

## PR 1 · Foundation (branch `feat/motion-tokens`)

### Task 1: Motion tokens, Tailwind keys, reduced motion on the variables

**Files:**
- Create: `tokens/motion.css`, `lib/motion/tokens.ts`, `lib/motion/tokens.test.ts`
- Modify: `app/globals.css:1-2` (import), `app/globals.css:76-208` (keyframe + reduced-motion blocks), `tailwind.config.ts:152-154`

**Interfaces:**
- Produces: `MOTION_MS: { short2: 100; short3: 150; short4: 200; medium2: 300; long2: 500 }` (`as const`) from `lib/motion/tokens.ts`, for JS timers only. Tailwind keys from Global Constraints.

- [ ] **Step 1: Write the failing test** `lib/motion/tokens.test.ts`: reads `tokens/motion.css` with `fs`, extracts every `--motion-duration-<name>: <n>ms;` in the `:root` block, and asserts it deep-equals `MOTION_MS`; a second test asserts the CSS has exactly the five easing and three distance names of Global Constraints with their verbatim values.
- [ ] **Step 2: Run** `pnpm test lib/motion` → FAIL (module not found).
- [ ] **Step 3: Create `tokens/motion.css`** with the `:root` block of spec §5.4, then the reduced-motion overrides inside `@media (prefers-reduced-motion: reduce) { :root { … } }` and `:root[data-reduce-motion] { … }` (distances `0px`; medium2 and long2 `150ms`). Create `lib/motion/tokens.ts`. Import the CSS in `globals.css` after `typography.css`.
- [ ] **Step 4: Tailwind** — in `theme.extend`, replace `transitionDuration: {"200": "200ms"}` with the five duration keys (`var(--motion-duration-*)`), and add `transitionDelay` (same five), `transitionTimingFunction` (the four non-linear easings) and `translate` (`nudge`, `enter`, `surface` → `var(--motion-distance-*)`).
- [ ] **Step 5: Re-point the existing keyframe classes** in `globals.css`: `.sk-animate-slide-right/left` → `var(--motion-duration-medium2) var(--motion-easing-standard-decelerate)`, `.sk-animate-fade` → short4 + decelerate; the reduced-motion fade → short3. Raw values stay only in `@keyframes`.
- [ ] **Step 6: Run** `pnpm test lib/motion` → PASS.
- [ ] **Step 7: Commit** `git add tokens/motion.css lib/motion/tokens.ts lib/motion/tokens.test.ts app/globals.css tailwind.config.ts && git commit -m "feat(motion): the motion tokens, as CSS variables and Tailwind keys"`

### Task 2: `raw-motion` lint rule + migrate every hand-typed site

**Files:**
- Modify: `scripts/check-tokens.mjs` (RULES + comment-line skip), and every hit it reports — known today: `components/molecules/ModuleHeader.tsx:71`, `components/atoms/SectionHeader.tsx:36`, `components/views/PlayerShell.tsx:417`, `components/organisms/VideoPlayer.tsx:202,306`, `components/platform/course/ModuleList.tsx:149`, `components/organisms/ContentTabs.tsx:79`, `components/assistant/AssistantLauncher.tsx:45`, `components/molecules/DemoControlsMenu.tsx:305`, `app/lab/training/course/six-sigma/PlanTable.tsx:101`, plus any bare `transition` class.

**Interfaces:** Consumes Task 1's Tailwind keys.

- [ ] **Step 1: Add rule** `{ id: "raw-motion", re: /(?<![\w-])(?:duration|delay)-(?:\d+|\[)|(?<![\w-])ease-(?:in|out|in-out|linear)(?![\w-])|cubic-bezier\(|["'`][^"'`]*\d+m?s\b[^"'`]*["'`]|(?<![\w-])transition(?:-all)?(?=["'`\s])/, msg: "raw motion — use a duration-/ease-/delay- motion token and name the transitioned property" }`, and skip lines whose trimmed text starts with `//`, `*` or `/*` for all rules.
- [ ] **Step 2: Run** `node scripts/check-tokens.mjs` → FAIL listing the sites above (record the count in the PR body; the pre-existing `ProgressRail` raw-type hit is not new).
- [ ] **Step 3: Migrate each hit**: `duration-200` → `duration-short4`, `ease-out` → `ease-standard-decelerate`, chevron `transition-transform` gains `duration-short4 ease-standard`, `transition` → the property it actually animates. If the rule's string-`ms` branch flags non-motion text (a copy string such as "500 ms"), fix the regex, not the copy.
- [ ] **Step 4: Run** `node scripts/check-tokens.mjs` → only the pre-existing `ProgressRail` hit remains.
- [ ] **Step 5: Commit** `git add scripts/check-tokens.mjs <each migrated file> && git commit -m "feat(motion): no raw durations or curves, enforced by the token lint"`

### Task 3: Presence state + `useExitTransition`

**Files:**
- Create: `lib/motion/presence.ts`, `lib/motion/presence.test.ts`, `lib/useExitTransition.ts`

**Interfaces:**
- Produces: `type Presence = "unmounted" | "open" | "closing"`; `nextPresence(p: Presence, e: "open" | "close" | "exited"): Presence`; `useExitTransition(open: boolean, exitMs: number): { mounted: boolean; state: "open" | "closed"; onAnimationEnd: (e: React.AnimationEvent) => void }`.

- [ ] **Step 1: Failing tests** in `presence.test.ts`: `unmounted+open→open`, `open+close→closing`, `closing+exited→unmounted`, `closing+open→open` (reopen during exit), `unmounted+close→unmounted`, `open+exited→open` (a stray animationend from an entrance is ignored).
- [ ] **Step 2: Run** `pnpm test lib/motion/presence` → FAIL.
- [ ] **Step 3: Implement `nextPresence`**, then the hook in `lib/useExitTransition.ts` (`"use client"`): holds a `Presence`, dispatches `open`/`close` on prop change, `onAnimationEnd` dispatches `exited` only when `e.target === e.currentTarget` and state is `closing`, and a fallback `setTimeout(exitMs + 50)` started on `closing` dispatches `exited` (cleared on reopen/unmount). `mounted = presence !== "unmounted"`, `state = presence === "open" ? "open" : "closed"`.
- [ ] **Step 4: Run** `pnpm test` → PASS.
- [ ] **Step 5: Exit keyframes** in `globals.css`: `sk-slide-out-right`, `sk-slide-out-left`, `sk-fade-out`, and the entrance/exit pairs used later — `.sk-animate-pop` (opacity + `scale(.96)` + `translateY(var(--motion-distance-surface))`, short4 decel; closed: reverse, short3 accel), `.sk-animate-rise` (opacity + `translateY(var(--motion-distance-enter))`, short4 decel; closed: short3 accel), `.sk-animate-sheet` (`translateY(100%)`, medium2 decel; closed: short4 accel). Each exit is `[data-state="closed"].<class>` / `[data-state="closed"] > .<class>` with `animation-fill-mode: forwards`; slide-right/left and fade get their closed variants (short4 accel; backdrop fade short4). Add all travelling classes (open and closed) to both reduced-motion lists, swapped for `sk-fade-in`/`sk-fade-out` at short3.
- [ ] **Step 6: Commit** `git add lib/motion/presence.ts lib/motion/presence.test.ts lib/useExitTransition.ts app/globals.css && git commit -m "feat(motion): surfaces can leave — presence state, exit hook and exit keyframes"`
- [ ] **Step 7: PR 1** — run the five checks; verify in the preview (motion on, OS reduced motion, Accessibility switch) that panels, drawer, chevrons and toasts look unchanged; push `feat/motion-tokens`; open "Motion has tokens now, and nothing types a duration by hand". Body: token table, lint count before/after, link to the spec.

---

## PR 2 · Surfaces (branch `feat/motion-surfaces`, after PR 1 merges)

### Task 4: Panels, drawer, modals and toast leave the way they came

**Files:**
- Modify: `components/organisms/OverlayPanel.tsx:46-60`, `components/views/PlayerShell.tsx:~670-690` (mobile drawer), `components/organisms/CompletionQuestionModal.tsx:48`, `CourseCompleteModal.tsx:34`, `NoteEditorModal.tsx:79`, `ReportIssueModal.tsx:53`, `components/platform/course/HostedProgressCard.tsx:110`, `components/organisms/Toast.tsx:73-95`; accordion bodies in `ModuleHeader`, `SectionHeader`, `ModuleList`, `ContentTabs` callers.

**Interfaces:** Consumes `useExitTransition`, `MOTION_MS`, the CSS classes of Task 3.

- [ ] **Step 1: Each `if (!open) return null` becomes** `const { mounted, state, onAnimationEnd } = useExitTransition(open, MOTION_MS.short4); if (!mounted) return null;` (modals: `MOTION_MS.short3`). Root gets `data-state={state}`; the element that animates last gets `onAnimationEnd`; while `state === "closed"` the root also gets `aria-hidden` and `pointer-events-none`. `useDialog` keeps its `open` argument, so focus returns and inert lifts at the **start** of the exit (spec §7.1 amended to say so).
- [ ] **Step 2: Modal dialogs** swap their panel's class to `sk-animate-pop` (`transform-origin: center`); panel and drawer keep slide-right/left.
- [ ] **Step 3: Toast** uses `useExitTransition(!!toast, MOTION_MS.short3)`, keeps the last non-null `toast` in a ref **only while** `toast` is null, and its class becomes `sk-animate-rise` (the `-translate-x-1/2` centring moves to a wrapper so the keyframe transform does not override it).
- [ ] **Step 4: Accordion bodies** — the collapsible region renders always, wrapped in `grid transition-[grid-template-rows] duration-medium2 ease-standard` with `grid-rows-[0fr]`/`grid-rows-[1fr]` and an inner `min-h-0 overflow-hidden`; collapsed content gets `inert` + `aria-hidden` so it is not focusable.
- [ ] **Step 5: Verify in the preview** (route `/course/<slug>/…` player + `/platform/dashboard`): open/close each surface with mouse, Esc and backdrop; reopen during the exit; reduced motion (both switches) shows fades only; keyboard focus lands back on the trigger. Screenshot the panel mid-exit for the PR.
- [ ] **Step 6: Checks + commit + PR** "Panels, dialogs and toasts now leave the way they came".

---

## PR 3 · Completion chain (branch `feat/motion-completion`)

### Task 5: The chain — badge, rail check, ring

**Files:**
- Create: `lib/motion/completion.ts`, `lib/motion/completion.test.ts`
- Modify: `lib/store.ts:82-83, 166, 422-437` (state + `markComplete`), `components/atoms/CompletionStatus.tsx` (Done branch), `components/molecules/TopicRow.tsx:79,104`, `components/molecules/TopicActionBar.tsx:39-46`, `components/molecules/ContentFeedback.tsx` (its completed branch), `components/molecules/OverallProgress.tsx:40-44`, `app/globals.css` (`.sk-draw-check`)

**Interfaces:**
- Produces: store field `lastCompleted: { topicId: string; at: number } | null`, set by `markComplete` (silent or not, so video auto-complete and the Next dialog play it too); `isFreshCompletion(last: { topicId: string; at: number } | null, topicId: string, now: number): boolean` (true when same id and `now - at < 1500`); `CompletionStatus` prop `animate?: boolean`.

- [ ] **Step 1: Failing tests** `completion.test.ts`: same id at +0 and +1499 → true; +1500 → false; other id → false; `null` → false.
- [ ] **Step 2: Run** → FAIL. **Step 3: Implement** `isFreshCompletion`; add `lastCompleted` to the store (initial `null`, not persisted) and set it in `markComplete`. **Step 4: Run** `pnpm test` → PASS.
- [ ] **Step 5: t=0** — the completed badge in `TopicActionBar` / `ContentFeedback` gets `sk-animate-pop` when fresh (no check on the badge: the DS badge is label-only).
- [ ] **Step 6: t=+100** — `CompletionStatus` Done with `animate` renders the check path with `.sk-draw-check` (`stroke-dasharray`/`stroke-dashoffset` from full to 0, short4 decel, `animation-delay: var(--motion-duration-short2)`) and the disc fading in; `TopicRow` passes `animate={isFreshCompletion(lastCompleted, topic.id, Date.now())}`. Reduced motion: the check is shown without the draw.
- [ ] **Step 7: t=+200** — `OverallProgress` circle gets `transition-[stroke-dashoffset] duration-long2 ease-standard-decelerate delay-short4` (CSS transitions only run on change, so first paint does not animate).
- [ ] **Step 8: Announcement** — the existing toast "Marked as complete · {title}" is the one announcement; add none (spec §7.2 amended). Verify the silent path (auto-complete) still sets `lastCompleted` and shows the chain without a toast.
- [ ] **Step 9: Verify in the preview** on a Reading topic (button), a Video topic (scrub past 90%) and Next on an incomplete topic (dialog): the three beats in order, sidebar open and collapsed, phone width (ring in the topbar); navigate away and back: no replay. Record a short screen capture for the PR.
- [ ] **Step 10: Checks + commit + PR** "Completing a topic now shows where it counted".

---

## PR 4 · Quiz (branch `feat/motion-quiz`)

### Task 6: Quiz onsets

**Files:**
- Create: `lib/motion/countUp.ts`, `lib/motion/countUp.test.ts`
- Modify: `components/organisms/QuizCard.tsx` (option rows, check/✕, explanation), `components/views/AssessmentView.tsx:104,510,527` (question swap direction), `components/molecules/QuizNav.tsx` (stepper fill), the results score (find with `grep -rn "score" components/views/AssessmentView.tsx`), `app/globals.css` (`.sk-animate-step-next`, `.sk-animate-step-prev`, `.sk-disclose`)

**Interfaces:**
- Produces: `countUpValue(target: number, elapsedMs: number, durationMs: number): number` (integer, eased with the standard-decelerate curve approximated by `1 - (1 - t)^3`, clamped to `[0, target]`, `target` at `elapsed ≥ duration`); `useCountUp(target: number): number` in the same file's React wrapper `lib/useCountUp.ts` (returns `target` at once under reduced motion: `matchMedia('(prefers-reduced-motion: reduce)')` or `document.documentElement.hasAttribute('data-reduce-motion')`).

- [ ] **Step 1: Failing tests**: `countUpValue(80, 0, 500) === 0`, `(80, 500, 500) === 80`, `(80, 9999, 500) === 80`, monotonic over 0..500 step 50, `(0, 250, 500) === 0`.
- [ ] **Step 2–4:** run FAIL → implement → run PASS.
- [ ] **Step 5: Options** — row border/background `transition-colors duration-short3 ease-standard`; radio dot `scale-0 → scale-100` `transition-transform duration-short3 ease-standard-decelerate`; Correct check uses `.sk-draw-check` (no delay); ✕ uses `sk-animate-fade`. No translate on Incorrect.
- [ ] **Step 6: Explanation** — wrap in `.sk-disclose` (grid rows `0fr → 1fr`, medium2 decel, content opacity) instead of mount/unmount.
- [ ] **Step 7: Question swap** — `AssessmentView` keeps `direction: "next" | "prev"` set by the next/back handlers; the question container gets `key={index}` and `sk-animate-step-next` (from `translateX(var(--motion-distance-enter))`) or `sk-animate-step-prev` (from the negative), short4 standard, opacity 0→1.
- [ ] **Step 7b: Submit** — while submitting, the button keeps its rendered width (`style.minWidth` set from its `offsetWidth` when loading starts) so the spinner does not shrink it.
- [ ] **Step 8: Stepper + results** — QuizNav fill `transition-transform duration-short4 ease-standard` on `scaleX`; results percentage via `useCountUp`, its ring with the Task 5 progress transition.
- [ ] **Step 9: Verify in the preview** on a graded and a practice quiz: select, submit, correct, incorrect, partially correct, show explanation, next/back, results; reduced motion. **Step 10: Checks + commit + PR** "Every quiz state now has an onset, and nothing shakes".

---

## PR 5 · AI Assistant (branch `feat/motion-assistant`)

### Task 7: The conversation lives in the launcher

**Files:**
- Create: `lib/motion/scroll.ts`, `lib/motion/scroll.test.ts`
- Modify: `components/assistant/AssistantLauncher.tsx:44-70`, `components/assistant/AssistantChat.tsx:182-215` (mount/unmount → presence), `components/assistant/AssistantWindow.tsx:113-117, 140-145, 216-282`, `components/assistant/FirstStepsView.tsx` (step check), `app/globals.css` (`.sk-typing`)

**Interfaces:**
- Consumes: `useExitTransition`, `.sk-animate-pop` / `.sk-animate-sheet` / `.sk-animate-rise`, `.sk-draw-check`.
- Produces: `isNearEnd(scrollTop: number, clientHeight: number, scrollHeight: number, slack = 48): boolean`.

- [ ] **Step 1: Failing tests**: at the end → true; 47 px above → true; 49 px above → false; content shorter than the box → true.
- [ ] **Step 2–4:** FAIL → implement → PASS.
- [ ] **Step 5: Launcher** — `transition-[transform,box-shadow] duration-short3 ease-standard hover:scale-[1.04] active:scale-[.96] active:duration-short2`; mark ⇄ ✕ cross-fade + 90° rotate (both icons rendered, `opacity`/`rotate` toggled, short4 standard); badge `sk-animate-pop` keyed on the count. Reduced motion: no scale/rotate (guard already removes transform transitions).
- [ ] **Step 6: Window** — `AssistantChat` uses `useExitTransition(open, …)` (desktop short3, sheet short4); desktop window class `sk-animate-pop` with `transform-origin` at the launcher's corner (`origin-bottom-left` desktop/tablet), phone sheet `sk-animate-sheet`. `refocus` logic unchanged.
- [ ] **Step 7: Messages** — each new message `sk-animate-rise`; the answering bubble is mounted once and keeps its element while `streaming` grows (no key change per chunk); the thinking state renders `.sk-typing` (three dots, opacity keyframes, `animation-delay` `0`, `var(--motion-duration-short3)`, `calc(var(--motion-duration-short3) * 2)`; loop `calc(var(--motion-duration-short3) * 8)`) with a visually hidden "Thinking…"; under reduced motion `.sk-typing` shows the word instead of the dots. Action buttons: `sk-animate-rise` with `style={{ animationDelay: \`calc(var(--motion-duration-short2) / 2 * ${i})\` }}` and `translateY(var(--motion-distance-nudge))`. Suggestion chips fade out (`data-state="closed"` + `sk-fade-out`) when one is sent.
- [ ] **Step 8: Scroll** — replace the unconditional `scrollIntoView` with: if `isNearEnd(...)` before the update → `scrollIntoView({ block: "end", behavior: reduced ? "auto" : "smooth" })`; else show a "New message" pill (`sk-animate-rise`, arrow-down icon, Button sm secondary) above the composer that scrolls to the end and hides; it hides itself when the learner reaches the end.
- [ ] **Step 9: First steps** — a step that ticks renders its check with `.sk-draw-check`.
- [ ] **Step 10: Verify in the preview** (`/platform/dashboard` and a player route, desktop + 375 px, scripted mode — no API key needed): open/close by launcher, Esc and X; reopen during exit; send, thinking, streamed answer, actions; scroll up mid-answer → pill; `?first-steps=restart` to tick a step; reduced motion. **Step 11: Checks + commit + PR** "The assistant now opens from its button and talks like a conversation".

---

## Documentation (docs repo branch `docs/program-page`, Figma, Hub)

### Task 8: Docs follow each PR

**Files:** `03-design-system/motion-matrix.md`, `00-decisions/024-motion-scale.md`, `OPEN-ACTIONS.md`

- [ ] **Step 1:** apply the three amendments decided in this plan to the spec: focus returns at the start of the exit (§7.1), the completion toast is the announcement (§7.2), the t=0 beat is the badge's pop, not a drawn check (§7.2).
- [ ] **Step 2:** after each prototype PR merges, add its link under the matching §7 table; after PR 1, status → "Contract", ADR 024 → `accepted` (only once Nelson confirms Q7).
- [ ] **Step 3:** add to `OPEN-ACTIONS.md`: BR-39 amendment for the BA (spec §6 table); team approval of the 13 motion tokens (Q6).
- [ ] **Step 4:** commit each change by path (never `.impeccable/` or `skillup-lms-redesign/docs/assistant/`), push after `git fetch` + `gh pr list --head docs/program-page`; add to an open PR's body if one exists, else open one to `main`.

### Task 9: Figma — `Motion` collection and documentation frame (DS file)

- [ ] **Step 1: Parallel-sessions check** — `ls -t ~/.claude/projects/-Users-nelsonjeronimo-*skillup-lms-redesign/*.jsonl | head -4`, read the tail of any modified in the last hour, `git log -3`; write only if no other session is mid-write in the DS file. Load the `figma-use` skill before any `use_figma`.
- [ ] **Step 2: Collection** `Motion`, one mode: 5 FLOAT `duration/*` (ms), 3 FLOAT `distance/*` (px), 5 STRING `easing/*` (the cubic-bezier text); each with code syntax `var(--motion-…)` and the spec "Use" text as description; scopes empty (not offered on fills or sizes). Read back all 13. Do not publish (Q6).
- [ ] **Step 3: Documentation frame** on `❖ LMS · IN REVIEW / NOT FOR BUILD`, in the block-template format: the scale table, R1–R10, reduced-motion table, and four storyboards (surface open/close, completion chain t=0/+100/+200, quiz select→correct/incorrect, assistant launcher→window→thinking→answer), each frame built from DS instances with token labels. Screenshot and check.
- [ ] **Step 4: One motion note per touched main component** (Overlay Panel, Toast, Topic Row / Completion Status, Progress Circle, Quiz card, Assistant-Launcher, Assistant-Chat): a description line `Motion: see Motion doc frame <node>` — once per main, never per instance.

### Task 10: ICP Hub — Motion section

- [ ] **Step 1:** `Artifact` read of https://claude.ai/artifact/LYu6uccAohvumsMUPe4sUy, build on the returned file.
- [ ] **Step 2:** add a **Motion** section: scale table, R1–R10 in one line each, the four flows with prototype links (Vercel `lms-prototype-mu.vercel.app` routes), PR status, the Figma frame link, the open items Q2b/Q6/Q7. Republish to the same URL; update the `icp-hub` memory's "last updated" line.
