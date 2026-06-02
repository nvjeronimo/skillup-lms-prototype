"use client";

import * as React from "react";
import { Award, X } from "lucide-react";
import { Icon } from "@/lib/icons";
import { Button } from "@/components/atoms/Button";

export interface CourseCompleteModalProps {
  open: boolean;
  courseTitle: string;
  onClose: () => void;
  onViewCertificate?: () => void;
}

/** Modal celebrating course completion. */
export function CourseCompleteModal({
  open,
  courseTitle,
  onClose,
  onViewCertificate,
}: CourseCompleteModalProps) {
  const titleId = React.useId();
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div
        className="lms-animate-fade absolute inset-0"
        style={{ background: "color-mix(in srgb, var(--lms-text-primary) 60%, transparent)" }}
        onClick={onClose}
        aria-hidden
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative w-full max-w-md overflow-hidden rounded-xl border border-lms-border-secondary bg-lms-bg-primary p-6 text-center shadow-xl"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-md text-lms-text-tertiary hover:bg-lms-bg-secondary"
        >
          <Icon icon={X} size={20} />
        </button>
        <span className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-lms-bg-brand-section text-lms-text-brand-secondary">
          <Icon icon={Award} size={32} />
        </span>
        <h2 id={titleId} className="lms-text-display-xs-semibold mt-4 text-lms-text-primary">
          Course complete!
        </h2>
        <p className="lms-text-md-medium mt-2 text-lms-text-secondary">
          You finished <span className="text-lms-text-brand-secondary">{courseTitle}</span>. Your
          certificate is ready.
        </p>
        <div className="mt-6 flex flex-col gap-2">
          <Button variant="primary" size="lg" onClick={onViewCertificate}>
            View certificate
          </Button>
          <Button variant="tertiary" size="md" onClick={onClose}>
            Back to course
          </Button>
        </div>
      </div>
    </div>
  );
}
