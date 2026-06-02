import type { Meta, StoryObj } from "@storybook/react";
import { LiveAttendance } from "./LiveAttendance";

const meta: Meta<typeof LiveAttendance> = {
  title: "Molecules/Live Attendance",
  component: LiveAttendance,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: { live: 24, total: 30, recording: true },
};
export default meta;

type Story = StoryObj<typeof LiveAttendance>;

export const Default: Story = {};
export const Small: Story = { args: { live: 3, total: 8, recording: false } };
export const Full: Story = { args: { live: 30, total: 30, recording: true } };
