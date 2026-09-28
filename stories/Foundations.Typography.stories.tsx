import type { Meta, StoryObj } from "@storybook/react";

/**
 * SKO DS text styles. `font-family-body` = Montserrat (the whole UI uses it).
 * Each row maps a Figma text style → the `.sk-text-*` class + its metrics
 * (size / line-height in px). The three headline styles are mode-aware
 * (Type/size/* + Type/line-height/*): D = Desktop, T = Tablet, M = Mobile.
 * Resize the canvas below 1025 / 769 px to see the Tablet / Mobile values.
 */
const HEADLINE = [
  {
    cls: "sk-text-display-md-bold",
    name: "headline-large/Bold",
    meta: "D 36/44 · T 30/38 · M 24/32 · −2%",
  },
  {
    cls: "sk-text-display-sm-semibold",
    name: "headline-medium/Semibold",
    meta: "D 30/38 · T 30/38 · M 24/32",
  },
  {
    cls: "sk-text-display-xs-semibold",
    name: "headline-small/Semibold",
    meta: "D 24/32 · T 24/32 · M 20/30",
  },
];

const TEXT = [
  { cls: "sk-text-lg-semibold", name: "title-medium/Semibold", meta: "18/24" },
  { cls: "sk-text-lg-medium", name: "title-medium/Medium", meta: "18/24" },
  { cls: "sk-text-md-semibold", name: "body-large/Semibold", meta: "16/24" },
  { cls: "sk-text-md-medium", name: "body-large/Medium", meta: "16/24" },
  { cls: "sk-text-md-regular", name: "body-large/Regular", meta: "16/24" },
  { cls: "sk-text-sm-semibold", name: "body-medium/Semibold", meta: "14/20" },
  { cls: "sk-text-sm-medium", name: "body-medium/Medium", meta: "14/20" },
  { cls: "sk-text-sm-regular", name: "body-medium/Regular", meta: "14/20" },
  { cls: "sk-text-xs-semibold", name: "body-small/Semibold", meta: "12/18" },
  { cls: "sk-text-xs-medium", name: "body-small/Medium", meta: "12/18" },
  { cls: "sk-text-xs-regular", name: "body-small/Regular", meta: "12/18" },
  { cls: "sk-text-2xs-semibold", name: "label-small/Semibold", meta: "10/14 · UPPER +4%" },
  { cls: "sk-text-2xs-medium", name: "label-small/Medium", meta: "10/14 · UPPER +4%" },
  { cls: "sk-text-2xs-regular", name: "label-small/Regular", meta: "10/14 · UPPER +4%" },
];

function Row({ cls, name, meta }: { cls: string; name: string; meta: string }) {
  return (
    <div className="flex items-baseline gap-6 border-b border-sko-border-subtle pb-3">
      <div className="w-72 shrink-0">
        <code className="sk-text-xs-regular block text-sko-text-subtle">.{cls}</code>
        <span className="sk-text-2xs-regular block normal-case text-sko-text-subtle">
          {name} · {meta}
        </span>
      </div>
      <span className={`${cls} text-sko-text-default`}>The quick brown fox jumps over</span>
    </div>
  );
}

function TypeRamp() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <section className="flex flex-col gap-4">
        <h2 className="sk-text-lg-semibold text-sko-text-default">Headline (Montserrat)</h2>
        {HEADLINE.map((r) => (
          <Row key={r.cls} {...r} />
        ))}
      </section>
      <section className="flex flex-col gap-4">
        <h2 className="sk-text-lg-semibold text-sko-text-default">Title · Body · Label (Montserrat)</h2>
        {TEXT.map((r) => (
          <Row key={r.cls} {...r} />
        ))}
      </section>
    </div>
  );
}

const meta: Meta<typeof TypeRamp> = {
  title: "Foundations/Typography",
  component: TypeRamp,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof TypeRamp>;

export const Ramp: Story = {};
