/**
 * Which Figma tokens does the prototype's code use? Writes tokens/usage.json (read by the "Publish
 * tokens" plugin) and guards token PRs: `--against <variables.json>` reports CSS names the code still
 * uses that the base JSON produced and the new JSON no longer does.
 *
 *   node scripts/tokens/usage.mjs --write
 *   node scripts/tokens/usage.mjs --check
 *   node scripts/tokens/usage.mjs --against <new variables.json> --base <old variables.json> [--report guard.md]
 *   (all modes: --root <dir> to scan another tree; default is the repository)
 *
 * Over-counting use is fine, under-counting is a bug: it would hide a blocker.
 */
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { tokenCssNames } from "./names.mjs";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
export const FORMAT = "skillup-token-usage/1";

// ── Tailwind config, read as text ────────────────────────────────────────────
// A small tokenizer over the `extend: { … }` object literal. Only string values "var(--…)" are kept;
// anything else (arrays, numbers, functions) is skipped with its brackets balanced.

function skipTrivia(s, i) {
  for (;;) {
    while (i < s.length && /\s/.test(s[i])) i++;
    if (s.startsWith("//", i)) while (i < s.length && s[i] !== "\n") i++;
    else if (s.startsWith("/*", i)) {
      const end = s.indexOf("*/", i + 2);
      i = end < 0 ? s.length : end + 2;
    } else return i;
  }
}

function readString(s, i) {
  const q = s[i];
  let out = "";
  i++;
  while (i < s.length && s[i] !== q) {
    if (s[i] === "\\") i++;
    out += s[i++];
  }
  return [out, i + 1];
}

// Skips one value that is not an object or a string, up to the next top-level "," or "}".
function skipValue(s, i) {
  let depth = 0;
  while (i < s.length) {
    i = skipTrivia(s, i);
    const c = s[i];
    if (c === '"' || c === "'" || c === "`") i = readString(s, i)[1];
    else if (c === "(" || c === "[" || c === "{") (depth++, i++);
    else if (c === ")" || c === "]") (depth--, i++);
    else if (c === "}") {
      if (depth === 0) return i;
      depth--;
      i++;
    } else if (c === "," && depth === 0) return i;
    else i++;
  }
  return i;
}

// Reads `{ key: value, … }` starting at the "{" and calls onString(pathKeys, value) for every string.
function walkObject(s, i, keys, onString) {
  i = skipTrivia(s, i) + 1; // past "{"
  for (;;) {
    i = skipTrivia(s, i);
    if (i >= s.length) return i;
    if (s[i] === "}") return i + 1;
    if (s[i] === ",") {
      i++;
      continue;
    }
    let key;
    if (s[i] === '"' || s[i] === "'") [key, i] = readString(s, i);
    else {
      const m = /^[\w$-]+/.exec(s.slice(i));
      if (!m) return i + 1;
      key = m[0];
      i += key.length;
    }
    i = skipTrivia(s, i);
    if (s[i] !== ":") continue; // shorthand property: no value to read
    i = skipTrivia(s, i + 1);
    if (s[i] === "{") i = walkObject(s, i, [...keys, key], onString);
    else if (s[i] === '"' || s[i] === "'") {
      let v;
      [v, i] = readString(s, i);
      onString([...keys, key], v);
    } else i = skipValue(s, i);
  }
}

/**
 * Class fragment ("sko-text-default", "card") → the CSS custom properties it can stand for. Two
 * sections can share a key (borderRadius.surface and translate.surface): the class alone does not
 * say which, so every candidate counts (over-counting is fine).
 */
export function tailwindMap(configText) {
  const map = new Map();
  const at = configText.search(/\bextend\s*:\s*\{/);
  if (at < 0) return map;
  walkObject(configText, configText.indexOf("{", at), [], (keys, value) => {
    const m = /^var\(\s*(--[\w-]+)\s*(?:,.*)?\)$/.exec(value.trim());
    if (!m) return;
    // keys[0] is the theme section (colors, borderRadius…): it is not part of the class.
    const fragment = keys.slice(1).filter((k) => k !== "DEFAULT").join("-");
    if (!fragment) return;
    if (!map.has(fragment)) map.set(fragment, new Set());
    map.get(fragment).add(m[1]);
  });
  return map;
}

// ── Scan ─────────────────────────────────────────────────────────────────────

const SCAN_DIRS = ["app", "components", "lib", "stories"];
const SCAN_EXT = /\.(ts|tsx|css)$/;
const SKIP_DIRS = new Set(["node_modules", ".next"]);
const SKIP_FILES = new Set(["stories/figmaTokens.ts"]);
const SKIP_PATHS = new Set(["tokens/generated"]); // generated CSS: not scanned
const HAND_WRITTEN = /^tokens\/[^/]+\.css$/;

/** Reads the files the scan covers, with paths relative to `root` and "/" separators. */
export function collectFiles(root) {
  const out = [];
  const read = (rel) => {
    if (SKIP_FILES.has(rel)) return;
    out.push({ path: rel, text: fs.readFileSync(path.join(root, rel), "utf8") });
  };
  const walk = (rel) => {
    const abs = path.join(root, rel);
    if (!fs.existsSync(abs)) return;
    for (const e of fs.readdirSync(abs, { withFileTypes: true })) {
      const r = `${rel}/${e.name}`;
      if (e.isDirectory()) {
        if (!SKIP_DIRS.has(e.name) && !SKIP_PATHS.has(r)) walk(r);
      } else if (SCAN_EXT.test(e.name)) read(r);
    }
  };
  for (const d of SCAN_DIRS) walk(d);
  if (fs.existsSync(path.join(root, "tailwind.config.ts"))) read("tailwind.config.ts");
  const tokensDir = path.join(root, "tokens");
  if (fs.existsSync(tokensDir)) {
    for (const e of fs.readdirSync(tokensDir, { withFileTypes: true })) {
      if (e.isFile() && e.name.endsWith(".css")) read(`tokens/${e.name}`);
    }
  }
  return out.sort((a, b) => (a.path < b.path ? -1 : 1));
}

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * `used`: CSS name → paths. `dynamic`: fixed prefixes of runtime-built names. `declared`: custom
 * properties the hand-written tokens/*.css declare (they are consumers and declarers).
 */
export function scanCode(files, tw) {
  const used = new Map();
  const dynamic = new Set();
  const declared = new Set();
  const add = (css, p) => {
    if (!used.has(css)) used.set(css, new Set());
    used.get(css).add(p);
  };
  const fragments = [...tw].map(([frag, css]) => ({
    frag,
    css: [...css],
    re: new RegExp(`-${escapeRe(frag)}(?![\\w-])`),
  }));
  for (const { path: p, text } of files) {
    // The config itself only defines the classes; its var() strings are not uses.
    if (p === "tailwind.config.ts") continue;
    if (HAND_WRITTEN.test(p)) for (const m of text.matchAll(/(--[\w-]+)\s*:/g)) declared.add(m[1]);
    for (const m of text.matchAll(/var\(\s*(--[\w-]*)(\$\{)?/g)) {
      if (m[2]) dynamic.add(m[1]);
      else if (m[1].length > 2) add(m[1], p);
    }
    for (const { frag, css, re } of fragments) {
      if (text.includes(`-${frag}`) && re.test(text)) for (const c of css) add(c, p);
    }
  }
  // A dynamic prefix also marks the files in `dynamicFiles`, kept apart so buildUsage can spread them.
  const dynamicFiles = new Map();
  for (const { path: p, text } of files) {
    if (p === "tailwind.config.ts") continue;
    for (const m of text.matchAll(/var\(\s*(--[\w-]*)\$\{/g)) {
      if (!dynamicFiles.has(m[1])) dynamicFiles.set(m[1], new Set());
      dynamicFiles.get(m[1]).add(p);
    }
  }
  return { used, dynamic: [...dynamic].sort(), dynamicFiles, declared };
}

// ── Usage map and guard ──────────────────────────────────────────────────────

function pathsFor(css, scan) {
  const paths = new Set(scan.used.get(css) ?? []);
  for (const [prefix, ps] of scan.dynamicFiles) if (css.startsWith(prefix)) for (const p of ps) paths.add(p);
  return paths;
}

export function buildUsage(data, scan, commit, variablesBlob = null) {
  const names = tokenCssNames(data);
  const produced = new Set(names.map((n) => n.css));
  const tokens = {};
  for (const { figma, css } of names) {
    const entry = (tokens[figma] ??= { css: [], files: 0, _paths: new Set() });
    entry.css.push(css);
    for (const p of pathsFor(css, scan)) entry._paths.add(p);
  }
  for (const k of Object.keys(tokens).sort()) {
    tokens[k].files = tokens[k]._paths.size;
    delete tokens[k]._paths;
  }
  const sorted = Object.fromEntries(Object.keys(tokens).sort().map((k) => [k, tokens[k]]));
  const unknownCss = [...scan.used.keys()].filter((c) => !produced.has(c) && !scan.declared.has(c)).sort();
  return { format: FORMAT, commit, variablesBlob, tokens: sorted, dynamic: scan.dynamic, unknownCss };
}

/**
 * CSS names used in code (directly, via Tailwind or a dynamic prefix) that the base JSON produced and
 * the new JSON does not. A hand-written tokens/*.css declaring the name does not exempt it: skin files
 * only override, the generated :root value is what disappears. Names no token ever produced (local
 * custom properties) are never reported: they stay in `unknownCss`.
 */
export function missingAgainst(scan, newData, baseData) {
  const base = new Set(tokenCssNames(baseData).map((n) => n.css));
  const produced = new Set(tokenCssNames(newData).map((n) => n.css));
  const gone = new Map();
  const add = (css, ps) => {
    if (!gone.has(css)) gone.set(css, new Set());
    for (const p of ps) gone.get(css).add(p);
  };
  for (const css of base) {
    if (produced.has(css)) continue;
    add(css, scan.used.get(css) ?? []);
    for (const [prefix, ps] of scan.dynamicFiles) if (css.startsWith(prefix)) add(css, ps);
  }
  return [...gone]
    .filter(([, ps]) => ps.size > 0)
    .map(([css, ps]) => ({ css, files: [...ps].sort() }))
    .sort((a, b) => (a.css < b.css ? -1 : 1));
}

// ── CLI ──────────────────────────────────────────────────────────────────────

function reportMarkdown(missing) {
  const rows = missing.map((m) => `| \`${m.css}\` | ${m.files.map((f) => `\`${f}\``).join(", ")} |`);
  return [
    "| Token (CSS name) | Files |",
    "| --- | --- |",
    ...rows,
    "",
    "This pull request waits: merge it after the code no longer uses these tokens.",
    "",
  ].join("\n");
}

function main(argv) {
  const arg = (name) => {
    const i = argv.indexOf(name);
    return i >= 0 ? argv[i + 1] : undefined;
  };
  const root = path.resolve(arg("--root") ?? REPO);
  const readJson = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
  const twPath = path.join(root, "tailwind.config.ts");
  const tw = tailwindMap(fs.existsSync(twPath) ? fs.readFileSync(twPath, "utf8") : "");
  const scan = scanCode(collectFiles(root), tw);
  const varsPath = path.join(root, "tokens/figma/variables.json");
  const git = (...a) => execFileSync("git", a, { cwd: root, encoding: "utf8" }).trim();
  const fresh = () => buildUsage(readJson(varsPath), scan, git("rev-parse", "HEAD"), git("hash-object", "tokens/figma/variables.json"));
  const outPath = path.join(root, "tokens/usage.json");
  const serialise = (u) => `${JSON.stringify(u, null, 2)}\n`;

  if (argv.includes("--write")) {
    fs.writeFileSync(outPath, serialise(fresh()));
    console.log(`wrote tokens/usage.json`);
  } else if (argv.includes("--check")) {
    const now = fresh();
    let have = null;
    try {
      have = readJson(outPath);
    } catch {}
    if (!have || serialise({ ...have, commit: "" }) !== serialise({ ...now, commit: "" })) {
      console.error("tokens/usage.json is stale: run `npm run tokens:usage`");
      process.exit(1);
    }
    console.log("tokens/usage.json is up to date");
  } else if (arg("--against")) {
    if (!arg("--base")) {
      console.error("usage: usage.mjs --against <new variables.json> --base <old variables.json> [--report <file.md>]");
      process.exit(2);
    }
    const missing = missingAgainst(scan, readJson(path.resolve(arg("--against"))), readJson(path.resolve(arg("--base"))));
    console.log(`${missing.length} CSS name(s) used in code are not produced by that JSON`);
    for (const m of missing) console.log(`  ${m.css}  (${m.files.join(", ")})`);
    if (arg("--report")) fs.writeFileSync(arg("--report"), reportMarkdown(missing));
    if (process.env.GITHUB_OUTPUT) fs.appendFileSync(process.env.GITHUB_OUTPUT, `blocked=${missing.length > 0}\n`);
  } else {
    console.error("usage: usage.mjs --write | --check | --against <new.json> --base <old.json> [--report <file.md>]");
    process.exit(2);
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main(process.argv.slice(2));
