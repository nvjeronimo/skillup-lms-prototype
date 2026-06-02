import type { Meta, StoryObj } from "@storybook/react";

/** SKO DS spacing primitives (Figma `Spacing/*` variables). 4pt base with a 6px half-step. */
const SPACING = [
  { token: "spacing-none", px: 0 },
  { token: "spacing-xxs", px: 2 },
  { token: "spacing-xs", px: 4 },
  { token: "spacing-sm", px: 6 },
  { token: "spacing-md", px: 8 },
  { token: "spacing-lg", px: 12 },
  { token: "spacing-xl", px: 16 },
  { token: "spacing-2xl", px: 20 },
  { token: "spacing-3xl", px: 24 },
  { token: "spacing-4xl", px: 32 },
];

/** SKO DS corner radii (Figma `Radius/*` variables). */
const RADII = [
  { token: "radius-none", px: 0, label: "0px" },
  { token: "radius-sm", px: 6, label: "6px" },
  { token: "radius-md", px: 8, label: "8px" },
  { token: "radius-xl", px: 12, label: "12px" },
  { token: "radius-full", px: 9999, label: "full" },
];

function Foundations() {
  return (
    <div className="flex flex-col gap-8 p-6">
      <section>
        <h2 className="lms-text-lg-semibold mb-1 text-lms-text-primary">Spacing</h2>
        <p className="lms-text-sm-regular mb-4 text-lms-text-tertiary">
          4pt grid with a 6px half-step — matches the SKO design-system variables.
        </p>
        <div className="flex flex-col gap-3">
          {SPACING.map((s) => (
            <div key={s.token} className="flex items-center gap-4">
              <code className="lms-text-xs-regular w-28 text-lms-text-tertiary">{s.token}</code>
              <span className="lms-text-xs-regular w-10 text-lms-text-tertiary">{s.px}px</span>
              <span className="h-4 rounded bg-lms-bg-brand-solid" style={{ width: s.px }} />
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="lms-text-lg-semibold mb-1 text-lms-text-primary">Radii</h2>
        <p className="lms-text-sm-regular mb-4 text-lms-text-tertiary">
          Buttons + inputs use radius-md (8); cards + panels use radius-xl (12); pills use full.
        </p>
        <div className="flex flex-wrap gap-6">
          {RADII.map((r) => (
            <div key={r.token} className="flex flex-col items-center gap-2">
              <span
                className="h-16 w-16 border border-lms-border-brand bg-lms-bg-brand-section"
                style={{ borderRadius: r.px }}
              />
              <code className="lms-text-xs-regular text-lms-text-tertiary">{r.token}</code>
              <span className="lms-text-2xs-regular text-lms-text-tertiary">{r.label}</span>
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
