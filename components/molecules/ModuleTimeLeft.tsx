import * as React from "react";
import { Clock } from "lucide-react";
import { iconStroke, cn } from "@/lib/utils";

export interface ModuleTimeLeftProps {
  /** e.g. "1 h 20 min remaining". */
  summary: string;
  /** per-type breakdown chips, e.g. [{ label: "2 videos" }, { label: "1 reading" }]. */
  breakdown?: { label: string }[];
  className?: string;
}

/** Granular time-remaining chip with optional per-topic-type breakdown. */
export function ModuleTimeLeft({ summary, breakdown = [], className }: ModuleTimeLeftProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 rounded-lg bg-sko-bg-subtle px-3 py-2.5",
        className,
      )}
    >
      <div className="flex items-center gap-1.5 text-sko-text-muted">
        <Clock size={14} strokeWidth={iconStroke(14)} />
        <span className="sk-text-xs-medium">{summary}</span>
      </div>
      {breakdown.length ? (
        <div className="flex flex-wrap gap-1.5">
          {breakdown.map((b) => (
            <span
              key={b.label}
              className="sk-text-2xs-medium rounded bg-sko-bg-page px-1.5 py-0.5 text-sko-text-subtle"
            >
              {b.label}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}
