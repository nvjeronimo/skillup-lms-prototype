import type { Meta, StoryObj } from "@storybook/react";

/**
 * SKO DS spacing, container and radius variables (collection "3. Responsive 📐",
 * modes Desktop / Tablet / Mobile). 4pt base with a 6px half-step; `Spacing/2xl`
 * and up shrink on Tablet and Mobile. Values are [Desktop, Tablet, Mobile] px.
 * See tokens/spacing.md for the Tailwind classes.
 */
type ModeValues = [number, number, number];

const SPACING: { token: string; px: ModeValues }[] = [
  { token: "Spacing/none", px: [0, 0, 0] },
  { token: "Spacing/xxs", px: [2, 2, 2] },
  { token: "Spacing/xs", px: [4, 4, 4] },
  { token: "Spacing/sm", px: [6, 6, 6] },
  { token: "Spacing/md", px: [8, 8, 8] },
  { token: "Spacing/lg", px: [12, 12, 12] },
  { token: "Spacing/xl", px: [16, 16, 16] },
  { token: "Spacing/2xl", px: [20, 20, 16] },
  { token: "Spacing/3xl", px: [24, 20, 16] },
  { token: "Spacing/4xl", px: [32, 24, 20] },
  { token: "Spacing/5xl", px: [40, 32, 24] },
  { token: "Spacing/6xl", px: [48, 40, 32] },
  { token: "Spacing/7xl", px: [64, 48, 40] },
  { token: "Spacing/8xl", px: [80, 64, 48] },
  { token: "Spacing/9xl", px: [96, 80, 64] },
  { token: "Spacing/10xl", px: [128, 96, 80] },
  { token: "Spacing/11xl", px: [160, 128, 96] },
];

const CONTAINER: { token: string; px: ModeValues }[] = [
  { token: "Container/gutter", px: [32, 24, 16] },
  { token: "Container/gap", px: [24, 16, 12] },
  { token: "Container/max-width", px: [1280, 768, 480] },
];

/** `Radius/fixed-*` (same in every mode) + the Tailwind class that renders it. */
const RADII = [
  { token: "Radius/fixed-none", px: 0, cls: "rounded-none" },
  { token: "Radius/fixed-xxs", px: 2, cls: "rounded-sm" },
  { token: "Radius/fixed-xs", px: 4, cls: "rounded" },
  { token: "Radius/fixed-sm", px: 6, cls: "rounded-md" },
  { token: "Radius/fixed-md", px: 8, cls: "rounded-lg" },
  { token: "Radius/fixed-lg", px: 10, cls: "rounded-[10px]" },
  { token: "Radius/fixed-xl", px: 12, cls: "rounded-xl" },
  { token: "Radius/fixed-2xl", px: 16, cls: "rounded-2xl" },
  { token: "Radius/fixed-3xl", px: 20, cls: "rounded-[20px]" },
  { token: "Radius/fixed-4xl", px: 24, cls: "rounded-3xl" },
  { token: "Radius/fixed-full", px: 9999, cls: "rounded-full" },
];

/** `Radius/flex-*` equals `fixed-*` up to xl; these three are mode-aware. */
const FLEX_RADII: { token: string; px: ModeValues }[] = [
  { token: "Radius/flex-2xl", px: [16, 16, 12] },
  { token: "Radius/flex-3xl", px: [20, 16, 12] },
  { token: "Radius/flex-4xl", px: [24, 20, 16] },
];

const MODES = ["D", "T", "M"] as const;

function modeLabel(px: ModeValues) {
  return px.every((v) => v === px[0]) ? `${px[0]}px` : px.join(" / ");
}

function Foundations() {
  return (
    <div className="flex flex-col gap-8 p-6">
      <section>
        <h2 className="sk-text-title-medium-semibold mb-1 text-sko-text-default">Spacing</h2>
        <p className="sk-text-body-medium-regular mb-4 text-sko-text-subtle">
          4pt grid with a 6px half-step. From Spacing/2xl up the value shrinks on Tablet and
          Mobile (bars: D = Desktop, T = Tablet, M = Mobile).
        </p>
        <div className="flex flex-col gap-3">
          {SPACING.map((s) => (
            <div key={s.token} className="flex items-center gap-4">
              <code className="sk-text-body-small-regular w-28 shrink-0 text-sko-text-subtle">{s.token}</code>
              <span className="sk-text-body-small-regular w-28 shrink-0 text-sko-text-subtle">
                {modeLabel(s.px)}
              </span>
              <div className="flex flex-col gap-1">
                {s.px.map((px, i) => (
                  <div key={MODES[i]} className="flex items-center gap-2">
                    <span className="sk-text-label-small-regular w-3 text-sko-text-subtle">{MODES[i]}</span>
                    <span className="h-2 rounded-sm bg-sko-bg-primary" style={{ width: px }} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="sk-text-title-medium-semibold mb-1 text-sko-text-default">Container</h2>
        <p className="sk-text-body-medium-regular mb-4 text-sko-text-subtle">
          Page inset, the gap between items inside a container, and the content column width.
        </p>
        <div className="flex flex-col gap-2">
          {CONTAINER.map((c) => (
            <div key={c.token} className="flex items-center gap-4">
              <code className="sk-text-body-small-regular w-36 shrink-0 text-sko-text-subtle">{c.token}</code>
              <span className="sk-text-body-small-regular text-sko-text-default">
                D {c.px[0]} · T {c.px[1]} · M {c.px[2]}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="sk-text-title-medium-semibold mb-1 text-sko-text-default">Radii</h2>
        <p className="sk-text-body-medium-regular mb-4 text-sko-text-subtle">
          Buttons use Radius/fixed-sm (6), inputs fixed-md (8), cards and panels fixed-xl (12),
          modals fixed-2xl (16), badges fixed-full.
        </p>
        <div className="flex flex-wrap gap-6">
          {RADII.map((r) => (
            <div key={r.token} className="flex flex-col items-center gap-2">
              <span
                className="h-16 w-16 border border-sko-border-primary bg-sko-bg-primary-soft"
                style={{ borderRadius: r.px }}
              />
              <code className="sk-text-body-small-regular text-sko-text-subtle">{r.token}</code>
              <span className="sk-text-label-small-regular normal-case text-sko-text-subtle">
                {r.px === 9999 ? "full" : `${r.px}px`} · {r.cls}
              </span>
            </div>
          ))}
        </div>
        <p className="sk-text-body-medium-regular mb-2 mt-6 text-sko-text-subtle">
          Radius/flex-* equals fixed-* up to xl; the three largest steps are mode-aware:
        </p>
        <div className="flex flex-col gap-2">
          {FLEX_RADII.map((r) => (
            <div key={r.token} className="flex items-center gap-4">
              <code className="sk-text-body-small-regular w-36 shrink-0 text-sko-text-subtle">{r.token}</code>
              <span className="sk-text-body-small-regular text-sko-text-default">
                D {r.px[0]} · T {r.px[1]} · M {r.px[2]}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

const meta: Meta<typeof Foundations> = {
  title: "Foundations/Spacing",
  component: Foundations,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Foundations>;

export const ScaleAndRadii: Story = {};
