import type { Meta, StoryObj } from "@storybook/react";
import { SavedTopicItem } from "./SavedTopicItem";

const meta: Meta<typeof SavedTopicItem> = {
  title: "Molecules/Saved Topic Item",
  component: SavedTopicItem,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    topicType: "Reading",
    duration: "8 min read approx.",
    title: "The measure phase",
    path: "Six Sigma · DMAIC · Define and measure",
    savedAt: "Oct 22",
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

type Story = StoryObj<typeof SavedTopicItem>;

export const Reading: Story = {};
export const Video: Story = { args: { topicType: "Video", duration: "5 min", title: "History and origins" } };
export const LiveSession: Story = { args: { topicType: "VILT-Live Session", duration: "60 min", title: "Office hours" } };
export const Project: Story = { args: { topicType: "Project", duration: "2 h approx.", title: "Capstone project" } };
export const PeerReview: Story = { args: { topicType: "Peer Review", duration: "30 min approx.", title: "Review the grading rubric" } };
