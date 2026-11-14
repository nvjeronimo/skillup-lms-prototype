import type { Meta, StoryObj } from "@storybook/react-vite";
import { CourseCompleteModal } from "./CourseCompleteModal";
import styles from "./CourseCompleteModal.stories.module.css";

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
      <div className={styles.frame}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof CourseCompleteModal>;

export const Open: Story = {};
