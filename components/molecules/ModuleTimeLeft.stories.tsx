import type { Meta, StoryObj } from "@storybook/react";
import { ModuleTimeLeft } from "./ModuleTimeLeft";

const meta: Meta<typeof ModuleTimeLeft> = {
  title: "Molecules/Module Time-Left",
  component: ModuleTimeLeft,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    segments: ["20 min of videos left", "1h 47m of readings left", "1 graded assignment left"],
  },
};
export default meta;

type Story = StoryObj<typeof ModuleTimeLeft>;

export const Default: Story = {};
export const SingleSegment: Story = { args: { segments: ["20 min of videos left"] } };
/** At the 280px sidebar width the DS sample segments wrap instead of overflowing. */
export const SidebarWidth: Story = {
  decorators: [
    (Story) => (
      <div style={{ width: 280 }}>
        <Story />
      </div>
    ),
  ],
};
