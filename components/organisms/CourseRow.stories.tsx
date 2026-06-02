import type { Meta, StoryObj } from "@storybook/react";
import { CourseRow } from "./CourseRow";

const meta: Meta<typeof CourseRow> = {
  title: "Organisms/Course Row",
  component: CourseRow,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    title: "Lean principles overview",
    difficulty: "Intermediate",
    progressPct: 40,
    initials: "LP",
  },
  decorators: [
    (Story) => (
      <div className="max-w-md">
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof CourseRow>;

export const Default: Story = {};

export const List: Story = {
  render: () => (
    <div className="flex max-w-md flex-col gap-2">
      <CourseRow title="Lean principles overview" difficulty="Beginner" progressPct={100} initials="LP" />
      <CourseRow title="DMAIC for process improvement" difficulty="Intermediate" progressPct={40} initials="DM" />
      <CourseRow title="Advanced control charts" difficulty="Advanced" progressPct={0} initials="AC" />
    </div>
  ),
};
