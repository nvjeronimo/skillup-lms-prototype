"use client";

import * as React from "react";
import { Check, Download, Printer, Share2 } from "lucide-react";
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
    { value: stats.avgQuiz, label: "Avg quiz", accent: true },
  ];

  return (
    <div
      className={cn(
        "lms-certificate mx-auto w-full max-w-[640px] overflow-hidden rounded-xl border border-lms-border-secondary bg-lms-bg-primary shadow-lg",
        className,
      )}
    >
      {/* Green header band + check */}
      <div className="flex h-24 items-center justify-center bg-lms-text-success-primary">
        <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-lms-bg-primary text-lms-text-success-primary">
          <Icon icon={Check} size={28} strokeWidth={2.5} />
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-col items-center gap-2 px-8 py-8 text-center">
        <p className="lms-text-2xs-medium text-lms-text-tertiary">This certifies that</p>
        <p className="lms-text-display-sm-semibold text-lms-text-primary">{learnerName}</p>
        <p className="lms-text-sm-regular text-lms-text-secondary">has successfully completed</p>
        <p className="lms-text-lg-semibold text-lms-text-primary">{courseTitle}</p>

        <div className="mt-4 flex flex-wrap items-start justify-center gap-x-10 gap-y-3">
          {STAT.map((s) => (
            <div key={s.label} className="text-center">
              <p
                className={cn(
                  "lms-text-md-semibold",
                  s.accent ? "text-lms-text-success-primary" : "text-lms-text-primary",
                )}
              >
                {s.value}
              </p>
              <p className="lms-text-xs-regular text-lms-text-tertiary">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Meta row */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-lms-border-secondary px-6 py-3">
        <span className="lms-text-xs-regular text-lms-text-tertiary">Issued by {provider}</span>
        <span className="lms-text-xs-regular text-lms-text-tertiary">
          {dateLabel} · {certificateId}
        </span>
      </div>

      {/* Actions */}
      <div className="lms-no-print flex flex-wrap items-center justify-between gap-2 border-t border-lms-border-secondary px-6 py-4">
        <button
          type="button"
          onClick={onBack}
          className="lms-text-sm-medium text-lms-text-secondary hover:text-lms-text-primary"
        >
          ← Back to course page
        </button>
        <div className="flex items-center gap-2">
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
          <Button variant="secondary" size="md" leftIcon={Printer} onClick={handlePrint}>
            Print
          </Button>
          <Button variant="primary" size="md" rightIcon={Download} onClick={onDownload}>
            Download PDF
          </Button>
        </div>
      </div>
    </div>
  );
}
