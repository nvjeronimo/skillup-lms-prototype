"use client";

import * as React from "react";
import { ExternalLink, X } from "lucide-react";
import { Icon } from "@/lib/icons";
import { Button } from "@/components/atoms/Button";
import { ButtonLink } from "@/components/atoms/ButtonLink";
import { PlatformProgressBar } from "@/components/platform/PlatformProgressBar";
import type { CourseDetail, HostedCourse } from "@/lib/platform/course-detail";
import { useLmsStore } from "@/lib/store";
import { useDialog } from "@/lib/useDialog";

/**
 * The Progress card of a course that runs on a partner's platform (Figma I1 6792:139729 and
 * I2 6792:139888): DS `LMS/Platform/Course-Detail/Progress-Card` with the footer off.
 *
 * Before the learner has left: 0%, "Hosted by IBM · opens in a new tab", *Start course*, which
 * opens the dialog first. Once started: the percentage is a dash and the bar is empty, because
 * we do not know whether the partner reports progress; *Continue on IBM* goes straight there.
 */
export function HostedProgressCard({ course, hosted }: { course: CourseDetail; hosted: HostedCourse }) {
  const started = useLmsStore((s) => Boolean(s.hostedCoursesStarted[course.slug]));
  const skipDialog = useLmsStore((s) => s.skipLeavingDialog);
  const markStarted = useLmsStore((s) => s.hostedCourseStarted);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  // Confirming replaces "Start course" by the "Continue on IBM" link, so focus cannot return
  // to the button that opened the dialog: it goes to the link that took its place.
  const actionRef = React.useRef<HTMLAnchorElement>(null);
  const copy = started ? hosted.started : hosted.start;

  return (
    <section
      aria-label={course.progress.label}
      className="flex w-full shrink-0 flex-col gap-2 rounded-[10px] border border-sko-border-subtle bg-sko-bg-page p-[15px] md:w-[320px] lg:w-[360px]"
    >
      <div className="flex items-end justify-between gap-3">
        <p className="sk-text-headline-medium-bold text-sko-text-default">
          {started ? (
            <>
              <span aria-hidden>—</span>
              <span className="sr-only">Not available</span>
            </>
          ) : (
            "0%"
          )}
        </p>
        <p className="sk-text-body-small-regular text-sko-text-subtle">{course.progress.label}</p>
      </div>
      <PlatformProgressBar value={0} label={course.progress.label} />
      <p className="sk-text-body-small-regular text-sko-text-subtle">{copy.eyebrow}</p>
      {started || skipDialog ? (
        <ButtonLink
          ref={actionRef}
          href={hosted.href}
          target="_blank"
          rel="noopener"
          size="lg"
          rightIcon={started ? ExternalLink : undefined}
          className="w-full"
          onClick={() => markStarted(course.slug)}
        >
          {copy.cta}
        </ButtonLink>
      ) : (
        <Button size="lg" className="w-full" onClick={() => setDialogOpen(true)}>
          {copy.cta}
        </Button>
      )}

      <LeavingDialog
        open={dialogOpen}
        hosted={hosted}
        onClose={() => setDialogOpen(false)}
        onConfirm={() => {
          markStarted(course.slug);
          setDialogOpen(false);
          window.requestAnimationFrame(() => {
            if (document.activeElement === document.body) actionRef.current?.focus();
          });
        }}
      />
    </section>
  );
}

/**
 * DS `Modal`, Type=Horizontal (left aligned): featured icon, title and supporting text, the
 * close X, then "Don't show again" and the two actions. 544 wide on desktop; on mobile the
 * icon sits above the text and the actions stack, the confirm first.
 */
function LeavingDialog({
  open,
  hosted,
  onClose,
  onConfirm,
}: {
  open: boolean;
  hosted: HostedCourse;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const titleId = React.useId();
  const bodyId = React.useId();
  const skipDialog = useLmsStore((s) => s.skipLeavingDialog);
  const setSkipDialog = useLmsStore((s) => s.setSkipLeavingDialog);
  // Focus starts on the action the learner came for, not on the close X.
  const confirmRef = React.useRef<HTMLAnchorElement>(null);
  const dialogRef = useDialog(open, onClose, { initialFocusRef: confirmRef });

  if (!open) return null;
  return (
    <div ref={dialogRef} className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="sk-backdrop sk-animate-fade absolute inset-0" onClick={onClose} aria-hidden />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={bodyId}
        className="relative w-full max-w-[544px] overflow-hidden rounded-xl bg-sko-bg-page shadow-xl"
      >
        <div className="flex flex-col gap-4 px-4 pt-4 md:flex-row md:px-6 md:pt-6">
          <span
            aria-hidden
            className="inline-flex size-12 shrink-0 items-center justify-center rounded-full bg-sko-bg-primary-soft text-sko-icon-primary"
          >
            <Icon icon={ExternalLink} size={24} />
          </span>
          <div className="flex min-w-0 flex-1 flex-col gap-0.5 pr-10 md:pr-8">
            <h2 id={titleId} className="sk-text-body-large-semibold text-sko-text-default">
              {hosted.dialog.title}
            </h2>
            <p id={bodyId} className="sk-text-body-medium-regular text-sko-text-subtle">
              {hosted.dialog.body}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 inline-flex size-11 items-center justify-center rounded-lg text-sko-text-subtle hover:bg-sko-bg-subtle"
        >
          <Icon icon={X} size={24} />
        </button>

        <div className="flex flex-col gap-3 px-4 pb-4 pt-6 md:flex-row md:items-center md:justify-between md:px-6 md:pb-6 md:pt-8">
          <label className="sk-text-body-medium-medium flex min-h-11 items-center gap-2 text-sko-text-muted md:min-h-0">
            <input
              type="checkbox"
              checked={skipDialog}
              onChange={(event) => setSkipDialog(event.target.checked)}
              className="size-4 accent-[var(--color-bg-primary)]"
            />
            {hosted.dialog.dontShowAgain}
          </label>
          <div className="flex flex-col-reverse gap-3 md:flex-row">
            <Button hierarchy="secondary" size="md" onClick={onClose}>
              {hosted.dialog.cancel}
            </Button>
            <ButtonLink ref={confirmRef} href={hosted.href} target="_blank" rel="noopener" size="md" onClick={onConfirm}>
              {hosted.dialog.confirm}
            </ButtonLink>
          </div>
        </div>
      </div>
    </div>
  );
}
