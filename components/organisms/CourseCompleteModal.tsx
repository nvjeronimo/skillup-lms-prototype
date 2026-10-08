"use client";

import * as React from "react";
import { Check, X } from "lucide-react";
import { Icon } from "@/lib/icons";
import { Button } from "@/components/atoms/Button";
import { useDialog } from "@/lib/useDialog";

export interface CourseCompleteModalProps {
  open: boolean;
  courseTitle: string;
  onClose: () => void;
  onNextCourse?: () => void;
  onViewCertificate?: () => void;
  onBackToCourse?: () => void;
}

/** Modal celebrating course completion (ICP Phase 1): green check + 3 actions. */
export function CourseCompleteModal({
  open,
  courseTitle,
  onClose,
  onNextCourse,
  onViewCertificate,
  onBackToCourse,
}: CourseCompleteModalProps) {
  const titleId = React.useId();
  // Focus starts on the primary action (the close X is first in DOM order, but
  // landing on it invites dismissing the celebration); trapped; Esc closes;
  // focus returns to the trigger (the footer Next button).
  const primaryRef = React.useRef<HTMLButtonElement>(null);
  const dialogRef = useDialog(open, onClose, { initialFocusRef: primaryRef });

  if (!open) return null;
  return (
    <div ref={dialogRef} className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="sk-backdrop sk-animate-fade absolute inset-0" onClick={onClose} aria-hidden />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative w-full max-w-[440px] overflow-hidden rounded-2xl border border-sko-border-subtle bg-sko-bg-page text-center shadow-xl"
      >
        {/* Close row: DS pt 16 / pr 16, right-aligned, 60 high (16 + 44). */}
        <div className="flex justify-end pr-4 pt-4">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-sko-text-subtle hover:bg-sko-bg-subtle"
          >
            <Icon icon={X} size={24} />
          </button>
        </div>

        {/* Content: DS padding 4/32/24/32, gap 12, centred. */}
        <div className="flex flex-col items-center gap-3 px-8 pb-6 pt-1">
          <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-sko-bg-success text-sko-icon-on-media">
            <Icon icon={Check} size={32} />
          </span>
          <h2 id={titleId} className="sk-text-headline-small-semibold text-sko-text-default">
            Course complete!
          </h2>
          <p className="sk-text-body-medium-regular text-sko-text-muted">
            You&rsquo;ve completed <span className="text-sko-text-default">{courseTitle}</span>. Grab
            your certificate, jump to the next one, or head back.
          </p>
        </div>

        {/* Actions: DS padding 16/24/24/24, gap 8; all three are Size=md. */}
        <div className="flex flex-col gap-2 px-6 pb-6 pt-4">
          <Button ref={primaryRef} variant="primary" size="md" onClick={onNextCourse}>
            Go to next course
          </Button>
          <Button variant="secondary" size="md" onClick={onViewCertificate}>
            View certificate
          </Button>
          {/* Legacy DS Tertiary = neutral outline (border/default, text/subtle). */}
          <Button variant="neutral" size="md" onClick={onBackToCourse ?? onClose}>
            ← Back to course page
          </Button>
        </div>
      </div>
    </div>
  );
}
