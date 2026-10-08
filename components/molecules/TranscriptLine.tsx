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
  onSeek,
  onAddNote,
  onEditNote,
  className,
}: TranscriptLineProps) {
  const stacked = active && device === "mobile";
  return (
    <div
      className={cn(
        "group flex items-start gap-3 px-4 py-3 transition-colors",
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
              className="size-2 shrink-0 rounded-full bg-current text-sko-icon-primary"
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
          className="sk-text-body-small-semibold flex shrink-0 items-center gap-1 self-start rounded-full bg-sko-bg-primary-soft py-1 pl-2 pr-3 text-sko-text-primary"
        >
          <Icon icon={hasNote ? Edit3 : Plus} size={14} />
          {hasNote ? "Edit" : "Note"}
        </button>
      ) : null}
    </div>
  );
}
