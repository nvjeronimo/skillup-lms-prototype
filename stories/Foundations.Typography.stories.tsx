import type { Meta, StoryObj } from "@storybook/react";

const RAMP = [
  "lms-text-display-md-bold",
  "lms-text-display-sm-semibold",
  "lms-text-display-xs-semibold",
  "lms-text-lg-semibold",
  "lms-text-lg-medium",
  "lms-text-md-semibold",
  "lms-text-md-medium",
  "lms-text-md-regular",
  "lms-text-sm-semibold",
  "lms-text-sm-medium",
  "lms-text-sm-regular",
  "lms-text-xs-semibold",
  "lms-text-xs-medium",
  "lms-text-xs-regular",
  "lms-text-2xs-semibold",
  "lms-text-2xs-medium",
  "lms-text-2xs-regular",
];

function TypeRamp() {
  return (
    <div className="flex flex-col gap-4 p-6">
      {RAMP.map((cls) => (
        <div key={cls} className="flex items-baseline gap-6 border-b border-lms-border-secondary pb-3">
          <code className="lms-text-xs-regular w-56 shrink-0 text-lms-text-tertiary">.{cls}</code>
          <span className={`${cls} text-lms-text-primary`}>The quick brown fox jumps over</span>
        </div>
      ))}
    </div>
  );
}

const meta: Meta<typeof TypeRamp> = {
  title: "Foundations/Typography",
  component: TypeRamp,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof TypeRamp>;

export const Ramp: Story = {};
