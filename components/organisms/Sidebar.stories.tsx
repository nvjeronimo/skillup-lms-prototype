import type { Meta, StoryObj } from "@storybook/react";
import { Sidebar } from "./Sidebar";
import { course } from "@/lib/data";
import type { Course } from "@/lib/types";

/**
 * 3-level shape (Course → Direct Topic Rows): a single `implicit` module holds
 * topics directly, so the Sidebar renders no Module Header / number. The default
 * `course` already demonstrates 5-level (module 3) + 4-level (modules 1–2).
 */
const threeLevelCourse: Course = {
  id: "qs",
  slug: "quick-start",
  title: "Quick-start onboarding",
  provider: "SkillUp",
  courseType: "Course",
  difficulty: "Beginner",
  deliveryMode: "Flexible Learning",
  overallProgressPct: 25,
  modulesCompleted: 0,
  modulesTotal: 1,
  modules: [
    {
      id: "qs-m",
      label: "",
      title: "",
      topicsCompleted: 1,
      topicsTotal: 4,
      isCompleted: false,
      implicit: true,
      topics: [
        { id: "qs-t1", type: "Video", title: "Introduction to the DMAIC methodology", duration: "3m 20s", completed: true },
        { id: "qs-t2", type: "Quiz", title: "Practice Quiz: Define and Measure", duration: "3m 20s", completed: false },
        { id: "qs-t3", type: "Reading", title: "Reading: Hierarchy in mockups", duration: "3m 20s", completed: false },
        { id: "qs-t4", type: "Video", title: "Capstone reflection", duration: "3m 20s", completed: false, locked: true },
      ],
    },
  ],
};

const meta: Meta<typeof Sidebar> = {
  title: "Organisms/Sidebar v2",
  component: Sidebar,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: {
    course,
    currentTopicId: "m3-t1",
    variant: "Expanded",
    bookmarks: new Set(["m3-t3"]),
  },
  argTypes: { variant: { control: "radio", options: ["Expanded", "Collapsed", "Mobile"] } },
  decorators: [
    (Story) => (
      <div className="h-[700px]">
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof Sidebar>;

export const Expanded: Story = { args: { variant: "Expanded" } };
export const Collapsed: Story = { args: { variant: "Collapsed" } };
export const Mobile: Story = { args: { variant: "Mobile" } };
export const CollapsedNoLesson: Story = {
  name: "Collapsed (noLesson)",
  args: { variant: "Collapsed", currentTopicId: "m1-t2" },
};
export const MobileNoLesson: Story = {
  name: "Mobile (noLesson)",
  args: { variant: "Mobile", currentTopicId: "m1-t2" },
};

// ── 3-level shape (no module) ────────────────────────────────────────────────
export const ThreeLevel: Story = {
  name: "3-level · no Module (Expanded)",
  args: { course: threeLevelCourse, currentTopicId: "qs-t2", variant: "Expanded", bookmarks: new Set() },
};
export const ThreeLevelCollapsed: Story = {
  name: "3-level · no Module (Collapsed)",
  args: { course: threeLevelCourse, currentTopicId: "qs-t2", variant: "Collapsed", bookmarks: new Set() },
};
export const ThreeLevelMobile: Story = {
  name: "3-level · no Module (Mobile)",
  args: { course: threeLevelCourse, currentTopicId: "qs-t2", variant: "Mobile", bookmarks: new Set() },
};
