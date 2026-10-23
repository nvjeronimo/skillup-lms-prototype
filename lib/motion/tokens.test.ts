import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { MOTION_MS } from "./tokens";

// The values come from Figma (DS 3. Motion) through scripts/tokens/build.mjs since PR 306;
// tokens/motion.css keeps only the reduced-motion overrides.
const css = readFileSync(
  fileURLToPath(new URL("../../tokens/generated/motion.css", import.meta.url)),
  "utf8",
);
// The base :root block is the first one; the reduced-motion overrides come after it.
const root = css.slice(css.indexOf(":root"), css.indexOf("}", css.indexOf(":root")));

function declarations(prefix: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const m of root.matchAll(new RegExp(`--motion-${prefix}-([a-z0-9-]+):\\s*([^;]+);`, "g"))) {
    out[m[1]] = m[2].trim();
  }
  return out;
}

describe("motion tokens", () => {
  it("keeps MOTION_MS equal to the CSS durations", () => {
    const ms = Object.fromEntries(
      Object.entries(declarations("duration")).map(([k, v]) => [k, Number(v.replace("ms", ""))]),
    );
    expect(ms).toEqual(MOTION_MS);
  });

  it("has exactly the five easings and three distances, verbatim", () => {
    expect(declarations("easing")).toEqual({
      standard: "cubic-bezier(0.4, 0, 0.2, 1)",
      "standard-decelerate": "cubic-bezier(0.23, 1, 0.32, 1)",
      "standard-accelerate": "cubic-bezier(0.55, 0, 1, 0.45)",
      emphasized: "cubic-bezier(0.34, 1.3, 0.64, 1)",
      linear: "linear",
    });
    expect(declarations("distance")).toEqual({ nudge: "4px", enter: "8px", surface: "16px" });
  });

  it("overrides distances and long durations under both reduced-motion switches", () => {
    const override = `--motion-distance-nudge: 0px;`;
    expect(css).toMatch(/@media \(prefers-reduced-motion: reduce\)\s*\{\s*:root\s*\{/);
    expect(css).toMatch(/:root\[data-reduce-motion\]\s*\{/);
    expect(css.split(override).length - 1).toBe(2);
    expect(css.split("--motion-duration-medium2: 150ms;").length - 1).toBe(2);
    expect(css.split("--motion-duration-long2: 150ms;").length - 1).toBe(2);
  });
});
