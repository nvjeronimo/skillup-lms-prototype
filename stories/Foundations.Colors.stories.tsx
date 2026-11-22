import type { Meta, StoryObj } from "@storybook/react-vite";
import { collection, colorVar, type FigmaVariable } from "./figmaTokens";
import styles from "./Foundations.Colors.stories.module.css";

/**
 * Every colour token of the SKO DS (collection 1. SKO-Semantics 🎨), grouped by the element it
 * paints, read straight from tokens/figma/variables.json — the file the "Publish tokens" plugin
 * writes. The big swatch renders the live CSS variable, so it follows the theme / skin / Studio
 * toggles; the small chips are the DS value in each of the eight modes (hover for the hex).
 * DS "bg/primary-soft" → CSS --color-bg-primary-soft → Tailwind bg-sko-bg-primary-soft.
 */
const semantics = collection("1.");
const colours = semantics.variables.filter((v) => v.type === "COLOR");
const GROUPS = [
  ["Backgrounds (bg/)", "bg/"],
  ["Text (text/)", "text/"],
  ["Icons (icon/)", "icon/"],
  ["Borders (border/)", "border/"],
  ["Shadow (shadow/)", "shadow/"],
].map(([group, prefix]) => ({ group, tokens: colours.filter((v) => v.name.startsWith(prefix)) }));

function Swatch({ token }: { token: FigmaVariable }) {
  const cssVar = colorVar(token);
  return (
    <div className={styles.swatch}>
      <span
        className={styles.sample}
        style={{ background: `var(${cssVar})` }}
      />
      <span className={styles.meta}>
        <span className={`sk-text-body-medium-semibold ${styles.name}`}>{token.name}</span>
        <span className={`sk-text-body-small-regular ${styles.cssVar}`}>{cssVar}</span>
        <span className={styles.chips}>
          {semantics.modes.map((mode) => (
            <span
              key={mode}
              title={`${mode} ${token.values[mode]}${token.aliases?.[mode] ? ` (= ${token.aliases[mode]})` : ""}`}
              className={styles.chip}
              style={{ background: String(token.values[mode]) }}
            />
          ))}
        </span>
      </span>
    </div>
  );
}

function ColorTokens() {
  return (
    <div className={styles.page}>
      <p className={`sk-text-body-small-regular ${styles.subtle}`}>
        {colours.length} tokens · chips in mode order: {semantics.modes.join(", ")}
      </p>
      {GROUPS.map((g) => (
        <section key={g.group}>
          <h2 className={`sk-text-title-medium-semibold ${styles.groupTitle}`}>
            {g.group} · {g.tokens.length}
          </h2>
          <div className={styles.swatches}>
            {g.tokens.map((t) => (
              <Swatch key={t.name} token={t} />
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
