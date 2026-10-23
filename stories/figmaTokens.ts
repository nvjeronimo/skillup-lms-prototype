/**
 * The Foundations stories read the same file the CSS is generated from: tokens/figma/variables.json,
 * written by the "Publish tokens" plugin in the SKO DS. So Storybook can never show a value the DS
 * no longer has, and every token sync updates these pages with no edit here.
 */
import data from "../tokens/figma/variables.json";

export type FigmaVariable = {
  name: string;
  type: "COLOR" | "FLOAT" | "STRING";
  web: string | null;
  values: Record<string, string | number>;
  aliases?: Record<string, string>;
};
export type FigmaCollection = { name: string; modes: string[]; variables: FigmaVariable[] };
export type FigmaTextStyle = {
  name: string;
  fontFamily: string;
  fontStyle: string;
  fontSize: number;
  lineHeight: { unit: string; value: number } | "auto";
  letterSpacing: { unit: string; value: number };
  textCase: string;
  bound: Record<string, string>;
};

const tokens = data as unknown as { fileKey: string; collections: FigmaCollection[]; textStyles: FigmaTextStyle[] };

export const collection = (prefix: string): FigmaCollection => {
  const c = tokens.collections.find((x) => x.name.startsWith(prefix));
  if (!c) throw new Error(`No collection "${prefix}…" in tokens/figma/variables.json`);
  return c;
};
export const textStyles = tokens.textStyles;
export const figmaFileKey = tokens.fileKey;

/** The CSS custom property the generator writes for a colour token (scripts/tokens/build.mjs). */
export const colorVar = (v: FigmaVariable) =>
  v.web ? v.web.replace(/^var\((--[^)]+)\)$/, "$1") : `--color-${v.name.replace(/\//g, "-")}`;
