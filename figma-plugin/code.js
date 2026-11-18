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

// ---- Audit role, per-file settings and default page exclusions ----

const DS_FILE_KEY = "c7EUDrQwP8si08aPipDSIV";
const AUDIT_SETTINGS_PREFIX = "skillup-publish-tokens/audit/";

// "library" = the DS file (or an unsaved file that exports a "1." collection), "screens" = anything else.
function fileRole(fileKey, cols) {
  if (fileKey) return fileKey === DS_FILE_KEY ? "library" : "screens";
  const exported = (cols || []).some((c) => !c.hiddenFromPublishing && String(c.name).indexOf("1.") === 0);
  return exported ? "library" : "screens";
}

function auditSettingsKey() {
  return AUDIT_SETTINGS_PREFIX + (figma.fileKey || figma.root.name);
}

// Ids of the pages left out of an audit by default. pages: [{ id, name }].
// Keywords match as whole words or phrases (so "Discovery" is not "cover"); a divider page
// starts with "discovery" or "archive" and, in screens files, excludes itself and the pages after it up to a "---" page.
function defaultExcludedPages(role, pages) {
  const keywords = role === "library" ? ["in review", "archive", "arquivo", "cover", "start here"] : ["cover", "history", "hist\u00f3rico"];
  const res = keywords.map((k) => new RegExp("(^|[^\\p{L}\\p{N}])" + k + "([^\\p{L}\\p{N}]|$)", "iu"));
  const out = [];
  let inGroup = false;
  for (const p of pages) {
    const name = String(p.name).trim().toLowerCase();
    let excluded = res.some((re) => re.test(name));
    if (role === "screens") {
      if (name === "---") inGroup = false;
      else if (name.indexOf("discovery") === 0 || name.indexOf("archive") === 0) inGroup = true;
      if (inGroup) excluded = true;
    }
    if (excluded) out.push(p.id);
  }
  return out;
}

// ---- Layer walker ----

function isReadyNode(n) {
  return !!(n && n.devStatus && n.devStatus.type === "READY_FOR_DEV");
}
function isComponentNode(n) {
  return n.type === "COMPONENT" || n.type === "COMPONENT_SET";
}
function isAuditSkipped(n) {
  return isComponentNode(n) && typeof n.description === "string" && n.description.indexOf("[audit:skip]") !== -1;
}

// Walks the layers a scope covers with an explicit stack, never entering an INSTANCE.
// onNode(node, { page, top, ready }) fires for audited nodes; onUse(node), when given, fires for every
// node outside instances on every page (excluded ones too), so unused-token checks see all uses.
// Returns { cancelled, walked, hiddenSkipped, pagesLeftOut, componentsLeftOut }.
async function walkScope(opts) {
  const library = opts.role === "library";
  const scope = opts.scope;
  const onNode = opts.onNode || function () {};
  const onUse = opts.onUse || null;
  const isCancelled = opts.isCancelled || function () { return false; };
  const excluded = {};
  (opts.excludedPageIds || []).forEach(function (id) { excluded[id] = true; });
  const res = { cancelled: false, walked: 0, hiddenSkipped: 0, pagesLeftOut: 0, componentsLeftOut: 0 };
  let visited = 0;
  let pageNo = 0;
  let pageTotal = 0;
  const progress = function () {
    if (opts.onProgress) opts.onProgress({ page: pageNo, pages: pageTotal, layers: res.walked });
  };

  // Walks one stack. Returns false when cancelled.
  async function run(stack, page, audited) {
    while (stack.length) {
      if (visited > 0 && visited % 500 === 0) {
        await new Promise(function (r) { setTimeout(r, 0); });
        progress();
        if (isCancelled()) { res.cancelled = true; return false; }
      }
      visited++;
      const e = stack.pop();
      const node = e.n;
      const ready = e.ready || isReadyNode(node);
      let aud = e.aud;
      let lib = e.lib;
      if (node.type === "INSTANCE") {
        if (onUse) onUse(node);
        continue;
      }
      if (audited && !library && aud && node.visible === false) {
        res.hiddenSkipped++;
        aud = false;
      }
      if (isComponentNode(node)) {
        if (isAuditSkipped(node)) {
          if (audited && (library ? (!lib || aud) : aud)) res.componentsLeftOut++;
          aud = false;
          lib = true;
        } else if (library && !lib) {
          aud = audited;
          lib = true;
        }
      }
      if (aud && (scope !== "ready" || ready)) {
        res.walked++;
        onNode(node, { page: { id: page.id, name: page.name }, top: e.top, ready: ready });
      }
      if (onUse) onUse(node);
      const kids = node.children;
      if (kids && kids.length && (onUse || aud || (library && !lib))) {
        for (let i = kids.length - 1; i >= 0; i--) stack.push({ n: kids[i], top: e.top, ready: ready, aud: aud, lib: lib });
      }
    }
    return true;
  }

  if (scope === "selection") {
    const sel = (figma.currentPage && figma.currentPage.selection) || [];
    pageTotal = 1;
    pageNo = 1;
    progress();
    for (let i = 0; i < sel.length; i++) {
      const node = sel[i];
      let ready = false;
      let lib = false;
      let skipped = false;
      let hidden = false;
      let top = node;
      let page = figma.currentPage;
      for (let p = node.parent; p; p = p.parent) {
        if (p.type === "PAGE") { page = p; break; }
        if (isReadyNode(p)) ready = true;
        if (isComponentNode(p)) { lib = true; if (isAuditSkipped(p)) skipped = true; }
        if (p.visible === false) hidden = true;
        top = p;
      }
      let aud = library ? lib && !skipped : !hidden;
      const ok = await run([{ n: node, top: { id: top.id, name: top.name }, ready: ready, aud: aud, lib: lib || skipped }], page, true);
      if (!ok) return res;
    }
    return res;
  }

  const pages = figma.root.children;
  const wanted = scope === "pages" ? (opts.pageIds || []) : null;
  const auditedPages = pages.filter(function (p) { return !wanted || wanted.indexOf(p.id) !== -1; });
  pageTotal = auditedPages.filter(function (p) { return !excluded[p.id]; }).length;
  res.pagesLeftOut = auditedPages.length - pageTotal;

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    const inScope = !wanted || wanted.indexOf(page.id) !== -1;
    const audited = inScope && !excluded[page.id];
    if (!audited && !onUse) continue;
    if (audited) { pageNo++; progress(); }
    await page.loadAsync();
    const stack = [];
    const kids = page.children || [];
    for (let k = kids.length - 1; k >= 0; k--) {
      stack.push({ n: kids[k], top: { id: kids[k].id, name: kids[k].name }, ready: false, aud: audited && !library, lib: false });
    }
    if (!(await run(stack, page, audited))) return res;
  }
  return res;
}

// ---- Layer checks ----

// The variable for an id, or null when the lookup returns null or throws (library not available).
async function getVarSafe(id) {
  try {
    const v = await figma.variables.getVariableByIdAsync(id);
    return v || null;
  } catch (e) {
    return null;
  }
}

function hexOfColor(c) {
  const h = function (x) { return Math.round(x * 255).toString(16).padStart(2, "0"); };
  return "#" + h(c.r) + h(c.g) + h(c.b);
}

function fontSummary(name, size, lh) {
  let l = "auto";
  if (lh && lh.unit === "PIXELS") l = String(Math.round(lh.value * 100) / 100);
  else if (lh && lh.unit === "PERCENT") l = Math.round(lh.value * 100) / 100 + "%";
  return (name ? name.family + " " + name.style : "") + " " + size + "/" + l;
}

function paintIsVisible(p) {
  return p.visible !== false && (p.opacity === undefined || p.opacity > 0);
}

// Hand-set values and bindings that point nowhere, for one node (never its children).
// Returns [{ check, nodeId, layer, property, value, page, pageId, top, topId, ready }].
async function layerChecks(node, ctx, getVar) {
  const mixed = figma.mixed;
  const out = [];
  const bv = node.boundVariables || {};
  const find = function (check, property, value) {
    out.push({ check: check, nodeId: node.id, layer: node.name, property: property, value: value, page: ctx.page.name, pageId: ctx.page.id, top: ctx.top.name, topId: ctx.top.id, ready: !!ctx.ready });
  };
  const aliasId = function (a) { return a && typeof a === "object" && a.id ? a.id : null; };
  const isBound = function (key) { return !!aliasId(bv[key]); };

  // 1. Every bound id must resolve.
  const checked = {};
  const verify = async function (property, id) {
    if (!id) return;
    const k = property + "|" + id;
    if (checked[k]) return;
    checked[k] = true;
    if (!(await getVar(id))) find("binding-missing", property, id);
  };
  const scalars = [
    ["paddingTop", "padding-top"], ["paddingRight", "padding-right"], ["paddingBottom", "padding-bottom"], ["paddingLeft", "padding-left"],
    ["itemSpacing", "gap"], ["counterAxisSpacing", "counter-gap"], ["strokeWeight", "stroke-weight"],
    ["strokeTopWeight", "stroke-weight"], ["strokeRightWeight", "stroke-weight"], ["strokeBottomWeight", "stroke-weight"], ["strokeLeftWeight", "stroke-weight"],
  ];
  for (let i = 0; i < scalars.length; i++) await verify(scalars[i][1], aliasId(bv[scalars[i][0]]));
  const corners = [["topLeftRadius", "radius-top-left"], ["topRightRadius", "radius-top-right"], ["bottomLeftRadius", "radius-bottom-left"], ["bottomRightRadius", "radius-bottom-right"]];
  const cids = corners.map(function (c) { return aliasId(bv[c[0]]); });
  if (cids[0] && cids.every(function (x) { return x === cids[0]; })) await verify("radius", cids[0]);
  else for (let i = 0; i < corners.length; i++) await verify(corners[i][1], cids[i]);
  const arrays = [["fills", "fill"], ["strokes", "stroke"]];
  for (let a = 0; a < arrays.length; a++) {
    const list = bv[arrays[a][0]];
    if (Array.isArray(list)) for (let i = 0; i < list.length; i++) await verify(arrays[a][1], aliasId(list[i]));
    const paints = node[arrays[a][0]];
    if (Array.isArray(paints)) {
      for (let i = 0; i < paints.length; i++) await verify(arrays[a][1], aliasId(paints[i].boundVariables && paints[i].boundVariables.color));
    }
  }

  // 2. Colours: visible SOLID paints with no variable, one finding per distinct hex per property.
  const seenColour = {};
  const paintFindings = function (property, paints, bound) {
    for (let i = 0; i < paints.length; i++) {
      const p = paints[i];
      if (p.type !== "SOLID" || !paintIsVisible(p)) continue;
      if ((p.boundVariables && p.boundVariables.color) || aliasId(bound && bound[i])) continue;
      const hex = hexOfColor(p.color);
      if (seenColour[property + "|" + hex]) continue;
      seenColour[property + "|" + hex] = true;
      find("hand-colour", property, hex);
    }
  };
  if (Array.isArray(node.fills)) paintFindings("fill", node.fills, bv.fills);
  else if (node.fills === mixed && node.type === "TEXT" && node.getStyledTextSegments) {
    const segs = node.getStyledTextSegments(["fills"]);
    for (let i = 0; i < segs.length; i++) {
      if (!Array.isArray(segs[i].fills)) continue;
      for (let j = 0; j < segs[i].fills.length; j++) {
        const p = segs[i].fills[j];
        await verify("fill", aliasId(p.boundVariables && p.boundVariables.color));
      }
      paintFindings("fill", segs[i].fills, null);
    }
  }
  const strokes = Array.isArray(node.strokes) ? node.strokes : [];
  paintFindings("stroke", strokes, bv.strokes);

  // 3. Spacing, only in auto layout.
  if (node.layoutMode && node.layoutMode !== "NONE") {
    const sp = [["paddingTop", "padding-top"], ["paddingRight", "padding-right"], ["paddingBottom", "padding-bottom"], ["paddingLeft", "padding-left"], ["itemSpacing", "gap"]];
    if (node.layoutWrap === "WRAP") sp.push(["counterAxisSpacing", "counter-gap"]);
    for (let i = 0; i < sp.length; i++) {
      const v = node[sp[i][0]];
      if (typeof v === "number" && v !== 0 && !isBound(sp[i][0])) find("hand-spacing", sp[i][1], v);
    }
  }

  // 4. Radius.
  if (node.cornerRadius === mixed) {
    for (let i = 0; i < corners.length; i++) {
      const v = node[corners[i][0]];
      if (typeof v === "number" && v !== 0 && !isBound(corners[i][0])) find("hand-radius", corners[i][1], v);
    }
  } else if (typeof node.cornerRadius === "number" && node.cornerRadius !== 0) {
    if (!corners.every(function (c) { return isBound(c[0]); })) find("hand-radius", "radius", node.cornerRadius);
  }

  // 5. Stroke weight, only with a visible stroke.
  if (strokes.some(paintIsVisible)) {
    if (node.strokeWeight === mixed) {
      const sides = ["strokeTopWeight", "strokeRightWeight", "strokeBottomWeight", "strokeLeftWeight"];
      for (let i = 0; i < sides.length; i++) {
        const v = node[sides[i]];
        if (typeof v === "number" && v !== 0 && !isBound(sides[i]) && !isBound("strokeWeight")) find("hand-stroke", "stroke-weight", v);
      }
    } else if (typeof node.strokeWeight === "number" && node.strokeWeight !== 0 && !isBound("strokeWeight")) {
      find("hand-stroke", "stroke-weight", node.strokeWeight);
    }
  }

  // 6. Text without a text style.
  if (node.type === "TEXT") {
    const whole = node.textStyleId;
    const uniform = node.fontName !== mixed && node.fontSize !== mixed && node.lineHeight !== mixed;
    if (whole === "" && uniform) find("no-text-style", "text-style", fontSummary(node.fontName, node.fontSize, node.lineHeight));
    else if ((whole === "" || whole === mixed) && node.getStyledTextSegments) {
      const segs = node.getStyledTextSegments(["textStyleId", "fontName", "fontSize", "lineHeight"]);
      for (let i = 0; i < segs.length; i++) {
        if (segs[i].textStyleId === "") find("no-text-style", "text-style", fontSummary(segs[i].fontName, segs[i].fontSize, segs[i].lineHeight));
      }
    }
  }
  return out;
}

// ---- Suggested tokens ----

function hexToRgb(h) {
  return [parseInt(h.slice(1, 3), 16) / 255, parseInt(h.slice(3, 5), 16) / 255, parseInt(h.slice(5, 7), 16) / 255];
}

// sRGB hex -> CIE Lab (D65), for CIE76 distances.
function hexToLab(hex) {
  const lin = function (c) { return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
  const rgb = hexToRgb(hex).map(lin);
  const x = (rgb[0] * 0.4124564 + rgb[1] * 0.3575761 + rgb[2] * 0.1804375) / 0.95047;
  const y = rgb[0] * 0.2126729 + rgb[1] * 0.7151522 + rgb[2] * 0.072175;
  const z = (rgb[0] * 0.0193339 + rgb[1] * 0.119192 + rgb[2] * 0.9503041) / 1.08883;
  const f = function (t) { return t > 216 / 24389 ? Math.cbrt(t) : (24389 / 27 * t + 16) / 116; };
  const fx = f(x), fy = f(y), fz = f(z);
  return [116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz)];
}

function deltaE76(a, b) {
  return Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2) + Math.pow(a[2] - b[2], 2));
}

// The tokens a finding can be matched against: local variables of exported collections plus text styles
// (library), or the variables reachable from the ids the walk collected plus text styles (screens).
// Alias targets are loaded here so suggestFor can stay synchronous.
async function buildTokenIndex(role, extraVariableIds, extraTextStyleIds) {
  extraVariableIds = extraVariableIds || [];
  extraTextStyleIds = extraTextStyleIds || [];
  const cols = {};
  const vars = {};
  const names = []; // ids of the variables that can be suggested
  const loadCol = async function (id) {
    if (!id) return null;
    if (!(id in cols)) {
      try { cols[id] = (await figma.variables.getVariableCollectionByIdAsync(id)) || null; } catch (e) { cols[id] = null; }
    }
    return cols[id];
  };
  const addVar = async function (v, suggestable) {
    if (!v) return;
    if (!(v.id in vars)) {
      vars[v.id] = v;
      await loadCol(v.variableCollectionId);
    }
    if (suggestable && names.indexOf(v.id) < 0) names.push(v.id);
  };
  if (role === "library") {
    const all = await figma.variables.getLocalVariablesAsync();
    for (let i = 0; i < all.length; i++) {
      const c = await loadCol(all[i].variableCollectionId);
      if (c && !c.hiddenFromPublishing) await addVar(all[i], true);
    }
  } else {
    for (let i = 0; i < extraVariableIds.length; i++) await addVar(await getVarSafe(extraVariableIds[i]), true);
  }
  // Follow alias chains so resolved values are available without further lookups.
  const queue = Object.keys(vars);
  for (let q = 0; q < queue.length; q++) {
    const v = vars[queue[q]];
    const by = v.valuesByMode || {};
    for (const m in by) {
      const id = aliasIdOf(by[m]);
      if (id && !(id in vars)) {
        await addVar(await getVarSafe(id), false);
        if (id in vars) queue.push(id);
      }
    }
  }
  const styles = [];
  const seen = {};
  const addStyle = function (s) { if (s && !seen[s.id]) { seen[s.id] = true; styles.push(s); } };
  (await figma.getLocalTextStylesAsync()).forEach(addStyle);
  for (let i = 0; i < extraTextStyleIds.length; i++) {
    let s = null;
    try { s = await figma.getStyleByIdAsync(extraTextStyleIds[i]); } catch (e) { s = null; }
    addStyle(s);
  }
  return { role: role, cols: cols, vars: vars, names: names, styles: styles };
}

// A variable's value for a node: the node's mode for the variable's collection, else the collection's default.
function tokenValue(index, v, node, depth) {
  if ((depth || 0) > 20 || !v) return undefined;
  const col = index.cols[v.variableCollectionId];
  const by = v.valuesByMode || {};
  const modes = node && node.resolvedVariableModes;
  let mode = (modes && col && modes[col.id]) || (col && col.defaultModeId);
  let val = mode in by ? by[mode] : by[Object.keys(by)[0]];
  const id = aliasIdOf(val);
  if (id) return tokenValue(index, index.vars[id], node, (depth || 0) + 1);
  return val;
}

function suggestFor(finding, node, index) {
  if (!finding || finding.check === "binding-missing") return null;
  const none = index.role === "screens" ? "no imported token matches" : null;
  const tokens = function (type, test) {
    return index.names.map(function (id) { return index.vars[id]; }).filter(function (v) { return v && v.resolvedType === type && test(v.name); });
  };
  const prop = finding.property;

  if (finding.check === "hand-colour") {
    let prefix = "bg/";
    if (prop === "stroke") prefix = "border/";
    else if (node && node.type === "TEXT") prefix = "text/";
    else if (node && (node.type === "VECTOR" || node.type === "BOOLEAN_OPERATION")) prefix = "icon/";
    const fam = tokens("COLOR", function (n) { return n.indexOf(prefix) === 0; });
    const target = hexToLab(finding.value);
    let best = null, bestD = Infinity;
    for (let i = 0; i < fam.length; i++) {
      const c = tokenValue(index, fam[i], node);
      if (!c || typeof c.r !== "number") continue;
      const hex = hexOfColor(c);
      if (hex === finding.value) return fam[i].name;
      const d = deltaE76(target, hexToLab(hex));
      if (d < bestD) { bestD = d; best = fam[i]; }
    }
    if (!best) return none;
    return "nearest " + best.name + ", ΔE " + bestD.toFixed(1);
  }

  if (finding.check === "hand-spacing" || finding.check === "hand-radius") {
    const spacing = finding.check === "hand-spacing";
    const fam = tokens("FLOAT", function (n) {
      return spacing ? n.indexOf("Spacing/") === 0 : n.indexOf("Radius/") === 0 && n.indexOf("Radius/fixed-") !== 0;
    });
    let best = null, bestV = 0, bestD = Infinity;
    for (let i = 0; i < fam.length; i++) {
      const n = tokenValue(index, fam[i], node);
      if (typeof n !== "number") continue;
      if (n === finding.value) return fam[i].name;
      const d = Math.abs(n - finding.value);
      if (d < bestD || (d === bestD && n < bestV)) { bestD = d; best = fam[i]; bestV = n; }
    }
    if (!best) return none;
    return best.name + " " + bestV + ", set " + finding.value;
  }

  if (finding.check === "no-text-style") {
    for (let i = 0; i < index.styles.length; i++) {
      const s = index.styles[i];
      if (fontSummary(s.fontName, s.fontSize, s.lineHeight) === finding.value) return s.name;
    }
    return none;
  }
  return null; // hand-stroke: no token for stroke weight
}

// ---- The audit (tokens only; later parts add layers, components and docs) ----

// The build's Figma → CSS name mapping, copied from scripts/tokens/names.mjs (the plugin cannot
// import it). audit.test.mjs checks both give the same names for the committed variables.json.
// `data` has the shape of tokens/figma/variables.json: [{ figma, css }].
function tokenCssNames(data) {
  const unvar = (web) => web.replace(/^var\((--[^)]+)\)$/, "$1");
  const colorName = (v) => (v.web ? unvar(v.web) : "--color-" + v.name.replace(/\//g, "-"));
  const motionName = (v) => (v.web ? unvar(v.web) : "--motion-" + v.name.replace(/\//g, "-"));
  const isRadius = (v) => /^Radius\/(?!fixed-)/.test(v.name);
  const radiusName = (v) => "--sk-radius-" + v.name.split("/")[1];
  const isSpacing = (v) => /^(Spacing|Container|Layout)\//.test(v.name);
  const spacingName = (v) => {
    const [group, key] = v.name.split("/");
    if (group === "Spacing") return "--sk-space-" + key;
    if (group === "Layout") return "--sk-layout-" + key;
    return "--sk-container-" + key;
  };
  const isType = (v) => /^Type\/(size|line-height)\//.test(v.name);
  const typeName = (v) => "--sk-type-" + v.name.split("/")[1] + "-" + v.name.split("/")[2];
  const collection = (prefix) => data.collections.find((x) => x.name.startsWith(prefix));
  const out = [];
  const add = (c, vars, name) => {
    for (const v of vars) out.push({ figma: c.name + "/" + v.name, css: name(v) });
  };
  const colors = collection("1.");
  if (colors) add(colors, colors.variables.filter((v) => v.type === "COLOR"), colorName);
  const responsive = collection("2.");
  if (responsive) {
    add(responsive, responsive.variables.filter(isRadius), radiusName);
    add(responsive, responsive.variables.filter(isSpacing), spacingName);
    add(responsive, responsive.variables.filter(isType), typeName);
  }
  const motion = collection("3.");
  if (motion) add(motion, motion.variables, motionName);
  return out;
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
  // A map in a format this plugin does not know is read as no map: "code usage" not covered.
  const useUsage = !!(usage && usage.format === "skillup-token-usage/1" && opts.usageFresh === true);
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
    // The CSS names the live exported variables give, built exactly as the build builds them, so
    // the plugin and the CI guard agree on what "gone" means: a CSS name the code uses that no live
    // variable produces any more.
    const liveData = { collections: cols.filter((c) => !c.hiddenFromPublishing).map((c) => ({
      name: c.name,
      variables: live.filter((x) => x.col === c).map(({ v }) => ({ name: v.name, type: v.resolvedType, web: (v.codeSyntax && v.codeSyntax.WEB) || null })),
    })) };
    const liveCss = new Set(tokenCssNames(liveData).map((t) => t.css));
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
      const found = (entry.css || []).some((n) => liveCss.has(n));
      if (!found) {
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
  const cols = await figma.variables.getLocalVariableCollectionsAsync();
  const role = fileRole(figma.fileKey, cols);
  const pages = figma.root.children.map((p) => ({ id: p.id, name: p.name }));
  const auditSettings = (await figma.clientStorage.getAsync(auditSettingsKey())) || {
    scope: role === "library" ? "file" : "ready",
    pageIds: [figma.currentPage.id],
    excludedPageIds: defaultExcludedPages(role, pages),
  };
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
    role,
    pages,
    auditSettings,
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
