import * as React from "react";
import { Download } from "lucide-react";
import { Icon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import type { DownloadFile } from "@/lib/types";
import styles from "./FileItem.module.css";

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
      className={cn(styles.item, className)}
    >
      <span className={`sk-text-body-small-medium ${styles.type}`}>
        {type}
      </span>
      <div className={styles.text}>
        <p className={`sk-text-body-medium-medium ${styles.name}`}>{name}</p>
        <p className={`sk-text-body-small-medium ${styles.meta}`}>
          {size}
          {addedLabel ? ` · ${addedLabel}` : ""}
        </p>
      </div>
      <button
        type="button"
        onClick={onDownload}
        aria-label={`Download ${name}`}
        className={styles.download}
      >
        <Icon icon={Download} size={18} />
      </button>
    </div>
  );
}
