import type { Meta, StoryObj } from "@storybook/react";
import { SavedPanel } from "./SavedPanel";
import { savedNotes, savedTopics } from "@/lib/data";

const meta: Meta<typeof SavedPanel> = {
  title: "Organisms/Saved Panel",
  component: SavedPanel,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: {
    open: true,
    savedTopics,
    savedNotes,
    filter: "all",
    onClose: () => {},
  },
  argTypes: { filter: { control: "radio", options: ["all", "topics", "notes"] } },
  decorators: [
    (Story) => (
      <div className="h-[700px]">
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof SavedPanel>;

export const All: Story = { args: { filter: "all" } };
export const TopicsOnly: Story = { args: { filter: "topics" } };
export const NotesOnly: Story = { args: { filter: "notes" } };
