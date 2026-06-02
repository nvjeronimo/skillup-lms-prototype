import type { Meta, StoryObj } from "@storybook/react";

const STEPS = [
  { token: "1", px: 4 },
  { token: "2", px: 8 },
  { token: "3", px: 12 },
  { token: "4", px: 16 },
  { token: "5", px: 20 },
  { token: "6", px: 24 },
  { token: "8", px: 32 },
  { token: "10", px: 40 },
  { token: "12", px: 48 },
];

function SpacingScale() {
  return (
    <div className="flex flex-col gap-3 p-6">
      <h2 className="lms-text-lg-semibold text-lms-text-primary">4pt / 8pt grid</h2>
      {STEPS.map((s) => (
        <div key={s.token} className="flex items-center gap-4">
          <code className="lms-text-xs-regular w-20 text-lms-text-tertiary">space-{s.token}</code>
          <span className="lms-text-xs-regular w-12 text-lms-text-tertiary">{s.px}px</span>
          <span className="h-4 rounded bg-lms-bg-brand-solid" style={{ width: s.px }} />
        </div>
      ))}
    </div>
  );
}

const meta: Meta<typeof SpacingScale> = {
  title: "Foundations/Spacing",
  component: SpacingScale,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof SpacingScale>;

export const Scale: Story = {};
