---
name: SkillUp LMS
description: The SkillUp learner platform and course player, one design system across every partner skin.
colors:
  primary-teal: "#26708e"
  primary-ink: "#215477"
  primary-mist: "#ebf8ff"
  deep-teal: "#044150"
  spark-yellow: "#f9c654"
  ink: "#13282f"
  slate: "#39414c"
  slate-soft: "#4f5b69"
  slate-placeholder: "#606b7a"
  disabled-grey: "#8995a6"
  page: "#ffffff"
  paper: "#f8f9fa"
  mist-grey: "#f3f5fa"
  track-grey: "#e1e7ec"
  steel: "#b9c4ce"
  hairline: "#d5dce2"
  border-grey: "#8995a6"
  success-green: "#1f7643"
  success-mint: "#e4fced"
  warning-cream: "#fff9eb"
  warning-ochre: "#85580e"
  error-red: "#da3336"
  error-text: "#b62226"
  error-blush: "#fce8e8"
  info-blue: "#0086c9"
  info-sky: "#acd5f4"
typography:
  display:
    fontFamily: "Montserrat, system-ui, sans-serif"
    fontSize: "72px"
    fontWeight: 700
    lineHeight: "90px"
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Montserrat, system-ui, sans-serif"
    fontSize: "36px"
    fontWeight: 700
    lineHeight: "44px"
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Montserrat, system-ui, sans-serif"
    fontSize: "20px"
    fontWeight: 600
    lineHeight: "30px"
  body:
    fontFamily: "Montserrat, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: "24px"
  body-small:
    fontFamily: "Montserrat, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: "20px"
  label:
    fontFamily: "Montserrat, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 600
    lineHeight: "18px"
    letterSpacing: "0.04em"
rounded:
  none: "0px"
  inner: "2px"
  control: "6px"
  card-inset: "8px"
  track: "10px"
  card: "12px"
  surface: "16px"
  pill: "9999px"
spacing:
  xxs: "2px"
  xs: "4px"
  sm: "6px"
  md: "8px"
  lg: "12px"
  xl: "16px"
  2xl: "20px"
  3xl: "24px"
  4xl: "32px"
  5xl: "40px"
components:
  button-primary:
    backgroundColor: "{colors.primary-teal}"
    textColor: "{colors.page}"
    typography: "{typography.body-small}"
    rounded: "{rounded.control}"
    padding: "0 12px"
    height: "44px"
  button-primary-hover:
    backgroundColor: "{colors.spark-yellow}"
    textColor: "{colors.deep-teal}"
  button-secondary:
    backgroundColor: "{colors.page}"
    textColor: "{colors.primary-ink}"
    rounded: "{rounded.control}"
    padding: "0 12px"
    height: "44px"
  button-tertiary:
    backgroundColor: "{colors.page}"
    textColor: "{colors.primary-ink}"
    rounded: "{rounded.control}"
    padding: "0 12px"
    height: "44px"
  button-tertiary-hover:
    backgroundColor: "{colors.track-grey}"
  card:
    backgroundColor: "{colors.page}"
    rounded: "{rounded.card}"
    padding: "16px"
  input-search:
    backgroundColor: "{colors.page}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.control}"
    padding: "0 12px"
    height: "40px"
  badge-gray:
    backgroundColor: "{colors.track-grey}"
    textColor: "{colors.slate}"
    rounded: "{rounded.pill}"
    padding: "2px 8px"
  badge-warning:
    backgroundColor: "{colors.warning-cream}"
    textColor: "{colors.warning-ochre}"
    rounded: "{rounded.pill}"
    padding: "2px 8px"
  progress-track:
    backgroundColor: "{colors.track-grey}"
    rounded: "{rounded.none}"
    height: "8px"
  progress-fill:
    backgroundColor: "{colors.info-blue}"
    rounded: "{rounded.none}"
---

<!-- Recorded from the prototype on 22 Oct 2026 (tokens/colors.css, typography.css, radius.css, motion.css, spacing.md, components/atoms). The Figma SKO Design System (c7EUDrQwP8si08aPipDSIV) is the source of truth; this file describes how the code implements it, in the default SKO Light skin. When the DS changes, re-run /impeccable document. -->

# Design System: SkillUp LMS

## Overview

**Creative North Star: "The Course Atlas"**

Every screen is a map of the learner's journey: where they are, how far they have come, and the one next step. Structure is the design. Program, course, module and topic nest in a fixed order; progress bars, step markers and dates are the landmarks; the page around them stays quiet so the landmarks read at a glance. The same map serves the platform pages (Dashboard, My Learning, course and program pages, Calendar) and the player, where the content itself takes the space and the chrome recedes.

The atlas is printed for many partners. A skin changes the brand colours (SKO teal, Gold, Red, and the Sea proposal), never the structure, the components or the type. Light and dark themes, a colour-vision-safe mode and a text scale up to 130 % sit on top of every skin, and each combination holds WCAG 2.2 AA. Density is moderate: generous 44 px targets on phones, 16 px card padding, one content column of 1200 px on desktop.

Components are firm and welcoming: large, honest targets, direct labels, and one small moment of warmth, the yellow spark that the primary button turns to on hover. Depth is light and hybrid: the default skin separates surfaces with hairline borders and tonal steps; the Sea skin trades those borders for a soft teal shadow. Gradients are off-brand everywhere.

**Key Characteristics:**
- Role tokens only: every colour, radius and type style comes from a DS role, never a raw value.
- One accent at a time: teal for action and position, yellow only as the hover spark and for warnings.
- Progress is blue; green means done, and comes with an icon and a word.
- Radius by what an element is, not by its size, with the nesting rule inner + padding = outer.
- The same content on desktop, tablet and phone; layouts change, content does not hide.

## Colors

A cool, low-chroma neutral world with one teal accent and a warm yellow spark, plus four plain status colours.

### Primary
- **Primary Teal** (#26708e): the primary button fill, the selected-state marker (tab bar, current nav item), focus rings and brand icons. It means "act here" or "you are here"; nothing decorative uses it.
- **Primary Ink** (#215477): teal as text, for links, Secondary and Tertiary button labels and selected tab labels; darker than Primary Teal so it passes AA on white and on Primary Mist.
- **Primary Mist** (#ebf8ff): the soft brand surface behind the Dashboard glance card and soft brand badges.
- **Deep Teal** (#044150): text on Primary Mist and on the yellow hover; the logo's deep teal, and the Sea skin's chrome.

### Secondary
- **Spark Yellow** (#f9c654): the primary button's hover fill (with Deep Teal text) and the warning fill. Its rarity is the point: a flash of warmth on the one action that matters.

### Neutral
- **Ink** (#13282f): default text and icons; also the inverse surface (dark hero bands, tooltips).
- **Slate** (#39414c), **Slate Soft** (#4f5b69): secondary and tertiary text, card meta lines, subtle icons.
- **Slate Placeholder** (#606b7a): input placeholders (4.96:1 on Mist Grey).
- **Disabled Grey / Border Grey** (#8995a6): disabled text, and the default border of inputs and controls (3:1 non-text contrast).
- **Page** (#ffffff), **Paper** (#f8f9fa), **Mist Grey** (#f3f5fa): the page, the platform ground, and subtle panels. Cards sit on Page over a Paper ground.
- **Track Grey** (#e1e7ec): the track behind progress fills and segmented controls, the neutral hover, and the Gray Soft badge.
- **Steel** (#b9c4ce), **Hairline** (#d5dce2): strong dividers and faint icons; the 1 px card and divider rule.

### Status
- **Success Green** (#1f7643) on **Success Mint** (#e4fced): completed, passed, live.
- **Warning Ochre** (#85580e) on **Warning Cream** (#fff9eb): due soon, attention.
- **Error Red** (#da3336) fill, **Error Text** (#b62226) on **Error Blush** (#fce8e8): overdue, failed, destructive.
- **Info Blue** (#0086c9) with **Info Sky** (#acd5f4): progress fills and informational alerts.

### Named Rules
**The Role Token Rule.** No raw hex in a component. Every colour is a `--color-*` role (`bg-sko-*`, `text-sko-*`, `border-sko-*`), so a skin, theme or vision mode can re-point it. The token lint (`pnpm lint:tokens`) fails the build otherwise.

**The Blue Progress, Green Done Rule.** A progress fill is Info Blue while it runs. Green appears only when something is complete, always with a check icon and a word, never by colour alone.

**The One Spark Rule.** Spark Yellow is the primary button's hover and the warning colour; it is not a decorative accent.

## Typography

**Display Font:** Montserrat (with system-ui, sans-serif)
**Body Font:** Montserrat (with system-ui, sans-serif)

**Character:** one geometric sans for the whole interface. Hierarchy comes from size and weight steps of the DS ramp, not from a second family; there is no italic style.

### Hierarchy
- **Display** (700, 72/90, −2 %; 60/72 tablet, 48/60 phone): the one hero figure on a platform page.
- **Headline** (700 or 600, 36/44, −2 %; 30/38 tablet, 24/32 phone): page titles ("Good morning, John.", "Certificates").
- **Headline Medium / Small** (600–700, 30/38 and 24/32, smaller on phones): section titles and big figures (the glance values).
- **Title** (600, 20/30; 18/28 phone, and Title Medium 18/24): card titles, course names.
- **Body** (400–600, 16/24): content and primary list text; long reading stays near 65–75 characters.
- **Body Small** (400–600, 14/20, and 12/18 for meta): button labels (14 semibold), meta lines and details.
- **Label** (500–600, 12/18, +4 % tracking, uppercase): eyebrows, section labels, stat labels.

### Named Rules
**The Twelve Pixel Floor Rule.** No text below 12 px, at any skin or breakpoint.

**The Style Class Rule.** Text uses a `.sk-text-{style}-{weight}` class from the DS ramp; components never set font-size or font-weight inline. Sizes are in rem, so the browser's own text size scales the ramp, and every size multiplies by `--sk-font-scale` (100 / 115 / 130 %) on top.

## Layout

One content column, max 1200 px on desktop (Container/max-width 1280 including gutters), centred, with gutters of 32 / 24 / 16 px (desktop / tablet / phone). Breakpoints: phone ≤ 768, tablet 769–1024, desktop ≥ 1025. Spacing follows the DS scale (2, 4, 6, 8, 12, 16 fixed; 20, 24, 32, 40 and up shrink on tablet and phone). Cards pad 16 px; page sections sit 24–40 px apart.

Platform pages stack a title block, then a Collection (tabs on a hairline rule, a toolbar with search and, on desktop only, a Grid / List toggle), then a grid of 3 / 2 / 1 columns with 24 / 20 / 16 px gaps. The player is a three-part shell: top bar (60 px, 56 on phones), a collapsible outline rail (280 / 72 px, a 320 px drawer on phones) and the topic content with a fixed footer (64 px: Previous · unit · Next).

**The Content Parity Rule.** What a learner sees on desktop is there on tablet and phone. A layout reflows, scrolls sideways or stacks; it never hides content to fit.

## Elevation & Depth

Light and hybrid, decided per skin. In SKO, surfaces separate by hairline borders (1 px Hairline) and tonal steps (Page cards on a Paper ground); the card shadow is barely there. Real shadows belong to what floats over the page: menus, flyouts, popovers, modals. The Sea skin removes card, panel and menu borders and uses a soft teal-tinted shadow instead, while inputs and controls keep their borders for contrast.

### Shadow Vocabulary
- **Card hint** (`box-shadow: 0 2px 6px -4px #1f233e0d`): resting cards in SKO, almost invisible.
- **Floating** (`box-shadow: 0 2px 4px -2px #0a0d120f, 0 4px 6px -1px #0a0d121a`, DS Elevation/level3): flyouts and menus over the page.
- **Sea card** (`box-shadow: 0 1px 2px #0441500d, 0 6px 20px -4px #0441501f`; darker in dark): every card, panel and menu in the Sea skin, in place of the border.

### Named Rules
**The System Preferences Rule.** With "increase contrast" on, hairlines and the faintest text step up one role; with "reduce transparency" on, translucent media surfaces turn solid and lose their blur. A theme or skin change cross-fades the page instead of jumping in one frame.

**The Borders For Controls Rule.** Inputs, selects and toggles keep a visible border in every skin (3:1 non-text contrast); only containers may trade a border for a shadow.

**The No Gradient Rule.** Fills are flat. The one exception is the assistant launcher's rotating ring.

## Shapes

Corners are chosen by role: none (0) for full-width bars, bands and progress bars; inner (2) for tiny parts inside controls; control (6) for buttons, inputs, menu items, avatars and icon tiles; card (12) for cards, boxed lists, alerts and menus; surface (16) for modals and sheets; pill for badges, tags, dots and toggles. Two derived roles follow the nesting rule: card-inset (8) for rows inside a 4 px-padded card or menu, and track (10) for a segmented track holding 6 px segments.

**The Nesting Rule.** An element inside a rounded container, closer to its edge than the container's radius, gets outer − padding; never less than its own role. Elements further in keep their own role.

## Components

### Buttons
Firm and welcoming: big targets, one obvious primary.
- **Shape:** gently rounded (control, 6 px).
- **Primary:** Primary Teal fill, white label 14/20 semibold; 44 px tall at md (36 sm, 48 lg), 12 px side padding, optional 20 px icon.
- **Hover / Focus:** Primary turns Spark Yellow with Deep Teal text, on devices that can hover only (a tap on a phone never leaves it yellow). Pressing scales it to 98 %. Focus is a 2 px Primary Teal outline, 2 px offset, over a 2 px white gap ring.
- **Secondary:** white fill, Primary Ink label, 1 px inset Primary Teal ring. **Tertiary:** white fill, Primary Ink label, Track Grey on hover. **Link:** text only, underline on hover.
- **Destructive:** Error Red fill (Primary) or Error Text ring (Secondary). Utility and close buttons stay neutral grey.
- **Width:** hug the label, or fill the container; never a fixed width. Two side by side both fill, except on large screens and in lists.

### Badges
- **Style:** pill, Soft by default (tinted fill, no stroke), sentence-case medium label: 12/18 at sm (22 px tall, 8 px side padding), 14/20 at md and lg; accents use strong fills with on-accent text, statuses soft fills.
- **Gray Soft** sits on Track Grey so it stays visible on Paper and on white cards. Count badges follow tab labels: Brand when the tab is selected, Gray otherwise.

### Cards / Containers
- **Press:** a card or row that is one link answers on touch-down: 99 % and a Paper tint (`sk-press-card`), since hover exists only where a pointer can hover.
- **Corner Style:** card (12 px); rows inside take card-inset (8 px).
- **Background:** Page on a Paper ground.
- **Shadow Strategy:** the card hint in SKO, the Sea card shadow in Sea (see Elevation & Depth).
- **Border:** 1 px Hairline in SKO; none in Sea.
- **Internal Padding:** 16 px; grids of cards share one height per row, with actions on the bottom edge.

### Inputs / Fields
- **Style:** Page fill, 1 px Border Grey, control radius (6 px), a faint shadow; 40 px tall (44 on phones), 12 px padding, a 20 px leading icon for search.
- **Focus:** the border turns Primary Teal and thickens to 2 px; no glow.
- **Placeholder:** Slate Placeholder.

### Navigation
- **Top bar:** logo left, five destinations (Dashboard, My Learning, Calendar, Discussion, Services) with count badges, then notifications, theme and the profile menu on the right. The current page carries the teal underline. Compact below desktop: a menu button opens the destinations.
- **Tabs:** Underline tabs on a hairline rule; the selected tab is Primary Ink with a 2 px Primary Teal bar that slides between tabs. 48 px tall on desktop; 32 px on phones with the touch target grown to 44 px upwards.
- **Segmented controls:** a Track Grey track (track radius 10, 4 px padding) holding 32 px segments; the pressed one is a white pill with a hairline and Primary Ink.

### Sheets, drawers and panels
- **Gesture:** on a touch screen the phone sheets (assistant, course search) pull down to close from their header, and the course drawer and side panels swipe back to their edge. The surface follows the finger 1:1, resists past its open position, and the release velocity decides: a flick closes it, a slow short drag settles back (`useSheetDrag`). The close button and Escape stay.

### Progress
- **Bar:** a Track Grey track with an Info Blue fill, square ends (none radius), 8 px (4 px in compact rows). Complete turns Success Green with a check and the word.

### Signature: Today at a glance
The Dashboard hero: a Primary Mist card with a Primary Muted border holding four stat cards (Courses, Programs, Completed, Certificates) on Page, card-inset corners and the card hint shadow. Each card shows a label, a big figure, a two-line detail and, where the platform serves the fact, a goal badge ("3 due this week" in warning). On phones the cards scroll sideways in one row.

## Do's and Don'ts

### Do:
- **Do** use a DS role token for every colour, radius and type style (`bg-sko-*`, `rounded-control`, `.sk-text-body-medium-semibold`).
- **Do** keep one primary button per area; Resume, Start, Submit are primary, the rest secondary or tertiary.
- **Do** make every interactive target at least 44 × 44 px on phones.
- **Do** fill progress with Info Blue and show completion with Success Green plus an icon and a word.
- **Do** pick a radius by what the element is, and apply inner + padding = outer when nesting.
- **Do** check every new screen in all skins, light and dark, the CVD mode and 130 % text.

### Don't:
- **Don't** write a raw hex, px font size or arbitrary radius in a component; the token lint will fail it.
- **Don't** use gradients; the assistant launcher's ring is the only exception.
- **Don't** colour progress green before it is complete, or signal any state by colour alone.
- **Don't** set text below 12 px.
- **Don't** hide content on smaller screens to make a layout fit.
- **Don't** give buttons a fixed width.
- **Don't** add italic text styles; the DS has none.
