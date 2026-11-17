import { describe, it, expect } from "vitest";
import vm from "node:vm";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const code = fs.readFileSync(path.join(path.dirname(fileURLToPath(import.meta.url)), "code.js"), "utf8");

const MODES = [{ modeId: "m1", name: "Light" }, { modeId: "m2", name: "Dark" }];

function col(over) {
  return { id: "c1", name: "1. Colour", modes: MODES, defaultModeId: "m1", hiddenFromPublishing: false, variableIds: [], getPublishStatusAsync: async () => "CURRENT", ...over };
}
function vr(over) {
  return {
    id: "v1",
    name: "color/x",
    variableCollectionId: "c1",
    resolvedType: "COLOR",
    valuesByMode: { m1: { r: 1, g: 0, b: 0 }, m2: { r: 0, g: 0, b: 0 } },
    codeSyntax: { WEB: "var(--color-x)" },
    description: "a token",
    scopes: ["FILL_COLOR"],
    getPublishStatusAsync: async () => "CURRENT",
    ...over,
  };
}

// Loads code.js in a vm with a fake figma. Returns the context and what the plugin posted.
async function load(cols, vars, extra = {}) {
  const posted = [];
  const holder = {};
  const figma = {
    fileKey: "KEY",
    currentUser: { name: "Tester" },
    showUI() {},
    closePlugin() {},
    ui: {
      postMessage: (m) => posted.push(m),
      set onmessage(fn) { holder.onmessage = fn; },
      get onmessage() { return holder.onmessage; },
    },
    clientStorage: { getAsync: async () => undefined, setAsync: async () => {} },
    variables: {
      getLocalVariableCollectionsAsync: async () => cols,
      getLocalVariablesAsync: async () => vars,
      getVariableByIdAsync: async (id) => vars.find((v) => v.id === id) || null,
    },
    getLocalTextStylesAsync: async () => [],
    ...extra,
  };
  const ctx = vm.createContext({ figma, __html__: "", console, setTimeout, clearTimeout, Promise });
  vm.runInContext(code, ctx);
  await new Promise((r) => setTimeout(r, 0));
  return { ctx, posted, send: (m) => holder.onmessage(m) };
}

const one = (over = {}, vover = {}) => {
  const v = vr(vover);
  const c = col({ variableIds: [v.id], ...over });
  return { cols: [c], vars: [v] };
};
const checks = (arr) => arr.map((f) => f.check);

describe("exportTokens", () => {
  it("keeps its shape for a healthy file, with an empty problems list", async () => {
    const { cols, vars } = one();
    const { ctx } = await load(cols, vars);
    const t = await ctx.exportTokens();
    expect(Object.keys(t)).toEqual(["format", "fileKey", "collections", "textStyles", "problems"]);
    expect(t.problems).toEqual([]);
    expect(t.collections[0].variables[0]).toEqual({ name: "color/x", type: "COLOR", web: "var(--color-x)", values: { Light: "#ff0000", Dark: "#000000" } });
  });

  it("survives a missing alias", async () => {
    const { cols, vars } = one({}, { valuesByMode: { m1: { type: "VARIABLE_ALIAS", id: "gone" }, m2: { r: 0, g: 0, b: 0 } } });
    const { ctx } = await load(cols, vars);
    const t = await ctx.exportTokens();
    expect(t.problems[0].check).toBe("alias-missing");
    expect(t.problems[0].mode).toBe("Light");
    expect(t.collections[0].variables[0].values.Light).toBeNull();
    expect(t.collections[0].variables[0].values.Dark).toBe("#000000");
  });

  it("the ready message carries problems, and the JSON does not", async () => {
    const { cols, vars } = one({}, { valuesByMode: { m1: { type: "VARIABLE_ALIAS", id: "gone" }, m2: { r: 0, g: 0, b: 0 } } });
    const { posted } = await load(cols, vars);
    const ready = posted.find((m) => m.type === "ready");
    expect(ready.problems[0].check).toBe("alias-missing");
    expect(JSON.parse(ready.json).problems).toBeUndefined();
  });
});

describe("auditTokens", () => {
  it("mode-missing is a publish blocker", async () => {
    const { cols, vars } = one({}, { valuesByMode: { m1: { r: 1, g: 0, b: 0 } } });
    const { ctx } = await load(cols, vars);
    const r = await ctx.auditTokens({});
    expect(checks(r.blockers)).toContain("mode-missing");
    expect(r.publishBlocked).toBe(true);
    expect(r.verdict).toBe("not-ready");
  });

  it("alias-missing is a publish blocker", async () => {
    const { cols, vars } = one({}, { valuesByMode: { m1: { type: "VARIABLE_ALIAS", id: "gone" }, m2: { r: 0, g: 0, b: 0 } } });
    const { ctx } = await load(cols, vars);
    const r = await ctx.auditTokens({});
    expect(checks(r.blockers)).toEqual(["alias-missing"]);
    expect(r.publishBlocked).toBe(true);
  });

  const FORMAT = "skillup-token-usage/1";
  const usageOld = { format: FORMAT, tokens: { "2. Responsive 📐/Radius/old": { css: ["--sk-radius-old"], files: 3, from: "name" } }, unknownCss: [] };

  it("used-gone is a blocker but not a publish blocker", async () => {
    const { cols, vars } = one();
    const { ctx } = await load(cols, vars);
    const r = await ctx.auditTokens({ usage: usageOld, usageFresh: true });
    expect(r.blockers).toHaveLength(1);
    expect(r.blockers[0]).toMatchObject({ check: "used-gone", collection: "2. Responsive 📐", name: "Radius/old", text: "used in code (3 files), gone from Figma" });
    expect(r.publishBlocked).toBe(false);
    expect(r.verdict).toBe("not-ready");
    expect(r.covered).toContain("code usage");
  });

  it("a collection rename with the same number prefix and variable name is not used-gone", async () => {
    const v = vr({ id: "r", name: "Radius/old", variableCollectionId: "c2", resolvedType: "FLOAT", valuesByMode: { m1: 4, m2: 4 }, codeSyntax: {} });
    const c = col({ id: "c2", name: "2. Responsive", variableIds: ["r"] });
    const { ctx } = await load([c], [v]);
    const r = await ctx.auditTokens({ usage: usageOld, usageFresh: true });
    expect(checks(r.blockers)).toEqual([]);
  });

  it("rename with same web syntax is not used-gone", async () => {
    const { cols, vars } = one({}, { name: "color/renamed", codeSyntax: { WEB: "var(--color-x)" } });
    const { ctx } = await load(cols, vars);
    const usage = { format: FORMAT, tokens: { "1. Colour/color/x": { css: ["--color-x"], files: 5, from: "web" } }, unknownCss: [] };
    const r = await ctx.auditTokens({ usage, usageFresh: true });
    expect(checks(r.blockers)).toEqual([]);
    expect(r.verdict).toBe("ready");
  });

  it("same name, web changed is used-gone (colour: the CSS name came from the Web syntax)", async () => {
    const { cols, vars } = one({}, { codeSyntax: { WEB: "var(--color-new)" } });
    const { ctx } = await load(cols, vars);
    const usage = { format: FORMAT, tokens: { "1. Colour/color/x": { css: ["--color-x"], files: 4, from: "web" } }, unknownCss: [] };
    const r = await ctx.auditTokens({ usage, usageFresh: true });
    expect(r.blockers).toHaveLength(1);
    expect(r.blockers[0]).toMatchObject({ check: "used-gone", collection: "1. Colour", name: "color/x" });
  });

  it("Layout rename with web kept is used-gone (the CSS name comes from the Figma name)", async () => {
    const v = vr({ id: "l", name: "Layout/gutter-new", variableCollectionId: "c2", resolvedType: "FLOAT", valuesByMode: { m1: 24, m2: 24 }, codeSyntax: { WEB: "var(--sk-layout-gutter)" } });
    const c = col({ id: "c2", name: "2. Responsive", variableIds: ["l"] });
    const { ctx } = await load([c], [v]);
    const usage = { format: FORMAT, tokens: { "2. Responsive/Layout/gutter": { css: ["--sk-layout-gutter"], files: 6, from: "name" } }, unknownCss: [] };
    const r = await ctx.auditTokens({ usage, usageFresh: true });
    expect(r.blockers).toHaveLength(1);
    expect(r.blockers[0]).toMatchObject({ check: "used-gone", collection: "2. Responsive", name: "Layout/gutter" });
  });

  it("a usage map in another format is not covered", async () => {
    const { cols, vars } = one();
    const { ctx } = await load(cols, vars);
    for (const format of [undefined, "skillup-token-usage/2"]) {
      const r = await ctx.auditTokens({ usage: { ...usageOld, format }, usageFresh: true });
      expect(r.notCovered).toContain("code usage");
      expect(r.covered).not.toContain("code usage");
      expect(checks(r.blockers)).toEqual([]);
    }
  });

  it("an entry with no files is not a finding", async () => {
    const { cols, vars } = one();
    const { ctx } = await load(cols, vars);
    const usage = { format: FORMAT, tokens: { "1. Colour/color/unused": { css: ["--color-unused"], files: 0, from: "web" } }, unknownCss: [] };
    const r = await ctx.auditTokens({ usage, usageFresh: true });
    expect(checks(r.blockers)).toEqual([]);
  });

  it("no usage map means not covered", async () => {
    const { cols, vars } = one();
    const { ctx } = await load(cols, vars);
    const r = await ctx.auditTokens({ usage: null, usageFresh: true });
    expect(r.notCovered).toContain("code usage");
    expect(r.covered).not.toContain("code usage");
    expect(checks(r.blockers)).not.toContain("used-gone");
  });

  it("a stale usage map means not covered", async () => {
    const { cols, vars } = one();
    const { ctx } = await load(cols, vars);
    const r = await ctx.auditTokens({ usage: usageOld, usageFresh: false });
    expect(r.notCovered).toContain("code usage");
    expect(checks(r.blockers)).not.toContain("used-gone");
  });

  it("unknownCss entries are warnings", async () => {
    const { cols, vars } = one();
    const { ctx } = await load(cols, vars);
    const r = await ctx.auditTokens({ usage: { format: FORMAT, tokens: {}, unknownCss: ["--sk-old-thing"] }, usageFresh: true });
    expect(r.warnings).toEqual([{ check: "unknown-css", collection: "", name: "--sk-old-thing", text: "used in code, but no token produces it" }]);
    expect(r.verdict).toBe("ready");
  });

  it("publish status timeout", async () => {
    const { cols, vars } = one({}, { getPublishStatusAsync: () => new Promise(() => {}) });
    const { ctx } = await load(cols, vars);
    const r = await ctx.auditTokens({ publishStatusTimeoutMs: 50 });
    expect(r.notCovered).toContain("library publish status");
    expect(checks(r.pending)).toEqual([]);
  });

  it("unpublished and changed variables are pending", async () => {
    const a = vr({ id: "a", name: "a", getPublishStatusAsync: async () => "UNPUBLISHED" });
    const b = vr({ id: "b", name: "b", getPublishStatusAsync: async () => "CHANGED" });
    const { ctx } = await load([col({ variableIds: ["a", "b"] })], [a, b]);
    const r = await ctx.auditTokens({});
    expect(r.pending.map((f) => f.name)).toEqual(["a", "b"]);
    expect(r.notCovered).not.toContain("library publish status");
    expect(r.verdict).toBe("ready");
  });

  it("no-web is a warning", async () => {
    const { cols, vars } = one({}, { codeSyntax: {} });
    const { ctx } = await load(cols, vars);
    const r = await ctx.auditTokens({});
    expect(r.warnings).toEqual([{ check: "no-web", collection: "1. Colour", name: "color/x", text: "no Web code syntax" }]);
    expect(r.blockers).toEqual([]);
  });

  it("ten modes is a warning (mode-cap)", async () => {
    const modes = Array.from({ length: 10 }, (_, i) => ({ modeId: "m" + i, name: "M" + i }));
    const { cols, vars } = one({ modes }, { valuesByMode: Object.fromEntries(modes.map((m) => [m.modeId, { r: 0, g: 0, b: 0 }])) });
    const { ctx } = await load(cols, vars);
    const r = await ctx.auditTokens({});
    expect(checks(r.warnings)).toEqual(["mode-cap"]);
  });

  it("ALL_SCOPES is a warning", async () => {
    const { cols, vars } = one({}, { scopes: ["ALL_SCOPES"] });
    const { ctx } = await load(cols, vars);
    const r = await ctx.auditTokens({});
    expect(checks(r.warnings)).toEqual(["all-scopes"]);
  });

  it("missing description is a warning", async () => {
    const { cols, vars } = one({}, { description: "" });
    const { ctx } = await load(cols, vars);
    const r = await ctx.auditTokens({});
    expect(checks(r.warnings)).toEqual(["no-description"]);
  });

  it("an unaliased variable in a hidden collection is a suggestion", async () => {
    const used = vr({ id: "p1", name: "blue/500", variableCollectionId: "h" });
    const unused = vr({ id: "p2", name: "blue/900", variableCollectionId: "h" });
    const alias = vr({ id: "t", name: "color/y", valuesByMode: { m1: { type: "VARIABLE_ALIAS", id: "p1" }, m2: { type: "VARIABLE_ALIAS", id: "p1" } } });
    const hidden = col({ id: "h", name: "0. Primitives", hiddenFromPublishing: true, variableIds: ["p1", "p2"] });
    const { ctx } = await load([hidden, col({ variableIds: ["t"] })], [used, unused, alias]);
    const r = await ctx.auditTokens({});
    expect(r.suggestions.map((f) => f.name)).toEqual(["blue/900"]);
    expect(r.warnings).toEqual([]);
  });

  it("an unpublished collection is one pending finding named after the collection", async () => {
    const { cols, vars } = one({ getPublishStatusAsync: async () => "UNPUBLISHED" });
    const { ctx } = await load(cols, vars);
    const r = await ctx.auditTokens({});
    expect(r.pending).toHaveLength(1);
    expect(r.pending[0]).toMatchObject({ check: "unpublished", collection: "1. Colour", name: "1. Colour" });
  });

  it("an alias cycle does not stop the plugin and blocks publishing", async () => {
    const cyc = (id, to) => vr({ id, name: id, valuesByMode: { m1: { type: "VARIABLE_ALIAS", id: to }, m2: { type: "VARIABLE_ALIAS", id: to } } });
    const cols = [col({ variableIds: ["a", "b"] })];
    const vars = [cyc("a", "b"), cyc("b", "a")];
    const { ctx, posted } = await load(cols, vars);
    expect(posted.some((m) => m.type === "ready")).toBe(true);
    const t = await ctx.exportTokens();
    expect(checks(t.problems)).toContain("alias-missing");
    expect(t.problems[0].text).toMatch(/alias loop/);
    const r = await ctx.auditTokens({});
    expect(r.publishBlocked).toBe(true);
  });

  it("a failing audit posts audit-error, not error", async () => {
    const { cols, vars } = one();
    const { posted, send } = await load(cols, vars);
    posted.length = 0;
    await send({ type: "audit", usage: { format: "skillup-token-usage/1", tokens: null, unknownCss: 5 }, usageFresh: true });
    const types = posted.map((m) => m.type);
    expect(types).toContain("audit-error");
    expect(types).not.toContain("error");
  });

  it("a colour that gains a Web syntax with another name is used-gone (the CSS name changes)", async () => {
    const { cols, vars } = one({}, { codeSyntax: { WEB: "var(--color-y)" } });
    const { ctx } = await load(cols, vars);
    const usage = { format: FORMAT, tokens: { "1. Colour/color/x": { css: ["--color-x"], files: 2, from: "name" } }, unknownCss: [] };
    const r = await ctx.auditTokens({ usage, usageFresh: true });
    expect(r.blockers).toHaveLength(1);
    expect(r.blockers[0]).toMatchObject({ check: "used-gone", collection: "1. Colour", name: "color/x" });
  });

  it("a colour that loses its Web syntax but derives the same CSS name is not used-gone", async () => {
    // "text/x" without Web syntax derives --color-text-x, the name its old syntax gave.
    const { cols, vars } = one({}, { name: "text/x", codeSyntax: {} });
    const { ctx } = await load(cols, vars);
    const usage = { format: FORMAT, tokens: { "1. Colour/text/x": { css: ["--color-text-x"], files: 2, from: "web" } }, unknownCss: [] };
    const r = await ctx.auditTokens({ usage, usageFresh: true });
    expect(checks(r.blockers)).toEqual([]);
  });

  it("web syntax only in a hidden collection does not save a used token", async () => {
    const h = vr({ id: "p", name: "prim", variableCollectionId: "h", codeSyntax: { WEB: "var(--color-x)" } });
    const hidden = col({ id: "h", name: "0. Primitives", hiddenFromPublishing: true, variableIds: ["p"] });
    const { ctx } = await load([hidden], [h]);
    const usage = { format: FORMAT, tokens: { "1. Colour/color/x": { css: ["--color-x"], files: 2, from: "web" } }, unknownCss: [] };
    const r = await ctx.auditTokens({ usage, usageFresh: true });
    expect(checks(r.blockers)).toEqual(["used-gone"]);
  });

  it("verdict ready when no blockers", async () => {
    const { cols, vars } = one();
    const { ctx } = await load(cols, vars);
    const r = await ctx.auditTokens({});
    expect(r.verdict).toBe("ready");
    expect(r.covered).toContain("tokens");
    expect(r.notCovered).toContain("layers, components, docs");
    expect(r.publishBlocked).toBe(false);
  });

  it("reports progress per collection and honours cancel", async () => {
    const { cols, vars } = one();
    const { ctx } = await load(cols, vars);
    const seen = [];
    await ctx.auditTokens({ onProgress: (d, t) => seen.push([d, t]) });
    expect(seen).toEqual([[1, 1]]);
    const r = await ctx.auditTokens({ isCancelled: () => true });
    expect(r.notCovered).toEqual(["cancelled"]);
  });

  it("the audit message replies with progress then a result", async () => {
    const { cols, vars } = one();
    const { posted, send } = await load(cols, vars);
    posted.length = 0;
    await send({ type: "audit", usage: null, usageFresh: false });
    expect(posted.map((m) => m.type)).toEqual(["audit-progress", "audit-result"]);
    expect(posted[1].report.verdict).toBe("ready");
  });
});

describe("tokenCssNames in the plugin", () => {
  it("gives the same CSS names as scripts/tokens/names.mjs for the committed variables.json", async () => {
    const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
    const data = JSON.parse(fs.readFileSync(path.join(root, "tokens/figma/variables.json"), "utf8"));
    const { tokenCssNames } = await import(path.join(root, "scripts/tokens/names.mjs"));
    const { ctx } = await load([], []);
    const fromPlugin = JSON.parse(JSON.stringify(ctx.tokenCssNames(data))).map(({ figma, css }) => ({ figma, css }));
    const fromBuild = tokenCssNames(data).map(({ figma, css }) => ({ figma, css }));
    expect(fromBuild.length).toBeGreaterThan(50);
    expect(fromPlugin).toEqual(fromBuild);
  });
});
