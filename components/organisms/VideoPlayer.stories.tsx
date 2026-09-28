import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { VideoPlayer } from "./VideoPlayer";

const meta: Meta<typeof VideoPlayer> = {
  title: "Organisms/Video Player",
  component: VideoPlayer,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: { durationSeconds: 200, currentTime: 48, state: "ready" },
  argTypes: {
    state: { control: "select", options: ["ready", "loading", "error", "ended"] },
    size: { control: "select", options: ["auto", "lg", "md"] },
  },
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

/**
 * DS `_Video actions bar` Size=lg (what `auto`, the default, picks from 640px of player
 * width): the volume slider joins the row, and
 * skip back/forward (±10s) render because `onSeek` is set (without it they are left out).
 */
export const SizeLarge: Story = { args: { state: "ready", size: "lg", onSeek: fn() } };
/**
 * Size=md padding and gap (24/12/8/12, gap 2), no skip or volume. `auto` picks it below
 * 640px of player width; pass `size="md"` to force it.
 */
export const SizeMedium: Story = {
  args: { state: "ready", size: "md" },
  decorators: [
    (Story) => (
      <div className="max-w-sm">
        <Story />
      </div>
    ),
  ],
};
