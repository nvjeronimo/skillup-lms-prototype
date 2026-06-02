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

export const Info: Story = { args: { tone: "info" } };
export const Success: Story = { args: { tone: "success", title: "Saved", description: "Your note was saved." } };
export const Warning: Story = { args: { tone: "warning", title: "Due soon", description: "Quiz is due in 2 days." } };
export const Error: Story = { args: { tone: "error", title: "Something went wrong", description: "Please try again." } };
