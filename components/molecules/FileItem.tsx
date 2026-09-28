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
        "flex items-center gap-3 rounded-lg border border-sko-border-subtle bg-sko-bg-page py-3 pl-4 pr-3",
        className,
      )}
    >
      <span className="sk-text-xs-medium inline-flex shrink-0 items-center rounded border border-sko-border-subtle bg-sko-bg-subtle px-1.5 py-1 text-sko-text-muted">
        {type}
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <p className="sk-text-sm-medium truncate text-sko-text-default">{name}</p>
        <p className="sk-text-xs-medium text-sko-text-subtle">
          {size}
          {addedLabel ? ` · ${addedLabel}` : ""}
        </p>
      </div>
      <button
        type="button"
        onClick={onDownload}
        aria-label={`Download ${name}`}
        className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-sko-icon-primary transition-colors hover:bg-sko-bg-primary-soft"
      >
        <Icon icon={Download} size={18} />
      </button>
    </div>
  );
}
