import type { Meta, StoryObj } from "@storybook/react";
import { TopicTypeBadge, ALL_TOPIC_TYPES } from "./TopicTypeBadge";

const meta: Meta<typeof TopicTypeBadge> = {
  title: "Atoms/Badge (Topic Types)",
  component: TopicTypeBadge,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: { type: "Video", showIcon: true },
  argTypes: {
    type: { control: "select", options: ALL_TOPIC_TYPES },
  },
};
export default meta;

type Story = StoryObj<typeof TopicTypeBadge>;

export const Default: Story = {};

export const AllTypes: Story = {
  render: () => (
    <div className="flex max-w-xl flex-wrap gap-2">
      {ALL_TOPIC_TYPES.map((t) => (
        <TopicTypeBadge key={t} type={t} />
      ))}
    </div>
  ),
};
