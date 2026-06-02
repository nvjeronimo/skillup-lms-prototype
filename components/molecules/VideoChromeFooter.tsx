"use client";

import * as React from "react";
import { ChevronDown, Download } from "lucide-react";
import { Icon } from "@/lib/icons";
import { cn } from "@/lib/utils";

export interface VideoLicense {
  holder: string;
  type: string;
  url?: string;
}

export interface CaptionLanguage {
  code: string;
  label: string;
}

export interface VideoChromeFooterProps {
  license?: VideoLicense;
  captionsEnabled?: boolean;
  onToggleCaptions?: (next: boolean) => void;
  currentLanguage?: string;
  availableLanguages?: CaptionLanguage[];
  onLanguageChange?: (code: string) => void;
  onDownloadTranscript?: (format: "srt" | "txt") => void;
  className?: string;
}

const DEFAULT_LANGS: CaptionLanguage[] = [
  { code: "EN", label: "English" },
  { code: "ES", label: "Español" },
  { code: "FR", label: "Français" },
];

/**
 * Inline row below the Video Player: License (left) · CC toggle · Language
 * picker · Download transcript (right). edX parity additions (§10.8/10.10/10.12/10.14).
 */
export function VideoChromeFooter({
  license = { holder: "SkillUp 2026", type: "CC BY-SA 4.0", url: "#" },
  captionsEnabled = true,
  onToggleCaptions,
  currentLanguage = "EN",
  availableLanguages = DEFAULT_LANGS,
  onLanguageChange,
  onDownloadTranscript,
  className,
}: VideoChromeFooterProps) {
  const [langOpen, setLangOpen] = React.useState(false);
  const [dlOpen, setDlOpen] = React.useState(false);
  const wrapRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setLangOpen(false);
        setDlOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  return (
    <div
      ref={wrapRef}
      className={cn(
        "flex flex-wrap items-center justify-between gap-3 border-b border-lms-border-secondary px-4 py-2.5",
        className,
      )}
    >
      <p className="lms-text-sm-regular text-lms-text-tertiary">
        © {license.holder} ·{" "}
        <a href={license.url} className="text-lms-text-brand-secondary hover:underline">
          {license.type}
        </a>
      </p>

      <div className="flex items-center gap-4">
        <button
          type="button"
          aria-pressed={captionsEnabled}
          onClick={() => onToggleCaptions?.(!captionsEnabled)}
          className={cn(
            "lms-text-xs-semibold rounded-full px-2.5 py-1 transition-colors",
            captionsEnabled
              ? "bg-lms-bg-brand-section text-lms-text-brand-secondary"
              : "bg-lms-bg-secondary text-lms-text-secondary hover:bg-lms-bg-tertiary",
          )}
        >
          CC
        </button>

        <div className="relative">
          <button
            type="button"
            aria-haspopup="listbox"
            aria-expanded={langOpen}
            onClick={() => {
              setLangOpen((o) => !o);
              setDlOpen(false);
            }}
            className="lms-text-sm-semibold inline-flex items-center gap-1 text-lms-text-secondary hover:text-lms-text-primary"
          >
            {currentLanguage}
            <Icon icon={ChevronDown} size={14} />
          </button>
          {langOpen ? (
            <ul
              role="listbox"
              className="absolute right-0 z-20 mt-1 w-36 overflow-hidden rounded-lg border border-lms-border-secondary bg-lms-bg-primary py-1 shadow-lg"
            >
              {availableLanguages.map((l) => (
                <li key={l.code} role="option" aria-selected={l.code === currentLanguage}>
                  <button
                    type="button"
                    onClick={() => {
                      onLanguageChange?.(l.code);
                      setLangOpen(false);
                    }}
                    className={cn(
                      "lms-text-sm-medium flex w-full items-center justify-between px-3 py-2 text-left hover:bg-lms-bg-secondary",
                      l.code === currentLanguage
                        ? "text-lms-text-brand-secondary"
                        : "text-lms-text-primary",
                    )}
                  >
                    {l.label}
                    <span className="lms-text-xs-regular text-lms-text-tertiary">{l.code}</span>
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <div className="relative">
          <button
            type="button"
            aria-haspopup="menu"
            aria-expanded={dlOpen}
            onClick={() => {
              setDlOpen((o) => !o);
              setLangOpen(false);
            }}
            className="lms-text-sm-medium inline-flex items-center gap-1.5 text-lms-text-brand-secondary hover:underline"
          >
            <Icon icon={Download} size={16} />
            Download transcript
          </button>
          {dlOpen ? (
            <ul
              role="menu"
              className="absolute right-0 z-20 mt-1 w-28 overflow-hidden rounded-lg border border-lms-border-secondary bg-lms-bg-primary py-1 shadow-lg"
            >
              {(["srt", "txt"] as const).map((fmt) => (
                <li key={fmt} role="none">
                  <button
                    role="menuitem"
                    type="button"
                    onClick={() => {
                      onDownloadTranscript?.(fmt);
                      setDlOpen(false);
                    }}
                    className="lms-text-sm-medium block w-full px-3 py-2 text-left text-lms-text-primary hover:bg-lms-bg-secondary"
                  >
                    .{fmt}
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </div>
  );
}
