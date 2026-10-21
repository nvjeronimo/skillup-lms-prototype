#!/usr/bin/env node
/**
 * Token guardrail — enforces the design-system Definition of Done (see AUDIT.md §5).
 * Scans component/app/lib source for the bug classes the audit found:
 *   1. Raw colors           — hex / rgb / hsl literals (colours must be --color-* / sko-* tokens)
 *   2. Token-role inversion — a TEXT token (`sk-text-*`) used in a bg/border position
 *                             (root cause of the dark-mode contrast breaks)
 *   3. Legacy colour names — the v3.2 sk-bg-/sk-text-/sk-fg-/sk-border- vocabulary
 *   4. Raw typography       — Tailwind text-size / font-weight utilities instead of `.sk-text-*`
 *   5. Raw motion           — hand-typed durations / delays / curves, bare `transition` (use motion tokens)
 *   6. Raw radius           — Tailwind size radii (rounded-sm/md/lg/xl/…, rounded-[Npx], bare `rounded`)
 *                             instead of the six role radii in tokens/radius.css
 *   7. Popup without motion — a file-level rule (FILE_RULES), read with comments stripped:
 *                             a file that opens a popup panel (calls useDisclosure, renders
 *                             role="menu"/"listbox", or an aria-haspopup trigger other than
 *                             "dialog") must give it the motion system (a menu/sheet/pop/flyout
 *                             class, useExitTransition, or the `mounted` presence useDisclosure
 *                             returns), AND, if it has `panelProps` or a menu/listbox role, must
 *                             not render a panel on a raw guard `{open ? (` / `{x.open ? (` /
 *                             `{langOpen ? (` (a second menu reverted next to a converted one).
 *                             Known false positives: a static role="listbox" that is never
 *                             mounted conditionally, or an aria-haspopup="dialog" trigger whose
 *                             value is not a literal "dialog" (dialogs themselves are covered by
 *                             useDialog/OverlayPanel and skipped). Silence one with the escape
 *                             hatch below on the line above the reported line.
 *                             The comment stripper is not string-aware: a `//` or `/*` inside a
 *                             string literal (other than right after `:`, a quote, a backtick or
 *                             a backslash) is treated as a comment. If that ever hides or fakes a
 *                             popup-motion hit, use the escape hatch.
 *
 * Escape hatch: append `// token-lint-disable-next-line <reason>` on the line above,
 * or add a path to ALLOW. Exits non-zero on any violation. Run: `npm run lint:tokens`.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const SCAN_DIRS = ["components", "app", "lib"];
// Files intentionally exempt (colours live only in tokens/*.css).
// The motion-token test asserts the raw token values, so it has to spell them out.
const ALLOW = new Set(["lib/motion/tokens.test.ts"]);

const RULES = [
  {
    id: "raw-color",
    // hex (#abc / #aabbcc / #aabbccdd) or rgb()/rgba()/hsl()/hsla()
    re: /#[0-9a-fA-F]{3,8}\b|\b(?:rgba?|hsla?)\s*\(/,
    msg: "raw colour literal — use a --sk-* token / sk-* utility (colours belong in tokens/*.css)",
  },
  {
    id: "token-role",
    // a TEXT token used as a fill / gradient stop (surface role) — this is the class
    // that inverts under content in dark mode. Borders/rings/outlines are lines that
    // adapt fine, so they are intentionally not flagged here.
    re: /\b(?:bg|fill|from|via|to)-(?:sk-text-|sko-text-|sko-icon-)/,
    msg: "text/icon token used as a surface/fill — use a bg token (text tokens invert between light/dark, breaking content contrast)",
  },
  {
    id: "legacy-colour",
    // the v3.2 colour vocabulary: sk-bg-*, sk-text-*, sk-fg-*, sk-border-* classes and --sk-* colour vars.
    // Components use the element-first sko-* classes / --color-* vars (the DS names).
    re: /(?<![\w-])[a-z-]+-sk-(?:bg|text|fg|border)-|var\(--sk-(?:bg|text|fg|border)-/,
    msg: "deprecated v3.2 colour name — use the DS element-first sko-* class or --color-* var",
  },
  {
    id: "raw-type",
    // Tailwind font-size or font-weight utilities (not the sk-text-* classes nor text-align/color)
    re: /(?<![\w-])text-(?:xs|sm|base|lg|xl|[2-9]xl)(?![\w-])|(?<![\w-])font-(?:thin|extralight|light|normal|medium|semibold|bold|extrabold|black)(?![\w-])/,
    msg: "raw Tailwind typography — use a .sk-text-* class",
  },
  {
    id: "raw-motion",
    // Tailwind duration-<n>/delay-<n>/duration-[…], ease-in|out|in-out|linear, cubic-bezier(),
    // "<n>ms" (or a bare/eased "<n>s") inside a string literal, or a bare `transition` / `transition-all` class.
    // Motion lives in tokens/motion.css; use duration-short*/ease-standard*/delay-* and name the property.
    re: /(?<![\w-])(?:duration|delay)-(?:\d+|\[)|(?<![\w-])ease-(?:in|out|in-out|linear)(?![\w-])|cubic-bezier\(|["'`][^"'`]*\b\d*\.?\d+ms\b[^"'`]*["'`]|["'`]\s*\d*\.?\d+s\s*["'`]|["'`][^"'`]*\b\d*\.?\d+s (?:ease|linear|cubic)[^"'`]*["'`]|(?<![\w-])transition(?:-all)?(?=["'`\s])/,
    msg: "raw motion — use a duration-/ease-/delay- motion token and name the transitioned property",
  },
  {
    id: "raw-radius",
    // rounded-sm|md|lg|xl|2xl|3xl|full|[…] (any side), or a bare `rounded` class inside a string literal.
    // The lab "training" world has its own radius tokens (tokens/lab-training.css) and course copy is prose.
    re: /(?<![\w-])rounded(?:-(?:t|b|l|r|s|e|tl|tr|br|bl))?-(?:sm|md|lg|xl|2xl|3xl|full|\[[^\]]+\])(?![\w-])|["'`][^"'`]*(?<![\w-])rounded(?=[\s"'`])[^"'`]*["'`]/,
    skip: /^(?:app\/lab\/training\/|components\/lab\/training\/|lib\/courses\/)/,
    msg: "raw radius — use a role radius: rounded-none / -inner / -control / -card / -card-inset / -track / -surface / -pill (tokens/radius.css)",
  },
];

/**
 * Rules over a whole file: `trigger` finds the first non-comment line that makes the rule apply
 * (the violation is reported there, and the usual escape hatch above that line silences it);
 * the file passes when its text matches `requires` anywhere.
 */
const FILE_RULES = [
  {
    id: "popup-motion",
    trigger:
      /(?<!function\s)\buseDisclosure\(|role=["'](?:menu|listbox)["']|["']?aria-haspopup["']?\s*[=:]\s*(?!["']dialog["'])/,
    requires:
      /sk-animate-(?:menu|menu-y|menu-up|sheet|pop|flyout)\b|\buseExitTransition\(|\.mounted\b|\bmounted\b[^}]*\}\s*=\s*useDisclosure\(/,
    // A panel mounted on the raw open flag skips its exit, even when the file passes `requires`.
    forbidsWhen: /\bpanelProps\b|role=["'](?:menu|listbox)["']/,
    forbids: /\{\s*(?:\w+\.)?(?:open|[a-z]\w*Open)\s*\?\s*\(/,
    msg: "popup panel without motion — render it on useDisclosure's `mounted` with .sk-animate-menu (or -menu-y / -menu-up / -sheet / -pop / -flyout), or on useExitTransition's `mounted` (motion-matrix R8, R10)",
  },
];

/** Blanks out // and /* *\/ comments (JSX ones too), keeping line breaks so line numbers hold. */
function stripComments(src) {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "))
    .replace(/(^|[^:"'`\\])\/\/.*$/gm, "$1");
}

function walk(dir, out) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const s = statSync(p);
    if (s.isDirectory()) {
      if (name === "node_modules" || name === ".next") continue;
      walk(p, out);
    } else if (/\.(tsx|ts)$/.test(name) && !name.endsWith(".stories.tsx")) {
      out.push(p);
    }
  }
}

const files = [];
for (const d of SCAN_DIRS) {
  try {
    walk(join(ROOT, d), files);
  } catch {
    /* dir may not exist */
  }
}

const violations = [];
for (const file of files) {
  const rel = relative(ROOT, file);
  if (ALLOW.has(rel)) continue;
  const lines = readFileSync(file, "utf8").split("\n");
  lines.forEach((line, i) => {
    if (/token-lint-disable/.test(lines[i - 1] || "")) return;
    if (/^(?:\/\/|\*|\/\*)/.test(line.trim())) return;
    for (const rule of RULES) {
      if (rule.skip && rule.skip.test(rel)) continue;
      if (rule.re.test(line)) {
        violations.push({ rel, line: i + 1, id: rule.id, msg: rule.msg, src: line.trim().slice(0, 100) });
      }
    }
  });
  const code = stripComments(lines.join("\n"));
  const codeLines = code.split("\n");
  const silenced = (at) => /token-lint-disable/.test(lines[at - 1] || "");
  for (const rule of FILE_RULES) {
    const at = codeLines.findIndex((line) => rule.trigger.test(line));
    if (at < 0) continue;
    if (!rule.requires.test(code) && !silenced(at)) {
      violations.push({ rel, line: at + 1, id: rule.id, msg: rule.msg, src: lines[at].trim().slice(0, 100) });
      continue;
    }
    if (rule.forbids && rule.forbidsWhen.test(code)) {
      codeLines.forEach((line, i) => {
        if (rule.forbids.test(line) && !silenced(i)) {
          violations.push({ rel, line: i + 1, id: rule.id, msg: rule.msg, src: lines[i].trim().slice(0, 100) });
        }
      });
    }
  }
}

if (violations.length === 0) {
  console.log(`✓ token-lint: ${files.length} files clean`);
  process.exit(0);
}

console.error(`✗ token-lint: ${violations.length} violation(s)\n`);
for (const v of violations) {
  console.error(`  ${v.rel}:${v.line}  [${v.id}]  ${v.msg}`);
  console.error(`      ${v.src}`);
}
console.error(`\nFix, or add \`// token-lint-disable-next-line <reason>\` above the line if intentional.`);
process.exit(1);
