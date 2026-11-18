# Figma → prototype: Publish tokens

A change to a variable or a text style in the **SKO Design System** reaches the prototype and
Storybook with one click, and nobody types a value by hand on either side.

```
Figma (SKO DS)                GitHub                                   Live
──────────────                ──────                                   ────
change a variable    ─────▶   PR: tokens/figma/variables.json  ─────▶  Vercel deploys the prototype
press Publish tokens          Action "Tokens from Figma":              GitHub Pages rebuilds Storybook
                                generates tokens/generated/*.css
                                token lint · tsc · lint · next build
                                comments what changes on the page
                                merges (squash)
```

The plugin is a **development plugin**: it runs in Figma desktop on any plan and is never
published to the Community. Code Connect is a different thing (it links components to code in
Dev Mode) and needs an Organization plan; the `*.figma.tsx` files stay ready for that day.

## Install it once

1. Figma desktop → open the SKO Design System file.
2. Menu → Plugins → Development → **Import plugin from manifest…** → pick
   `figma-plugin/manifest.json` from a clone of this repository.
3. Create a GitHub **fine-grained token**: github.com → Settings → Developer settings →
   Fine-grained tokens → Generate. Repository access: only `nvjeronimo/skillup-lms-prototype` and
   the package repository (`nvjeronimo/skillup-lms-prd` by default, or the dev team's).
   Permissions: **Contents** read and write, **Pull requests** read and write. Copy it.
4. Run the plugin (Plugins → Development → SkillUp · Publish tokens), open **GitHub connection**
   and paste the token. It is kept in Figma's client storage on that computer only.

## Publish a change

1. Change a variable (or a text style) in the DS file.
2. Run **SkillUp · Publish tokens**. It lists every value that differs from what is on `main`.
3. Write one line on what changed and why, then **Publish tokens**.
4. The plugin shows the pull request. About three minutes later the Action has merged it, Vercel
   is deploying, and the PR carries a comment with what changes on the page, mode by mode.

If a check fails the PR stays open with the failing step: nothing reaches the prototype.

## Update the dev token package

**Open the package pull request** sends the same export to a package repository in one commit,
on a `tokens/package-*` branch, and opens a pull request. It never merges: the tokens go to the dev
team, so a person reviews the diff and merges. If the repository already has these tokens (the file
key and the order of the entries do not count), the plugin says so and opens nothing.

Where it goes is set under **Package repository** in that section, and kept on this computer:

| Setting | Default (our docs repository) | For the dev team's own repository |
|---|---|---|
| Repository | `nvjeronimo/skillup-lms-prd` | their `owner/name` on GitHub |
| Base branch | `main` | the branch their pull requests go to (e.g. `develop`) |
| Folder | `03-design-system/dev-token-package/figma` | where the token files live (e.g. `src/tokens`) |
| Format | SkillUp JSON: `<folder>/variables.json` | SkillUp JSON, or W3C DTCG: `<folder>/<collection>/<mode>.tokens.json` + `text-styles.tokens.json` |

- Files that do not exist yet are created, so the first pull request can start an empty folder.
- In DTCG, a `*.tokens.json` inside the folder that the export no longer has (a mode removed in
  Figma) is deleted in the same commit. Files outside the folder are never touched.
- On our docs repository the **Dev token package** check regenerates `css/` and commits it to the
  branch. On another repository the plugin only sends the token files: that repository's own
  build (Style Dictionary, for instance) turns them into code.
- The GitHub token needs access to that repository too (Contents and Pull requests, read and
  write). The plugin talks to GitHub only (`api.github.com`); GitLab, Azure DevOps or Bitbucket
  repositories can use **Download the JSON** instead.

## Audit before publishing the library

The **Audit** tab reads every variable of the file (read only: it never changes Figma) and says
whether the tokens are ready for developers. In the DS, opening the plugin checks the tokens only;
the layers (below) wait for **Run audit**, which checks tokens and layers and then reads **Run
again**. **Cancel** stops it. Reading the published tokens needs no GitHub token; only Publish and
the package pull request do.

Three weights:

- **Blocker.** The verdict reads "Not ready: N blocker(s)". Two blockers also stop the export,
  because the JSON would be wrong: an alias to a variable that no longer exists, and a mode with
  no value. While one of those exists, Publish, the package pull request and the download are
  disabled. The export is read when the plugin opens: once Run again finds them fixed, reopen
  the plugin to export the fixed tokens. The third blocker is a token the prototype's code still
  uses that is gone from Figma (see below): it does not stop Publish. After Publish opens a pull
  request, Publish stays off until the plugin is reopened, so the same export never opens two.
- **Pending.** Things that are not wrong but not finished: token changes not sent to the
  prototype yet, and variables or collections not published to the Figma library. One line per
  kind, with a count; click it to see the names.
- **Warning** and **Suggestion** (folded, with a count): no Web code syntax, a CSS variable that
  code uses but no token produces, a collection at Figma's 10-mode limit, no description, all
  scopes, and primitives that nothing aliases. They never stop anything.

Click a finding to copy `collection/name`.

**What "covered" means.** The line under the verdict names what the audit looked at and what it
did not. Today it covers the tokens, and the code usage when `tokens/usage.json` on `main` was
built from the same `variables.json` that is on `main` now. If that file is missing or older,
"code usage" moves to "not covered": nothing is guessed. Components and docs are not covered yet,
and until **Run audit** the layers read "not run". A library publish status that does not answer in 10 seconds, or a prototype that
cannot be read, is listed as not covered too.

**Why a sync pull request can wait.** If Publish removes or renames a token whose CSS name the
prototype's code still uses, the Action does not merge the pull request, whatever the auto-merge
setting says, and comments with the tokens and the files. The plugin says it after Publish.
Remove those uses in a code pull request, merge it, then re-run the "Tokens from Figma" job on the
waiting pull request: the job merges `main` into the sync branch first (in the runner only, it
does not push that merge), so it sees the code without those uses, and merges. If that merge
conflicts (anything but `tokens/generated`, which is built again), the job fails and says which
files: publish again from the plugin. After a sync is merged, the "Token usage map" job refreshes
`tokens/usage.json` on `main`; until it finishes (about a minute) the Audit tab lists code usage as
not covered.

A rename counts the way the build names the CSS. Colours and motion take their CSS name from the
Web code syntax (or, without one, from the Figma name), so renaming them in Figma is fine while the
syntax stays, and the plugin and the Action judge it the same way. Radius, spacing, type,
`Layout/*` and `Container/*` take it from the Figma name, so renaming one that code uses is a
blocker even if its Web syntax stayed.

## Audit the layers

The Audit tab also reads the layers, still read only. Its first line says which role the file has:

- **Auditing the DS library.** The SKO Design System file. It checks every component and component
  set (hidden layers too), plus the tokens above. Publish works here.
- **Auditing screens.** Any other file, such as the ICP. The plugin opens on the Audit tab and
  checks nothing until **Run audit**: a whole-file walk of the ICP takes a while. It checks the
  screens of the pages in scope. Hidden layers are skipped and counted (in Ready for dev, only
  those inside a marked frame or section). The Publish tab says "Publish runs in the SKO Design
  System" and its buttons stay off; the file's own local collections never block the download.

**Scope.** Pick it under the role line; the choice is kept per file.

| Scope | What it reads |
|---|---|
| Ready for dev (screens only, the default there) | Only what is inside a frame or section marked Ready for dev |
| Whole file (the default in the library) | Every page, except the ones left out |
| Pages | The pages you tick |
| Selection | What is selected now. Off when nothing is. A selected instance, or a layer inside one, is skipped and counted |

**Left out.** The folded list **Left out** holds the pages the audit skips, ticked. Library: In
review, Archive, Arquivo, Cover, Start here. Screens: Cover, History, Histórico, and every page after
a divider page whose name starts with "Discovery" or "Archive", up to the next page named `---`.
Tick or untick any page; it is kept per file. A component or set whose description contains
`[audit:skip]` is not checked. Instances are never checked: the audit stops at an instance.
A component set's purple outline and a section's fill are Figma's own chrome, not product: their
own colour, radius and stroke weight are not checked, but their bindings and auto-layout spacing
are, and the layers inside them are.

**What it finds, and the weight.**

| Finding | Library | Screens |
|---|---|---|
| Missing binding (a bound variable that no longer resolves, on any property: padding, fill, max width, visibility, effects, a text range's font size…) | Blocker | Blocker |
| Hand-set colour, spacing, radius; text without a text style | Blocker | Blocker inside a Ready for dev frame or section, Warning elsewhere |
| Hand-set stroke weight | Warning | Warning |
| Unused token | Suggestion | not reported |

A hand-set stroke weight is only a warning because the DS has no stroke token for 1 px borders yet
(only `Stroke/icon-small` 1.5 and `Stroke/icon-big` 2.5); a `Stroke/border` token is Nelson's call.
A value of 0 is never a finding, and only visible solid fills count as colours. A colour keeps its
alpha: a black at 50% reads `#00000080`, and matches only a token with the same alpha. Layer
findings never stop Publish: only the two export blockers above do.

**The suggested token.** Colours: the token of the right family (`bg/`, `border/`, `text/`,
`icon/`) with the same value, else the nearest with its ΔE ("nearest bg/muted, ΔE 2.1", plus
"· alpha 50%" when the alpha differs). Spacing: `Spacing/*`, `Layout/*` and `Container/*`; radius:
the `Radius/*` roles; stroke weight: `Stroke/*`. Each gives the token with the same value, else the
nearest with the value set ("Stroke/icon-small 1.5, set 1"). Text: the style with the same font,
size and line height.

**The verdict and the covered line.** The covered line names the scope and counts the layers
checked: "layers: Ready for dev, 1,240 layers". When it checked none, the verdict is not "Ready":
it says "Nothing to audit: no layer marked Ready for dev in scope" (Ready for dev), or "Nothing to
audit in this scope" (other scopes). A token blocker still reads "Not ready".

**The report.** Layer findings are grouped by page, then by top-level frame or component, folded,
with a count: "Course Detail / Desktop · 14 hand-set colours". A group shows its first 50 lines; **+N
more** shows the rest. A line reads layer · property · value · the token it could be bound to.
Click a line to select that layer in Figma and scroll to it; if it was deleted since the run, the
line says "This layer no longer exists". Token findings still copy their name on click.
**Copy report** copies the whole report as plain text, grouped as on screen, one finding per line.

**Why "unused" needs a recent whole-file ICP run.** A token is unused only if no layer in the DS and no
screen uses it, and the plugin cannot see another file. Each whole-file run on a screens file stores
the token keys it saw; the library audit reports unused tokens only when such a run is at most 7
days old, and the "Covered" line names the files; older runs do not count. Otherwise "unused
tokens" stays under not covered: run **Whole file** on the ICP first, then audit the library.
Motion tokens (`3. Motion`) are never reported: no layer property can bind them.

## Download the JSON

**Download variables.json** saves the export on this computer, no GitHub needed: the same file
the prototype and the dev token package read (format `skillup-figma-tokens/1`).

Tick **Also the standard format (W3C DTCG)** to get one `skillup-tokens.zip` instead (Figma starts
only one download per click): `variables.json` plus a `skillup-tokens-dtcg/` folder with

- one `*.tokens.json` per collection and mode (`sko-semantics/sko-light`, `responsive/mobile`,
  `motion/value`, `skin-shape/harbor`…), in the DTCG draft format that Style Dictionary 4 and
  Tokens Studio read;
- aliases inside a collection stay `{group.token}` references; aliases across collections are
  resolved;
- `text-styles.tokens.json`: the 47 text styles as typography tokens, with font family and size
  referring to `Type/*`, so they follow the responsive mode you load;
- `5. Scope` is left out (a Figma review switch, not a token for code).

Load one mode file per collection. Tested on 12 Nov 2026 with Style Dictionary 4 (`css/variables`):
its CSS `font` shorthand has no letter-spacing, so read `letterSpacing` from the token if needed.

## What is generated, and what is not

| Figma | CSS (`tokens/generated/`) | Used by |
|---|---|---|
| 1. SKO-Semantics 🎨, colours, 10 modes | `colors.css`: `--color-*` per SKO / Gold / Studio / Harbor / Fluent × light / dark | every `bg-sko-*`, `text-sko-*`, `border-sko-*` |
| 2. Responsive 📐 `Radius/*` roles | `radius.css`: `--sk-radius-*` | `rounded-control`, `rounded-card`… |
| 2. Responsive 📐 `Type/*` + the 47 text styles | `typography.css`: `--sk-type-*` (Desktop / Tablet / Mobile) and `.sk-text-*` | every text class |
| 2. Responsive 📐 `Spacing/*`, `Container/*` | `spacing.css`: `--sk-space-*`, `--sk-container-*` | nothing yet: components use Tailwind's 4px scale (`tokens/spacing.md`) |
| 3. Motion | `motion.css`: `--motion-*` | `duration-*`, `ease-*` |

Not in Figma, so still written by hand next to the generated files: the colour-vision mode, the
legacy `--sk-*` aliases, the system preferences (`tokens/colors.css`), reduced motion
(`tokens/motion.css`), the font stacks
(`tokens/typography.css`) and Studio's radius, shadows and type weights (`tokens/direction-studio.css`).

## Commands

```bash
pnpm tokens:build     # tokens/figma/variables.json → tokens/generated/*.css
pnpm tokens:check     # fails if tokens/generated is not what the JSON gives
pnpm tokens:compare   # what changes on the page against origin/main, in every mode
```

`tokens:compare -- --strict` exits 1 on any difference; it is how the switch to generated files
was proven: 35 contexts (8 colour modes, nested dark and light regions, colour-vision mode,
desktop / tablet / mobile widths and the forced device preview), 0 differences.
