import type { Meta, StoryObj } from "@storybook/react";
import { AIPanel } from "./AIPanel";

const meta: Meta<typeof AIPanel> = {
  title: "Organisms/AI Panel",
  component: AIPanel,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: { mode: "Key Takeaways" },
  argTypes: { mode: { control: "radio", options: ["Key Takeaways", "Ask", "Chat", "Related"] } },
  decorators: [
    (Story) => (
      <div className="flex h-[600px] justify-end">
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof AIPanel>;

export const KeyTakeaways: Story = { args: { mode: "Key Takeaways" } };
export const Ask: Story = { args: { mode: "Ask" } };
export const Chat: Story = { args: { mode: "Chat" } };
export const Related: Story = { args: { mode: "Related" } };
