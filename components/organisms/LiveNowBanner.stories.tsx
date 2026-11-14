import type { Meta, StoryObj } from "@storybook/react-vite";
import { LiveNowBanner } from "./LiveNowBanner";
import styles from "./LiveNowBanner.stories.module.css";

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
      <div className={styles.frame}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof LiveNowBanner>;

export const Live: Story = { args: { state: "Live" } };
export const Upcoming: Story = { args: { state: "Upcoming" } };
