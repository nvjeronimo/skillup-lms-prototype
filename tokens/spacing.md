# Spacing, container and radius reference

Source of truth: the DS variable collection **3. Responsive 📐** (Figma file
`c7EUDrQwP8si08aPipDSIV`), modes **Desktop / Tablet / Mobile**. The prototype's
breakpoints come from `lib/useBreakpoint.ts`: mobile ≤ 768, tablet 769–1024,
desktop ≥ 1025.

Tailwind's default scale maps 1 unit = 4px (`0.5` = 2px, `1.5` = 6px), so every
DS step has a Tailwind utility. Steps `none` to `xl` are fixed in every mode.
**`2xl` and up are mode-aware**: they shrink on Tablet and Mobile. Write them
mobile-first with the prototype's breakpoints, `min-[769px]:` (tablet and up)
and `min-[1025px]:` (desktop). Don't use `md:` / `lg:` for a mode switch: they
fire at 768 / 1024, one pixel off the prototype's breakpoints.

Media-query classes do not follow the forced device preview (ResponsiveShell
frames the app at 834 / 375 px by inline width). A component that must follow
the forced mode picks its classes from `useBreakpoint()` instead.

## Spacing

The Tailwind column uses `p-`; the same step works for any spacing utility
(`px-`, `gap-`, `m-`, `space-y-` …).

| DS token | Desktop / Tablet / Mobile (px) | Tailwind | Typical use |
|----------|-------------------------------|----------|-------------|
| `Spacing/none` | 0 | `p-0` | reset |
| `Spacing/xxs` | 2 | `p-0.5` | hairline gaps, note dot offset |
| `Spacing/xs` | 4 | `p-1` | icon ↔ label micro-gap |
| `Spacing/sm` | 6 | `p-1.5` | icon ↔ label gap (`gap-1.5`, the most used step) |
| `Spacing/md` | 8 | `p-2` | chip padding, tight rows |
| `Spacing/lg` | 12 | `p-3` | topic-row vertical padding |
| `Spacing/xl` | 16 | `p-4` | card / item padding |
| `Spacing/2xl` | 20 / 20 / 16 | `p-4 min-[769px]:p-5` | section inner padding |
| `Spacing/3xl` | 24 / 20 / 16 | `p-4 min-[769px]:p-5 min-[1025px]:p-6` | panel / header padding |
| `Spacing/4xl` | 32 / 24 / 20 | `p-5 min-[769px]:p-6 min-[1025px]:p-8` | |
| `Spacing/5xl` | 40 / 32 / 24 | `p-6 min-[769px]:p-8 min-[1025px]:p-10` | large section breaks |
| `Spacing/6xl` | 48 / 40 / 32 | `p-8 min-[769px]:p-10 min-[1025px]:p-12` | hero spacing |
| `Spacing/7xl` | 64 / 48 / 40 | `p-10 min-[769px]:p-12 min-[1025px]:p-16` | |
| `Spacing/8xl` | 80 / 64 / 48 | `p-12 min-[769px]:p-16 min-[1025px]:p-20` | |
| `Spacing/9xl` | 96 / 80 / 64 | `p-16 min-[769px]:p-20 min-[1025px]:p-24` | |
| `Spacing/10xl` | 128 / 96 / 80 | `p-20 min-[769px]:p-24 min-[1025px]:p-32` | |
| `Spacing/11xl` | 160 / 128 / 96 | `p-24 min-[769px]:p-32 min-[1025px]:p-40` | |

## Container

All three are mode-aware.

| DS token | Desktop / Tablet / Mobile (px) | Tailwind | Use |
|----------|-------------------------------|----------|-----|
| `Container/gutter` | 32 / 24 / 16 | `px-4 min-[769px]:px-6 min-[1025px]:px-8` | the container's own side inset (screen gutters) |
| `Container/gap` | 24 / 16 / 12 | `gap-3 min-[769px]:gap-4 min-[1025px]:gap-6` | gap between items inside a container, one step below the gutter at every breakpoint |
| `Container/max-width` | 1280 / 768 / 480 | `max-w-[480px] min-[769px]:max-w-[768px] min-[1025px]:max-w-[1280px]` | content column width |

## Component anchors

- Sidebar widths: Expanded `280px`, Collapsed `72px`, Mobile drawer `320px`.
- Topbar height: Desktop/Tablet `60px`, Mobile `56px`.
- Topic Footer Nav height: `64px`.
- Overlay panel width: `480px` desktop, full-screen `< 768px`.
- Notification / Saved icon avatar: `36×36`, inner icon `18×18`.
- Completion Status circle: `20×20`.

## Radii

`Radius/fixed-*` is the same in every mode.

| Tailwind | px | DS token | Use |
|----------|----|----------|-----|
| `rounded-none` | 0 | `Radius/fixed-none` | |
| `rounded-sm` | 2 | `Radius/fixed-xxs` | |
| `rounded` | 4 | `Radius/fixed-xs` | small chips |
| `rounded-md` | 6 | `Radius/fixed-sm` | buttons (Button V2, all sizes) |
| `rounded-lg` | 8 | `Radius/fixed-md` | inputs, menus, certificate |
| `rounded-[10px]` | 10 | `Radius/fixed-lg` | (no Tailwind step) |
| `rounded-xl` | 12 | `Radius/fixed-xl` | cards, panels, video frame |
| `rounded-2xl` | 16 | `Radius/fixed-2xl` | modals |
| `rounded-[20px]` | 20 | `Radius/fixed-3xl` | (no Tailwind step) |
| `rounded-3xl` | 24 | `Radius/fixed-4xl` | |
| `rounded-full` | 9999 | `Radius/fixed-full` | Badge v2 (Shape=Pill), avatars, rings |

`Radius/flex-*` matches `fixed-*` from `none` to `xl` (and `full`); the three
largest steps are mode-aware:

| DS token | Desktop / Tablet / Mobile (px) | Tailwind |
|----------|-------------------------------|----------|
| `Radius/flex-2xl` | 16 / 16 / 12 | `rounded-xl min-[769px]:rounded-2xl` |
| `Radius/flex-3xl` | 20 / 16 / 12 | `rounded-xl min-[769px]:rounded-2xl min-[1025px]:rounded-[20px]` |
| `Radius/flex-4xl` | 24 / 20 / 16 | `rounded-2xl min-[769px]:rounded-[20px] min-[1025px]:rounded-3xl` |
