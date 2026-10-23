import type { Meta, StoryObj } from "@storybook/react";
import { collection, colorVar, type FigmaVariable } from "./figmaTokens";

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
    <div className="flex items-center gap-3 rounded-lg border border-sko-border-subtle p-2">
      <span
        className="h-12 w-12 shrink-0 rounded-md border border-sko-border-subtle"
        style={{ background: `var(${cssVar})` }}
      />
      <span className="min-w-0">
        <span className="sk-text-body-medium-semibold block text-sko-text-default">{token.name}</span>
        <span className="sk-text-body-small-regular block text-sko-text-subtle">{cssVar}</span>
        <span className="mt-1 flex flex-wrap gap-1">
          {semantics.modes.map((mode) => (
            <span
              key={mode}
              title={`${mode} ${token.values[mode]}${token.aliases?.[mode] ? ` (= ${token.aliases[mode]})` : ""}`}
              className="h-3 w-3 rounded-sm border border-sko-border-subtle"
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
    <div className="flex flex-col gap-6 bg-sko-bg-page p-6">
      <p className="sk-text-body-small-regular text-sko-text-subtle">
        {colours.length} tokens · chips in mode order: {semantics.modes.join(", ")}
      </p>
      {GROUPS.map((g) => (
        <section key={g.group}>
          <h2 className="sk-text-title-medium-semibold mb-3 text-sko-text-default">
            {g.group} · {g.tokens.length}
          </h2>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
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
