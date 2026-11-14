import * as React from "react";
import { Edit3, Plus } from "lucide-react";
import { Icon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import styles from "./TranscriptLine.module.css";

export interface TranscriptLineProps {
  ts: string;
  text: string;
  /** Active = currently-playing line (brand tint + 3px brand left bar + pill). */
  active?: boolean;
  hasNote?: boolean;
  showDuration?: boolean;
  duration?: string;
  /**
   * DS `Device` variant. Mobile + Active stacks the Note/Edit pill under the line
   * (VERTICAL, gap 12) instead of placing it on the right.
   */
  device?: "desktop" | "mobile";
  /**
   * A quote of the line, not a control (the anchor of a note in the Note-Editor, 14 Oct 2026):
   * no seek, no Note pill, no timecode. Same look as the line.
   */
  readOnly?: boolean;
  /**
   * Side padding of the row. DS Transcript-Line 1.1 (15 Oct 2026): Container/content-padding in the
   * transcript (the tab passes it per breakpoint); 16 when the line is a quote (Note-Item, Note-Editor).
   */
  padX?: string;
  onSeek?: () => void;
  onAddNote?: () => void;
  onEditNote?: () => void;
  className?: string;
}

/**
 * A transcript line (DS: LMS / Transcript Line, 19975:537556).
 * - Active line: bg/primary-soft + a 3px border/primary bar drawn inside the row
 *   (DS stroke is INSIDE, so content keeps its 16px inset in both states),
 *   timestamp in text/on-primary-soft, and a pill — "✎ Edit" when Has note, else "+ Note".
 *   Desktop: pill on the right, top-aligned. Mobile: pill below the line, left-aligned.
 * - Note lines show an 8px icon/primary dot before the timestamp (Timecode group).
 */
export function TranscriptLine({
  ts,
  text,
  active = false,
  hasNote = false,
  showDuration = false,
  duration,
  device = "desktop",
  readOnly = false,
  padX = styles.padX,
  onSeek,
  onAddNote,
  onEditNote,
  className,
}: TranscriptLineProps) {
  const stacked = active && device === "mobile";
  if (readOnly)
    return (
      // A span (block), so the quote can also sit inside a button (the note item opens on click).
      <span
        className={cn("sk-text-body-medium-regular", styles.quote, active && styles.active, className)}
      >
        {text}
      </span>
    );
  return (
    <div
      className={cn(
        // The active fill and its 3px bar ease in and out together (short3, standard).
        styles.line,
        padX,
        stacked && styles.stacked,
        active ? styles.active : styles.idle,
        className,
      )}
    >
      <button
        type="button"
        onClick={onSeek}
        className={cn(styles.seek, stacked ? styles.seekFull : styles.seekFill)}
      >
        {/* Timecode: dot (only when the line has a note) + timestamp, grouped. */}
        <span className={styles.timecode}>
          {hasNote ? (
            // Dot fill = icon/primary through currentColor: the token lint keeps icon tokens out of bg utilities.
            <span
              className={styles.noteDot}
              data-invented="notes: Open edX notes cannot anchor to a transcript line"
              aria-label="Has note"
              role="img"
            />
          ) : null}
          <span
            className={cn("sk-text-body-small-medium", active ? styles.tsActive : styles.ts)}
          >
            {ts}
          </span>
        </span>
        <span className={`sk-text-body-medium-regular ${styles.text}`}>
          {text}
          {showDuration && duration ? (
            <span className={`sk-text-body-small-regular ${styles.duration}`}>{duration}</span>
          ) : null}
        </span>
      </button>

      {active ? (
        <button
          type="button"
          onClick={hasNote ? onEditNote : onAddNote}
          aria-label={`${hasNote ? "Edit" : "Add"} note at ${ts}`}
          data-invented="notes: Open edX notes cannot anchor to a transcript line"
          className={`sk-text-body-small-semibold ${styles.notePill}`}
        >
          <Icon icon={hasNote ? Edit3 : Plus} size={14} />
          {hasNote ? "Edit" : "Note"}
        </button>
      ) : null}
    </div>
  );
}
