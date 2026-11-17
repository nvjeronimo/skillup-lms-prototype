import * as React from "react";
import { Check, UploadCloud, X } from "lucide-react";
import { Icon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import styles from "./FileUploadZone.module.css";

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
    <div className={cn(styles.zone, className)}>
      <p className={`sk-text-body-large-semibold ${styles.heading}`}>Upload files</p>

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
        className={cn(styles.drop, dragOver ? styles.dragOver : styles.dropIdle)}
      >
        <span className={styles.dropIcon}>
          <Icon icon={UploadCloud} size={22} />
        </span>
        <p className={`sk-text-body-medium-medium ${styles.prompt}`}>
          Drop files here, or{" "}
          <span className={`sk-text-body-medium-semibold ${styles.browse}`}>browse files</span>
        </p>
        <p className={`sk-text-body-medium-regular ${styles.limits}`}>
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
        <p className={`sk-text-body-medium-regular ${styles.uploadedLabel}`}>
          Uploaded files{" "}
          <span className={`sk-text-body-medium-semibold ${styles.count}`}>
            {doneCount} of {requiredCount} required
          </span>
        </p>
        <div className={styles.files}>
          {uploadedFiles.map((f) => (
            <div
              key={f.id}
              className={styles.file}
            >
              <span className={`sk-text-label-small-semibold ${styles.type}`}>
                {f.type}
              </span>
              <div className={styles.fileText}>
                <p className={`sk-text-body-medium-semibold ${styles.name}`}>{f.name}</p>
                <p className={`sk-text-body-small-regular ${styles.size}`}>{f.size}</p>
              </div>
              {f.status === "done" ? (
                <span className={`sk-text-body-small-medium ${styles.done}`}>
                  <Icon icon={Check} size={14} /> Uploaded
                </span>
              ) : f.status === "uploading" ? (
                <span className={`sk-text-body-small-medium ${styles.uploading}`}>Uploading…</span>
              ) : (
                <span className={`sk-text-body-small-medium ${styles.failed}`}>Failed</span>
              )}
              <button
                type="button"
                onClick={() => onRemove?.(f.id)}
                aria-label={`Remove ${f.name}`}
                className={styles.remove}
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
