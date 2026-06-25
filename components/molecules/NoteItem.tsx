import * as React from "react";
import { Edit3, Trash2 } from "lucide-react";
import { Icon } from "@/lib/icons";
import { cn } from "@/lib/utils";

export interface NoteItemProps {
  ts: string;
  anchorQuote: string;
  text: string;
  tags: string[];
  editedLabel?: string;
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onTagClick?: (tag: string) => void;
  className?: string;
}

/** A persisted note, anchored to a transcript line via the quoted anchor. */
export function NoteItem({
  ts,
  anchorQuote,
  text,
  tags,
  editedLabel,
  onClick,
  onEdit,
  onDelete,
  onTagClick,
  className,
}: NoteItemProps) {
  return (
    <div
      className={cn(
        "group rounded-lg border border-sk-border-secondary p-4 transition-colors hover:border-sk-border-primary",
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onClick}
          className="sk-text-sm-semibold text-sk-text-brand-secondary"
        >
          {ts}
        </button>
        <div className="flex items-center gap-2">
          {editedLabel ? (
            <span className="sk-text-xs-regular text-sk-text-tertiary">{editedLabel}</span>
          ) : null}
          <button
            type="button"
            onClick={onEdit}
            aria-label="Edit note"
            className="text-sk-text-tertiary opacity-0 transition-opacity hover:text-sk-text-primary group-hover:opacity-100"
          >
            <Icon icon={Edit3} size={16} />
          </button>
          <button
            type="button"
            onClick={onDelete}
            aria-label="Delete note"
            className="text-sk-text-tertiary opacity-0 transition-opacity hover:text-sk-text-error-primary group-hover:opacity-100"
          >
            <Icon icon={Trash2} size={16} />
          </button>
        </div>
      </div>

      <button type="button" onClick={onClick} className="mt-2 block w-full text-left">
        <p className="sk-text-sm-italic border-l-[3px] border-sk-border-brand pl-3 text-sk-text-tertiary">
          {anchorQuote}
        </p>
        <p className="sk-text-sm-regular mt-2 text-sk-text-primary">{text}</p>
      </button>

      {tags.length ? (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => onTagClick?.(tag)}
              className="sk-text-xs-medium rounded bg-sk-bg-secondary px-2 py-0.5 text-sk-text-tertiary hover:text-sk-text-brand-secondary"
            >
              #{tag}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
