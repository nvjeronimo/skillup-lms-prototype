import type { Meta, StoryObj } from "@storybook/react";
import { OverlayPanel, PanelSectionLabel } from "./OverlayPanel";

const meta: Meta<typeof OverlayPanel> = {
  title: "Organisms/Overlay Panel",
  component: OverlayPanel,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: { open: true, title: "Panel title", onClose: () => {} },
  decorators: [
    (Story) => (
      <div className="h-[640px]">
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof OverlayPanel>;

export const Empty: Story = {
  args: {
    children: (
      <div className="px-2 py-6">
        <p className="lms-text-sm-regular text-lms-text-tertiary">Body content goes here.</p>
      </div>
    ),
  },
};

export const WithFilters: Story = {
  args: {
    title: "Saved",
    filters: [
      { label: "All", value: "all", count: 5, active: true },
      { label: "Topics", value: "topics", count: 3 },
      { label: "Notes", value: "notes", count: 2 },
    ],
    children: (
      <>
        <PanelSectionLabel>Section A</PanelSectionLabel>
        <div className="px-2 py-3">
          <p className="lms-text-sm-regular text-lms-text-secondary">An item in section A.</p>
        </div>
      </>
    ),
  },
};

export const WithFooter: Story = {
  args: {
    footer: { label: "View all items", href: "#" },
    children: (
      <div className="px-2 py-3">
        <p className="lms-text-sm-regular text-lms-text-secondary">Scrollable body with a footer link below.</p>
      </div>
    ),
  },
};
