"use client";

import * as React from "react";
import { Check, X } from "lucide-react";
import { Icon } from "@/lib/icons";
import { Button } from "@/components/atoms/Button";

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

  React.useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="sk-backdrop sk-animate-fade absolute inset-0" onClick={onClose} aria-hidden />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative w-full max-w-md overflow-hidden rounded-xl border border-sk-border-secondary bg-sk-bg-primary p-6 text-center shadow-xl"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-md text-sk-text-tertiary hover:bg-sk-bg-secondary"
        >
          <Icon icon={X} size={20} />
        </button>

        <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-sk-bg-success-solid text-sk-fg-white">
          <Icon icon={Check} size={28} strokeWidth={2.5} />
        </span>
        <h2 id={titleId} className="sk-text-display-xs-semibold mt-4 text-sk-text-primary">
          Course complete!
        </h2>
        <p className="sk-text-sm-regular mt-2 text-sk-text-secondary">
          You&rsquo;ve completed <span className="text-sk-text-primary">{courseTitle}</span>. Grab
          your certificate, jump to the next one, or head back.
        </p>

        <div className="mt-6 flex flex-col gap-2">
          <Button variant="primary" size="lg" onClick={onNextCourse}>
            Go to next course
          </Button>
          <Button variant="secondary" size="lg" onClick={onViewCertificate}>
            View certificate
          </Button>
          <Button variant="tertiary" size="md" onClick={onBackToCourse ?? onClose}>
            Back to course page
          </Button>
        </div>
      </div>
    </div>
  );
}
