# SkillUp LMS — Prototype + Storybook

A Next.js 14 prototype of the SkillUp learner platform (dashboard, My Learning, course and
program pages, and the course player) plus Storybook for the design-system components.

Built from the Figma SKO Design System. Colour, type, radius, spacing and motion values come
from the token export — no hardcoded hex, no raw `font-size` / `font-weight`.

`main` is **Next.js 14 and React 18**. [Draft PR #492](https://github.com/nvjeronimo/skillup-lms-prototype/pull/492)
migrates the prototype to Vite and React 19. That stack is not current.

## Live

| What | URL |
|------|-----|
| Prototype (Vercel) | <https://lms-prototype-mu.vercel.app> |
| Storybook (GitHub Pages) | <https://nvjeronimo.github.io/skillup-lms-prototype/> |

The prototype is the Vercel project for this repo (`vercel.json` runs `next build`). Storybook
is published to GitHub Pages by `.github/workflows/storybook.yml`. A push to `main` rebuilds it
when tokens, stories, components, `.storybook/`, `app/globals.css`, or `tailwind.config.ts`
change. A Figma token auto-merge does not start that push: the squash uses the workflow
token, so `tokens.yml` dispatches Storybook once the merge commit is on `main`. A person
merging that pull request does start the workflow. Deploy notes for the
prototype and the assistant key are in [DEPLOY.md](DEPLOY.md).

## Tech stack

- **Next.js 14** (App Router) + **React 18** + **TypeScript**
- **Tailwind CSS 3** — the `sko` scale (`bg-sko-*`, `text-sko-*`, `border-sko-*`) maps each utility to a `--color-*` variable
- **Storybook 8** (`@storybook/nextjs`) + a11y + interactions addons
- **Zustand** for client state
- **lucide-react** for icons (stroke-weight rule enforced centrally)
- **Montserrat** for the whole UI (body and display) via `next/font/google`. Inter is not used (`tokens/typography.css`). Other families load only for skins: Inter Tight (Studio), Plus Jakarta Sans and Figtree (Harbor), Open Sans (Fluent)

## Tokens

The source of truth is `tokens/figma/variables.json`, the export from the Figma plugin
(`figma-plugin/`). `pnpm tokens:build` writes `tokens/generated/*.css` (`colors`, `typography`,
`spacing`, `radius`, `motion`). `pnpm tokens:check` exits 1 if those files are not what the JSON
gives.

`stories/figmaTokens.ts` is not generated. It imports the same JSON so the Foundations stories
show the values the CSS was built from.

`tokens/colors.css` is not the source of the values. It holds the legacy `--sk-*` aliases and
the system preferences. Font stacks stay in `tokens/typography.css`. What is generated and what
is still written by hand is listed in [figma-plugin/README.md](figma-plugin/README.md).

## Figma plugin

`figma-plugin/` is the development plugin **SkillUp · Publish tokens**
(`figma-plugin/manifest.json`). It runs in Figma desktop, compares the SKO Design System with
`main`, and can open a pull request that updates `tokens/figma/variables.json`. The
[Tokens from Figma](.github/workflows/tokens.yml) workflow then regenerates the CSS and, after an
auto-merge, dispatches the Storybook publish. Install, publish, and the dev-token package
are documented in [figma-plugin/README.md](figma-plugin/README.md).

## Getting started

```bash
pnpm install
pnpm dev          # prototype  → http://localhost:3000
pnpm storybook    # storybook  → http://localhost:6006
```

Scripts in `package.json`:

```bash
pnpm dev              # next dev
pnpm build            # next build
pnpm start            # next start
pnpm lint             # next lint
pnpm typecheck        # tsc --noEmit
pnpm format           # prettier --write .
pnpm storybook        # storybook dev -p 6006
pnpm build-storybook  # static Storybook to ./storybook-static
pnpm lint:tokens      # node scripts/check-tokens.mjs — raw colours, type, motion, radius
pnpm test             # vitest run
pnpm tokens:build     # tokens/figma/variables.json → tokens/generated/*.css
pnpm tokens:check     # fail if tokens/generated is not what the JSON gives
pnpm tokens:compare   # what a token change does on the page, against origin/main
```

> Requires Node 18+ and pnpm `11.5.1` (`packageManager` in `package.json`). `pnpm-workspace.yaml`
> sets `allowBuilds`: `esbuild` runs (vitest and Storybook need that binary) and `sharp`,
> `core-js-pure`, and `unrs-resolver` are skipped, so a plain `pnpm install` completes.
> [CI](.github/workflows/ci.yml) runs on every pull request and every push to `main`
> (`tokens:check`, `lint:tokens`, `typecheck`, `lint`, `test`, `build`) on Node 22. The Storybook
> and token workflows use Node 22 as well.

## Routes

`/` redirects to `/platform/dashboard` (the learner home).

| Route | Screen |
|-------|--------|
| `/platform/dashboard` | Dashboard |
| `/platform/my-learning` | My Learning |
| `/platform/course/[slug]` | Course page |
| `/platform/program/[slug]` | Program page |
| `/course/[courseSlug]/topic/[topicId]` | Player · **Transcript** tab (default) |
| `/course/[courseSlug]/topic/[topicId]/notes` | **Notes** tab |
| `/course/[courseSlug]/topic/[topicId]/downloads` | **Downloads** tab |

Other pages live under `/platform` (calendar, certificates, discussion, profile, services),
`/account` (a stand-in sign-in for the account-deletion flow), `/lab`, and `/partner/[partner]`.

YouTube’s official embed and the SCORM packages are in the test program
`/platform/program/scorm-and-youtube-tests`.

## Project structure

```
app/                         # App Router pages, player shell, platform routes
  layout.tsx                 # fonts + global token CSS
  page.tsx                   # → redirect to /platform/dashboard
  globals.css                # imports tokens/generated/* then the hand-written token files
  course/[courseSlug]/topic/[topicId]/
    layout.tsx               # mounts <PlayerShell>
    page.tsx                 # Transcript tab
    notes/page.tsx           # Notes tab
    downloads/page.tsx       # Downloads tab
  platform/                  # Dashboard, My Learning, course, program, …
components/
  atoms/ molecules/ organisms/ views/
figma-plugin/                # SkillUp · Publish tokens (Figma development plugin)
lib/
  types.ts                   # Topic / Note / Course / panel / notification-category / video-state
  store.ts                   # Zustand client state (theme, sidebar, toasts, …)
  analytics.ts               # track(event, props) shim (Do-Not-Track aware)
  icons.tsx                  # <Icon> wrapper that enforces the stroke-weight rule
  useBreakpoint.ts           # mobile / tablet / desktop hook
  playback/                  # sample video + YouTube player hook
  scorm-runtime.ts           # SCORM 1.2 API the package iframe talks to
tokens/
  figma/variables.json       # source of truth (Figma plugin export)
  generated/                 # colors, typography, spacing, radius, motion (tokens:build)
  colors.css                 # legacy --sk-* aliases and system preferences
  typography.css             # font stacks (Montserrat). Sizes are generated.
  spacing.md                 # spacing scale. Breakpoint edges: lib/useBreakpoint.ts
stories/
  figmaTokens.ts             # reads tokens/figma/variables.json for Foundations
  Foundations.*.stories.tsx
                             # component stories are co-located as *.stories.tsx
```

## Design-system rules honored

- **No hardcoded hex.** Components style via `bg-sko-*` / `text-sko-*` / `border-sko-*`
  (→ `var(--color-*)`). Translucent surfaces use
  `color-mix(in srgb, var(--color-…) N%, transparent)` — never `rgba()` with literals.
  `pnpm lint:tokens` exits if it finds a raw colour.
- **No raw font sizing.** Text uses the `.sk-text-*` classes generated into
  `tokens/generated/typography.css`.
- **Icon stroke weight.** `lib/icons.tsx` `<Icon>` applies `1.5` below 24px and `2` at/above 24px to every SVG.
- **Topic Footer Nav is sacred** — Previous · Unit info / Title · Next. No middle action chip.
- **`approx.` duration prefix** applied for estimated topic types only (Reading/Lab/Activity/
  Project/Practice/Graded/Peer-graded/Peer Review); never for Video/Recording/Live/timed Quiz.
- **Module completed state** shows the module number and a soft success Badge, “Completed”
  (`components/atoms/ModuleInfo.tsx`).
- **Right-overlay panels** (Notifications + Saved) are mutually exclusive, close on Esc + backdrop,
  and trap focus (first focus = close X).

## Interactions implemented

Sidebar collapse, module expand/collapse, topic navigation, bookmark toggles,
transcript seek + line highlight, **note editor** anchored to transcript lines
(Esc cancels · ⌘/Ctrl+Enter saves), Notes tab search + tag filter + delete, Downloads
(mock), tab routing, Notifications + Saved overlay panels, mobile drawer. The player theme
control switches light and dark (`data-theme`). Close returns to the course page.

## Dark theme, YouTube, and SCORM

Dark theme is in the prototype: `data-theme="dark"` (generated colour modes in
`tokens/generated/colors.css`, toggled from the player and stored in `lib/store.ts`).

Video and packages:

- **YouTube official embed** — the YouTube Video Test course plays through
  `components/molecules/YouTubeEmbed.tsx` (`https://www.youtube-nocookie.com/embed/…`).
  That course’s notes say YouTube inside the prototype player was withdrawn on 12 Nov 2026.
- **SCORM packages** — files under `public/scorm/` play in an iframe
  (`components/molecules/ScormContainer.tsx`) and talk to `lib/scorm-runtime.ts` (SCORM 1.2).
- **Sample file** — other Video topics use `lib/playback/sampleVideo.ts`. Playback needs
  `NEXT_PUBLIC_SAMPLE_VIDEO_SRC` (a signed URL). Without it the player stays on the poster.

## The assistant

A floating chat on every platform page and in the player (`components/assistant`,
`lib/assistant`): it answers questions about the platform and the learner's courses, with
buttons to the right place, and never changes anything. For a learner who has just arrived it opens once with five first steps that tick themselves (`lib/first-steps`), and it always shows the one thing to do next.

**Testing first steps at any moment.** Add `?first-steps=restart` to any prototype address, for example
`https://lms-prototype-mu.vercel.app/platform/dashboard?first-steps=restart`: the first steps start again with an
empty conversation, the window opens by itself after a moment (desktop and tablet; on a phone the launcher shows
5), and the parameter leaves the address so a reload does not restart again. The same reset is in the menus:
*Restart first steps* in the profile panel of the platform pages and in the player's demo menu. Scripted by default; Claude when
`ANTHROPIC_API_KEY` is set (see DEPLOY.md). Design: `docs/superpowers/specs/2026-10-13-assistant-design.md`.

## edX-parity additions (handoff v1.2 → v1.5)

- **Video Chrome Footer** below the player — license/copyright, CC toggle, multi-language
  caption picker, and download-transcript (.srt / .txt).
- **Notifications hybrid tabs** — All · Discussions · Grading · Updates category tabs with
  date sections inside each (arrow-key navigable, 2px brand underline on the active tab).
- **Certificate footer** — Back · Share · Download PDF · **Print** (`window.print()` with a
  `.sk-no-print` scope). Share opens a channel menu (LinkedIn / X / Facebook / Copy / Email).
- **Video edge states** — Loading / Error / Ended overlays on the player.
- **Tab empty states** — dedicated Notes-empty and Downloads-empty blocks.
- **Bookmark toast feedback** — "Bookmarked · {title}" with an **Undo** action, 4 s
  auto-dismiss paused on hover, announced via an `aria-live` region.
- **Transcript auto-scroll** — follows the active line; pauses 8 s on manual scroll and shows
  a "Following · Resume" pill.
- **File Upload Zone** + **Share Menu** + **Empty State** components (documented in Storybook).
- **Accessibility** — contextual `aria-label`s ("Notifications, 3 unread", "Bookmark {title}",
  "Add note at 0:38"), focus traps, and `prefers-reduced-motion` honored (animations + smooth
  scroll disabled).
- **Analytics** — `lib/analytics.ts` `track()` wired to key events (bookmark, note, panel,
  transcript, video, download, sidebar, drawer).

## Responsive

Edges are `lib/useBreakpoint.ts`, the same cut the generated token CSS uses
([PR #485](https://github.com/nvjeronimo/skillup-lms-prototype/pull/485)): phone below 768,
tablet from 768 through 1023, desktop from 1024. Generated spacing and type switch with
`max-width: 1023px` (tablet) and `max-width: 767px` (mobile).

| Breakpoint | Width | Behavior |
|------------|-------|----------|
| Mobile | < 768 | Sidebar is not inline; the menu opens a left drawer. Compact topbar. |
| Tablet | 768–1023 | Inline sidebar, expanded by default, user-collapsible. |
| Desktop | ≥ 1024 | Same sidebar: expanded by default, user-collapsible. |

The collapsed course sidebar is 72px wide. The expanded one is at least 280px and at most 400px
(`components/organisms/Sidebar.tsx`).

## Storybook

One `*.stories.tsx` per component (atoms / molecules / organisms) plus
`Foundations/Colors`, `Foundations/Typography`, `Foundations/Spacing`. Foundations read
`tokens/figma/variables.json` through `stories/figmaTokens.ts`. Stories use `argTypes` controls,
an `in-context` story per major component, and the a11y addon.

Published build: <https://nvjeronimo.github.io/skillup-lms-prototype/>.
