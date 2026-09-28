import * as React from "react";
import { cn } from "@/lib/utils";
import type { PaceTrackData } from "./pace-data";

export interface PaceTrackProps extends PaceTrackData {
  /** Colours the gap between you and the cohort amber when behind. */
  behind: boolean;
  className?: string;
}

/**
 * You vs your cohort across the course's modules: one segment per module, a "You" marker above
 * and a "Cohort" marker below. The drawing is aria-hidden; the caption under it is the text
 * equivalent and is always visible.
 */
export function PaceTrack({ you, cohort, total, behind, className }: PaceTrackProps) {
  const modules = Array.from({ length: total }, (_, i) => i + 1);
  const cols = { gridTemplateColumns: `repeat(${total}, minmax(0, 1fr))` };
  const youCol = Math.max(you, 1);

  const youText = you === 0 ? "You: not started yet" : `You: Module ${you} of ${total}`;
  const cohortText = `Your cohort: Module ${cohort} of ${total}`;
  const gapText =
    you === 0
      ? "You can start from Module 1 whenever you are ready."
      : you < cohort
        ? `${cohort - you} ${cohort - you === 1 ? "module" : "modules"} between you and your cohort.`
        : you > cohort
          ? `${you - cohort} ${you - cohort === 1 ? "module" : "modules"} ahead of your cohort.`
          : "You are in the same module as your cohort.";

  return (
    <figure className={cn("flex flex-col gap-2", className)}>
      <div aria-hidden="true" className="flex flex-col gap-1.5">
        {/* You marker */}
        <div className="grid gap-1" style={cols}>
          {modules.map((m) => (
            <div key={m} className="flex justify-center">
              {m === youCol ? (
                <span className="sk-text-xs-semibold inline-flex flex-col items-center text-sko-text-primary">
                  <span className="rounded-full bg-sko-bg-primary px-2 text-sko-text-on-primary">You</span>
                  <span className="h-1.5 w-0.5 bg-sko-bg-primary" />
                </span>
              ) : null}
            </div>
          ))}
        </div>

        {/* Module segments */}
        <div className="grid gap-1" style={cols}>
          {modules.map((m) => {
            const done = you > 0 && m < you;
            const current = you > 0 && m === you;
            const gap = behind && m > you && m <= cohort;
            return (
              <span
                key={m}
                className={cn(
                  "h-3 rounded-sm",
                  done && "bg-sko-bg-primary",
                  current && "bg-sko-bg-primary-soft ring-2 ring-inset ring-sko-border-primary",
                  gap && "border border-dashed border-sko-border-warning bg-sko-bg-warning-soft",
                  !done && !current && !gap && "bg-sko-bg-muted",
                )}
              />
            );
          })}
        </div>

        {/* Module numbers */}
        <div className="grid gap-1" style={cols}>
          {modules.map((m) => (
            <span key={m} className="sk-text-xs-medium text-center text-sko-text-subtle">
              M{m}
            </span>
          ))}
        </div>

        {/* Cohort marker */}
        <div className="grid gap-1" style={cols}>
          {modules.map((m) => (
            <div key={m} className="flex justify-center">
              {m === cohort ? (
                <span className="sk-text-xs-semibold inline-flex flex-col items-center text-sko-text-muted">
                  <span className="h-1.5 w-0.5 bg-sko-bg-strong" />
                  <span className="rounded-full bg-sko-bg-page px-2 ring-1 ring-inset ring-sko-border-strong">
                    Cohort
                  </span>
                </span>
              ) : null}
            </div>
          ))}
        </div>
      </div>

      <figcaption className="sk-text-sm-regular text-sko-text-muted">
        <span className="sk-text-sm-semibold text-sko-text-default">{youText}</span>
        {" · "}
        {cohortText}. {gapText}
      </figcaption>
    </figure>
  );
}
