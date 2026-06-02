import type { Meta, StoryObj } from "@storybook/react";
import { CourseCard } from "./CourseCard";

const meta: Meta<typeof CourseCard> = {
  title: "Organisms/Course Card",
  component: CourseCard,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    title: "Six Sigma for Process Improvement",
    provider: "SkillUp",
    courseType: "Program",
    difficulty: "Intermediate",
    deliveryMode: "Flexible + Live",
    progressPct: 67,
    estimation: "May 24",
    initials: "AI",
    upNext: { type: "Video", title: "The lifecycle begins long before any code…" },
  },
  decorators: [
    (Story) => (
      <div className="max-w-4xl">
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof CourseCard>;

export const Default: Story = {};
export const Microsoft: Story = {
  args: { provider: "Microsoft", courseType: "Course", difficulty: "Advanced", deliveryMode: "Live Sessions" },
};
export const Beginner: Story = {
  args: { difficulty: "Beginner", deliveryMode: "Flexible Learning", progressPct: 12 },
};
