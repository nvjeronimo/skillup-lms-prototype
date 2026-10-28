import type { Meta, StoryObj } from "@storybook/react";
import { NotificationItem } from "./NotificationItem";

const meta: Meta<typeof NotificationItem> = {
  title: "Molecules/Notification Item",
  component: NotificationItem,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    type: "discussion-reply",
    title: "Carlos M. replied to your discussion",
    body: "Six Sigma · Module 03",
    timestamp: "25 min ago",
    unread: true,
  },
  argTypes: {
    type: {
      control: "select",
      options: ["discussion-reply", "instructor-post", "course-update", "ora-grade-received"],
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[440px]">
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof NotificationItem>;

export const CourseUpdate: Story = { args: { type: "course-update", title: "Sarah added new content" } };
export const DiscussionReply: Story = {};
export const Read: Story = { args: { unread: false } };
export const InstructorPost: Story = { args: { type: "instructor-post", title: "Sarah Lee posted in Six Sigma: Office hours recap" } };
export const OraGrade: Story = { args: { type: "ora-grade-received", title: "Your assessment was graded: Control plan" } };
