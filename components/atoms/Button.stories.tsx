import type { Meta, StoryObj } from "@storybook/react";
import { Plus } from "lucide-react";
import { Button } from "./Button";

const meta: Meta<typeof Button> = {
  title: "Atoms/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: { children: "Button" },
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "tertiary", "destructive", "utility"],
    },
    size: { control: "select", options: ["sm", "md", "lg", "xl"] },
  },
};
export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = { args: { variant: "primary" } };
export const Secondary: Story = { args: { variant: "secondary" } };
export const Tertiary: Story = { args: { variant: "tertiary" } };
export const Destructive: Story = { args: { variant: "destructive", children: "Delete" } };
export const Utility: Story = { args: { variant: "utility", children: "Filter" } };
export const Disabled: Story = { args: { variant: "primary", disabled: true } };
export const WithIcon: Story = { args: { variant: "primary", leftIcon: Plus, children: "Add note" } };

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-3">
      <Button {...args} size="sm">
        Small
      </Button>
      <Button {...args} size="md">
        Medium
      </Button>
      <Button {...args} size="lg">
        Large
      </Button>
      <Button {...args} size="xl">
        XLarge
      </Button>
    </div>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="tertiary">Tertiary</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="utility">Utility</Button>
    </div>
  ),
};
