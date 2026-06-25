import * as React from "react";
import { Edit3, Plus } from "lucide-react";
import { Icon } from "@/lib/icons";
import { cn } from "@/lib/utils";

export interface TranscriptLineProps {
  ts: string;
  text: string;
  /** Active = currently-playing line (brand tint + 3px brand left border + pill). */
  active?: boolean;
  hasNote?: boolean;
  showDuration?: boolean;
  duration?: string;
  onSeek?: () => void;
  onAddNote?: () => void;
  onEditNote?: () => void;
  className?: string;
}

/**
 * A transcript line (DS: LMS / Transcript Line).
 * - Active line: bg-brand-section + 3px brand left border, timestamp in brand-primary,
 *   and a pill on the right — "✎ Edit" when Has note, else "+ Note".
 * - Note lines show a progress dot inline before the timestamp (Timecode group).
 */
export function TranscriptLine({
  ts,
  text,
  active = false,
  hasNote = false,
  showDuration = false,
  duration,
  onSeek,
  onAddNote,
  onEditNote,
  className,
}: TranscriptLineProps) {
  return (
    <div
      className={cn(
        // Transparent 3px border by default keeps text from shifting when a line becomes active.
        "group flex items-start gap-3 border-l-[3px] px-4 py-3 transition-colors",
        active
          ? "border-sk-border-brand bg-sk-bg-brand-section"
          : "border-transparent hover:bg-sk-bg-secondary",
        className,
      )}
    >
      <button type="button" onClick={onSeek} className="flex min-w-0 flex-1 items-start gap-3 text-left">
        {/* Timecode: dot (only when the line has a note) + timestamp, grouped. */}
        <span className="flex shrink-0 items-center gap-3">
          {hasNote ? (
            <span
              className="size-2 shrink-0 rounded-full bg-sk-fg-progress"
              aria-label="Has note"
              role="img"
            />
          ) : null}
          <span
            className={cn(
              "sk-text-xs-medium whitespace-nowrap",
              active ? "text-sk-text-brand-primary" : "text-sk-text-tertiary",
            )}
          >
            {ts}
          </span>
        </span>
        <span className="sk-text-sm-regular min-w-0 flex-1 text-sk-text-primary">
          {text}
          {showDuration && duration ? (
            <span className="sk-text-xs-regular ml-2 text-sk-text-tertiary">{duration}</span>
          ) : null}
        </span>
      </button>

      {active ? (
        <button
          type="button"
          onClick={hasNote ? onEditNote : onAddNote}
          aria-label={`${hasNote ? "Edit" : "Add"} note at ${ts}`}
          className="sk-text-xs-semibold flex shrink-0 items-center gap-1 self-stretch rounded-full bg-sk-bg-brand-section py-1 pl-2 pr-3 text-sk-text-brand-secondary"
        >
          <Icon icon={hasNote ? Edit3 : Plus} size={14} />
          {hasNote ? "Edit" : "Note"}
        </button>
      ) : null}
    </div>
  );
}
