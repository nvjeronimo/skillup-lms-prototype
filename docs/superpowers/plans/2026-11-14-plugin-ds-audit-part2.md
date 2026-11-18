# DS audit part 2 (bindings and hand-set values) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** The plugin's Audit tab also checks the layers: hand-set values, broken bindings and unused tokens, in the DS and in screens files, with a scope picker.

**Architecture:** All plugin logic stays in `figma-plugin/code.js` (no bundler; `manifest.json` loads one file). Part 2 adds pure helpers (role, exclusions, checks, suggestions), a chunked tree walker, and `auditLayers()`, which the existing `audit` message runs after `auditTokens()` (library role only) and merges into one report. `ui.html` gains the scope picker, the exclusions checklist and a grouped report.

**Tech Stack:** Figma Plugin API (plain JS, `documentAccess: "dynamic-page"`), vitest with the node:vm harness in `figma-plugin/audit.test.mjs`.

**Spec:** `docs/superpowers/specs/2026-11-14-plugin-ds-audit-part2-design.md` (part 1: `docs/superpowers/specs/2026-11-13-plugin-ds-audit-design.md`).

## Global Constraints

- The plugin never writes to the Figma file: no node, variable, style or `devStatus` change. `clientStorage` writes are allowed.
- DS file key constant: `const DS_FILE_KEY = "c7EUDrQwP8si08aPipDSIV";`. Roles: `"library"` (that file, or `figma.fileKey` null and a local non-hidden collection whose name starts with `"1."`) and `"screens"` (anything else).
- Scopes: `"ready"` (screens only, screens default), `"file"` (library default), `"pages"`, `"selection"`.
- Stop at every `INSTANCE`: the instance node and its subtree are never checked.
- Library role walks `COMPONENT_SET` and `COMPONENT` not inside a set, hidden layers included. Screens role walks every top-level node of a page, hidden layers (`visible === false`) skipped and counted.
- A component or set whose `description` contains `[audit:skip]` is not walked for findings.
- Default excluded pages, name match ignoring case: library: `"in review"`, `"archive"`, `"arquivo"`, `"cover"`, `"start here"`; screens: `"cover"`, `"history"`, `"histórico"`, plus every page after a divider page whose name contains `"discovery"` or `"archive"`, up to the next page whose trimmed name is `"---"`.
- Checks and weight: `binding-missing` Blocker always; `hand-colour`, `hand-spacing`, `hand-radius`, `hand-stroke`, `no-text-style`: Blocker in library role; in screens role Blocker when the node is inside a node with `devStatus.type === "READY_FOR_DEV"` (nearest marked ancestor, sections included), else Warning; `unused-token` Suggestion, library role only.
- Value 0 (padding, gap, radius) is never a finding. Only visible `SOLID` paints count for `hand-colour`; gradients and images are ignored.
- Layer findings never change `publishBlocked`.
- Walk yields every 500 nodes (`await new Promise((r) => setTimeout(r, 0))`) and checks `isCancelled()` at each yield.
- Screens usage store: `clientStorage` key `"skillup-publish-tokens/screens-usage"`, value `{ [fileKeyOrName]: { name, date: ISO string, keys: string[] } }`, written only after a whole-file (`"file"`) screens run that was not cancelled. `unused-token` runs only if an entry for the ICP (`"Wz2TCYFVr0hD8tJNiLajLt"`) exists and is at most 7 days old; otherwise notCovered gets `"use on screens"`.
- Per-file audit settings: `clientStorage` key `"skillup-publish-tokens/audit/" + (figma.fileKey || figma.root.name)`, value `{ scope, pageIds, excludedPageIds }`.
- Report groups: page → top-level frame or component; first 50 lines of a group, then `+N more`.
- Copy and labels in English, sentence case, as the part 1 UI.
- Never stage `package-lock.json`. Commits end with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Review Focus

1. Mixed values (`figma.mixed`) on `textStyleId`, `fills`, `cornerRadius`: use segments / per-corner values, never crash. Test in Task 3.
2. A bound variable id whose lookup throws (library not available) is `binding-missing`, like `null`. Test in Task 3.
3. A paint with `visible: false` or `opacity: 0` is not a `hand-colour` finding. Test in Task 3.
4. Cancel during a page: the report is the cancelled report and no screens usage is stored. Test in Task 6.
5. A clicked finding whose node no longer exists: the plugin answers `select-result { ok: false }` and the UI says "This layer no longer exists". Test in Task 6.

---

### Task 1: Role, settings and default exclusions

**Files:**
- Modify: `figma-plugin/code.js` (new helpers before `// ---- The audit`; `ready` message)
- Test: `figma-plugin/audit.test.mjs`

**Interfaces:**
- Produces: `fileRole(fileKey: string|null, cols: VariableCollection[]) -> "library"|"screens"`; `defaultExcludedPages(role, pages: {id,name}[]) -> string[]` (ids); `auditSettingsKey() -> string`; the `ready` message gains `role`, `pages: {id,name}[]`, `auditSettings: { scope, pageIds, excludedPageIds }` (stored value, or defaults: scope `"file"`/`"ready"` by role, `pageIds: [current page id]`, `excludedPageIds: defaultExcludedPages(...)`).
- Fake `figma` in tests gains `root: { name, children: pages }` and `currentPage`.

- [ ] **Step 1: Write the failing tests**

```js
describe("fileRole", () => {
  it("is library in the DS file", async () => { /* ctx.fileRole("c7EUDrQwP8si08aPipDSIV", []) === "library" */ });
  it("is screens in the ICP even with local collections", async () => { /* fileRole("Wz2TCYFVr0hD8tJNiLajLt", [col()]) === "screens" */ });
  it("with no file key, a local exported collection starting 1. means library", async () => { /* fileRole(null, [col({name:"1. Colour"})]) === "library"; fileRole(null, [col({name:"1. Colour", hiddenFromPublishing:true})]) === "screens" */ });
});
describe("defaultExcludedPages", () => {
  it("excludes the ICP discovery group by its divider", async () => {
    // pages: Cover, ---, READY FOR DEV ✅, Platform Pages - Ready for Dev 🟢, ---, DISCOVERY - NelsonJ. ———, New Flow - V1, V6 - Full Pages, ---, ARCHIVE ———, Navdeep
    // expect ids of: Cover, DISCOVERY - NelsonJ. ———, New Flow - V1, V6 - Full Pages, ARCHIVE ———, Navdeep
  });
  it("in the library excludes In review, archive, cover and start here by name", async () => {});
});
it("the ready message carries role, pages and default audit settings", async () => {
  // load with fileKey "Wz2TCYFVr0hD8tJNiLajLt": ready.role === "screens", ready.auditSettings.scope === "ready"
});
```

- [ ] **Step 2: Run** `./node_modules/.bin/vitest run figma-plugin` — Expected: the new tests FAIL (`fileRole is not a function`).
- [ ] **Step 3: Implement** the three helpers and extend `ready`. Load the stored settings with `clientStorage.getAsync(auditSettingsKey())`.
- [ ] **Step 4: Run** the same command — Expected: all pass.
- [ ] **Step 5: Commit** `feat(plugin): audit role, per-file settings and default exclusions`.

---

### Task 2: The walker

**Files:**
- Modify: `figma-plugin/code.js`
- Test: `figma-plugin/audit.test.mjs` (add fake-tree builders: `page(name, children)`, `frame(over, children)`, `component(over, children)`, `instance(over)`, `text(over)`; each node has `id`, `type`, `name`, `visible`, `parent`, `children`, and pages have `loadAsync`)

**Interfaces:**
- Consumes: Task 1 settings shape.
- Produces: `async walkScope({ role, scope, pageIds, excludedPageIds, selection, onNode, onUse, onProgress, isCancelled }) -> { cancelled: boolean, walked: number, hiddenSkipped: number, pagesLeftOut: number, componentsLeftOut: number }`. `onNode(node, ctx)` with `ctx = { page: {id,name}, top: {id,name}, ready: boolean }`. `onProgress({ page: n, pages: m, layers: x })`. `onUse(node)` (optional): when given, the walk also visits every node of every page outside instances, excluded pages, layers outside components and `[audit:skip]` components included, and calls `onUse` for each (spec §5.6: a token used only on a logo or a doc frame is still used); `onNode` still fires only for audited nodes.
- Scope `"ready"`: every page not excluded, but only subtrees under a node whose `devStatus.type === "READY_FOR_DEV"`. `"selection"`: `figma.currentPage.selection`, `top` = the selected node's top-level ancestor.

- [ ] **Step 1: Write the failing tests**
  - `stops at instances` — a frame with an instance child that has children: `onNode` never sees the instance or its children.
  - `library role walks components only` — a page with a doc frame and a component set: only nodes inside the set are visited.
  - `library walks hidden layers; screens skips and counts them` — `hiddenSkipped === 1` in screens.
  - `[audit:skip] components are left out and counted` — `componentsLeftOut === 1`.
  - `excluded pages are not loaded` — `loadAsync` not called on them; `pagesLeftOut` equals their count.
  - `ready scope visits only marked subtrees and ctx.ready is true there` — marked frame + unmarked frame on one page.
  - `ready flag is inherited from a marked section` — section with `devStatus: {type:"READY_FOR_DEV"}` containing a frame.
  - `onUse sees excluded pages, doc frames and skipped components; onNode does not`.
  - `yields every 500 nodes and stops on cancel` — 1200 nodes, `isCancelled` true after first yield → `cancelled: true`, `walked <= 500`.
- [ ] **Step 2: Run** — Expected: FAIL.
- [ ] **Step 3: Implement** `walkScope` as an explicit stack per top-level node (no recursion depth limit), `await page.loadAsync()` per page.
- [ ] **Step 4: Run** — Expected: PASS.
- [ ] **Step 5: Commit** `feat(plugin): chunked layer walker that stops at instances`.

---

### Task 3: Layer checks

**Files:**
- Modify: `figma-plugin/code.js`
- Test: `figma-plugin/audit.test.mjs`

**Interfaces:**
- Produces: `async layerChecks(node, ctx, getVarSafe) -> LayerFinding[]` where `LayerFinding = { check, nodeId, layer, property, value, page, pageId, top, topId, ready }`; `getVarSafe(id) -> Promise<Variable|null>` returns `null` when `getVariableByIdAsync` returns null or throws. `property` values: `"fill"`, `"stroke"`, `"padding-top"|"padding-right"|"padding-bottom"|"padding-left"`, `"gap"`, `"counter-gap"`, `"radius"` (or `"radius-top-left"` … when mixed), `"stroke-weight"`, `"text-style"`. `value`: hex for colours (`"#rrggbb"`), number for sizes, font summary for text (`"Inter Semi Bold 16/24"`).
- Weight is not decided here (Task 6).

- [ ] **Step 1: Write the failing tests**
  - `a bound variable that resolves to null is binding-missing` and `one whose lookup throws is binding-missing` (Review Focus 2).
  - `an unbound visible SOLID fill is hand-colour with the hex`; `an invisible paint or opacity 0 is not` (Review Focus 3); `a gradient fill is not`.
  - `padding 0 is not hand-spacing; padding 12 unbound is`; `gap only when layoutMode is not NONE`.
  - `radius mixed reports each unbound non-zero corner` (Review Focus 1).
  - `stroke weight unbound only when a visible stroke exists`.
  - `text without a style is no-text-style; mixed textStyleId reports each unstyled segment once` (Review Focus 1).
  - `a bound paint (paint.boundVariables.color) and a bound padding are not findings`.
- [ ] **Step 2: Run** — Expected: FAIL.
- [ ] **Step 3: Implement** `layerChecks` and `getVarSafe`.
- [ ] **Step 4: Run** — Expected: PASS.
- [ ] **Step 5: Commit** `feat(plugin): layer checks for hand-set values and missing bindings`.

---

### Task 4: Suggested tokens

**Files:**
- Modify: `figma-plugin/code.js`
- Test: `figma-plugin/audit.test.mjs`

**Interfaces:**
- Consumes: `LayerFinding` (Task 3).
- Produces: `async buildTokenIndex(role) -> TokenIndex` (library: local exported variables and local text styles; screens: the variables and text styles already imported in the file, reached through the bindings the walk sees plus `figma.getLocalTextStylesAsync()` for styles). `suggestFor(finding, node, index) -> string|null`, e.g. `"bg/muted"`, `"nearest bg/muted, ΔE 2.1"`, `"Spacing/md 16, set 15"`, `"no imported token matches"`.
- Colour family by node and property: frame/shape fill → `bg/`, stroke → `border/`, TEXT fill → `text/`, VECTOR/BOOLEAN_OPERATION fill → `icon/`. Value read in the node's mode: `node.resolvedVariableModes[collectionId]`, else the collection's default mode. ΔE: CIE76 on Lab (allowed by spec §6), one decimal.
- Spacing from `Spacing/*`, radius from `Radius/*` role tokens (not `Radius/fixed-*`), in the node's mode of the Responsive collection.

- [ ] **Step 1: Write the failing tests**
  - `exact colour match in the right family` (a `bg/x` and a `text/x` with the same hex: a frame fill suggests `bg/x`).
  - `nearest colour with ΔE when no exact match`.
  - `spacing is matched in the node's mode` (Desktop 24 / Mobile 16; node in Mobile mode with 16 → `Spacing/lg`).
  - `off-scale spacing suggests the nearest with the difference`.
  - `text matches a style by family, style, size and line height`.
  - `screens role with nothing imported says no imported token matches`.
- [ ] **Step 2: Run** — Expected: FAIL.
- [ ] **Step 3: Implement** `buildTokenIndex` and `suggestFor`.
- [ ] **Step 4: Run** — Expected: PASS.
- [ ] **Step 5: Commit** `feat(plugin): suggested token for each hand-set value`.

---

### Task 5: Token use across files

**Files:**
- Modify: `figma-plugin/code.js`
- Test: `figma-plugin/audit.test.mjs`

**Interfaces:**
- Produces: `boundIdsOf(node) -> string[]` (all variable ids bound on the node: `boundVariables` values and arrays, paint `boundVariables.color`, text segment bindings); `async storeScreensUsage(fileKeyOrName, name, keys: string[], now: Date)`; `async readScreensUsage(now: Date) -> { files: {name, date}[], keys: Set<string>, icpFresh: boolean }`; `unusedTokens(localVars, usedIds: Set<string>, usedKeys: Set<string>, aliasedIds: Set<string>, textStyleBoundIds: Set<string>) -> {collection, name}[]` (exported collections only).

- [ ] **Step 1: Write the failing tests**
  - `boundIdsOf collects padding, paint and text-segment bindings`.
  - `storeScreensUsage keeps other files' entries`.
  - `the ICP entry older than 7 days is not fresh`.
  - `a token used only through another token's alias is not unused`.
  - `a token used only on a screens file (by key) is not unused`.
- [ ] **Step 2: Run** — Expected: FAIL.
- [ ] **Step 3: Implement** the four functions.
- [ ] **Step 4: Run** — Expected: PASS.
- [ ] **Step 5: Commit** `feat(plugin): token use across the DS and screens files`.

---

### Task 6: `auditLayers`, the merged report and the messages

**Files:**
- Modify: `figma-plugin/code.js` (`auditLayers`, the `audit` handler, new `select-node` handler)
- Test: `figma-plugin/audit.test.mjs`

**Interfaces:**
- Consumes: Tasks 1–5.
- The library run with scope `"file"` passes `onUse` to collect used variable ids; every whole-file screens run passes `onUse` to collect keys for `storeScreensUsage`.
- Produces: `async auditLayers({ role, settings, onProgress, isCancelled }) -> { covered: string[], notCovered: string[], blockers, warnings, suggestions, cancelled }`, findings carrying `suggestion`. The `audit` message gains `scope`, `pageIds`, `excludedPageIds` (the UI saves them through `save-audit-settings`). The handler runs `auditTokens` only in the library role, then `auditLayers`, and posts one `audit-result` whose report adds `role` and `groups` is left to the UI. `audit-progress` gains `{ phase: "layers", page, pages, layers }`. New messages: `save-audit-settings { settings }`; `select-node { id }` → the plugin switches page with `await figma.setCurrentPageAsync`, sets `selection`, calls `figma.viewport.scrollAndZoomIntoView`, replies `select-result { id, ok }`.
- Covered line entries, exact: `"layers: " + scopeLabel` where scopeLabel is `"Ready for dev"`, `"whole file"`, `"N of M pages"` or `"selection: N layers"`; plus `"N pages and N components left out"` and, in screens, `"N hidden layers skipped"` when non-zero.

- [ ] **Step 1: Write the failing tests**
  - `library: a hand-set colour in a component is a blocker and the verdict is not ready, publishBlocked unchanged`.
  - `screens: a hand-set colour is a blocker inside a Ready for dev frame and a warning outside`.
  - `binding-missing is a blocker in both roles`.
  - `cancel mid-walk returns the cancelled report and stores no screens usage` (Review Focus 4).
  - `a whole-file screens run stores its keys; a pages run does not`.
  - `library without a fresh ICP entry lists "use on screens" as not covered and no unused-token`.
  - `select-node on a missing id replies ok false` (Review Focus 5).
  - `the screens role does not run auditTokens` (no `no-web` findings for local collections in the ICP).
- [ ] **Step 2: Run** — Expected: FAIL.
- [ ] **Step 3: Implement** `auditLayers` and the handlers; the report's `notCovered` drops the part 1 placeholder `"layers, components, docs"` and keeps `"components, docs"`.
- [ ] **Step 4: Run** `./node_modules/.bin/vitest run scripts figma-plugin` — Expected: PASS, part 1 tests included.
- [ ] **Step 5: Commit** `feat(plugin): layer audit in the report, scope messages and select a finding`.

---

### Task 7: The Audit tab UI and the README

**Files:**
- Modify: `figma-plugin/ui.html`, `figma-plugin/README.md`, `figma-plugin/code.js` (only the `selectionchange` listener that posts `selection { count }`)

**Interfaces:**
- Consumes: `ready.role`, `ready.pages`, `ready.auditSettings`; Task 6 messages and report.

- [ ] **Step 1: Role line and Publish:** first line of the Audit tab "Auditing the DS library" / "Auditing screens"; in the screens role the Publish tab shows "Publish runs in the SKO Design System" and its button stays disabled (through `updateButtons`).
- [ ] **Step 2: Scope picker** (radio: Ready for dev [screens only], Whole file, Pages, Selection) with a pages checklist when Pages is chosen, and a folded "Left out" checklist of excluded pages; every change posts `save-audit-settings`. Selection is disabled when the plugin reports none (`selectionchange` → plugin posts `selection { count }`).
- [ ] **Step 3: Grouped report:** layer findings grouped by page → top, folded, count per group (`"Course Detail / Desktop · 14 hand-set colours"`), first 50 lines then `+N more` (click shows the rest). Each line: layer, property, value, suggestion. Click posts `select-node`; on `select-result ok:false` the line shows "This layer no longer exists". Token findings keep the part 1 rendering.
- [ ] **Step 4: Copy report** button: the whole report as plain text, one finding per line, grouped as on screen.
- [ ] **Step 5: README:** a section "Audit the layers" (roles, scopes, what is left out and `[audit:skip]`, weights, Ready for dev, why "unused" needs a recent whole-file ICP run).
- [ ] **Step 6: Verify** `node -e` extracting the `<script>` of `ui.html` and `node --check` on it; `./node_modules/.bin/vitest run scripts figma-plugin` — Expected: PASS.
- [ ] **Step 7: Commit** `feat(plugin): scope picker, left-out pages and the grouped layer report`.
