import type { Meta, StoryObj } from "@storybook/react";
import { QuizCard } from "./QuizCard";

const meta: Meta<typeof QuizCard> = {
  title: "Organisms/Quiz Card",
  component: QuizCard,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: { state: "Question", selectedId: "a" },
  argTypes: {
    state: { control: "select", options: ["Question", "Revealed", "Results", "Not Passed"] },
  },
  decorators: [
    (Story) => (
      <div className="max-w-xl">
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof QuizCard>;

export const Question: Story = { args: { state: "Question" } };
export const Revealed: Story = { args: { state: "Revealed" } };
export const Results: Story = { args: { state: "Results" } };
export const NotPassed: Story = { args: { state: "Not Passed", selectedId: "b" } };
