"use client";

import { useId, useMemo } from "react";
import { cn } from "@/lib/utils";
import { ART_H, ART_W, makeArtwork, type Pigment } from "./art";

const paint = (p: Pigment) => ({ fill: `var(--ex-p-${p})` });

/**
 * The course's artwork, hung on the wall. Decorative: the course title beside it carries the meaning.
 * `lightUp` plays the world's one authored moment: the lights come up on the work.
 */
export function Artwork({ seed, className, lightUp = false }: { seed: string; className?: string; lightUp?: boolean }) {
  const art = useMemo(() => makeArtwork(seed), [seed]);
  const soft = `ex-soft-${useId().replace(/:/g, "")}`;
  return (
    <div className={cn("relative", className)}>
      {lightUp ? <span aria-hidden className="ex-pool" /> : null}
      <div className={cn("ex-frame aspect-[4/5] w-full", lightUp && "ex-lightup")}>
        <svg viewBox={`0 0 ${ART_W} ${ART_H}`} preserveAspectRatio="xMidYMid slice" aria-hidden focusable="false">
          <defs>
            <clipPath id={`${soft}-clip`}>
              <rect width={ART_W} height={ART_H} />
            </clipPath>
            <filter id={soft} x="-10%" y="-10%" width="120%" height="120%">
              <feGaussianBlur stdDeviation="5" />
            </filter>
          </defs>
          <g clipPath={`url(#${soft}-clip)`}>
            <rect width={ART_W} height={ART_H} style={paint(art.ground)} />
            {art.shapes.map((s, i) => {
              switch (s.k) {
                case "rect":
                  return (
                    <rect
                      key={i}
                      x={s.x}
                      y={s.y}
                      width={s.w}
                      height={s.h}
                      style={paint(s.fill)}
                      filter={s.soft ? `url(#${soft})` : undefined}
                      opacity={s.soft ? 0.94 : undefined}
                    />
                  );
                case "path":
                  return <path key={i} d={s.d} style={paint(s.fill)} transform={`translate(${s.tx} ${s.ty}) rotate(${s.rot} 50 50)`} />;
                case "circle":
                  return <circle key={i} cx={s.cx} cy={s.cy} r={s.r} style={paint(s.fill)} />;
                case "line":
                  return <line key={i} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} style={{ stroke: `var(--ex-p-${s.stroke})` }} strokeWidth={s.width} />;
              }
            })}
          </g>
        </svg>
      </div>
    </div>
  );
}
