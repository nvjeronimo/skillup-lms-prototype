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
  args: { state: "Question", selectedIds: ["a"], options: OPTIONS, explanation: EXPLANATION },
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

/** Nothing selected yet — Submit is disabled. Single-select shows radios. */
export const Unanswered: Story = { args: { selectedIds: [] } };

/** An option is chosen but not yet submitted. */
export const Selected: Story = { args: { selectedIds: ["a"] } };

/** Submitted and correct — answer-specific feedback, correct option marked. */
export const Correct: Story = { args: { state: "Revealed", selectedIds: ["a"] } };

/**
 * Submitted and wrong. The correct answer stays hidden until "Show answer" is
 * pressed, and a review-lesson link is offered.
 */
export const Incorrect: Story = {
  args: {
    state: "Revealed",
    selectedIds: ["b"],
    reviewTopicTitle: "Introduction to the DMAIC methodology",
  },
};

/** Multi-select (CAPA `choiceresponse`) — the marker becomes a checkbox. */
export const MultiSelect: Story = {
  args: {
    multiSelect: true,
    question: "Which of these are Six Sigma goals? (select all that apply)",
    selectedIds: ["a", "c"],
    options: [
      { id: "a", label: "Reduce process variation", correct: true },
      { id: "b", label: "Increase speed at any cost" },
      { id: "c", label: "Lower the defect rate", correct: true },
      { id: "d", label: "Remove all documentation" },
    ],
  },
};

/** Graded variant — Save draft plus the attempts counter. */
export const GradedWithAttempts: Story = {
  args: { selectedIds: ["a"], showSaveDraft: true, attemptsUsed: 0, maxAttempts: 2 },
};

/** Draft stored but not submitted — the distinction has to be loud. */
export const DraftSaved: Story = {
  args: { selectedIds: ["a"], showSaveDraft: true, draftSaved: true, attemptsUsed: 0, maxAttempts: 2 },
};

/** Last graded attempt — Submit routes through a confirmation gate first. */
export const LastAttempt: Story = {
  args: {
    selectedIds: ["a"],
    showSaveDraft: true,
    attemptsUsed: 1,
    maxAttempts: 2,
    isLastAttempt: true,
  },
};
