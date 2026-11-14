import type { Meta, StoryObj } from "@storybook/react-vite";
import { OverlayPanel, PanelSectionLabel } from "./OverlayPanel";
import styles from "./OverlayPanel.stories.module.css";

const meta: Meta<typeof OverlayPanel> = {
  title: "Organisms/Overlay Panel",
  component: OverlayPanel,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: { open: true, title: "Panel title", onClose: () => {} },
  decorators: [
    (Story) => (
      <div className={styles.frame}>
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
      <div className={styles.empty}>
        <p className={`sk-text-body-medium-regular ${styles.subtle}`}>Body content goes here.</p>
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
        <div className={styles.item}>
          <p className={`sk-text-body-medium-regular ${styles.muted}`}>An item in section A.</p>
        </div>
      </>
    ),
  },
};

export const WithFooter: Story = {
  args: {
    footer: { label: "View all items", href: "#" },
    children: (
      <div className={styles.item}>
        <p className={`sk-text-body-medium-regular ${styles.muted}`}>Scrollable body with a footer link below.</p>
      </div>
    ),
  },
};
