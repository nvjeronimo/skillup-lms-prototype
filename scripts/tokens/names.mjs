/**
 * The one Figma → CSS name mapping. build.mjs takes every custom-property name from here, and the
 * "Publish tokens" audit uses tokenCssNames/cssNameOf to find which Figma variable a CSS name came
 * from. `data` has the shape of tokens/figma/variables.json.
 */

// Colours (collection "1.", type COLOR): the Web code syntax set in Figma; a token without one
// follows the same rule (DS "text/on-inverse" → --color-text-on-inverse).
export const colorName = (v) => (v.web ? v.web.replace(/^var\((--[^)]+)\)$/, "$1") : `--color-${v.name.replace(/\//g, "-")}`);
export const isColor = (v) => v.type === "COLOR";

// Responsive (collection "2.")
// The role tokens (Radius/control, Radius/card…), not the fixed-* scale they alias.
export const isRadius = (v) => /^Radius\/(?!fixed-)/.test(v.name);
export const radiusName = (v) => `--sk-radius-${v.name.split("/")[1]}`;

export const isSpacing = (v) => /^(Spacing|Container|Layout)\//.test(v.name);
export const spacingName = (v) => {
  const [group, key] = v.name.split("/");
  if (group === "Spacing") return `--sk-space-${key}`;
  if (group === "Layout") return `--sk-layout-${key}`;
  return `--sk-container-${key}`;
};

export const isType = (v) => /^Type\/(size|line-height)\//.test(v.name);
export const typeName = (v) => `--sk-type-${v.name.split("/")[1]}-${v.name.split("/")[2]}`;

// Motion (collection "3."): every variable.
export const motionName = (v) => (v.web ? v.web.replace(/^var\((--[^)]+)\)$/, "$1") : `--motion-${v.name.replace(/\//g, "-")}`);

const collection = (data, prefix) => data.collections.find((x) => x.name.startsWith(prefix));

export function tokenCssNames(data) {
  const out = [];
  const add = (c, vars, name) => {
    for (const v of vars) out.push({ figma: `${c.name}/${v.name}`, css: name(v) });
  };
  const colors = collection(data, "1.");
  if (colors) add(colors, colors.variables.filter(isColor), colorName);
  const responsive = collection(data, "2.");
  if (responsive) {
    add(responsive, responsive.variables.filter(isRadius), radiusName);
    add(responsive, responsive.variables.filter(isSpacing), spacingName);
    add(responsive, responsive.variables.filter(isType), typeName);
  }
  const motion = collection(data, "3.");
  if (motion) add(motion, motion.variables, motionName);
  return out;
}

export function cssNameOf(data) {
  const map = new Map();
  for (const { figma, css } of tokenCssNames(data)) {
    if (!map.has(figma)) map.set(figma, []);
    map.get(figma).push(css);
  }
  return map;
}
