import * as React from "react";
import { AlertCircle, CheckCircle2, KeyRound, Lightbulb, X, XCircle } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Icon } from "@/lib/icons";
import { cn } from "@/lib/utils";

/**
 * DS `LMS / Inline Alert` — six tones (node 5146-13852).
 *
 * Five of them exist on the platform today: Success, Warning and Error are the
 * per-choice feedback (`<choicehint>`), Hint is the demand-hint block, and
 * Answer is the `<solution>` revealed when Show answer is pressed. Info is the
 * only one that is ours — shell messaging.
 *
 * Success, Warning, Error and Info are a **rule and text**, not a filled card:
 * a 2px top border in the tone colour, no fill and no rounding. Only the icon
 * carries the tone; the title stays `text-primary` so the copy reads first.
 * Hint and Answer are boxes, because they are content rather than a verdict.
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
  /** Hint's "Next Hint" control, rendered under the text. */
  action?: React.ReactNode;
  onDismiss?: () => void;
  className?: string;
}

const TONE: Record<AlertTone, { box: string; icon: LucideIcon; fg: string }> = {
  info: {
    box: "border-t-2 border-sk-border-brand pt-3",
    icon: AlertCircle,
    fg: "text-sk-text-brand-secondary",
  },
  success: {
    box: "border-t-2 border-sk-text-success-primary pt-3",
    icon: CheckCircle2,
    fg: "text-sk-text-success-primary",
  },
  warning: {
    box: "border-t-2 border-sk-text-warning-primary pt-3",
    icon: AlertCircle,
    fg: "text-sk-text-warning-primary",
  },
  error: {
    box: "border-t-2 border-sk-text-error-primary pt-3",
    icon: XCircle,
    fg: "text-sk-text-error-primary",
  },
  hint: {
    box: "rounded-lg bg-sk-bg-brand-section p-3",
    icon: Lightbulb,
    fg: "text-sk-text-brand-secondary",
  },
  answer: {
    box: "rounded-lg border border-sk-border-secondary bg-sk-bg-secondary p-3",
    icon: KeyRound,
    fg: "text-sk-text-secondary",
  },
};

export function InlineAlert({
  tone = "info",
  title,
  description,
  action,
  onDismiss,
  className,
}: InlineAlertProps) {
  const t = TONE[tone];
  // A hint reads as one sentence: the counter is a bold lead-in, not a heading.
  const inlineTitle = tone === "hint";

  return (
    <div role="status" className={cn("flex items-start gap-3", t.box, className)}>
      <Icon icon={t.icon} size={18} className={cn("mt-0.5 shrink-0", t.fg)} />

      <div className="min-w-0 flex-1">
        {inlineTitle ? (
          <p className="sk-text-sm-regular text-sk-text-secondary">
            <span className="sk-text-sm-semibold text-sk-text-primary">{title} </span>
            {description}
          </p>
        ) : (
          <>
            <p className="sk-text-sm-semibold text-sk-text-primary">{title}</p>
            {description ? (
              <p className="sk-text-sm-regular mt-0.5 text-sk-text-secondary">{description}</p>
            ) : null}
          </>
        )}
        {action ? <div className="mt-2">{action}</div> : null}
      </div>

      {onDismiss ? (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss"
          className="shrink-0 text-sk-text-tertiary hover:text-sk-text-primary"
        >
          <Icon icon={X} size={18} />
        </button>
      ) : null}
    </div>
  );
}
