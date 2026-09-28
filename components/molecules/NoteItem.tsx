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
        "rounded-lg border border-sko-border-subtle bg-sko-bg-page p-4 transition-colors hover:border-sko-border-default",
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onClick}
          className="sk-text-xs-medium text-sko-text-primary"
        >
          {ts}
        </button>
        <div className="flex items-center gap-2">
          {editedLabel ? (
            <span className="sk-text-xs-medium text-sko-text-subtle">{editedLabel}</span>
          ) : null}
          <button
            type="button"
            onClick={onEdit}
            aria-label="Edit note"
            className="text-sko-text-subtle transition-colors hover:text-sko-text-default"
          >
            <Icon icon={Edit3} size={16} />
          </button>
          <button
            type="button"
            onClick={onDelete}
            aria-label="Delete note"
            className="text-sko-text-subtle transition-colors hover:text-sko-text-error"
          >
            <Icon icon={Trash2} size={16} />
          </button>
        </div>
      </div>

      <button type="button" onClick={onClick} className="mt-1.5 block w-full text-left">
        <p className="sk-text-sm-regular border-l-[3px] border-sko-border-primary py-1.5 pl-3 text-sko-text-subtle">
          {anchorQuote}
        </p>
        <p className="sk-text-sm-regular mt-1.5 text-sko-text-default">{text}</p>
      </button>

      {tags.length ? (
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => onTagClick?.(tag)}
              className="sk-text-xs-medium rounded-full bg-sko-bg-subtle px-2 py-0.5 text-sko-text-subtle hover:text-sko-text-primary"
            >
              #{tag}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
