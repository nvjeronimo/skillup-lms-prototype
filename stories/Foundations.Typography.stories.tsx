import type { Meta, StoryObj } from "@storybook/react";
import { collection, textStyles, type FigmaTextStyle } from "./figmaTokens";

/**
 * The SKO DS text styles, read from tokens/figma/variables.json (the file the "Publish tokens"
 * plugin writes). Each row is a Figma text style → its generated `.sk-text-*` class
 * (tokens/generated/typography.css) and its metrics per mode. Sizes bound to a mode-aware
 * Type/* variable change on Tablet and Mobile: resize the canvas below 1025 / 769 px to see them.
 */
const responsive = collection("2.");
const MODES = responsive.modes;
const valueOf = (name: string) => responsive.variables.find((v) => v.name === name);

const className = (s: FigmaTextStyle) => {
  const [style, weight] = s.name.split("/");
  return `sk-text-${style}-${weight.toLowerCase()}`;
};
function metrics(s: FigmaTextStyle) {
  const size = valueOf(s.bound.fontSize);
  const lh = valueOf(s.bound.lineHeight);
  const per = MODES.map((m) => `${size?.values[m]}/${lh?.values[m]}`);
  const sizes = per.every((x) => x === per[0]) ? per[0] : MODES.map((m, i) => `${m[0]} ${per[i]}`).join(" · ");
  const extra = [
    s.letterSpacing.value ? `${s.letterSpacing.value > 0 ? "+" : ""}${s.letterSpacing.value}%` : "",
    s.textCase === "UPPER" ? "UPPER" : "",
  ].filter(Boolean);
  return [sizes, ...extra].join(" · ");
}

// Display, headline and title first, then body and label, in the order the DS lists them.
const FAMILIES = [...new Set(textStyles.map((s) => s.name.split("/")[0]))];

function Row({ s }: { s: FigmaTextStyle }) {
  const cls = className(s);
  return (
    <div className="flex items-baseline gap-6 border-b border-sko-border-subtle pb-3">
      <div className="w-72 shrink-0">
        <code className="sk-text-body-small-regular block text-sko-text-subtle">.{cls}</code>
        <span className="sk-text-label-small-regular block normal-case text-sko-text-subtle">
          {s.name} · {metrics(s)}
        </span>
      </div>
      <span className={`${cls} text-sko-text-default`}>The quick brown fox jumps over</span>
    </div>
  );
}

function TypeRamp() {
  return (
    <div className="flex flex-col gap-6 p-6">
      {FAMILIES.map((family) => (
        <section key={family} className="flex flex-col gap-4">
          <h2 className="sk-text-title-medium-semibold text-sko-text-default">{family}</h2>
          {textStyles
            .filter((s) => s.name.startsWith(`${family}/`))
            .map((s) => (
              <Row key={s.name} s={s} />
            ))}
        </section>
      ))}
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
