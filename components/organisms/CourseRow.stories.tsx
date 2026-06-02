import type { Meta, StoryObj } from "@storybook/react";
import { CourseRow } from "./CourseRow";

const meta: Meta<typeof CourseRow> = {
  title: "Organisms/Course Row",
  component: CourseRow,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    title: "Digital Marketing Fundamentals",
    deliveryMode: "Live Sessions",
    state: "Active",
    progressPct: 0,
  },
  argTypes: { state: { control: "radio", options: ["Active", "Locked", "Available"] } },
  decorators: [
    (Story) => (
      <div className="max-w-3xl">
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof CourseRow>;

export const Active: Story = { args: { state: "Active", progressPct: 0 } };
export const Locked: Story = {
  args: { state: "Locked", title: "AI-Driven Content and Brand Comms", unlockLabel: "UNLOCKS MAY 18" },
};
export const Available: Story = { args: { state: "Available" } };

export const List: Story = {
  render: () => (
    <div className="flex max-w-3xl flex-col gap-2">
      <CourseRow title="Digital Marketing Fundamentals" state="Active" progressPct={0} />
      <CourseRow title="AI-Driven Content and Brand Comms" state="Locked" />
      <CourseRow title="Digital Marketing Fundamentals" state="Available" />
    </div>
  ),
};
