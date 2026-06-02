"use client";

import * as React from "react";
import { Award, Download, Printer, Share2 } from "lucide-react";
import { Icon } from "@/lib/icons";
import { Button } from "@/components/atoms/Button";
import { ShareMenu, type ShareChannel } from "@/components/molecules/ShareMenu";
import { cn } from "@/lib/utils";

export interface CourseCertificateProps {
  learnerName: string;
  courseTitle: string;
  provider: string;
  dateLabel: string;
  onBack?: () => void;
  onShare?: (channel: ShareChannel) => void;
  onDownload?: () => void;
  onPrint?: () => void;
  className?: string;
}

/**
 * Certificate of completion preview with a 4-button footer:
 * Back · Share (opens menu) · Download PDF · Print (window.print()).
 */
export function CourseCertificate({
  learnerName,
  courseTitle,
  provider,
  dateLabel,
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

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div className="lms-certificate mx-auto flex aspect-[1.4] w-full max-w-2xl flex-col items-center justify-center gap-3 rounded-xl border-4 border-lms-border-brand bg-lms-bg-brand-section p-10 text-center">
        <Icon icon={Award} size={48} className="text-lms-text-brand-secondary" />
        <p className="lms-text-2xs-medium text-lms-text-tertiary">Certificate of Completion</p>
        <p className="lms-text-sm-regular text-lms-text-secondary">This certifies that</p>
        <p className="lms-text-display-sm-semibold text-lms-text-primary">{learnerName}</p>
        <p className="lms-text-sm-regular text-lms-text-secondary">has successfully completed</p>
        <p className="lms-text-lg-semibold text-lms-text-brand-secondary">{courseTitle}</p>
        <p className="lms-text-xs-regular mt-2 text-lms-text-tertiary">
          {provider} · {dateLabel}
        </p>
      </div>

      <div className="lms-no-print mx-auto flex w-full max-w-2xl flex-wrap items-center justify-end gap-2">
        <Button variant="secondary" size="md" onClick={onBack}>
          Back to course
        </Button>
        <div className="relative" ref={shareWrapRef}>
          <Button
            variant="secondary"
            size="md"
            leftIcon={Share2}
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
        <Button variant="primary" size="md" leftIcon={Download} onClick={onDownload}>
          Download PDF
        </Button>
      </div>
    </div>
  );
}
