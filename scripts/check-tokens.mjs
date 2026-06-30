#!/usr/bin/env node
/**
 * Token guardrail — enforces the design-system Definition of Done (see AUDIT.md §5).
 * Scans component/app/lib source for the bug classes the audit found:
 *   1. Raw colors           — hex / rgb / hsl literals (colours must be --sk-* tokens)
 *   2. Token-role inversion — a TEXT token (`sk-text-*`) used in a bg/border position
 *                             (root cause of the dark-mode contrast breaks)
 *   3. Raw typography       — Tailwind text-size / font-weight utilities instead of `.sk-text-*`
 *
 * Escape hatch: append `// token-lint-disable-next-line <reason>` on the line above,
 * or add a path to ALLOW. Exits non-zero on any violation. Run: `npm run lint:tokens`.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const SCAN_DIRS = ["components", "app", "lib"];
// Files intentionally exempt (none today — colours live only in tokens/*.css).
const ALLOW = new Set([]);

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
    re: /\b(?:bg|fill|from|via|to)-sk-text-/,
    msg: "text token used as a surface/fill — use a bg/fg/brand-stage token (text tokens invert between light/dark, breaking content contrast)",
  },
  {
    id: "raw-type",
    // Tailwind font-size or font-weight utilities (not the sk-text-* classes nor text-align/color)
    re: /(?<![\w-])text-(?:xs|sm|base|lg|xl|[2-9]xl)(?![\w-])|(?<![\w-])font-(?:thin|extralight|light|normal|medium|semibold|bold|extrabold|black)(?![\w-])/,
    msg: "raw Tailwind typography — use a .sk-text-* class",
  },
];

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
    for (const rule of RULES) {
      if (rule.re.test(line)) {
        violations.push({ rel, line: i + 1, id: rule.id, msg: rule.msg, src: line.trim().slice(0, 100) });
      }
    }
  });
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
