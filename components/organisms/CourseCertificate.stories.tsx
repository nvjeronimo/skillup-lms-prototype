import type { Meta, StoryObj } from "@storybook/react";
import { CourseCertificate } from "./CourseCertificate";

const meta: Meta<typeof CourseCertificate> = {
  title: "Organisms/Course Certificate",
  component: CourseCertificate,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    learnerName: "Olivia Rhye",
    courseTitle: "Six Sigma for Process Improvement",
    provider: "SkillUp",
    dateLabel: "June 22, 2026",
    certificateId: "ID-SKL-SIXSIGMA-0622",
    stats: { modules: 3, topics: 15, time: "4h 22m", avgQuiz: "96%" },
  },
  decorators: [
    (Story) => (
      <div className="bg-sk-text-brand-primary p-8">
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof CourseCertificate>;

export const Preview: Story = {};
