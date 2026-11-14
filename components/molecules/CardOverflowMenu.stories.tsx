import type { Meta, StoryObj } from "@storybook/react-vite";
import { CardOverflowMenu } from "./CardOverflowMenu";
import styles from "./CardOverflowMenu.stories.module.css";

const meta: Meta<typeof CardOverflowMenu> = {
  title: "Molecules/Card Overflow Menu",
  component: CardOverflowMenu,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  decorators: [
    (Story) => (
      <div className={styles.stage}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof CardOverflowMenu>;

export const Closed: Story = {};
export const Open: Story = { args: { defaultOpen: true } };
