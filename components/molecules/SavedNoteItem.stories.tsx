import type { Meta, StoryObj } from "@storybook/react";
import { SavedNoteItem } from "./SavedNoteItem";

const meta: Meta<typeof SavedNoteItem> = {
  title: "Molecules/Saved Note Item",
  component: SavedNoteItem,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    ts: "0:38",
    topicTitle: "Introduction to the DMAIC methodology",
    anchorQuote: "The lifecycle begins long before any code is written.",
    text: "Lifecycle starts with customer understanding, before any code",
    tags: ["discovery", "lifecycle"],
    savedAt: "3 days ago",
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

type Story = StoryObj<typeof SavedNoteItem>;

export const Default: Story = {};
export const LongAnchorQuote: Story = {
  args: {
    anchorQuote:
      "This is exactly where AI tools can dramatically compress the research phase: turning 50 interviews into structured themes in minutes, freeing the team to focus on judgement.",
  },
};
export const ManyTags: Story = {
  args: { tags: ["ai", "research", "discovery", "lifecycle", "mvp", "synthesis"] },
};
export const NoTags: Story = { args: { tags: [] } };
