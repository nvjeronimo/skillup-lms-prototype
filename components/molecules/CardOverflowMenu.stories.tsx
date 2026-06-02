import type { Meta, StoryObj } from "@storybook/react";
import { CardOverflowMenu } from "./CardOverflowMenu";

const meta: Meta<typeof CardOverflowMenu> = {
  title: "Molecules/Card Overflow Menu",
  component: CardOverflowMenu,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  decorators: [
    (Story) => (
      <div className="flex h-48 w-48 items-start justify-end">
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof CardOverflowMenu>;

export const Closed: Story = {};
export const Open: Story = { args: { defaultOpen: true } };
