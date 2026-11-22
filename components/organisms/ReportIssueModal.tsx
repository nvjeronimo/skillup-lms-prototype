import * as React from "react";
import { Check, X } from "lucide-react";
import { Icon } from "@/lib/icons";
import { Button } from "@/components/atoms/Button";
import { cn } from "@/lib/utils";
import { useDialog } from "@/lib/useDialog";
import { useExitTransition } from "@/lib/useExitTransition";
import { MOTION_MS } from "@/lib/motion/tokens";
import { inertProps } from "@/lib/inert";
import { useRovingRadio } from "@/lib/useRovingRadio";
import styles from "./ReportIssueModal.module.css";

export interface ReportIssuePayload {
  reason: string;
  details?: string;
}

export interface ReportIssueModalProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: (payload: ReportIssuePayload) => void;
}

const REASONS = [
  "Incorrect or outdated information",
  "Broken media or playback",
  "Typo or formatting issue",
  "Offensive or inappropriate content",
  "Something else",
] as const;

/** Modal for reporting a problem with a piece of content. Esc cancels. */
export function ReportIssueModal({ open, onCancel, onSubmit }: ReportIssueModalProps) {
  const [reason, setReason] = React.useState<string | null>(null);
  const [details, setDetails] = React.useState("");
  const titleId = React.useId();
  const legendId = React.useId();
  const dialogRef = useDialog(open, onCancel);
  const reasonIndex = reason ? REASONS.indexOf(reason as (typeof REASONS)[number]) : -1;
  const roving = useRovingRadio(REASONS.length, reasonIndex, (i) => setReason(REASONS[i]));

  // Reset whenever the modal (re)opens.
  React.useEffect(() => {
    if (open) {
      setReason(null);
      setDetails("");
    }
  }, [open]);

  function commit() {
    if (!reason) return;
    onSubmit({ reason, details: details.trim() || undefined });
  }

  const { mounted, state, onAnimationEnd } = useExitTransition(open, MOTION_MS.short3);

  if (!mounted) return null;
  const closed = state === "closed";

  return (
    <div
      ref={dialogRef}
      data-state={state}
      aria-hidden={closed || undefined}
      {...inertProps(closed)}
      className={cn(styles.root, closed && styles.closed)}
    >
      {/* The backdrop's fade-out (short4) outlasts the dialog's pop-out (short3), so it ends the exit. */}
      <div
        className={`sk-backdrop sk-animate-fade ${styles.backdrop}`}
        onClick={onCancel}
        onAnimationEnd={onAnimationEnd}
        aria-hidden
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`sk-animate-pop ${styles.dialog}`}
      >
        <header className={styles.header}>
          <h2 id={titleId} className={`sk-text-body-large-semibold ${styles.title}`}>
            Report an issue
          </h2>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Close"
            className={styles.close}
          >
            <Icon icon={X} size={20} />
          </button>
        </header>

        <div className={styles.body}>
          <fieldset>
            <legend id={legendId} className={`sk-text-body-medium-medium ${styles.legend}`}>
              What’s wrong with this content?
            </legend>
            <div className={styles.reasons} role="radiogroup" aria-labelledby={legendId}>
              {REASONS.map((r, i) => {
                const selected = reason === r;
                return (
                  <button
                    key={r}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    {...roving.itemProps(i)}
                    onClick={() => setReason(r)}
                    className={cn(
                      "sk-text-body-medium-medium",
                      styles.reason,
                      selected ? styles.reasonSelected : styles.reasonIdle,
                    )}
                  >
                    {r}
                    {selected ? (
                      <Icon icon={Check} size={18} className={styles.check} />
                    ) : null}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <label className={styles.field}>
            <span className={`sk-text-body-medium-medium ${styles.fieldLabel}`}>
              Details <span className={styles.optional}>(optional)</span>
            </span>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={3}
              placeholder="Tell us more…"
              className={`sk-text-body-medium-regular ${styles.details}`}
            />
          </label>
        </div>

        <footer className={styles.footer}>
          <Button variant="tertiary" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="primary" onClick={commit} disabled={!reason}>
            Submit report
          </Button>
        </footer>
      </div>
    </div>
  );
}
