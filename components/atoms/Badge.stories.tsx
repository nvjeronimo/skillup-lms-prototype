import type { Meta, StoryObj } from "@storybook/react-vite";
import { Check } from "lucide-react";
import { Badge, type BadgeColor, type BadgeSize, type BadgeVariant } from "./Badge";
import styles from "./Badge.stories.module.css";

const COLORS: BadgeColor[] = [
  "gray",
  "brand",
  "info",
  "success",
  "warning",
  "error",
  "teal",
  "green",
  "red",
  "yellow",
];
const VARIANTS: BadgeVariant[] = ["soft", "outline", "modern", "plain"];
const SIZES: BadgeSize[] = ["sm", "md", "lg"];

const meta: Meta<typeof Badge> = {
  title: "Atoms/Badge",
  component: Badge,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: { color: "brand", variant: "soft", size: "sm", children: "Label" },
  argTypes: {
    color: { control: "select", options: COLORS },
    variant: { control: "select", options: VARIANTS },
    size: { control: "select", options: SIZES },
    tone: { control: false },
  },
};
export default meta;

type Story = StoryObj<typeof Badge>;

export const Default: Story = {};

export const WithLeadingIcon: Story = { args: { leftIcon: Check } };

/** Badge Style × Color at Size=sm, label only and with a leading icon. */
export const Matrix: Story = {
  render: () => (
    <div className={styles.stack}>
      {VARIANTS.map((variant) => (
        <div key={variant} className={styles.wrapRow}>
          {COLORS.map((color) => (
            <Badge key={color} variant={variant} color={color}>
              {color}
            </Badge>
          ))}
          {COLORS.map((color) => (
            <Badge key={`${color}-icon`} variant={variant} color={color} leftIcon={Check}>
              {color}
            </Badge>
          ))}
        </div>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className={styles.wrapRow}>
      {SIZES.map((size) => (
        <Badge key={size} size={size} color="brand">
          {size}
        </Badge>
      ))}
      {SIZES.map((size) => (
        <Badge key={`${size}-icon`} size={size} color="brand" leftIcon={Check}>
          {size}
        </Badge>
      ))}
    </div>
  ),
};
