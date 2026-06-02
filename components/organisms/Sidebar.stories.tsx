import type { Meta, StoryObj } from "@storybook/react";
import { Sidebar } from "./Sidebar";
import { course } from "@/lib/data";

const meta: Meta<typeof Sidebar> = {
  title: "Organisms/Sidebar v2",
  component: Sidebar,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: {
    course,
    currentTopicId: "m3-t1",
    variant: "Expanded",
    bookmarks: new Set(["m3-t3"]),
  },
  argTypes: { variant: { control: "radio", options: ["Expanded", "Collapsed", "Mobile"] } },
  decorators: [
    (Story) => (
      <div className="h-[700px]">
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof Sidebar>;

export const Expanded: Story = { args: { variant: "Expanded" } };
export const Collapsed: Story = { args: { variant: "Collapsed" } };
export const Mobile: Story = { args: { variant: "Mobile" } };
export const CollapsedNoLesson: Story = {
  name: "Collapsed (noLesson)",
  args: { variant: "Collapsed", currentTopicId: "m1-t2" },
};
export const MobileNoLesson: Story = {
  name: "Mobile (noLesson)",
  args: { variant: "Mobile", currentTopicId: "m1-t2" },
};
