import * as React from "react";
import { cn } from "@/lib/utils";
import type { PaceTrackData } from "./pace-data";
import styles from "./PaceTrack.module.css";

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
    <figure className={cn(styles.track, className)}>
      <div aria-hidden="true" className={styles.drawing}>
        {/* You marker */}
        <div className={styles.row} style={cols}>
          {modules.map((m) => (
            <div key={m} className={styles.cell}>
              {m === youCol ? (
                <span className={`sk-text-body-small-semibold ${styles.marker} ${styles.youMarker}`}>
                  <span className={styles.youPill}>You</span>
                  <span className={`${styles.stem} ${styles.youStem}`} />
                </span>
              ) : null}
            </div>
          ))}
        </div>

        {/* Module segments */}
        <div className={styles.row} style={cols}>
          {modules.map((m) => {
            const done = you > 0 && m < you;
            const current = you > 0 && m === you;
            const gap = behind && m > you && m <= cohort;
            return (
              <span
                key={m}
                className={cn(
                  styles.segment,
                  done && styles.done,
                  current && styles.current,
                  gap && styles.gap,
                  !done && !current && !gap && styles.todo,
                )}
              />
            );
          })}
        </div>

        {/* Module numbers */}
        <div className={styles.row} style={cols}>
          {modules.map((m) => (
            <span key={m} className={`sk-text-body-small-medium ${styles.number}`}>
              M{m}
            </span>
          ))}
        </div>

        {/* Cohort marker */}
        <div className={styles.row} style={cols}>
          {modules.map((m) => (
            <div key={m} className={styles.cell}>
              {m === cohort ? (
                <span className={`sk-text-body-small-semibold ${styles.marker} ${styles.cohortMarker}`}>
                  <span className={`${styles.stem} ${styles.cohortStem}`} />
                  <span className={styles.cohortPill}>
                    Cohort
                  </span>
                </span>
              ) : null}
            </div>
          ))}
        </div>
      </div>

      <figcaption className={`sk-text-body-medium-regular ${styles.caption}`}>
        <span className={`sk-text-body-medium-semibold ${styles.captionStrong}`}>{youText}</span>
        {" · "}
        {cohortText}. {gapText}
      </figcaption>
    </figure>
  );
}
