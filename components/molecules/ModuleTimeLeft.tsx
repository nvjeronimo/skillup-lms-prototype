import * as React from "react";
import { cn } from "@/lib/utils";

export interface ModuleTimeLeftProps {
  /** One entry per remaining-work segment, e.g.
   *  ["20 min of videos left", "1h 47m of readings left", "1 graded assignment left"]. */
  segments: string[];
  className?: string;
}

/**
 * DS `LMS / Module Time-Left`: one horizontal row, 4/0/4/0 padding
 * (Spacing/xs), 8px gap (Spacing/md), no fill, radius or icon. Each segment is
 * body-small/Medium in `text/subtle`; the "·" separators between segments are
 * body-small/Medium in `icon/faint`. The row wraps when the segments are wider
 * than their container (e.g. the 280px sidebar), so it never overflows.
 */
export function ModuleTimeLeft({ segments, className }: ModuleTimeLeftProps) {
  return (
    <div className={cn("flex flex-wrap items-center gap-2 py-1", className)}>
      {segments.map((segment, i) => (
        <React.Fragment key={`${i}-${segment}`}>
          {i > 0 ? (
            <span aria-hidden className="sk-text-xs-medium text-sko-icon-faint">
              ·
            </span>
          ) : null}
          <span className="sk-text-xs-medium text-sko-text-subtle">{segment}</span>
        </React.Fragment>
      ))}
    </div>
  );
}
