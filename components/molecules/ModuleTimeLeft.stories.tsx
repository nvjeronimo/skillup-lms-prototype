import type { Meta, StoryObj } from "@storybook/react";
import { ModuleTimeLeft } from "./ModuleTimeLeft";

const meta: Meta<typeof ModuleTimeLeft> = {
  title: "Molecules/Module Time-Left",
  component: ModuleTimeLeft,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    summary: "1 h 20 min remaining",
    breakdown: [{ label: "3 videos" }, { label: "2 readings" }, { label: "1 quiz" }],
  },
};
export default meta;

type Story = StoryObj<typeof ModuleTimeLeft>;

export const Default: Story = {};
export const NoBreakdown: Story = { args: { breakdown: [] } };
