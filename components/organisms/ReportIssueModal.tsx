"use client";

import * as React from "react";
import { Check, X } from "lucide-react";
import { Icon } from "@/lib/icons";
import { Button } from "@/components/atoms/Button";
import { cn } from "@/lib/utils";

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

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      e.preventDefault();
      onCancel();
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" onKeyDown={handleKeyDown}>
      <div className="sk-backdrop sk-animate-fade absolute inset-0" onClick={onCancel} aria-hidden />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative w-full max-w-[480px] overflow-hidden rounded-xl border border-sk-border-secondary bg-sk-bg-primary shadow-xl"
      >
        <header className="flex items-center justify-between border-b border-sk-border-secondary px-5 py-4">
          <h2 id={titleId} className="sk-text-md-semibold text-sk-text-primary">
            Report an issue
          </h2>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Close"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-sk-text-tertiary hover:bg-sk-bg-secondary"
          >
            <Icon icon={X} size={20} />
          </button>
        </header>

        <div className="flex flex-col gap-5 px-6 py-5">
          <fieldset>
            <legend className="sk-text-sm-medium mb-2.5 block text-sk-text-secondary">
              What’s wrong with this content?
            </legend>
            <div className="flex flex-col gap-1.5" role="radiogroup">
              {REASONS.map((r) => {
                const selected = reason === r;
                return (
                  <button
                    key={r}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => setReason(r)}
                    className={cn(
                      "sk-text-sm-medium flex items-center justify-between gap-2 rounded-lg border px-3 py-2.5 text-left transition-colors",
                      selected
                        ? "border-sk-border-brand bg-sk-bg-brand-section text-sk-text-primary"
                        : "border-sk-border-secondary text-sk-text-secondary hover:bg-sk-bg-secondary",
                    )}
                  >
                    {r}
                    {selected ? (
                      <Icon icon={Check} size={18} className="shrink-0 text-sk-text-brand-secondary" />
                    ) : null}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <label className="block">
            <span className="sk-text-sm-medium mb-1.5 block text-sk-text-secondary">
              Details <span className="text-sk-text-tertiary">(optional)</span>
            </span>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={3}
              placeholder="Tell us more…"
              className="sk-text-sm-regular w-full resize-none rounded-lg border border-sk-border-primary bg-sk-bg-primary px-3 py-2 text-sk-text-primary outline-none focus:border-sk-border-brand"
            />
          </label>
        </div>

        <footer className="flex items-center justify-end gap-2 border-t border-sk-border-secondary px-5 py-4">
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
