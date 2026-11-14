import * as React from "react";
import { ChevronDown, Download } from "lucide-react";
import { Icon } from "@/lib/icons";
import { inertProps } from "@/lib/inert";
import { MOTION_MS } from "@/lib/motion/tokens";
import { useExitTransition } from "@/lib/useExitTransition";
import { cn } from "@/lib/utils";
import styles from "./VideoChromeFooter.module.css";

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
  // Both menus drop down under their trigger (right-aligned) and leave the way they came.
  const lang = useExitTransition(langOpen, MOTION_MS.short2);
  const dl = useExitTransition(dlOpen, MOTION_MS.short2);

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
      className={cn(styles.footer, className)}
    >
      <p className={`sk-text-body-medium-regular ${styles.licence}`}>
        <a href={license.url} className={styles.licenceLink}>
          {license.type}
        </a>
      </p>

      <div className={styles.actions}>
        <div className={styles.anchor}>
          <button
            type="button"
            aria-haspopup="listbox"
            aria-expanded={langOpen}
            onClick={() => {
              setLangOpen((o) => !o);
              setDlOpen(false);
            }}
            className={`sk-text-body-medium-semibold ${styles.languageTrigger}`}
          >
            {currentLanguage}
            <Icon icon={ChevronDown} size={14} />
          </button>
          {lang.mounted ? (
            <ul
              role="listbox"
              data-state={lang.state}
              onTransitionEnd={lang.onTransitionEnd}
              aria-hidden={!langOpen || undefined}
              {...inertProps(!langOpen)}
              className={`sk-animate-menu ${styles.menu} ${styles.languageMenu}`}
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
                      "sk-text-body-medium-medium",
                      styles.option,
                      styles.languageOption,
                      l.code === currentLanguage ? styles.current : styles.other,
                    )}
                  >
                    {l.label}
                    <span className={`sk-text-body-small-regular ${styles.code}`}>{l.code}</span>
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <div className={styles.anchor}>
          <button
            type="button"
            aria-haspopup="menu"
            aria-expanded={dlOpen}
            onClick={() => {
              setDlOpen((o) => !o);
              setLangOpen(false);
            }}
            // DS Link Button, Type=Brand · Hierarchy=Primary · md: 1px bottom stroke in border/primary.
            className={`sk-text-body-medium-semibold ${styles.link}`}
          >
            <Icon icon={Download} size={16} className={styles.linkIcon} />
            <span className={styles.linkLabel}>Download transcript</span>
          </button>
          {dl.mounted ? (
            <ul
              role="menu"
              data-state={dl.state}
              onTransitionEnd={dl.onTransitionEnd}
              aria-hidden={!dlOpen || undefined}
              {...inertProps(!dlOpen)}
              className={`sk-animate-menu ${styles.menu} ${styles.downloadMenu}`}
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
                    className={`sk-text-body-medium-medium ${styles.option} ${styles.formatOption}`}
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
