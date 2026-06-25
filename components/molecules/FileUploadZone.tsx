"use client";

import * as React from "react";
import { Check, UploadCloud, X } from "lucide-react";
import { Icon } from "@/lib/icons";
import { cn } from "@/lib/utils";

export interface UploadedFile {
  id: string;
  name: string;
  size: string;
  type: string;
  status: "uploading" | "done" | "error";
}

export interface FileUploadZoneProps {
  acceptedTypes?: string[];
  maxSizeMB?: number;
  requiredCount?: number;
  uploadedFiles?: UploadedFile[];
  onBrowse?: (files: FileList) => void;
  onRemove?: (id: string) => void;
  className?: string;
}

const DEFAULT_FILES: UploadedFile[] = [
  { id: "u1", name: "process-map.pdf", size: "320 KB", type: "PDF", status: "done" },
  { id: "u2", name: "analysis.docx", size: "88 KB", type: "DOCX", status: "uploading" },
];

/**
 * Drag-drop + browse upload zone for assignment submissions (Peer-graded screen).
 * The hidden <input type="file"> is driven by the visible "browse files" button.
 */
export function FileUploadZone({
  acceptedTypes = ["PDF", "DOCX", "MD", "TXT"],
  maxSizeMB = 25,
  requiredCount = 3,
  uploadedFiles = DEFAULT_FILES,
  onBrowse,
  onRemove,
  className,
}: FileUploadZoneProps) {
  const [dragOver, setDragOver] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const doneCount = uploadedFiles.filter((f) => f.status === "done").length;

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <p className="sk-text-md-semibold text-sk-text-primary">Upload files</p>

      <div
        role="button"
        tabIndex={0}
        aria-label="Upload submission files"
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          if (e.dataTransfer.files?.length) onBrowse?.(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        className={cn(
          "flex flex-col items-center gap-3 rounded-xl border-2 border-dashed px-8 py-6 text-center transition-colors",
          dragOver
            ? "border-sk-border-brand bg-sk-bg-brand-primary"
            : "border-sk-border-brand bg-sk-bg-brand-section",
        )}
      >
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-sk-border-secondary bg-sk-bg-primary text-sk-text-brand-secondary">
          <Icon icon={UploadCloud} size={22} />
        </span>
        <p className="sk-text-sm-medium text-sk-text-secondary">
          Drop files here, or{" "}
          <span className="sk-text-sm-semibold text-sk-text-brand-secondary">browse files</span>
        </p>
        <p className="sk-text-xs-regular text-sk-text-tertiary">
          {acceptedTypes.join(", ")} · {maxSizeMB} MB max per file
        </p>
        <input
          ref={inputRef}
          type="file"
          multiple
          hidden
          onChange={(e) => e.target.files && onBrowse?.(e.target.files)}
        />
      </div>

      <div aria-live="polite">
        <p className="sk-text-sm-regular mb-2 text-sk-text-secondary">
          Uploaded files{" "}
          <span className="sk-text-sm-semibold text-sk-text-primary">
            {doneCount} of {requiredCount} required
          </span>
        </p>
        <div className="flex flex-col gap-2">
          {uploadedFiles.map((f) => (
            <div
              key={f.id}
              className="flex items-center gap-3 rounded-lg border border-sk-border-secondary p-3"
            >
              <span className="sk-text-2xs-semibold inline-flex h-8 w-8 shrink-0 items-center justify-center rounded bg-sk-bg-brand-section text-sk-text-brand-secondary">
                {f.type}
              </span>
              <div className="min-w-0 flex-1">
                <p className="sk-text-sm-semibold truncate text-sk-text-primary">{f.name}</p>
                <p className="sk-text-xs-regular text-sk-text-tertiary">{f.size}</p>
              </div>
              {f.status === "done" ? (
                <span className="sk-text-xs-medium inline-flex items-center gap-1 text-sk-text-success-primary">
                  <Icon icon={Check} size={14} /> Uploaded
                </span>
              ) : f.status === "uploading" ? (
                <span className="sk-text-xs-medium text-sk-text-tertiary">Uploading…</span>
              ) : (
                <span className="sk-text-xs-medium text-sk-text-error-primary">Failed</span>
              )}
              <button
                type="button"
                onClick={() => onRemove?.(f.id)}
                aria-label={`Remove ${f.name}`}
                className="text-sk-text-tertiary hover:text-sk-text-error-primary"
              >
                <Icon icon={X} size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
