import type { Meta, StoryObj } from "@storybook/react";
import { Avatar } from "./Avatar";

const meta: Meta<typeof Avatar> = {
  title: "Atoms/Avatar",
  component: Avatar,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: { name: "Olivia Rhye", size: "md", status: "none" },
  argTypes: {
    size: { control: "select", options: ["xs", "sm", "md", "lg"] },
    status: { control: "select", options: ["none", "online", "offline"] },
  },
};
export default meta;

type Story = StoryObj<typeof Avatar>;

export const Default: Story = {};
export const WithStatus: Story = { args: { status: "online" } };

export const Sizes: Story = {
  render: () => (
    <div className="flex items-end gap-3">
      <Avatar name="Olivia Rhye" size="xs" />
      <Avatar name="Olivia Rhye" size="sm" />
      <Avatar name="Olivia Rhye" size="md" />
      <Avatar name="Olivia Rhye" size="lg" status="online" />
    </div>
  ),
};
