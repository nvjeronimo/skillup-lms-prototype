import type { Meta, StoryObj } from "@storybook/react-vite";
import { FileUploadZone } from "./FileUploadZone";
import styles from "./FileUploadZone.stories.module.css";

const meta: Meta<typeof FileUploadZone> = {
  title: "Molecules/File Upload Zone",
  component: FileUploadZone,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div className={styles.column}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof FileUploadZone>;

export const Default: Story = {};

export const Empty: Story = { args: { uploadedFiles: [] } };

export const WithError: Story = {
  args: {
    uploadedFiles: [
      { id: "u1", name: "process-map.pdf", size: "320 KB", type: "PDF", status: "done" },
      { id: "u2", name: "huge-video.mov", size: "40 MB", type: "MOV", status: "error" },
    ],
  },
};
