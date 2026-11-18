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
  it("with no file key, a local exported collection starting 1. means library", async () => {
    const { ctx } = await load([], []);
    expect(ctx.fileRole(null, [col({ name: "1. Colour" })])).toBe("library");
    expect(ctx.fileRole(null, [col({ name: "1. Colour", hiddenFromPublishing: true })])).toBe("screens");
    expect(ctx.fileRole(null, [col({ name: "Other" })])).toBe("screens");
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

