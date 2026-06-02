import type { Meta, StoryObj } from "@storybook/react";
import { SavedTopicItem } from "./SavedTopicItem";

const meta: Meta<typeof SavedTopicItem> = {
  title: "Molecules/Saved Topic Item",
  component: SavedTopicItem,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    topicType: "Reading",
    duration: "approx. 8 min read",
    title: "The measure phase",
    path: "Six Sigma · DMAIC · Define and measure",
    savedAt: "2 days ago",
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
export const Project: Story = { args: { topicType: "Project", duration: "approx. 2 h", title: "Capstone project" } };
export const PeerReview: Story = { args: { topicType: "Peer Review", duration: "approx. 30 min", title: "Review a peer submission" } };
