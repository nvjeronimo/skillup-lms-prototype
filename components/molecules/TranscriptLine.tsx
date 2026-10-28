import * as React from "react";
import { Edit3, Plus } from "lucide-react";
import { Icon } from "@/lib/icons";
import { cn } from "@/lib/utils";

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
  padX = "px-4",
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
        className={cn(
          "sk-text-body-medium-regular block px-4 py-3 text-sko-text-default",
          active ? "bg-sko-bg-primary-soft shadow-[inset_3px_0_0_var(--color-border-primary)]" : "",
          className,
        )}
      >
        {text}
      </span>
    );
  return (
    <div
      className={cn(
        // The active fill and its 3px bar ease in and out together (short3, standard).
        "group flex items-start gap-3 py-3 transition-[background-color,box-shadow] duration-short3 ease-standard",
        padX,
        stacked && "flex-col",
        active
          ? "bg-sko-bg-primary-soft shadow-[inset_3px_0_0_var(--color-border-primary)]"
          : "hover:bg-sko-bg-subtle",
        className,
      )}
    >
      <button
        type="button"
        onClick={onSeek}
        className={cn("flex min-w-0 items-start gap-3 text-left", stacked ? "w-full" : "flex-1")}
      >
        {/* Timecode: dot (only when the line has a note) + timestamp, grouped. */}
        <span className="flex shrink-0 items-center gap-3">
          {hasNote ? (
            // Dot fill = icon/primary through currentColor: the token lint keeps icon tokens out of bg utilities.
            <span
              className="size-2 shrink-0 rounded-pill bg-current text-sko-icon-primary"
              data-invented="notes: Open edX notes cannot anchor to a transcript line"
              aria-label="Has note"
              role="img"
            />
          ) : null}
          <span
            className={cn(
              "sk-text-body-small-medium whitespace-nowrap",
              active ? "text-sko-text-on-primary-soft" : "text-sko-text-subtle",
            )}
          >
            {ts}
          </span>
        </span>
        <span className="sk-text-body-medium-regular min-w-0 flex-1 text-sko-text-default">
          {text}
          {showDuration && duration ? (
            <span className="sk-text-body-small-regular ml-2 text-sko-text-subtle">{duration}</span>
          ) : null}
        </span>
      </button>

      {active ? (
        <button
          type="button"
          onClick={hasNote ? onEditNote : onAddNote}
          aria-label={`${hasNote ? "Edit" : "Add"} note at ${ts}`}
          data-invented="notes: Open edX notes cannot anchor to a transcript line"
          className="sk-text-body-small-semibold flex shrink-0 items-center gap-1 self-start rounded-pill bg-sko-bg-primary-soft py-1 pl-2 pr-3 text-sko-text-primary"
        >
          <Icon icon={hasNote ? Edit3 : Plus} size={14} />
          {hasNote ? "Edit" : "Note"}
        </button>
      ) : null}
    </div>
  );
}
