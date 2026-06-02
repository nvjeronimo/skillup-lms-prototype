import type { Meta, StoryObj } from "@storybook/react";
import { NotificationsPanel } from "./NotificationsPanel";
import { notifications } from "@/lib/data";

const meta: Meta<typeof NotificationsPanel> = {
  title: "Organisms/Notifications Panel",
  component: NotificationsPanel,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: {
    open: true,
    notifications,
    onClose: () => {},
    onMarkAllRead: () => {},
  },
  decorators: [
    (Story) => (
      <div className="h-[700px]">
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof NotificationsPanel>;

export const Open: Story = {};
