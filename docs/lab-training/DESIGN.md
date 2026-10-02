---
name: The Training Block (lab)
scope: '[data-world="training"]'
routes: /lab/training, /lab/training/plans, /lab/training/course/six-sigma
source: tokens/lab-training.css
colors:
  ground: "#f2f4f3"
  sheet: "#ffffff"
  ink: "#0e2b34"
  ink-2: "#3c5660"
  ink-3: "#5b727a"
  rule: "#d5dcdc"
  teal: "#26708e"
  teal-deep: "#1b5268"
  teal-wash: "#e3eef2"
  now: "var(--color-bg-accent-yellow) #f9c654 (SKO DS)"
  on-now: "var(--color-text-on-accent-yellow) #13282f (SKO DS)"
typography:
  display: { family: "Montserrat", weight: 600, size: "clamp(2rem, 1.5rem + 2vw, 3.25rem)", lineHeight: 1.1, letterSpacing: "-0.02em" }
  h1: { family: "Montserrat", weight: 600, size: "clamp(1.75rem, 1.4rem + 1.4vw, 2.5rem)", lineHeight: 1.15, letterSpacing: "-0.02em" }
  h2: { family: "Montserrat", weight: 600, size: "1.25rem", lineHeight: 1.3 }
  title: { family: "Montserrat", weight: 600, size: "1.25rem", lineHeight: 1.25 }
  body: { family: "Montserrat", weight: 400, size: "1rem", lineHeight: 1.5 }
  body-s: { family: "Montserrat", weight: 400, size: "0.875rem", lineHeight: 1.45 }
  label: { family: "Montserrat", weight: 600, size: "0.8125rem", lineHeight: 1.3 }
  meta: { family: "Montserrat", weight: 400, size: "0.8125rem", lineHeight: 1.4, numeric: tabular-nums }
rounded:
  sheet: 3px
  button: 3px
  toggle: 2px
  mark: 1px
  day-mark: 9999px
spacing:
  page-max: 880px
  bar-max: 1280px
  gutter: "16px / 32px (md)"
  section-gap: "40px–48px, opened by a 1px rule"
  target-min: 44px
components:
  button-primary: { bg: teal, fg: "#ffffff", hover: teal-deep, minHeight: 52px, font: "text 600 1rem" }
  button-quiet: { bg: transparent, fg: ink, border: "inset 1.5px ink", minHeight: 44px }
  link: { fg: teal, weight: 600, underline: "1.5px, offset 3px", minHeight: 44px }
  day-mark: { size: 40px, radius: 9999px }
  mark: { size: 12px, radius: 1px }
---

# The Training Block — design system (lab)

> **29 Sep, second pass:** type moved to Montserrat and the today accent to SKO `bg/accent-yellow` (the lime was retired), both read from the DS tokens, as a first step toward integration.
>
> **Scope.** This documents the `/lab/training` exploration only, scoped to `[data-world="training"]` in `tokens/lab-training.css`. It is not the SkillUp design system: the SkillUp DS in Figma stays the visual authority. Integrating anything here into the SkillUp DS is a later, separate step.

## 1. Overview

Learning as a periodised training plan you follow week by week. Falling behind re-plans the block; it never marks a failure. The world is a printed plan on a chalk track: white sheets and hairline rules over a cool ground, one condensed display face for the few big titles, a plain grotesk for everything you read. Only the SkillUp logo and SkillUp teal come from the product; everything else belongs to this world.

Pages built: Today (`app/lab/training/View.tsx`), Plans (`app/lab/training/plans/`), the Six Sigma course plan (`app/lab/training/course/six-sigma/`). Navigation: `components/lab/training/TrainingNav.tsx`. Fonts are loaded in `app/lab/training/layout.tsx`.

## Distilled (29 Sep)

The first version was cognitively overwhelming. It was distilled, and this record describes the distilled build.

- **The principle.** One job per page, and one primary action per page. Three marks only: done, today/next, planned. One accent: accent yellow means today, and it is the only accent yellow on a page. Moved and live are said in words ("moved from last week", "Live session · 18:00"), never drawn as their own colour or pattern.
- **Two voices.** The condensed display face is only for page titles and today's session title. Everything else is the text face in sentence case: section headings, labels, navigation, buttons.
- **One MockTag per page**, at the bottom.
- **What each page is for.** Today: start today's session. Plans: pick a plan. Course plan: continue, and see what is left.
- **Removed, for cognitive load:** session blocks sized by minutes, topic blocks sized by width, hatching and dashed "moved" outlines, the green "live" colour, 12-week strips, the load meter and the legends, the road to race day, the race-day and "around this plan" blocks, the re-plan slide-in motion, the large numeral sizes, and condensed uppercase labels and buttons. Their tokens (`--tb-live`, `--tb-live-wash`, `--tb-now-deep`) are gone from the stylesheet.

## 2. Colors — one rule per colour

| Token | Role, and the only role |
|---|---|
| `--tb-ground` | Page ground. Cool chalk, never cream. |
| `--tb-sheet` | The printed plan: the nav bar, the "Change days" panel. |
| `--tb-ink` | Text; the done day mark (ink circle with a check); a pressed day toggle; the avatar; the desktop nav current bar. |
| `--tb-ink-2` / `--tb-ink-3` | Secondary (7.3:1) and tertiary (4.9:1) text on white. Ink-2 also draws the done check on the course plan; ink-3 draws the lock and the rest-day dot. |
| `--tb-rule` | 1px hairlines between rows and above each section. |
| `--tb-teal` | **The plan.** Planned marks (1.5px teal outline), the primary button, links, focus ring. |
| `--tb-teal-wash` | The current-tab pill in the phone tab bar. Nothing else. |
| `--tb-now` | **Today.** Today's day mark on Today; the next topic's mark on the course plan. |

**The One Accent Rule.** Accent yellow is on one thing per page: the mark that is today (or, on the course plan, today's next topic). Never on navigation, a button, a heading, a row fill or a status. Anything accent yellow carries a 1.5px ink inset or ink text (12.9:1).

**The Said-in-Words Rule.** A moved session or topic is a normal planned row whose meta line says so ("moved from last week", "moved from week 3"). A live session is a normal row whose meta line says "Live now" or "Live session · time". No colour, outline or pattern marks either.

**Navigation current page.** Desktop: ink text with a 4px ink bar at the bottom. Phone tab bar: ink icon and label, icon inside a teal-wash pill. Never accent yellow.

**Out-of-world colour.** `MockTag` uses the SkillUp DS warning tokens (`sko-*`) on purpose so mocked values read the same across every lab world.

## 3. Typography — one family, two sizes of voice

- **One family: Montserrat, the SKO DS face** (`--tb-font-display` / `--tb-font-text` alias `--sk-font-display` / `--sk-font-body`). The page title (`.tb-h1`, 600, 28–40px fluid, on Plans and the course plan) and today's session title (`.tb-display`, 600, 32–52px fluid, on Today, where the page's own h1 is visually hidden). Nowhere else.
- **Montserrat 400 / 600**, sentence case throughout: section headings (`.tb-h2`, 20px/600), row and module titles (`.tb-title`, 20px/600), body 16px, body-s 14px, meta 13px in tabular figures, and labels (`.tb-label`, 13px/600) for nav items, day toggles, lesson names and the avatar initials. Emphasis is `.tb-strong` (600).
- Every size multiplies by `--sk-font-scale`. Text never goes below 13px.
- **No kickers or eyebrows above headings.** The one exception is the date line above today's session title ("Tuesday 30 September"), in body-s ink-2. "Next · " sits inline at the start of a meta line, never above a heading.

## 4. Elevation and surface

Flat. No shadows. Depth comes from the sheet on the ground and 1px hairlines between rows and above sections. Content sits in a single 880px column; only the nav bar runs to 1280px. Radii are small and fixed: 3px sheets and buttons, 2px day toggles, 1px topic marks. Circles are the 40px day marks, the avatar and the phone-tab pill.

## 5. Components

- **Day mark (Today, "This week").** Seven 40px circles in a row, one per day, weekday above. Done: ink fill with a white check. Today: accent yellow. Planned: 1.5px teal outline. Rest day: a 4px ink-3 dot. Each day's accessible name gives the date, the state word and the session count.
- **Topic mark (course plan).** Done: a 16px check in ink-2. Next: a 12px accent yellow square with a 1.5px ink inset. Planned: a 12px square with a 1.5px teal outline. Locked: a 14px lock in ink-3, with the reason printed in the meta line.
- **Row.** Title in the text face, one meta line beneath in ink-2 (`kind · minutes`, then only facts that change what the learner does: graded, moved, locked reason). Rows are separated by 1px rules and are at least 44px tall; hover underlines, nothing moves.
- **Module accordion (course plan).** Each module is a 56px button with its title and "n of m done", and a chevron that rotates (off under reduced motion). The module holding the next topic opens by default.
- **Plan row (Plans).** Title (links to the course plan where one exists), one status line, one action. Rows are grouped under sentence-case headings (In progress, Ready to start, Opens later, Finished) only when there is more than one group.
- **Buttons.** Primary: teal, 52px, text face 600, at most one per page (Today: "Start session"; course plan: "Continue"; Plans: only the plan whose next session is today, otherwise none). Quiet: 1.5px ink inset, 44px, for every other action. Links: teal 600, 1.5px underline, 44px target.
- **Navigation.** 64px sheet bar with logo, Today / Plans / Calendar / Certificates in the label style, and the persona avatar (ink circle, initials); on phones a fixed bottom tab bar of four 64px targets with Lucide icons. Calendar and Certificates are not built in this lab: they render as `aria-disabled` items in ink-3 with a screen-reader note, never as links to `#`.

## 6. Signature interaction — Change days

Keeping the plan is the default, so there is no "Keep this plan" button. After a break, Today's status line says what moved in one sentence ("…we moved 3 sessions into this week. Nothing was dropped.") and offers **Change days**: a link-styled `aria-expanded` disclosure that opens a sheet with seven day toggles (`aria-pressed`; on = ink fill, off = teal outline), a quiet "Use these days" button (disabled when no day is picked), and a `role=status` line ("Moved onto Wed, Thu, Sat. Lab demo — nothing is saved." or "Pick at least one day."). No motion.

## 7. Rules for the lab

- **Icons** are Lucide through `Icon` (`@/lib/icons`). No Unicode glyph icons.
- **Targets** are at least 44px on mobile; nav targets 64px.
- **Focus**: 3px teal outline, 2px offset.
- **Motion**: buttons 160ms `cubic-bezier(0.2, 0.8, 0.2, 1)`; the accordion chevron rotates. Both off under reduced motion. Nothing else moves.
- **Unwired actions** use `DemoAction`: a real button that announces "Lab demo — this action isn't wired yet." in a `role=status` line. No `href="#"` pretending.
- **Mock data** carries one `MockTag` per page, at the bottom, with its reason in full. Real vs mock (from `lib/lab/training-plan.ts` and `course/six-sigma/plan-model.ts`): REAL — course titles, module/lesson/topic titles, types, durations, locks, progress %, certificate status. MOCK — the weekly plan and days, the plan week, the certificate date, persona done sets, the re-plan moves, and "today" (fixed at Tuesday 30 September).

## 8. Do's and Don'ts

- Do give each page one job and at most one primary button.
- Do keep to three marks (done, today/next, planned) and say every other state in words.
- Do keep finished sessions and topics visible.
- Do say "moved" and "nothing was dropped"; never label a session late, overdue or missed.
- Don't put accent yellow on anything that is not today, and never on more than one thing per page.
- Don't use the display face for anything but page titles and today's session title; don't set labels or buttons in uppercase.
- Don't use shadows, cards-with-progress-bars grids, legends, or a welcome banner.

## 9. Open

None. The three earlier reviewer items (road to race day as week marks, per-day minute totals, re-plan motion from the missed day) described components the distill removed.
