import type { Meta, StoryObj } from "@storybook/react";
import { collection, type FigmaVariable } from "./figmaTokens";

/**
 * SKO DS spacing, container and radius variables (collection 2. Responsive 📐, modes Desktop /
 * Tablet / Mobile), read from tokens/figma/variables.json — the file the "Publish tokens" plugin
 * writes, so these pages follow every token sync. 4pt base with a 6px half-step; Spacing/2xl and up
 * shrink on Tablet and Mobile. See tokens/spacing.md for the Tailwind classes.
 */
const responsive = collection("2.");
const MODES = responsive.modes;
const short = (mode: string) => mode[0];
const pick = (re: RegExp) => responsive.variables.filter((v) => re.test(v.name));
const SPACING = pick(/^Spacing\//);
const CONTAINER = pick(/^Container\//);
// The role tokens the components use (rounded-control, rounded-card…), not the fixed-* scale behind them.
const RADII = pick(/^Radius\/(?!fixed-)/);

const px = (v: FigmaVariable) => MODES.map((m) => Number(v.values[m]));
function modeLabel(v: FigmaVariable) {
  const values = px(v);
  return values.every((x) => x === values[0]) ? `${values[0]}px` : values.join(" / ");
}

function Foundations() {
  return (
    <div className="flex flex-col gap-8 p-6">
      <section>
        <h2 className="sk-text-title-medium-semibold mb-1 text-sko-text-default">Spacing</h2>
        <p className="sk-text-body-medium-regular mb-4 text-sko-text-subtle">
          4pt grid with a 6px half-step. From Spacing/2xl up the value shrinks on Tablet and
          Mobile (bars: {MODES.map((m) => `${short(m)} = ${m}`).join(", ")}). CSS: --sk-space-*.
        </p>
        <div className="flex flex-col gap-3">
          {SPACING.map((s) => (
            <div key={s.name} className="flex items-center gap-4">
              <code className="sk-text-body-small-regular w-28 shrink-0 text-sko-text-subtle">{s.name}</code>
              <span className="sk-text-body-small-regular w-28 shrink-0 text-sko-text-subtle">{modeLabel(s)}</span>
              <div className="flex flex-col gap-1">
                {px(s).map((value, i) => (
                  <div key={MODES[i]} className="flex items-center gap-2">
                    <span className="sk-text-label-small-regular w-3 text-sko-text-subtle">{short(MODES[i])}</span>
                    <span className="h-2 rounded-sm bg-sko-bg-primary" style={{ width: value }} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="sk-text-title-medium-semibold mb-1 text-sko-text-default">Container</h2>
        <p className="sk-text-body-medium-regular mb-4 text-sko-text-subtle">
          Page inset, the gap between items inside a container, and the content column width. CSS: --sk-container-*.
        </p>
        <div className="flex flex-col gap-2">
          {CONTAINER.map((c) => (
            <div key={c.name} className="flex items-center gap-4">
              <code className="sk-text-body-small-regular w-48 shrink-0 text-sko-text-subtle">{c.name}</code>
              <span className="sk-text-body-small-regular text-sko-text-default">
                {MODES.map((m) => `${short(m)} ${c.values[m]}`).join(" · ")}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="sk-text-title-medium-semibold mb-1 text-sko-text-default">Radius roles</h2>
        <p className="sk-text-body-medium-regular mb-4 text-sko-text-subtle">
          Chosen by what the element is, never by its size (tokens/radius.css). The square renders the
          live CSS variable, so it follows the Studio look and the square-corners switch.
        </p>
        <div className="flex flex-wrap gap-6">
          {RADII.map((r) => {
            const role = r.name.split("/")[1];
            return (
              <div key={r.name} className="flex flex-col items-center gap-2">
                <span
                  className="h-16 w-16 border border-sko-border-primary bg-sko-bg-primary-soft"
                  style={{ borderRadius: `var(--sk-radius-${role})` }}
                />
                <code className="sk-text-body-small-regular text-sko-text-subtle">{r.name}</code>
                <span className="sk-text-label-small-regular normal-case text-sko-text-subtle">
                  {Number(r.values[MODES[0]]) >= 9999 ? "full" : modeLabel(r)} · rounded-{role}
                  {r.aliases?.[MODES[0]] ? ` · = ${r.aliases[MODES[0]]}` : ""}
                </span>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

const meta: Meta<typeof Foundations> = {
  title: "Foundations/Spacing",
  component: Foundations,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Foundations>;

export const ScaleAndRadii: Story = {};
