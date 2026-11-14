import * as React from "react";
import { AlertCircle, CheckCircle2, KeyRound, Lightbulb, X, XCircle } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Icon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import styles from "./InlineAlert.module.css";

/**
 * DS `LMS / Inline Alert` — six tones (node 20328-3296). Padding 16, gap 12, 2px top rule.
 *
 * Five of them exist on the platform today: Success, Warning and Error are the
 * per-choice feedback (`<choicehint>`), Hint is the demand-hint block, and
 * Answer is the `<solution>` revealed when Show answer is pressed. Info is the
 * only one that is ours — shell messaging.
 *
 * Every tone is the same object: a 2px top rule over a filled surface, 12px all
 * round. What varies is the rule colour and the corners.
 *
 * Success, Warning, Error and Info take the tone colour on `bg-secondary_subtle`
 * with square corners (`Radius/fixed-none`) — they are a verdict on the answer.
 * Hint and Answer round to 8px because they are content: Hint sits on
 * `bg-brand-section` with **no rule at all**, since it decides nothing, and
 * Answer takes a neutral `border-primary` rule on `bg-secondary`.
 *
 * Only the icon carries the tone; the title stays `text-primary` so the copy
 * reads first.
 */
export type AlertTone = "info" | "success" | "warning" | "error" | "hint" | "answer";

export interface InlineAlertProps {
  tone?: AlertTone;
  /**
   * On a verdict this carries the score — "Correct · 1 / 1 point",
   * "Partially correct · 1 / 2 points". On a hint it is the counter,
   * "Hint (1 of 3):", and runs inline with the description.
   */
  title: string;
  description?: string;
  /**
   * DS `alert-secundary-text` (`Show secondary-text`): a second muted line
   * under the description. Info, Success, Warning and Error only.
   */
  secondary?: string;
  /** Hint's "Next Hint" control, rendered under the text. */
  action?: React.ReactNode;
  /**
   * Replaces the title/description body. The hint tone uses it to hold the
   * accumulating list, which is one alert that grows rather than one per hint.
   */
  children?: React.ReactNode;
  onDismiss?: () => void;
  /**
   * DS `Surface` (v1.2, Nelson 17 Oct 2026): `page` on a white page (the alert on bg/faint);
   * `subtle` on a grey bg/subtle surface, where bg/faint disappears, so the alert is white
   * (bg/page). Hint keeps its own fill on both.
   */
  surface?: "page" | "subtle";
  className?: string;
}

/* The box per tone: the top rule's colour (none on Hint, which rounds and keeps its own fill). */
const TONE: Record<AlertTone, { box: string; icon: LucideIcon; fg: string }> = {
  info: { box: cn(styles.rule, styles.rulePrimary), icon: AlertCircle, fg: styles.fgPrimary },
  success: { box: cn(styles.rule, styles.ruleSuccess), icon: CheckCircle2, fg: styles.fgSuccess },
  warning: { box: cn(styles.rule, styles.ruleWarning), icon: AlertCircle, fg: styles.fgWarning },
  error: { box: cn(styles.rule, styles.ruleError), icon: XCircle, fg: styles.fgError },
  hint: { box: styles.hint, icon: Lightbulb, fg: styles.fgPrimary },
  // DS v1.1 (14 Oct 2026): the 2px rule drawn like Success and Error — square, bg/faint — in primary.
  answer: { box: cn(styles.rule, styles.rulePrimary), icon: KeyRound, fg: styles.fgMuted },
};

export function InlineAlert({
  tone = "info",
  title,
  description,
  secondary,
  action,
  children,
  onDismiss,
  surface = "page",
  className,
}: InlineAlertProps) {
  const t = TONE[tone];
  // Every tone but Hint sits on bg/faint, or on bg/page on a grey (subtle) surface.
  const box = tone === "hint" ? t.box : cn(t.box, surface === "subtle" ? styles.onSubtle : styles.onPage);
  // A hint reads as one sentence: the counter is a bold lead-in, not a heading.
  const inlineTitle = tone === "hint";

  return (
    <div role="status" className={cn(styles.alert, box, className)}>
      <Icon icon={t.icon} size={20} className={cn(styles.icon, t.fg)} />

      <div className={styles.body}>
        {children ?? (inlineTitle ? (
          <p className={cn("sk-text-body-medium-regular", styles.title)}>
            <span className={cn("sk-text-body-medium-semibold", styles.title)}>{title} </span>
            {description}
          </p>
        ) : (
          <>
            <p className={cn("sk-text-body-medium-semibold", styles.title)}>{title}</p>
            {description ? (
              <p className={cn("sk-text-body-medium-regular", styles.text)}>{description}</p>
            ) : null}
            {secondary ? (
              <p className={cn("sk-text-body-medium-regular", styles.text)}>{secondary}</p>
            ) : null}
          </>
        ))}
        {/* DS Copy gap is 2 with a 4px-padded Link button; a bare button needs 6. */}
        {action ? <div className={styles.action}>{action}</div> : null}
      </div>

      {onDismiss ? (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss"
          className={styles.dismiss}
        >
          <Icon icon={X} size={18} />
        </button>
      ) : null}
    </div>
  );
}
