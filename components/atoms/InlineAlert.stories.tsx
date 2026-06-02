import type { Meta, StoryObj } from "@storybook/react";
import { InlineAlert } from "./InlineAlert";

const meta: Meta<typeof InlineAlert> = {
  title: "Atoms/Inline Alert",
  component: InlineAlert,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    tone: "info",
    title: "Heads up",
    description: "Create notes from the Transcript tab.",
  },
  argTypes: { tone: { control: "select", options: ["info", "success", "warning", "error"] } },
};
export default meta;

type Story = StoryObj<typeof InlineAlert>;

export const Saving: Story = { args: { tone: "info", title: "Saving note…", description: undefined } };
export const Saved: Story = { args: { tone: "success", title: "Note saved", description: undefined } };
export const Error: Story = {
  args: {
    tone: "error",
    title: "Couldn’t save your note",
    description: "We’ll keep retrying. Don’t lose what you typed.",
  },
};
export const AIOffline: Story = {
  args: {
    tone: "warning",
    title: "AI Assistant is offline",
    description: "The rest of the lesson still works. We’ll bring it back as soon as we can.",
  },
};
