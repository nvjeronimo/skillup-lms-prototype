#!/usr/bin/env node
/**
 * What a token change does to the page. Resolves every CSS custom property (and the .sk-text-*
 * classes) the way the browser would, in every mode the prototype has — SKO / Gold / Studio,
 * light and dark, nested dark bands, colour-vision mode, desktop / tablet / mobile and the forced
 * device preview — once for a git ref and once for the working tree, and lists the differences.
 *
 *   node scripts/tokens/compare.mjs                 compare with origin/main
 *   node scripts/tokens/compare.mjs --ref HEAD~1    compare with another ref
 *   node scripts/tokens/compare.mjs --markdown      the report as Markdown (the sync PR body)
 *   node scripts/tokens/compare.mjs --strict        exit 1 on any change (the "0 diffs" proof)
 *
 * The CSS files are the @imports of app/globals.css that live under tokens/, in their order.
 * Media queries: width queries follow the context's width; prefers-* and print never match.
 */
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import postcss from "postcss";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const arg = (name, fallback) => {
  const i = process.argv.indexOf(name);
  return i > -1 ? process.argv[i + 1] : fallback;
};
const REF = arg("--ref", "origin/main");
const markdown = process.argv.includes("--markdown");
const strict = process.argv.includes("--strict");

const read = (ref, file) =>
  ref ? execFileSync("git", ["show", `${ref}:${file}`], { cwd: root, encoding: "utf8" }) : fs.readFileSync(path.join(root, file), "utf8");
const importsOf = (globals) =>
  [...globals.matchAll(/@import\s+"\.\.\/(tokens\/[^"]+\.css)"/g)].map((m) => m[1]);

/* ---- A small cascade: enough for the selectors the token files use ----------------------- */
function splitTop(s, sep) {
  const out = [];
  let depth = 0, cur = "", q = null;
  for (const ch of s) {
    if (q) { cur += ch; if (ch === q) q = null; continue; }
    if (ch === '"' || ch === "'") { q = ch; cur += ch; continue; }
    if (ch === "(" || ch === "[") depth++;
    if (ch === ")" || ch === "]") depth--;
    if (depth === 0 && (sep === " " ? /\s/.test(ch) : ch === sep)) { if (cur.trim()) out.push(cur.trim()); cur = ""; continue; }
    cur += ch;
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
}
// A compound selector → { test(el), spec: [a, b, c] }; null when it uses something we can't evaluate.
function compound(sel) {
  const tests = [];
  const spec = [0, 0, 0];
  let s = sel;
  while (s.length) {
    let m;
    if ((m = s.match(/^\*/))) { /* universal */ }
    else if ((m = s.match(/^html/))) { tests.push((el) => el.tag === "html"); spec[2]++; }
    else if ((m = s.match(/^(div|nav|aside|section|header|button)/))) { const t = m[1]; tests.push((el) => el.tag === t); spec[2]++; }
    else if ((m = s.match(/^:root/))) { tests.push((el) => el.tag === "html"); spec[1]++; }
    else if ((m = s.match(/^\[([\w-]+)(?:="([^"]*)")?\]/))) { const [, a, v] = m; tests.push((el) => (v === undefined ? a in el.attrs : el.attrs[a] === v)); spec[1]++; }
    else if ((m = s.match(/^\.([\w-]+)/))) { const c = m[1]; tests.push((el) => el.classes.includes(c)); spec[1]++; }
    else if ((m = s.match(/^:(not|is)\(/))) {
      let depth = 1, i = m[0].length;
      for (; i < s.length && depth; i++) { if (s[i] === "(") depth++; if (s[i] === ")") depth--; }
      const inner = splitTop(s.slice(m[0].length, i - 1), ",").map(compound);
      if (inner.some((x) => !x)) return null;
      const best = inner.map((x) => x.spec).sort(cmpSpec).at(-1);
      spec[0] += best[0]; spec[1] += best[1]; spec[2] += best[2];
      tests.push(m[1] === "not" ? (el) => !inner.some((x) => x.test(el)) : (el) => inner.some((x) => x.test(el)));
      s = s.slice(i);
      continue;
    } else return null;
    s = s.slice(m[0].length);
  }
  return { test: (el) => tests.every((t) => t(el)), spec };
}
const cmpSpec = (a, b) => a[0] - b[0] || a[1] - b[1] || a[2] - b[2];
function selector(sel) {
  if (/[>+~]|::|:has|:hover|:focus/.test(sel)) return null;
  const parts = splitTop(sel, " ").map(compound);
  if (parts.some((p) => !p)) return null;
  const spec = parts.reduce((a, p) => [a[0] + p.spec[0], a[1] + p.spec[1], a[2] + p.spec[2]], [0, 0, 0]);
  // descendant combinator: the last part matches the element, the rest match ancestors in order
  const test = (chain) => {
    if (!parts.at(-1).test(chain.at(-1))) return false;
    let i = chain.length - 2;
    for (let p = parts.length - 2; p >= 0; p--) {
      while (i >= 0 && !parts[p].test(chain[i])) i--;
      if (i < 0) return false;
      i--;
    }
    return true;
  };
  return { test, spec };
}
function mediaMatches(params, width) {
  if (/prefers-|print/.test(params)) return false;
  return [...params.matchAll(/\((min|max)-width:\s*(\d+)px\)/g)].every(([, k, n]) => (k === "max" ? width <= +n : width >= +n));
}
function rulesOf(files) {
  const rules = [];
  let order = 0;
  for (const css of files) {
    postcss.parse(css).walkRules((r) => {
      if (r.parent.type === "atrule" && r.parent.name === "keyframes") return;
      const media = r.parent.type === "atrule" && r.parent.name === "media" ? r.parent.params : null;
      const decls = [];
      r.walkDecls((d) => {
        decls.push([d.prop, d.value.trim(), d.important]);
      });
      for (const s of splitTop(r.selector, ",")) {
        const sel = selector(s);
        if (sel) rules.push({ sel, media, decls, order: order++ });
      }
    });
  }
  return rules;
}
function declared(rules, chain, width) {
  const won = new Map();
  for (const r of rules) {
    if (r.media && !mediaMatches(r.media, width)) continue;
    if (!r.sel.test(chain)) continue;
    for (const [prop, value, important] of r.decls) {
      const prev = won.get(prop);
      const rank = { important: important ? 1 : 0, spec: r.sel.spec, order: r.order };
      if (!prev || prev.rank.important < rank.important || (prev.rank.important === rank.important && (cmpSpec(prev.rank.spec, rank.spec) < 0 || (cmpSpec(prev.rank.spec, rank.spec) === 0 && prev.rank.order < rank.order))))
        won.set(prop, { value, rank });
    }
  }
  return won;
}
function substitute(value, lookup, depth = 0) {
  if (depth > 30) return value;
  return value.replace(/var\(\s*(--[\w-]+)\s*(?:,\s*([^()]*(?:\([^()]*\))?[^()]*))?\)/g, (all, name, fallback) => {
    const v = lookup(name);
    if (v !== undefined) return substitute(v, lookup, depth + 1);
    return fallback !== undefined ? all : all;
  });
}
// Computed custom properties of the last element in the chain (they inherit, resolved, from the parent).
function computeVars(rules, chain, width) {
  let inherited = new Map();
  for (let i = 0; i < chain.length; i++) {
    const own = declared(rules, chain.slice(0, i + 1), width);
    const mine = new Map(inherited);
    const resolving = new Set();
    const lookup = (name) => {
      if (own.has(name) && !resolving.has(name)) {
        resolving.add(name);
        const v = substitute(own.get(name).value, lookup);
        resolving.delete(name);
        return v;
      }
      return inherited.get(name);
    };
    for (const [prop] of own) if (prop.startsWith("--")) mine.set(prop, lookup(prop));
    inherited = mine;
  }
  return inherited;
}

/* ---- Contexts ---------------------------------------------------------------------------- */
const html = (attrs = {}) => ({ tag: "html", attrs, classes: [] });
const div = (attrs = {}, classes = []) => ({ tag: "div", attrs, classes });
const contexts = [];
for (const theme of [null, "dark"])
  for (const skin of [null, "teal", "gold"])
    for (const direction of [null, "studio"]) {
      if (direction && skin) continue; // Studio is its own brand: it is never combined with a skin
      for (const vision of [null, "cvd"]) {
        const attrs = {};
        if (theme) attrs["data-theme"] = theme;
        if (skin) attrs["data-skin"] = skin;
        if (direction) attrs["data-direction"] = direction;
        if (vision) attrs["data-vision"] = vision;
        const label = [direction ?? skin ?? "sko", theme ?? "light", vision].filter(Boolean).join(" · ");
        contexts.push({ label, chain: [html(attrs)], width: 1280 });
        if (!theme && !vision) contexts.push({ label: `${label} › dark band`, chain: [html(attrs), div({ "data-theme": "dark" })], width: 1280 });
        if (theme && !vision) contexts.push({ label: `${label} › light island`, chain: [html(attrs), div({ "data-theme": "light" })], width: 1280 });
      }
    }
for (const [label, width] of [["tablet width", 900], ["mobile width", 375]]) contexts.push({ label, chain: [html()], width });
for (const device of ["desktop", "tablet", "mobile"]) contexts.push({ label: `device ${device}`, chain: [html({ "data-device": device })], width: 1280 });

/* ---- Compare ----------------------------------------------------------------------------- */
const hex = /^#([0-9a-f]{6})([0-9a-f]{2})?$/i;
function same(a, b) {
  if (a === b) return true;
  if (a === undefined || b === undefined) return false;
  const x = a.match(hex), y = b.match(hex);
  if (x && y) {
    // Figma stores alpha as a float: 0.7 is #b2 or #b3 depending on rounding. One step apart is the same colour.
    const ch = (m) => (m[1] + (m[2] ?? "ff")).match(/../g).map((h) => parseInt(h, 16));
    return ch(x).every((v, i) => Math.abs(v - ch(y)[i]) <= 1);
  }
  // calc(12px - 4px) and 8px are the same length
  const px = (v) => {
    const m = v.match(/^calc\(\s*(-?[\d.]+)px\s*([+-])\s*(-?[\d.]+)px\s*\)$/);
    return m ? `${m[2] === "+" ? +m[1] + +m[3] : m[1] - m[3]}px` : v;
  };
  return px(a.replace(/\s+/g, " ")) === px(b.replace(/\s+/g, " "));
}
function snapshot(ref) {
  const files = importsOf(read(ref, "app/globals.css")).map((f) => {
    try { return read(ref, f); } catch { return ""; }
  });
  const rules = rulesOf(files);
  const vars = contexts.map((c) => computeVars(rules, c.chain, c.width));
  const classes = new Set();
  for (const css of files) for (const m of css.matchAll(/^\.(sk-text-[\w-]+)\s*\{/gm)) classes.add(m[1]);
  const text = new Map();
  for (const c of classes) {
    for (const ctx of [contexts[0], contexts.find((x) => x.label === "mobile width")]) {
      const chain = [...ctx.chain, div({}, [c])];
      const own = declared(rules.filter((r) => r.decls.some(([p]) => !p.startsWith("--"))), chain, ctx.width);
      const v = computeVars(rules, ctx.chain, ctx.width);
      const out = {};
      for (const [prop, { value }] of own) out[prop] = substitute(value, (n) => v.get(n));
      text.set(`.${c} (${ctx.label})`, out);
    }
  }
  return { vars, text };
}

const before = snapshot(REF);
const after = snapshot(null);
const changes = [];
contexts.forEach((ctx, i) => {
  const a = before.vars[i], b = after.vars[i];
  for (const k of new Set([...a.keys(), ...b.keys()])) {
    if (!a.has(k)) continue; // a new token is not a change to anything on the page
    if (!same(a.get(k), b.get(k))) changes.push({ where: ctx.label, what: k, from: a.get(k), to: b.get(k) ?? "(removed)" });
  }
});
for (const [k, a] of before.text) {
  const b = after.text.get(k) ?? {};
  for (const p of new Set([...Object.keys(a), ...Object.keys(b)]))
    if (!same(a[p], b[p])) changes.push({ where: k, what: p, from: a[p] ?? "(none)", to: b[p] ?? "(removed)" });
}
const added = [...after.vars[0].keys()].filter((k) => !before.vars[0].has(k));

// Group the same change across modes so one token reads as one line.
const grouped = new Map();
for (const c of changes) {
  const key = `${c.what}\u0000${c.from}\u0000${c.to}`;
  if (!grouped.has(key)) grouped.set(key, { ...c, where: [] });
  grouped.get(key).where.push(c.where);
}
const rows = [...grouped.values()];

if (markdown) {
  console.log(`### What changes on the page (compared with \`${REF}\`)\n`);
  if (!rows.length) console.log("Nothing visible: every token resolves to the same value in every mode.\n");
  else {
    console.log("| Token | Was | Now | Where |\n|---|---|---|---|");
    for (const r of rows) console.log(`| \`${r.what}\` | \`${r.from}\` | \`${r.to}\` | ${r.where.length === contexts.length ? "every mode" : r.where.join(", ")} |`);
  }
  if (added.length) console.log(`\nNew tokens (not used by any page yet): ${added.map((k) => `\`${k}\``).join(", ")}`);
} else {
  for (const r of rows) console.log(`${r.what}: ${r.from} → ${r.to}   [${r.where.length} context(s): ${r.where.slice(0, 4).join("; ")}${r.where.length > 4 ? "; …" : ""}]`);
  console.log(`\n${contexts.length} contexts, ${before.vars[0].size} custom properties at :root, ${before.text.size} text-class checks.`);
  console.log(`${rows.length} difference(s); ${added.length} new token(s)${added.length ? ": " + added.join(" ") : ""}`);
}
if (strict && rows.length) process.exit(1);
