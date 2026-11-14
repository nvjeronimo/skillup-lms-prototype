import * as React from "react";
import { ExternalLink, X } from "lucide-react";
import { Icon } from "@/lib/icons";
import { Button } from "@/components/atoms/Button";
import { ButtonLink } from "@/components/atoms/ButtonLink";
import { PlatformProgressBar } from "@/components/platform/PlatformProgressBar";
import type { CourseDetail, HostedCourse } from "@/lib/platform/course-detail";
import { useLmsStore } from "@/lib/store";
import { useDialog } from "@/lib/useDialog";
import { useExitTransition } from "@/lib/useExitTransition";
import { MOTION_MS } from "@/lib/motion/tokens";
import { cn } from "@/lib/utils";
import { inertProps } from "@/lib/inert";
import { useEdxScope } from "@/lib/edx-scope";
import styles from "./HostedProgressCard.module.css";

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
  // Open edX scope: no progress from the partner and no leaving dialog; the link opens in a new tab.
  const edx = useEdxScope();

  return (
    <section
      aria-label={course.progress.label}
      className={styles.card}
    >
      <div
        data-invented="hosted: Open edX gets no progress back from the partner"
        className={styles.cardHead}
      >
        <p className={`sk-text-headline-medium-bold ${styles.default}`}>
          {started ? (
            <>
              <span aria-hidden>—</span>
              <span className="sk-sr-only">Not available</span>
            </>
          ) : (
            "0%"
          )}
        </p>
        <p className={`sk-text-body-small-regular ${styles.subtle}`}>{course.progress.label}</p>
      </div>
      {edx ? null : <PlatformProgressBar value={0} label={course.progress.label} />}
      <p className={`sk-text-body-small-regular ${styles.subtle}`}>{copy.eyebrow}</p>
      {started || skipDialog || edx ? (
        <ButtonLink
          ref={actionRef}
          href={hosted.href}
          target="_blank"
          rel="noopener"
          size="lg"
          rightIcon={started || edx ? ExternalLink : undefined}
          className={styles.cta}
          onClick={() => markStarted(course.slug)}
        >
          {copy.cta}
        </ButtonLink>
      ) : (
        <Button size="lg" className={styles.cta} onClick={() => setDialogOpen(true)}>
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

  const { mounted, state, onAnimationEnd } = useExitTransition(open, MOTION_MS.short3);

  if (!mounted) return null;
  const closed = state === "closed";
  return (
    <div
      ref={dialogRef}
      data-state={state}
      aria-hidden={closed || undefined}
      {...inertProps(closed)}
      className={cn(styles.overlay, closed && styles.closed)}
    >
      {/* The backdrop's fade-out (short4) outlasts the dialog's pop-out (short3), so it ends the exit. */}
      <div
        className={`sk-backdrop sk-animate-fade ${styles.backdrop}`}
        onClick={onClose}
        onAnimationEnd={onAnimationEnd}
        aria-hidden
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={bodyId}
        className={`sk-animate-pop ${styles.dialog}`}
      >
        <div className={styles.dialogHead}>
          <span
            aria-hidden
            className={styles.featured}
          >
            <Icon icon={ExternalLink} size={24} />
          </span>
          <div className={styles.dialogText}>
            <h2 id={titleId} className={`sk-text-body-large-semibold ${styles.default}`}>
              {hosted.dialog.title}
            </h2>
            <p id={bodyId} className={`sk-text-body-medium-regular ${styles.subtle}`}>
              {hosted.dialog.body}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className={styles.close}
        >
          <Icon icon={X} size={24} />
        </button>

        <div className={styles.dialogFoot}>
          <label className={`sk-text-body-medium-medium ${styles.dontShow}`}>
            <input
              type="checkbox"
              checked={skipDialog}
              onChange={(event) => setSkipDialog(event.target.checked)}
              className={styles.checkbox}
            />
            {hosted.dialog.dontShowAgain}
          </label>
          <div className={styles.actions}>
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
