# The Assistant (floating chat) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** One floating chat, on every platform page and in the player, that answers questions about the platform and the learner's courses with buttons that go to the right place: scripted by default, Claude when a key is set.

**Architecture:** A pure module builds a `LearnerSnapshot` from the prototype's existing data and the address of the page. A scripted answerer and an API route (Claude, streamed) both read that snapshot and both pick their buttons from `snapshot.actions` by id. A client hook chooses the mode and holds the conversation; a launcher and a floating window, mounted once in `ResponsiveShell`, render it.

**Tech Stack:** Next 14.2 (app router), React 18, TypeScript 5.6, Tailwind 3.4 (`sko` tokens, `sk-text-*` styles), zustand 4.5, `@anthropic-ai/sdk` (new), vitest (new, dev), Storybook 8.4, pnpm.

**Spec:** `docs/superpowers/specs/2026-10-13-assistant-design.md` (read it first; this plan argues from it).

## Global Constraints

- The assistant never changes state: no store action is called from any assistant file except reading state.
- Every address comes from `lib/platform/hrefs.ts`, `lib/platform/routes.ts` or `lib/courses/outline.ts` (`playerTopicHref`). No URL is built by hand.
- A button's label and address always come from `snapshot.actions`. An id that is not there is dropped.
- `ANTHROPIC_API_KEY` is read on the server only. Model: `process.env.ASSISTANT_MODEL ?? "claude-sonnet-5-5"`.
- Limits: 500 output tokens, question ≤ 500 characters, last 10 messages, 20 questions per hour per IP, 15 s timeout.
- UI copy is English. Captions, verbatim: `AI-generated. Check important details.` and `Prototype: scripted answer.` Launcher name: `Ask the assistant`. Window title: `Assistant`. Status: `Thinking…`.
- Colours and type: `sko-*` Tailwind classes and `sk-text-*` styles only; `node scripts/check-tokens.mjs` must report no new hit (one old hit in `components/molecules/ProgressRail.tsx` is known).
- Targets ≥ 44 px. Shown on `/platform/*` and `/course/*` only.
- `package-lock.json` is never committed; add paths explicitly, never `git add -A`. `pnpm-lock.yaml` is tracked and is committed when a dependency is added.
- The store's `version` (4) does not change. The conversation lives in `sessionStorage` under `sk-assistant-chat`.
- Before writing `app/api/assistant/route.ts`, load the `claude-api` skill for the current SDK streaming call.
- Checks before the PR: `./node_modules/.bin/next build`, `./node_modules/.bin/next lint`, `./node_modules/.bin/tsc --noEmit`, `node scripts/check-tokens.mjs`, `./node_modules/.bin/vitest run`. (`pnpm install` exits 1 over ignored build scripts and still installs.)
- Commits end with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Review Focus

1. **A question the script does not know** (free text, another language, empty after trim): the fixed fallback with the page's suggestions, never an invented answer; an empty question is not sent. → Task 4.
2. **The model names a button that does not exist, or writes no `ACTIONS:` line, or writes it mid-answer**: unknown ids dropped, no line means no buttons, only a final line counts and it never shows in the text. → Task 5.
3. **The API fails, times out or is rate-limited mid-conversation**: that question is answered by the script, marked as scripted; the conversation and the input stay usable. → Task 6.
4. **An address the assistant has no context for** (`/platform/course/unknown-slug`, a topic id that is not in the course, `/platform`): the chat still opens, with the general snapshot and no `topic`; nothing throws. → Tasks 1 and 2.
5. **Storage blocked or holding junk** (`sessionStorage` throws, or `sk-assistant-chat` is not valid JSON): the chat starts empty and works for the visit. → Task 6.

## File Structure

```
lib/assistant/
  types.ts          LearnerSnapshot, PageContext, ActionEntry, Answer, ChatMessage
  page-context.ts   pageContextFromPath, isAssistantPath
  snapshot.ts       buildSnapshot
  knowledge.ts      KNOWLEDGE, knowledgeText
  scripted.ts       answerScripted, suggestionsFor
  model-reply.ts    parseModelReply, buildSystemPrompt        (pure, shared by server and client)
  rate-limit.ts     createRateLimiter                         (pure, in memory)
  useAssistant.ts   the client hook
  *.test.ts         next to each pure module
app/api/assistant/route.ts
components/assistant/
  AssistantChat.tsx       reads the path and the store, owns open/closed, renders the two below
  AssistantLauncher.tsx
  AssistantWindow.tsx     presentational: messages, suggestions, input, status
  AssistantWindow.stories.tsx
components/views/ResponsiveShell.tsx   (modify: mount AssistantChat)
vitest.config.ts · package.json · DEPLOY.md
```

---

### Task 1: Test runner, types and page context

**Files:**
- Create: `vitest.config.ts`, `lib/assistant/types.ts`, `lib/assistant/page-context.ts`
- Modify: `package.json` (devDependency `vitest`, script `"test": "vitest run"`), `pnpm-lock.yaml`
- Test: `lib/assistant/page-context.test.ts`

**Interfaces:**
- Produces, in `types.ts`:

```ts
export type PageContext =
  | { kind: "dashboard" } | { kind: "my-learning" } | { kind: "platform" }
  | { kind: "program"; slug: string } | { kind: "course"; slug: string }
  | { kind: "player"; courseSlug: string; topicId: string };
export interface ActionEntry { id: string; label: string; href: string }
export interface LearnerSnapshot {
  learner: { firstName: string; role: string };
  page: PageContext;
  programs: { slug: string; title: string; percent: number; coursesLine: string; upNext?: string; href?: string }[];
  courses: { slug: string; title: string; status: "not-started" | "in-progress" | "completed";
             percent: number; upNext?: string; playerHref?: string; href?: string }[];
  due: { id: string; title: string; meta: string; when: string; href: string }[];
  topic?: { id: string; title: string; type: string; module: string; course: string;
            completed: boolean; completesByHand: boolean; takeaways: string[] };
  actions: ActionEntry[];
}
export interface Answer { text: string; actions: ActionEntry[]; source: "script" | "model" }
export interface ChatMessage { id: string; role: "user" | "assistant"; text: string;
                               actions?: ActionEntry[]; source?: "script" | "model" }
```

- Produces, in `page-context.ts`: `pageContextFromPath(pathname: string): PageContext` and `isAssistantPath(pathname: string): boolean`.

`{ kind: "platform" }` is the general context for any other `/platform/*` address (certificate pages, `/platform`). `vitest.config.ts` resolves the `@/` alias to the repo root and uses the `node` environment.

- [ ] **Step 1: Add vitest.** `pnpm add -D vitest`; add the `test` script and `vitest.config.ts`.

- [ ] **Step 2: Write the failing test**

```ts
import { describe, expect, it } from "vitest";
import { isAssistantPath, pageContextFromPath } from "./page-context";

describe("pageContextFromPath", () => {
  it.each([
    ["/platform/dashboard", { kind: "dashboard" }],
    ["/platform/my-learning", { kind: "my-learning" }],
    ["/platform/program/ai-driven-digital-marketing", { kind: "program", slug: "ai-driven-digital-marketing" }],
    ["/platform/course/ux-research-and-design-thinking", { kind: "course", slug: "ux-research-and-design-thinking" }],
    ["/course/six-sigma/topic/m3-t1", { kind: "player", courseSlug: "six-sigma", topicId: "m3-t1" }],
    ["/course/six-sigma/topic/m3-t1/notes", { kind: "player", courseSlug: "six-sigma", topicId: "m3-t1" }],
    ["/platform/certificate/six-sigma", { kind: "platform" }],
    ["/platform", { kind: "platform" }],
  ])("%s", (path, expected) => expect(pageContextFromPath(path)).toEqual(expected));
});

describe("isAssistantPath", () => {
  it("is on for platform and player addresses", () => {
    expect(isAssistantPath("/platform/dashboard")).toBe(true);
    expect(isAssistantPath("/course/six-sigma/topic/m3-t1")).toBe(true);
  });
  it("is off elsewhere", () => {
    expect(isAssistantPath("/lab")).toBe(false);
    expect(isAssistantPath("/partner/ibm")).toBe(false);
    expect(isAssistantPath("/")).toBe(false);
  });
});
```

- [ ] **Step 3: Run it.** `./node_modules/.bin/vitest run lib/assistant/page-context.test.ts` → FAIL, module not found.
- [ ] **Step 4: Write `types.ts` and `page-context.ts`.**
- [ ] **Step 5: Run it.** Same command → PASS. `./node_modules/.bin/tsc --noEmit` → clean.
- [ ] **Step 6: Commit** `package.json pnpm-lock.yaml vitest.config.ts lib/assistant/types.ts lib/assistant/page-context.ts lib/assistant/page-context.test.ts` — `chore(assistant): vitest, the snapshot types and the page context`.

---

### Task 2: The learner snapshot

**Files:**
- Create: `lib/assistant/snapshot.ts`
- Test: `lib/assistant/snapshot.test.ts`

**Interfaces:**
- Consumes: Task 1 types. From the repo: `myLearningCourses`, `myLearningPrograms` (`lib/platform/my-learning`), `dashboardDue` (`lib/platform/dashboard`), `platformUser` (`lib/platform/user`), `getTopic`, `getCourseBySlug`, `coursesBySlug` (`lib/data`), `completesByHand`, `getArticle` (`lib/content`), `getIssuedCertificate` (`lib/platform/catalog`), `certificatePageHref` (`lib/platform/hrefs`), `DASHBOARD_HREF`, `MY_LEARNING_HREF`, `MY_LEARNING_PROGRAMS_HREF` (`lib/platform/routes`).
- Produces: `buildSnapshot(state: { completedTopics: Set<string>; bookmarks: Set<string> }, page: PageContext): LearnerSnapshot`.

Decisions the signature does not make:

- Courses and programs are read from `my-learning.ts`, so the assistant says what My Learning shows. `status`: `progressPct === null` → `not-started`, `100` → `completed`, else `in-progress`; `percent` is `progressPct ?? 0`. `slug` is the card's `id`; `href` is `detailHref`; `playerHref` is `href`.
- `topic` is set only when `page.kind === "player"` **and** `coursesBySlug[page.courseSlug]` exists **and** `getTopic(page.topicId, thatCourse)` finds it. Otherwise it is left out. `takeaways` come from `getArticle(topic).takeaways`.
- `actions`, with these ids and labels:

| id | label | href |
|---|---|---|
| `dashboard` | `Open the Dashboard` | `DASHBOARD_HREF` |
| `my-learning` | `Open My Learning` | `MY_LEARNING_HREF` |
| `programs` | `See my programs` | `MY_LEARNING_PROGRAMS_HREF` |
| `course:<slug>` | `Open <title>` | the course's `href` (only when it has one) |
| `resume:<slug>` | `Resume <title>` / `Start <title>` | `playerHref` (in-progress / not-started, when it has one) |
| `certificate:<slug>` | `See the certificate for <title>` | `certificatePageHref(slug)` (only when `getIssuedCertificate(slug)` returns one) |
| `program:<slug>` | `Open <title>` | the program's `href` (only when it has one) |
| `due:<id>` | `Open <title>` | the due item's `href` |

- Header comment: Dashboard figures are fixed sample data and disagree with the program page in places; the snapshot repeats each source and reconciles nothing. In the product the server builds this from the learner's session.

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, it } from "vitest";
import { buildSnapshot } from "./snapshot";
import { dashboardDue } from "@/lib/platform/dashboard";
import { myLearningCourses, myLearningPrograms } from "@/lib/platform/my-learning";
import { DEFAULT_COURSE_SLUG } from "@/lib/data";
import { DEFAULT_TOPIC_ID } from "@/lib/courses/outline";

const empty = { completedTopics: new Set<string>(), bookmarks: new Set<string>() };

describe("buildSnapshot", () => {
  it("lists what My Learning and the Dashboard list", () => {
    const s = buildSnapshot(empty, { kind: "dashboard" });
    expect(s.courses).toHaveLength(myLearningCourses.length);
    expect(s.programs).toHaveLength(myLearningPrograms.length);
    expect(s.due.map((d) => d.id)).toEqual(dashboardDue.map((d) => d.id));
    expect(s.topic).toBeUndefined();
  });
  it("derives status from progress", () => {
    const s = buildSnapshot(empty, { kind: "my-learning" });
    for (const c of myLearningCourses) {
      const got = s.courses.find((x) => x.slug === c.id)!;
      expect(got.status).toBe(c.progressPct === null ? "not-started" : c.progressPct === 100 ? "completed" : "in-progress");
    }
  });
  it("gives every action a unique id and an internal address", () => {
    const { actions } = buildSnapshot(empty, { kind: "dashboard" });
    expect(new Set(actions.map((a) => a.id)).size).toBe(actions.length);
    for (const a of actions) expect(a.href.startsWith("/")).toBe(true);
    expect(actions.map((a) => a.id)).toEqual(expect.arrayContaining(["dashboard", "my-learning", `due:${dashboardDue[0].id}`]));
  });
  it("adds the topic in the player, with its completion", () => {
    const page = { kind: "player" as const, courseSlug: DEFAULT_COURSE_SLUG, topicId: DEFAULT_TOPIC_ID };
    expect(buildSnapshot(empty, page).topic).toMatchObject({ id: DEFAULT_TOPIC_ID, completed: false });
    expect(buildSnapshot({ ...empty, completedTopics: new Set([DEFAULT_TOPIC_ID]) }, page).topic?.completed).toBe(true);
  });
  it("leaves the topic out for an address it does not know", () => {
    expect(buildSnapshot(empty, { kind: "player", courseSlug: "no-such-course", topicId: "x" }).topic).toBeUndefined();
    expect(buildSnapshot(empty, { kind: "player", courseSlug: DEFAULT_COURSE_SLUG, topicId: "no-such-topic" }).topic).toBeUndefined();
    expect(() => buildSnapshot(empty, { kind: "course", slug: "no-such-course" })).not.toThrow();
  });
});
```

- [ ] **Step 2: Run it.** `./node_modules/.bin/vitest run lib/assistant/snapshot.test.ts` → FAIL, module not found. If an import of a data module fails under vitest (a `.json` or CSS import), fix the vitest config, not the data module.
- [ ] **Step 3: Write `buildSnapshot`.**
- [ ] **Step 4: Run it.** → PASS.
- [ ] **Step 5: Commit** `lib/assistant/snapshot.ts lib/assistant/snapshot.test.ts` — `feat(assistant): the learner snapshot, built from what the pages show`.

---

### Task 3: Platform knowledge

**Files:**
- Create: `lib/assistant/knowledge.ts`
- Test: `lib/assistant/knowledge.test.ts`

**Interfaces:**
- Produces: `interface KnowledgeEntry { id: string; question: string; answer: string; source: string }`, `KNOWLEDGE: KnowledgeEntry[]`, `getKnowledge(id: string): KnowledgeEntry`, `knowledgeText(): string` (one block, `Q:` / `A:` pairs, for the prompt).

Entries, with these ids (scripted intents use them): `completion`, `completion-by-hand`, `certificate`, `program-certificate`, `saved`, `notes`, `lab`, `duration`, `navigation`, `progress`, `due-dates`, `quiz-attempts`, `status-badges`, `open-response`, `live-sessions`, `support`. Each `answer` is two or three plain sentences, true of the prototype today. Sources to write them from, in the docs folder next to the redesign repo (`SkillUp LMS Discovery (1)/`): `00-decisions/001`, `004`, `006`, `009`; `LMS-HANDOFF/platform-navigation-flow.md`; `LMS-HANDOFF/lab-third-party-platforms.md` (§4: opened is never completed; Mark as Complete, and the question on Next). Where a source is silent, describe what the prototype screen does and put `source: "prototype"`. `support` says the assistant does not know and points to the Services section. The file header lists the decisions it mirrors and says it goes stale when one changes.

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, it } from "vitest";
import { KNOWLEDGE, getKnowledge, knowledgeText } from "./knowledge";

const IDS = ["completion", "completion-by-hand", "certificate", "program-certificate", "saved", "notes", "lab",
  "duration", "navigation", "progress", "due-dates", "quiz-attempts", "status-badges", "open-response",
  "live-sessions", "support"];

describe("knowledge", () => {
  it("has every entry the script relies on, once", () => {
    expect(KNOWLEDGE.map((k) => k.id).sort()).toEqual([...IDS].sort());
  });
  it("keeps answers short and sourced", () => {
    for (const k of KNOWLEDGE) {
      expect(k.answer.length).toBeGreaterThan(40);
      expect(k.answer.length).toBeLessThan(420);
      expect(k.source).not.toBe("");
    }
  });
  it("throws on an id that does not exist", () => expect(() => getKnowledge("nope")).toThrow());
  it("renders one block for the prompt", () => {
    const text = knowledgeText();
    for (const k of KNOWLEDGE) expect(text).toContain(k.answer);
  });
});
```

- [ ] **Step 2: Run it** → FAIL. **Step 3: Write the file.** **Step 4: Run it** → PASS.
- [ ] **Step 5: Commit** `lib/assistant/knowledge.ts lib/assistant/knowledge.test.ts` — `feat(assistant): the platform's rules, one entry per decision`.

---

### Task 4: Scripted answers and suggestions

**Files:**
- Create: `lib/assistant/scripted.ts`
- Test: `lib/assistant/scripted.test.ts`

**Interfaces:**
- Consumes: `LearnerSnapshot`, `Answer` (Task 1); `getKnowledge` (Task 3).
- Produces: `answerScripted(question: string, snapshot: LearnerSnapshot): Answer` (always `source: "script"`), `suggestionsFor(snapshot: LearnerSnapshot): string[]` (exactly four), `FALLBACK_LEAD: string`.

Intents (spec §5.4). A question matches by exact suggestion text first, then by the first intent whose keywords it contains, case-insensitive, in this order:

| Intent | Suggestion text | Keywords | Answer |
|---|---|---|---|
| `summary` | `Summarise this topic` | summar, takeaway, recap | the topic's takeaways as a list; without a topic → fallback |
| `due` | `What is due this week?` | due, deadline, assignment | one line per due item (title, when); actions `due:<id>`; none due → says so, action `dashboard` |
| `next` | `What should I do next?` | next, what should, what now | first due item with `when` "Today" or "Tonight", else the first in-progress course, else the first not-started course; one action |
| `resume` | `Where did I stop?` | stop, resume, continue, left off | first in-progress course and its `upNext`; action `resume:<slug>` |
| `progress` | `How far am I in my program?` | progress, how far, percent | each program's `percent` and `coursesLine`; actions `program:<slug>` |
| `certificate` | `How do I get my certificate?` | certificate | `getKnowledge("certificate")`; actions: every `certificate:<slug>` |
| `completion` | `How do I complete this topic?` | complete, mark as | in the player with `topic.completesByHand` → `completion-by-hand`, else `completion` |
| `courses` | `Which courses am I enrolled in?` | enrol, enroll, my courses, which courses | titles with status; action `my-learning` |
| `saved` | `Where are my saved topics?` | saved, bookmark | `saved` |
| `notes` | `How do notes work?` | note | `notes` |
| `lab` | `Why is my lab not complete?` | lab | `lab` |
| `help` | `What can you do?` | help, what can you | lists the page's suggestions |

`suggestionsFor`: in the player with a topic → `Summarise this topic`, `How do I complete this topic?`, `What is due this week?`, `What can you do?`; on a program page → `How far am I in my program?`, `What should I do next?`, `How do I get my certificate?`, `What is due this week?`; everywhere else → `What is due this week?`, `Where did I stop?`, `What should I do next?`, `How do I get my certificate?`.

Fallback: `FALLBACK_LEAD = "This prototype answers a fixed set of questions. Try one of these:"` followed by the page's suggestions, no actions. Actions are looked up in `snapshot.actions` by id; one that is missing is left out.

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, it } from "vitest";
import { FALLBACK_LEAD, answerScripted, suggestionsFor } from "./scripted";
import { buildSnapshot } from "./snapshot";
import { getKnowledge } from "./knowledge";
import { dashboardDue } from "@/lib/platform/dashboard";
import { DEFAULT_COURSE_SLUG } from "@/lib/data";
import { DEFAULT_TOPIC_ID } from "@/lib/courses/outline";

const state = { completedTopics: new Set<string>(), bookmarks: new Set<string>() };
const dash = buildSnapshot(state, { kind: "dashboard" });
const player = buildSnapshot(state, { kind: "player", courseSlug: DEFAULT_COURSE_SLUG, topicId: DEFAULT_TOPIC_ID });

describe("answerScripted", () => {
  it("lists every due item with its button", () => {
    const a = answerScripted("What is due this week?", dash);
    for (const d of dashboardDue) expect(a.text).toContain(d.title);
    expect(a.actions.map((x) => x.id)).toEqual(dashboardDue.map((d) => `due:${d.id}`));
    expect(a.source).toBe("script");
  });
  it("matches by keyword, whatever the case", () => {
    expect(answerScripted("any DEADLINES coming?", dash).text).toBe(answerScripted("What is due this week?", dash).text);
  });
  it("resumes the course in progress", () => {
    const a = answerScripted("Where did I stop?", dash);
    const inProgress = dash.courses.find((c) => c.status === "in-progress")!;
    expect(a.text).toContain(inProgress.title);
    expect(a.actions[0].id).toBe(`resume:${inProgress.slug}`);
  });
  it("answers the certificate from the knowledge", () => {
    expect(answerScripted("How do I get my certificate?", dash).text).toContain(getKnowledge("certificate").answer);
  });
  it("summarises only where there is a topic", () => {
    expect(answerScripted("Summarise this topic", player).text).toContain(player.topic!.takeaways[0]);
    expect(answerScripted("Summarise this topic", dash).text).toContain(FALLBACK_LEAD);
  });
  it("only ever returns buttons that are in the snapshot", () => {
    const known = new Set(dash.actions.map((a) => a.id));
    for (const q of suggestionsFor(dash)) for (const a of answerScripted(q, dash).actions) expect(known.has(a.id)).toBe(true);
  });
  it.each(["", "   ", "Qual é a capital de Portugal?", "asdf qwer"])("falls back on %j", (q) => {
    const a = answerScripted(q, dash);
    expect(a.text).toContain(FALLBACK_LEAD);
    expect(a.actions).toEqual([]);
  });
});

describe("suggestionsFor", () => {
  it("gives four, each one answered by the script", () => {
    for (const snap of [dash, player]) {
      const s = suggestionsFor(snap);
      expect(s).toHaveLength(4);
      for (const q of s) expect(answerScripted(q, snap).text).not.toContain(FALLBACK_LEAD);
    }
  });
  it("is about the topic in the player", () => expect(suggestionsFor(player)[0]).toBe("Summarise this topic"));
});
```

- [ ] **Step 2: Run it** → FAIL. **Step 3: Write `scripted.ts`.** **Step 4: Run it** → PASS.
- [ ] **Step 5: Commit** `lib/assistant/scripted.ts lib/assistant/scripted.test.ts` — `feat(assistant): twelve scripted answers and the suggestions for each page`.

---

### Task 5: The model route

**Files:**
- Create: `lib/assistant/model-reply.ts`, `lib/assistant/rate-limit.ts`, `app/api/assistant/route.ts`
- Modify: `package.json`, `pnpm-lock.yaml` (dependency `@anthropic-ai/sdk`)
- Test: `lib/assistant/model-reply.test.ts`, `lib/assistant/rate-limit.test.ts`

**Interfaces:**
- Consumes: `LearnerSnapshot`, `ActionEntry`, `Answer` (Task 1); `knowledgeText` (Task 3).
- Produces:
  - `buildSystemPrompt(snapshot: LearnerSnapshot): string`
  - `parseModelReply(raw: string, actions: ActionEntry[]): Answer` (`source: "model"`)
  - `visibleText(partial: string): string`: the streamed text so far without a trailing `ACTIONS:` line or a trailing fragment of one, for rendering while the stream is open
  - `createRateLimiter(opts: { limit: number; windowMs: number; now?: () => number }): (key: string) => boolean` (true = allowed)
  - `GET /api/assistant` → `200 { "mode": "model" | "script" }`
  - `POST /api/assistant` body `{ messages: { role: "user" | "assistant"; text: string }[]; snapshot: LearnerSnapshot }` → `200 text/plain` stream of the model's raw reply; `400` bad body or question > 500 characters; `429` over the limit; `503` no key.

Decisions:

- `buildSystemPrompt` = role and rules + `knowledgeText()` + the snapshot as JSON without `actions` + the action list as `id — label` lines. Rules, in the prompt: answer only from what is given here; when the answer is not here say you do not know and suggest the Services section; at most 90 words; plain English, no markdown tables or headings; never say you did, changed, saved or submitted anything; if a button helps, end with one last line `ACTIONS: id, id` using only ids from the list, at most three; otherwise write no such line.
- `parseModelReply`: only a **last** non-empty line matching `/^ACTIONS:\s*(.*)$/` counts. Ids are split on commas, trimmed, deduplicated, capped at three, and looked up in `actions`; unknown ones are dropped. The line is removed from `text`; `text` is trimmed.
- Route: `export const runtime = "nodejs"`. Keeps only the last 10 messages; rejects when the last one is not a user message or is empty after trim. One module-level limiter (`limit: 20`, `windowMs: 3_600_000`), keyed on the first address in `x-forwarded-for`, else `"local"`. `max_tokens: 500`; aborts at 15 s. Streams text deltas as they arrive. Header comment: the snapshot comes from the browser because the prototype's progress lives in local storage; in the product the server builds it from the session, and a client-sent snapshot must not be trusted. The limiter is per serverless instance: the real ceiling is the spend limit on the key.

- [ ] **Step 1: Write the failing tests**

```ts
// model-reply.test.ts
import { describe, expect, it } from "vitest";
import { buildSystemPrompt, parseModelReply, visibleText } from "./model-reply";
import { buildSnapshot } from "./snapshot";
import { knowledgeText } from "./knowledge";

const actions = [
  { id: "dashboard", label: "Open the Dashboard", href: "/platform/dashboard" },
  { id: "my-learning", label: "Open My Learning", href: "/platform/my-learning" },
];

describe("parseModelReply", () => {
  it("turns the last line into buttons and hides it", () => {
    const a = parseModelReply("Two things are due.\nACTIONS: dashboard, my-learning", actions);
    expect(a).toEqual({ text: "Two things are due.", actions, source: "model" });
  });
  it("drops ids that are not in the snapshot", () => {
    expect(parseModelReply("Here.\nACTIONS: dashboard, /evil, settings", actions).actions).toEqual([actions[0]]);
  });
  it("has no buttons without the line", () => {
    expect(parseModelReply("Just text.", actions)).toEqual({ text: "Just text.", actions: [], source: "model" });
  });
  it("ignores the marker anywhere but the last line", () => {
    const a = parseModelReply("ACTIONS: dashboard\nand then more text.", actions);
    expect(a.actions).toEqual([]);
    expect(a.text).toContain("and then more text.");
  });
  it("caps at three and removes repeats", () => {
    const many = [...actions, { id: "c", label: "C", href: "/c" }, { id: "d", label: "D", href: "/d" }];
    expect(parseModelReply("x\nACTIONS: dashboard, dashboard, my-learning, c, d", many).actions.map((a) => a.id))
      .toEqual(["dashboard", "my-learning", "c"]);
  });
  it("copes with an empty reply", () => expect(parseModelReply("", actions).text).toBe(""));
});

describe("visibleText", () => {
  it.each([
    ["Two things.\nACTIONS: dash", "Two things."],
    ["Two things.\nACT", "Two things."],
    ["Two things.\nA", "Two things."],
    ["Two things.\nAnd a third", "Two things.\nAnd a third"],
    ["Two things.", "Two things."],
  ])("%j", (partial, shown) => expect(visibleText(partial)).toBe(shown));
});

describe("buildSystemPrompt", () => {
  it("carries the knowledge, the snapshot and the action ids", () => {
    const snap = buildSnapshot({ completedTopics: new Set(), bookmarks: new Set() }, { kind: "dashboard" });
    const p = buildSystemPrompt(snap);
    expect(p).toContain(knowledgeText());
    expect(p).toContain(snap.courses[0].title);
    for (const a of snap.actions) expect(p).toContain(a.id);
    expect(p).toContain("ACTIONS:");
  });
});
```

```ts
// rate-limit.test.ts
import { describe, expect, it } from "vitest";
import { createRateLimiter } from "./rate-limit";

describe("createRateLimiter", () => {
  it("allows the limit, refuses the next, and forgets after the window", () => {
    let t = 0;
    const allow = createRateLimiter({ limit: 2, windowMs: 1000, now: () => t });
    expect([allow("a"), allow("a"), allow("a")]).toEqual([true, true, false]);
    expect(allow("b")).toBe(true);
    t = 1001;
    expect(allow("a")).toBe(true);
  });
});
```

- [ ] **Step 2: Run them** → FAIL.
- [ ] **Step 3: Write `model-reply.ts` and `rate-limit.ts`.** **Step 4: Run them** → PASS.
- [ ] **Step 5: Add the SDK and write the route.** `pnpm add @anthropic-ai/sdk`; load the `claude-api` skill and use its streaming call for the installed SDK version.
- [ ] **Step 6: Check the route by hand** with the dev server running (`preview_start`, entry `lms-prototype-scratch` in `.claude/launch.json`, pointed at this clone):
  - no key: `curl -s localhost:3000/api/assistant` → `{"mode":"script"}`; a `POST` → `503`.
  - `curl -s -X POST localhost:3000/api/assistant -H 'content-type: application/json' -d '{"messages":[],"snapshot":{}}'` → `400`.
  - with a key (only if Nelson supplies one in `.env.local`, which is git-ignored: check `.gitignore` first): `GET` → `{"mode":"model"}`, a `POST` with a real snapshot streams text. Without a key this check is reported as not run.
- [ ] **Step 7: Commit** `package.json pnpm-lock.yaml lib/assistant/model-reply.ts lib/assistant/model-reply.test.ts lib/assistant/rate-limit.ts lib/assistant/rate-limit.test.ts app/api/assistant/route.ts` — `feat(assistant): the model route, with buttons picked by id from the snapshot`.

---

### Task 6: The conversation hook

**Files:**
- Create: `lib/assistant/conversation.ts` (pure), `lib/assistant/useAssistant.ts`
- Test: `lib/assistant/conversation.test.ts`

**Interfaces:**
- Consumes: `answerScripted`, `suggestionsFor` (Task 4); `parseModelReply`, `visibleText` (Task 5); `ChatMessage`, `LearnerSnapshot`, `Answer` (Task 1).
- Produces, in `conversation.ts`:
  - `STORAGE_KEY = "sk-assistant-chat"`
  - `loadMessages(storage: Pick<Storage, "getItem"> | undefined): ChatMessage[]`: `[]` when storage is missing, throws, or holds anything that is not an array of well-formed messages
  - `saveMessages(storage: Pick<Storage, "setItem"> | undefined, messages: ChatMessage[]): void`: never throws
  - `resolveAnswer(opts: { question: string; snapshot: LearnerSnapshot; mode: "script" | "model"; askModel: (onDelta: (shown: string) => void) => Promise<string> }): Promise<Answer>`: script mode → `answerScripted`; model mode → `parseModelReply(await askModel(...), snapshot.actions)`; if `askModel` rejects, or the parsed text is empty → `answerScripted`.
- Produces, in `useAssistant.ts`:

```ts
export function useAssistant(snapshot: LearnerSnapshot): {
  mode: "script" | "model";           // "script" until GET /api/assistant says otherwise, and if it fails
  messages: ChatMessage[];
  streaming: string | null;           // visibleText of the reply in flight, model mode only
  status: "idle" | "answering";
  suggestions: string[];
  ask: (question: string) => void;    // ignores an empty question, one over 500 characters is cut to 500, and a call while answering
  clear: () => void;
};
```

The hook reads `sessionStorage` after mount (so the server and the first client render agree), fetches the mode once per page load, posts the last 10 messages, reads the stream with `visibleText` for `streaming`, and aborts the request on unmount.

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, it, vi } from "vitest";
import { STORAGE_KEY, loadMessages, resolveAnswer, saveMessages } from "./conversation";
import { buildSnapshot } from "./snapshot";
import { answerScripted } from "./scripted";

const snapshot = buildSnapshot({ completedTopics: new Set(), bookmarks: new Set() }, { kind: "dashboard" });
const q = "What is due this week?";

describe("resolveAnswer", () => {
  it("uses the script in script mode and never calls the model", async () => {
    const askModel = vi.fn();
    expect(await resolveAnswer({ question: q, snapshot, mode: "script", askModel })).toEqual(answerScripted(q, snapshot));
    expect(askModel).not.toHaveBeenCalled();
  });
  it("uses the model's reply in model mode", async () => {
    const a = await resolveAnswer({ question: q, snapshot, mode: "model", askModel: async () => "Two items.\nACTIONS: dashboard" });
    expect(a).toMatchObject({ text: "Two items.", source: "model" });
    expect(a.actions.map((x) => x.id)).toEqual(["dashboard"]);
  });
  it.each([
    ["the request fails", async () => { throw new Error("503"); }],
    ["the reply is empty", async () => "   "],
  ])("falls back to the script when %s", async (_name, askModel) => {
    expect(await resolveAnswer({ question: q, snapshot, mode: "model", askModel })).toEqual(answerScripted(q, snapshot));
  });
});

describe("storage", () => {
  const msg = { id: "1", role: "user" as const, text: "hi" };
  it("round-trips", () => {
    const mem: Record<string, string> = {};
    saveMessages({ setItem: (k, v) => void (mem[k] = v) }, [msg]);
    expect(loadMessages({ getItem: (k) => mem[k] ?? null })).toEqual([msg]);
    expect(Object.keys(mem)).toEqual([STORAGE_KEY]);
  });
  it.each([
    ["missing", undefined],
    ["blocked", { getItem: () => { throw new Error("denied"); } }],
    ["junk", { getItem: () => "{not json" }],
    ["the wrong shape", { getItem: () => JSON.stringify({ a: 1 }) }],
    ["a bad message", { getItem: () => JSON.stringify([{ id: 1, role: "robot" }]) }],
  ])("starts empty when storage is %s", (_name, storage) => expect(loadMessages(storage)).toEqual([]));
  it("does not throw when it cannot save", () => {
    expect(() => saveMessages({ setItem: () => { throw new Error("full"); } }, [msg])).not.toThrow();
  });
});
```

- [ ] **Step 2: Run it** → FAIL. **Step 3: Write `conversation.ts`, then `useAssistant.ts` on top of it.** **Step 4: Run it** → PASS; `tsc --noEmit` clean.
- [ ] **Step 5: Commit** `lib/assistant/conversation.ts lib/assistant/conversation.test.ts lib/assistant/useAssistant.ts` — `feat(assistant): the conversation, kept for the tab, falling back to the script`.

---

### Task 7: The floating chat

**Files:**
- Create: `components/assistant/AssistantLauncher.tsx`, `components/assistant/AssistantWindow.tsx`, `components/assistant/AssistantChat.tsx`, `components/assistant/AssistantWindow.stories.tsx`
- Modify: `components/views/ResponsiveShell.tsx` (render `<AssistantChat />` after `{children}`, inside the framed column at line ~68, so the device preview contains it)

**Interfaces:**
- Consumes: `useAssistant` (Task 6); `buildSnapshot` (Task 2); `pageContextFromPath`, `isAssistantPath` (Task 1); `useLmsStore` (`completedTopics`, `bookmarks`, `reduceMotion`); `usePathname`; `Icon` (`lib/icons`), `cn` (`lib/utils`), the DS `Button` atom.
- Produces:

```ts
AssistantLauncher(props: { open: boolean; onToggle: () => void; aboveFooter: boolean }): JSX.Element
AssistantWindow(props: {
  messages: ChatMessage[]; streaming: string | null; status: "idle" | "answering";
  suggestions: string[]; mode: "script" | "model"; firstName: string;
  onAsk: (q: string) => void; onClose: () => void; modal: boolean;
}): JSX.Element
AssistantChat(): JSX.Element | null     // null when !isAssistantPath(pathname)
```

Decisions (spec §5.7):

- **Before writing**, read `components/organisms/AIPanel.tsx` (header, input and chip classes to reuse), `components/organisms/Toast.tsx` (its `z-[70]`) and one dialog in the repo for the focus-trap and Esc pattern already in use. Reuse that pattern for the mobile sheet; do not write a second one.
- Launcher: 56 px round, `bg-sko-bg-primary`, icon `text-sko-text-on-primary`, `fixed`, `right-6 bottom-6` (`right-4 bottom-4` below 768 px), `z-[60]`. `aria-label="Ask the assistant"`, `aria-expanded`, `aria-controls` the window. With `aboveFooter` (player pages) the bottom offset is the footer nav's height + 16 px: measure the rendered `TopicFooterNav` in the browser and use that value; do not guess it.
- Window: `fixed`, right-aligned with the launcher, 16 px above it, `w-[380px]`, `h-[min(600px,calc(100dvh-120px))]`, `rounded-xl border border-sko-border-subtle bg-sko-bg-page shadow-lg`, `z-[60]`. Below 768 px: `inset-0`, no radius, `modal`. `role="dialog"`, `aria-label="Assistant"`, `aria-modal` only when modal.
- Message list: `role="log"`, `aria-live="off"` (a separate `sr-only` `aria-live="polite"` region announces `Thinking…`, then the finished answer once). The list scrolls to the newest message.
- Empty state: `Hi {firstName}. Ask me about the platform or your courses.` and the four suggestions as chips (the chip classes of `AIPanel`).
- An assistant message: text (`whitespace-pre-line`), then its actions as `next/link` rendered with the DS Button secondary sm classes, then the caption: model → `AI-generated. Check important details.`; script → `Prototype: scripted answer.` in the dev-note style (find the Footnote/dev-note class already used in the repo for "Dev Notes" text and reuse it).
- Input: a single-line field with a visible Send button (44 px), `maxLength={500}`, Enter sends, disabled while `status === "answering"`. Placeholder: `Ask about the platform or your courses…`.
- Open → focus the input. Close (button, Esc, or the launcher) → focus the launcher. Following a button keeps the window open.
- Open/closed state lives in `AssistantChat` and is kept in `sessionStorage` (`sk-assistant-open`), read after mount.
- Motion: the repo's `sk-animate-fade` on open; none when `reduceMotion`.
- Stories: `Empty`, `Answering` (with `streaming`), `AnswerWithButtons`, `ScriptedNote`, `Mobile` (modal).

- [ ] **Step 1: Write the three components and the stories.**
- [ ] **Step 2: Mount in `ResponsiveShell`.**
- [ ] **Step 3: Static checks.** `./node_modules/.bin/tsc --noEmit`, `./node_modules/.bin/next lint`, `node scripts/check-tokens.mjs` (no new hit), `./node_modules/.bin/vitest run` → all pass.
- [ ] **Step 4: Verify in the browser** (`preview_start` → `lms-prototype-scratch`; geometry by `getBoundingClientRect`, not by eye). Each line is a check with its expected result:
  - `/platform/dashboard`, `/platform/my-learning`, `/platform/program/ai-driven-digital-marketing`, `/platform/course/ux-research-and-design-thinking`: launcher present, 56×56, 24 px from the right and bottom edges.
  - A player topic: launcher's bottom edge is ≥ 16 px above the footer nav's top edge; the Next button is not covered (`document.elementFromPoint` at Next's centre returns Next).
  - `/lab`: no launcher.
  - Click the launcher: window opens, the input has focus. Click `What is due this week?`: an answer with one button per due item and `Prototype: scripted answer.` Click a button: the address changes, the window is still open with the conversation.
  - In the player: the first suggestion is `Summarise this topic` and its answer lists takeaways.
  - Type `asdf`: the fallback, no buttons. Esc: window closes, focus on the launcher. Reload: the conversation is still there.
  - Mobile preset (375×812), reload: the window covers the viewport; Tab stays inside it.
  - Dark theme: screenshot, text readable on its ground. `read_console_messages` with `onlyErrors`: none.
  - A toast and a dialog (trigger Mark as Complete → Next on a manual topic) both render above the launcher.
- [ ] **Step 5: Fix what the checks found; re-run steps 3 and 4.**
- [ ] **Step 6: Commit** the four new files and `components/views/ResponsiveShell.tsx` — `feat(assistant): a floating chat on every platform page and in the player`.

---

### Task 8: Documents and the pull request

**Files:**
- Modify: `DEPLOY.md`, `README.md` (one line under what the prototype shows), `docs/superpowers/specs/2026-10-13-assistant-design.md` (only if the build departed from it: record the departure)
- Outside this repo, in `SkillUp LMS Discovery (1)/00-decisions/008-ai-panel-in-player.md`: add one dated line under **Decision**: `13 Oct 2026: widened, not reversed. One assistant covers the platform and the learner's courses as a floating chat; in the player it adds the topic context. See the prototype spec docs/superpowers/specs/2026-10-13-assistant-design.md.`

- [ ] **Step 1: `DEPLOY.md`.** A section "The assistant": the two variables (`ANTHROPIC_API_KEY`, optional `ASSISTANT_MODEL`, default `claude-sonnet-5-5`), that without the key the chat answers from its script, that the per-IP limit is per serverless instance, and that a spend limit must be set on the key in the Anthropic console before the key is added to a public deployment.
- [ ] **Step 2: Full checks.** `./node_modules/.bin/next build`, `next lint`, `tsc --noEmit`, `node scripts/check-tokens.mjs`, `vitest run` → all pass (token lint: only the known `ProgressRail` hit).
- [ ] **Step 3: Commit, check for a parallel PR, push, open the PR.** `gh pr list -R nvjeronimo/skillup-lms-prototype --state open` first; then push the branch and open a PR to `main` with a narrative title (`One assistant, in a floating chat, that knows the platform and the learner's courses`). The body lists: what it does, the two modes, what was verified and how, what was not run (model mode, if no key was available), and the open points (docked `AIPanel` in the player; Dashboard sample figures). Ends with `🤖 Generated with [Claude Code](https://claude.com/claude-code)`. Nelson merges.
- [ ] **Step 4: Add the 008 line** and tell Nelson the ICP Hub needs its line once the PR is merged.
