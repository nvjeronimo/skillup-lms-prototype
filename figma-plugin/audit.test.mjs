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
    mixed: Symbol("mixed"),
    currentUser: { name: "Tester" },
    showUI() {},
    closePlugin() {},
    on(type, fn) { (holder.handlers ||= {})[type] = fn; },
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
      getVariableCollectionByIdAsync: async (id) => cols.find((c) => c.id === id) || null,
    },
    getStyleByIdAsync: async () => null,
    getLocalTextStylesAsync: async () => [],
    root: { name: "Doc", children: [{ id: "0:1", name: "Page 1" }] },
    currentPage: { id: "0:1", name: "Page 1" },
    ...extra,
  };
  const ctx = vm.createContext({ figma, __html__: "", console, setTimeout, clearTimeout, Promise });
  vm.runInContext(code, ctx);
  await new Promise((r) => setTimeout(r, 0));
  return { ctx, posted, holder, send: (m) => holder.onmessage(m) };
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
    const { posted, send } = await load(cols, vars, { fileKey: "c7EUDrQwP8si08aPipDSIV" });
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
    expect(r.notCovered).toContain("components, docs");
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
    const p1 = { id: "0:1", name: "Page 1", children: [], loadAsync: async () => {} };
    const { posted, send } = await load(cols, vars, { fileKey: "c7EUDrQwP8si08aPipDSIV", root: { name: "Doc", children: [p1] }, currentPage: p1 });
    posted.length = 0;
    await send({ type: "audit", usage: null, usageFresh: false });
    expect(posted.map((m) => m.type + ":" + m.phase)).toEqual(["audit-progress:tokens", "audit-progress:layers", "audit-progress:checks", "audit-result:undefined"]);
    expect(posted[3].report.verdict).toBe("ready");
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

const pg = (names) => names.map((name, i) => ({ id: "p" + i, name }));

describe("fileRole", () => {
  it("is library in the DS file", async () => {
    const { ctx } = await load([], []);
    expect(ctx.fileRole("c7EUDrQwP8si08aPipDSIV", [])).toBe("library");
  });
  it("is screens in the ICP even with local collections", async () => {
    const { ctx } = await load([], []);
    expect(ctx.fileRole("Wz2TCYFVr0hD8tJNiLajLt", [col()])).toBe("screens");
  });
  it("with no file key, a local exported collection starting 1. SKO-Semantics means library", async () => {
    const { ctx } = await load([], []);
    expect(ctx.fileRole(null, [col({ name: "1. SKO-Semantics \ud83c\udfa8" })])).toBe("library");
    expect(ctx.fileRole(null, [col({ name: "1. SKO-Semantics \ud83c\udfa8", hiddenFromPublishing: true })])).toBe("screens");
    expect(ctx.fileRole(null, [col({ name: "Other" })])).toBe("screens");
    expect(ctx.fileRole(null, [col({ name: "Courses Type" })])).toBe("screens");
  });
});

describe("fileRole: the Mobile App orphan", () => {
  it("a null-key file with an orphan 1. Semantics collection is screens", async () => {
    const { ctx } = await load([], []);
    expect(ctx.fileRole(null, [col({ name: "1. Semantics" })])).toBe("screens");
  });
});

describe("defaultExcludedPages", () => {
  it("excludes the ICP discovery group by its divider", async () => {
    const { ctx } = await load([], []);
    const pages = pg(["Cover", "---", "READY FOR DEV \u2705", "Platform Pages - Ready for Dev \ud83d\udfe2", "---", "DISCOVERY - NelsonJ. \u2014\u2014\u2014", "New Flow - V1", "V6 - Full Pages", "---", "ARCHIVE \u2014\u2014\u2014", "Navdeep"]);
    const ids = ctx.defaultExcludedPages("screens", pages);
    expect(Array.from(ids)).toEqual(["p0", "p5", "p6", "p7", "p9", "p10"]);
  });
  it("in the library excludes In review, archive, cover and start here by name", async () => {
    const { ctx } = await load([], []);
    const pages = pg(["Start here", "Cover", "Button", "In review", "Archive", "Arquivo 2020", "Buttons"]);
    expect(Array.from(ctx.defaultExcludedPages("library", pages))).toEqual(["p0", "p1", "p3", "p4", "p5"]);
  });
  it("a Discovery review page inside a group is neither excluded nor a divider", async () => {
    const { ctx } = await load([], []);
    const pages = pg(["READY FOR REVIEW \ud83d\udfe0", "       \u21b3 Topic Content Types Discovery \u2014 Ready for Review \ud83d\udfe0", "---", "Next page", "Cover", "ARCHIVE \u2014\u2014\u2014", "Old"]);
    expect(Array.from(ctx.defaultExcludedPages("screens", pages))).toEqual(["p4", "p5", "p6"]);
  });
  it("a library page named Discovery is not excluded", async () => {
    const { ctx } = await load([], []);
    expect(Array.from(ctx.defaultExcludedPages("library", pg(["Discovery", "Cover", "ARCHIVE \u2014\u2014\u2014"])))).toEqual(["p1", "p2"]);
  });
  it("screens also exclude history by name", async () => {
    const { ctx } = await load([], []);
    expect(Array.from(ctx.defaultExcludedPages("screens", pg(["Home", "History", "Hist\u00f3rico"])))).toEqual(["p1", "p2"]);
  });
});

describe("audit settings", () => {
  it("keys by file key, else by document name", async () => {
    const a = await load([], []);
    expect(a.ctx.auditSettingsKey()).toBe("skillup-publish-tokens/audit/KEY");
    const b = await load([], [], { fileKey: null, root: { name: "My doc", children: [] } });
    expect(b.ctx.auditSettingsKey()).toBe("skillup-publish-tokens/audit/My doc");
  });
  it("the ready message carries role, pages and default audit settings", async () => {
    const root = { name: "ICP", children: pg(["Cover", "Home"]) };
    const { posted } = await load([], [], { fileKey: "Wz2TCYFVr0hD8tJNiLajLt", root, currentPage: root.children[1] });
    const ready = posted.find((m) => m.type === "ready");
    expect(ready.role).toBe("screens");
    expect(ready.pages).toEqual([{ id: "p0", name: "Cover" }, { id: "p1", name: "Home" }]);
    expect(ready.auditSettings).toEqual({ scope: "ready", pageIds: ["p1"], excludedPageIds: ["p0"] });
  });
  it("library default scope is file, and a stored value wins", async () => {
    const lib = await load([], [], { fileKey: "c7EUDrQwP8si08aPipDSIV" });
    expect(lib.posted.find((m) => m.type === "ready").auditSettings.scope).toBe("file");
    const stored = { scope: "pages", pageIds: ["0:1"], excludedPageIds: [] };
    const s = await load([], [], { clientStorage: { getAsync: async (k) => (k === "skillup-publish-tokens/audit/KEY" ? stored : undefined), setAsync: async () => {} } });
    expect(s.posted.find((m) => m.type === "ready").auditSettings).toEqual(stored);
  });
});

// ---- fake-tree builders for the walker ----
let nid = 0;
function mk(type, over, children) {
  const n = { id: `n${++nid}`, type, name: over && over.name ? over.name : `${type}${nid}`, visible: true, children: children || [], ...over };
  if (type === "INSTANCE" && !over.children) n.children = over.kids || [];
  n.children.forEach((c) => { c.parent = n; });
  return n;
}
const frame = (over, children) => mk("FRAME", over || {}, children);
const section = (over, children) => mk("SECTION", over || {}, children);
const component = (over, children) => mk("COMPONENT", over || {}, children);
const componentSet = (over, children) => mk("COMPONENT_SET", over || {}, children);
const instance = (over) => mk("INSTANCE", over || {});
const text = (over) => mk("TEXT", over || {});
function page(name, children, loaded) {
  const p = mk("PAGE", { name }, children);
  p.loadAsync = async () => { (loaded || []).push(p.id); };
  return p;
}
async function walk(pages, opts, role = "screens", selection = []) {
  const root = { name: "Doc", children: pages };
  const { ctx } = await load([], [], { root, currentPage: pages[0], ...(selection.length ? {} : {}) });
  root.children.forEach((p) => { p.parent = root; });
  if (selection.length) ctx.figma.currentPage.selection = selection;
  const seen = [];
  const r = await ctx.walkScope({ role, scope: "file", pageIds: [], excludedPageIds: [], onNode: (n, c) => seen.push({ n, c }), isCancelled: () => false, ...opts });
  return { r, seen, ids: seen.map((s) => s.n.id) };
}

describe("walkScope", () => {
  it("stops at instances", async () => {
    const inner = text({});
    const inst = instance({ kids: [inner] });
    const fr = frame({}, [inst, text({})]);
    const { ids } = await walk([page("P", [fr])], {});
    expect(ids).toContain(fr.id);
    expect(ids).not.toContain(inst.id);
    expect(ids).not.toContain(inner.id);
    expect(ids.length).toBe(2);
  });
  it("library role walks components only", async () => {
    const doc = frame({}, [text({})]);
    const v = component({}, [text({})]);
    const set = componentSet({}, [v]);
    const { ids } = await walk([page("P", [doc, set])], {}, "library");
    expect(ids.sort()).toEqual([set.id, v.id, v.children[0].id].sort());
  });
  it("library walks hidden layers; screens skips and counts them", async () => {
    const hidden = frame({ visible: false }, [text({})]);
    const v = component({ visible: false }, []);
    const lib = await walk([page("P", [componentSet({}, [v])])], {}, "library");
    expect(lib.ids).toContain(v.id);
    expect(lib.r.hiddenSkipped).toBe(0);
    const scr = await walk([page("P", [frame({}, [hidden]), text({})])], {});
    expect(scr.ids).not.toContain(hidden.id);
    expect(scr.ids).not.toContain(hidden.children[0].id);
    expect(scr.r.hiddenSkipped).toBe(1);
  });
  it("[audit:skip] components are left out and counted", async () => {
    const skipped = component({ description: "old [audit:skip]" }, [text({})]);
    const ok = component({}, []);
    const { r, ids } = await walk([page("P", [skipped, ok])], {}, "library");
    expect(r.componentsLeftOut).toBe(1);
    expect(ids).toEqual([ok.id]);
  });
  it("excluded pages are not loaded", async () => {
    const loaded = [];
    const a = page("A", [frame({}, [])], loaded);
    const b = page("B", [frame({}, [])], loaded);
    const { r } = await walk([a, b], { excludedPageIds: [b.id] });
    expect(loaded).toEqual([a.id]);
    expect(r.pagesLeftOut).toBe(1);
  });
  it("scope pages walks only pageIds minus excluded", async () => {
    const a = page("A", [frame({}, [])]);
    const b = page("B", [frame({}, [])]);
    const c = page("C", [frame({}, [])]);
    const { seen } = await walk([a, b, c], { scope: "pages", pageIds: [a.id, b.id], excludedPageIds: [b.id] });
    expect(seen.map((s) => s.c.page.id)).toEqual([a.id]);
  });
  it("ready scope visits only marked subtrees and ctx.ready is true there", async () => {
    const marked = frame({ devStatus: { type: "READY_FOR_DEV" } }, [text({})]);
    const plain = frame({}, [text({})]);
    const { seen, ids } = await walk([page("P", [marked, plain])], { scope: "ready" });
    expect(ids.sort()).toEqual([marked.id, marked.children[0].id].sort());
    expect(seen.every((s) => s.c.ready === true)).toBe(true);
    expect(seen[0].c.top).toEqual({ id: marked.id, name: marked.name });
  });
  it("ready flag is inherited from a marked section; computed in other scopes", async () => {
    const inner = frame({}, [text({})]);
    const sec = section({ devStatus: { type: "READY_FOR_DEV" } }, [inner]);
    const other = frame({}, []);
    const rd = await walk([page("P", [sec])], { scope: "ready" });
    expect(rd.ids).toContain(inner.id);
    const all = await walk([page("P", [sec, other])], {});
    expect(all.seen.find((s) => s.n.id === inner.id).c.ready).toBe(true);
    expect(all.seen.find((s) => s.n.id === other.id).c.ready).toBe(false);
    expect(all.seen.find((s) => s.n.id === inner.id).c.top.id).toBe(sec.id);
  });
  it("selection walks the selection, top is the page child", async () => {
    const leaf = text({});
    const fr = frame({}, [leaf]);
    const pg = page("P", [fr, frame({}, [])]);
    const { seen } = await walk([pg], { scope: "selection" }, "screens", [leaf]);
    expect(seen.map((s) => s.n.id)).toEqual([leaf.id]);
    expect(seen[0].c.top.id).toBe(fr.id);
    expect(seen[0].c.page.id).toBe(pg.id);
  });
  it("onUse sees excluded pages, doc frames and skipped components; onNode does not", async () => {
    const skipped = component({ description: "[audit:skip]" }, [text({})]);
    const doc = frame({}, [text({})]);
    const set = componentSet({}, [component({}, [])]);
    const inst = instance({ kids: [text({})] });
    const ex = page("Ex", [frame({}, [text({})])]);
    const main = page("Main", [skipped, doc, set, inst]);
    const used = [];
    const { ids } = await walk([main, ex], { excludedPageIds: [ex.id], onUse: (n) => used.push(n.id) }, "library");
    const all = [skipped, skipped.children[0], doc, doc.children[0], ex.children[0], ex.children[0].children[0]].map((n) => n.id);
    all.forEach((id) => expect(used).toContain(id));
    expect(used).not.toContain(inst.children[0].id);
    expect(ids).not.toContain(skipped.id);
    expect(ids).not.toContain(doc.id);
    expect(ids).not.toContain(ex.children[0].id);
  });
  it("yields every 500 nodes and stops on cancel", async () => {
    const kids = Array.from({ length: 1200 }, () => text({}));
    const pg = page("P", [frame({}, kids)]);
    let polls = 0;
    const { r } = await walk([pg], { isCancelled: () => ++polls > 0 });
    expect(r.cancelled).toBe(true);
    expect(r.walked).toBeLessThanOrEqual(500);
    expect(polls).toBe(1);
  });
  it("reports progress and finishes uncancelled", async () => {
    const prog = [];
    const { r } = await walk([page("A", [frame({}, [])]), page("B", [frame({}, [])])], { onProgress: (p) => prog.push(p) });
    expect(r.cancelled).toBe(false);
    expect(r.walked).toBe(2);
    expect(prog[0]).toMatchObject({ page: 1, pages: 2 });
    expect(prog.at(-1).pages).toBe(2);
  });
});

describe("layerChecks", () => {
  const CTX = { page: { id: "0:1", name: "Page 1" }, top: { id: "9:9", name: "Card" }, ready: true };
  const solid = (r, g, b, over) => ({ type: "SOLID", color: { r, g, b }, ...over });
  async function run(node, vars = [], ctxOver = {}) {
    const { ctx } = await load([], vars);
    const out = await ctx.layerChecks(node, { ...CTX, ...ctxOver }, ctx.getVarSafe);
    return { out, ctx };
  }
  const props = (out, check) => out.filter((f) => f.check === check).map((f) => f.property);

  it("fills the finding shape", async () => {
    const n = frame({ name: "Box", fills: [solid(1, 0, 0)], strokes: [] });
    const { out } = await run(n);
    expect(out).toEqual([{ check: "hand-colour", nodeId: n.id, layer: "Box", property: "fill", value: "#ff0000", page: "Page 1", pageId: "0:1", top: "Card", topId: "9:9", ready: true }]);
  });

  it("getVarSafe returns null for a missing or throwing lookup", async () => {
    const { ctx } = await load([], [vr({ id: "v1" })], {});
    expect((await ctx.getVarSafe("v1")).id).toBe("v1");
    expect(await ctx.getVarSafe("nope")).toBeNull();
    const { ctx: c2 } = await load([], [], { variables: { getVariableByIdAsync: async () => { throw new Error("no library"); } } });
    expect(await c2.getVarSafe("x")).toBeNull();
  });

  it("a bound variable that resolves to null is binding-missing", async () => {
    const n = frame({ layoutMode: "HORIZONTAL", paddingTop: 8, boundVariables: { paddingTop: { type: "VARIABLE_ALIAS", id: "gone" } } });
    const { out } = await run(n);
    expect(out).toHaveLength(1);
    expect(out[0]).toMatchObject({ check: "binding-missing", property: "padding-top", value: "gone" });
  });

  it("one whose lookup throws is binding-missing", async () => {
    const n = frame({ fills: [solid(0, 0, 0, { boundVariables: { color: { type: "VARIABLE_ALIAS", id: "lib1" } } })] });
    const { ctx } = await load([], [], { variables: { getVariableByIdAsync: async () => { throw new Error("library not available"); } } });
    const out = await ctx.layerChecks(n, CTX, ctx.getVarSafe);
    expect(out.map((f) => [f.check, f.property, f.value])).toEqual([["binding-missing", "fill", "lib1"]]);
  });

  it("bound ids that resolve are fine: fills array, strokes array, paint colour, scalars", async () => {
    const v = vr({ id: "v1" });
    const al = { type: "VARIABLE_ALIAS", id: "v1" };
    const n = frame({
      fills: [solid(1, 1, 1), solid(0, 0, 0, { boundVariables: { color: al } })],
      strokes: [solid(0, 0, 0)], strokeWeight: 2,
      layoutMode: "VERTICAL", itemSpacing: 4, paddingLeft: 4,
      boundVariables: { fills: [al], strokes: [al], strokeWeight: al, itemSpacing: al, paddingLeft: al },
    });
    const { out } = await run(n, [v]);
    expect(out).toEqual([]);
  });

  it("an unbound visible SOLID fill is hand-colour with the hex", async () => {
    const { out } = await run(frame({ fills: [solid(0.2, 0.4, 1)], strokes: [solid(0, 0, 0)], strokeWeight: 0 }));
    expect(out.map((f) => [f.check, f.property, f.value])).toEqual([["hand-colour", "fill", "#3366ff"], ["hand-colour", "stroke", "#000000"]]);
  });

  it("an invisible paint or opacity 0 is not; a gradient is not; mixed fills do not crash", async () => {
    const n = frame({ fills: [solid(1, 0, 0, { visible: false }), solid(1, 0, 0, { opacity: 0 }), { type: "GRADIENT_LINEAR" }, { type: "IMAGE" }] });
    expect((await run(n)).out).toEqual([]);
    const { ctx } = await load([], []);
    const m = text({ fills: ctx.figma.mixed, textStyleId: "s1" });
    expect(await ctx.layerChecks(m, CTX, ctx.getVarSafe)).toEqual([]);
  });

  it("padding 0 is not hand-spacing; padding 12 unbound is", async () => {
    const { out } = await run(frame({ layoutMode: "HORIZONTAL", paddingTop: 0, paddingRight: 12, paddingBottom: 0, paddingLeft: 12, itemSpacing: 0 }));
    expect(props(out, "hand-spacing")).toEqual(["padding-right", "padding-left"]);
    expect(out[0].value).toBe(12);
  });

  it("gap only when layoutMode is not NONE; counter-gap only when wrapping", async () => {
    expect((await run(frame({ layoutMode: "NONE", paddingTop: 8, itemSpacing: 8 }))).out).toEqual([]);
    const a = await run(frame({ layoutMode: "HORIZONTAL", itemSpacing: 8, counterAxisSpacing: 6, layoutWrap: "NO_WRAP" }));
    expect(props(a.out, "hand-spacing")).toEqual(["gap"]);
    const b = await run(frame({ layoutMode: "HORIZONTAL", itemSpacing: 8, counterAxisSpacing: 6, layoutWrap: "WRAP" }));
    expect(props(b.out, "hand-spacing")).toEqual(["gap", "counter-gap"]);
    const c = await run(frame({ layoutMode: "HORIZONTAL", layoutWrap: "WRAP", counterAxisSpacing: null }));
    expect(c.out).toEqual([]);
  });

  it("uniform radius unbound is hand-radius; bound on four corners is not; 0 is not", async () => {
    expect(props((await run(frame({ cornerRadius: 8 }))).out, "hand-radius")).toEqual(["radius"]);
    expect((await run(frame({ cornerRadius: 0 }))).out).toEqual([]);
    const al = { type: "VARIABLE_ALIAS", id: "v1" };
    const bound = frame({ cornerRadius: 8, boundVariables: { topLeftRadius: al, topRightRadius: al, bottomLeftRadius: al, bottomRightRadius: al } });
    expect((await run(bound, [vr({ id: "v1" })])).out).toEqual([]);
  });

  it("radius mixed reports each unbound non-zero corner", async () => {
    const { ctx } = await load([], []);
    const al = { type: "VARIABLE_ALIAS", id: "v1" };
    const n = frame({ cornerRadius: ctx.figma.mixed, topLeftRadius: 8, topRightRadius: 0, bottomLeftRadius: 4, bottomRightRadius: 6, boundVariables: { bottomRightRadius: al } });
    const out = await ctx.layerChecks(n, CTX, async (id) => (id === "v1" ? { id } : null));
    expect(out.map((f) => [f.check, f.property, f.value])).toEqual([["hand-radius", "radius-top-left", 8], ["hand-radius", "radius-bottom-left", 4]]);
  });

  it("stroke weight unbound only when a visible stroke exists", async () => {
    const bound = { type: "VARIABLE_ALIAS", id: "v1" };
    const paint = solid(0, 0, 0, { boundVariables: { color: bound } });
    const withStroke = frame({ strokes: [paint], strokeWeight: 2 });
    expect(props((await run(withStroke, [vr({ id: "v1" })])).out, "hand-stroke")).toEqual(["stroke-weight"]);
    expect((await run(frame({ strokes: [], strokeWeight: 2 }))).out).toEqual([]);
    expect((await run(frame({ strokes: [{ ...paint, visible: false }], strokeWeight: 2 }), [vr({ id: "v1" })])).out).toEqual([]);
    expect((await run(frame({ strokes: [paint], strokeWeight: 0 }), [vr({ id: "v1" })])).out).toEqual([]);
  });

  it("mixed stroke weight reports each unbound non-zero side", async () => {
    const { ctx } = await load([], []);
    const n = frame({ strokes: [solid(0, 0, 0, { boundVariables: { color: { type: "VARIABLE_ALIAS", id: "v1" } } })], strokeWeight: ctx.figma.mixed, strokeTopWeight: 0, strokeBottomWeight: 2, strokeLeftWeight: 0, strokeRightWeight: 0 });
    const out = await ctx.layerChecks(n, CTX, async () => ({}));
    expect(out.map((f) => [f.property, f.value])).toEqual([["stroke-weight", 2]]);
  });

  it("text without a style is no-text-style with a font summary", async () => {
    const t = text({ textStyleId: "", fontName: { family: "Inter", style: "Semi Bold" }, fontSize: 16, lineHeight: { unit: "PIXELS", value: 24 }, fills: [] });
    expect((await run(t)).out.map((f) => [f.check, f.property, f.value])).toEqual([["no-text-style", "text-style", "Inter Semi Bold 16/24"]]);
    const auto = text({ textStyleId: "", fontName: { family: "Inter", style: "Regular" }, fontSize: 14, lineHeight: { unit: "AUTO" }, fills: [] });
    expect((await run(auto)).out[0].value).toBe("Inter Regular 14/auto");
    const pct = text({ textStyleId: "", fontName: { family: "Inter", style: "Regular" }, fontSize: 14, lineHeight: { unit: "PERCENT", value: 150 }, fills: [] });
    expect((await run(pct)).out[0].value).toBe("Inter Regular 14/150%");
    expect((await run(text({ textStyleId: "S:1", fills: [] }))).out).toEqual([]);
  });

  it("mixed textStyleId reports each unstyled segment once", async () => {
    const { ctx } = await load([], []);
    const seg = (start, end, id, size) => ({ start, end, characters: "x", textStyleId: id, fontName: { family: "Inter", style: "Regular" }, fontSize: size, lineHeight: { unit: "PIXELS", value: size + 8 } });
    const t = text({ textStyleId: ctx.figma.mixed, fills: [], getStyledTextSegments: () => [seg(0, 3, "S:1", 12), seg(3, 6, "", 16), seg(6, 9, "S:2", 12), seg(9, 12, "", 20)] });
    const out = await ctx.layerChecks(t, CTX, ctx.getVarSafe);
    expect(out.map((f) => [f.check, f.value])).toEqual([["no-text-style", "Inter Regular 16/24"], ["no-text-style", "Inter Regular 20/28"]]);
  });

  it("a bound paint (paint.boundVariables.color) and a bound padding are not findings", async () => {
    const al = { type: "VARIABLE_ALIAS", id: "v1" };
    const n = frame({ fills: [solid(1, 0, 0, { boundVariables: { color: al } })], layoutMode: "VERTICAL", paddingTop: 12, boundVariables: { paddingTop: al } });
    expect((await run(n, [vr({ id: "v1" })])).out).toEqual([]);
  });

  it("mixed fills on text use the segments: one hand-colour per distinct hex, bound and invisible skipped", async () => {
    const { ctx } = await load([], []);
    const al = { type: "VARIABLE_ALIAS", id: "v1" };
    const t = text({
      textStyleId: "S:1", fills: ctx.figma.mixed,
      getStyledTextSegments: (f) => {
        expect(f).toEqual(["fills"]);
        return [
          { fills: [solid(1, 0, 0)] },
          { fills: [solid(1, 0, 0)] },
          { fills: [solid(0, 0, 1, { boundVariables: { color: al } })] },
          { fills: [solid(0, 1, 0, { visible: false })] },
          { fills: [] },
          { fills: ctx.figma.mixed },
        ];
      },
    });
    const out = await ctx.layerChecks(t, CTX, async (id) => (id === "v1" ? { id } : null));
    expect(out.map((f) => [f.check, f.property, f.value])).toEqual([["hand-colour", "fill", "#ff0000"]]);
  });

  it("a dead variable on a segment paint is binding-missing", async () => {
    const { ctx } = await load([], []);
    const t = text({ textStyleId: "S:1", fills: ctx.figma.mixed, getStyledTextSegments: () => [{ fills: [solid(0, 0, 1, { boundVariables: { color: { type: "VARIABLE_ALIAS", id: "dead" } } })] }] });
    const out = await ctx.layerChecks(t, CTX, async () => null);
    expect(out.map((f) => [f.check, f.property, f.value])).toEqual([["binding-missing", "fill", "dead"]]);
  });

  it("a component set's default outline is chrome: no colour, radius or stroke findings; padding and dead bindings still count (I2)", async () => {
    const purple = solid(0x97 / 255, 0x47 / 255, 1);
    const set = componentSet({ fills: [], strokes: [purple], strokeWeight: 1, cornerRadius: 5, layoutMode: "VERTICAL", paddingTop: 16, itemSpacing: 0 });
    expect((await run(set)).out.map((f) => [f.check, f.property])).toEqual([["hand-spacing", "padding-top"]]);
    const dead = componentSet({ fills: [solid(1, 1, 1, { boundVariables: { color: { type: "VARIABLE_ALIAS", id: "gone" } } })], strokes: [purple], strokeWeight: 1, cornerRadius: 5 });
    expect((await run(dead)).out.map((f) => [f.check, f.property, f.value])).toEqual([["binding-missing", "fill", "gone"]]);
  });

  it("a section's default fill is chrome: no findings for its own paint, radius or stroke (I2)", async () => {
    const sec = section({ fills: [solid(1, 1, 1)], strokes: [solid(0, 0, 0)], strokeWeight: 1, cornerRadius: 2 });
    expect((await run(sec)).out).toEqual([]);
  });

  it("two identical unbound fills on one frame give one finding", async () => {
    const { out } = await run(frame({ fills: [solid(1, 0, 0), solid(1, 0, 0)], strokes: [solid(1, 0, 0), solid(1, 0, 0)], strokeWeight: 0 }));
    expect(out.map((f) => [f.property, f.value])).toEqual([["fill", "#ff0000"], ["stroke", "#ff0000"]]);
  });
});

describe("suggestFor", () => {
  const rgb = (hex) => ({ r: parseInt(hex.slice(1, 3), 16) / 255, g: parseInt(hex.slice(3, 5), 16) / 255, b: parseInt(hex.slice(5, 7), 16) / 255 });
  const cv = (id, name, hex) => vr({ id, name, valuesByMode: { m1: rgb(hex), m2: rgb(hex) } });
  const fv = (id, name, a, b) => vr({ id, name, resolvedType: "FLOAT", variableCollectionId: "c2", valuesByMode: { d: a, mo: b } });
  const RESP = { id: "c2", name: "Responsive", modes: [{ modeId: "d", name: "Desktop" }, { modeId: "mo", name: "Mobile" }], defaultModeId: "d" };
  const finding = (check, property, value) => ({ check, property, value, nodeId: "n", layer: "L" });
  async function setup(vars, role = "library", extra = {}) {
    const { ctx } = await load([col(), col(RESP)], vars, extra);
    const index = await ctx.buildTokenIndex(role, vars.map((v) => v.id));
    return { ctx, index };
  }

  it("exact colour match in the right family", async () => {
    const { ctx, index } = await setup([cv("a", "text/x", "#112233"), cv("b", "bg/x", "#112233")]);
    expect(ctx.suggestFor(finding("hand-colour", "fill", "#112233"), { type: "FRAME" }, index)).toBe("bg/x");
    expect(ctx.suggestFor(finding("hand-colour", "fill", "#112233"), { type: "TEXT" }, index)).toBe("text/x");
    expect(ctx.suggestFor(finding("hand-colour", "fill", "#112233"), { type: "VECTOR" }, index)).toBeNull();
  });

  it("nearest colour with DeltaE when no exact match", async () => {
    const { ctx, index } = await setup([cv("a", "bg/muted", "#f0f0f0"), cv("b", "bg/dark", "#000000")]);
    const s = ctx.suggestFor(finding("hand-colour", "fill", "#f2f2f2"), { type: "FRAME" }, index);
    expect(s).toMatch(/^nearest bg\/muted, \u0394E \d+\.\d$/);
  });

  it("spacing is matched in the node's mode", async () => {
    const { ctx, index } = await setup([fv("s1", "Spacing/lg", 24, 16), fv("s2", "Spacing/xl", 32, 24)]);
    const f = finding("hand-spacing", "gap", 16);
    expect(ctx.suggestFor(f, { resolvedVariableModes: { c2: "mo" } }, index)).toBe("Spacing/lg");
    expect(ctx.suggestFor(f, { resolvedVariableModes: {} }, index)).toBe("Spacing/lg 24, set 16");
  });

  it("off-scale spacing suggests the nearest with the difference; radius skips fixed", async () => {
    const { ctx, index } = await setup([fv("s1", "Spacing/md", 16, 16), fv("r1", "Radius/fixed-sm", 5, 5), fv("r2", "Radius/card", 8, 8)]);
    expect(ctx.suggestFor(finding("hand-spacing", "padding-top", 15), {}, index)).toBe("Spacing/md 16, set 15");
    expect(ctx.suggestFor(finding("hand-radius", "radius", 5), {}, index)).toBe("Radius/card 8, set 5");
    expect(ctx.suggestFor(finding("hand-stroke", "stroke-weight", 1), {}, index)).toBeNull();
    expect(ctx.suggestFor(finding("binding-missing", "fill", "x"), {}, index)).toBeNull();
  });

  it("stroke weight is suggested from Stroke/* like spacing (I1)", async () => {
    const { ctx, index } = await setup([fv("k1", "Stroke/icon-small", 1.5, 1.5), fv("k2", "Stroke/icon-big", 2.5, 2.5), fv("s1", "Spacing/2xs", 1, 1)]);
    expect(ctx.suggestFor(finding("hand-stroke", "stroke-weight", 1), {}, index)).toBe("Stroke/icon-small 1.5, set 1");
    expect(ctx.suggestFor(finding("hand-stroke", "stroke-weight", 2.5), {}, index)).toBe("Stroke/icon-big");
  });

  it("spacing also considers Layout/* and Container/* tokens (M3)", async () => {
    const { ctx, index } = await setup([fv("s1", "Spacing/xl", 32, 32), fv("l1", "Layout/gutter", 24, 16), fv("c1", "Container/content-max-width", 1200, 1200)]);
    expect(ctx.suggestFor(finding("hand-spacing", "gap", 24), {}, index)).toBe("Layout/gutter");
    expect(ctx.suggestFor(finding("hand-spacing", "padding-left", 1200), {}, index)).toBe("Container/content-max-width");
  });

  it("text matches a style by family, style, size and line height", async () => {
    const st = (id, name, size, lh) => ({ id, name, fontName: { family: "Inter", style: "Semi Bold" }, fontSize: size, lineHeight: lh });
    const { ctx } = await load([], [], { getLocalTextStylesAsync: async () => [st("S1", "title/md", 16, { unit: "PIXELS", value: 24 }), st("S2", "title/sm", 14, { unit: "AUTO" })] });
    const index = await ctx.buildTokenIndex("library");
    expect(ctx.suggestFor(finding("no-text-style", "text-style", "Inter Semi Bold 16/24"), {}, index)).toBe("title/md");
    expect(ctx.suggestFor(finding("no-text-style", "text-style", "Inter Semi Bold 14/auto"), {}, index)).toBe("title/sm");
    expect(ctx.suggestFor(finding("no-text-style", "text-style", "Inter Semi Bold 15/24"), {}, index)).toBeNull();
  });

  it("screens role with nothing imported says no imported token matches", async () => {
    const { ctx } = await load([], [], { getStyleByIdAsync: async (id) => (id === "S9" ? { id: "S9", name: "x", fontName: { family: "A", style: "B" }, fontSize: 1, lineHeight: { unit: "AUTO" } } : null) });
    const index = await ctx.buildTokenIndex("screens", ["gone"], ["S9", "nope"]);
    expect(index.styles.map((s) => s.id)).toEqual(["S9"]);
    expect(ctx.suggestFor(finding("hand-colour", "fill", "#ffffff"), { type: "FRAME" }, index)).toBe("no imported token matches");
    expect(ctx.suggestFor(finding("hand-spacing", "gap", 8), {}, index)).toBe("no imported token matches");
    expect(ctx.suggestFor(finding("no-text-style", "text-style", "Q W 1/1"), {}, index)).toBe("no imported token matches");
  });

  it("follows alias chains and skips hidden collections in the library", async () => {
    const base = cv("a", "primitive/red", "#ff0000");
    const alias = vr({ id: "b", name: "bg/danger", valuesByMode: { m1: { type: "VARIABLE_ALIAS", id: "a" }, m2: { type: "VARIABLE_ALIAS", id: "a" } } });
    const hidden = vr({ id: "h", name: "bg/hid", variableCollectionId: "c3", valuesByMode: { m1: rgb("#00ff00") } });
    const { ctx } = await load([col(), col({ id: "c3", hiddenFromPublishing: true })], [base, alias, hidden]);
    const index = await ctx.buildTokenIndex("library");
    expect(ctx.suggestFor(finding("hand-colour", "fill", "#ff0000"), { type: "FRAME" }, index)).toBe("bg/danger");
    expect(ctx.suggestFor(finding("hand-colour", "fill", "#00ff00"), { type: "FRAME" }, index)).toMatch(/^nearest bg\/danger/);
  });
});

describe("token use across files", () => {
  const al = (id) => ({ type: "VARIABLE_ALIAS", id });
  const mem = () => {
    const store = {};
    return { store, clientStorage: { getAsync: async (k) => store[k], setAsync: async (k, v) => { store[k] = v; } } };
  };
  const KEY = "skillup-publish-tokens/screens-usage";

  it("boundIdsOf collects padding, paint and text-segment bindings", async () => {
    const { ctx } = await load([], []);
    const node = {
      type: "TEXT",
      boundVariables: { paddingLeft: al("p1"), fills: [{ type: "VARIABLE_ALIAS", id: "f1" }], strokes: [{ type: "VARIABLE_ALIAS", id: "p1" }] },
      fills: [{ type: "SOLID", boundVariables: { color: al("c1") } }, { type: "SOLID" }],
      strokes: [{ type: "SOLID", boundVariables: { color: al("c2") } }],
      getStyledTextSegments: () => [{ boundVariables: { fontSize: al("t1") } }, { boundVariables: {} }, {}],
    };
    expect([...ctx.boundIdsOf(node)].sort()).toEqual(["c1", "c2", "f1", "p1", "t1"]);
    expect(Array.from(ctx.boundIdsOf({ type: "FRAME" }))).toEqual([]);
  });

  it("storeScreensUsage keeps other files' entries", async () => {
    const m = mem();
    const { ctx } = await load([], [], { clientStorage: m.clientStorage });
    await ctx.storeScreensUsage("A", "File A", ["k1"], new Date("2026-11-10T00:00:00Z"));
    await ctx.storeScreensUsage("B", "File B", ["k2"], new Date("2026-11-11T00:00:00Z"));
    await ctx.storeScreensUsage("A", "File A", ["k3"], new Date("2026-11-12T00:00:00Z"));
    expect(JSON.parse(JSON.stringify(m.store[KEY]))).toEqual({
      A: { name: "File A", date: "2026-11-12T00:00:00.000Z", keys: ["k3"] },
      B: { name: "File B", date: "2026-11-11T00:00:00.000Z", keys: ["k2"] },
    });
    const r = await ctx.readScreensUsage(new Date("2026-11-12T00:00:00Z"));
    expect([...r.keys].sort()).toEqual(["k2", "k3"]);
    expect(r.files.map((f) => f.name).sort()).toEqual(["File A", "File B"]);
    expect(r.icpFresh).toBe(false);
  });

  it("the ICP entry older than 7 days is not fresh", async () => {
    const m = mem();
    const { ctx } = await load([], [], { clientStorage: m.clientStorage });
    await ctx.storeScreensUsage("Wz2TCYFVr0hD8tJNiLajLt", "ICP", ["k"], new Date("2026-11-10T00:00:00Z"));
    expect((await ctx.readScreensUsage(new Date("2026-11-17T00:00:00Z"))).icpFresh).toBe(true);
    expect((await ctx.readScreensUsage(new Date("2026-11-17T00:00:01Z"))).icpFresh).toBe(false);
    const empty = await load([], []);
    const r = await empty.ctx.readScreensUsage(new Date());
    expect([r.files.length, r.keys.size, r.icpFresh]).toEqual([0, 0, false]);
  });

  const setup = () => {
    const a = vr({ id: "a", name: "a", key: "ka" });
    const b = vr({ id: "b", name: "b", key: "kb" });
    const c = vr({ id: "c", name: "c", key: "kc" });
    const d = vr({ id: "d", name: "d", key: "kd" });
    const h = vr({ id: "h", name: "h", key: "kh", variableCollectionId: "c3" });
    const cols = [col({ id: "c1", name: "1. Colour" }), col({ id: "c3", name: "0. Prim", hiddenFromPublishing: true })];
    const live = [a, b, c, d].map((v) => ({ v, col: cols[0] })).concat([{ v: h, col: cols[1] }]);
    return live;
  };

  it("a token used only through another token's alias is not unused", async () => {
    const { ctx } = await load([], []);
    const r = ctx.unusedTokens(setup(), new Set(["a"]), new Set(), new Set(["b"]), new Set(["c"]));
    expect(JSON.parse(JSON.stringify(r))).toEqual([{ collection: "1. Colour", name: "d" }]);
  });

  it("a token used only on a screens file (by key) is not unused", async () => {
    const { ctx } = await load([], []);
    const r = ctx.unusedTokens(setup(), new Set(), new Set(["kb", "kd"]), new Set(), new Set());
    expect(JSON.parse(JSON.stringify(r)).map((x) => x.name)).toEqual(["a", "c"]);
  });
});

describe("auditLayers and the audit message", () => {
  const DS = "c7EUDrQwP8si08aPipDSIV";
  const ICP = "Wz2TCYFVr0hD8tJNiLajLt";
  const USAGE = "skillup-publish-tokens/screens-usage";
  const red = () => ({ type: "SOLID", color: { r: 1, g: 0, b: 0 } });
  const al = (id) => ({ type: "VARIABLE_ALIAS", id });
  // A file with real pages (loadAsync), an in-memory clientStorage and the editor calls select-node uses.
  async function file(fileKey, pages, { cols = [], vars = [], store = {}, figma = {} } = {}) {
    const root = { name: "Doc", children: pages };
    pages.forEach((p) => { p.parent = root; });
    const clientStorage = { getAsync: async (k) => store[k], setAsync: async (k, v) => { store[k] = v; } };
    const r = await load(cols, vars, { fileKey, root, currentPage: pages[0], clientStorage, ...figma });
    return { ...r, store };
  }
  async function audit(f, msg = {}) {
    f.posted.length = 0;
    await f.send({ type: "audit", usage: null, usageFresh: false, ...msg });
    const res = f.posted.find((m) => m.type === "audit-result");
    if (!res) throw new Error("no audit-result: " + JSON.stringify(f.posted));
    return res.report;
  }
  const bgx = () => {
    const v = vr({ id: "bg", name: "bg/x", key: "kbg", valuesByMode: { m1: { r: 1, g: 0, b: 0 }, m2: { r: 1, g: 0, b: 0 } } });
    return { cols: [col({ variableIds: ["bg"] })], vars: [v] };
  };

  it("library: a hand-set colour in a component is a blocker and the verdict is not ready, publishBlocked unchanged", async () => {
    const box = frame({ name: "Box", fills: [red()] });
    const comp = component({ name: "Card" }, [box]);
    const f = await file(DS, [page("Components", [comp])], bgx());
    const r = await audit(f, { scope: "file", pageIds: [], excludedPageIds: [] });
    expect(r.role).toBe("library");
    const hc = r.blockers.filter((x) => x.check === "hand-colour");
    expect(hc).toHaveLength(1);
    expect(hc[0]).toMatchObject({ nodeId: box.id, property: "fill", value: "#ff0000", top: "Card", suggestion: "bg/x" });
    expect(r.verdict).toBe("not-ready");
    expect(r.publishBlocked).toBe(false);
    expect(r.covered).toContain("tokens");
    expect(r.covered).toContain("layers: whole file");
    expect(r.notCovered).toContain("components, docs");
    expect(r.notCovered).not.toContain("layers, components, docs");
    expect(r.notCovered.filter((x) => x === "components, docs")).toHaveLength(1);
  });

  it("screens: a hand-set colour is a blocker inside a Ready for dev frame and a warning outside", async () => {
    const inReady = frame({ name: "In", fills: [red()] });
    const marked = frame({ name: "Screen", devStatus: { type: "READY_FOR_DEV" } }, [inReady]);
    const loose = frame({ name: "Loose", fills: [red()] });
    const f = await file(ICP, [page("P", [marked, loose])]);
    const r = await audit(f, { scope: "file", pageIds: [], excludedPageIds: [] });
    expect(r.role).toBe("screens");
    expect(r.blockers.map((x) => [x.check, x.nodeId])).toEqual([["hand-colour", inReady.id]]);
    expect(r.warnings.map((x) => [x.check, x.nodeId])).toEqual([["hand-colour", loose.id]]);
    expect(r.blockers[0].suggestion).toBe("no imported token matches");
    expect(r.verdict).toBe("not-ready");
    expect(r.publishBlocked).toBe(false);
    expect(r.notCovered).toEqual(["components, docs"]);
  });

  it("screens: a token bound elsewhere in scope is suggested for a hand-set value", async () => {
    const bound = frame({ fills: [{ ...red(), boundVariables: { color: al("bg") } }] });
    const loose = frame({ fills: [red()] });
    const f = await file(ICP, [page("P", [bound, loose])], bgx());
    const r = await audit(f, { scope: "file", pageIds: [], excludedPageIds: [] });
    expect(r.warnings.map((x) => [x.nodeId, x.suggestion])).toEqual([[loose.id, "bg/x"]]);
  });

  it("sections and component sets are skipped as chrome but their layers are still audited (I2)", async () => {
    const inner = frame({ name: "Inner", fills: [red()] });
    const s = await file(ICP, [page("P", [section({ fills: [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }] }, [inner])])]);
    const rs = await audit(s, { scope: "file", pageIds: [], excludedPageIds: [] });
    expect(rs.warnings.map((x) => [x.check, x.nodeId])).toEqual([["hand-colour", inner.id]]);
    const v = component({ name: "V", fills: [red()] });
    const l = await file(DS, [page("P", [componentSet({ strokes: [red()], strokeWeight: 1, cornerRadius: 5 }, [v])])]);
    const rl = await audit(l, { scope: "file", pageIds: [], excludedPageIds: [] });
    expect(rl.blockers.map((x) => [x.check, x.nodeId])).toEqual([["hand-colour", v.id]]);
  });

  it("hand-stroke is a warning in both roles, never a blocker (I1)", async () => {
    const stroked = () => frame({ name: "Line", strokes: [{ ...red(), boundVariables: { color: al("bg") } }], strokeWeight: 1 });
    const l = await file(DS, [page("P", [component({}, [stroked()])])], bgx());
    const rl = await audit(l, { scope: "file", pageIds: [], excludedPageIds: [] });
    expect(rl.blockers.map((x) => x.check)).not.toContain("hand-stroke");
    expect(rl.warnings.map((x) => x.check)).toEqual(["hand-stroke"]);
    const s = await file(ICP, [page("P", [frame({ devStatus: { type: "READY_FOR_DEV" } }, [stroked()])])], bgx());
    const rs = await audit(s, { scope: "ready", pageIds: [], excludedPageIds: [] });
    expect(rs.blockers).toEqual([]);
    expect(rs.warnings.map((x) => x.check)).toEqual(["hand-stroke"]);
  });

  it("binding-missing is a blocker in both roles", async () => {
    const dead = () => frame({ fills: [{ ...red(), boundVariables: { color: al("gone") } }] });
    const s = await file(ICP, [page("P", [dead()])]);
    const rs = await audit(s, { scope: "file", pageIds: [], excludedPageIds: [] });
    expect(rs.blockers.map((x) => [x.check, x.value])).toEqual([["binding-missing", "gone"]]);
    expect(rs.warnings).toEqual([]);
    const l = await file(DS, [page("P", [component({}, [dead()])])]);
    const rl = await audit(l, { scope: "file", pageIds: [], excludedPageIds: [] });
    expect(rl.blockers.map((x) => x.check)).toContain("binding-missing");
    expect(rl.verdict).toBe("not-ready");
  });

  it("cancel mid-walk returns the cancelled report and stores no screens usage", async () => {
    const kids = Array.from({ length: 1200 }, () => text({ fills: [{ ...red(), boundVariables: { color: al("bg") } }] }));
    let reachedEnd = false;
    Object.defineProperty(kids[1199], "type", { get: () => { reachedEnd = true; return "TEXT"; } });
    const f = await file(ICP, [page("P", [frame({}, kids)])], bgx());
    // Cancel from inside the walk: on the first layers progress that has walked layers.
    const post = f.ctx.figma.ui.postMessage;
    const layersSeen = [];
    f.ctx.figma.ui.postMessage = (m) => {
      post(m);
      if (m.type === "audit-progress" && m.phase === "layers") {
        layersSeen.push(m.layers);
        if (m.layers > 0) f.send({ type: "audit-cancel" });
      }
    };
    f.posted.length = 0;
    await f.send({ type: "audit", scope: "file", pageIds: [], excludedPageIds: [] });
    const r = f.posted.find((m) => m.type === "audit-result").report;
    expect(Math.max(...layersSeen)).toBeGreaterThan(0);
    expect(Math.max(...layersSeen)).toBeLessThanOrEqual(500);
    expect(reachedEnd).toBe(false);
    expect(r.notCovered).toEqual(["cancelled"]);
    expect(r.blockers).toEqual([]);
    expect(f.store[USAGE]).toBeUndefined();
  });

  it("a pages run whose pages are all gone falls back to the current page", async () => {
    const a = page("A", [frame({ fills: [red()] })]);
    const f = await file(ICP, [a, page("B", [])]);
    const r = await audit(f, { scope: "pages", pageIds: ["gone"], excludedPageIds: [] });
    expect(r.covered[0]).toBe("layers: 1 of 2 pages");
    expect(r.warnings).toHaveLength(1);
  });

  it("a whole-file screens run stores its keys; a pages run does not", async () => {
    const used = () => frame({ fills: [{ ...red(), boundVariables: { color: al("bg") } }] });
    const inst = () => instance({ boundVariables: { fills: [al("bg2")] } });
    const two = { cols: [col({ variableIds: ["bg", "bg2"] })], vars: [bgx().vars[0], vr({ id: "bg2", name: "bg/y", key: "kbg2" })] };
    const f = await file(ICP, [page("P", [used(), inst()])], two);
    await audit(f, { scope: "file", pageIds: [], excludedPageIds: [] });
    const entry = JSON.parse(JSON.stringify(f.store[USAGE][ICP]));
    expect(entry.name).toBe("Doc");
    expect(entry.keys.sort()).toEqual(["kbg", "kbg2"]);
    const pg1 = page("P", [used()]);
    const g = await file(ICP, [pg1], two);
    await audit(g, { scope: "pages", pageIds: [pg1.id], excludedPageIds: [] });
    expect(g.store[USAGE]).toBeUndefined();
  });

  it("library without a fresh ICP entry lists \"use on screens\" as not covered and no unused-token", async () => {
    const f = await file(DS, [page("P", [component({}, [])])], bgx());
    const r = await audit(f, { scope: "file", pageIds: [], excludedPageIds: [] });
    expect(r.notCovered).toContain("use on screens");
    expect(r.suggestions.filter((x) => x.check === "unused-token")).toEqual([]);
  });

  it("library with a fresh ICP entry lists the tokens no file uses", async () => {
    const store = { [USAGE]: { [ICP]: { name: "ICP", date: new Date().toISOString(), keys: ["kb"] } } };
    const vars = ["a", "b", "c"].map((id) => vr({ id, name: "bg/" + id, key: "k" + id }));
    const comp = component({}, [frame({ fills: [{ ...red(), boundVariables: { color: al("a") } }] })]);
    const f = await file(DS, [page("P", [comp])], { cols: [col({ variableIds: ["a", "b", "c"] })], vars, store });
    const r = await audit(f, { scope: "file", pageIds: [], excludedPageIds: [] });
    expect(r.notCovered).not.toContain("use on screens");
    expect(r.covered).toContain("use on screens: ICP");
    expect(r.suggestions.filter((x) => x.check === "unused-token").map((x) => x.name)).toEqual(["bg/c"]);
  });

  it("the screens role does not run auditTokens", async () => {
    const { cols, vars } = one({}, { codeSyntax: {} });
    const f = await file(ICP, [page("P", [])], { cols, vars });
    const r = await audit(f, {});
    expect(r.warnings.map((x) => x.check)).not.toContain("no-web");
    expect(r.covered).not.toContain("tokens");
    expect(r.covered).toContain("layers: Ready for dev");
  });

  it("covered names the scope, what was left out and the hidden layers", async () => {
    const a = page("A", [frame({ visible: false }, [])]);
    const b = page("B", []);
    const c = page("C", []);
    const f = await file(ICP, [a, b, c]);
    const r = await audit(f, { scope: "pages", pageIds: [a.id, b.id, "stale"], excludedPageIds: [b.id, "stale"] });
    expect(r.covered).toEqual(["layers: 1 of 3 pages", "1 page left out", "1 hidden layer skipped"]);
    const l = await file(DS, [page("P", [component({ description: "[audit:skip]" }, [])])]);
    const sel = await audit(l, { scope: "file", pageIds: [], excludedPageIds: [] });
    expect(sel.covered).toEqual(["tokens", "layers: whole file", "1 component left out"]);
    const many = await file(ICP, [page("A", [frame({ visible: false }), frame({ visible: false }), frame({ visible: false })]), page("B", []), page("C", [])]);
    const pages = many.ctx.figma.root.children;
    const m = await audit(many, { scope: "file", pageIds: [], excludedPageIds: [pages[1].id, pages[2].id] });
    expect(m.covered).toEqual(["layers: whole file", "2 pages left out", "3 hidden layers skipped"]);
    const two = await file(DS, [page("A", [component({ description: "[audit:skip]" })]), page("B", []), page("C", [])]);
    const tp = two.ctx.figma.root.children;
    const t = await audit(two, { scope: "file", pageIds: [], excludedPageIds: [tp[1].id, tp[2].id] });
    expect(t.covered).toContain("2 pages and 1 component left out");
    const clean = await file(ICP, [page("A", [])]);
    expect((await audit(clean, { scope: "file", pageIds: [], excludedPageIds: [] })).covered).toEqual(["layers: whole file"]);
  });

  it("layer progress carries the phase, page, pages and layers", async () => {
    const f = await file(ICP, [page("A", [frame({}, [])]), page("B", [])]);
    await audit(f, { scope: "file", pageIds: [], excludedPageIds: [] });
    const prog = f.posted.filter((m) => m.type === "audit-progress" && m.phase === "layers");
    expect(prog[0]).toMatchObject({ phase: "layers", page: 1, pages: 2 });
    expect(typeof prog.at(-1).layers).toBe("number");
  });

  it("select-node on a missing id replies ok false", async () => {
    const f = await file(ICP, [page("P", [])], { figma: { getNodeByIdAsync: async () => null } });
    f.posted.length = 0;
    await f.send({ type: "select-node", id: "9:9" });
    expect(f.posted).toEqual([{ type: "select-result", id: "9:9", ok: false }]);
  });

  it("select-node switches page, selects and zooms", async () => {
    const leaf = frame({});
    const p2 = page("Two", [frame({}, [leaf])]);
    const calls = [];
    const f = await file(ICP, [page("One", []), p2], { figma: {
      getNodeByIdAsync: async (id) => (id === leaf.id ? leaf : null),
      viewport: { scrollAndZoomIntoView: (nodes) => calls.push(["zoom", nodes[0].id]) },
    } });
    f.ctx.figma.setCurrentPageAsync = async (p) => { calls.push(["page", p.id]); f.ctx.figma.currentPage = p; };
    f.posted.length = 0;
    await f.send({ type: "select-node", id: leaf.id });
    expect(f.posted).toEqual([{ type: "select-result", id: leaf.id, ok: true }]);
    expect(calls).toEqual([["page", p2.id], ["zoom", leaf.id]]);
    expect(f.ctx.figma.currentPage.selection.map((n) => n.id)).toEqual([leaf.id]);
  });

  it("save-audit-settings stores the settings under the file key", async () => {
    const f = await file(ICP, [page("P", [])]);
    const settings = { scope: "pages", pageIds: ["p"], excludedPageIds: [] };
    await f.send({ type: "save-audit-settings", settings });
    expect(f.store["skillup-publish-tokens/audit/" + ICP]).toEqual(settings);
  });

  it("a fresh entry stored under a file name (no key) enables unused-token", async () => {
    const store = { [USAGE]: {
      "Mobile App": { name: "Mobile App", date: new Date().toISOString(), keys: ["kb"] },
      Old: { name: "Old", date: "2020-01-01T00:00:00.000Z", keys: [] },
    } };
    const vars = ["a", "b"].map((id) => vr({ id, name: "bg/" + id, key: "k" + id }));
    const f = await file(DS, [page("P", [component({}, [])])], { cols: [col({ variableIds: ["a", "b"] })], vars, store });
    const r = await audit(f, { scope: "file", pageIds: [], excludedPageIds: [] });
    expect(r.notCovered).not.toContain("use on screens");
    expect(r.covered).toContain("use on screens: Mobile App");
    expect(r.suggestions.filter((x) => x.check === "unused-token").map((x) => x.name)).toEqual(["bg/a"]);
  });

  it("the check phase reports progress every 200 nodes and once at the end", async () => {
    const kids = Array.from({ length: 450 }, () => frame({}));
    const f = await file(ICP, [page("P", kids)]);
    await audit(f, { scope: "file", pageIds: [], excludedPageIds: [] });
    const checksProg = f.posted.filter((m) => m.type === "audit-progress" && m.phase === "checks");
    expect(checksProg).toEqual([
      { type: "audit-progress", phase: "checks", done: 200, total: 450 },
      { type: "audit-progress", phase: "checks", done: 400, total: 450 },
      { type: "audit-progress", phase: "checks", done: 450, total: 450 },
    ]);
  });
});

describe("selection count for the Selection scope", () => {
  it("posts the count after ready and again on every selectionchange", async () => {
    const { cols, vars } = one();
    const selection = [{ id: "1:1" }, { id: "1:2" }];
    const { posted, holder } = await load(cols, vars, { currentPage: { id: "0:1", name: "Page 1", selection } });
    const types = posted.map((m) => m.type);
    expect(types.indexOf("selection")).toBe(types.indexOf("ready") + 1);
    expect(posted.find((m) => m.type === "selection").count).toBe(2);
    selection.length = 0;
    holder.handlers.selectionchange();
    expect(posted[posted.length - 1]).toEqual({ type: "selection", count: 0 });
  });
});
