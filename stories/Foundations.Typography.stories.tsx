import type { Meta, StoryObj } from "@storybook/react";

/**
 * SKO DS text styles. `font-family-body` = Montserrat (the whole UI uses it).
 * Each row maps a Figma text style → the `.lms-text-*` utility + its metrics.
 */
const DISPLAY = [
  { cls: "lms-text-display-md-bold", name: "Display md / Bold", meta: "36 / 44" },
  { cls: "lms-text-display-sm-semibold", name: "Display sm / Semibold", meta: "30 / 38" },
  { cls: "lms-text-display-xs-semibold", name: "Display xs / Semibold", meta: "24 / 32" },
];

const TEXT = [
  { cls: "lms-text-lg-semibold", name: "Text lg / Semibold", meta: "18 / 24" },
  { cls: "lms-text-lg-medium", name: "Text lg / Medium", meta: "18 / 24" },
  { cls: "lms-text-md-semibold", name: "Text md / Semibold", meta: "16 / 24" },
  { cls: "lms-text-md-medium", name: "Text md / Medium", meta: "16 / 24" },
  { cls: "lms-text-md-regular", name: "Text md / Regular", meta: "16 / 24" },
  { cls: "lms-text-sm-semibold", name: "Text sm / Semibold", meta: "14 / 20" },
  { cls: "lms-text-sm-medium", name: "Text sm / Medium", meta: "14 / 20" },
  { cls: "lms-text-sm-regular", name: "Text sm / Regular", meta: "14 / 20" },
  { cls: "lms-text-xs-semibold", name: "Text xs / Semibold", meta: "12 / 18" },
  { cls: "lms-text-xs-medium", name: "Text xs / Medium", meta: "12 / 18" },
  { cls: "lms-text-xs-regular", name: "Text xs / Regular", meta: "12 / 18" },
  { cls: "lms-text-2xs-semibold", name: "Text 2xs / Semibold · UPPER +4%", meta: "10 / 14" },
  { cls: "lms-text-2xs-medium", name: "Text 2xs / Medium · UPPER +4%", meta: "10 / 14" },
  { cls: "lms-text-2xs-regular", name: "Text 2xs / Regular · UPPER +4%", meta: "10 / 14" },
];

function Row({ cls, name, meta }: { cls: string; name: string; meta: string }) {
  return (
    <div className="flex items-baseline gap-6 border-b border-lms-border-secondary pb-3">
      <div className="w-72 shrink-0">
        <code className="lms-text-xs-regular block text-lms-text-tertiary">.{cls}</code>
        <span className="lms-text-2xs-regular block normal-case text-lms-text-tertiary">
          {name} · {meta}
        </span>
      </div>
      <span className={`${cls} text-lms-text-primary`}>The quick brown fox jumps over</span>
    </div>
  );
}

function TypeRamp() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <section className="flex flex-col gap-4">
        <h2 className="lms-text-lg-semibold text-lms-text-primary">Display (Montserrat)</h2>
        {DISPLAY.map((r) => (
          <Row key={r.cls} {...r} />
        ))}
      </section>
      <section className="flex flex-col gap-4">
        <h2 className="lms-text-lg-semibold text-lms-text-primary">Text (Montserrat)</h2>
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
