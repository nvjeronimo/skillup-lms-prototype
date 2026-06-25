import * as React from "react";
import { Download } from "lucide-react";
import { Icon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import type { DownloadFile } from "@/lib/types";

export interface FileItemProps {
  type: DownloadFile["type"];
  name: string;
  size: string;
  addedLabel?: string;
  onDownload?: () => void;
  className?: string;
}

/** Downloadable file row: gray type chip + name + size + icon-only download (matches DS). */
export function FileItem({ type, name, size, addedLabel, onDownload, className }: FileItemProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-lg border border-sk-border-secondary px-4 py-3",
        className,
      )}
    >
      <span className="sk-text-2xs-semibold inline-flex h-9 w-11 shrink-0 items-center justify-center rounded-md bg-sk-bg-secondary text-sk-text-tertiary">
        {type}
      </span>
      <div className="min-w-0 flex-1">
        <p className="sk-text-sm-semibold truncate text-sk-text-primary">{name}</p>
        <p className="sk-text-xs-regular text-sk-text-tertiary">
          {size}
          {addedLabel ? ` · ${addedLabel}` : ""}
        </p>
      </div>
      <button
        type="button"
        onClick={onDownload}
        aria-label={`Download ${name}`}
        className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sk-text-brand-secondary transition-colors hover:bg-sk-bg-brand-section"
      >
        <Icon icon={Download} size={20} />
      </button>
    </div>
  );
}
