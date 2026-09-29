import * as React from "react";
import { cn } from "@/lib/utils";
import { coverArt, type Ink, type Shape } from "./cover-art";

const fill = (ink: Ink): React.CSSProperties => ({ fill: `var(--al-p-${ink})` });

function ShapeEl({ s, clipId }: { s: Shape; clipId: string }) {
  const clipPath = "clip" in s && s.clip ? `url(#${clipId})` : undefined;
  switch (s.kind) {
    case "rect":
      return <rect x={s.x} y={s.y} width={s.w} height={s.h} style={fill(s.ink)} />;
    case "circle":
      return <circle cx={s.cx} cy={s.cy} r={s.r} style={fill(s.ink)} clipPath={clipPath} />;
    case "path":
      return <path d={s.d} style={fill(s.ink)} clipPath={clipPath} />;
    case "line":
      return <line x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} strokeWidth={s.w} style={{ stroke: `var(--al-p-${s.ink})` }} />;
  }
}

/**
 * A course's sleeve art, generated from its id. Decorative: the course title always sits next to it in text,
 * so the art is hidden from assistive tech.
 */
export function Cover({ id, className, grain = true }: { id: string; className?: string; grain?: boolean }) {
  const art = coverArt(id);
  const uid = React.useId().replace(/:/g, "");
  const clipId = `al-clip-${uid}`;
  const grainId = `al-grain-${uid}`;
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true" focusable="false" className={cn("al-cover", className)} preserveAspectRatio="xMidYMid slice">
      <defs>
        {art.clipA ? (
          <clipPath id={clipId}>
            {art.clipA.kind === "circle" ? (
              <circle cx={art.clipA.cx} cy={art.clipA.cy} r={art.clipA.r} />
            ) : art.clipA.kind === "path" ? (
              <path d={art.clipA.d} />
            ) : null}
          </clipPath>
        ) : null}
        {grain ? (
          <filter id={grainId} x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="1.4" numOctaves="2" stitchTiles="stitch" seed={3} />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.55 0" />
          </filter>
        ) : null}
      </defs>
      <rect width="100" height="100" style={fill(art.ground)} />
      {art.shapes.map((s, i) => (
        <ShapeEl key={i} s={s} clipId={clipId} />
      ))}
      {grain ? <rect width="100" height="100" filter={`url(#${grainId})`} className="al-grain" /> : null}
    </svg>
  );
}

/** The record itself: grooves, a sheen, and a label printed in the sleeve's first ink. */
export function Disc({ id, className }: { id: string; className?: string }) {
  const art = coverArt(id);
  const grooves = [];
  for (let r = 47; r > 21; r -= 1.6) grooves.push(r);
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true" focusable="false" className={cn("al-disc", className)}>
      <circle cx="50" cy="50" r="50" className="al-disc-vinyl" />
      {grooves.map((r) => (
        <circle key={r} cx="50" cy="50" r={r} className="al-disc-groove" />
      ))}
      <path d="M50 50 L97 38 A48 48 0 0 1 98 58 Z M50 50 L3 62 A48 48 0 0 1 2 42 Z" className="al-disc-sheen" />
      <circle cx="50" cy="50" r="17" style={fill(art.a)} />
      <circle cx="50" cy="50" r="17" className="al-disc-label-ring" />
      <circle cx="50" cy="50" r="1.8" className="al-disc-hole" />
    </svg>
  );
}
