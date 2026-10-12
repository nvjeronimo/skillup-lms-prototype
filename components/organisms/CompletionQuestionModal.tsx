"use client";

import * as React from "react";
import { CircleHelp, X } from "lucide-react";
import { Icon } from "@/lib/icons";
import { Button } from "@/components/atoms/Button";
import { useDialog } from "@/lib/useDialog";

export interface CompletionQuestionModalProps {
  open: boolean;
  /** What the topic is called in the question: "lab", "reading", "lesson", "activity", "video", "podcast". */
  noun: string;
  /** Why we have to ask, in one sentence. */
  reason: string;
  /** False on the last topic: there is nowhere to go on to, so the text does not promise it. */
  hasNext?: boolean;
  /** "Yes, completed": mark the topic as completed and advance to the next topic. */
  onYes: () => void;
  /** "Not yet": keep the topic incomplete and advance to the next topic. */
  onNotYet: () => void;
  /** Close, Esc or the backdrop: no change, remain on the current topic. */
  onClose: () => void;
}

/**
 * The question Next asks when the learner moves on from a topic the platform cannot measure
 * without Mark as Complete (lab-third-party-platforms.md §4; Figma frames 7070:14832 and
 * 7077:18132). Copy and the three behaviours are Navdeep's, 12 Oct 2026. DS `Modal` Type=Horizontal:
 * featured icon beside the title and supporting text, close top right, two actions right
 * aligned. On a phone the actions stack and the primary one comes first, as in the DS
 * mobile variant.
 */
export function CompletionQuestionModal({
  open,
  noun,
  reason,
  hasNext = true,
  onYes,
  onNotYet,
  onClose,
}: CompletionQuestionModalProps) {
  const titleId = React.useId();
  const descId = React.useId();
  // Focus starts on the close button, the first control in the dialog: neither answer is
  // offered as the default, because one of them changes the learner's progress.
  const dialogRef = useDialog(open, onClose);

  if (!open) return null;
  return (
    <div ref={dialogRef} className="fixed inset-0 z-[60] flex items-end justify-center p-4 sm:items-center">
      <div className="sk-backdrop sk-animate-fade absolute inset-0" onClick={onClose} aria-hidden />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        className="relative w-full max-w-[544px] rounded-2xl border border-sko-border-subtle bg-sko-bg-page shadow-xl"
      >
        <div className="flex flex-col gap-4 p-6 pb-0 sm:flex-row">
          <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-sko-bg-primary-soft text-sko-text-primary">
            <Icon icon={CircleHelp} size={24} />
          </span>
          <div className="flex min-w-0 flex-1 flex-col gap-1 pr-10">
            <h2 id={titleId} className="sk-text-body-large-semibold text-sko-text-default">
              Have you completed this {noun}?
            </h2>
            <div id={descId} className="sk-text-body-medium-regular flex flex-col text-sko-text-muted">
              <p>{reason}</p>
              <p>
                {hasNext
                  ? `You can move to the next topic either way and return to this ${noun} anytime.`
                  : `You can return to this ${noun} anytime.`}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-3 top-3 inline-flex h-11 w-11 items-center justify-center rounded-lg text-sko-text-subtle hover:bg-sko-bg-subtle"
          >
            <Icon icon={X} size={24} />
          </button>
        </div>

        <div className="flex flex-col gap-3 p-6 sm:flex-row-reverse sm:justify-start">
          <Button variant="primary" size="md" onClick={onYes}>
            Yes, completed
          </Button>
          <Button variant="secondary" size="md" onClick={onNotYet}>
            Not yet
          </Button>
        </div>
      </div>
    </div>
  );
}
