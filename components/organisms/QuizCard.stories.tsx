import type { Meta, StoryObj } from "@storybook/react";
import { QuizCard } from "./QuizCard";

const EXPLANATION =
  "Six Sigma is a data-driven methodology for reducing variation. Fewer defects follow from a more predictable process; speed and headcount are outcomes, never the goal.";

const OPTIONS = [
  {
    id: "a",
    label: "Reduce process variation and defects",
    correct: true,
    feedback: "Correct. Controlling variation is what makes a process predictable and defect-free.",
  },
  {
    id: "b",
    label: "Increase production speed at any cost",
    feedback: "Speed gained by ignoring quality creates rework, which raises variation rather than lowering it.",
  },
  { id: "c", label: "Eliminate all documentation" },
  { id: "d", label: "Replace all staff with automation" },
];

const STATES = [
  "Unanswered","Selected","Saved","Last attempt","Incorrect",
  "Partially correct","Correct","Answer revealed","Results withheld",
] as const;

const meta: Meta<typeof QuizCard> = {
  title: "Organisms/Quiz Card",
  component: QuizCard,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: { state: "Unanswered", selectedIds: ["a"], options: OPTIONS },
  argTypes: { state: { control: "select", options: STATES } },
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

/** Nothing selected — Submit disabled. Hint, Save and Show answer are offered. */
export const Unanswered: Story = {
  args: { selectedIds: [], footer: { submitEnabled: false, showHint: true, showSave: true, showAnswer: true } },
};

/** An option is chosen. Submit becomes enabled; the label never changes. */
export const Selected: Story = {
  args: { state: "Selected", footer: { submitEnabled: true, showHint: true, showSave: true, showAnswer: true } },
};

/** Stored without grading. "Draft saved" is a disabled confirmation, not an action. */
export const Saved: Story = {
  args: {
    state: "Saved",
    footer: { submitEnabled: true, showHint: true, showSave: true, saved: true, showAnswer: true, showReset: true, showReview: true, showAttempts: true, attemptsUsed: 0, maxAttempts: 2 },
  },
};

/** Submitted and correct — Submit disabled, and Reset is never offered here. */
export const Correct: Story = {
  args: { state: "Correct", footer: { showAnswer: true, showReview: true } },
};

/** Submitted and wrong. Reset appears; it publishes a zero and refunds nothing. */
export const Incorrect: Story = {
  args: {
    state: "Incorrect",
    selectedIds: ["b"],
    footer: { showHint: true, showAnswer: true, showReset: true, showReview: true },
  },
};

/** Multi-select only: some right, none wrong. */
export const PartiallyCorrect: Story = {
  args: {
    state: "Partially correct",
    multiSelect: true,
    selectedIds: ["a"],
    options: [
      { id: "a", label: "Reduce process variation", correct: true },
      { id: "b", label: "Increase speed at any cost" },
      { id: "c", label: "Lower the defect rate", correct: true },
    ],
    footer: { showAnswer: true, showReset: true, showReview: true },
  },
};

/** The learner pressed Show answer — nothing else remains but Review. */
export const AnswerRevealed: Story = {
  args: { state: "Answer revealed", footer: { showReview: true } },
};

/** `show_correctness: never` — submitted, and the result is masked. */
export const ResultsWithheld: Story = {
  args: { state: "Results withheld", footer: { showReview: true } },
};

/** Attempts spent: the counter reads N of N, Submit is dead and Reset is gone. */
export const AttemptsSpent: Story = {
  args: {
    state: "Incorrect",
    selectedIds: ["b"],
    footer: { showAnswer: true, showReview: true, showAttempts: true, attemptsUsed: 2, maxAttempts: 2 },
  },
};

/** Mode A chrome: the block display_name above the question. */
export const PlatformPrompt: Story = {
  args: { showPlatformPrompt: true, footer: { submitEnabled: true, showHint: true, showAnswer: true } },
};

/** The bucket (mode A-2): the card carries no action row at all. */
export const BucketQuestion: Story = {
  args: { showFooterQuestions: false, state: "Selected" },
};
