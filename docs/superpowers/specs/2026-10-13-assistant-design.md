# The assistant: one AI that knows the platform and the learner's courses

Date: 13 Oct 2026 · Status: draft for Nelson's review · Scope: prototype only (`skillup-lms-prototype`)

Spec 1 of 2. Spec 2 (first steps: the *Get started* checklist and *Next step*) is written after
this one is built, and reuses the learner snapshot defined here.

## 1. What it is for

A learner can ask one assistant anything about the platform (how completion works, where the
certificate is, what a badge means) and about their own learning (what is due, where they
stopped, how far they are in a program), from any page, and get a short answer with a button
that takes them to the right place.

Success, in the prototype:

- On Dashboard, My Learning, a program page, a course page and in the player, the same
  assistant opens from the top bar and answers.
- "What is due this week?", "Where did I stop?" and "How do I get my certificate?" give answers
  that match what the pages show, in both modes (script and model).
- An answer that points somewhere carries a button that goes there.
- The public demo works with no API key and costs nothing.

## 2. Decisions taken (Nelson, 13 Oct 2026)

| # | Decision |
|---|---|
| 1 | **Hybrid.** Scripted answers by default; a real model (Claude) only when an API key is configured. |
| 2 | **One assistant.** The same assistant on platform pages and in the player. In the player it is the existing AI Panel and it adds the current topic to what it knows. |
| 3 | **Answers and routes, never acts.** Answers carry links and buttons. The assistant never changes state: it does not mark complete, submit, save, enrol. |

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
        AssistantPanel (platform) · AIPanel Ask/Chat (player)
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
}
type PageContext =
  | { kind: "dashboard" } | { kind: "my-learning" }
  | { kind: "program"; slug: string } | { kind: "course"; slug: string }
  | { kind: "player"; courseSlug: string; topicId: string };

interface Answer { text: string; actions: AnswerAction[]; source: "script" | "model" }
interface AnswerAction { label: string; href: string }   // internal hrefs only
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
- Buttons: the model is given the list of hrefs present in the snapshot and returns the ones it
  wants as structured output. **The server drops any href that is not in the snapshot**, so the
  model cannot invent a route.
- Model: `ASSISTANT_MODEL`, default `claude-sonnet-5-5` (my choice: quick enough for chat and
  cheaper than Opus for short answers over a small context; one variable to change).
- Limits: 500 output tokens, question ≤ 500 characters, last 10 messages only, and a per-IP
  counter (20 questions per hour). The counter lives in memory, so on Vercel it is best effort:
  each serverless instance counts on its own. The real ceiling is a spend limit set on the API
  key in the Anthropic console; DEPLOY.md will say so.
- Failure: any error, timeout (15 s) or rate limit makes the client answer that question with
  `answerScripted` and show the script note. The learner never sees a broken panel.

In the prototype the snapshot is built in the browser and posted, because the progress lives in
local storage. In the product the server builds it from the learner's session; a client-sent
snapshot would let a learner feed the model anything. This is written as a dev note in the
route's header.

### 5.6 `lib/assistant/useAssistant.ts`

Client hook: fetches the mode once, holds `messages`, exposes `ask(question)`, `status`
(`idle | answering | error`) and `suggestions` for the current page. The conversation is kept in
session storage so it survives navigation and ends with the tab; it is not added to the
persisted store (no store version bump).

### 5.7 UI

**Entry.** A Sparkles utility button, label "Ask the assistant", in `PlatformTopbar` (new) and
`CoursePlayerTopbar` (the existing `showAi`). 44 px target. Independent of the open sidebar vs
top bar question.

**Platform pages: `components/assistant/AssistantPanel.tsx`.** Right-hand panel, 360 px, same
header, tokens and text styles as `AIPanel`; full-screen sheet below the tablet breakpoint. One
conversation, no mode tabs (Key Takeaways and Related belong to a topic). Empty state: a
one-line greeting and four suggestions for the page. It is a non-modal complementary region on
desktop (the page stays usable) and a modal dialog on mobile.

**Player: `AIPanel`.** Keeps its four tabs. Ask and Chat use `useAssistant` with the topic in
the snapshot: Ask shows one question and one answer, Chat keeps the thread. Key Takeaways and
Related stay as they are (sample content), out of scope.

**An answer.** Text, then its buttons (DS Button, secondary, sm), then a caption: "AI-generated.
Check important details." In script mode the caption reads "Prototype: scripted answer." in the
Footnote style used for dev notes. While answering: a "Thinking…" status announced through
`aria-live="polite"`; streamed text is announced once, when complete.

**Accessibility.** Focus moves to the input on open and returns to the Sparkles button on close;
Esc closes; the message list is a `log` region; buttons are real links; reduced motion removes
the slide-in.

## 6. Out of scope

Figma screens · the assistant acting on data · proactive suggestions (phase 2 in ADR 008) ·
real content for Key Takeaways and Related · voice · conversation history across sessions ·
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
- In the browser: the panel on all five page kinds, desktop and mobile, light and dark; script
  mode with no key; model mode with a key on a local run; a forced API error falls back to the
  script.
- Storybook: `AssistantPanel` (empty, answering, answer with buttons, script note, error).

## 9. Delivery

One PR to `main` on a feature branch, squash-merged by Nelson. `package-lock.json` stays out.
`DEPLOY.md` gains the two environment variables and the spend-limit note. The ICP Hub gets a
line once it is merged.
