import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { buildUsage, collectFiles, missingAgainst, scanCode, tailwindMap } from "./usage.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const FX = path.join(here, "__fixtures__/usage");
const json = (f) => JSON.parse(fs.readFileSync(path.join(FX, f), "utf8"));
const data = json("variables.json");
const tw = tailwindMap(fs.readFileSync(path.join(FX, "tailwind.config.ts"), "utf8"));
const scan = () => scanCode(collectFiles(FX), tw);
const files = (css) => [...(scan().used.get(css) ?? [])];

describe("tailwindMap", () => {
  it("joins nested keys after the section key, drops DEFAULT, keeps only var() strings", () => {
    expect(tw.get("sko-text-default")).toBe("--color-text-default");
    expect(tw.get("card")).toBe("--sk-radius-card");
    expect(tw.get("short2")).toBe("--motion-short2");
    expect(tw.has("big")).toBe(false);
    expect([...tw.keys()].some((k) => k === "" || k.includes("DEFAULT"))).toBe(false);
  });
});

describe("scanCode", () => {
  it("var() use is counted, with or without a fallback", () => {
    expect(files("--color-text-default")).toContain("components/Card.tsx");
  });
  it("tailwind class use is counted", () => {
    expect(files("--color-text-default")).toContain("app/page.tsx");
  });
  it("tailwind fragment needs a non-word character after it", () => {
    const s = scanCode([{ path: "a.tsx", text: "text-sko-text-default-extra" }], tw);
    expect(s.used.has("--color-text-default")).toBe(false);
  });
  it("dynamic var counts every token with the prefix", () => {
    expect(scan().dynamic).toContain("--sk-radius-");
    const u = buildUsage(data, scan(), "abc");
    expect(u.tokens["2. Responsive/Radius/card"].files).toBe(1);
    expect(u.tokens["2. Responsive/Radius/pill"].files).toBe(1);
  });
  it("hand-written tokens css counts as use", () => {
    expect(files("--color-bg-page")).toEqual(["tokens/skin-x.css"]);
  });
  it("generated css and figmaTokens.ts are not scanned", () => {
    expect(scan().used.has("--color-gen-only")).toBe(false);
    expect(scan().used.has("--color-fig-only")).toBe(false);
  });
});

describe("buildUsage", () => {
  it("has the format, every token, and the unused ones at 0 files", () => {
    const u = buildUsage(data, scan(), "abc");
    expect(u.format).toBe("skillup-token-usage/1");
    expect(u.commit).toBe("abc");
    expect(u.tokens["1. Colors/text/default"]).toEqual({ css: ["--color-text-default"], files: 3 });
    expect(u.tokens["1. Colors/bg/unused"].files).toBe(0);
  });
  it("unknownCss lists a var no token or hand-written file defines", () => {
    const withUnknown = scanCode(
      [...collectFiles(FX), { path: "app/old.tsx", text: 'x = "var(--color-undefined-thing)"' }],
      tw,
    );
    expect(buildUsage(data, withUnknown, "abc").unknownCss).toEqual(["--color-undefined-thing"]);
    expect(buildUsage(data, scan(), "abc").unknownCss).toEqual([]);
  });
});

describe("missingAgainst", () => {
  it("--against passes a rename that keeps the web name", () => {
    expect(missingAgainst(scan(), json("variables.renamed.json"), data)).toEqual([]);
  });
  it("--against reports a removed token with its files", () => {
    expect(missingAgainst(scan(), json("variables.removed.json"), data)).toEqual([
      { css: "--color-bg-page", files: ["tokens/skin-x.css"] },
    ]);
  });
});

describe("missingAgainst, removals", () => {
  it("a dynamic prefix reports each removed name, not the prefix", () => {
    expect(missingAgainst(scan(), json("variables.no-pill.json"), data)).toEqual([
      { css: "--sk-radius-pill", files: ["app/page.tsx"] },
    ]);
  });
  it("a token removed from Figma is reported even when a skin file declares it", () => {
    expect(fs.readFileSync(path.join(FX, "tokens/skin-x.css"), "utf8")).toContain("--color-bg-page:");
    expect(missingAgainst(scan(), json("variables.removed.json"), data).map((m) => m.css)).toContain("--color-bg-page");
  });
  it("a folder named generated outside tokens/ is scanned", () => {
    expect(files("--color-text-default")).toContain("app/generated/z.tsx");
  });
});

describe("local custom properties", () => {
  it("local custom property used in code is not reported by --against", () => {
    const s = scanCode([...collectFiles(FX), { path: "app/local.tsx", text: 'x = "var(--sk-halo-angle)"' }], tw);
    expect(missingAgainst(s, json("variables.removed.json"), data).map((m) => m.css)).toEqual(["--color-bg-page"]);
    expect(missingAgainst(s, data, data)).toEqual([]);
  });
});

describe("CLI --against", () => {
  const run = (vars, extra = []) => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "usage-"));
    const out = path.join(dir, "out");
    fs.writeFileSync(out, "");
    const r = spawnSync("node", [path.join(here, "usage.mjs"), "--root", FX, "--against", path.join(FX, vars), "--base", path.join(FX, "variables.json"), ...extra.map((x) => x.replace("$DIR", dir))], {
      env: { ...process.env, GITHUB_OUTPUT: out },
      encoding: "utf8",
    });
    return { r, out: fs.readFileSync(out, "utf8"), dir };
  };
  it("--against without --base exits 2", () => {
    const r = spawnSync("node", [path.join(here, "usage.mjs"), "--root", FX, "--against", path.join(FX, "variables.json")], { encoding: "utf8" });
    expect(r.status).toBe(2);
    expect(r.stderr).toContain("--base");
  });
  it("--against with no missing names writes blocked=false", () => {
    const { r, out } = run("variables.json");
    expect(r.status).toBe(0);
    expect(out).toContain("blocked=false");
  });
  it("--against with a removed token exits 0, writes blocked=true and the report", () => {
    const { r, out, dir } = run("variables.removed.json", ["--report", "$DIR/r.md"]);
    expect(r.status).toBe(0);
    expect(out).toContain("blocked=true");
    const md = fs.readFileSync(path.join(dir, "r.md"), "utf8");
    expect(md).toContain("--color-bg-page");
    expect(md).toContain("tokens/skin-x.css");
    expect(md).toContain("This pull request waits: merge it after the code no longer uses these tokens.");
  });
});
