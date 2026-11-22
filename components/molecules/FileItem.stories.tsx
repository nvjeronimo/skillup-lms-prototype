import type { Meta, StoryObj } from "@storybook/react-vite";
import { FileItem } from "./FileItem";
import styles from "./FileItem.stories.module.css";

const meta: Meta<typeof FileItem> = {
  title: "Molecules/File Item",
  component: FileItem,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    type: "PDF",
    name: "DMAIC-overview.pdf",
    size: "145 KB",
    addedLabel: "Added 2 weeks ago",
  },
  argTypes: { type: { control: "select", options: ["PDF", "DOCX", "XLSX", "PPTX", "ZIP"] } },
  decorators: [
    (Story) => (
      <div className={styles.column}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof FileItem>;

export const PDF: Story = { args: { type: "PDF" } };
export const DOCX: Story = { args: { type: "DOCX", name: "Discovery-template.docx", size: "62 KB" } };
export const XLSX: Story = { args: { type: "XLSX", name: "Six-Sigma-data-pack.xlsx", size: "210 KB" } };

export const AllTypes: Story = {
  render: () => (
    <div className={styles.list}>
      <FileItem type="PDF" name="DMAIC-overview.pdf" size="145 KB" />
      <FileItem type="DOCX" name="Discovery-template.docx" size="62 KB" />
      <FileItem type="XLSX" name="Six-Sigma-data-pack.xlsx" size="210 KB" />
      <FileItem type="PPTX" name="Kickoff-deck.pptx" size="1.2 MB" />
      <FileItem type="ZIP" name="Resources.zip" size="3.4 MB" />
    </div>
  ),
};
