import type { Meta, StoryObj } from "@storybook/react";
import { BookmarkButton } from "./Bookmark";

const meta: Meta<typeof BookmarkButton> = {
  title: "Atoms/Bookmark",
  component: BookmarkButton,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: { bookmarked: false },
};
export default meta;

type Story = StoryObj<typeof BookmarkButton>;

export const NotBookmarked: Story = { args: { bookmarked: false } };
export const Bookmarked: Story = { args: { bookmarked: true } };
