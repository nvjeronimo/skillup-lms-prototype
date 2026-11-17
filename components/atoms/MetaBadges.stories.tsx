import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  CourseTypeBadge,
  DifficultyBadge,
  DeliveryModeBadge,
  ProviderBadge,
} from "./MetaBadges";
import styles from "./MetaBadges.stories.module.css";

const meta: Meta = {
  title: "Atoms/Badge (Meta)",
  tags: ["autodocs"],
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj;

export const CourseType: Story = {
  render: () => (
    <div className={styles.row}>
      <CourseTypeBadge value="Program" />
      <CourseTypeBadge value="Course" />
    </div>
  ),
};

export const Difficulty: Story = {
  render: () => (
    <div className={styles.row}>
      <DifficultyBadge value="Beginner" />
      <DifficultyBadge value="Intermediate" />
      <DifficultyBadge value="Advanced" />
    </div>
  ),
};

export const DeliveryMode: Story = {
  render: () => (
    <div className={styles.row}>
      <DeliveryModeBadge value="Live Sessions" />
      <DeliveryModeBadge value="Flexible + Live" />
      <DeliveryModeBadge value="Flexible Learning" />
    </div>
  ),
};

export const ProviderList: Story = {
  render: () => (
    <div className={styles.wrapRow}>
      <ProviderBadge value="SkillUp" />
      <ProviderBadge value="Microsoft" />
      <ProviderBadge value="IBM" />
      <ProviderBadge value="Google Cloud" />
      <ProviderBadge value="FutureSkills" />
      <ProviderBadge value="Pacific Lutheran University" />
    </div>
  ),
};
