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
   Fine-grained tokens → Generate. Repository access: only `nvjeronimo/skillup-lms-prototype`.
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

## What is generated, and what is not

| Figma | CSS (`tokens/generated/`) | Used by |
|---|---|---|
| 1. SKO-Semantics 🎨, colours, 8 modes | `colors.css`: `--color-*` per SKO / Gold / Red / Studio × light / dark | every `bg-sko-*`, `text-sko-*`, `border-sko-*` |
| 2. Responsive 📐 `Radius/*` roles | `radius.css`: `--sk-radius-*` | `rounded-control`, `rounded-card`… |
| 2. Responsive 📐 `Type/*` + the 47 text styles | `typography.css`: `--sk-type-*` (Desktop / Tablet / Mobile) and `.sk-text-*` | every text class |
| 2. Responsive 📐 `Spacing/*`, `Container/*` | `spacing.css`: `--sk-space-*`, `--sk-container-*` | nothing yet: components use Tailwind's 4px scale (`tokens/spacing.md`) |
| 3. Motion | `motion.css`: `--motion-*` | `duration-*`, `ease-*` |

Not in Figma, so still written by hand next to the generated files: the colour-vision mode, the
legacy `--sk-*` aliases, the system preferences (`tokens/colors.css`), the square-corners switch
(`tokens/radius.css`), reduced motion (`tokens/motion.css`), the font stacks
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
