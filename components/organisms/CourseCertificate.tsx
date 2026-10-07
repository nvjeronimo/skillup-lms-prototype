"use client";

import * as React from "react";
import { Check, Download, Share2 } from "lucide-react";
import { Icon } from "@/lib/icons";
import { Button } from "@/components/atoms/Button";
import { ShareMenu, type ShareChannel } from "@/components/molecules/ShareMenu";
import { cn } from "@/lib/utils";
import { useDisclosure } from "@/lib/useDisclosure";

export interface CertificateStats {
  modules: number | string;
  topics: number | string;
  /** Not shown: Open edX keeps no time-learned figure (metadata map §37). Kept so callers need not change. */
  time?: string;
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
  // Share is a disclosure: Esc / outside click close, focus returns to Share.
  const share = useDisclosure();

  function handlePrint() {
    onPrint?.();
    if (typeof window !== "undefined") window.print();
  }

  const STAT = [
    { value: stats.modules, label: "Modules" },
    { value: stats.topics, label: "Topics" },
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
        <div className="relative" ref={share.containerRef}>
          <Button variant="secondary" size="md" rightIcon={Share2} {...share.triggerProps}>
            Share
          </Button>
          {share.open ? (
            <div {...share.panelProps} className="absolute bottom-full right-0 z-20 mb-1">
              <ShareMenu
                onSelect={(c) => {
                  onShare?.(c);
                  share.close();
                }}
                onClose={share.close}
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
