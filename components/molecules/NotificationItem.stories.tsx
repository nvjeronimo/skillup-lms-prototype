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
    body: "“Great point on measurement systems analysis.”",
    timestamp: "25 min ago",
    unread: true,
  },
  argTypes: {
    type: {
      control: "select",
      options: [
        "live-now",
        "live-soon",
        "course-update",
        "assignment-due",
        "discussion-reply",
        "peer-review-received",
        "syllabus-change",
      ],
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

export const LiveNow: Story = { args: { type: "live-now", title: "Live now: Office hours with Sarah" } };
export const CourseUpdate: Story = { args: { type: "course-update", title: "Sarah added new content" } };
export const AssignmentDue: Story = { args: { type: "assignment-due", title: "Practice Quiz is due in 2 days" } };
export const DiscussionReply: Story = {};
export const PeerReview: Story = { args: { type: "peer-review-received", title: "Anonymous peer rated your submission 4/5" } };
export const SyllabusChange: Story = { args: { type: "syllabus-change", title: "Module 04 syllabus updated" } };
export const Read: Story = { args: { unread: false } };
