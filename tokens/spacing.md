# Spacing scale reference

The prototype uses an 8pt grid with a 4pt half-step, matching the UUI baseline.
Tailwind's default spacing scale already maps 1 unit = 4px, so the named steps below
correspond directly to Tailwind utilities.

| Token | px | Tailwind | Typical use |
|-------|----|----------|-------------|
| `space-0` | 0 | `p-0` | reset |
| `space-0.5` | 2 | `p-0.5` | hairline gaps, note dot offset |
| `space-1` | 4 | `p-1` | icon ↔ label micro-gap |
| `space-2` | 8 | `p-2` | chip padding, tight rows |
| `space-3` | 12 | `p-3` | topic-row vertical padding |
| `space-4` | 16 | `p-4` | card / item padding |
| `space-5` | 20 | `p-5` | section inner padding |
| `space-6` | 24 | `p-6` | panel / header padding |
| `space-8` | 32 | `p-8` | screen gutters |
| `space-10` | 40 | `p-10` | large section breaks |
| `space-12` | 48 | `p-12` | hero spacing |

## Component anchors

- Sidebar widths: Expanded `280px`, Collapsed `72px`, Mobile drawer `320px`.
- Topbar height: Desktop/Tablet `60px`, Mobile `56px`.
- Topic Footer Nav height: `64px`.
- Overlay panel width: `480px` desktop, full-screen `< 768px`.
- Notification / Saved icon avatar: `36×36`, inner icon `18×18`.
- Completion Status circle: `20×20`.

## Radii

| Token | px | Use |
|-------|----|----|
| `rounded` | 4 | small chips |
| `rounded-md` | 6 | buttons, badges |
| `rounded-lg` | 8 | cards, items |
| `rounded-xl` | 12 | panels, video frame |
| `rounded-full` | 999 | avatars, pills, rings |
