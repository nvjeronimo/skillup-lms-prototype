import type { Meta, StoryObj } from "@storybook/react";
import { ThreadItem } from "./ThreadItem";

const meta: Meta<typeof ThreadItem> = {
  title: "Molecules/Thread Item",
  component: ThreadItem,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    author: "Carlos M.",
    timestamp: "2 hours ago",
    content: "Great point on measurement systems analysis — but what about gauge R&R?",
    replies: 3,
  },
  decorators: [
    (Story) => (
      <div className="max-w-2xl">
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof ThreadItem>;

export const Default: Story = {};
export const NoReplies: Story = { args: { replies: 0 } };
