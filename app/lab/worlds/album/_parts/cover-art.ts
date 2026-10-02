/**
 * Generative sleeve art for the Album world. Pure and deterministic: the same course id always prints the
 * same cover. The output names colours by ink (keys), never by value; the CSS in tokens/lab-album.css owns
 * the actual pigments, so no raw colour lives in app/.
 *
 * The house style is a single imaginary label's: flat screen-print inks, one ground and two inks per sleeve,
 * geometry on a 100-unit square, and knock-outs where shapes overlap instead of transparency.
 */

export type Ink = "bone" | "ink" | "vermilion" | "cobalt" | "ochre" | "rose" | "plum" | "moss" | "sky" | "teal";

export type Shape =
  | { kind: "rect"; x: number; y: number; w: number; h: number; ink: Ink }
  | { kind: "circle"; cx: number; cy: number; r: number; ink: Ink; clip?: "a" }
  | { kind: "path"; d: string; ink: Ink; clip?: "a" }
  | { kind: "line"; x1: number; y1: number; x2: number; y2: number; ink: Ink; w: number };

export interface CoverArt {
  ground: Ink;
  a: Ink;
  b: Ink;
  /** Shapes in paint order. */
  shapes: Shape[];
  /** A clip region (the "a" shape) used for knock-outs. */
  clipA?: Shape;
}

/** Ground, first ink, second ink. Chosen as pairs a printer would pull, not as random picks. */
const PALETTES: [Ink, Ink, Ink][] = [
  ["bone", "vermilion", "cobalt"],
  ["cobalt", "ochre", "bone"],
  ["ochre", "ink", "vermilion"],
  ["rose", "plum", "vermilion"],
  ["moss", "sky", "bone"],
  ["teal", "bone", "ochre"],
  ["sky", "cobalt", "vermilion"],
  ["plum", "rose", "ochre"],
  ["bone", "ink", "teal"],
  ["vermilion", "bone", "ink"],
  ["rose", "cobalt", "ochre"],
  ["ochre", "moss", "bone"],
];

function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function rng(seed: number) {
  let t = seed;
  return () => {
    t = (t + 0x6d2b79f5) | 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

const r1 = (n: number) => Math.round(n * 10) / 10;

/** A quarter disc filling a square cell, its corner at one of four positions. */
function quarter(x: number, y: number, s: number, corner: number, ink: Ink): Shape {
  const c = [
    [x, y],
    [x + s, y],
    [x + s, y + s],
    [x, y + s],
  ][corner];
  const [cx, cy] = c;
  const sx = corner === 0 || corner === 3 ? 1 : -1;
  const sy = corner === 0 || corner === 1 ? 1 : -1;
  const d = `M${cx} ${cy} L${cx + sx * s} ${cy} A${s} ${s} 0 0 ${sx * sy > 0 ? 1 : 0} ${cx} ${cy + sy * s} Z`;
  return { kind: "path", d, ink };
}

export function coverArt(id: string): CoverArt {
  const h = hash(id);
  const rand = rng(h);
  // Palette and form are drawn from separately salted hashes so two courses rarely share both.
  const [ground, a, b] = PALETTES[hash(`${id}label`) % PALETTES.length];
  const composition = hash(`${id}side`) % 5;
  const shapes: Shape[] = [];
  let clipA: Shape | undefined;

  if (composition === 0) {
    // Orbit: a large disc, a smaller one crossing it, the overlap knocked out to the ground.
    const big = { cx: r1(30 + rand() * 25), cy: r1(35 + rand() * 30), r: r1(30 + rand() * 10) };
    const small = { cx: r1(big.cx + 22 + rand() * 14), cy: r1(big.cy - 18 + rand() * 36), r: r1(16 + rand() * 8) };
    clipA = { kind: "circle", ...big, ink: a };
    shapes.push({ kind: "line", x1: 0, y1: r1(12 + rand() * 8), x2: 100, y2: r1(12 + rand() * 8), ink: a, w: 1.2 });
    shapes.push({ kind: "circle", ...big, ink: a });
    shapes.push({ kind: "circle", ...small, ink: b });
    shapes.push({ kind: "circle", ...small, ink: ground, clip: "a" });
  } else if (composition === 1) {
    // Quarters: a 3 x 3 grid of quarter discs, the Bauhaus tile set.
    const s = 100 / 3;
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        const x = r1(col * s);
        const y = r1(row * s);
        const roll = rand();
        if (roll < 0.14) continue;
        if (roll < 0.26) {
          shapes.push({ kind: "rect", x, y, w: r1(s + 0.2), h: r1(s + 0.2), ink: b });
          continue;
        }
        shapes.push(quarter(x, y, r1(s), Math.floor(rand() * 4), (row + col) % 2 ? a : b));
      }
    }
  } else if (composition === 2) {
    // Bars: vertical bands of uneven width, one disc laid across them.
    let x = 0;
    let on = rand() > 0.5;
    while (x < 99) {
      const w = r1(Math.max(1, Math.min(100 - x, 5 + rand() * 13)));
      if (on) shapes.push({ kind: "rect", x: r1(x), y: 0, w, h: 100, ink: a });
      x += w;
      on = !on;
    }
    shapes.push({ kind: "circle", cx: r1(28 + rand() * 44), cy: r1(30 + rand() * 40), r: r1(20 + rand() * 8), ink: b });
  } else if (composition === 3) {
    // Arches: concentric rings rising from a corner, alternating the two inks and the ground.
    const fromLeft = rand() > 0.5;
    const cx = fromLeft ? 0 : 100;
    const inks: Ink[] = [a, ground, b, ground];
    const step = r1(9 + rand() * 4);
    let r = 128;
    let i = 0;
    while (r > 4) {
      shapes.push({ kind: "circle", cx, cy: 100, r: r1(r), ink: inks[i % inks.length] });
      r -= step;
      i++;
    }
  } else {
    // Split: the square cut on a diagonal, a disc sitting on the cut, half of it knocked out.
    const t = r1(8 + rand() * 30);
    const up = rand() > 0.5;
    const d = up ? `M0 ${r1(100 - t)} L100 ${t} L100 100 L0 100 Z` : `M0 ${t} L100 ${r1(100 - t)} L100 100 L0 100 Z`;
    clipA = { kind: "path", d, ink: a };
    const cx = r1(35 + rand() * 30);
    const cy = up ? r1(100 - t - ((100 - 2 * t) * cx) / 100) : r1(t + ((100 - 2 * t) * cx) / 100);
    const r = r1(18 + rand() * 8);
    shapes.push({ kind: "path", d, ink: a });
    shapes.push({ kind: "circle", cx, cy, r, ink: b });
    shapes.push({ kind: "circle", cx, cy, r, ink: ground, clip: "a" });
  }

  return { ground, a, b, shapes, clipA };
}
