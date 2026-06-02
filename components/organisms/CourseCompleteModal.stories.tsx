import type { Meta, StoryObj } from "@storybook/react";
import { CourseCompleteModal } from "./CourseCompleteModal";

const meta: Meta<typeof CourseCompleteModal> = {
  title: "Organisms/Course Complete Modal",
  component: CourseCompleteModal,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: {
    open: true,
    courseTitle: "Six Sigma for Process Improvement",
    onClose: () => {},
  },
  decorators: [
    (Story) => (
      <div className="h-[600px]">
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof CourseCompleteModal>;

export const Open: Story = {};
