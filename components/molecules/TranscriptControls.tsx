"use client";

import * as React from "react";
import { ChevronDown, Download, Plus } from "lucide-react";
import { Icon } from "@/lib/icons";
import { cn } from "@/lib/utils";

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
 * Download + Add Note are DS Link Button_def (Type=Brand · Hierarchy=Primary · md),
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
    <div className={cn("flex items-center gap-3", className)}>
      {showLanguage ? (
        <label className="sk-text-sm-medium flex items-center gap-1.5 text-sko-text-muted">
          <span className="hidden sm:inline">Language:</span>
          <span className="relative">
            <select
              aria-label="Caption language"
              value={currentLanguage}
              onChange={(e) => onLanguageChange?.(e.target.value)}
              className="sk-text-sm-medium appearance-none bg-transparent pr-5 text-sko-text-default outline-none"
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
              className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-sko-icon-subtle"
            />
          </span>
        </label>
      ) : null}

      {showDownload ? (
        <button
          type="button"
          onClick={onDownload}
          aria-label="Download transcript"
          className="sk-text-sm-semibold inline-flex h-7 items-center gap-1 border-b border-sko-border-primary px-0.5 text-sko-text-primary hover:bg-sko-bg-faint"
        >
          <Icon icon={Download} size={16} className="text-sko-icon-primary" />
          <span className="hidden px-0.5 md:inline">Download transcript</span>
        </button>
      ) : null}

      {showAddNote ? (
        <button
          type="button"
          onClick={onAddNote}
          className="sk-text-sm-semibold inline-flex h-7 items-center gap-1 border-b border-sko-border-primary px-0.5 text-sko-text-primary hover:bg-sko-bg-faint"
        >
          <Icon icon={Plus} size={16} className="text-sko-icon-primary" />
          <span className="px-0.5">Add Note</span>
        </button>
      ) : null}
    </div>
  );
}
