import * as React from "react";
import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";
import { Icon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { inertProps } from "@/lib/inert";
import { MOTION_MS } from "@/lib/motion/tokens";
import { useExitTransition } from "@/lib/useExitTransition";
import styles from "./CourseAlert.module.css";

export interface CourseAlertProps {
  /**
   * DS `Color`: Brand (the course update) or Warning (passing grade, missed deadline).
   * Success is a PROPOSAL of 10 Oct 2026 for the passed course: no screen draws it.
   */
  tone: "brand" | "warning" | "success";
  /**
   * `stacked`: DS Breakpoint=Mobile on every width — the icon above the text (the course
   * update is drawn like this on all three breakpoints).
   * `responsive`: the icon above the text on mobile, beside it from tablet up.
   */
  layout?: "stacked" | "responsive";
  title: string;
  body: string;
  /** The DS `Actions` row, under the text. */
  action?: React.ReactNode;
  /** DS `X close button`: closes the alert for this visit. */
  dismissible?: boolean;
  /** What on this alert has no API yet (shown when the sample-data marks are on). */
  mock?: string;
  /**
   * False makes the alert leave (ShiftDatesAlert after the shift). A dismissed or closed alert
   * fades and sinks out (short3, standard-decelerate), inert while it goes, then unmounts.
   */
  open?: boolean;
  className?: string;
}

const TONE = {
  brand: {
    box: styles.brand,
    icon: Info,
    iconColor: styles.iconBrand,
    // As bound on the instance: both lines on text/muted.
    title: styles.titleMuted,
  },
  warning: {
    box: styles.warning,
    icon: AlertCircle,
    iconColor: styles.iconWarning,
    // Breakpoint=Mobile binds the title to text/muted, Breakpoint=Desktop to text/default.
    title: styles.titleResponsive,
  },
  // Proposal (10 Oct 2026): the Warning alert with the success tokens and a check.
  success: {
    box: styles.success,
    icon: CheckCircle2,
    iconColor: styles.iconSuccess,
    title: styles.titleResponsive,
  },
} as const;

/**
 * DS `Alert`, Size=Floating (Course update 6406:39269, passing grade and missed deadline on
 * the Progress and Dates tabs): radius 12, padding 16, gap 16, a 1px stroke and
 * Elevation/level1. The `Featured icon outline` is a 20px icon inside two rings (28px at 30%
 * and 38px at 10%). Title body-medium/Semibold, text body-medium/Regular on text/muted, 4
 * apart; the actions 12 under the text; the 36px close button 8 from the top right corner.
 * Not atoms/InlineAlert, which is the `LMS / Inline Alert` of the player (top rule, no radius).
 */
export function CourseAlert({
  tone,
  layout = "responsive",
  title,
  body,
  action,
  dismissible = false,
  mock,
  open = true,
  className,
}: CourseAlertProps) {
  const [dismissed, setDismissed] = React.useState(false);
  // Exit only: the alert is page content, so it does not rise in on every page load.
  const presence = useExitTransition(open && !dismissed, MOTION_MS.short3);
  if (!presence.mounted) return null;
  const t = TONE[tone];
  const leaving = presence.state === "closed";

  return (
    <div
      role="note"
      data-mock={mock}
      data-state={presence.state}
      onAnimationEnd={presence.onAnimationEnd}
      {...inertProps(leaving)}
      className={cn(
        leaving && `sk-animate-rise ${styles.leaving}`,
        // The DS stroke is inside the alert and the CSS border is outside the padding: 15 + 1 = the DS 16.
        styles.alert,
        layout === "responsive" && styles.responsive,
        t.box,
        className,
      )}
    >
      <span aria-hidden className={cn(styles.featured, t.iconColor)}>
        <span className={styles.ringInner} />
        <span className={styles.ringOuter} />
        <Icon icon={t.icon} size={20} />
      </span>
      <div className={styles.content}>
        <div className={cn(styles.copy, dismissible && layout === "responsive" && styles.copyClearsClose)}>
          <p className={cn("sk-text-body-medium-semibold", t.title)}>{title}</p>
          <p className={`sk-text-body-medium-regular ${styles.body}`}>{body}</p>
        </div>
        {action}
      </div>
      {dismissible ? (
        <button
          type="button"
          aria-label={`Dismiss: ${title}`}
          onClick={() => setDismissed(true)}
          className={styles.close}
        >
          <Icon icon={X} size={20} />
        </button>
      ) : null}
    </div>
  );
}
