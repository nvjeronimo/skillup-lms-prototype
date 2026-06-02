import type { Meta, StoryObj } from "@storybook/react";
import { CoursePlayerTopbar } from "./CoursePlayerTopbar";

const meta: Meta<typeof CoursePlayerTopbar> = {
  title: "Organisms/Course Player Topbar",
  component: CoursePlayerTopbar,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: {
    size: "Desktop",
    breadcrumb: ["Six Sigma", "DMAIC for process improvement", "Introduction to the DMAIC methodology"],
    showAi: true,
    showBookmark: true,
    showNotifications: true,
    showTheme: true,
  },
  argTypes: { size: { control: "radio", options: ["Desktop", "Tablet", "Mobile"] } },
};
export default meta;

type Story = StoryObj<typeof CoursePlayerTopbar>;

export const Desktop: Story = { args: { size: "Desktop" } };
export const Tablet: Story = { args: { size: "Tablet" } };
export const Mobile: Story = { args: { size: "Mobile" } };
export const MinimalUtilities: Story = {
  args: { showAi: false, showNotifications: false, showTheme: false },
};
