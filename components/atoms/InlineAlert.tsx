import * as React from "react";
import { AlertCircle, CheckCircle2, KeyRound, Lightbulb, X, XCircle } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Icon } from "@/lib/icons";
import { cn } from "@/lib/utils";

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
  /** Hint's "Next Hint" control, rendered under the text. */
  action?: React.ReactNode;
  /**
   * Replaces the title/description body. The hint tone uses it to hold the
   * accumulating list, which is one alert that grows rather than one per hint.
   */
  children?: React.ReactNode;
  onDismiss?: () => void;
  className?: string;
}

const TONE: Record<AlertTone, { box: string; icon: LucideIcon; fg: string }> = {
  info: {
    box: "border-t-2 border-sko-border-primary bg-sko-bg-faint p-4",
    icon: AlertCircle,
    fg: "text-sko-text-primary",
  },
  success: {
    box: "border-t-2 border-sko-border-success bg-sko-bg-faint p-4",
    icon: CheckCircle2,
    fg: "text-sko-text-success",
  },
  warning: {
    box: "border-t-2 border-sko-border-warning bg-sko-bg-faint p-4",
    icon: AlertCircle,
    fg: "text-sko-text-warning",
  },
  error: {
    box: "border-t-2 border-sko-border-error bg-sko-bg-faint p-4",
    icon: XCircle,
    fg: "text-sko-text-error",
  },
  hint: {
    box: "rounded-lg bg-sko-bg-primary-soft p-4",
    icon: Lightbulb,
    fg: "text-sko-text-primary",
  },
  answer: {
    box: "rounded-lg border-t-2 border-sko-border-default bg-sko-bg-subtle p-4",
    icon: KeyRound,
    fg: "text-sko-text-muted",
  },
};

export function InlineAlert({
  tone = "info",
  title,
  description,
  action,
  children,
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
        {children ?? (inlineTitle ? (
          <p className="sk-text-sm-regular text-sko-text-muted">
            <span className="sk-text-sm-semibold text-sko-text-default">{title} </span>
            {description}
          </p>
        ) : (
          <>
            <p className="sk-text-sm-semibold text-sko-text-default">{title}</p>
            {description ? (
              <p className="sk-text-sm-regular mt-0.5 text-sko-text-muted">{description}</p>
            ) : null}
          </>
        ))}
        {action ? <div className="mt-2">{action}</div> : null}
      </div>

      {onDismiss ? (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss"
          className="shrink-0 text-sko-text-subtle hover:text-sko-text-default"
        >
          <Icon icon={X} size={18} />
        </button>
      ) : null}
    </div>
  );
}
