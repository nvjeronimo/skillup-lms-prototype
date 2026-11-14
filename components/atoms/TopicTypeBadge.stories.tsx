import type { Meta, StoryObj } from "@storybook/react-vite";
import { TopicTypeBadge, ALL_TOPIC_TYPES } from "./TopicTypeBadge";
import styles from "./TopicTypeBadge.stories.module.css";

const meta: Meta<typeof TopicTypeBadge> = {
  title: "Atoms/Badge (Topic Types)",
  component: TopicTypeBadge,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: { type: "Video", showIcon: true },
  argTypes: {
    type: { control: "select", options: ALL_TOPIC_TYPES },
  },
};
export default meta;

type Story = StoryObj<typeof TopicTypeBadge>;

export const Default: Story = {};

export const AllTypes: Story = {
  render: () => (
    <div className={styles.wrapRow}>
      {ALL_TOPIC_TYPES.map((t) => (
        <TopicTypeBadge key={t} type={t} />
      ))}
    </div>
  ),
};
