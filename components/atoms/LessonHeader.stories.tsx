import type { Meta, StoryObj } from "@storybook/react";
import { LessonHeader } from "./LessonHeader";

const meta: Meta<typeof LessonHeader> = {
  title: "Atoms/Lesson Header",
  component: LessonHeader,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: { label: "Define and measure" },
};
export default meta;

type Story = StoryObj<typeof LessonHeader>;

export const Default: Story = {};
