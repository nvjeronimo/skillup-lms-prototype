import type { Meta, StoryObj } from "@storybook/react";
import { SidebarToggle } from "./SidebarToggle";

const meta: Meta<typeof SidebarToggle> = {
  title: "Atoms/Sidebar Toggle",
  component: SidebarToggle,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: { expanded: true },
};
export default meta;

type Story = StoryObj<typeof SidebarToggle>;

export const Expanded: Story = { args: { expanded: true } };
export const Collapsed: Story = { args: { expanded: false } };
