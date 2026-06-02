import type { Meta, StoryObj } from "@storybook/react";
import { SectionHeader } from "./SectionHeader";

const meta: Meta<typeof SectionHeader> = {
  title: "Atoms/Section Header",
  component: SectionHeader,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: { label: "Section 1 · Define and measure" },
};
export default meta;

type Story = StoryObj<typeof SectionHeader>;

export const Default: Story = {};
export const Collapsible: Story = { args: { collapsible: true, collapsed: false } };
export const Collapsed: Story = { args: { collapsible: true, collapsed: true } };
