# SkillUp LMS — Prototype + Mini Storybook

A Next.js 14 prototype of the SkillUp LMS **Video lesson flow** (Transcript / Notes /
Downloads tabs, sidebar collapse, notes-on-transcript, right-overlay panels) plus a
**mini Storybook** documenting ~30 reusable UUI Extension components.

Built from the Figma source of truth. Color + type come exclusively from design tokens —
no hardcoded hex, no raw `font-size` / `font-weight`.

## Tech stack

- **Next.js 14** (App Router) + **React 18** + **TypeScript**
- **Tailwind CSS 3** — an `lms` color scale that maps every utility to a CSS variable in `tokens/colors.css`
- **Storybook 8** (`@storybook/nextjs`) + a11y + interactions addons
- **Zustand** for client state
- **lucide-react** for icons (stroke-weight rule enforced centrally)
- **Inter** (body) + **Montserrat** (display) via `next/font/google`

## Getting started

```bash
pnpm install
pnpm dev          # prototype  → http://localhost:3000
pnpm storybook    # storybook  → http://localhost:6006
```

Other scripts:

```bash
pnpm build            # production build of the app
pnpm build-storybook  # static Storybook to ./storybook-static
pnpm lint             # next lint
pnpm format           # prettier --write .
```

> Requires Node 18+ and pnpm. `esbuild` + `sharp` build scripts are pre-approved in
> `pnpm-workspace.yaml`, so `pnpm install` runs clean.

## Routes

| Route | Screen |
|-------|--------|
| `/` | Redirects to the active video topic |
| `/course/[courseSlug]/topic/[topicId]` | Video player · **Transcript** tab (default) |
| `/course/[courseSlug]/topic/[topicId]/notes` | **Notes** tab |
| `/course/[courseSlug]/topic/[topicId]/downloads` | **Downloads** tab |

Start at <http://localhost:3000> → you land on
`/course/six-sigma/topic/m3-t1` (the Active video from the mock data).

## Project structure

```
app/                         # App Router pages + the player layout/shell
  layout.tsx                 # fonts + global token CSS
  page.tsx                   # → redirect to the active topic
  course/[courseSlug]/topic/[topicId]/
    layout.tsx               # mounts <PlayerShell> (shared chrome)
    page.tsx                 # Transcript tab
    notes/page.tsx           # Notes tab
    downloads/page.tsx       # Downloads tab
components/
  atoms/                     # Button, badges, Avatar, Bookmark, CompletionStatus, …
  molecules/                 # TopicRow, ModuleHeader, TranscriptLine, NoteItem, panel items, …
  organisms/                 # Sidebar, Topbar, FooterNav, VideoPlayer, OverlayPanel, panels, …
  views/                     # PlayerShell + the three tab bodies
lib/
  types.ts                   # Topic / Note / Course / panel / notification-category / video-state
  data.ts                    # loads data-model.json + derived selectors + mock panel data
  store.ts                   # Zustand client state (+ toast model with Undo action)
  analytics.ts               # track(event, props) shim (Do-Not-Track aware) — ~30 Phase 1 events
  icons.tsx                  # <Icon> wrapper that enforces the stroke-weight rule
  useBreakpoint.ts           # mobile / tablet / desktop hook
tokens/
  colors.css                 # 28 LMS color variables (source of truth)
  typography.css             # .lms-text-* utility ramp
  spacing.md                 # spacing scale reference
stories/                     # Foundations (Colors / Typography / Spacing)
                             # component stories are co-located as *.stories.tsx
```

## Design-system rules honored

- **No hardcoded hex.** Components style via `bg-lms-*` / `text-lms-*` / `border-lms-*`
  (→ `var(--lms-*)`). Translucent surfaces (backdrops, video chrome) use
  `color-mix(in srgb, var(--lms-…) N%, transparent)` — never `rgba()` with literals.
- **No raw font sizing.** Text uses the `.lms-text-*` classes from `tokens/typography.css`.
- **Icon stroke weight.** `lib/icons.tsx` `<Icon>` applies `1.5` below 24px and `2` at/above 24px to every SVG.
- **Topic Footer Nav is sacred** — Previous · Unit info / Title · Next. No middle action chip.
- **`approx.` duration prefix** applied for estimated topic types only (Reading/Lab/Activity/
  Project/Practice/Graded/Peer-graded/Peer Review); never for Video/Recording/Live/timed Quiz.
- **Module Header completed state** binds the eyebrow to `--lms-text-success-primary` + a green check.
- **Right-overlay panels** (Notifications + Saved) are mutually exclusive, close on Esc + backdrop,
  and trap focus (first focus = close X).

## Interactions implemented

Sidebar collapse (200 ms), module expand/collapse, topic navigation, bookmark toggles,
transcript seek + line highlight, **note editor** anchored to transcript lines
(Esc cancels · ⌘/Ctrl+Enter saves), Notes tab search + tag filter + delete, Downloads
(mock), tab routing, Notifications + Saved overlay panels, mobile drawer, and the
out-of-scope topbar actions (AI / Theme / Exit) surface a toast.

## edX-parity additions (handoff v1.2 → v1.5)

- **Video Chrome Footer** below the player — license/copyright, CC toggle, multi-language
  caption picker, and download-transcript (.srt / .txt).
- **Notifications hybrid tabs** — All · Discussions · Grading · Updates category tabs with
  date sections inside each (arrow-key navigable, 2px brand underline on the active tab).
- **Certificate footer** — Back · Share · Download PDF · **Print** (`window.print()` with a
  `.lms-no-print` scope). Share opens a channel menu (LinkedIn / X / Facebook / Copy / Email).
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

| Breakpoint | Width | Behavior |
|------------|-------|----------|
| Mobile | ≤ 768 | Sidebar hidden → ☰ opens a left drawer; compact topbar + footer |
| Tablet | 769–1024 | Sidebar collapsed (72px); no breadcrumb |
| Desktop | ≥ 1025 | Sidebar expanded (280px), user-collapsible; full breadcrumb |

Verified at 375 / 768 / 1440.

## Storybook

One `*.stories.tsx` per component (atoms / molecules / organisms) plus
`Foundations/Colors`, `Foundations/Typography`, `Foundations/Spacing`. Stories use
`argTypes` controls, an `in-context` story per major component, and the a11y addon.

## Out of scope

Real backend / API, auth, real video playback (a branded gradient + scrubber stands in),
dark mode, and non-video lesson types — all per the handoff brief.
