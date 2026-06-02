import type { Meta, StoryObj } from "@storybook/react";
import { VideoPlayer } from "./VideoPlayer";

const meta: Meta<typeof VideoPlayer> = {
  title: "Organisms/Video Player",
  component: VideoPlayer,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: { durationSeconds: 200, currentTime: 48, state: "ready" },
  argTypes: { state: { control: "select", options: ["ready", "loading", "error", "ended"] } },
  decorators: [
    (Story) => (
      <div className="max-w-3xl">
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof VideoPlayer>;

export const Ready: Story = { args: { state: "ready" } };
export const Loading: Story = { args: { state: "loading" } };
export const Error: Story = { args: { state: "error" } };
export const Ended: Story = { args: { state: "ended" } };
