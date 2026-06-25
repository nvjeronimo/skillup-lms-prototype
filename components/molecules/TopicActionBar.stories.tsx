import type { Meta, StoryObj } from "@storybook/react";
import { TopicActionBar } from "./TopicActionBar";

const meta: Meta<typeof TopicActionBar> = {
  title: "Molecules/Topic Action Bar",
  component: TopicActionBar,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: { state: "incomplete" },
  argTypes: {
    state: { control: "select", options: ["incomplete", "action", "review", "completed"] },
  },
};
export default meta;

type Story = StoryObj<typeof TopicActionBar>;

export const Incomplete: Story = { args: { state: "incomplete" } };
export const ActionRequired: Story = { args: { state: "action" } };
export const UnderReview: Story = { args: { state: "review" } };
export const Completed: Story = { args: { state: "completed" } };
