import type { Meta, StoryObj } from "@storybook/react";
import { ContentFeedback } from "./ContentFeedback";

const meta: Meta<typeof ContentFeedback> = {
  title: "Molecules/Content Feedback",
  component: ContentFeedback,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: { value: null },
  argTypes: { value: { control: "radio", options: [null, "like", "dislike"] } },
};
export default meta;

type Story = StoryObj<typeof ContentFeedback>;

export const Default: Story = {};
export const Liked: Story = { args: { value: "like" } };
export const Disliked: Story = { args: { value: "dislike" } };
