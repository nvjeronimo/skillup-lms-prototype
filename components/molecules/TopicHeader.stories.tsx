import type { Meta, StoryObj } from "@storybook/react";
import { TopicHeader } from "./TopicHeader";

const meta: Meta<typeof TopicHeader> = {
  title: "Molecules/Topic Header",
  component: TopicHeader,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    type: "Video",
    title: "Introduction to the DMAIC methodology",
    duration: "3m 20s",
    description: "Walk through the DMAIC methodology end-to-end and how each phase builds on the last.",
    showDescription: true,
    showDuration: true,
  },
};
export default meta;

type Story = StoryObj<typeof TopicHeader>;

export const Video: Story = {};
export const ReadingApproxDuration: Story = {
  args: { type: "Reading", title: "The measure phase", duration: "8 min read" },
};
export const NoDescription: Story = { args: { showDescription: false } };
export const NoDuration: Story = { args: { showDuration: false } };
