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
    size: { control: "select", options: ["auto", "lg", "md", "sm"] },
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
 * width): Play, Skip back, Skip forward, the volume slider, the progress, Speed, CC and
 * Maximize on one row, padding 24/16/16/16, gap 4.
 */
export const SizeLarge: Story = { args: { state: "ready", size: "lg", onSeek: fn() } };
/**
 * Size=md (`auto` picks it from 480 to 639px of player width): the same row with padding
 * 24/12/8/12 and gap 2, and the volume is a button without the slider.
 */
export const SizeMedium: Story = {
  args: { state: "ready", size: "md" },
  decorators: [
    (Story) => (
      <div className="max-w-xl">
        <Story />
      </div>
    ),
  ],
};
/**
 * Size=sm (`auto` picks it below 480px of player width): padding 8/4/4/4, gap 2, Play and
 * Volume on the left, Skip back, Skip forward, Speed, CC and Maximize on the right. The
 * progress keeps a row of its own above the buttons (the DS sm variant has none).
 */
export const SizeSmall: Story = {
  args: { state: "ready", size: "sm" },
  decorators: [
    (Story) => (
      <div className="max-w-[343px]">
        <Story />
      </div>
    ),
  ],
};
