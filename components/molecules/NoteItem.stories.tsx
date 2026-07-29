import type { Meta, StoryObj } from "@storybook/react";
import { NoteItem } from "./NoteItem";

const meta: Meta<typeof NoteItem> = {
  title: "Molecules/Note Item",
  component: NoteItem,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    ts: "0:38",
    anchorQuote:
      "The lifecycle begins long before any code is written, with deep understanding of customer needs.",
    text: "Lifecycle starts with customer understanding, before any code",
    tags: ["discovery", "lifecycle"],
    editedLabel: "Edited 2m ago",
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

type Story = StoryObj<typeof NoteItem>;

export const Default: Story = {};
export const NoTags: Story = { args: { tags: [] } };
export const ManyTags: Story = {
  args: { tags: ["discovery", "lifecycle", "ai", "research", "mvp", "customer"] },
};
