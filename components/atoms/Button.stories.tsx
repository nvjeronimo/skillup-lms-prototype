import type { Meta, StoryObj } from "@storybook/react";
import { ArrowRight, Plus, X } from "lucide-react";
import { Button, type ButtonHierarchy, type ButtonTone } from "./Button";

const meta: Meta<typeof Button> = {
  title: "Atoms/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: { children: "Button" },
  argTypes: {
    tone: { control: "select", options: ["brand", "destructive", "success"] },
    hierarchy: {
      control: "select",
      options: ["primary", "secondary", "tertiary", "link", "link-subtle"],
    },
    variant: {
      control: "select",
      options: ["primary", "secondary", "tertiary", "neutral", "destructive", "utility"],
      description: "Deprecated: use tone + hierarchy.",
    },
    size: { control: "select", options: ["sm", "md", "lg", "xl"] },
    loading: { control: "boolean" },
  },
};
export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = { args: { hierarchy: "primary" } };
export const Secondary: Story = { args: { hierarchy: "secondary" } };
export const Tertiary: Story = { args: { hierarchy: "tertiary" } };
export const Destructive: Story = { args: { tone: "destructive", hierarchy: "primary", children: "Delete" } };
export const Success: Story = { args: { tone: "success", hierarchy: "primary", children: "Go to next Course" } };
export const Link: Story = { args: { hierarchy: "link", rightIcon: ArrowRight, children: "View details" } };
export const Utility: Story = { args: { variant: "utility", children: "Filter" } };
export const Disabled: Story = { args: { hierarchy: "primary", disabled: true } };
export const Loading: Story = { args: { hierarchy: "primary", loading: true, children: "Saving" } };
export const WithIcon: Story = { args: { hierarchy: "primary", leftIcon: Plus, children: "Add note" } };
export const IconOnly: Story = {
  args: { hierarchy: "secondary", iconOnly: true, leftIcon: X, "aria-label": "Close", children: undefined },
};

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

/** The seven DS Button_def Type × Hierarchy combinations, then the four Link Button_def ones. */
const COMBOS: Array<[ButtonTone, ButtonHierarchy]> = [
  ["brand", "primary"],
  ["brand", "secondary"],
  ["brand", "tertiary"],
  ["destructive", "primary"],
  ["destructive", "secondary"],
  ["success", "primary"],
  ["success", "secondary"],
];
const LINKS: Array<[ButtonTone, ButtonHierarchy]> = [
  ["brand", "link"],
  ["destructive", "link"],
  ["success", "link"],
  ["brand", "link-subtle"],
];

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {[false, true].map((disabled) => (
        <div key={String(disabled)} className="flex flex-wrap items-center gap-3">
          {COMBOS.map(([tone, hierarchy]) => (
            <Button
              key={`${tone}-${hierarchy}`}
              tone={tone}
              hierarchy={hierarchy}
              rightIcon={ArrowRight}
              disabled={disabled}
            >
              {`${tone} ${hierarchy}`}
            </Button>
          ))}
        </div>
      ))}
      <div className="flex flex-wrap items-center gap-3">
        {LINKS.map(([tone, hierarchy]) => (
          <Button key={`${tone}-${hierarchy}`} tone={tone} hierarchy={hierarchy} rightIcon={ArrowRight}>
            {`${tone} ${hierarchy}`}
          </Button>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="neutral">Neutral (legacy)</Button>
        <Button variant="utility">Utility (legacy)</Button>
      </div>
    </div>
  ),
};
