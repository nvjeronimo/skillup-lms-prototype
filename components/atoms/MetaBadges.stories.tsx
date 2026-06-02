import type { Meta, StoryObj } from "@storybook/react";
import {
  CourseTypeBadge,
  DifficultyBadge,
  DeliveryModeBadge,
  ProviderBadge,
} from "./MetaBadges";

const meta: Meta = {
  title: "Atoms/Badge (Meta)",
  tags: ["autodocs"],
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj;

export const CourseType: Story = {
  render: () => (
    <div className="flex gap-2">
      <CourseTypeBadge value="Program" />
      <CourseTypeBadge value="Course" />
    </div>
  ),
};

export const Difficulty: Story = {
  render: () => (
    <div className="flex gap-2">
      <DifficultyBadge value="Beginner" />
      <DifficultyBadge value="Intermediate" />
      <DifficultyBadge value="Advanced" />
    </div>
  ),
};

export const DeliveryMode: Story = {
  render: () => (
    <div className="flex gap-2">
      <DeliveryModeBadge value="Flexible Learning" />
      <DeliveryModeBadge value="Flexible + Live" />
      <DeliveryModeBadge value="Cohort" />
    </div>
  ),
};

export const ProviderList: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <ProviderBadge value="SkillUp" />
      <ProviderBadge value="Microsoft" />
      <ProviderBadge value="IBM" />
      <ProviderBadge value="Google Cloud" />
      <ProviderBadge value="Stanford" />
    </div>
  ),
};
