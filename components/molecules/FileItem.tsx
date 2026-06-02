import * as React from "react";
import { Download, FileText } from "lucide-react";
import { Icon } from "@/lib/icons";
import { Button } from "@/components/atoms/Button";
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

const TYPE_LABEL: Record<DownloadFile["type"], string> = {
  PDF: "PDF",
  DOCX: "DOC",
  XLSX: "XLS",
  PPTX: "PPT",
  ZIP: "ZIP",
};

/** Downloadable file row: type icon + name + size/date + download button. */
export function FileItem({ type, name, size, addedLabel, onDownload, className }: FileItemProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-lg border border-lms-border-secondary p-3",
        className,
      )}
    >
      <span className="relative inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-lms-bg-brand-section text-lms-text-brand-secondary">
        <Icon icon={FileText} size={20} />
        <span className="lms-text-2xs-semibold absolute -bottom-1 rounded bg-lms-bg-brand-solid px-1 text-lms-text-primary-on-brand">
          {TYPE_LABEL[type]}
        </span>
      </span>
      <div className="min-w-0 flex-1">
        <p className="lms-text-sm-semibold truncate text-lms-text-primary">{name}</p>
        <p className="lms-text-xs-regular text-lms-text-tertiary">
          {size}
          {addedLabel ? ` · ${addedLabel}` : ""}
        </p>
      </div>
      <Button variant="secondary" size="sm" leftIcon={Download} onClick={onDownload}>
        Download
      </Button>
    </div>
  );
}
