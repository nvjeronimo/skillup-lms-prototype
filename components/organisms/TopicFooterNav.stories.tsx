import type { Meta, StoryObj } from "@storybook/react";
import { TopicFooterNav } from "./TopicFooterNav";

const meta: Meta<typeof TopicFooterNav> = {
  title: "Organisms/Topic Footer Nav",
  component: TopicFooterNav,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: {
    position: 7,
    total: 15,
    title: "Introduction to the DMAIC methodology",
    milestone: "Topic",
    previousDisabled: false,
    nextDisabled: false,
  },
  argTypes: {
    milestone: { control: "select", options: ["Topic", "Module", "Course"] },
  },
};
export default meta;

type Story = StoryObj<typeof TopicFooterNav>;

export const Default: Story = {};
export const NextDisabled: Story = { args: { nextDisabled: true } };
export const PreviousDisabled: Story = { args: { previousDisabled: true, position: 1 } };
export const LastOfModule: Story = { args: { milestone: "Module", position: 9, total: 9 } };
export const LastOfCourse: Story = { args: { milestone: "Course", position: 9, total: 9 } };
export const Compact: Story = { args: { compact: true } };
