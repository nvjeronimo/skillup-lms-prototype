import type { Meta, StoryObj } from "@storybook/react";
import { TopicRow } from "./TopicRow";

const meta: Meta<typeof TopicRow> = {
  title: "Molecules/Topic Row",
  component: TopicRow,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    type: "Video",
    title: "Introduction to the DMAIC methodology",
    duration: "3m 20s",
    status: "In Progress",
    active: false,
  },
  argTypes: {
    status: { control: "select", options: ["Pending", "In Progress", "Done", "Locked"] },
  },
  decorators: [
    (Story) => (
      <div className="w-[280px] border border-sk-border-secondary bg-sk-bg-primary">
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof TopicRow>;

export const Pending: Story = { args: { status: "Pending" } };
export const Active: Story = { args: { status: "In Progress", active: true } };
export const Completed: Story = { args: { status: "Done", title: "History and origins" } };
export const Locked: Story = { args: { status: "Locked", title: "The analyze phase" } };
export const WithBookmark: Story = { args: { showBookmark: true, bookmarked: true } };

export const InSidebarContext: Story = {
  render: () => (
    <div>
      <TopicRow type="Reading" title="What is Six Sigma?" duration="approx. 8 min read" status="Done" />
      <TopicRow type="Video" title="History and origins" duration="5 min" status="Done" />
      <TopicRow
        type="Video"
        title="Introduction to the DMAIC methodology"
        duration="3m 20s"
        status="In Progress"
        active
      />
      <TopicRow type="Reading" title="The measure phase" duration="approx. 8 min read" status="Pending" showBookmark bookmarked />
      <TopicRow type="Graded Assignment" title="The control phase" duration="approx. 20 min" status="Locked" />
    </div>
  ),
};
