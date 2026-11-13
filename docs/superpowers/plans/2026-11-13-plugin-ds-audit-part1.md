# DS audit, part 1 (token health + sync) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** add an Audit tab to the "SkillUp · Publish tokens" Figma plugin, and a usage map in the
prototype repository. Before he publishes the DS library, Nelson sees:
- the token blockers, pending items and warnings;
- the tokens the prototype's code still uses that are gone from Figma.

**Architecture:**
- **The repository computes the Figma → CSS names once.** A shared module `scripts/tokens/names.mjs`
  holds the mapping and `build.mjs` uses it.
- **`scripts/tokens/usage.mjs`** scans the code and writes `tokens/usage.json`, keyed by Figma
  token. Its `--against` mode is the CI guard: the sync PR waits instead of merging.
- **The plugin reads that map** through the GitHub contents API. `code.js` runs the audit as a
  pure function over `figma.variables`. `ui.html` renders it in a new tab.

**Tech Stack:**
- Node 22 ESM scripts and vitest, both already in the repository;
- the Figma plugin API (plain JS, no bundler);
- GitHub Actions and the GitHub REST contents/compare API.

**Spec:** `docs/superpowers/specs/2026-11-13-plugin-ds-audit-design.md` (approved by Nelson on
13 Nov 2026).

**Branch:** `feat/plugin-audit-part1`, cut from `docs/plugin-audit-part1-design` so the spec, the
plan and the code go in one PR.

## Global Constraints

- **Figma stays read-only:** the plugin never writes to the Figma file.
- **Network:** `manifest.json` keeps `allowedDomains` = `https://api.github.com` only.
- **Git:**
  - never commit `package-lock.json` or any lockfile;
  - stage explicit paths;
  - every commit ends with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`;
  - PR bodies end with `🤖 Generated with [Claude Code](https://claude.com/claude-code)`;
  - squash-merge, and Nelson merges.
- **No new Figma variables.**
- **Usage map:**
  - the file is `tokens/usage.json`;
  - its format string is `"skillup-token-usage/1"`;
  - each key is `"<Figma collection name>/<Figma variable name>"`;
  - each value is `{ "css": string[], "files": number }`;
  - the top-level fields are `"commit"`, `"dynamic"` and `"unknownCss"`.
- **What the scan covers:**
  - folders `app/`, `components/`, `lib/`, `stories/`;
  - file types `.ts`, `.tsx`, `.css`;
  - `tailwind.config.ts`;
  - the hand-written `tokens/*.css`;
  - **not** `tokens/generated/`, and **not** `stories/figmaTokens.ts` (it reads the JSON directly).
- **Usage rules:**
  - A runtime-built name (`var(--sk-radius-${role})`) counts as a use of every token whose CSS
    name starts with the fixed part.
  - Over-counting use is acceptable. Under-counting is a bug.
- **What blocks publishing:** Publish, the package PR and the download are blocked only by
  `alias-missing` and `mode-missing`.
- **Rename with the same CSS name:** a token used in code whose Figma name changed but whose Web
  code syntax is unchanged is **not** a finding.
- **Variables without Web code syntax:** a warning, never a blocker.
- **Publish status:** `getPublishStatusAsync()` runs under a 10 000 ms total limit. If the limit
  is reached, the pending item reads "not checked" and goes into `notCovered`.
- **Removed token still in use:** a sync PR whose JSON drops a CSS name still used in code is not
  merged, whatever `TOKENS_AUTO_MERGE` says. The job does not fail, and the PR gets a comment.
- **Copy:** plain English, as in the rest of the plugin, with no em dashes in new copy. The
  verdict reads `Ready for developers (tokens)` or `Not ready: N blocker(s)`. The covered line
  always names what was not covered.

## Review Focus

1. **The DS file has a broken alias when the plugin opens.**
   - Expect: the plugin loads, shows the finding, and Publish is disabled with the reason.
   - Pinned in Task 4 (`exportTokens survives a missing alias`).
2. **A Figma rename that keeps the Web code syntax.**
   - Expect: no blocker in the plugin, and the CI guard passes.
   - Pinned in Task 2 (`--against passes a rename that keeps the web name`) and Task 4
     (`rename with same web syntax is not used-gone`).
3. **`usage.json` is missing, returns 404, or is stale.**
   - Expect: "code usage not checked", listed in `notCovered`, never a pass.
   - Pinned in Task 4 (`no usage map means not covered`).
4. **`getPublishStatusAsync()` never resolves on the big file.**
   - Expect: the audit finishes after the limit, with publish status "not checked".
   - Pinned in Task 4 (`publish status timeout`).
5. **A sync PR that changes values but removes nothing.**
   - Expect: it still auto-merges as today.
   - Pinned in Task 2 (`--against with no missing names writes blocked=false`).

---

### Task 1: One Figma → CSS name mapping

**Files:**
- Create: `scripts/tokens/names.mjs`
- Modify: `scripts/tokens/build.mjs` (lines 47–171: `colors`, `radius`, `spacing`, `typography`, `motion` take their CSS names from `names.mjs`)
- Modify: `vitest.config.mts:7`: `include` becomes `["lib/**/*.test.ts", "scripts/**/*.test.mjs", "figma-plugin/**/*.test.mjs"]`
- Test: `scripts/tokens/names.test.mjs`

**Interfaces:**
- Produces: `export function tokenCssNames(data) -> Array<{ figma: string, css: string }>`.
  - `data` has the shape of `tokens/figma/variables.json`.
  - `figma` is `"<collection>/<variable>"`.
  - The function returns one entry per CSS custom property that `build.mjs` declares from a
    variable, with exactly the same rules:
    - colours (collection `1.`, type COLOR): `v.web` stripped of `var()`, or
      `--color-<name, / → ->`;
    - `Radius/*` without `fixed-` → `--sk-radius-<key>`;
    - `Spacing|Container|Layout/*` → `--sk-space-*` / `--sk-container-*` / `--sk-layout-*`;
    - `Type/(size|line-height)/*` → `--sk-type-<a>-<b>`;
    - motion (collection `3.`): `v.web` or `--motion-<name>`.
- Produces: `export function cssNameOf(data) -> Map<string /*figma*/, string[] /*css*/>`, a
  convenience wrapper used by Task 2.

- [ ] **Step 1: Write the failing test**
  - `names.test.mjs` › `every custom property declared in tokens/generated comes from tokenCssNames`.
    - Read `tokens/figma/variables.json` and every `tokens/generated/*.css`.
    - Collect the declared names with `/^\s*(--[a-z0-9-]+):/gm`.
    - Assert that set equals `new Set(tokenCssNames(data).map(e => e.css))`.
    - If the build declares names that do not come from a variable, put them in an explicit
      `NOT_FROM_VARIABLES` array in the test, with a comment on each.
  - `names.test.mjs` › `colour name prefers web syntax`: a fixture variable with
    `web: "var(--color-x)"` gives `--color-x`; with `web: null`, `text/on-inverse` gives
    `--color-text-on-inverse`.
- [ ] **Step 2: Run it**
  - Run: `npx vitest run scripts/tokens/names.test.mjs`
  - Expected: FAIL, "Cannot find module './names.mjs'".
- [ ] **Step 3: Implement `names.mjs` and switch `build.mjs` to it.** The CSS output must not
  change.
- [ ] **Step 4: Verify**
  - `npx vitest run scripts/tokens/names.test.mjs` PASS.
  - `node scripts/tokens/build.mjs --check` prints `tokens/generated matches tokens/figma/variables.json`.
- [ ] **Step 5: Commit**
  ```bash
  git add scripts/tokens/names.mjs scripts/tokens/names.test.mjs scripts/tokens/build.mjs vitest.config.mts
  git commit -m "refactor(tokens): one Figma-to-CSS name mapping shared by the build"
  ```

### Task 2: The usage map and the CI guard script

**Files:**
- Create: `scripts/tokens/usage.mjs`
- Create: `scripts/tokens/usage.test.mjs`
- Create: `scripts/tokens/__fixtures__/usage/`: a mini `variables.json` and a mini code tree
- Create (generated): `tokens/usage.json`
- Modify: `package.json` scripts: `"tokens:usage": "node scripts/tokens/usage.mjs --write"`

**Interfaces:**
- Consumes: `tokenCssNames`, `cssNameOf` (Task 1).
- Produces, all exported from `usage.mjs`:
  - `tailwindMap(configText: string) -> Map<string /*class fragment*/, string /*--css*/>`.
    - The fragment is the nested keys joined with `-`, with `DEFAULT` dropped. Examples:
      `colors.sko["text-default"]` → `sko-text-default`, `borderRadius.card` → `card`.
    - A class uses the fragment when the code holds `-<fragment>` followed by a character that is
      not `[\w-]`.
  - `scanCode(files: Array<{path, text}>, tw: Map) -> { used: Map<string /*css*/, Set<string /*path*/>>, dynamic: string[] /*prefixes*/ }`.
    - It sees `var(--x)`, Tailwind fragments, and `var(--prefix-${…})`, which goes into `dynamic`.
  - `buildUsage(data, scan, commit: string) -> object`, in the shape set in Global Constraints.
    - `files` is the number of distinct paths.
    - A dynamic prefix adds its paths to every CSS name that starts with it.
    - `unknownCss` lists the used names that no token produces and no hand-written
      `tokens/*.css` declares.
  - `missingAgainst(scan, data) -> Array<{ css: string, files: string[] }>`: the CSS names used in
    code (dynamic prefixes included) that `tokenCssNames(data)` no longer produces and no
    hand-written `tokens/*.css` declares.
- CLI:
  - `--write` writes `tokens/usage.json`, with `commit` = `git rev-parse HEAD`.
  - `--check` exits 1 if the file differs from a fresh build, ignoring `commit`.
  - `--against <variables.json> [--report <file.md>]` exits 0 **always**.
    - It appends `blocked=true|false` to `$GITHUB_OUTPUT` when that variable is set.
    - With `--report`, it writes Markdown: a table of token CSS name and files, then the line
      `This pull request waits: merge it after the code no longer uses these tokens.`

- [ ] **Step 1: Write the failing tests** (fixture-based):
  - `var() use is counted`;
  - `tailwind class use is counted` (`text-sko-text-default` → `--color-text-default`);
  - `dynamic var counts every token with the prefix` (`var(--sk-radius-${r})` marks
    `--sk-radius-card` and `--sk-radius-pill`);
  - `hand-written tokens css counts as use` (a fixture `tokens/skin-x.css` using
    `var(--color-bg-page)`);
  - `generated css and figmaTokens.ts are not scanned`;
  - `unknownCss lists a var no token or hand-written file defines`;
  - `--against passes a rename that keeps the web name` (the fixture JSON renames the Figma
    variable and keeps `web`: `missingAgainst` returns `[]`);
  - `--against reports a removed token with its files`;
  - `--against with no missing names writes blocked=false` (run the CLI with
    `GITHUB_OUTPUT` pointing at a temp file).
- [ ] **Step 2: Run them**
  - Run: `npx vitest run scripts/tokens/usage.test.mjs`
  - Expected: FAIL (module missing).
- [ ] **Step 3: Implement `usage.mjs`.** Read `tailwind.config.ts` as text: walk the `theme.extend`
  object literal with a small brace-and-key tokenizer, keeping only string values `"var(--…)"`.
  Do not import TypeScript.
- [ ] **Step 4: Verify**
  - The tests PASS.
  - `node scripts/tokens/usage.mjs --write && node scripts/tokens/usage.mjs --check` exit 0.
  - In `tokens/usage.json`, the entry for `text/default` has `files` > 0.
  - `node scripts/tokens/usage.mjs --against tokens/figma/variables.json` prints 0 missing on
    today's `main`. If it is not 0, stop and report the list: it means the code is already broken
    today.
- [ ] **Step 5: Commit**
  ```bash
  git add scripts/tokens/usage.mjs scripts/tokens/usage.test.mjs scripts/tokens/__fixtures__/usage tokens/usage.json package.json
  git commit -m "feat(tokens): usage map of which Figma tokens the prototype's code uses"
  ```

### Task 3: Workflows: keep the map fresh and hold a sync that removes a used token

**Files:**
- Modify: `.github/workflows/tokens.yml`
- Create: `.github/workflows/token-usage.yml`

**Interfaces:**
- Consumes: the `usage.mjs` CLI (Task 2).

- [ ] **Step 1: Edit `tokens.yml`.**
  - In "Commit the generated CSS to the sync branch", run
    `node scripts/tokens/usage.mjs --write` first and add `tokens/usage.json` to the
    `git add`.
  - Add a step `id: guard`, "Tokens still used in code", before "Merge the Figma sync":
    `node scripts/tokens/usage.mjs --against tokens/figma/variables.json --report guard.md`.
  - Add a step: if `steps.guard.outputs.blocked == 'true'`, run
    `gh pr comment <n> --body-file guard.md`.
  - Change the merge step's `if:` so it also requires `steps.guard.outputs.blocked != 'true'`.
- [ ] **Step 2: Create `token-usage.yml`.**
  - Trigger: `push` to `main`, on paths `app/**`, `components/**`, `lib/**`, `stories/**`,
    `tokens/**`, `tailwind.config.ts`, `scripts/tokens/**`; plus `workflow_dispatch`.
  - Permissions: `contents: write`.
  - Steps:
    - checkout, pnpm, node 22, `pnpm install --frozen-lockfile --ignore-scripts`;
    - `node scripts/tokens/usage.mjs --write`;
    - if `git diff --quiet tokens/usage.json` fails, commit `chore(tokens): usage map` as
      github-actions[bot] and push.
  - Add a header comment on why this job is not the only writer: merges made with
    `github.token` do not trigger it.
- [ ] **Step 3: Validate.** Run `node -e "require('yaml').parse(require('fs').readFileSync(p,'utf8'))"`
  on both files (the `yaml` package is in `node_modules`). Expected: no error.
- [ ] **Step 4: Commit**
  ```bash
  git add .github/workflows/tokens.yml .github/workflows/token-usage.yml
  git commit -m "ci(tokens): refresh the usage map, and hold a Figma sync that drops a token the code still uses"
  ```

### Task 4: `code.js`: the audit as a function, a tolerant export

**Files:**
- Modify: `figma-plugin/code.js`
- Create: `figma-plugin/audit.test.mjs`: loads `code.js` in `node:vm` with a fake `figma`
  global, `__html__ = ""`, and a no-op `figma.showUI`/`ui.postMessage`. It is a new harness:
  the PR 490 one was never committed.

**Interfaces:**
- **`exportTokens()` → `{ ...current shape, problems: Finding[] }`.**
  - A missing alias target no longer throws. It adds an `alias-missing` finding and leaves that
    mode's value `null`.
  - A missing mode value adds `mode-missing`.
- **`async auditTokens(opts) -> Report`**, with these options:
  - `usage` (the parsed `usage.json`, or `null`);
  - `usageFresh: boolean`;
  - `publishStatusTimeoutMs = 10000`;
  - `onProgress(done, total)`;
  - `isCancelled() -> boolean`.
- **`Finding`** = `{ check, collection, name, mode?, text }`. `check` is one of:
  - `alias-missing`, `mode-missing`, `used-gone` (blocker);
  - `unpublished`, `unsent` (pending; `unsent` is added by the UI, Task 5);
  - `no-web`, `unknown-css`, `mode-cap`, `no-description`, `all-scopes` (warning);
  - `unused-primitive` (suggestion).
- **`Report`** = `{ verdict: "ready"|"not-ready", covered: string[], notCovered: string[], blockers, pending, warnings, suggestions, publishBlocked: boolean }`.
  - `publishBlocked` is true when an `alias-missing` or `mode-missing` finding exists.
- **`used-gone` rule.** For each usage entry with `files > 0`, it is not a finding when either:
  - a live variable has the same variable name in the collection with the same number prefix
    (the text before the first space, e.g. `2.`); or
  - a live variable's `codeSyntax.WEB`, stripped of `var()`, is one of the entry's `css`.
- **Messages:**
  - The UI sends `{ type: "audit", usage, usageFresh }`.
  - `code.js` replies with `{ type: "audit-progress", done, total }`, then
    `{ type: "audit-result", report }`.
  - `{ type: "audit-cancel" }` sets the flag that `isCancelled` reads. A cancelled audit returns
    a report with `notCovered: ["cancelled"]`.
- **The `ready` message adds `problems`.**

- [ ] **Step 1: Write the failing tests** in `audit.test.mjs`, with fake collections and
  variables:
  - `exportTokens survives a missing alias`: an alias to an unknown id gives `problems[0].check === "alias-missing"` and no throw.
  - `mode-missing is a publish blocker`: `publishBlocked === true`.
  - `used-gone is a blocker but not a publish blocker`: the usage has `"2. Responsive 📐/Radius/old": {css:["--sk-radius-old"], files: 3}` and no live variable matches.
  - `rename with same web syntax is not used-gone`: the usage key names an old variable, and a live variable has `codeSyntax.WEB = "var(--color-x)"` with `css:["--color-x"]`.
  - `no usage map means not covered`: `usage: null` gives `notCovered` containing `"code usage"` and no `used-gone`. Same with `usageFresh: false`.
  - `publish status timeout`: `getPublishStatusAsync` returns `new Promise(() => {})` and `publishStatusTimeoutMs: 50`. The audit resolves, `notCovered` contains `"library publish status"`, and there is no `unpublished` finding.
  - `no-web is a warning`, `ten modes is a warning (mode-cap)`, `ALL_SCOPES is a warning`, `missing description is a warning`.
  - `verdict ready when no blockers`: `verdict === "ready"` and `covered` includes `"tokens"`.
- [ ] **Step 2: Run them**
  - Run: `npx vitest run figma-plugin/audit.test.mjs`
  - Expected: FAIL (`auditTokens` is not defined).
- [ ] **Step 3: Implement in `code.js`.**
  - Read the variables collection by collection, with `onProgress` after each.
  - Read the publish status with `Promise.race` against one shared timer for the whole batch,
    not one timer per variable.
  - `unused-primitive`: a variable in a `hiddenFromPublishing` collection that no local
    variable aliases.
- [ ] **Step 4: Run the tests.** Expected: PASS.
- [ ] **Step 5: Commit**
  ```bash
  git add figma-plugin/code.js figma-plugin/audit.test.mjs
  git commit -m "feat(plugin): token audit in code.js, and a broken alias no longer stops the plugin"
  ```

### Task 5: `ui.html`: the Audit tab, gating, unauthenticated reads, README

**Files:**
- Modify: `figma-plugin/ui.html`
- Modify: `figma-plugin/README.md`: a new section "Audit before publishing the library"

**Interfaces:**
- Consumes: the messages and `Report` from Task 4, and `tokens/usage.json` (Task 2).

- [ ] **Step 1: Unauthenticated reads.**
  - `api()` sends `Authorization` only when a token is set.
  - `refresh()` reads `variables.json` on `main` even without a token, and only Publish and the
    package PR still need one.
  - A 404 on `usage.json` means `usage = null`.
- [ ] **Step 2: Freshness.**
  - `lastVars` = `GET /commits?path=tokens/figma/variables.json&sha=main&per_page=1`, then
    `[0].sha`.
  - `GET /compare/${lastVars}...${usage.commit}`.
  - `usageFresh = ["identical","ahead"].includes(status)`.
  - Any error means `usageFresh = false`.
- [ ] **Step 3: Tab bar and Audit view.**
  - Add a tab bar **Publish | Audit** above the existing content. The current content is the
    Publish tab.
  - The Audit tab has:
    - the verdict line;
    - the covered / not-covered line;
    - the groups Pending, Blockers, Warnings (folded, with a count) and Suggestions (folded);
    - **Run again** and **Cancel** while it runs;
    - progress `Reading collection N of M`.
  - Add the `unsent` pending line from the existing `diff()` count:
    `N token change(s) not sent to the prototype`.
  - Clicking a finding copies `collection/name` to the clipboard, with a short "Copied" status.
  - The audit runs automatically once, after `ready`.
- [ ] **Step 4: Gating.**
  - If `ready.problems` or the report has `publishBlocked`:
    - Publish, Open the package pull request, and Download are disabled;
    - the status says `Fix the broken token(s) in the Audit tab first: the export would be wrong.`
  - If the report has `used-gone` findings when Publish is pressed, the success line adds:
    `It will wait before merging: <n> token(s) are still used in the prototype's code (see the PR comment).`
- [ ] **Step 5: README.** Add the section: what the audit checks, the three weights, what
  "covered" means, why a sync PR can wait, and how to merge it after the code fix.
- [ ] **Step 6: Verify.**
  - Run `npx vitest run`: all pass, old tests included.
  - Extract the `<script>` text of `ui.html` to a temp file and run `node --check` on it.
    Expected: no syntax error.
  - **Not verifiable here:** the plugin running in Figma desktop. Nelson re-imports the
    manifest and runs it on the DS file, and the session reports this as unverified until he does.
- [ ] **Step 7: Commit, push, open the PR**
  ```bash
  git add figma-plugin/ui.html figma-plugin/README.md
  git commit -m "feat(plugin): Audit tab: token verdict, blockers, pending and warnings before publishing the library"
  git push -u origin feat/plugin-audit-part1
  gh pr create --title "Plugin audit, part 1: token health and sync with the prototype" --body "<summary, spec + plan paths, what was verified, what Nelson must check in Figma>\n\n🤖 Generated with [Claude Code](https://claude.com/claude-code)"
  ```
  Then rebuild the plugin zip for Nelson
  (`…/63e32649…/scratchpad/skillup-publish-tokens-plugin.zip` and `~/Downloads/`). Do not merge.
