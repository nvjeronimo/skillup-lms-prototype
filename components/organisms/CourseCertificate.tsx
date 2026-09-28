"use client";

import * as React from "react";
import { Check, Download, Share2 } from "lucide-react";
import { Icon } from "@/lib/icons";
import { Button } from "@/components/atoms/Button";
import { ShareMenu, type ShareChannel } from "@/components/molecules/ShareMenu";
import { cn } from "@/lib/utils";

export interface CertificateStats {
  modules: number | string;
  topics: number | string;
  time: string;
  avgQuiz: string;
}

export interface CourseCertificateProps {
  learnerName: string;
  courseTitle: string;
  provider: string;
  dateLabel: string;
  certificateId: string;
  stats: CertificateStats;
  onBack?: () => void;
  onShare?: (channel: ShareChannel) => void;
  onDownload?: () => void;
  onPrint?: () => void;
  className?: string;
}

/**
 * Certificate of completion (ICP Phase 1): green header band + check, learner +
 * course, a stats row, issued-by / verification id, and a Back · Share · Print ·
 * Download PDF action footer.
 */
export function CourseCertificate({
  learnerName,
  courseTitle,
  provider,
  dateLabel,
  certificateId,
  stats,
  onBack,
  onShare,
  onDownload,
  onPrint,
  className,
}: CourseCertificateProps) {
  const [shareOpen, setShareOpen] = React.useState(false);
  const shareWrapRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (shareWrapRef.current && !shareWrapRef.current.contains(e.target as Node)) {
        setShareOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  function handlePrint() {
    onPrint?.();
    if (typeof window !== "undefined") window.print();
  }

  const STAT = [
    { value: stats.modules, label: "Modules" },
    { value: stats.topics, label: "Topics" },
    { value: stats.time, label: "Time" },
    { value: stats.avgQuiz, label: "Avg quiz" },
  ];

  return (
    <div
      className={cn(
        "sk-certificate mx-auto w-full max-w-[720px] overflow-hidden rounded-lg bg-sko-bg-page shadow-sk-card shadow-lg",
        className,
      )}
    >
      {/* Green header band + check */}
      <div className="flex h-24 items-center justify-center bg-sko-bg-success">
        <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-sko-bg-page text-sko-icon-success">
          <Icon icon={Check} size={32} />
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-col items-center gap-3 px-8 py-8 text-center">
        <p className="sk-text-xs-medium uppercase text-sko-text-subtle">This certifies that</p>
        <p className="sk-text-display-md-bold text-sko-text-default">{learnerName}</p>
        <p className="sk-text-sm-regular text-sko-text-muted">has successfully completed</p>
        <p className="sk-text-display-xs-semibold text-sko-text-default">{courseTitle}</p>

        <div className="flex flex-wrap items-start justify-center gap-6">
          {STAT.map((s) => (
            <div key={s.label} className="flex flex-col items-center gap-0.5">
              <p className="sk-text-md-medium text-sko-text-default">{s.value}</p>
              <p className="sk-text-xs-medium text-sko-text-subtle">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Meta row */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-sko-border-subtle px-8 py-6">
        <span className="sk-text-xs-medium text-sko-text-muted">Issued by {provider}</span>
        <span className="sk-text-xs-medium uppercase text-sko-text-subtle">
          {dateLabel} · {certificateId}
        </span>
      </div>

      {/* Actions: DS one centred wrapping row of four md buttons, gap 16, padding 24/32. */}
      <div className="sk-no-print flex flex-wrap items-center justify-center gap-4 border-t border-sko-border-subtle px-8 py-6">
        {/* Legacy DS Tertiary = neutral outline (border/default, text/subtle). */}
        <Button variant="neutral" size="md" onClick={onBack}>
          ← Back to course page
        </Button>
        <div className="relative" ref={shareWrapRef}>
          <Button
            variant="secondary"
            size="md"
            rightIcon={Share2}
            onClick={() => setShareOpen((o) => !o)}
            aria-haspopup="menu"
            aria-expanded={shareOpen}
          >
            Share
          </Button>
          {shareOpen ? (
            <div className="absolute bottom-full right-0 z-20 mb-1">
              <ShareMenu
                onSelect={(c) => {
                  onShare?.(c);
                  setShareOpen(false);
                }}
                onClose={() => setShareOpen(false)}
              />
            </div>
          ) : null}
        </div>
        <Button variant="secondary" size="md" onClick={handlePrint}>
          Print
        </Button>
        <Button variant="primary" size="md" rightIcon={Download} onClick={onDownload}>
          Download PDF
        </Button>
      </div>
    </div>
  );
}
