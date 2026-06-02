import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { PanelTabs } from "./PanelTabs";

const meta: Meta<typeof PanelTabs> = {
  title: "Molecules/Panel Tabs",
  component: PanelTabs,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div className="w-[440px]">
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof PanelTabs>;

function Demo({ tabs }: { tabs: { value: string; label: string; count?: number }[] }) {
  const [active, setActive] = React.useState(tabs[0].value);
  return <PanelTabs tabs={tabs} active={active} onChange={setActive} ariaLabel="Demo tabs" />;
}

export const Notifications: Story = {
  render: () => (
    <Demo
      tabs={[
        { value: "all", label: "All", count: 5 },
        { value: "discussions", label: "Discussions", count: 1 },
        { value: "grading", label: "Grading", count: 3 },
        { value: "updates", label: "Updates", count: 2 },
      ]}
    />
  ),
};

export const Saved: Story = {
  render: () => (
    <Demo
      tabs={[
        { value: "all", label: "All", count: 5 },
        { value: "topics", label: "Topics", count: 3 },
        { value: "notes", label: "Notes", count: 2 },
      ]}
    />
  ),
};
