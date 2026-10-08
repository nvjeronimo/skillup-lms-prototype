import type { Meta, StoryObj } from "@storybook/react";

/**
 * The 114 colour tokens of the SKO DS (collection 🎨 SKO-Semantics), grouped by the
 * element they paint. The swatch renders the live CSS variable, so it follows the
 * theme/skin on <html>; the six chips are the DS values per mode, as exported from
 * Figma on 2026-09-28 (SKO Light, SKO Dark, Gold Light, Gold Dark, Red Light, Red Dark).
 * DS "bg/primary-soft" → CSS --color-bg-primary-soft → Tailwind bg-sko-bg-primary-soft.
 */
type Token = { ds: string; modes: [string, string, string, string, string, string] };

const MODE_NAMES = ["SKO L", "SKO D", "Gold L", "Gold D", "Red L", "Red D"] as const;

const GROUPS: { group: string; tokens: Token[] }[] = [
  {
    group: "Backgrounds (bg/)",
    tokens: [
      { ds: "bg/page", modes: ["#ffffff", "#0e1a1f", "#ffffff", "#0e1a1f", "#ffffff", "#0e1a1f"] },
      { ds: "bg/subtle", modes: ["#f3f5fa", "#122228", "#f3f5fa", "#122228", "#f3f5fa", "#122228"] },
      { ds: "bg/faint", modes: ["#f8f9fa", "#16282f", "#f8f9fa", "#16282f", "#f8f9fa", "#16282f"] },
      { ds: "bg/muted", modes: ["#e1e7ec", "#25383f", "#e1e7ec", "#25383f", "#e1e7ec", "#25383f"] },
      { ds: "bg/primary-soft", modes: ["#ebf8ff", "#0f2c38", "#ffda8f", "#2a2f25", "#ffd5d0", "#28252a"] },
      { ds: "bg/primary", modes: ["#26708e", "#4aa3c7", "#553600", "#ffd07a", "#88262a", "#ff8985"] },
      { ds: "bg/warning-soft", modes: ["#fff9eb", "#2e2410", "#fff9eb", "#2e2410", "#fff9eb", "#2e2410"] },
      { ds: "bg/success-soft", modes: ["#e4fced", "#102b1d", "#e4fced", "#102b1d", "#e4fced", "#102b1d"] },
      { ds: "bg/error-soft", modes: ["#fce8e8", "#34191b", "#fce8e8", "#34191b", "#fce8e8", "#34191b"] },
      { ds: "bg/primary-hover", modes: ["#f9c654", "#6cc0e0", "#ffe4a9", "#ffe4a9", "#ffa19d", "#ffa19d"] },
      { ds: "bg/info", modes: ["#0086c9", "#0086c9", "#0086c9", "#0086c9", "#0086c9", "#0086c9"] },
      { ds: "bg/error", modes: ["#da3336", "#e26567", "#da3336", "#e26567", "#da3336", "#e26567"] },
      { ds: "bg/overlay", modes: ["#0e1a1f80", "#0e1a1f80", "#0e1a1f80", "#0e1a1f80", "#0e1a1f80", "#0e1a1f80"] },
      { ds: "bg/success", modes: ["#1f7643", "#2d9c5b", "#1f7643", "#2d9c5b", "#1f7643", "#2d9c5b"] },
      { ds: "bg/warning", modes: ["#f9c654", "#f9c654", "#f9c654", "#f9c654", "#f9c654", "#f9c654"] },
      { ds: "bg/strong", modes: ["#b9c4ce", "#2c3d45", "#b9c4ce", "#2c3d45", "#b9c4ce", "#2c3d45"] },
      { ds: "bg/fixed", modes: ["#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff"] },
      { ds: "bg/fixed-subtle", modes: ["#f8f9fa", "#f8f9fa", "#f8f9fa", "#f8f9fa", "#f8f9fa", "#f8f9fa"] },
      { ds: "bg/inverse", modes: ["#13282f", "#eaf1f4", "#13282f", "#eaf1f4", "#13282f", "#eaf1f4"] },
      { ds: "bg/on-media", modes: ["#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff"] },
      { ds: "bg/accent-teal", modes: ["#1f655e", "#42aea3", "#1f655e", "#42aea3", "#1f655e", "#42aea3"] },
      { ds: "bg/accent-teal-soft", modes: ["#e8fffe", "#044150", "#aaeeeb", "#044150", "#aaeeeb", "#044150"] },
      { ds: "bg/accent-green", modes: ["#1f7643", "#2d9c5b", "#1f7643", "#2d9c5b", "#1f7643", "#2d9c5b"] },
      { ds: "bg/accent-green-soft", modes: ["#e4fced", "#17523a", "#e4fced", "#17523a", "#e4fced", "#17523a"] },
      { ds: "bg/accent-red", modes: ["#b62226", "#e26567", "#b62226", "#e26567", "#b62226", "#e26567"] },
      { ds: "bg/accent-red-soft", modes: ["#fce8e8", "#60191a", "#fce8e8", "#60191a", "#fce8e8", "#60191a"] },
      { ds: "bg/accent-yellow", modes: ["#f9c654", "#f9c654", "#f9c654", "#f9c654", "#f9c654", "#f9c654"] },
      { ds: "bg/accent-yellow-soft", modes: ["#fff9eb", "#85580e", "#fff9eb", "#85580e", "#fff9eb", "#85580e"] },
      { ds: "bg/overlay-soft", modes: ["#0e1a1f33", "#0e1a1f33", "#0e1a1f33", "#0e1a1f33", "#0e1a1f33", "#0e1a1f33"] },
      { ds: "bg/on-media-soft", modes: ["#ffffff4d", "#ffffff4d", "#ffffff4d", "#ffffff4d", "#ffffff4d", "#ffffff4d"] },
      { ds: "bg/info-soft", modes: ["#acd5f4", "#044150", "#acd5f4", "#044150", "#acd5f4", "#044150"] },
    ],
  },
  {
    group: "Text (text/)",
    tokens: [
      { ds: "text/default", modes: ["#13282f", "#eaf1f4", "#13282f", "#eaf1f4", "#13282f", "#eaf1f4"] },
      { ds: "text/muted", modes: ["#39414c", "#b3c0c7", "#39414c", "#b3c0c7", "#39414c", "#b3c0c7"] },
      { ds: "text/subtle", modes: ["#4f5b69", "#93a3ab", "#4f5b69", "#93a3ab", "#4f5b69", "#93a3ab"] },
      { ds: "text/on-primary-soft", modes: ["#044150", "#cdeaf6", "#553600", "#ffe4a9", "#67151a", "#ffd5d0"] },
      { ds: "text/primary", modes: ["#215477", "#6cc0e0", "#553600", "#ffd07a", "#88262a", "#ff8985"] },
      { ds: "text/on-primary", modes: ["#ffffff", "#0e1a1f", "#ffffff", "#0e1a1f", "#ffffff", "#0e1a1f"] },
      { ds: "text/success", modes: ["#1f7643", "#72d99a", "#1f7643", "#72d99a", "#1f7643", "#72d99a"] },
      { ds: "text/warning", modes: ["#85580e", "#fab929", "#85580e", "#fab929", "#85580e", "#fab929"] },
      { ds: "text/error", modes: ["#b62226", "#f3afb0", "#b62226", "#f3afb0", "#b62226", "#f3afb0"] },
      { ds: "text/on-media", modes: ["#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff"] },
      { ds: "text/on-error", modes: ["#ffffff", "#0e1a1f", "#ffffff", "#0e1a1f", "#ffffff", "#0e1a1f"] },
      { ds: "text/on-success", modes: ["#ffffff", "#0e1a1f", "#ffffff", "#0e1a1f", "#ffffff", "#0e1a1f"] },
      { ds: "text/on-warning", modes: ["#13282f", "#13282f", "#13282f", "#13282f", "#13282f", "#13282f"] },
      { ds: "text/disabled", modes: ["#8995a6", "#53666e", "#8995a6", "#53666e", "#8995a6", "#53666e"] },
      { ds: "text/placeholder", modes: ["#677482", "#73848c", "#677482", "#73848c", "#677482", "#73848c"] },
      { ds: "text/on-primary-hover", modes: ["#044150", "#0e1a1f", "#553600", "#0e1a1f", "#67151a", "#0e1a1f"] },
      { ds: "text/on-fixed", modes: ["#13282f", "#13282f", "#13282f", "#13282f", "#13282f", "#13282f"] },
      { ds: "text/accent-teal", modes: ["#044150", "#aaeeeb", "#044150", "#aaeeeb", "#044150", "#aaeeeb"] },
      { ds: "text/on-accent-teal", modes: ["#ffffff", "#13282f", "#ffffff", "#13282f", "#ffffff", "#13282f"] },
      { ds: "text/accent-green", modes: ["#17523a", "#aaedc2", "#17523a", "#aaedc2", "#17523a", "#aaedc2"] },
      { ds: "text/on-accent-green", modes: ["#ffffff", "#0e1a1f", "#ffffff", "#0e1a1f", "#ffffff", "#0e1a1f"] },
      { ds: "text/accent-red", modes: ["#60191a", "#e8797b", "#60191a", "#e8797b", "#60191a", "#e8797b"] },
      { ds: "text/on-accent-red", modes: ["#ffffff", "#13282f", "#ffffff", "#13282f", "#ffffff", "#13282f"] },
      { ds: "text/accent-yellow", modes: ["#85580e", "#ffebbd", "#85580e", "#ffebbd", "#85580e", "#ffebbd"] },
      { ds: "text/on-accent-yellow", modes: ["#13282f", "#13282f", "#13282f", "#13282f", "#13282f", "#13282f"] },
      { ds: "text/on-inverse", modes: ["#ffffff", "#0e1a1f", "#ffffff", "#0e1a1f", "#ffffff", "#0e1a1f"] },
      { ds: "text/info", modes: ["#044150", "#6cc0e0", "#044150", "#6cc0e0", "#044150", "#6cc0e0"] },
      { ds: "text/accent-cyan", modes: ["#0e7090", "#06aed4", "#0e7090", "#06aed4", "#0e7090", "#06aed4"] },
      { ds: "text/accent-blue", modes: ["#175cd3", "#2e90fa", "#175cd3", "#2e90fa", "#175cd3", "#2e90fa"] },
      { ds: "text/accent-indigo", modes: ["#3538cd", "#8098f9", "#3538cd", "#8098f9", "#3538cd", "#8098f9"] },
      { ds: "text/accent-violet", modes: ["#6927da", "#a48afb", "#6927da", "#a48afb", "#6927da", "#a48afb"] },
      { ds: "text/accent-purple", modes: ["#5925dc", "#9b8afb", "#5925dc", "#9b8afb", "#5925dc", "#9b8afb"] },
      { ds: "text/accent-fuchsia", modes: ["#9f1ab1", "#d444f1", "#9f1ab1", "#d444f1", "#9f1ab1", "#d444f1"] },
      { ds: "text/accent-pink", modes: ["#c11574", "#ee46bc", "#c11574", "#ee46bc", "#c11574", "#ee46bc"] },
      { ds: "text/accent-orange", modes: ["#b93815", "#ef6820", "#b93815", "#ef6820", "#b93815", "#ef6820"] },
    ],
  },
  {
    group: "Icons (icon/)",
    tokens: [
      { ds: "icon/faint", modes: ["#b9c4ce", "#606b7a", "#b9c4ce", "#606b7a", "#b9c4ce", "#606b7a"] },
      { ds: "icon/success-strong", modes: ["#33a864", "#40c075", "#33a864", "#40c075", "#33a864", "#40c075"] },
      { ds: "icon/default", modes: ["#13282f", "#eaf1f4", "#13282f", "#eaf1f4", "#13282f", "#eaf1f4"] },
      { ds: "icon/muted", modes: ["#39414c", "#b3c0c7", "#39414c", "#b3c0c7", "#39414c", "#b3c0c7"] },
      { ds: "icon/subtle", modes: ["#4f5b69", "#93a3ab", "#4f5b69", "#93a3ab", "#4f5b69", "#93a3ab"] },
      { ds: "icon/primary", modes: ["#26708e", "#4aa3c7", "#553600", "#ffd07a", "#88262a", "#ff8985"] },
      { ds: "icon/on-primary", modes: ["#ffffff", "#0e1a1f", "#ffffff", "#0e1a1f", "#ffffff", "#0e1a1f"] },
      { ds: "icon/on-media", modes: ["#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff"] },
      { ds: "icon/error", modes: ["#b62226", "#f3afb0", "#b62226", "#f3afb0", "#b62226", "#f3afb0"] },
      { ds: "icon/success", modes: ["#1f7643", "#72d99a", "#1f7643", "#72d99a", "#1f7643", "#72d99a"] },
      { ds: "icon/on-success", modes: ["#ffffff", "#0e1a1f", "#ffffff", "#0e1a1f", "#ffffff", "#0e1a1f"] },
      { ds: "icon/warning", modes: ["#85580e", "#fab929", "#85580e", "#fab929", "#85580e", "#fab929"] },
      { ds: "icon/info", modes: ["#044150", "#6cc0e0", "#044150", "#6cc0e0", "#044150", "#6cc0e0"] },
      { ds: "icon/on-fixed", modes: ["#13282f", "#13282f", "#13282f", "#13282f", "#13282f", "#13282f"] },
      { ds: "icon/accent-teal", modes: ["#044150", "#aaeeeb", "#044150", "#aaeeeb", "#044150", "#aaeeeb"] },
      { ds: "icon/accent-green", modes: ["#17523a", "#aaedc2", "#17523a", "#aaedc2", "#17523a", "#aaedc2"] },
      { ds: "icon/accent-red", modes: ["#60191a", "#e8797b", "#60191a", "#e8797b", "#60191a", "#e8797b"] },
      { ds: "icon/accent-yellow", modes: ["#85580e", "#ffebbd", "#85580e", "#ffebbd", "#85580e", "#ffebbd"] },
      { ds: "icon/on-accent-teal", modes: ["#ffffff", "#13282f", "#ffffff", "#13282f", "#ffffff", "#13282f"] },
      { ds: "icon/on-accent-green", modes: ["#ffffff", "#0e1a1f", "#ffffff", "#0e1a1f", "#ffffff", "#0e1a1f"] },
      { ds: "icon/on-accent-red", modes: ["#ffffff", "#13282f", "#ffffff", "#13282f", "#ffffff", "#13282f"] },
      { ds: "icon/on-accent-yellow", modes: ["#13282f", "#13282f", "#13282f", "#13282f", "#13282f", "#13282f"] },
    ],
  },
  {
    group: "Borders & focus (border/)",
    tokens: [
      { ds: "border/default", modes: ["#8995a6", "#8995a6", "#8995a6", "#8995a6", "#8995a6", "#8995a6"] },
      { ds: "border/subtle", modes: ["#d5dce2", "#2c3d45", "#d5dce2", "#2c3d45", "#d5dce2", "#2c3d45"] },
      { ds: "border/primary-muted", modes: ["#acd5f4", "#215477", "#c89536", "#724c00", "#ffa19d", "#390003"] },
      { ds: "border/error-soft", modes: ["#f3afb0", "#741b1d", "#f3afb0", "#741b1d", "#f3afb0", "#741b1d"] },
      { ds: "border/warning-soft", modes: ["#ffebbd", "#996816", "#ffebbd", "#996816", "#ffebbd", "#996816"] },
      { ds: "border/success-soft", modes: ["#aaedc2", "#1b6440", "#aaedc2", "#1b6440", "#aaedc2", "#1b6440"] },
      { ds: "border/disabled", modes: ["#b9c4ce", "#25383f", "#b9c4ce", "#25383f", "#b9c4ce", "#25383f"] },
      { ds: "border/inverse", modes: ["#13282f", "#16282f", "#13282f", "#16282f", "#13282f", "#16282f"] },
      { ds: "border/focus-gap", modes: ["#ffffff", "#062c41", "#ffffff", "#062c41", "#ffffff", "#062c41"] },
      { ds: "border/strong", modes: ["#13282f", "#eaf1f4", "#13282f", "#eaf1f4", "#13282f", "#eaf1f4"] },
      { ds: "border/primary", modes: ["#26708e", "#4aa3c7", "#553600", "#ffd07a", "#88262a", "#ff8985"] },
      { ds: "border/primary-soft", modes: ["#acd5f4", "#215477", "#c89536", "#724c00", "#ffa19d", "#390003"] },
      { ds: "border/error", modes: ["#b62226", "#f3afb0", "#b62226", "#f3afb0", "#b62226", "#f3afb0"] },
      { ds: "border/success", modes: ["#1f7643", "#72d99a", "#1f7643", "#72d99a", "#1f7643", "#72d99a"] },
      { ds: "border/warning", modes: ["#85580e", "#fab929", "#85580e", "#fab929", "#85580e", "#fab929"] },
      { ds: "border/info", modes: ["#0086c9", "#0086c9", "#0086c9", "#0086c9", "#0086c9", "#0086c9"] },
      { ds: "border/accent-teal", modes: ["#1f655e", "#42aea3", "#1f655e", "#42aea3", "#1f655e", "#42aea3"] },
      { ds: "border/accent-teal-soft", modes: ["#aaeeeb", "#0f595d", "#aaeeeb", "#0f595d", "#aaeeeb", "#0f595d"] },
      { ds: "border/accent-green", modes: ["#1f7643", "#2d9c5b", "#1f7643", "#2d9c5b", "#1f7643", "#2d9c5b"] },
      { ds: "border/accent-green-soft", modes: ["#aaedc2", "#1b6440", "#aaedc2", "#1b6440", "#aaedc2", "#1b6440"] },
      { ds: "border/accent-red", modes: ["#b62226", "#e26567", "#b62226", "#e26567", "#b62226", "#e26567"] },
      { ds: "border/accent-red-soft", modes: ["#e8797b", "#741b1d", "#e8797b", "#741b1d", "#e8797b", "#741b1d"] },
      { ds: "border/accent-yellow", modes: ["#f9c654", "#f9c654", "#f9c654", "#f9c654", "#f9c654", "#f9c654"] },
      { ds: "border/accent-yellow-soft", modes: ["#ffebbd", "#996816", "#ffebbd", "#996816", "#ffebbd", "#996816"] },
      { ds: "border/info-soft", modes: ["#51bffc", "#215477", "#51bffc", "#215477", "#51bffc", "#215477"] },
    ],
  },
  {
    group: "Shadow (shadow/)",
    tokens: [
      { ds: "shadow/default", modes: ["#1f233e0d", "#1f233e0d", "#1f233e0d", "#1f233e0d", "#1f233e0d", "#1f233e0d"] },
    ],
  },
];

const cssVar = (ds: string) => `--color-${ds.replace("/", "-")}`;

function Swatch({ ds, modes }: Token) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-sko-border-subtle p-2">
      <span
        className="h-12 w-12 shrink-0 rounded-md border border-sko-border-subtle"
        style={{ background: `var(${cssVar(ds)})` }}
      />
      <span className="min-w-0">
        <span className="sk-text-body-medium-semibold block text-sko-text-default">{ds}</span>
        <span className="sk-text-body-small-regular block text-sko-text-subtle">{cssVar(ds)}</span>
        <span className="mt-1 flex flex-wrap gap-1">
          {modes.map((hex, i) => (
            <span
              key={MODE_NAMES[i]}
              title={`${MODE_NAMES[i]} ${hex}`}
              className="h-3 w-3 rounded-sm border border-sko-border-subtle"
              style={{ background: hex }}
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
      {GROUPS.map((g) => (
        <section key={g.group}>
          <h2 className="sk-text-title-medium-semibold mb-3 text-sko-text-default">
            {g.group} · {g.tokens.length}
          </h2>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {g.tokens.map((t) => (
              <Swatch key={t.ds} {...t} />
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
