import type { Meta, StoryObj } from "@storybook/react-vite";
import { OverallProgress } from "./OverallProgress";
import styles from "./OverallProgress.stories.module.css";

const meta: Meta<typeof OverallProgress> = {
  title: "Molecules/Overall Progress",
  component: OverallProgress,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: { pct: 67, moduleCurrent: 3, moduleTotal: 3, device: "Desktop" },
  argTypes: { device: { control: "radio", options: ["Desktop", "Mobile"] } },
};
export default meta;

type Story = StoryObj<typeof OverallProgress>;

export const Desktop: Story = {
  args: { device: "Desktop" },
  decorators: [
    (Story) => (
      <div className={styles.sidebar}>
        <Story />
      </div>
    ),
  ],
};

export const MobileRing: Story = { args: { device: "Mobile" }, parameters: { layout: "centered" } };
