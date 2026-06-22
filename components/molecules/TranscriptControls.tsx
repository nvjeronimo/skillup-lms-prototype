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

/** Tab-row controls for the transcript: Language · Download transcript · Add Note. */
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
        <label className="lms-text-sm-medium flex items-center gap-1.5 text-lms-text-secondary">
          <span className="hidden sm:inline">Language:</span>
          <span className="relative">
            <select
              aria-label="Caption language"
              value={currentLanguage}
              onChange={(e) => onLanguageChange?.(e.target.value)}
              className="lms-text-sm-medium appearance-none bg-transparent pr-5 text-lms-text-primary outline-none"
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
              className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-lms-text-tertiary"
            />
          </span>
        </label>
      ) : null}

      {showDownload ? (
        <button
          type="button"
          onClick={onDownload}
          className="lms-text-sm-medium inline-flex items-center gap-1.5 text-lms-text-brand-secondary hover:underline"
        >
          <Icon icon={Download} size={16} />
          <span className="hidden md:inline">Download transcript</span>
        </button>
      ) : null}

      {showAddNote ? (
        <button
          type="button"
          onClick={onAddNote}
          className="lms-text-sm-semibold inline-flex items-center gap-1 text-lms-text-brand-secondary hover:underline"
        >
          <Icon icon={Plus} size={16} />
          Add Note
        </button>
      ) : null}
    </div>
  );
}
