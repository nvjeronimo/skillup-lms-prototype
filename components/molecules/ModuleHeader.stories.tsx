import type { Meta, StoryObj } from "@storybook/react";
import { ModuleHeader } from "./ModuleHeader";

const meta: Meta<typeof ModuleHeader> = {
  title: "Molecules/Module Header",
  component: ModuleHeader,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    label: "MODULE 03",
    title: "DMAIC for process improvement",
    topicsCompleted: 2,
    topicsTotal: 9,
    collapsed: false,
    isCompleted: false,
  },
  decorators: [
    (Story) => (
      <div className="w-[280px] border border-lms-border-secondary bg-lms-bg-primary">
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof ModuleHeader>;

export const Expanded: Story = {};
export const Collapsed: Story = { args: { collapsed: true } };
export const Completed: Story = {
  args: {
    label: "MODULE 01",
    title: "Introduction to ASQ-Certified Six Sigma Black Belt",
    topicsCompleted: 3,
    topicsTotal: 3,
    isCompleted: true,
  },
};
