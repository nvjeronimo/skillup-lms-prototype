import type { Meta, StoryObj } from "@storybook/react";
import { TranscriptLine } from "./TranscriptLine";

const meta: Meta<typeof TranscriptLine> = {
  title: "Molecules/Transcript Line",
  component: TranscriptLine,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    ts: "0:38",
    text: "The lifecycle begins long before any code is written, with deep understanding of customer needs.",
    active: false,
    hasNote: false,
  },
  decorators: [
    (Story) => (
      <div className="max-w-2xl">
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof TranscriptLine>;

export const Default: Story = {};
export const ActiveAddNote: Story = { args: { active: true, hasNote: false } };
export const ActiveEditNote: Story = { args: { active: true, hasNote: true } };
export const HasNoteInactive: Story = { args: { active: false, hasNote: true } };

export const InContext: Story = {
  render: () => (
    <div className="max-w-2xl">
      <TranscriptLine ts="0:00" text="Welcome back. In this unit we look at the lifecycle." />
      <TranscriptLine ts="0:18" text="Understanding this lifecycle is critical." />
      <TranscriptLine
        ts="0:38"
        text="The lifecycle begins long before any code is written."
        active
        hasNote
      />
      <TranscriptLine ts="0:58" text="Traditionally, this research phase was time-consuming." />
    </div>
  ),
};
