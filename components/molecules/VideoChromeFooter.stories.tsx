import type { Meta, StoryObj } from "@storybook/react-vite";
import { VideoChromeFooter } from "./VideoChromeFooter";
import styles from "./VideoChromeFooter.stories.module.css";

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
      <div className={styles.column}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof VideoChromeFooter>;

export const Default: Story = {};
export const SpanishSelected: Story = { args: { currentLanguage: "ES" } };
