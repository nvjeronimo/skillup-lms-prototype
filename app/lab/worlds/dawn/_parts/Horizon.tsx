import * as React from "react";
import { cn } from "@/lib/utils";
import type { Phase } from "./light";

export interface HorizonProps {
  /** The light this band rises to, 0..1 (the real completion). */
  light: number;
  phase: Phase;
  /** Position in the stack, for the one staggered rise. */
  index?: number;
  size: "hero" | "band" | "module";
  as?: "section" | "li" | "div";
  labelledBy?: string;
  /** What is written in the sky (kept in its dark upper half). */
  sky: React.ReactNode;
  /** What stands on the ground under the horizon. */
  children?: React.ReactNode;
  className?: string;
}

/**
 * One horizon band: a cyc sky lit to the band's level, its horizon line, and the ground below.
 * The light layers are decorative (aria-hidden); the phase is always also written in words by the caller.
 */
export function Horizon({ light, phase, index = 0, size, as = "section", labelledBy, sky, children, className }: HorizonProps) {
  const Tag = as;
  const style = { "--dw-target": Math.max(0, Math.min(1, light)), "--dw-i": index } as React.CSSProperties;
  return (
    <Tag className={cn("dw-band", className)} data-phase={phase.key} style={style} aria-labelledby={labelledBy}>
      <div className={cn("dw-sky flex flex-col", `dw-sky--${size}`)}>
        <span aria-hidden className="dw-l dw-l--cobalt" />
        <span aria-hidden className="dw-l dw-l--rose" />
        <span aria-hidden className="dw-l dw-l--day" />
        <span aria-hidden className="dw-l dw-l--zenith" />
        <span aria-hidden className="dw-l dw-l--grain" />
        <div className="dw-sky-content flex-1">{sky}</div>
        <span aria-hidden className="dw-horizon" />
      </div>
      {children ? <div className="dw-ground">{children}</div> : null}
    </Tag>
  );
}
