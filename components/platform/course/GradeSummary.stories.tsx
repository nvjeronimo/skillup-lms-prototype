import type { Meta, StoryObj } from "@storybook/react";
import { SIX_SIGMA } from "@/lib/courses/sample-page";
import { CompletionCard, GradeSummary } from "./ProgressTab";

/**
 * The edge cases of the Progress tab (Nelson, 27 Oct 2026): the five Results of DS
 * Grade-Summary 1.2 and the states of Completion-Card 1.3. Hover the bar for the
 * current-grade tooltip.
 */
const grade = SIX_SIGMA.progressTab.grade;
const completion = SIX_SIGMA.progressTab.completion;
type Grade = typeof grade;

/** Final Quiz 30% at 50% (15) + Final project 70% at `project`%. */
const withProject = (project: number, percent: number, extra: Partial<Grade> = {}): Grade => ({
  ...grade,
  percent,
  rows: [grade.rows[0], { type: "Final project", weight: "70%", grade: `${project}%`, weighted: `${percent - 15}%` }],
  sections: [
    {
      title: grade.sections[0].title,
      items: [
        { title: "Final project · Digital marketing strategy", score: `${project}/100 · ${project}%` },
        grade.sections[0].items[1],
      ],
    },
  ],
  ...extra,
});

const meta: Meta<typeof GradeSummary> = {
  title: "Platform/Course Detail/Grade Summary",
  component: GradeSummary,
  parameters: { layout: "padded" },
  decorators: [(Story) => <div className="max-w-[816px]">{Story()}</div>],
};
export default meta;

type Story = StoryObj<typeof GradeSummary>;

export const NotStarted: Story = {
  args: {
    grade: {
      ...grade,
      percent: 0,
      rows: grade.rows.map((row) => ({ ...row, grade: "0%", weighted: "0%" })),
      sections: grade.sections.map((s) => ({ ...s, items: s.items.map((i) => ({ ...i, score: null })) })),
    },
  },
};
export const BelowPass: Story = { args: { grade } };
export const Passing: Story = { args: { grade: withProject(93, 80) } };
export const SubmittedBelowPass: Story = { args: { grade: withProject(64, 60, { allSubmitted: true }) } };
export const CourseEnded: Story = { args: { grade: withProject(64, 60, { courseEnded: true }) } };

export const CompletionStates: StoryObj<typeof CompletionCard> = {
  render: () => (
    <div className="flex flex-col gap-6">
      <CompletionCard completion={{ ...completion, complete: 0, incomplete: 42, locked: 0 }} />
      <CompletionCard completion={completion} />
      <CompletionCard completion={{ ...completion, complete: 16, incomplete: 23, locked: 3 }} />
      <CompletionCard completion={{ ...completion, complete: 42, incomplete: 0, locked: 0 }} />
    </div>
  ),
};
