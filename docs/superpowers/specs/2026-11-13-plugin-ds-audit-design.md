# DS audit in the Publish tokens plugin, part 1: token health and sync with the prototype

Date: 13 Nov 2026 · Status: draft, all open questions answered by Nelson on 13 Nov; waiting for his approval of the document · Scope: `figma-plugin/` and
`scripts/tokens/` in `skillup-lms-prototype`

Part 1 of 5. The audit grows in this order, one design and one PR series each:

1. **Token health and sync with the prototype** (this document).
2. Bindings and hand-set values, with a scope picker (whole file, chosen pages, current
   selection) and "tokens with no use in Figma".
3. DS rule lint: layer names by role, component set padding Spacing/xl, buttons hug or fill,
   concentric radius, description with a 1.x version.
4. Docs, versions and anatomy, checked against the docs repo.
5. Atomic-design heuristics, as suggestions only, never in the verdict.

## 1. What it is for

Nelson runs the audit **before he publishes the SKO Design System library**. It answers two
questions:
- what should he fix first?
- is the DS ready for the developers to pick up?

The answer is a verdict at the top, then a list in priority order. The verdict says what it
covered and what it did not. In part 1 it covers tokens only, so it never says "100% ready" for
the whole DS.

## 2. Goals, non-goals, anti-goals

**Goals:**
- Find every token problem that would reach the developers broken, before publishing.
- Say which token changes have not been sent to the prototype yet.
- Say which tokens the prototype's code uses that no longer exist in Figma, or were renamed,
  before Nelson publishes the change that removes them.

**Non-goals (later parts):**
- Scanning layers, bindings or hand-set values.
- Component rules, docs and versions.
- Choosing pages or components (part 2).
- "Token with no use in Figma" needs a whole-file layer scan, so it moves to part 2.

**Anti-goals (a failure even if it works):**
- A verdict that reads "not ready" in the normal case. A token changed in Figma and not yet sent
  is normal work, so it is shown as pending and never blocks.
- Writing anything to the Figma file. The plugin stays read-only on Figma.
- A report so long that the blockers get lost. Blockers come first and each finding is one line.
- A check that freezes the plugin on the DS file. Some calls already hang the plugin there.

## 3. Constraints

- **Figma plugin API:**
  - `getPublishStatusAsync()` exists on variables and variable collections. It returns
    `UNPUBLISHED`, `CURRENT` or `CHANGED`. Its speed on this file has not been measured: measure
    it on all ~233 local variables before relying on it.
  - The API cannot read comments or reorder anything (not needed here).
- **Network:** `manifest.json` allows `api.github.com` only. It stays that way: everything the
  plugin reads comes through the GitHub contents API, with the token Nelson has already pasted.
  On the public prototype repository it also works without a token.
- **Today a broken alias stops the plugin.** `exportTokens()` in `code.js` throws "missing alias
  target", and the UI shows only that error. Part 1 must collect the problem as a finding and
  still load. Publishing stays blocked while a blocker exists, because the JSON would be wrong.
- **Figma names are not CSS names.** `scripts/tokens/build.mjs` owns the mapping:
  - colours use the Web code syntax (`v.web`), or `--color-<name with / → ->`;
  - radius, spacing, type and motion use `--sk-*` / `--motion-*` rules.
  
  The plugin must not copy this mapping. The repository computes usage per **Figma token name**,
  so the plugin only compares names.
- **The code reaches tokens two ways:** `var(--x)` in TS, TSX and CSS (about 139 distinct names
  today), and Tailwind utilities defined in `tailwind.config.ts` that resolve to `var(--x)` (for
  example `rounded-card` → `--sk-radius-card`). Both count as use.
- **`main` is not protected.** A workflow can commit to it with the Actions token. Commits made
  with `GITHUB_TOKEN` do not trigger other workflows, so there is no loop.
- **House rules:**
  - never commit lockfiles;
  - stage explicit paths;
  - squash-merge;
  - Nelson merges;
  - no new Figma variables;
  - commits end with the Co-Authored-By line.

## 4. Approaches considered

The open question was where the check "code uses a token that is gone" runs.

| Approach | How | Why or why not |
|---|---|---|
| A. All in the plugin | The plugin searches the prototype's code through the GitHub search API. | Rejected. Code search is slow, rate-limited and unreliable for hundreds of names. The plugin would also need the CSS name mapping. |
| **B. Plugin + a usage map made by the repository** (chosen by Nelson, 13 Nov) | A script writes `tokens/usage.json` on every relevant change to `main`. The plugin reads it with one request and compares it with the live variables. The same script can fail a token PR. | Answers **before** publishing, fast and exact, and the mapping stays in one place. Costs one script and one workflow step. |
| C. CI only | The token PR fails if the code uses a token that disappeared. | Rejected as the main mechanism, because Nelson finds out only after publishing. Kept as an extra guard inside B. |

The audit lives in a new **Audit** tab of the same plugin, not a separate plugin. It shares the
GitHub token, the settings and the variable reading. That was my call, stated to Nelson on
13 Nov.

## 5. What gets built

### 5.1 Repository: the usage map

- **New script `scripts/tokens/usage.mjs`.** It reads `tokens/figma/variables.json` and the
  generated CSS, and builds, for every Figma token, the CSS name(s) it becomes. It then scans
  `app/`, `components/`, `lib/` and `stories/` (TS, TSX, CSS, not `tokens/generated/`) and
  `tailwind.config.ts`, plus the hand-written `tokens/*.css` (skins, direction, square corners:
  they consume tokens too). A Tailwind key that resolves to `var(--x)` counts when its utility class
  appears in the code. It writes `tokens/usage.json`:

  ```json
  {
    "format": "skillup-token-usage/1",
    "commit": "<sha of main it was built from>",
    "tokens": {
      "<Figma collection>/<Figma variable name>": { "css": ["--color-text-default"], "files": 42 }
    },
    "unknownCss": ["--sk-old-thing"]
  }
  ```

  - `files` is a count, not a list, to keep the file small. With `--verbose` the script prints
    the files.
  - A name built at runtime (`var(--sk-radius-${role})`) counts as a use of every token whose CSS
    name starts with the fixed part, and the map lists it under `"dynamic"`. Over-counting use is
    safe; missing a use would hide a blocker. `stories/figmaTokens.ts`, which reads
    `variables.json` directly, is ignored.
  - `unknownCss` lists `var(--x)` names used in code that no token in `variables.json` produces
    and no hand-written file in `tokens/*.css` defines. These are already broken today.
- **Modes:**
  - `--write` writes the file;
  - `--check` exits 1 if the file is stale;
  - `--against <path to a variables.json>` scans the code it runs on, builds the CSS names that
    JSON produces (same mapping as `build.mjs`) and exits 1 if a CSS name used in code is not
    produced any more. It compares **CSS names**, so a Figma rename that keeps the Web code syntax
    passes.
- **Workflow:**
  - In `tokens.yml`, on a Figma sync branch, `--write` runs next to "Generate the CSS" and the map
    is committed with the CSS. This matters: the sync is merged with `github.token`, and a merge
    made with that token triggers no other workflow, so a push-to-`main` job alone would never
    see a token publish.
  - On push to `main` (paths `app/**`, `components/**`, `lib/**`, `stories/**`, `tokens/**`,
    `tailwind.config.ts`), a job runs `--write`. If the file changed, it commits
    "chore(tokens): usage map" as github-actions[bot] straight to `main`.
  - In `tokens.yml`, a step runs `--against tokens/figma/variables.json` on the PR branch (a fresh
    scan, not the committed map), before "Merge the Figma sync". What happens when it finds a
    removed token still in use: see §5.5. This is approach C as a guard.

### 5.2 Plugin: the Audit tab

`code.js` changes:
- `exportTokens()` no longer throws on a missing alias target. It records a finding and skips
  that value. Publishing, the package PR and the download are blocked only by the two findings
  that make the JSON wrong (alias to a missing variable, a mode with no value). Other blockers
  stop the verdict, not the publish; see §5.5 for a removed token still in use.
- A new `auditTokens()` reads, for every local collection and variable:
  - the publish status;
  - the alias target of every mode value;
  - the description;
  - the scopes;
  - `codeSyntax.WEB`;
  - `hiddenFromPublishing`.
- It runs collection by collection, posts progress to the UI and stops when the UI sends
  `cancel`.

`ui.html` adds an **Audit** tab next to the publish view, with this layout:

```
┌ Audit ─────────────────────────────────────┐
│ Not ready: 2 blockers          [Run again] │
│ Covered: tokens (233). Not covered yet:    │
│ layers, components, docs.                  │
│                                            │
│ Pending                                    │
│  · 4 tokens not sent to the prototype      │
│  · 7 tokens changed, library not published │
│ Blockers                                   │
│  · color/text/old → alias to deleted var   │
│  · Radius/card: used in code (12 files),   │
│    gone from Figma                          │
│ Warnings (12)                         ▸    │
└────────────────────────────────────────────┘
```

The verdict line reads "Ready for developers (tokens)" or "Not ready: N blockers". It always
names what was covered.

### 5.3 The checks and their weight

| Check | Weight |
|---|---|
| Alias to a deleted variable, or to a variable from a library that is not available | Blocker |
| A mode with no value (`valuesByMode` missing a mode of its collection) | Blocker |
| A token used in code (`usage.json` on `main`) that is missing from Figma now: deleted or renamed | Blocker |
| A token used in code whose Figma name changed but whose Web code syntax is the same | Not a finding (the code is unaffected) |
| A variable in an exported collection with no Web code syntax (40 today: Skin shape, Scope, `Radius/fixed-*`, `Type/family/*`, `Type/weight/*`, `Stroke/*`, the non-colour values in the colour collection) | Warning. The prototype build derives or skips these, so nothing breaks; the dev team's package may want a name. A blocker here would make "not ready" the normal case. |
| `unknownCss` in `usage.json` (code uses a CSS var no token produces) | Warning. It is code debt, not a DS problem, and it must not stop a DS publish. |
| Tokens in Figma that differ from `tokens/figma/variables.json` on `main` (the diff the Publish tab already shows) | Pending |
| Variables or collections with publish status `UNPUBLISHED` or `CHANGED` | Pending |
| A collection at 10 modes, Figma's cap (SKO-Semantics today): a new skin needs a mode retired first | Warning |
| A token with no description | Warning |
| A token with `ALL_SCOPES` | Warning |
| A hidden collection (primitives) with a variable that nothing aliases | Suggestion |

Each finding carries the collection, the variable name, the problem in one line and, where it
helps, the mode. Variables have no canvas node, so there is no node link. Clicking a finding
copies the variable name.

### 5.4 Reading `usage.json`

- The plugin fetches `tokens/usage.json` from the prototype's `main` through the contents API.
  Usage is keyed by Figma name, so the plugin compares names with no mapping.
- To find a token "gone from Figma", the plugin matches by Figma name first, then by Web code
  syntax against the live variables, so a rename that keeps the CSS name is not reported.
- If the file is missing, or was built from a commit older than the last commit that touched
  `variables.json` (the same commit or a later one is fine), the plugin shows "code usage not checked: the
  usage map is out of date". That counts as not covered, never as passing.

### 5.5 A token removed in Figma that the code still uses

Decided by Nelson on 13 Nov (option A): **the sync pull request waits.**

- The `--against` step in `tokens.yml` does not fail the job. It writes the list of CSS names
  still used in code that the new JSON no longer produces, with the files for each, and sets an
  output.
- When that list is not empty, "Merge the Figma sync" is skipped, whatever
  `TOKENS_AUTO_MERGE` says, and the PR gets a comment: which tokens, where they are used, and
  "merge after the code no longer uses them". The other checks (build, lint) still run and
  report as usual.
- The PR is merged by hand once a code PR removes the uses. Re-running the job after that code
  PR is on `main` lets it auto-merge.
- The plugin does not block **Publish** for this. Before publishing, the Audit tab already shows
  it as a blocker. After publishing, the plugin's result line says the PR is waiting and why.

Rejected:
- B (merge and warn), because the prototype would show missing colours or spacing.
- C (the plugin refuses to publish), because Nelson could not send any other token change
  until the code changes.

### 5.6 Slow publish status

`getPublishStatusAsync()` runs with a time limit (about 10 s for all variables). If it runs out,
or the measurement shows it hangs, the two "not published" pending lines read "not checked" and
the verdict lists it under not covered. The rest of the audit still runs.

## 6. Left to the builder

- How `usage.mjs` resolves Tailwind keys to utility classes (read the config as text, or import
  it with a TS loader). It must match `rounded-card`, `bg-…`, `text-…` and the arbitrary
  `[var(--x)]` form.
- How `usage.mjs` reads the Figma-to-CSS mapping: import helpers from `build.mjs` (refactor it
  to export them), or parse the generated CSS headers. Prefer one source of the mapping.
- The tab design inside the existing UI style, the progress and cancel controls, and the
  wording of each finding (plain English, as in the rest of the plugin).
- Tests:
  - `usage.mjs` gets vitest cases on a fixture (var use, Tailwind use, unknown CSS, renamed
    token, a rename that keeps the Web code syntax, a dynamic name);
  - the plugin audit gets a new node harness with a fake `figma.variables` (the PR 490 one was
    never committed).
- Reading `usage.json` and `variables.json` without a token when none is set (the repository
  is public); today the diff asks for one.
- README section "Audit before publishing the library".

## 7. Not verified when this was written

- The speed of `getPublishStatusAsync()` on the DS file.
- Whether `alias to a library that is not available` can be told apart from `deleted` through the
  plugin API (`getVariableByIdAsync` returns null in both cases). If not, they share one message.
- Whether the plugin on Nelson's second device reaches the repository the same way (it should:
  same token, public repository).
