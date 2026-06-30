# SkillUp LMS — Design-System Tokenization & Skin-Proof Audit

**Date:** 2026-06-30
**Surfaces audited:** SKO Design System (Figma `c7EUDrQwP8si08aPipDSIV`) · LMS Playground (Figma `Wz2TCYFVr0hD8tJNiLajLt`) · React prototype (`/Users/nelsonjeronimo/Downloads/lms-prototype`)
**Prototype scope:** 14 atoms · 24 molecules · 20 organisms · 14 views = 72 non-story `*.tsx` files, cross-referenced against `tokens/colors.css`, `tokens/typography.css`, `tailwind.config.ts`, `app/globals.css`.

---

## 1. Executive Summary

The React prototype is the strongest of the three surfaces and is, on the token layer, materially **cleaner than the Figma DS file it derives from**. Across all 72 component files there are **zero raw hex/rgba/named colors, zero arbitrary `[#…]` color values, and zero inline color/font-size/font-weight styles** — the single exception being the demo skin-picker swatches in `DemoControlsMenu.tsx` (a legitimate, non-product control). Typography is applied uniformly through `.sk-text-*` classes, and keyboard focus is covered globally via `:focus-visible` in `app/globals.css`. The Figma DS, by contrast, still carries ~201 Untitled-UI token-drift instances and ~36 raw-color instances spread across most component families.

The real risk is **not tokenization but skin-proofing and theme-inversion**. The skin system (`[data-skin]`) deliberately swaps only `--sk-bg-brand-solid` and derives tinted surfaces/accent-text from it via `color-mix`. Several components consume brand-adjacent tokens that are **outside that derivation chain** (`--sk-bg-brand-hover`, `--sk-fg-progress`) and therefore stay their default color while surrounding brand surfaces adapt — producing mismatched pairings on the 5 custom skins. Separately, three surfaces use a neutral **text** token (`--sk-text-primary` / `--sk-text-brand-primary`) for a **surface/scrim** role; because those tokens invert between light and dark mode, the result is a genuine **dark-mode contrast break** (white content on a pale surface) in the VideoPlayer chrome and the CertificateView brand stage. These are the user-visible failures and the focus of the P0/P1 backlog.

Everything else — brand-vs-neutral discipline, `active=brand / body=text-secondary` semantics, complete hover/active/empty/error states, status-token consistency — is in good shape and should be preserved as the baseline.

### Scorecard

| Surface | Tokenization | Drift level | Skin-proof readiness | Top risk |
|---|---|---|---|---|
| **SKO Design System (Figma)** | ~Partial (raw + UUI drift present) | **High** — ~201 drift + ~36 raw across most families; foreign namespaces (`background/info`, `Colors/Text/text-white`) | **Partial** — variables exist but unbound/duplicated; no skin modes | UUI token drift + raw hex must be rebound to `LMS/*` before DS can be the source of truth |
| **LMS Playground (Figma)** | Good (chrome boards tokenized) | Low–Medium | **Partial** | Coverage gaps: VILT, Assessments, Course End, Discovery boards **missing** — parity can't be visually verified |
| **React prototype** | **Excellent** (0 raw color outside demo swatch) | **Very low** | **Partial → Ready w/ fixes** | Theme-inverting text tokens used as surfaces (VideoPlayer, CertificateView) → dark-mode contrast break; brand-adjacent tokens outside skin derivation |

---

## 2. Findings by Surface & Dimension

All prototype findings below were verified against the cited files and `tokens/colors.css`. Overstated items from the raw slice findings have been corrected (see severity notes). False-positive risk has been screened out: the fixed sky-blue accents (`--sk-fg-progress`, `--sk-fg-like`) used by `OverallProgress`, `TranscriptLine`, `ContentFeedback`, and `CompletionStatus`'s progress ring are **intentional non-skinning accents per `colors.css` comments** and are not drift; the `bg-/border-sk-text-*` status fills are valid themeable tokens (a role-naming gap, not a raw-color violation).

### 2A. React Prototype

#### Tokenization — strong, one legitimate exception
- **`molecules/DemoControlsMenu.tsx:28-34,195`** — skin-picker swatches hardcode six light-mode brand hexes (`#26708e`, `#04313d`, `#3685c6`, `#4d1b9a`, `#ac7720`, `#b62226`) rendered via `style={{ backgroundColor: s.swatch }}`. This is the only inline color style and the only raw hex in product code. It duplicates the skin source of truth and is **inaccurate in dark mode** (the dot stays `#26708e` while the real dark teal solid is `#3d9bc1`, `colors.css:63`). Because it is a demo-only control showing all six skins simultaneously, severity is **P2** (corrected down from P1).

#### Skin-proofing — the core gap
- **`atoms/Button.tsx:20-21` (P1)** — `primary` hover uses `hover:bg-sk-bg-brand-hover`. `--sk-bg-brand-hover` (`#f9c654` light / `#2a7d9c` dark) is defined **only** in `:root` and `[data-theme="dark"]`, **never** in any `[data-skin]` block (`colors.css:101-114` remap only brand-solid + its derivatives). So the primary button hover turns **yellow on all 5 custom skins**, while the paired `hover:text-sk-text-brand-primary` **does** skin (`colors.css:111`), producing odd pairings (e.g. dark-red text on yellow under the red skin). Verified accurate.
- **`atoms/InlineAlert.tsx:18-22` (P1)** — info-tone box uses adapting brand tokens (`bg-sk-bg-brand-section border-sk-border-brand`) but the icon circle uses `bg-sk-fg-progress`, a fixed sky-blue never remapped per skin. On violet/red/gold skins the box tints to the skin while the circle stays sky-blue. Real; mild overstatement noted (the effect is muted on teal/sky skins). **P1**.
- **`organisms/ContentTabs.tsx:114` (P1)** — unselected mobile-select option rows use `text-sk-text-brand-primary` (skin-tinted, derives from brand-solid) while the trigger's own unselected state uses neutral `text-sk-text-primary` (`:78`). Plain list labels therefore tint with the active skin — internally inconsistent. **P1**.
- **`atoms/CompletionStatus.tsx:58,64` (P2)** — In-Progress ring/half-fill use `--sk-fg-progress` (fixed sky-blue, not skinned). Flagged P2 because `fg-progress` is an **intentional progress semantic**, not a brand role — confirm-with-design item, likely no change.

#### Theme inversion / A11y — the user-visible failures
- **`views/CertificateView.tsx:32` (P0)** — `bg-sk-text-brand-primary` uses a **text** token as a full-height brand **surface** carrying white content (`:33`). `--sk-text-brand-primary` is dark in light mode (`#044150`) but **light in dark mode** (`#cdeaf6`, `colors.css:88`) and a light tint under skins (`color-mix(brand 35%, #fff)`, `colors.css:139`). Result: **white content on a near-white stage in dark mode** — contrast break across skins. Verified.
- **`organisms/VideoPlayer.tsx:170` (P0)** — control-bar scrim is `mix("--sk-text-primary", 70)`. `--sk-text-primary` inverts to near-white in dark mode (`#eaf1f4`, `colors.css:83`), so the scrim becomes a pale wash under the white play icon + timestamp (`text-sk-fg-white`, `:191-197`). Legibility break in dark mode. Verified.
- **`organisms/VideoPlayer.tsx:117` (P0)** — state overlay uses `mix("--sk-text-primary", 40)` under white Loader/AlertCircle/text (`:121-128`). Same inversion → white-on-light loading/error states in dark mode. Verified.
- **`organisms/VideoPlayer.tsx:160` (P1)** — captions use `text-sk-text-primary-on-brand` (white→`#0e1a1f` across themes) over an inverting `text-primary` scrim (`:157`). Wrong role (on-brand text is for brand-solid surfaces) → dark-text-on-pale result in dark mode. Same root cause as the two P0s; fold into the same fix.
- **`views/ViltView.tsx:20` (P1)** — decorative stage gradient ends on `--sk-text-brand-primary` (text token as surface), inverting/lightening in dark mode under `text-primary-on-brand` content. Same class of bug as CertificateView, lower exposure (decorative).

#### Semantic / Scalability — token-role gaps (correct but worth hardening)
- **(P2) No solid status-bg token** — `LiveNowBanner.tsx:42-45`, `LiveControlBar.tsx:67-68`, `CourseCertificate.tsx:82`, `CourseCompleteModal.tsx:56`, `QuizCard.tsx:118-120`, and `ActivityView` express solid status fills/borders by reusing **text** tokens (`bg-/border-sk-text-success|error|warning-primary`). Theme-adaptive and internally consistent, but a role gap that will mislead future authors.
- **(P2) Divergent success-check motif** — `CourseCompleteModal.tsx:56` renders a green disc + white check (`bg-sk-text-success-primary text-sk-fg-white`); `CourseCertificate.tsx:82-83` renders an inverted disc (`bg-sk-bg-primary text-sk-text-success-primary`). Same concept, two recipes.
- **(P3) Off-scale border width** — `NoteEditorModal.tsx:109` uses `border-l-[3px]` where the equivalent accent elsewhere uses `border-l-4` (`LiveNowBanner.tsx:32`).
- **(P3) Redundant utility** — `DemoControlsMenu.tsx:39` applies `uppercase` on top of `.sk-text-2xs-medium`, which already sets `text-transform: uppercase` (`typography.css:51`).
- **(P3) Touch targets** — `Bookmark.tsx:35-39` (~26px), `FilterChip` (px-3 py-1), `SidebarToggle` (32px) sit below the ~44px touch recommendation. Tokenization/focus are fine; either bump to ~40–44px or document desktop-density intent.

#### Clean (verified, no findings)
Atoms: Avatar, Badge, CompletionStatus (apart from the noted P2), EmptyState, LessonHeader, MetaBadges, SectionHeader, TopicTypeBadge, VerticalScroll. Molecules: 22 of 24 (all except `DemoControlsMenu`). Organisms: CourseCard, CoursePlayerTopbar, CourseProgressionButton, CourseRow, NotificationsPanel, OverlayPanel, ReportIssueModal, SavedPanel, Sidebar, Toast, TopicFooterNav, AIPanel. Views: PlayerShell, TranscriptTab, NotesTab, ReadingView, CourseHub, AssessmentView, and the rest of the slice.

### 2B. SKO Design System (Figma)

- **Tokenization / Drift (High):** ~201 Untitled-UI drift + ~36 raw-color instances across most families. Worst offenders: **Topbar** (12 raw — `#000000` avatar stroke, `#ff0000`, `#044150`, `#ffffff` — plus a foreign `background/info|brand|default` namespace), **Discovery & My Learning** (47 drift, utility gray/blue/pink ramps on badges/avatars), **Topic Footer + Progression** (51 drift — `Colors/Text/text-white`×18, `bg-brand-section`×11). **Course End** is the one fully clean family (0 drift / 0 raw). The prototype has already resolved all of these against `--sk-*`; the gap lives in the DS file, not in code (parity rows below are marked **DRIFT (DS-side)** to reflect that the prototype is *ahead*).
- **Skin-proofing:** DS has **no skin modes** — the 6 skins exist only at runtime in CSS. See §5 F1 decision.

### 2C. LMS Playground (Figma)

- **Coverage gaps (the main issue):** Phase-1 boards (Light / Dark / Overlay Panels) cover Sidebar, Topbar, Footer, Content & Notes, System Feedback, and AI Panel. **Missing entirely:** Live/VILT, Assessments, Course End, Discovery & My Learning. Parity for those four families cannot be visually verified against the Playground until boards are added.
- **Tokenization:** the chrome boards that do exist are tokenized and align with the prototype; the mobile-tab-select dark-mode bug noted in the DS census is **already fixed in the prototype** (`bg-sk-bg-primary`, border grey→brand on open).

---

## 3. Parity Matrix (DS ↔ Playground ↔ Prototype)

**Legend:** MATCH = structure+tokens+states aligned · PARTIAL = exists but a state/variant/token gap · MISSING = absent in a lane · DRIFT (DS-side) = DS carries debt the prototype already resolved (prototype ahead).

| # | Family | In DS | In Playground | Prototype files | Parity | Gap |
|---|---|---|---|---|---|---|
| A | Sidebar System | ✅ | ✅ | `Sidebar`, `SidebarToggle`, `ModuleHeader`, `TopicRow`, `SectionHeader` | DRIFT (DS-side) | DS 38 drift (`fg-white`×30, `border-brand_alt`×4, `fg-success`×4); code already tokenized |
| B | Topbar | ✅ | ✅ | `CoursePlayerTopbar`, `Avatar`, `Bookmark` | DRIFT (DS-side) | DS worst raw offender (12 raw + foreign namespace); verify avatar status-ring token |
| C | Topic Footer + Progression | ✅ | partial | `TopicFooterNav`, `CourseProgressionButton`, `OverallProgress`, `ModuleTimeLeft` | DRIFT (DS-side) | DS 51 drift; needs rebind to `bg-brand-section` / `primary-on-brand` |
| D | Live / VILT | ✅ | ❌ | `ViltView`, `LiveControlBar`, `LiveNowBanner`, `LiveAttendance` | PARTIAL | **Missing Playground board**; DS 10 raw avatar strokes |
| E | Content & Notes | ✅ | ✅ | `ContentTabs`, `PanelTabs`, `NotesTab`/`TranscriptTab`/`DownloadsTab`, `NoteItem`, `SavedNoteItem`, `NoteEditorModal`, `TranscriptLine`, `InlineAlert` | MATCH | Best-aligned family; mobile-select dark bug already fixed in code |
| F | Assessments | ✅ | ❌ | `AssessmentView`, `QuizCard` | PARTIAL | **Missing Playground board**; QuizCard covers all 4 DS states |
| G | Course End | ✅ (clean) | ❌ | `CertificateView`, `CourseCertificate`, `CourseCompleteModal` | PARTIAL | **Missing Playground board**; note P0 dark-mode bug in `CertificateView` |
| H | Discovery & My Learning | ✅ | ❌ | `CourseHub`, `CourseCard`, `CourseRow`, `CourseHeader`, `FilterChip`, `EmptyState`, `SavedTopicItem` | DRIFT (DS-side) + Playground MISSING | 2nd-worst DS family (47 drift); decision pending on utility ramps → LMS status |
| I | System Feedback | ✅ | partial | `Toast`, `InlineAlert`, `EmptyState`, `CompletionStatus`, `ContentFeedback` | DRIFT (DS-side) | DS only 1 drift (`fg-white`); near-match |
| J | AI Assistant | ✅ | ✅ (hidden instance) | `AIPanel`, `OverlayPanel` | MATCH | DS 5 minor drift (`bg-primary`×4, `fg-quaternary`) |
| K | Showcases & Diagrams | ✅ | ✅ (showcase surface) | composed views (`PlayerShell`, `ResponsiveShell`, `TopicBody`) + Storybook | PARTIAL / by-design | DS 7 raw + 25 drift = presentation furniture, not product components |

**Top parity gaps:** (1) Playground is missing 4 product families (D, F, G, H) — visual parity can't be confirmed there; (2) DS still carries raw + UUI drift on 8 of 11 families that the prototype has already resolved — DS needs a rebind pass before it can serve as source of truth; (3) the prototype's own divergences are the dark-mode/skin token-role issues in §4, not structural mismatches.

---

## 4. Prioritized Remediation Backlog

| ID | Pri | Surface | Component / file | Issue | Fix |
|---|---|---|---|---|---|
| R1 | **P0** | Prototype | `views/CertificateView.tsx:32` | Text token `bg-sk-text-brand-primary` used as full-height brand surface → white-on-pale in dark mode/skins | Use a brand **surface** token (`bg-sk-bg-brand-solid`) with `text-primary-on-brand`, or a dedicated brand-stage token |
| R2 | **P0** | Prototype | `organisms/VideoPlayer.tsx:170` | Control-bar scrim `mix(--sk-text-primary,70)` inverts to pale in dark mode under white chrome | Introduce a theme-stable dark `--sk-bg-overlay` (or color-mix on a non-inverting token); use it for the scrim |
| R3 | **P0** | Prototype | `organisms/VideoPlayer.tsx:117` | State-overlay scrim `mix(--sk-text-primary,40)` inverts → white loading/error text on light | Reuse the R2 `--sk-bg-overlay` token |
| R4 | **P1** | Prototype | `organisms/VideoPlayer.tsx:160` | Captions use `text-primary-on-brand` over inverting scrim (wrong role) | Render captions `text-sk-fg-white` over the R2 dark scrim |
| R5 | **P1** | Prototype | `views/ViltView.tsx:20` | Inline gradient ends on text token `--sk-text-brand-primary` (surface role) | Switch the gradient stop to a brand-surface token / R1 stage token |
| R6 | **P1** | Prototype | `atoms/Button.tsx:20-21` | `--sk-bg-brand-hover` not skinned → primary hover stays yellow on all 5 skins | Derive `--sk-bg-brand-hover` from brand-solid in `[data-skin]`, or gate yellow to default skin |
| R7 | **P1** | Prototype | `atoms/InlineAlert.tsx:18-22` | Info circle `bg-sk-fg-progress` doesn't skin while box does | Use `bg-sk-bg-brand-solid` / `bg-sk-fg-brand` for the info circle |
| R8 | **P1** | Prototype | `organisms/ContentTabs.tsx:114` | Unselected option uses skin-tinted `text-sk-text-brand-primary` | Use neutral `text-sk-text-primary`; reserve brand token for the selected row |
| R9 | **P1** | DS (Figma) | Topbar / Discovery / Footer families | ~36 raw + ~201 UUI drift unbound to `LMS/*` | Rebind raw fills + UUI tokens to `LMS/*` variables; remove foreign namespaces |
| R10 | **P1** | Playground | Boards D, F, G, H | VILT, Assessments, Course End, Discovery boards missing → no visual parity | Add the 4 missing boards (Light+Dark) to lock parity |
| R11 | **P2** | Prototype | DS tokens + status callsites | No solid status-bg token; `bg-/border-sk-text-*` used as fills | Add `--sk-bg-success/error/warning-solid` + status-border; swap callsites |
| R12 | **P2** | Prototype | `molecules/DemoControlsMenu.tsx:28-34,195` | Hardcoded light-mode hex swatches, inaccurate in dark mode | Render each swatch in a `[data-skin]` wrapper using `var(--sk-bg-brand-solid)`, or single shared `SKIN_SOLIDS` map w/ dark values |
| R13 | **P2** | Prototype | `CourseCompleteModal.tsx:56` / `CourseCertificate.tsx:82` | Divergent success-check recipes | Pick one canonical disc+icon treatment; extract a shared atom |
| R14 | **P2** | Prototype | `CompletionStatus.tsx:58,64` | In-Progress ring uses fixed `fg-progress` (doesn't skin) | Confirm with design: keep as progress semantic, or switch to brand token if "active brand" intended |
| R15 | **P3** | Prototype | `NoteEditorModal.tsx:109` | Off-scale `border-l-[3px]` | Use `border-l-2`/`border-l-4` scale value |
| R16 | **P3** | Prototype | `DemoControlsMenu.tsx:39` | Redundant `uppercase` on `.sk-text-2xs-medium` | Drop the utility |
| R17 | **P3** | Prototype | `Bookmark` / `FilterChip` / `SidebarToggle` | Touch targets < ~44px | Bump to ~40–44px or document desktop-density |

**Count:** P0 = 3 · P1 = 5 · P2 = 4 · P3 = 3 (plus R9/R10 DS/Playground P1s = 2). Total 17.

---

## 5. Definition of Done & Guardrails

**Definition of Done (per component):**
1. No raw hex/rgba/named color and no inline color/font-size/font-weight style (demo-only controls explicitly exempted and documented).
2. All color via `--sk-*` tokens / `sk-*` utilities; all type via `.sk-text-*`.
3. **Surface roles use surface tokens; text roles use text tokens** — no text token (`--sk-text-*`) used as a `background`/scrim/border fill. (Root cause of the P0 dark-mode breaks.)
4. Verified legible in **light + dark** and across **all 6 skins** (default + ink/sky/violet/gold/red).
5. Brand-adjacent interactive states (hover/active) adapt per skin, or are deliberately gated to the default skin with a documented rationale.
6. Complete state coverage: hover, active/selected, empty, error, loading.

**Automated guardrails (CI / lint):**
- **No-raw-color lint:** ESLint/stylelint rule failing on hex/rgb/hsl/named colors in `components/**` and `app/**`, with an allowlist for `DemoControlsMenu` (or move swatches to a typed `SKIN_SOLIDS` constant and lint the rest).
- **No inline color/type style:** rule rejecting `style={{ color | backgroundColor | fill | fontSize | fontWeight }}`.
- **Typography lint:** forbid raw `text-{size}` / `font-{weight}` Tailwind utilities; require `.sk-text-*`.
- **Token-role lint:** flag `bg-sk-text-*` / `border-sk-text-*` / `*-sk-text-*` used in a background/border position (catches the surface-vs-text inversion class).
- **Dark-mode contrast check:** snapshot/visual-regression (Storybook + Playwright/Chromatic) rendering each story under light/dark × 6 skins; assert WCAG AA on text-over-surface pairs.
- **Figma variables-only scan:** run the DS-audit/lint on `c7EUDrQwP8si08aPipDSIV` in CI (or a scheduled job) failing on raw fills and non-`LMS/*` token bindings; track the ~201 drift / ~36 raw to zero.

**DS ↔ code parity process:**
- Single source of truth = `tokens/colors.css` (already verbatim from `LMS/*`). When DS variables change, regenerate the CSS, don't hand-edit.
- Add the 4 missing Playground boards (R10) so every product family has a visual parity reference; gate "DS family = done" on a green parity check.
- Code Connect map per family so the matrix in §3 is generated, not hand-maintained, and drift surfaces automatically.

---

## 6. Recommendation — F1: 6 Skins, Runtime-Only vs 6 Figma Modes

**Decision:** Keep skins **runtime-only** for now; add a **single "Skin" variable collection with 6 modes binding only `brand-solid`** as a fast-follow — do **not** create 6 full Figma theme modes.

**Why runtime-only is currently correct.** The skin system is intentionally minimal: a skin swaps exactly one value (`--sk-bg-brand-solid`) and every tinted surface/accent-text derives from it via `color-mix` (`colors.css:106-114`). That is one number per skin in code and it adapts light+dark for free. Replicating that as 6 fully-populated Figma modes would mean materializing every derived token 6× (Figma has no runtime `color-mix`), creating 6× the maintenance surface and 6× the drift risk — on a DS file that already carries ~201 drift instances. The cost/benefit is poor.

**Why a minimal 6-mode "Skin" collection is the right fast-follow.** The gap today is that designers cannot *see* the non-default skins in Figma at all, so skin-proofing regressions (exactly the R6/R7/R8 class) are invisible until code. A dedicated collection with one variable (`brand-solid`) × 6 modes, with section/border/accent tokens **aliased** to it (mirroring the CSS derivation), gives designers a skin switcher with near-zero duplication. It also makes the `DemoControlsMenu` swatch problem (R12) moot — swatches read the live variable.

**Trade-offs:**
- *Runtime-only (status quo):* + lowest maintenance, single source of truth, auto light/dark. − skins invisible in Figma; QA happens in-browser only; designers can't pre-validate skin-proofing.
- *Minimal 6-mode collection (recommended):* + designers see/switch skins; aliasing keeps duplication ~1 var/skin; closes the validation gap. − Figma can't replicate `color-mix`, so derived tints are approximations unless manually tuned; small ongoing sync cost.
- *Full 6 theme modes (not recommended):* + pixel-exact per-skin Figma. − 6× token explosion, 6× drift surface, heavy maintenance, contradicts the "one value per skin" design intent.

**Net:** runtime-only stays the source of truth; add the lightweight aliased 6-mode collection so skin-proofing is reviewable in design before it reaches code, and wire the §5 token-role + dark-mode contrast checks to catch the rest.

---

## 7. Remediation Log (2026-06-30)

**Prototype (P0–P3) — done, deployed.** R1/R5 add `--sk-bg-brand-stage` (deep brand, derives per skin+theme) for CertificateView + ViltView. R2/R3/R4 add theme-stable `--sk-bg-overlay` for the VideoPlayer scrims/captions (were `--sk-text-primary`, inverted in dark). R6 derives `--sk-bg-brand-hover` per skin (default SKO keeps yellow). R7 InlineAlert info circle → brand-solid. R11 adds `--sk-bg-{success,warning,error}-solid` + swaps status text-token fills. R12 swatches read live `--sk-bg-brand-solid` via `data-skin` (no hardcoded hex). R16 redundant `uppercase` dropped. R8 kept (matches DS Mobile Tab Select). R13/R14/R15/R17 resolved keep-with-rationale.

**Guardrails — done.** `scripts/check-tokens.mjs` (`npm run lint:tokens`): no raw colours, no text-token-as-fill (inversion class), no raw Tailwind typography. It immediately caught a bug the manual audit missed — **Toast** used `bg-sk-text-primary` (inverts light in dark) under fixed white text → fixed to `--sk-bg-overlay`.

**DS rebind (R9) — done (unpublished).** 308 paints rebound/tokenized to `LMS/*`: 222 systematic (white + neutrals + brand-section, zero value shift) + 21 success/quaternary + 65 raw (white→fg-white/bg-primary, black→text-primary, brand→text-brand-primary). DS drift 201→50, raw 36→3. **Remaining (by decision/flag):** ~30 utility ramps KEPT as a documented data-viz palette; **18 `background/*` — INVESTIGATED & RESOLVED:** these are the SkillUp logo components (`LogoSKO/SKO-Brandmark-*`, `Logo_text`) imported from a **separate remote brand library** ("1. Color Modes" collection, `remote: true`); their internal vectors are correctly bound to that logo library's own tokens — NOT LMS drift, leave as-is (rebinding would break the logo's colour management and isn't possible without detaching); 2 destructive-button tokens (need an LMS error-solid token in the DS first); 3 stray raw (`#ff0000` placeholder ×2, `#667380` ×1). Needs a **library publish** to reach consumers.

**Playground boards (R10) — pending.** Build VILT / Assessments / Course End / Discovery boards (Light+Dark) so all product families have a visual parity reference. Large design-authoring task; in progress.
