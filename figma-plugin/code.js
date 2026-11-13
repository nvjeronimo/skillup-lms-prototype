// SkillUp · Publish tokens — a development plugin for the SKO Design System file.
// It reads the variables and text styles, shows what changed since the last publish, and opens a
// pull request with tokens/figma/variables.json on the prototype repository. A GitHub Action there
// generates the CSS, checks the build and merges; Vercel deploys. It can also open a pull request
// for the dev token package (docs repo) and download the JSON, in our format or W3C DTCG. See README.md.

// A variable reader that never throws: a missing or unavailable (library) variable reads as null.
async function makeVarReader() {
  const cols = await figma.variables.getLocalVariableCollectionsAsync();
  const byId = new Map();
  for (const v of await figma.variables.getLocalVariablesAsync()) byId.set(v.id, v);
  async function getVar(id) {
    if (!byId.has(id)) {
      let found = null;
      try {
        found = await figma.variables.getVariableByIdAsync(id);
      } catch (e) {
        found = null;
      }
      byId.set(id, found || null);
    }
    return byId.get(id);
  }
  return { cols, byId, getVar };
}

// The variable id a mode value points at: a plain alias, or a colour alias with its own opacity.
function aliasIdOf(val) {
  if (val && typeof val === "object") {
    if (val.type === "VARIABLE_ALIAS") return val.id;
    if (val.color && val.color.type === "VARIABLE_ALIAS") return val.color.id;
  }
  return null;
}

// The two findings that make the exported JSON wrong: a mode with no value, and an alias to a
// variable that is gone (deleted, or from a library that is not available).
async function modeProblems(v, col, getVar) {
  const out = [];
  for (const m of col.modes) {
    const raw = v.valuesByMode[m.modeId];
    if (raw === undefined) {
      out.push({ check: "mode-missing", collection: col.name, name: v.name, mode: m.name, text: "no value for this mode (mode " + m.name + ")" });
      continue;
    }
    const id = aliasIdOf(raw);
    if (id && !(await getVar(id))) {
      out.push({ check: "alias-missing", collection: col.name, name: v.name, mode: m.name, text: "alias to a variable that no longer exists (mode " + m.name + ")" });
    } else if (id) {
      // Follow the chain: a cycle never ends, so it can never export a value.
      const seen = new Set([v.id]);
      let cur = await getVar(id);
      while (cur) {
        if (seen.has(cur.id)) {
          out.push({ check: "alias-missing", collection: col.name, name: v.name, mode: m.name, text: "alias loop (mode " + m.name + ")" });
          break;
        }
        seen.add(cur.id);
        const val = cur.valuesByMode[m.modeId] !== undefined ? cur.valuesByMode[m.modeId] : cur.valuesByMode[Object.keys(cur.valuesByMode)[0]];
        const nid = aliasIdOf(val);
        cur = nid ? await getVar(nid) : null;
      }
    }
  }
  return out;
}

async function exportTokens() {
  const { cols, getVar } = await makeVarReader();
  const colById = new Map(cols.map((c) => [c.id, c]));

  async function resolve(v, modeId, depth = 0) {
    if (depth > 20) return null; // an alias loop; reported as alias-missing in problems
    const col = colById.get(v.variableCollectionId);
    const m = v.valuesByMode[modeId] !== undefined ? modeId : col ? col.defaultModeId : Object.keys(v.valuesByMode)[0];
    const val = v.valuesByMode[m];
    if (val && typeof val === "object" && val.type === "VARIABLE_ALIAS") {
      const target = await getVar(val.id);
      if (!target) return null; // reported as alias-missing in problems
      return resolve(target, modeId, depth + 1);
    }
    // A colour alias with its own opacity: { color: alias, opacity: 0–100 }.
    if (val && typeof val === "object" && val.color && val.color.type === "VARIABLE_ALIAS") {
      const target = await getVar(val.color.id);
      if (!target) return null;
      const c = await resolve(target, modeId, depth + 1);
      if (!c) return null;
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

  const problems = [];
  for (const c of cols) {
    for (const id of c.variableIds) {
      const v = await getVar(id);
      if (v) problems.push(...(await modeProblems(v, c, getVar)));
    }
  }

  const collections = [];
  for (const c of cols) {
    if (c.hiddenFromPublishing) continue; // primitives: only reached through aliases
    const variables = [];
    for (const id of c.variableIds) {
      const v = await getVar(id);
      if (!v) continue;
      const values = {};
      const aliases = {};
      for (const m of c.modes) {
        const raw = v.valuesByMode[m.modeId];
        values[m.name] = raw === undefined ? null : norm(await resolve(v, m.modeId));
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
  return { format: "skillup-figma-tokens/1", fileKey: figma.fileKey || null, collections, textStyles, problems };
}

// ---- The audit (tokens only; later parts add layers, components and docs) ----

function numberPrefix(name) {
  const i = String(name).indexOf(" ");
  return i < 0 ? String(name) : String(name).slice(0, i);
}

function webCssName(v) {
  const web = v.codeSyntax && v.codeSyntax.WEB;
  if (!web) return null;
  const m = /^\s*var\(\s*(--[^,)\s]+)/.exec(web);
  return m ? m[1] : String(web).trim();
}

function plural(n, one, many) {
  return n + " " + (n === 1 ? one : many);
}

// Reads every variable's publish status under ONE shared time limit. Returns the statuses, or
// null when the limit was reached or any status could not be read (then it is "not checked").
async function readPublishStatuses(items, timeoutMs) {
  let timer;
  const timeout = new Promise((resolve) => {
    timer = setTimeout(() => resolve("timeout"), timeoutMs);
  });
  const all = Promise.all(
    items.map(async (v) => {
      try {
        return typeof v.getPublishStatusAsync === "function" ? await v.getPublishStatusAsync() : null;
      } catch (e) {
        return null;
      }
    })
  ).then((statuses) => ({ statuses }));
  const out = await Promise.race([all, timeout]);
  clearTimeout(timer);
  if (out === "timeout" || out.statuses.some((s) => !s)) return null;
  return out.statuses;
}

async function auditTokens(opts) {
  opts = opts || {};
  const usage = opts.usage || null;
  const useUsage = !!(usage && opts.usageFresh === true);
  const timeoutMs = opts.publishStatusTimeoutMs !== undefined ? opts.publishStatusTimeoutMs : 10000;
  const onProgress = opts.onProgress || function () {};
  const isCancelled = opts.isCancelled || function () { return false; };
  const later = "layers, components, docs";

  function cancelledReport() {
    return { verdict: "not-ready", covered: [], notCovered: ["cancelled"], blockers: [], pending: [], warnings: [], suggestions: [], publishBlocked: false };
  }

  const { cols, getVar } = await makeVarReader();
  const findings = [];
  const live = []; // { v, col }
  const aliased = new Set();

  for (let i = 0; i < cols.length; i++) {
    if (isCancelled()) return cancelledReport();
    const c = cols[i];
    if (c.modes.length >= 10) {
      findings.push({ check: "mode-cap", collection: c.name, name: "", text: c.modes.length + " modes, the Figma limit" });
    }
    for (const id of c.variableIds) {
      const v = await getVar(id);
      if (!v) continue;
      live.push({ v, col: c });
      for (const raw of Object.values(v.valuesByMode)) {
        const aid = aliasIdOf(raw);
        if (aid) aliased.add(aid);
      }
      findings.push(...(await modeProblems(v, c, getVar)));
      if (c.hiddenFromPublishing) continue; // primitives: not exported, so no Web syntax, description or scope rules
      if (!webCssName(v)) findings.push({ check: "no-web", collection: c.name, name: v.name, text: "no Web code syntax" });
      if (!String(v.description || "").trim()) findings.push({ check: "no-description", collection: c.name, name: v.name, text: "no description" });
      if ((v.scopes || []).indexOf("ALL_SCOPES") >= 0) findings.push({ check: "all-scopes", collection: c.name, name: v.name, text: "all scopes" });
    }
    onProgress(i + 1, cols.length);
  }

  for (const { v, col } of live) {
    if (col.hiddenFromPublishing && !aliased.has(v.id)) {
      findings.push({ check: "unused-primitive", collection: col.name, name: v.name, text: "no token aliases it" });
    }
  }

  const covered = ["tokens"];
  const notCovered = [];

  if (useUsage) {
    covered.push("code usage");
    const liveWeb = new Set();
    for (const { v, col } of live) {
      if (col.hiddenFromPublishing) continue;
      const css = webCssName(v);
      if (css) liveWeb.add(css);
    }
    for (const key of Object.keys(usage.tokens || {})) {
      const entry = usage.tokens[key];
      if (!entry || !(entry.files > 0)) continue;
      // Collection names can hold a slash, so match against the live names first.
      let colName = null;
      for (const { col } of live) {
        if (key.indexOf(col.name + "/") === 0 && (colName === null || col.name.length > colName.length)) colName = col.name;
      }
      if (colName === null) colName = key.slice(0, Math.max(key.indexOf("/"), 0));
      const varName = key.slice(colName.length + 1);
      const sameName = live.some(({ v, col }) => v.name === varName && numberPrefix(col.name) === numberPrefix(colName));
      const sameWeb = (entry.css || []).some((n) => liveWeb.has(n));
      if (!sameName && !sameWeb) {
        findings.push({ check: "used-gone", collection: colName, name: varName, text: "used in code (" + plural(entry.files, "file", "files") + "), gone from Figma" });
      }
    }
    for (const css of usage.unknownCss || []) {
      findings.push({ check: "unknown-css", collection: "", name: css, text: "used in code, but no token produces it" });
    }
  } else {
    notCovered.push("code usage");
  }

  if (isCancelled()) return cancelledReport();

  const exported = live.filter((x) => !x.col.hiddenFromPublishing);
  const exportedCols = cols.filter((c) => !c.hiddenFromPublishing);
  const statuses = await readPublishStatuses(exported.map((x) => x.v).concat(exportedCols), timeoutMs);
  if (statuses === null) {
    notCovered.push("library publish status");
  } else {
    exported.forEach((x, i) => {
      if (statuses[i] === "UNPUBLISHED") findings.push({ check: "unpublished", collection: x.col.name, name: x.v.name, text: "not published to the library" });
      else if (statuses[i] === "CHANGED") findings.push({ check: "unpublished", collection: x.col.name, name: x.v.name, text: "changed since the last library publish" });
    });
    exportedCols.forEach((c, j) => {
      const st = statuses[exported.length + j];
      if (st === "UNPUBLISHED") findings.push({ check: "unpublished", collection: c.name, name: c.name, text: "collection not published to the library" });
      else if (st === "CHANGED") findings.push({ check: "unpublished", collection: c.name, name: c.name, text: "collection changed since the last library publish" });
    });
  }
  notCovered.push(later);

  const pick = (checks) => findings.filter((f) => checks.indexOf(f.check) >= 0);
  const blockers = pick(["alias-missing", "mode-missing", "used-gone"]);
  return {
    verdict: blockers.length ? "not-ready" : "ready",
    covered,
    notCovered,
    blockers,
    pending: pick(["unpublished", "unsent"]),
    warnings: pick(["no-web", "unknown-css", "mode-cap", "no-description", "all-scopes"]),
    suggestions: pick(["unused-primitive"]),
    publishBlocked: findings.some((f) => f.check === "alias-missing" || f.check === "mode-missing"),
  };
}

const SETTINGS_KEY = "skillup-publish-tokens/settings";

figma.showUI(__html__, { width: 380, height: 640, themeColors: true });

(async () => {
  const settings = (await figma.clientStorage.getAsync(SETTINGS_KEY)) || {};
  const tokens = await exportTokens();
  const problems = tokens.problems;
  delete tokens.problems; // the JSON stays exactly as the Publish flow and the prototype build expect
  figma.ui.postMessage({
    type: "ready",
    settings: {
      repo: settings.repo || "nvjeronimo/skillup-lms-prototype",
      pkgRepo: settings.pkgRepo || "nvjeronimo/skillup-lms-prd",
      pkgBase: settings.pkgBase || "main",
      pkgPath: settings.pkgPath !== undefined ? settings.pkgPath : "03-design-system/dev-token-package/figma",
      pkgFormat: settings.pkgFormat || "skillup",
      token: settings.token || "",
    },
    json: JSON.stringify(tokens, null, 2) + "\n",
    user: currentUserName(),
    problems,
  });
})().catch((e) => figma.ui.postMessage({ type: "error", message: String(e && e.message ? e.message : e) }));

let auditCancelled = false;

figma.ui.onmessage = async (msg) => {
  if (msg.type === "audit") {
    auditCancelled = false;
    try {
      const report = await auditTokens({
        usage: msg.usage || null,
        usageFresh: msg.usageFresh === true,
        onProgress: (done, total) => figma.ui.postMessage({ type: "audit-progress", done, total }),
        isCancelled: () => auditCancelled,
      });
      figma.ui.postMessage({ type: "audit-result", report });
    } catch (e) {
      figma.ui.postMessage({ type: "audit-error", message: String(e && e.message ? e.message : e) });
    }
  }
  if (msg.type === "audit-cancel") auditCancelled = true;
  if (msg.type === "save-settings") await figma.clientStorage.setAsync(SETTINGS_KEY, msg.settings);
  if (msg.type === "close") figma.closePlugin();
};

// The name of whoever publishes, for the pull request. Needs "currentuser" in the manifest's
// permissions; without it Figma throws, so fall back to a neutral name instead of failing.
function currentUserName() {
  try {
    return figma.currentUser ? figma.currentUser.name : "a designer";
  } catch (e) {
    return "a designer";
  }
}
