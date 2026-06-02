import type { Meta, StoryObj } from "@storybook/react";
import { DiscussionPrompt } from "./DiscussionPrompt";

const meta: Meta<typeof DiscussionPrompt> = {
  title: "Molecules/Discussion Prompt",
  component: DiscussionPrompt,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    prompt: "Explain the logic behind how you applied the principles of visual design.",
    duration: "10 min",
    maxChars: 500,
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

type Story = StoryObj<typeof DiscussionPrompt>;

export const Default: Story = {};
