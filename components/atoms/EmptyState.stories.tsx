import type { Meta, StoryObj } from "@storybook/react";
import { FileText, StickyNote } from "lucide-react";
import { EmptyState } from "./EmptyState";
import { Button } from "./Button";

const meta: Meta<typeof EmptyState> = {
  title: "Atoms/Empty State",
  component: EmptyState,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};
export default meta;

type Story = StoryObj<typeof EmptyState>;

export const NotesEmpty: Story = {
  args: {
    icon: StickyNote,
    title: "No notes yet",
    description: "Create notes from the Transcript tab: click + Note on any line.",
  },
};

export const DownloadsEmpty: Story = {
  args: {
    icon: FileText,
    title: "No downloads",
    description: "This topic has no attached files.",
  },
};

export const WithAction: Story = {
  args: {
    icon: StickyNote,
    title: "No notes match your filter",
    description: "Try clearing the active tag.",
    action: <Button variant="secondary" size="sm">Clear filter</Button>,
  },
};
