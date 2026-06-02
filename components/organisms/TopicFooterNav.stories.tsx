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
    milestone: { control: "select", options: ["Topic", "Reading Complete", "Module", "Course"] },
  },
};
export default meta;

type Story = StoryObj<typeof TopicFooterNav>;

export const Default: Story = {};
export const NextDisabled: Story = { args: { nextDisabled: true } };
export const PreviousDisabled: Story = { args: { previousDisabled: true, position: 1 } };
export const ModuleMilestone: Story = { args: { milestone: "Module" } };
export const Compact: Story = { args: { compact: true } };
