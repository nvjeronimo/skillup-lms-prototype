# Moving the prototype to the development team's stack

Started 13 Nov 2026 (Nelson: "refaz o nosso prototype com a stack deles", all at once, same repo,
on the branch `feat/vite-stack`).

## Their stack, read from what they ship (13 Nov 2026)

| | learning-demo (`/learning-demo/`) | sko-fe-storybook (`/storybook/`) |
|---|---|---|
| Build | Vite (Rolldown runtime) | Vite 8.2.2, `@storybook/react-vite` 10.6.0 |
| UI | React 19.2, React Router 7.18.2, TypeScript | React 18.3.1, JavaScript |
| Styles | CSS Modules + BEM class names, `--sko-*` custom properties | CSS Modules |
| Data | axios, `withCredentials`, CSRF from `/csrf/api/v1/token`, `/sko/v1/…` endpoints | — |
| Shell | Module Federation remote `learningMfe`, exposes `./LearningApp` | — |
| Components | imports `../sko-fe-storybook/src/atoms/Button.js` (the old `Atoms/Button`) | `Atoms/*` (old), `v1/Base Components/*` (Batch 1), `ICP/*` |

## Plan

1. **Runtime swap** (this PR): Next 14 → Vite 8 + React 19 + React Router 7. Tailwind stays for now,
   so every page can be compared with the Next build before any styling changes.
2. **Base components with the Batch 1 API and folders** (`v1/Base Components/…`), in CSS Modules:
   Button `type` / `hierarchy` / `size` / `iconLeading` / `iconTrailing` / `htmlType`, Badge
   `badgeStyle` / `color`, Alert `color` / `size`, Link Button, Icon Button, Progress Bar, Video
   Player. The current prop names stay as deprecated aliases.
3. **One pilot page** from Tailwind to CSS Modules, to fix the conversion recipe and measure it.
4. **The rest, bottom-up**, then remove Tailwind. Done means: no `tailwindcss` in package.json,
   no utility classes left, and every route matches the Next build.

Kept on purpose:
- **Tokens:** the Figma-generated token CSS (`tokens/generated`), not their legacy `--sko-*` names
  (12 of them clash with Figma roles; code-token-mapping.md in the docs repo).
- **Breakpoints:** ours, phone < 768, tablet 768–1023, desktop ≥ 1024 (theirs use max-width 768/1024).
- **No Module Federation:** deployment plumbing; it changes no page code.

## Step 1: runtime swap

| Next.js | Now |
|---|---|
| `app/**/page.tsx`, `layout.tsx`, `template.tsx`, `error.tsx`, `not-found.tsx` | Same files, mounted by `src/routes.tsx` through `src/route-module.tsx` (same URLs) |
| `next/link`, `next/navigation`, `next/headers` | `@/lib/router` (same call sites, React Router underneath) |
| `metadata` / `generateMetadata` | `<DocumentTitle />` reads them from the matched routes (layout templates kept) |
| `redirect()` in `app/page.tsx`, `app/platform/page.tsx` | Route loaders (`/` and `/platform` → Dashboard) |
| Account-deletion check in two layouts (server cookie) | Route loaders read the cookie in the browser; the layouts keep the check |
| `next/font/google` | Google Fonts `<link>` in `index.html`; token CSS already names each family |
| Pre-paint scripts in `<head>` | `runPrepaintScripts()` before the first render (`src/main.tsx`) |
| `app/api/assistant/route.ts` | `api/assistant.ts`, a Vercel Function with the same handlers |
| `app/platform/loading.tsx` | Removed: pages read local data, nothing suspends |
| `@storybook/nextjs` 8 | `@storybook/react-vite` 10, `MemoryRouter` decorator |
| `next lint`, `next build` in CI | `eslint` (TS parser + react-hooks + storybook), `vite build` |

React 19 changes made: `RefObject<T | null>` in hook signatures, `useRef` needs its argument,
`inert` is a boolean prop.

### Route check (13 Nov 2026)

- **Cold load, every route** (Vite dev vs the live Next build at lms-prototype-mu.vercel.app, 1280
  wide, light): same final URL, document title, h1 and `<main>` on all 28 page routes, both
  redirects and the four not-found cases. Visible text length equal, or within 3 characters
  (blank lines; first 40 lines compared, equal).
- **Navigation inside the app:** topic → Next (no reload, sidebar scroll kept, title updates),
  back button, course `?tab=` switch keeping the scroll, My Learning tab in the URL.
- **Topic types:** Reading, Video, Practice Quiz open as on the live build.
- **Phone, dark, Harbor skin:** Dashboard screenshots match; Figtree and Plus Jakarta Sans load
  from Google Fonts.
- **Not checked:** SCORM and YouTube topics, every skin, the pre-paint flash on a production
  build, the console during load (the hook attached after load). In dev, React Router logs the
  `notFound()` signal it catches.

### Open

Open on 13 Nov. Closed on 15 Nov in the follow-up at the end of this file, except the persona
test, which stays a separate PR.

- Vercel: the project's framework preset must read Vite (vercel.json sets it). The sample video
  keeps its variable name (`NEXT_PUBLIC_SAMPLE_VIDEO_SRC`, allowed by `envPrefix`).
- `api/assistant.ts` not yet tried on a Vercel deployment (runtime imports carry `.js` for Node
  ESM). In `vite` dev there is no function: the chat answers from its script.
- One chunk of 2.2 MB: split the routes with lazy imports.
- `"use client"` directives are inert now; remove them when each file is converted.
- Pre-existing test failure on main: `lib/personas.test.ts` (the SCORM and YouTube test program
  has no persona mapping).

## Step 2–3 pilot (13 Nov 2026)

- `components/v1/base-components/buttons/Button.tsx` + `Button.module.css`: DS Button 1.4 with
  the Batch 1 props (`type` brand/destructive/success/neutral, `hierarchy`, `size` sm–xl,
  `iconLeading`, `iconTrailing`, `htmlType`, `loading`, `fullWidth`). `ButtonLink.tsx`: the same
  look on a link. `neutral` is the prototype's grey outline; check it against Button 1.4
  Type=Neutral. Not yet: the Done check, Link Button, Icon Button.
- Pilot page: `/account/sign-in` (`SignInView`, `AccountShell`) in CSS Modules. Measured against
  the live build: button 454×44, same fill, radius 6, label padding; card 520×376, same padding,
  radius, shadow and gap.
- Recipe: one `.module.css` per component; DS type styles stay the global `sk-text-*` classes
  (tokens/generated/typography.css); colours, radius and motion read the token custom
  properties; `md:` → `@media (min-width: 768px)`, `lg:` → `@media (min-width: 1024px)`,
  `max-md:` → the phone rule outside the query; hover inside `@media (hover: hover)`.
- `FormField` / `FIELD` (organisms/FormModal) and `SkillUpLogo` are still Tailwind: bottom-up.
- Token lint (`scripts/check-tokens.mjs`) reads the `.module.css` files too (247 stylesheets);
  its Tailwind-class rules now find nothing to check.

## Conversion rules (step 4, every file)

The goal: a file uses no Tailwind utility, and every page looks and behaves exactly as before.
Tailwind stays installed until the last file is done (its reset, preflight, still applies: write
the modules assuming it).

1. **One `Name.module.css` next to `Name.tsx`**, imported as `styles`. Class names in camelCase
   by role (`.card`, `.title`, `.actions`), never by look (`.flexCol`, `.mt4`).
2. **Keep the DOM.** No element added, removed or reordered: the checker compares element by
   element. `space-y-*` / `divide-*` become child selectors (`.list > * + *`), not wrappers.
3. **Global classes stay global:** the DS type styles `sk-text-*` (tokens/generated/typography.css)
   and the project's own helpers in app/globals.css and tokens/*.css (`sk-*`, `tb-*`, …). Replace
   Tailwind's `sr-only` / `not-sr-only` / `animate-spin` with the globals `sk-sr-only` /
   `sk-not-sr-only` / `sk-spin`. Do not edit app/globals.css or tokens/: report what you need.
4. **Values from tokens, as tailwind.config.ts maps them:** `sko-*` colours → `var(--color-*)`
   (`bg-sko-bg-page` → `var(--color-bg-page)`); `rounded-control` → `var(--sk-radius-control)`;
   `layout-*` spacing → `var(--sk-layout-*)`; `shadow-sk-card` → `var(--sk-shadow-card)`;
   `duration-short4` → `var(--motion-duration-short4)`; `ease-standard` →
   `var(--motion-easing-standard)`; `max-w-text` → `var(--sk-container-text-max-width, 1200px)`.
   Tailwind's own scale in px (`p-4` = 16px, `gap-1.5` = 6px, `text-sm` = 14px/20px,
   `shadow-sm` = `0 1px 2px 0 rgb(0 0 0 / 0.05)`). Never a new hex colour.
5. **Breakpoints:** `md:` → `@media (min-width: 768px)`, `lg:` → `@media (min-width: 1024px)`,
   `xl:` → 1280, `sm:` → 640; `max-md:` → `@media (max-width: 767.98px)`, `max-lg:` → 1023.98.
6. **States:** `hover:` → inside `@media (hover: hover)` (the config sets
   hoverOnlyWhenSupported); `focus-visible:`, `active:`, `disabled:`, `group-hover:` (a
   `.group:hover .x` with the group's own module class), `peer-*`, `aria-*:`, `data-[…]:`,
   `has-[…]:`, arbitrary `[&_svg]:` variants → the matching selectors. `dark:` is
   `@media (prefers-color-scheme: dark)` here (no darkMode in the config): keep that meaning.
   `forced-colors:` → `@media (forced-colors: active)`. `motion-reduce:` →
   `@media (prefers-reduced-motion: reduce)`.
7. **Class strings built in code** (`cn(...)`, constants like `FIELD`, maps by variant) become
   module classes joined the same way. A `className` prop passed down from a parent keeps
   working: the parent passes its own module class.
8. **Exported class constants used by other files** (e.g. `FIELD` from organisms/FormModal):
   keep the export name; its value becomes the module class.
9. **Remove `"use client"`** from every file you convert (it means nothing under Vite).
10. **Do not change props, behaviour, copy or tokens.** If something looks wrong, leave it and
    report it.

Checks before you finish (all must pass):
- `node <migtools>/tailwind-left.mjs . <your files>` → 0 left (a word inside user-facing copy
  that happens to be a utility name is a false positive: say so).
- `./node_modules/.bin/tsc --noEmit`, `./node_modules/.bin/eslint . --ext .ts,.tsx`,
  `./node_modules/.bin/vite build`.
- `node <migtools>/compare.mjs --base http://localhost:4600 --cand http://localhost:<your port>
  --routes <routes where your components render> --widths 1280,800,375` → All match, and once
  with `--theme dark`. The base (port 4600) is the build before the conversion.
- Hover and focus are not in the checker: read each `hover:` / `focus-visible:` you translated
  once more against the original.

## Step 4 done (14 Nov 2026): every file in CSS Modules, Tailwind removed

- **Ten parallel branches** (`mig/g01`–`g10`, one folder group each), each compared element by
  element (box + ~50 computed styles) against the build from before the conversion, at 1280 /
  800 / 375, light and dark; then a second pass for the skins.
- **Skins:** `tokens/direction-studio.css`, `skin-harbor.css` and `skin-fluent.css` selected on
  utility names (`.rounded-control`, `.rounded-card.p-4`, `.rounded-track.bg-sko-bg-track`, …).
  Each converted element now carries the matching skin rule in its own module, under
  `:global([data-direction="studio"])` / `:global([data-skin="harbor"|"fluent"])`. The old
  utility-keyed rules in tokens/ no longer match anything (left for reference; to delete).
  A card inside the player's content card is found by `[data-player-content]` (or `main#main`
  in a few modules) instead of the old `.rounded-card .rounded-card`.
- **Square corners** (`tokens/square-corners.css`): nothing sets `data-square-corners` any more;
  not carried over.
- **Tailwind removed:** `app/reset.css` is its preflight written out, plus the focus-ring gap
  that sat in its base layer. Hover rules use `(hover: hover) and (pointer: fine)`, as
  Tailwind's hoverOnlyWhenSupported emitted. `outline-none` became
  `:not(:focus-visible) { outline: … }` so the global focus ring still shows where it did.
- **Final check** (production build vs the pre-conversion build): see the PR.

### Known approximations
- A few Studio rules guess the context the old ancestor class gave: InlineAlert Hint (control
  radius), SidebarToggle inside nav/aside/section, the 32 px avatar in the profile trigger, the
  First steps card in the floating assistant, cards under `main#main`.
- Menus opened inside platform cards (CardOverflowMenu, ShareMenu) do not take Studio's nested
  radius or Harbor/Fluent's nested hairline: only visible with a menu open in those skins.
- Unchanged original quirks the agents found are listed in their reports (PR).

## Follow-up (15 Nov 2026): ready for review

Branch `cursor/vite-stack-followups-14a0`, off `feat/vite-stack`. Each item from the open list
above, plus the leftovers named in the pilot.

### Vercel and `api/assistant.ts`

`vercel.json` is the Vite preset: `framework: "vite"`, `buildCommand: "vite build"`,
`outputDirectory: "dist"`, `installCommand: "pnpm install --ignore-scripts"`. The SPA rewrite
skips `api/` and `assets/`, so the function and the hashed files are not swallowed. `vite build`
is what that command runs, and it succeeds.

The function is a Node Web handler (`GET` / `POST` returning `Response`) at `api/assistant.ts`.
Its runtime imports use `.js` so a Node ESM bundle resolves them; esbuild bundles that file the
way Vercel's Node builder does. Invoked with no `ANTHROPIC_API_KEY`: `GET` is 200
`{"mode":"script"}`, `POST` is 503 `The assistant has no model configured.` With a key set but
never sent to Anthropic: `GET` is `{"mode":"model"}`, a non-JSON `POST` is 400. The same cases
are `lib/assistant/function.test.ts`.

The chat starts in script mode (`useAssistant`) and switches only when `GET` says `model`. No
key means it never calls the model. A `POST` that fails (503, or no route in `vite` dev) is
caught by `resolveAnswer`, which answers that question from the script. `vercel dev` was not
run: the CLI token in this environment is rejected (`The specified token is not valid`).

### Bundle

Before, one JS chunk and one CSS file, and the size warning:

| | file | minified | gzip |
|---|---|---|---|
| before | `index-*.js` | 2,253.90 kB | 667.25 kB |
| before | `index-*.css` | 518.00 kB | 76.93 kB |

Routes and layouts load through React Router `lazy` (`src/routes.tsx`). The course corpus
(`lib/courses`, `lib/content`, `lib/data`) is shared by several routes and was still one
~1 MB chunk, so `vite.config.ts` caps that group at 240 kB (`codeSplitting.groups`, name
`learner-data`). After:

| | largest file | minified | gzip |
|---|---|---|---|
| after | entry `index-*.js` | 423.21 kB | 135.08 kB |
| after | largest `learner-data-*.js` | 190.84 kB | 58.28 kB |
| after | entry `index-*.css` | 133.81 kB | 20.26 kB |

`vite build` reports no chunk over 500 kB. The JS in total is still about 2,243 kB, across 115
files: the split moves code, it does not delete it. Storybook builds. Its own build still warns
on Storybook's vendor chunks (axe, the docs renderer, the iframe) and on one data chunk,
because that build does not use the app's `learner-data` group.

### `"use client"`

Removed from the 25 files that still had it (hooks and stores under `lib/`). Nothing else in
the tree had the directive.

### Skin stylesheets

`tokens/direction-studio.css`, `skin-harbor.css` and `skin-fluent.css` kept the rules that
still match: token overrides, `.sk-text-*`, and the data attributes (`data-glance`,
`data-module-box`, `data-topbar-tab`, `data-segmented`, `data-heading-em`, the search form,
the platform nav). Removed the rules keyed on Tailwind utilities (`.rounded-*`, `.p-*`,
`.bg-sko-*`, `.ring-*`, `.border`, `.shadow-sk-card`, …). Those classes are gone from the DOM;
the same looks already live in the component modules.

### Square corners — removed

`tokens/square-corners.css` is deleted and no longer imported. Nothing sets
`data-square-corners`: the pre-paint script and `ResponsiveShell` never write it, and
`setSquareCorners` has no caller. The file's utility selectors (`.rounded-card`,
`.rounded-pill`, …) matched nothing either, so the radius-token override could not apply.
The per-component `:global([data-square-corners])` rules and the unused `squareCorners` field
on the store are left: they are inert, and dropping the field would change the persisted
shape for no visible effect. The spacing story no longer mentions a square-corners switch.

### Already done, or not this PR

- `FormField` / `FIELD` and `SkillUpLogo` are already CSS Modules (step 4). No Tailwind utility
  left on them. No change.
- Button gaps from the pilot (the Done check, Link Button, Icon Button) are not a gate for
  this stack PR. Left as noted there.
- `lib/personas.test.ts` still fails (the SCORM and YouTube test program has no persona
  mapping). Not touched.

### Checks (15 Nov 2026)

- `tsc --noEmit`, `eslint . --ext .ts,.tsx`: clean.
- `tokens:check`: generated CSS matches `tokens/figma/variables.json`. `lint:tokens`: 515 files
  and 247 stylesheets clean.
- `vitest run`: 343 passed, 1 failed — `lib/personas.test.ts` only.
- `build-storybook`: completed.
- Production preview, 1280 wide: Dashboard (`Good morning, John.`), the AI-Driven Content
  course page, the SCORM activity `sct-m2-t1` (package iframe loaded), the YouTube lesson
  `ytt-m1-t2` (nocookie embed loaded). No page errors and no failed requests. Client
  navigation Dashboard → My Learning, and Next on the YouTube lesson, updates the URL and the
  title with no reload.
