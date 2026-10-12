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
    reason: "SkillUp can't see your progress on Google Skills, so we ask you.",
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
  args: { noun: "reading", reason: "SkillUp can't tell when a reading is done, so we ask you." },
};

export const LastTopic: Story = {
  args: { noun: "reading", reason: "SkillUp can't tell when a reading is done, so we ask you.", hasNext: false },
};

export const VideoFallback: Story = {
  args: { noun: "video", reason: "SkillUp can't measure playback here, so we ask you." },
};
