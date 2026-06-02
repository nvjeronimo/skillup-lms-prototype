import type { Meta, StoryObj } from "@storybook/react";
import { VideoChromeFooter } from "./VideoChromeFooter";

const meta: Meta<typeof VideoChromeFooter> = {
  title: "Molecules/Video Chrome Footer",
  component: VideoChromeFooter,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    license: { holder: "SkillUp 2026", type: "CC BY-SA 4.0", url: "#" },
    currentLanguage: "EN",
  },
  decorators: [
    (Story) => (
      <div className="max-w-3xl">
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof VideoChromeFooter>;

export const Default: Story = {};
export const SpanishSelected: Story = { args: { currentLanguage: "ES" } };
