import type { Meta, StoryObj } from "@storybook/react";
import { CourseHeader } from "./CourseHeader";

const meta: Meta<typeof CourseHeader> = {
  title: "Molecules/Course Header (Sidebar)",
  component: CourseHeader,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    eyebrow: "Course",
    title: "Six Sigma for Process Improvement",
    partners: [{ name: "SkillUp" }],
    expanded: true,
    compact: false,
  },
  decorators: [
    (Story) => (
      <div className="w-[280px] border border-sko-border-subtle bg-sko-bg-page">
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof CourseHeader>;

export const Expanded: Story = {};
export const TwoPartners: Story = {
  name: "Two partners",
  args: { partners: [{ name: "SkillUp" }, { name: "Microsoft" }] },
};
export const Collapsed: Story = {
  args: { compact: true, expanded: false },
  decorators: [
    (Story) => (
      <div className="w-[72px] border border-sko-border-subtle bg-sko-bg-page">
        <Story />
      </div>
    ),
  ],
};
