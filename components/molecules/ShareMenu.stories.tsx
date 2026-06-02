import type { Meta, StoryObj } from "@storybook/react";
import { ShareMenu } from "./ShareMenu";

const meta: Meta<typeof ShareMenu> = {
  title: "Molecules/Share Menu",
  component: ShareMenu,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof ShareMenu>;

export const Default: Story = {};
