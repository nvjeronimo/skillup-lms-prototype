import * as React from "react";
import { ChevronDown, Download, Plus } from "lucide-react";
import { Icon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import styles from "./TranscriptControls.module.css";

export interface TranscriptControlsProps {
  showLanguage?: boolean;
  showDownload?: boolean;
  showAddNote?: boolean;
  currentLanguage?: string;
  onLanguageChange?: (code: string) => void;
  onDownload?: () => void;
  onAddNote?: () => void;
  className?: string;
}

const LANGS = [
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
  { code: "fr", label: "Français" },
];

/**
 * Tab-row controls for the transcript: Language · Download transcript · Add Note.
 * Download + Add Note are DS Link Button (Type=Brand · Hierarchy=Primary · md),
 * with the 1px bottom stroke in border/primary (h-7 is border-box, so height stays 28).
 */
export function TranscriptControls({
  showLanguage = true,
  showDownload = true,
  showAddNote = true,
  currentLanguage = "en",
  onLanguageChange,
  onDownload,
  onAddNote,
  className,
}: TranscriptControlsProps) {
  return (
    <div className={cn(styles.controls, className)}>
      {showLanguage ? (
        <label className={`sk-text-body-medium-medium ${styles.language}`}>
          <span className={styles.languageLabel}>Language:</span>
          <span className={styles.selectWrap}>
            <select
              aria-label="Caption language"
              value={currentLanguage}
              onChange={(e) => onLanguageChange?.(e.target.value)}
              className={`sk-text-body-medium-medium ${styles.select}`}
            >
              {LANGS.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.label}
                </option>
              ))}
            </select>
            <ChevronDown
              size={14}
              strokeWidth={1.5}
              className={styles.chevron}
            />
          </span>
        </label>
      ) : null}

      {showDownload ? (
        <button
          type="button"
          onClick={onDownload}
          aria-label="Download transcript"
          className={`sk-text-body-medium-semibold ${styles.link}`}
        >
          <Icon icon={Download} size={16} className={styles.linkIcon} />
          <span className={styles.downloadLabel}>Download transcript</span>
        </button>
      ) : null}

      {showAddNote ? (
        <button
          type="button"
          onClick={onAddNote}
          className={`sk-text-body-medium-semibold ${styles.link}`}
        >
          <Icon icon={Plus} size={16} className={styles.linkIcon} />
          <span className={styles.linkLabel}>Add Note</span>
        </button>
      ) : null}
    </div>
  );
}
