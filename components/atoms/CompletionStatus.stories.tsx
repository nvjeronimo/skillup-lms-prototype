import type { Meta, StoryObj } from "@storybook/react-vite";
import { CompletionStatus } from "./CompletionStatus";
import styles from "./CompletionStatus.stories.module.css";

const meta: Meta<typeof CompletionStatus> = {
  title: "Atoms/Completion Status",
  component: CompletionStatus,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: { state: "Done" },
  argTypes: {
    state: { control: "select", options: ["Pending", "In Progress", "Done", "Locked"] },
  },
};
export default meta;

type Story = StoryObj<typeof CompletionStatus>;

export const Pending: Story = { args: { state: "Pending" } };
export const InProgress: Story = { args: { state: "In Progress" } };
export const Done: Story = { args: { state: "Done" } };
export const Locked: Story = { args: { state: "Locked" } };

export const AllStates: Story = {
  render: () => (
    <div className={styles.row}>
      <CompletionStatus state="Pending" />
      <CompletionStatus state="In Progress" />
      <CompletionStatus state="Done" />
      <CompletionStatus state="Locked" />
    </div>
  ),
};
