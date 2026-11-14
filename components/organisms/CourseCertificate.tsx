import * as React from "react";
import { Check, Download, Share2 } from "lucide-react";
import { Icon } from "@/lib/icons";
import { Button } from "@/components/atoms/Button";
import { ShareMenu, type ShareChannel } from "@/components/molecules/ShareMenu";
import { cn } from "@/lib/utils";
import { useDisclosure } from "@/lib/useDisclosure";
import styles from "./CourseCertificate.module.css";

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
    // Reveal on first mount (sk-animate-reveal: fade + .98 → 1, medium2, emphasized); a CSS
    // animation does not replay on re-render. Reduced motion: the fade only.
    <div
      className={cn(
        "sk-certificate sk-animate-reveal",
        styles.certificate,
        className,
      )}
    >
      {/* Green header band + check */}
      <div className={styles.band}>
        <span className={styles.check}>
          <Icon icon={Check} size={32} />
        </span>
      </div>

      {/* Body */}
      <div className={styles.body}>
        <p className={`sk-text-body-small-medium ${styles.eyebrow}`}>This certifies that</p>
        <p className={`sk-text-headline-large-bold ${styles.ink}`}>{learnerName}</p>
        <p className={`sk-text-body-medium-regular ${styles.muted}`}>has successfully completed</p>
        <p className={`sk-text-headline-small-semibold ${styles.ink}`}>{courseTitle}</p>

        <div
          data-invented="certificate: Open edX prints no module, topic or quiz figures"
          className={styles.stats}
        >
          {STAT.map((s) => (
            <div key={s.label} className={styles.stat}>
              <p className={`sk-text-body-large-medium ${styles.ink}`}>{s.value}</p>
              <p className={`sk-text-body-small-medium ${styles.subtle}`}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Meta row */}
      <div className={styles.meta}>
        <span className={`sk-text-body-small-medium ${styles.muted}`}>Issued by {provider}</span>
        <span className={`sk-text-body-small-medium ${styles.eyebrow}`}>
          {dateLabel}
          <span data-invented="certificate: Open edX identifies it by its verify UUID, no readable ID"> · {certificateId}</span>
        </span>
      </div>

      {/* Actions: DS one centred wrapping row of four md buttons, gap 16, padding 24/32. */}
      <div className={`sk-no-print ${styles.actions}`}>
        {/* Legacy DS Tertiary = neutral outline (border/default, text/subtle). */}
        <Button variant="neutral" size="md" onClick={onBack}>
          ← Back to course page
        </Button>
        <div className={styles.share} ref={share.containerRef}>
          <Button variant="secondary" size="md" rightIcon={Share2} {...share.triggerProps}>
            Share
          </Button>
          {share.mounted ? (
            <div
              {...share.panelProps}
              className={`sk-animate-menu-up ${styles.shareMenu}`}
            >
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
        <Button
          variant="primary"
          size="md"
          rightIcon={Download}
          data-invented="certificate: Open edX makes no PDF, only the web certificate"
          onClick={onDownload}
        >
          Download PDF
        </Button>
      </div>
    </div>
  );
}
