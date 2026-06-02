import type { Meta, StoryObj } from "@storybook/react";
import { FilterChip } from "./FilterChip";

const meta: Meta<typeof FilterChip> = {
  title: "Atoms/Filter Chip",
  component: FilterChip,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: { label: "All", count: 5, active: true },
};
export default meta;

type Story = StoryObj<typeof FilterChip>;

export const Active: Story = { args: { active: true } };
export const Inactive: Story = { args: { active: false, label: "Topics", count: 3 } };

export const Group: Story = {
  render: () => (
    <div className="flex gap-2">
      <FilterChip label="All" count={5} active />
      <FilterChip label="Topics" count={3} />
      <FilterChip label="Notes" count={2} />
    </div>
  ),
};
