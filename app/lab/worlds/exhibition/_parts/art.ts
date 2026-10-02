/**
 * One artwork per course, generated from the course id so the same course always hangs the same work.
 * Pure data (no React, no colours): pigments are names, resolved to --ex-p-* variables when drawn.
 *
 * Four grammars from post-war abstraction, never pictures of things, never more than three colours:
 *  - "forms":  one large curved form and one upright block, hard-edged;
 *  - "fields": two soft-edged colour fields floating on a dark ground;
 *  - "bands":  concentric bands swung from one corner;
 *  - "tiles":  a grid of arcs and half-discs, half the cells bare.
 */
export type Pigment = "paper" | "ink" | "vermilion" | "ochre" | "cobalt" | "teal" | "blush" | "sky" | "olive";

export type Shape =
  | { k: "rect"; x: number; y: number; w: number; h: number; fill: Pigment; soft?: boolean }
  | { k: "path"; d: string; fill: Pigment; tx: number; ty: number; rot: number }
  | { k: "circle"; cx: number; cy: number; r: number; fill: Pigment }
  | { k: "line"; x1: number; y1: number; x2: number; y2: number; stroke: Pigment; width: number };

export interface Artwork {
  grammar: "forms" | "fields" | "bands" | "tiles";
  ground: Pigment;
  shapes: Shape[];
}

export const ART_W = 400;
export const ART_H = 500;

type Pal = { ground: Pigment; inks: [Pigment, Pigment, Pigment] };

/** Each grammar has its own palettes: a colour field wants a dark ground, a hard edge a light one. */
const PALETTES: Record<Artwork["grammar"], Pal[]> = {
  forms: [
    { ground: "paper", inks: ["vermilion", "ink", "ochre"] },
    { ground: "blush", inks: ["ink", "vermilion", "paper"] },
    { ground: "sky", inks: ["cobalt", "paper", "vermilion"] },
    { ground: "paper", inks: ["teal", "ink", "blush"] },
    { ground: "ochre", inks: ["ink", "paper", "vermilion"] },
  ],
  fields: [
    { ground: "ink", inks: ["vermilion", "ochre", "blush"] },
    { ground: "olive", inks: ["ochre", "paper", "blush"] },
    { ground: "cobalt", inks: ["ink", "sky", "teal"] },
    { ground: "vermilion", inks: ["ochre", "blush", "ink"] },
  ],
  bands: [
    { ground: "paper", inks: ["cobalt", "vermilion", "ochre"] },
    { ground: "ink", inks: ["blush", "teal", "paper"] },
    { ground: "paper", inks: ["olive", "ochre", "ink"] },
  ],
  tiles: [
    { ground: "paper", inks: ["ink", "vermilion", "sky"] },
    { ground: "sky", inks: ["cobalt", "paper", "ink"] },
    { ground: "blush", inks: ["teal", "ink", "paper"] },
  ],
};

function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function rng(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const QUARTER = "M0 0 L100 0 A100 100 0 0 1 0 100 Z";
const HALF = "M0 100 A50 50 0 0 1 100 100 Z";

/** One large curved form and one upright block, hard-edged, on a bare ground. */
function forms(r: () => number, _ground: Pigment, inks: Pigment[]): Shape[] {
  const left = r() < 0.5;
  const rad = 250 + Math.round(r() * 90);
  const cx = left ? -40 + Math.round(r() * 60) : ART_W + 40 - Math.round(r() * 60);
  const cy = r() < 0.5 ? ART_H - 40 - Math.round(r() * 80) : 60 + Math.round(r() * 80);
  const bw = 58 + Math.round(r() * 30);
  const bh = 230 + Math.round(r() * 120);
  const bx = left ? ART_W - bw - 44 : 44;
  const by = cy > ART_H / 2 ? 40 : ART_H - bh - 40;
  return [
    { k: "circle", cx, cy, r: rad, fill: inks[0] },
    { k: "rect", x: bx, y: by, w: bw, h: bh, fill: inks[1] },
  ];
}

/** Two soft-edged fields floating on a dark ground; the upper one larger. */
function fields(r: () => number, _ground: Pigment, inks: Pigment[]): Shape[] {
  const m = 34 + Math.round(r() * 10);
  const gap = 22 + Math.round(r() * 16);
  const avail = ART_H - m * 2 - gap;
  const top = Math.round(avail * (0.56 + r() * 0.14));
  return [
    { k: "rect", x: m, y: m, w: ART_W - m * 2, h: top, fill: inks[0], soft: true },
    { k: "rect", x: m, y: m + top + gap, w: ART_W - m * 2, h: avail - top, fill: inks[1], soft: true },
  ];
}

/** Concentric bands swung from one corner, two colours on the ground, the rest left bare. */
function bands(r: () => number, ground: Pigment, inks: Pigment[]): Shape[] {
  const corners = [
    [0, ART_H],
    [ART_W, ART_H],
    [0, 0],
    [ART_W, 0],
  ] as const;
  const [cx, cy] = corners[Math.floor(r() * corners.length)];
  const step = 30 + Math.round(r() * 8);
  const seq: Pigment[] = [inks[0], ground, inks[1], ground];
  const out: Shape[] = [];
  let i = 0;
  for (let rad = step * 11; rad > 0; rad -= step) {
    out.push({ k: "circle", cx, cy, r: rad, fill: seq[i % seq.length] });
    i++;
  }
  return out;
}

/** A 4×5 grid of arcs and half-discs in two colours; half the cells stay bare. */
function tiles(r: () => number, ground: Pigment, inks: Pigment[]): Shape[] {
  const out: Shape[] = [];
  const two = [inks[0], inks[1]];
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 4; col++) {
      if (r() < 0.5) continue;
      const x = col * 100;
      const y = row * 100;
      const fill = two[Math.floor(r() * 2)];
      const rot = Math.floor(r() * 4) * 90;
      out.push({ k: "path", d: r() < 0.6 ? QUARTER : HALF, fill, tx: x, ty: y, rot });
    }
  }
  void ground;
  return out;
}

export function makeArtwork(seed: string): Artwork {
  const h = hash(seed);
  const r = rng(h);
  const grammar = (["forms", "fields", "bands", "tiles"] as const)[(h >>> 5) % 4];
  const pals = PALETTES[grammar];
  const pal = pals[(h >>> 13) % pals.length];
  const draw = { forms, fields, bands, tiles }[grammar];
  const shapes = draw(r, pal.ground, [...pal.inks]);
  return { grammar, ground: pal.ground, shapes };
}
