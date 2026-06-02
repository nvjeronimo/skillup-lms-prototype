import type { Meta, StoryObj } from "@storybook/react";
import { CourseHeader } from "./CourseHeader";

const meta: Meta<typeof CourseHeader> = {
  title: "Molecules/Course Header (Sidebar)",
  component: CourseHeader,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    eyebrow: "SkillUp",
    title: "Six Sigma for Process Improvement",
    expanded: true,
    compact: false,
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

type Story = StoryObj<typeof CourseHeader>;

export const Expanded: Story = {};
export const Collapsed: Story = {
  args: { compact: true, expanded: false },
  decorators: [
    (Story) => (
      <div className="w-[72px] border border-lms-border-secondary bg-lms-bg-primary">
        <Story />
      </div>
    ),
  ],
};
