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
 * Inline row at the top of the transcript tab: license (left) · Language picker ·
 * Download transcript (right). Matches the Final Screen chrome footer.
 */
export function VideoChromeFooter({
  license = { holder: "SkillUp 2026", type: "CC BY-SA 4.0", url: "#" },
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
        "flex flex-wrap items-center justify-between gap-3 border-b border-sk-border-secondary px-4 py-2.5",
        className,
      )}
    >
      <p className="sk-text-sm-regular text-sk-text-tertiary">
        <a href={license.url} className="text-sk-text-brand-secondary hover:underline">
          {license.type}
        </a>
      </p>

      <div className="flex items-center gap-4">
        <div className="relative">
          <button
            type="button"
            aria-haspopup="listbox"
            aria-expanded={langOpen}
            onClick={() => {
              setLangOpen((o) => !o);
              setDlOpen(false);
            }}
            className="sk-text-sm-semibold inline-flex items-center gap-1 text-sk-text-secondary hover:text-sk-text-primary"
          >
            {currentLanguage}
            <Icon icon={ChevronDown} size={14} />
          </button>
          {langOpen ? (
            <ul
              role="listbox"
              className="absolute right-0 z-20 mt-1 w-36 overflow-hidden rounded-lg border border-sk-border-secondary bg-sk-bg-primary py-1 shadow-lg"
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
                      "sk-text-sm-medium flex w-full items-center justify-between px-3 py-2 text-left hover:bg-sk-bg-secondary",
                      l.code === currentLanguage
                        ? "text-sk-text-brand-secondary"
                        : "text-sk-text-primary",
                    )}
                  >
                    {l.label}
                    <span className="sk-text-xs-regular text-sk-text-tertiary">{l.code}</span>
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
            className="sk-text-sm-medium inline-flex items-center gap-1.5 text-sk-text-brand-secondary hover:underline"
          >
            <Icon icon={Download} size={16} />
            Download transcript
          </button>
          {dlOpen ? (
            <ul
              role="menu"
              className="absolute right-0 z-20 mt-1 w-28 overflow-hidden rounded-lg border border-sk-border-secondary bg-sk-bg-primary py-1 shadow-lg"
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
                    className="sk-text-sm-medium block w-full px-3 py-2 text-left text-sk-text-primary hover:bg-sk-bg-secondary"
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
