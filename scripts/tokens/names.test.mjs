import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { cssNameOf, tokenCssNames } from "./names.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const data = JSON.parse(fs.readFileSync(path.join(root, "tokens/figma/variables.json"), "utf8"));

// Custom properties the build declares that do not come from a Figma variable.
const NOT_FROM_VARIABLES = [];

describe("tokenCssNames", () => {
  it("every custom property declared in tokens/generated comes from tokenCssNames", () => {
    const dir = path.join(root, "tokens/generated");
    const declared = new Set();
    for (const f of fs.readdirSync(dir).filter((x) => x.endsWith(".css"))) {
      for (const m of fs.readFileSync(path.join(dir, f), "utf8").matchAll(/^\s*(--[a-z0-9-]+):/gm)) declared.add(m[1]);
    }
    const expected = new Set([...tokenCssNames(data).map((e) => e.css), ...NOT_FROM_VARIABLES]);
    expect(declared).toEqual(expected);
  });

  it("colour name prefers web syntax", () => {
    const fixture = {
      collections: [
        {
          name: "1. SKO-Semantics",
          modes: ["SKO Light"],
          variables: [
            { name: "text/x", type: "COLOR", web: "var(--color-x)", values: {} },
            { name: "text/on-inverse", type: "COLOR", web: null, values: {} },
          ],
        },
      ],
    };
    expect(tokenCssNames(fixture)).toEqual([
      { figma: "1. SKO-Semantics/text/x", css: "--color-x", from: "web" },
      { figma: "1. SKO-Semantics/text/on-inverse", css: "--color-text-on-inverse", from: "name" },
    ]);
    expect(cssNameOf(fixture).get("1. SKO-Semantics/text/on-inverse")).toEqual(["--color-text-on-inverse"]);
  });

  it("from: web only where the CSS name came from the Web code syntax (colours, motion)", () => {
    const fixture = {
      collections: [
        {
          name: "2. Responsive",
          modes: ["Desktop"],
          variables: [
            { name: "Radius/card", type: "FLOAT", web: "var(--anything)", values: {} },
            { name: "Layout/gutter", type: "FLOAT", web: "var(--sk-layout-gutter)", values: {} },
          ],
        },
        {
          name: "3. Motion",
          modes: ["Value"],
          variables: [
            { name: "duration/short2", type: "FLOAT", web: "var(--motion-duration-short2)", values: {} },
            { name: "easing/x", type: "STRING", web: null, values: {} },
          ],
        },
      ],
    };
    expect(tokenCssNames(fixture).map((e) => [e.css, e.from])).toEqual([
      ["--sk-radius-card", "name"],
      ["--sk-layout-gutter", "name"],
      ["--motion-duration-short2", "web"],
      ["--motion-easing-x", "name"],
    ]);
  });
});
