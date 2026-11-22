import type { Meta, StoryObj } from "@storybook/react-vite";
import { collection, textStyles, type FigmaTextStyle } from "./figmaTokens";
import styles from "./Foundations.Typography.stories.module.css";

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
    <div className={styles.row}>
      <div className={styles.label}>
        <code className={`sk-text-body-small-regular ${styles.cssClass}`}>.{cls}</code>
        <span className={`sk-text-label-small-regular ${styles.styleName}`}>
          {s.name} · {metrics(s)}
        </span>
      </div>
      <span className={`${cls} ${styles.sample}`}>The quick brown fox jumps over</span>
    </div>
  );
}

function TypeRamp() {
  return (
    <div className={styles.page}>
      {FAMILIES.map((family) => (
        <section key={family} className={styles.family}>
          <h2 className={`sk-text-title-medium-semibold ${styles.familyTitle}`}>{family}</h2>
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
