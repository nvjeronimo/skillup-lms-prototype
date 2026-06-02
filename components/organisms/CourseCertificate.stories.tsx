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
    dateLabel: "June 2, 2026",
  },
};
export default meta;

type Story = StoryObj<typeof CourseCertificate>;

export const Preview: Story = {};
