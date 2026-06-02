import type { Meta, StoryObj } from "@storybook/react";
import { LiveNowBanner } from "./LiveNowBanner";

const meta: Meta<typeof LiveNowBanner> = {
  title: "Organisms/Live Now Banner",
  component: LiveNowBanner,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    state: "Live",
    title: "Agile Coach Q&A with David Chen",
    subtitle: "AI-Driven Digital Marketing Certificate",
  },
  argTypes: { state: { control: "radio", options: ["Live", "Upcoming"] } },
  decorators: [
    (Story) => (
      <div className="max-w-3xl">
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof LiveNowBanner>;

export const Live: Story = { args: { state: "Live" } };
export const Upcoming: Story = { args: { state: "Upcoming" } };
