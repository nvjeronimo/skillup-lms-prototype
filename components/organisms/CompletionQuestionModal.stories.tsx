import type { Meta, StoryObj } from "@storybook/react";
import { CompletionQuestionModal } from "./CompletionQuestionModal";

const meta: Meta<typeof CompletionQuestionModal> = {
  title: "Organisms/Completion Question Modal",
  component: CompletionQuestionModal,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: {
    open: true,
    noun: "lab",
    reason: "Your progress on Google Skills isn't tracked automatically. Please confirm whether you've completed this lab.",
    onYes: () => {},
    onNotYet: () => {},
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

type Story = StoryObj<typeof CompletionQuestionModal>;

export const Lab: Story = {};

export const Reading: Story = {
  args: { noun: "reading", reason: "Your progress on this reading isn't tracked automatically. Please confirm whether you've completed this reading." },
};

export const LastTopic: Story = {
  args: { noun: "reading", reason: "Your progress on this reading isn't tracked automatically. Please confirm whether you've completed this reading.", hasNext: false },
};

export const VideoFallback: Story = {
  args: { noun: "video", reason: "Your progress on this video isn't tracked automatically. Please confirm whether you've completed this video." },
};
