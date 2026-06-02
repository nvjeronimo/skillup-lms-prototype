import type { Meta, StoryObj } from "@storybook/react";
import { VerticalScroll } from "./VerticalScroll";

const meta: Meta<typeof VerticalScroll> = {
  title: "Atoms/Vertical Scroll",
  component: VerticalScroll,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: { position: 30, thumbFraction: 0.4, dragging: false, height: 160 },
};
export default meta;

type Story = StoryObj<typeof VerticalScroll>;

export const Idle: Story = { args: { dragging: false } };
export const Dragging: Story = { args: { dragging: true, position: 60 } };
