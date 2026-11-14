import { ArrivalCount } from "@/components/atoms/ArrivalCount";
import { cn } from "@/lib/utils";
import styles from "./PlatformStat.module.css";

export interface PlatformStatProps {
  label: string;
  value: string;
  detail: string;
  /** Shorter words for the phone's one-line glance card (inverse only). */
  shortLabel?: string;
  shortDetail?: string;
  /**
   * `default`: label on top, on light surfaces (My Learning header).
   * `inverse`: value first, on bg/inverse (the Dashboard glance card).
   */
  theme?: "default" | "inverse";
  /** 1px border/subtle rule on the left, between stats in a row. */
  divider?: boolean;
  className?: string;
}

/**
 * DS `LMS / Platform / Stat` (6378:3299): one figure — a label, the value, a detail line.
 * Default: label-small/Semibold text/muted · headline-medium/Bold text/default ·
 * body-small/Medium text/muted, gap 8, padding 16.
 * Inverse: value · label · detail, gap 4, all text/on-inverse; the label sits at 80% and
 * the detail at 60% layer opacity (the DS has no translucent text token). In Dark, bg/inverse
 * turns light and the detail fails AA at 60%, so it sits at 70% there.
 * The value counts up on a page's first visit in the session (ArrivalCount, motion-matrix §7.9).
 */
export function PlatformStat({ label, value, detail, shortLabel, shortDetail, theme = "default", divider = false, className }: PlatformStatProps) {
  if (theme === "inverse") {
    // On a phone the glance card is one line of four (Nelson, 21 Oct 2026): the short words show
    // there and the full ones from tablet up; only one of each is ever displayed (and read).
    const both = (full: string, short?: string) =>
      short ? (
        <>
          <span className={styles.short}>{short}</span>
          <span className={styles.full}>{full}</span>
        </>
      ) : (
        full
      );
    return (
      <div className={cn(styles.inverse, className)}>
        <p data-stat-value="" className="sk-text-headline-medium-bold"><ArrivalCount value={value} /></p>
        <p data-stat-label="" className={cn("sk-text-label-small-semibold", styles.inverseLabel)}>{both(label, shortLabel)}</p>
        <p data-stat-detail="" className={cn("sk-text-body-small-medium", styles.inverseDetail)}>{both(detail, shortDetail)}</p>
      </div>
    );
  }
  return (
    <div
      className={cn(
        // Top-aligned: when one detail wraps to two lines (a phone), the labels and the figures of
        // the stats beside it stay on the same lines.
        styles.stat,
        divider && styles.divider,
        className,
      )}
    >
      <p className={cn("sk-text-label-small-semibold", styles.label)}>{label}</p>
      <p className={cn("sk-text-headline-medium-bold", styles.value)}><ArrivalCount value={value} /></p>
      <p className={cn("sk-text-body-small-medium", styles.detail)}>{detail}</p>
    </div>
  );
}
