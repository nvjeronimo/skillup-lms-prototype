import type { Meta, StoryObj } from "@storybook/react";
import { ContentFeedback } from "./ContentFeedback";
import { TopicActionBar } from "./TopicActionBar";

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

/** Figma `Feedback-Mark` (13 Oct 2026): Mark as Complete in the feedback row, on the right. */
export const WithMarkAsComplete: Story = {
  parameters: { layout: "padded" },
  args: { action: <TopicActionBar state="incomplete" /> },
};
/** A partner lab that has not been opened yet: the launch button is the primary action. */
export const WithMarkAsCompleteSecondary: Story = {
  parameters: { layout: "padded" },
  args: { action: <TopicActionBar state="incomplete" secondary /> },
};
/** Under the transcript of a video the licence follows the feedback items. */
export const WithMarkAsCompleteAndLicence: Story = {
  parameters: { layout: "padded" },
  args: { license: "CC BY-SA 4.0", action: <TopicActionBar state="incomplete" /> },
};
