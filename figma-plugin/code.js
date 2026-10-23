// SkillUp · Publish tokens — a development plugin for the SKO Design System file.
// It reads the variables and text styles, shows what changed since the last publish, and opens a
// pull request with tokens/figma/variables.json on the prototype repository. A GitHub Action there
// generates the CSS, checks the build and merges; Vercel deploys. See README.md.

async function exportTokens() {
  const cols = await figma.variables.getLocalVariableCollectionsAsync();
  const byId = new Map();
  const colById = new Map(cols.map((c) => [c.id, c]));
  for (const v of await figma.variables.getLocalVariablesAsync()) byId.set(v.id, v);

  async function getVar(id) {
    if (!byId.has(id)) byId.set(id, await figma.variables.getVariableByIdAsync(id));
    return byId.get(id);
  }
  async function resolve(v, modeId, depth = 0) {
    if (depth > 20) throw new Error("alias loop at " + v.name);
    const col = colById.get(v.variableCollectionId);
    const m = v.valuesByMode[modeId] !== undefined ? modeId : col ? col.defaultModeId : Object.keys(v.valuesByMode)[0];
    const val = v.valuesByMode[m];
    if (val && typeof val === "object" && val.type === "VARIABLE_ALIAS") {
      const target = await getVar(val.id);
      if (!target) throw new Error("missing alias target from " + v.name);
      return resolve(target, modeId, depth + 1);
    }
    // A colour alias with its own opacity: { color: alias, opacity: 0–100 }.
    if (val && typeof val === "object" && val.color && val.color.type === "VARIABLE_ALIAS") {
      const target = await getVar(val.color.id);
      if (!target) throw new Error("missing alias target from " + v.name);
      const c = await resolve(target, modeId, depth + 1);
      return { r: c.r, g: c.g, b: c.b, a: (c.a === undefined ? 1 : c.a) * (val.opacity / 100) };
    }
    return val;
  }
  function round(n) { return Math.round(n * 10000) / 10000; }
  function norm(val) {
    if (val && typeof val === "object" && "r" in val) {
      const h = (x) => Math.round(x * 255).toString(16).padStart(2, "0");
      const a = val.a === undefined ? 1 : val.a;
      return "#" + h(val.r) + h(val.g) + h(val.b) + (a < 1 ? h(a) : "");
    }
    return typeof val === "number" ? round(val) : val;
  }

  const collections = [];
  for (const c of cols) {
    if (c.hiddenFromPublishing) continue; // primitives: only reached through aliases
    const variables = [];
    for (const id of c.variableIds) {
      const v = await getVar(id);
      const values = {};
      const aliases = {};
      for (const m of c.modes) {
        const raw = v.valuesByMode[m.modeId];
        values[m.name] = norm(await resolve(v, m.modeId));
        if (raw && raw.type === "VARIABLE_ALIAS") {
          const t = await getVar(raw.id);
          if (t && t.variableCollectionId === c.id) aliases[m.name] = t.name;
        }
      }
      const item = { name: v.name, type: v.resolvedType, web: v.codeSyntax.WEB || null, values };
      if (Object.keys(aliases).length) item.aliases = aliases;
      variables.push(item);
    }
    collections.push({ name: c.name, modes: c.modes.map((m) => m.name), variables });
  }

  const textStyles = [];
  for (const s of await figma.getLocalTextStylesAsync()) {
    const bound = {};
    for (const [k, b] of Object.entries(s.boundVariables || {})) {
      const t = b && (await getVar(b.id));
      if (t) bound[k] = t.name;
    }
    textStyles.push({
      name: s.name,
      fontFamily: s.fontName.family,
      fontStyle: s.fontName.style,
      fontSize: s.fontSize,
      lineHeight: s.lineHeight.unit === "AUTO" ? "auto" : { unit: s.lineHeight.unit, value: round(s.lineHeight.value) },
      letterSpacing: { unit: s.letterSpacing.unit, value: round(s.letterSpacing.value) },
      textCase: s.textCase,
      bound,
    });
  }
  return { format: "skillup-figma-tokens/1", fileKey: figma.fileKey || null, collections, textStyles };
}

const SETTINGS_KEY = "skillup-publish-tokens/settings";

figma.showUI(__html__, { width: 380, height: 560, themeColors: true });

(async () => {
  const settings = (await figma.clientStorage.getAsync(SETTINGS_KEY)) || {};
  const tokens = await exportTokens();
  figma.ui.postMessage({
    type: "ready",
    settings: { repo: settings.repo || "nvjeronimo/skillup-lms-prototype", token: settings.token || "" },
    json: JSON.stringify(tokens, null, 2) + "\n",
    user: figma.currentUser ? figma.currentUser.name : "a designer",
  });
})().catch((e) => figma.ui.postMessage({ type: "error", message: String(e && e.message ? e.message : e) }));

figma.ui.onmessage = async (msg) => {
  if (msg.type === "save-settings") await figma.clientStorage.setAsync(SETTINGS_KEY, msg.settings);
  if (msg.type === "close") figma.closePlugin();
};
