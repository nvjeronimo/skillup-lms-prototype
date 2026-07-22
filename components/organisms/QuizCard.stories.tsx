import type { Meta, StoryObj } from "@storybook/react";
import { QuizCard } from "./QuizCard";

const EXPLANATION =
  "Six Sigma is a data-driven methodology for reducing variation. Fewer defects follow from a more predictable process — speed and headcount are outcomes, never the goal.";

const OPTIONS = [
  {
    id: "a",
    label: "Reduce process variation and defects",
    correct: true,
    feedback: "Correct — controlling variation is what makes a process predictable and defect-free.",
  },
  {
    id: "b",
    label: "Increase production speed at any cost",
    feedback: "Speed gained by ignoring quality creates rework, which raises variation rather than lowering it.",
  },
  { id: "c", label: "Eliminate all documentation" },
  { id: "d", label: "Replace all staff with automation" },
];

const meta: Meta<typeof QuizCard> = {
  title: "Organisms/Quiz Card",
  component: QuizCard,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: { state: "Question", selectedId: "a", options: OPTIONS, explanation: EXPLANATION },
  argTypes: {
    state: { control: "inline-radio", options: ["Question", "Revealed"] },
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

/** Nothing selected yet — Submit is disabled. */
export const Unanswered: Story = { args: { selectedId: undefined } };

/** An option is chosen but not yet submitted. */
export const Selected: Story = { args: { selectedId: "a" } };

/** Submitted and correct — answer-specific feedback, correct option marked. */
export const Correct: Story = { args: { state: "Revealed", selectedId: "a" } };

/**
 * Submitted and wrong. The correct answer stays hidden until "Show answer" is
 * pressed, and a review-lesson link is offered.
 */
export const Incorrect: Story = {
  args: {
    state: "Revealed",
    selectedId: "b",
    reviewTopicTitle: "Introduction to the DMAIC methodology",
  },
};

/** Graded variant — Save draft plus the attempts counter. */
export const GradedWithAttempts: Story = {
  args: { selectedId: "a", showSaveDraft: true, attemptsUsed: 0, maxAttempts: 2 },
};

/** Draft stored but not submitted — the distinction has to be loud. */
export const DraftSaved: Story = {
  args: { selectedId: "a", showSaveDraft: true, draftSaved: true, attemptsUsed: 0, maxAttempts: 2 },
};

/** Last graded attempt — Submit routes through a confirmation gate first. */
export const LastAttempt: Story = {
  args: {
    selectedId: "a",
    showSaveDraft: true,
    attemptsUsed: 1,
    maxAttempts: 2,
    isLastAttempt: true,
  },
};
