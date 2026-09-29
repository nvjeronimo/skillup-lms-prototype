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
  rule-strong: "#0e2b34"
  teal: "#26708e"
  teal-deep: "#1b5268"
  teal-wash: "#e3eef2"
  lime: "#c8f169"
  lime-deep: "#a9d93e"
  done: "#7d8f96"
  done-wash: "#e4e8e9"
  live: "#1f7a47"
  live-wash: "#e2f3e8"
typography:
  display: { family: "Big Shoulders Display", weight: 800, size: "clamp(2.5rem, 1.6rem + 3.2vw, 4.75rem)", lineHeight: 0.95, letterSpacing: "-0.01em" }
  h1: { family: "Big Shoulders Display", weight: 800, size: "clamp(2rem, 1.5rem + 1.8vw, 3rem)", lineHeight: 1 }
  h2: { family: "Big Shoulders Display", weight: 800, size: "1.5rem", lineHeight: 1.05, letterSpacing: "0.02em", transform: uppercase }
  label: { family: "Big Shoulders Display", weight: 800, size: "0.8125rem", lineHeight: 1.2, letterSpacing: "0.08em", transform: uppercase }
  num-xl: { family: "Big Shoulders Display", weight: 800, size: "3.5rem", numeric: tabular-nums }
  num-l: { family: "Big Shoulders Display", weight: 800, size: "2rem", numeric: tabular-nums }
  num-m: { family: "Big Shoulders Display", weight: 800, size: "1.375rem", numeric: tabular-nums }
  title: { family: "Hanken Grotesk", weight: 600, size: "1.25rem", lineHeight: 1.25 }
  body: { family: "Hanken Grotesk", weight: 400, size: "1rem", lineHeight: 1.5 }
  body-s: { family: "Hanken Grotesk", weight: 400, size: "0.875rem", lineHeight: 1.45 }
  meta: { family: "Hanken Grotesk", weight: 400, size: "0.8125rem", lineHeight: 1.4, numeric: tabular-nums }
rounded:
  sheet: 3px
  button: 3px
  block: 2px
  mark: 1px
spacing:
  page-max: 1280px
  gutter: "16px / 32px (md)"
  section-gap: "48px–64px, opened by a 2px ink rule"
  target-min: 44px
components:
  button-primary: { bg: teal, fg: "#ffffff", hover: teal-deep, minHeight: 52px, font: label-caps 1rem }
  button-quiet: { bg: transparent, fg: ink, border: "inset 1.5px ink", minHeight: 44px }
  button-live: { bg: live, fg: "#ffffff" }
  link: { fg: teal, weight: 600, underline: "1.5px, offset 3px", minHeight: 44px }
  block: { bg: teal-wash, border: "inset 1px teal", radius: 2px }
  mark: { size: 12px, radius: 1px }
---

# The Training Block — design system (lab)

> **Scope.** This documents the `/lab/training` exploration only, scoped to `[data-world="training"]` in `tokens/lab-training.css`. It is not the SkillUp design system: the SkillUp DS in Figma stays the visual authority. Integrating anything here into the SkillUp DS is a later, separate step.

## 1. Overview

Learning as a periodised training plan you follow week by week. Falling behind re-plans the block; it never marks a failure. The world is a printed plan on a chalk track: hairline grid on white sheets over a cool ground, condensed timing-board numerals, a plain grotesk for reading. Only the SkillUp logo and SkillUp teal come from the product; everything else belongs to this world.

Pages built: Today (`app/lab/training/View.tsx`), Plans (`app/lab/training/plans/`), the Six Sigma course plan (`app/lab/training/course/six-sigma/`). Navigation: `components/lab/training/TrainingNav.tsx`.

## 2. Colors — one rule per colour

| Token | Value | Role, and the only role |
|---|---|---|
| `--tb-ground` | #f2f4f3 | Page ground. Cool chalk, never cream. |
| `--tb-sheet` | #ffffff | The printed plan: sheets, rows, the week grid. |
| `--tb-ink` | #0e2b34 | Text; strong rules; the "current" mark in navigation and the plan table's "This week" chip. |
| `--tb-ink-2` / `--tb-ink-3` | #3c5660 / #5b727a | Secondary (7.3:1) and tertiary (4.9:1) text on white. |
| `--tb-rule` | #d5dcdc | Hairline grid rules. |
| `--tb-teal` | #26708e | **The plan.** Planned blocks (on `--tb-teal-wash`), plan-status word, primary button, links, meter fill, focus ring. |
| `--tb-lime` | #c8f169 | **Now.** Only on a mark that contains today's date. |
| `--tb-done` | #7d8f96 | **Done.** Graphite filled mark; done blocks on `--tb-done-wash`. |
| `--tb-live` | #1f7a47 | **Live only.** Live-session block, dot, "Join now" button. |

**Lime rule.** Lime appears only on: today's column in the week grid; today's next topic on the course plan (`.tb-cp-next`); the current plan week in a 12-week strip; the "You" marker on the road to race day; the "Today" legend swatch. It is never used for the cohort's week (ink-2 diamond), a catch-up week, a future start week, or the current-page mark in navigation. Anything lime carries a 1.5px ink inset or ink text (12.9:1).

**Moved rule.** A session moved by a re-plan is a dashed 1.5px teal outline over a 135° teal-wash hatch, with no solid inset (`.tb-block-moved`, `.tb-mark-moved`). A missed source session is a bare rule outline in ink-3 with a teal arrow to where it went.

**Navigation current page.** Desktop: ink text with a 4px ink underline bar. Mobile tab bar: ink icon + label inside a teal-wash pill. Never lime.

**Out-of-world colour.** `MockTag` uses the SkillUp DS warning tokens (`sko-*`) on purpose so mocked values read the same across every lab world.

## 3. Typography — hierarchy by scale, two weights per face

- **Big Shoulders Display 800** (`--font-tb-display`, fallback "Arial Narrow"): display, h1, uppercase h2, uppercase labels, and all numerals via `.tb-num` in tabular figures. Counts sit in fixed slots (`.tb-slot`, min 2ch, right-aligned) so they line up whatever their width.
- **Hanken Grotesk 400 / 600** (`--font-tb-text`): body, body-s, meta, plan titles (`.tb-title`, 20px/600) and emphasis (`.tb-strong`).
- Ramp: display 40–76px fluid · h1 32–48px fluid · h2 24px caps · title 20px · body 16px · body-s 14px · label and meta 13px · num-xl 56 / num-l 32 / num-m 22px. Every size multiplies by `--sk-font-scale`.
- Minimum text size is 12px (Lucide icons inside blocks sit at 12px; text never goes below 13px meta).
- **No kickers or eyebrows above headings.** The one exception is the contract's date line above the Today title ("Tuesday 30 September · Week 4 of 12"). Uppercase labels are used as section headings in their own right ("Then", "Live sessions", "The graded work on the way") and as inline prefixes inside a line ("Next", "First", "Today ·"), never as a decorative line over a heading.

## 4. Elevation and surface

Flat. No shadows. Depth comes from the sheet on the ground, 1px hairlines between rows, and a 2px ink rule opening each major section. Radii are small and fixed: 3px sheets and buttons, 2px blocks, 1px marks; avatars and the live dot are the only circles.

## 5. Components

- **Session block (Today week grid).** Height is a pure function of minutes: `clamp(48, 36 + 1.6·min, 132)` px (`blockHeight` in `View.tsx`). The face shows kind + minutes only (minutes as `45′` in tabular numerals; kind hidden below `sm`). Titles live in the hero, the THEN list and the block's accessible name, never on the face. States: planned (teal-wash, 1px teal inset), today (white on the lime column), done (done-wash + check), moved (dashed + hatch), missed (rule outline + arrow), live (live-wash + radio icon + time).
- **Topic block (course plan table).** Width is load: `flex-basis = clamp(128, 128 + 4·min, 440)` px, 148px when there is no duration; min-height 92px. Faces carry type, title (line-clamped to 3), minutes. Locked = plain sheet with rule inset, lock icon and the reason printed. Hover underlines the title; the block does not move.
- **Mark.** 12px square: done filled graphite, planned 1.5px teal outline, moved dashed teal, today lime with ink inset, live green circle. Every mark-bearing view carries a legend.
- **12-week strip** (`WeekStrip`). Twelve square marks in a grid that shrinks with the row (max 336px): weeks before current = done, current = lime, rest = planned. A not-started plan is all planned.
- **Road to race day.** 2px ink line with week ticks; cohort as an ink-2 diamond labelled above; "You" as a lime chip with ink inset below; "Race day" at the right end.
- **Plan-load meter.** 10px bar, done-wash track, teal fill, `role=progressbar` with minutes in `aria-valuetext`.
- **Buttons.** Primary teal, 52px, display caps. Quiet: 1.5px ink inset, 44px. Live: green, only for joining a live session. Links: teal 600, 1.5px underline, 44px target.
- **Navigation.** 64px sheet bar with logo, Today / Plans / Calendar / Certificates and the persona avatar (ink circle, initials); on phones a fixed bottom tab bar of four 64px targets with Lucide icons. Calendar and Certificates are not built in this lab: they render as `aria-disabled` items in ink-3 with a screen-reader note, never as links to `#`.

## 6. Signature interaction — Re-plan

When sessions were missed, the plan status word reads "Re-planned" in teal, the moved blocks slide in from the left once (`tb-replan-in`, 520ms, `cubic-bezier(0.16,1,0.3,1)`, staggered 90ms; off under reduced motion), and two controls follow:
- **Keep this plan** (quiet button) → a `role=status` confirmation with the catch-up date.
- **Choose my days** (link, `aria-expanded` disclosure) → seven day toggles with `aria-pressed` (on = ink fill, off = planned block), "Re-plan with these days" primary button, and a `role=status` result ("Lab demo — nothing is saved"; "Pick at least one day" when empty).

## 7. Rules for the lab

- **Icons** are Lucide through `Icon` (`@/lib/icons`). No Unicode glyph icons. The em dash for an empty day is a typographic placeholder with an `sr-only` "Nothing planned".
- **Targets** are at least 44px on mobile; nav targets 64px.
- **Focus**: 3px teal outline, 2px offset.
- **Unwired actions** use `DemoAction`: a real button that announces "Lab demo — this action isn't wired yet." in a `role=status` line. No `href="#"` pretending.
- **Mock data** carries a `MockTag` with its reason in full. Real vs mock (from `lib/lab/training-plan.ts` and `course/six-sigma/plan-model.ts`): REAL — course titles, module/lesson/topic titles, types, durations, locks, progress %, topic counts, certificate status, last-visit labels. MOCK — the weekly plan and days, cohort week and pace, race-day date, plan week per topic, persona done sets, the re-plan moves, the course team, and "today" (fixed at Tuesday 30 September).

## 8. Do's and Don'ts

- Do give every colour one meaning; if a new state needs a colour, it needs a new rule first.
- Do size plan blocks by minutes, and keep finished sessions visible.
- Do say "re-planned" and "nothing dropped"; never label a session late, overdue or missed (its accessible state is "not done").
- Don't put lime on anything that does not contain today.
- Don't use shadows, cards-with-progress-bars grids, or a welcome banner.

## 9. Open (reviewer's optional ceiling, not done)

- Road to race day drawn as 12 week marks (it is currently a line with ticks).
- Per-day minute totals under the week grid.
- Re-plan motion travelling from the missed day to its new day (it currently slides in from a fixed 24px left).
