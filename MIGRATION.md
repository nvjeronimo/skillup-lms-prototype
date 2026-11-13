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

### Route check (Vite dev build, 13 Nov 2026)

All page routes, the two redirects and the four not-found cases were opened on the Vite dev build
and on the live Next build (lms-prototype-mu.vercel.app): same final URL, document title, h1 and
page text on every route. In dev, React Router logs the `notFound()` signal it catches. Not yet
compared screen by screen.

### Open

- Vercel: the project's framework preset must read Vite (vercel.json sets it). The sample video
  keeps its variable name (`NEXT_PUBLIC_SAMPLE_VIDEO_SRC`, allowed by `envPrefix`).
- `api/assistant.ts` not yet tried on a Vercel deployment.
- One chunk of 2.2 MB: split the routes with lazy imports.
- `"use client"` directives are inert now; remove them when each file is converted.
- Pre-existing test failure on main: `lib/personas.test.ts` (the SCORM and YouTube test program
  has no persona mapping).
