# DS audit in the Publish tokens plugin, part 2: bindings and hand-set values

Date: 14 Nov 2026 · Status: draft, waiting for Nelson's approval · Scope: `figma-plugin/` in
`skillup-lms-prototype` · Builds on part 1 (`2026-11-13-plugin-ds-audit-design.md`, PR 491)

Part 2 of 5 (see part 1 for the order). Part 1 checks the tokens themselves. Part 2 checks the
layers: where a value is set by hand instead of with a token, where a binding points at a token
that no longer exists, and which tokens nothing in Figma uses.

## 1. What it is for

The same two questions as part 1, now for the layers:
- what should Nelson fix first?
- is it ready for the developers?

The developers rebuild what they see. A colour, padding or radius set by hand is something they
rebuild wrong, because they cannot see which token was meant (Nelson's rule of 24 Sep: every
element on every screen on DS tokens and text styles).

The audit runs in **both files** (Nelson, 14 Nov, option A):
- in the **SKO Design System** (`c7EUDrQwP8si08aPipDSIV`), before publishing the library: the
  layers inside the components;
- in the **ICP** (`Wz2TCYFVr0hD8tJNiLajLt`), before a handoff: the screens.

## 2. Goals, non-goals, anti-goals

**Goals:**
- List every hand-set colour, spacing, radius, stroke weight and unstyled text in the chosen
  scope, with the token that would replace it.
- List every binding to a token that no longer exists (always a blocker).
- List the DS tokens that nothing in Figma uses, in either file.
- Let Nelson scan the whole file, chosen pages, or the current selection, because the ICP is
  large.

**Non-goals (later parts or never):**
- Fixing anything. The plugin only lists; fixing is a separate step (Nelson or Claude).
- DS rules such as layer names, Spacing/xl padding on sets, hug or fill, concentric radius (part 3).
- Docs, versions, anatomy (part 4). Atomic-design advice (part 5).
- Drawn UI that should be a component (chip-like frames, 1–2 px rectangles). It is in Nelson's
  24 Sep rule, but it is a heuristic, so it waits for part 5.
- Gradients and image fills: not token values. Gradients are off-brand (21 Oct rule), which is a
  part 3 lint.

**Anti-goals:**
- Writing to the Figma file. Still read-only.
- Descending into instances on the ICP. A finding there would be an override, and the
  interior belongs to the component (24 Sep rule: stop at INSTANCE).
- A list so long the blockers vanish: thousands of ICP findings must arrive grouped and counted.
- Freezing Figma on the ICP. The scan yields often and can be cancelled.
- A verdict that is never "ready" on the ICP because of old debt (Nelson, 14 Nov, option 1:
  hand-set values on the ICP are warnings).

## 3. Constraints

- **Plugin API:**
  - `documentAccess: "dynamic-page"`: each page must be loaded (`page.loadAsync()`) before
    its children are read.
  - Bound variables: `node.boundVariables` (padding, gap, radius, strokeWeight, and `fills` /
    `strokes` as arrays). A paint's own binding is `paint.boundVariables.color`.
  - `figma.variables.getVariableByIdAsync(id)` returns `null` for a deleted variable. For a
    library variable on the ICP it returns the imported variable, with `remote: true` and its
    `key`.
  - Text styles: `node.textStyleId`, which is `figma.mixed` when segments differ; then
    `getStyledTextSegments(["textStyleId"])`.
  - Spacing values depend on the mode: `node.resolvedVariableModes` gives the mode per
    collection, so "the token whose value equals 24" is read in the node's mode.
  - `figma.clientStorage` is per user and per plugin, shared across files. Part 2 uses it to pass
    the ICP's token use to the DS run (§5.6).
- **Network:** unchanged (`api.github.com` only). Part 2 needs no network.
- **Size:** the ICP has many pages and frames, with thousands of instances. Its node count has not
  been measured.
- **Hangs:** the 8 Oct notes record two Figma calls that hang the plugin on large files. The scan
  must not depend on one long synchronous call.

## 4. Approaches considered

| Approach | Trade-off |
|---|---|
| **A. The plugin walks the tree itself, in chunks** (chosen by Nelson, 14 Nov) | Stops at instances by construction; loads one page at a time; yields every few hundred nodes, so progress and Cancel work as in part 1. More code than a native search. |
| B. Native `findAll` / `findAllWithCriteria` | Fast per call, but always descends into instances: on the ICP that is tens of thousands of nodes to throw away, and it breaks the instance rule. |
| C. Figma REST API on the file JSON | Variables in REST are Enterprise-only, and it needs a Figma token. Ruled out. |

## 5. What gets built

### 5.1 Which file the plugin is in

- **Role** (Claude's call): the DS file key is a constant in `code.js`. In that file the role is
  `library`; anywhere else it is `screens`. The Audit tab shows the role on its first line
  ("Auditing the DS library" / "Auditing screens"). No override in part 2.
- In a `screens` file the Publish tab says "Publish runs in the SKO Design System" and its
  button stays disabled. The part 1 token checks run only in the `library` role.

### 5.2 The scope picker

At the top of the Audit tab, three choices:
- **Whole file** (default in the DS);
- **Pages**: a checklist of the file's pages (default in the ICP: the current page);
- **Selection**: what is selected now, with a count; disabled when nothing is selected.

The last choice per file is kept in `clientStorage` under a key that includes the file key. The
"covered" line names the scope ("whole file", "3 of 18 pages", "selection: 4 layers").

### 5.3 What is walked

- **Library role:** every `COMPONENT_SET` and every `COMPONENT` not inside a set, on the pages in
  scope, and their layers. Layers outside components (doc frames, notes) are not walked. Nested
  instances inside a component are not entered: each component is checked on its own.
- **Screens role:** every top-level frame on the pages in scope, and their layers, stopping at
  each `INSTANCE`. The instance is skipped entirely, its own node included: its fills, padding
  and radius come from the component, and an override set by hand on an instance is left for a
  later part (Claude's call). Local components on the ICP are walked like screens.
- **Selection:** the selected nodes and their layers, with the same instance rule for the role.
- **Hidden layers** (`visible: false`) are skipped and counted in the covered line (Claude's
  call: they do not reach the developers as drawn).
- The walk yields to Figma every 500 nodes (Claude's call; tune after measuring) and reports
  progress as "page N of M, X layers".

### 5.4 The checks and their weight

| Check | When it fires | Library role | Screens role |
|---|---|---|---|
| `binding-missing` | A bound variable id resolves to `null` (deleted, or from a library that is not available) | Blocker | Blocker |
| `hand-colour` | A visible SOLID fill or stroke with no colour binding | Blocker | Warning |
| `hand-spacing` | Auto-layout padding (4 sides) or gap (`itemSpacing`, `counterAxisSpacing`) not bound, and not 0 | Blocker | Warning |
| `hand-radius` | Corner radius (or any of the four) not bound, and not 0 | Blocker | Warning |
| `hand-stroke` | Stroke weight not bound, on a node with a visible stroke | Blocker | Warning |
| `no-text-style` | A text node (or a segment) with no text style | Blocker | Warning |
| `unused-token` | A DS token no layer in either file uses (§5.6) | Suggestion | not run |

- 0 needs no token (padding 0, radius 0): not a finding (Claude's call).
- A colour bound to a primitive (a hidden-collection variable) instead of a semantic token is
  out of scope for part 2; it is a part 3 rule.
- The verdict follows part 1: any blocker means "not ready". In the library role a single
  hand-set colour inside a component blocks (Nelson, 14 Nov: the component reaches the developers
  wrong).

### 5.5 The suggested token

Each `hand-*` finding carries the token that would replace it, when one exists:
- **Colour:** the semantic tokens (exported collections) of the right family whose value, in the
  node's mode, equals the hex exactly: `bg/` for frame fills, `border/` for strokes, `text/` for
  text fills, `icon/` for vector fills. No exact match: the nearest in the family by ΔE, with the
  ΔE shown ("nearest bg/muted, ΔE 2.1").
- **Spacing:** the `Spacing/*` (gaps, padding) token whose value in the node's Responsive mode
  equals the number; off-scale: the nearest, with the difference ("Spacing/md 16, set 15").
- **Radius:** the `Radius/*` role tokens, same rule.
- **Text:** the text style with the same font family, style, size and line height, if one exists.
- In the screens role the tokens come from the DS library as imported in the file; a token not
  yet imported cannot be suggested by value and the finding says "no imported token matches"
  (Claude's call; the alternative needs the `teamlibrary` permission and is left for later).

### 5.6 Tokens with no use in Figma

"No use" must mean no use in either file, or it misleads (a token used only on ICP screens
would look unused in the DS).
- The **screens** run, when its scope is the whole file, stores in `clientStorage` the `key`s of
  every library variable it saw bound, with the file key and the date.
- The **library** run, when its scope is the whole file, collects the local variables bound
  anywhere in the DS file (all layers, not only components, plus aliases from other variables
  and text-style bindings). A token is `unused-token` when it is in neither that set nor the
  latest stored ICP set.
- If no whole-file ICP run is stored, or it is older than 7 days, the covered line says "use on
  screens not covered" and `unused-token` is not run (Claude's call: a partial answer is worse
  than none).
- Primitives (hidden collections) are already handled by part 1 (`unused-primitive`).

### 5.7 The report

- Same Audit tab as part 1: verdict, covered line, then Blockers, Pending, Warnings, Suggestions.
- Findings of the same check are grouped by **page → top-level frame or component**, with a
  count per group ("Course Detail / Desktop · 14 hand-set colours"). Groups are folded; the
  first 50 lines of an open group show, then "+N more".
- Each line: layer name, property, value, suggestion. Clicking it goes to that page, selects
  the layer and zooms to it. A layer that no longer exists says so instead.
- "Copy report" copies the whole report as plain text (for a handoff note or a PR).

### 5.8 Messages and code shape

- `auditLayers({ role, scope, onProgress, isCancelled })` in `code.js`, separate from part 1's
  `auditTokens`. The Audit run calls `auditTokens` (library role) and `auditLayers`, and merges
  the findings into one report.
- New messages: `audit` gains `scope`; `select-node` `{ id }` from the UI; `pages` from the plugin
  on load (id, name).
- Tests: the same node:vm harness, with a fake page tree (frames, components, instances, text,
  paints with and without bindings, a deleted variable id).

## 6. Left to the builder

- The exact ΔE formula (CIEDE2000 or CIE76 are both fine for "nearest").
- How the fake node tree is built in tests.
- The chunk size and progress wording, within §5.3.
- The UI layout of the scope picker, within the part 1 tab style.

## 7. Not verified when this was written

- The ICP's node count and how long a whole-file walk takes.
- Whether `getStyledTextSegments` is fast enough on long text nodes.
- That `getVariableByIdAsync` returns `null` (and does not throw) for a deleted library variable.
