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
      { figma: "1. SKO-Semantics/text/x", css: "--color-x" },
      { figma: "1. SKO-Semantics/text/on-inverse", css: "--color-text-on-inverse" },
    ]);
    expect(cssNameOf(fixture).get("1. SKO-Semantics/text/on-inverse")).toEqual(["--color-text-on-inverse"]);
  });
});
