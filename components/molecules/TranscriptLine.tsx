import * as React from "react";
import { Edit3, Plus } from "lucide-react";
import { Icon } from "@/lib/icons";
import { cn } from "@/lib/utils";

export interface TranscriptLineProps {
  ts: string;
  text: string;
  /** Active = currently-playing line (brand tint + pill affordances). */
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
 * A transcript line. Active lines reveal a "+ Note" pill (when no note) or an
 * "✎ Edit" pill (when Has note=true). A note dot marks lines that have notes.
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
        "group flex gap-3 rounded-lg px-3 py-2.5 transition-colors",
        active ? "bg-lms-bg-brand-section" : "hover:bg-lms-bg-secondary",
        className,
      )}
    >
      {/* Note indicator dot — fixed gutter so text stays aligned. */}
      <span className="flex w-2 shrink-0 justify-center pt-2">
        {hasNote ? (
          <span
            className="h-2 w-2 rounded-full bg-lms-fg-progress"
            aria-label="Has note"
            role="img"
          />
        ) : null}
      </span>

      <button type="button" onClick={onSeek} className="flex flex-1 items-start gap-3 text-left">
        <span
          className={cn(
            "lms-text-sm-semibold w-10 shrink-0 pt-0.5",
            active ? "text-lms-text-brand-secondary" : "text-lms-text-tertiary",
          )}
        >
          {ts}
        </span>
        <span className="lms-text-sm-regular flex-1 text-lms-text-primary">
          {text}
          {showDuration && duration ? (
            <span className="lms-text-xs-regular ml-2 text-lms-text-tertiary">{duration}</span>
          ) : null}
        </span>
      </button>

      {active ? (
        <div className="flex shrink-0 items-start pt-0.5">
          {hasNote ? (
            <button
              type="button"
              onClick={onEditNote}
              className="lms-text-xs-semibold inline-flex items-center gap-1 rounded-full bg-lms-bg-primary px-2.5 py-1 text-lms-text-brand-secondary"
            >
              <Icon icon={Edit3} size={14} />
              Edit
            </button>
          ) : (
            <button
              type="button"
              onClick={onAddNote}
              className="lms-text-xs-semibold inline-flex items-center gap-1 rounded-full bg-lms-bg-primary px-2.5 py-1 text-lms-text-brand-secondary"
            >
              <Icon icon={Plus} size={14} />
              Note
            </button>
          )}
        </div>
      ) : null}
    </div>
  );
}
