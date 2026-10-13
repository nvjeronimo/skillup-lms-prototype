# The assistant: one AI that knows the platform and the learner's courses

Date: 13 Oct 2026 · Status: approved by Nelson on 13 Oct 2026, with the floating chat (decision 4) · Scope: prototype only (`skillup-lms-prototype`)

Spec 1 of 2. Spec 2 (first steps: the *Get started* checklist and *Next step*) is written after
this one is built, and reuses the learner snapshot defined here.

## 1. What it is for

A learner can ask one assistant anything about the platform (how completion works, where the
certificate is, what a badge means) and about their own learning (what is due, where they
stopped, how far they are in a program), from any page, and get a short answer with a button
that takes them to the right place.

Success, in the prototype:

- On Dashboard, My Learning, a program page, a course page and in the player, the same
  assistant opens from its floating launcher and answers.
- "What is due this week?", "Where did I stop?" and "How do I get my certificate?" give answers
  that match what the pages show, in both modes (script and model).
- An answer that points somewhere carries a button that goes there.
- The public demo works with no API key and costs nothing.

## 2. Decisions taken (Nelson, 13 Oct 2026)

| # | Decision |
|---|---|
| 1 | **Hybrid.** Scripted answers by default; a real model (Claude) only when an API key is configured. |
| 2 | **One assistant.** The same assistant on platform pages and in the player. In the player it adds the current topic to what it knows. |
| 3 | **Answers and routes, never acts.** Answers carry links and buttons. The assistant never changes state: it does not mark complete, submit, save, enrol. |
| 4 | **A floating chat** (at spec review). A launcher in the bottom corner opens a floating chat window, on platform pages and in the player alike. It replaces the docked right-hand panel of the first draft. The first-steps assistant of spec 2 is a floating chat too. |

Consequence of decision 4, decided by Nelson at plan approval: the docked `AIPanel` (Key
Takeaways, Ask, Chat, Related) is **removed** from the prototype and replaced by the floating
chat, together with the unwired `showAi` button of the player's top bar. Key Takeaways and
Related have no place in the prototype any more; the topic's takeaways are what "Summarise
this topic" answers with.

Decision 2 widens ADR 008 (*AI Panel built into the player*) and does not reverse it. 008
rejected a standalone assistant because it would lose the topic context; here the topic context
is kept in the player and the platform scope is added around it. One line is added to
`00-decisions/008-ai-panel-in-player.md` to record this.

## 3. What exists today

- `components/organisms/AIPanel.tsx`: the DS `LMS / AI Panel`, four modes (Key Takeaways, Ask,
  Chat, Related), fixed sample text, inputs that do nothing. **Mounted nowhere** except Storybook.
- `CoursePlayerTopbar` has `showAi` / `onAi` (a Sparkles utility button), not wired.
  `PlatformTopbar` has no AI button.
- No API routes, no server code, no test runner. Data is static modules (`lib/courses`,
  `lib/programs`, `lib/platform/*`) plus `lib/store.ts` (zustand, persisted in local storage as
  `sk-lms-demo`, version 4).

## 4. Approach

One module builds a **learner snapshot**; everything else reads it.

```
lib/platform/*, lib/courses, lib/programs, lib/store      (existing data)
                │
     lib/assistant/snapshot.ts ── buildSnapshot(storeState, page) → LearnerSnapshot
                │
     ┌──────────┴───────────┐
 scripted.ts             app/api/assistant/route.ts
 (intents → Answer)      (snapshot + knowledge → Claude → Answer, streamed)
     └──────────┬───────────┘
        lib/assistant/useAssistant.ts   (picks the mode, holds the conversation)
                │
        AssistantChat: launcher + floating window, mounted once for every page
```

Rejected: tool calling (more round trips and code for data that fits in one prompt) and
embeddings search (far beyond what the prototype's data needs).

## 5. Units

### 5.1 `lib/assistant/types.ts`

```ts
interface LearnerSnapshot {
  learner: { firstName: string; role: string };
  page: PageContext;                       // where the assistant was opened
  programs: { slug; title; percent; coursesDone; coursesTotal; upNext?: { title; href } ; href }[];
  courses:  { slug; title; program?: string; status: "not-started" | "in-progress" | "completed";
              percent; resume?: { topicTitle; href }; certificateHref?; href }[];
  due:      { title; course; when; href }[];             // from lib/platform/dashboard
  topic?:   { id; title; type; module; course; completed: boolean; transcriptExcerpt?: string };
  actions:  ActionEntry[];                               // every place an answer may point to
}
interface ActionEntry { id: string; label: string; href: string }
type PageContext =
  | { kind: "dashboard" } | { kind: "my-learning" }
  | { kind: "program"; slug: string } | { kind: "course"; slug: string }
  | { kind: "player"; courseSlug: string; topicId: string };

interface Answer { text: string; actions: AnswerAction[]; source: "script" | "model" }
type AnswerAction = ActionEntry;                         // always taken from snapshot.actions
```

### 5.2 `lib/assistant/snapshot.ts`

`buildSnapshot(state, page)`: pure function, no React. Reads the registries and the store's
completion, resume and bookmark state. Every `href` comes from `lib/platform/hrefs.ts` and
`routes.ts`; nothing builds a URL by hand. `topic` is filled only for `page.kind === "player"`.

Known limit, stated in the code: Dashboard figures are fixed sample data and already disagree
with the program page in places (noted on 9 Oct). The snapshot reports what each source says and
does not reconcile them.

### 5.3 `lib/assistant/knowledge.ts`

The platform's rules as short plain-English entries, each with the decision it comes from:
completion of manual topics (Mark as Complete, the dialog on Next), durations ("approx." on
readings, decision 004), bookmarks (009), notes (001), certificates, navigation (title → course
page, button → player), labs on partner platforms (opened is not completed), status badges.
Exported both as data (for the script) and as one text block (for the model's prompt).
About 20 entries. It is hand-written and will go stale if a decision changes without it;
the file's header says which decisions it mirrors.

### 5.4 `lib/assistant/scripted.ts`

`answerScripted(question, snapshot): Answer`. Twelve intents, matched first by exact suggestion
text, then by keywords:

| Intent | Example | Answer built from |
|---|---|---|
| due | What is due this week? | `snapshot.due`, button per item |
| resume | Where did I stop? | in-progress course + resume topic |
| next | What should I do next? | due within 48h, else resume, else next course (same order spec 2 will use) |
| progress | How far am I in the program? | program percent and courses done |
| certificate | How do I get my certificate? | knowledge + certificate button if one is issued |
| completion | How do I complete a topic? | knowledge |
| courses | Which courses am I enrolled in? | course list with status |
| saved | Where are my saved topics? | knowledge + count |
| notes | How do notes work? | knowledge |
| lab | Why is my lab not complete? | knowledge |
| topic-summary (player) | Summarise this topic | the topic's existing key takeaways |
| help | What can you do? | the list of suggestions |

Anything else returns one fixed fallback: it says the demo answers a fixed set of questions and
lists the suggestions for the current page. It never invents an answer.

### 5.5 `app/api/assistant/route.ts`

- `GET` → `{ mode: "model" | "script" }`, true only when `ANTHROPIC_API_KEY` is set. The key
  never reaches the browser.
- `POST { messages, snapshot }` → a streamed answer. System prompt = role and rules + the
  knowledge block + the snapshot as JSON. Rules in the prompt: answer only from what is given;
  say so when it does not know; short answers; plain language; never claim to have done anything.
- Buttons: the model is given `snapshot.actions` and ends its reply with one line,
  `ACTIONS: <id>, <id>`. The line is removed from the text and each id is looked up in
  `snapshot.actions`; **an id that is not there is dropped**, and the label and the address
  always come from the snapshot, so the model can neither invent a route nor word a button.
- Model: `ASSISTANT_MODEL`, default `claude-sonnet-5-5` (my choice: quick enough for chat and
  cheaper than Opus for short answers over a small context; one variable to change).
- Limits: 1,500 output tokens at low effort (see the note under §10), question ≤ 500 characters, last 10 messages only, and a per-IP
  counter (20 questions per hour). The counter lives in memory, so on Vercel it is best effort:
  each serverless instance counts on its own. The real ceiling is a spend limit set on the API
  key in the Anthropic console; DEPLOY.md will say so.
- Failure: any error, timeout (15 s) or rate limit makes the client answer that question with
  `answerScripted` and show the script note. The learner never sees a broken chat.

In the prototype the snapshot is built in the browser and posted, because the progress lives in
local storage. In the product the server builds it from the learner's session; a client-sent
snapshot would let a learner feed the model anything. This is written as a dev note in the
route's header.

### 5.6 `lib/assistant/useAssistant.ts`

Client hook: fetches the mode once, holds `messages`, exposes `ask(question)`, `status`
(`idle | answering | error`) and `suggestions` for the current page. The conversation is kept in
session storage so it survives navigation and ends with the tab; it is not added to the
persisted store (no store version bump).

### 5.7 UI: a floating chat

**Where it is mounted.** Once, in `ResponsiveShell`, inside the framed column, so it is on
every page and the device preview contains it. It shows on `/platform/*` and `/course/*` only
(not `/lab`, not `/partner`). The page context comes from the address
(`pageContextFromPath`), so no page needs an edit. The top bars do not change:
`CoursePlayerTopbar`'s `showAi` stays off.

**Launcher: `components/assistant/AssistantLauncher.tsx`.** A round 56 px button with the
Sparkles icon, fixed 24 px from the bottom and right edges (16 px on mobile), accessible name
"Ask the assistant", `aria-expanded`. In the player it sits above the topic footer nav, never
over Next. It stays in place while the window is open and closes it.

**Window: `components/assistant/AssistantWindow.tsx`.** A floating card above the launcher:
380 px wide, up to 600 px tall and never taller than the viewport minus 120 px, 12 px radius,
border and shadow, DS tokens and text styles as in `AIPanel`. Header (Sparkles, "Assistant",
close), the conversation, the input. Empty state: a one-line greeting and four suggestions for
the page. Below 768 px it is a full-screen sheet. It is a non-modal dialog on desktop (the page
stays usable behind it) and a modal one on mobile. It sits under toasts and dialogs.

**In the player** it is the same window; the topic is in the snapshot and the suggestions are
about the topic ("Summarise this topic", "How do I complete this topic?").

**An answer.** Text, then its buttons (DS Button, secondary, sm), then a caption: "AI-generated.
Check important details." In script mode the caption reads "Prototype: scripted answer." in the
Footnote style used for dev notes. While answering: a "Thinking…" status announced through
`aria-live="polite"`; streamed text is announced once, when complete. Following a button
navigates and leaves the window open, with its conversation.

**Accessibility.** Focus moves to the input on open and returns to the launcher on close; Esc
closes; the message list is a `log` region; buttons are real links; reduced motion removes the
open animation; the launcher is the last stop in the tab order of the page.

## 6. Out of scope

Figma screens beyond the chat component itself · the assistant acting on data · proactive suggestions (phase 2 in ADR 008) ·
voice · conversation history across sessions ·
languages other than English · `/lab` · the first-steps checklist (spec 2).

## 7. Open edX

Nothing in Open edX Sumac serves this. The snapshot's fields map to APIs that do exist (Learner
Home for enrolments and resume, the Dates API for due items, course blocks for the topic), which
is what a vendor would need to build the server-side snapshot. To raise with the vendor:
whether an assistant service is in scope at all, and where the model runs.

## 8. Checks

- New dev dependency: **vitest**, for the pure modules only (the repo has no test runner today).
  Tests: `buildSnapshot` against the seeded store on each page kind; each scripted intent returns
  the expected text and hrefs; the fallback; the server's href filter drops an unknown route.
- `next build`, `next lint`, `tsc --noEmit`, `lint:tokens`, as for every PR.
- In the browser: the floating chat on all five page kinds, desktop and mobile, light and dark; script
  mode with no key; model mode with a key on a local run; a forced API error falls back to the
  script.
- Storybook: `AssistantWindow` (empty, answering, answer with buttons, script note, error).

## 9. Delivery

One PR to `main` on a feature branch, squash-merged by Nelson. `package-lock.json` stays out.
`DEPLOY.md` gains the two environment variables and the spend-limit note. The ICP Hub gets a
line once it is merged.

## 10. What the build changed

- **Output ceiling 1,500 tokens, not 500.** The default model always thinks, and its thinking
  shares the ceiling with the answer; 500 would cut answers short. The answer is kept short by
  the prompt (90 words) and by `effort: "low"`.
- **A refusal or an empty reply is answered by the script**, like any other failure. The API's
  server-side model fallback is not used.
- **"Start a new conversation"** in the window's header (not in the first design): it empties
  the conversation and brings the suggestions back.
- **The scripted caption uses the small body style.** The prototype has no dev-note text style.
- **Layer:** the chat sits at z 45: above the page and the top bars, under the overlay
  panels (50), the dialogs (60) and the toasts (70).
- **In the device-preview frame** the chat is fixed to the browser viewport, as toasts are.
- **Model mode was not run**: no API key was available during the build. The route was
  checked without a key (`GET` → script, `POST` → 503) and its pure parts are unit-tested.
