"use client";

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
      className={cn("fixed inset-0 z-[60] flex items-center justify-center p-4", closed && "pointer-events-none")}
    >
      {/* The backdrop's fade-out (short4) outlasts the dialog's pop-out (short3), so it ends the exit. */}
      <div
        className="sk-backdrop sk-animate-fade absolute inset-0"
        onClick={onCancel}
        onAnimationEnd={onAnimationEnd}
        aria-hidden
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="sk-animate-pop relative w-full max-w-[480px] origin-center overflow-hidden rounded-surface border border-sko-border-subtle bg-sko-bg-page shadow-xl"
      >
        <header className="flex items-center justify-between border-b border-sko-border-subtle px-5 py-4">
          <h2 id={titleId} className="sk-text-body-large-semibold text-sko-text-default">
            Report an issue
          </h2>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Close"
            className="inline-flex h-8 w-8 items-center justify-center rounded-control text-sko-text-subtle transition-colors hover:bg-sko-bg-subtle"
          >
            <Icon icon={X} size={20} />
          </button>
        </header>

        <div className="flex flex-col gap-5 px-6 py-5">
          <fieldset>
            <legend id={legendId} className="sk-text-body-medium-medium mb-2.5 block text-sko-text-muted">
              What’s wrong with this content?
            </legend>
            <div className="flex flex-col gap-1.5" role="radiogroup" aria-labelledby={legendId}>
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
                      "sk-text-body-medium-medium flex items-center justify-between gap-2 rounded-control border px-3 py-2.5 text-left transition-colors",
                      selected
                        ? "border-sko-border-primary bg-sko-bg-primary-soft text-sko-text-default"
                        : "border-sko-border-subtle text-sko-text-muted hover:bg-sko-bg-subtle",
                    )}
                  >
                    {r}
                    {selected ? (
                      <Icon icon={Check} size={18} className="shrink-0 text-sko-icon-primary" />
                    ) : null}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <label className="block">
            <span className="sk-text-body-medium-medium mb-1.5 block text-sko-text-muted">
              Details <span className="text-sko-text-subtle">(optional)</span>
            </span>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={3}
              placeholder="Tell us more…"
              className="sk-text-body-medium-regular w-full resize-none rounded-control border border-sko-border-default bg-sko-bg-page px-3 py-2 text-sko-text-default outline-none transition-colors focus:border-sko-border-primary"
            />
          </label>
        </div>

        <footer className="flex items-center justify-end gap-2 border-t border-sko-border-subtle px-5 py-4">
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
