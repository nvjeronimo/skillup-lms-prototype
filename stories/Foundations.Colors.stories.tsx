import type { Meta, StoryObj } from "@storybook/react";

/** Every LMS color token grouped by role. Bound to CSS variables — never hex. */
const GROUPS: { group: string; tokens: { name: string; hex: string }[] }[] = [
  {
    group: "Backgrounds",
    tokens: [
      { name: "bg-primary", hex: "#ffffff" },
      { name: "bg-secondary", hex: "#f3f5fa" },
      { name: "bg-secondary-subtle", hex: "#f8f9fa" },
      { name: "bg-tertiary", hex: "#e1e7ec" },
      { name: "bg-brand-primary", hex: "#ebf8ff" },
      { name: "bg-brand-section", hex: "#ebf8ff" },
      { name: "bg-brand-solid", hex: "#26708e" },
      { name: "bg-brand-hover", hex: "#f9c654" },
      { name: "bg-success-primary", hex: "#e4fced" },
      { name: "bg-warning-primary", hex: "#fff9eb" },
      { name: "bg-error-primary", hex: "#fce8e8" },
    ],
  },
  {
    group: "Borders",
    tokens: [
      { name: "border-primary", hex: "#b9c4ce" },
      { name: "border-secondary", hex: "#e1e7ec" },
      { name: "border-brand", hex: "#26708e" },
    ],
  },
  {
    group: "Foreground",
    tokens: [
      { name: "fg-white", hex: "#ffffff" },
      { name: "fg-quaternary", hex: "#b9c4ce" },
      { name: "fg-brand", hex: "#26708e" },
      { name: "fg-brand-primary", hex: "#26708e" },
      { name: "fg-progress", hex: "#0086c9" },
    ],
  },
  {
    group: "Text",
    tokens: [
      { name: "text-primary", hex: "#13282f" },
      { name: "text-secondary", hex: "#606b7a" },
      { name: "text-tertiary", hex: "#677482" },
      { name: "text-primary-on-brand", hex: "#ffffff" },
      { name: "text-brand", hex: "#26708e" },
      { name: "text-brand-primary", hex: "#044150" },
      { name: "text-brand-secondary", hex: "#26708e" },
      { name: "text-success-primary", hex: "#1f7643" },
      { name: "text-warning-primary", hex: "#85580e" },
      { name: "text-error-primary", hex: "#da3336" },
    ],
  },
];

function Swatch({ name, hex }: { name: string; hex: string }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-lms-border-secondary p-2">
      <span
        className="h-12 w-12 shrink-0 rounded-md border border-lms-border-secondary"
        style={{ background: `var(--lms-${name})` }}
      />
      <span className="min-w-0">
        <span className="lms-text-sm-semibold block text-lms-text-primary">--lms-{name}</span>
        <span className="lms-text-xs-regular block uppercase text-lms-text-tertiary">{hex}</span>
      </span>
    </div>
  );
}

function ColorTokens() {
  return (
    <div className="flex flex-col gap-6 p-6">
      {GROUPS.map((g) => (
        <section key={g.group}>
          <h2 className="lms-text-lg-semibold mb-3 text-lms-text-primary">{g.group}</h2>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {g.tokens.map((t) => (
              <Swatch key={t.name} {...t} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

const meta: Meta<typeof ColorTokens> = {
  title: "Foundations/Colors",
  component: ColorTokens,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof ColorTokens>;

export const AllTokens: Story = {};
