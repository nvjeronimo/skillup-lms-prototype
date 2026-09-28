import type { Meta, StoryObj } from "@storybook/react";
import { Download, Edit2 } from "lucide-react";
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

/** DS Kind=Notes: edit-02 glyph, no CTA (notes are created from a transcript line). */
export const NotesEmpty: Story = {
  args: {
    icon: Edit2,
    title: "No notes yet",
    description: "Create notes from the Transcript tab: click + Note on any line.",
  },
};

/** DS Kind=Downloads: download-01 glyph, no CTA. */
export const DownloadsEmpty: Story = {
  args: {
    icon: Download,
    title: "No downloads",
    description: "This topic has no attached files.",
  },
};

export const WithAction: Story = {
  args: {
    icon: Edit2,
    title: "No notes match your filter",
    description: "Try clearing the active tag.",
    action: <Button variant="primary" size="sm">Clear filter</Button>,
  },
};
