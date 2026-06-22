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
          ? "border-lms-border-brand bg-lms-bg-brand-section"
          : "border-transparent hover:bg-lms-bg-secondary",
        className,
      )}
    >
      <button type="button" onClick={onSeek} className="flex min-w-0 flex-1 items-start gap-3 text-left">
        {/* Timecode: dot (only when the line has a note) + timestamp, grouped. */}
        <span className="flex shrink-0 items-center gap-3">
          {hasNote ? (
            <span
              className="size-2 shrink-0 rounded-full bg-lms-fg-progress"
              aria-label="Has note"
              role="img"
            />
          ) : null}
          <span
            className={cn(
              "lms-text-xs-medium whitespace-nowrap",
              active ? "text-lms-text-brand-primary" : "text-lms-text-tertiary",
            )}
          >
            {ts}
          </span>
        </span>
        <span className="lms-text-sm-regular min-w-0 flex-1 text-lms-text-primary">
          {text}
          {showDuration && duration ? (
            <span className="lms-text-xs-regular ml-2 text-lms-text-tertiary">{duration}</span>
          ) : null}
        </span>
      </button>

      {active ? (
        <button
          type="button"
          onClick={hasNote ? onEditNote : onAddNote}
          aria-label={`${hasNote ? "Edit" : "Add"} note at ${ts}`}
          className="lms-text-xs-semibold flex shrink-0 items-center gap-1 self-stretch rounded-full bg-lms-bg-brand-section py-1 pl-2 pr-3 text-lms-text-brand-secondary"
        >
          <Icon icon={hasNote ? Edit3 : Plus} size={14} />
          {hasNote ? "Edit" : "Note"}
        </button>
      ) : null}
    </div>
  );
}
