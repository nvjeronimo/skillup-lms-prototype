import type { Meta, StoryObj } from "@storybook/react";
import { LiveControlBar } from "./LiveControlBar";

const meta: Meta<typeof LiveControlBar> = {
  title: "Organisms/Live Control Bar",
  component: LiveControlBar,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: { state: "Live On Control Bar" },
  argTypes: {
    state: { control: "radio", options: ["Live On Control Bar", "Join Live Control Bar"] },
  },
};
export default meta;

type Story = StoryObj<typeof LiveControlBar>;

export const LiveOn: Story = { args: { state: "Live On Control Bar" } };
export const JoinLive: Story = { args: { state: "Join Live Control Bar" } };
