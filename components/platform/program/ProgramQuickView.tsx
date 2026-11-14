import * as React from "react";
import { Award, Check, Clock, X } from "lucide-react";
import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import { ButtonLink } from "@/components/atoms/ButtonLink";
import { CourseTypeBadge, DeliveryModeBadge, DifficultyBadge, ProviderBadge } from "@/components/atoms/MetaBadges";
import { PlatformProgressBar } from "@/components/platform/PlatformProgressBar";
import { CourseThumb } from "@/components/platform/my-learning/CourseThumb";
import { getProgramCertificate } from "@/lib/platform/catalog";
import { programPageHref } from "@/lib/platform/hrefs";
import type { MyLearningProgram } from "@/lib/platform/my-learning";
import { Icon } from "@/lib/icons";
import { inertProps } from "@/lib/inert";
import { MOTION_MS } from "@/lib/motion/tokens";
import { useDialog } from "@/lib/useDialog";
import { useExitTransition } from "@/lib/useExitTransition";
import { cn } from "@/lib/utils";
import { useEdxScope } from "@/lib/edx-scope";
import styles from "./ProgramQuickView.module.css";

export interface ProgramQuickViewProps {
  program: MyLearningProgram;
  open: boolean;
  onClose: () => void;
}

/** The slug of a program from its page link (`/platform/program/<slug>`). */
function slugOf(program: MyLearningProgram): string | undefined {
  return program.href?.split("/program/")[1]?.split(/[?#]/)[0];
}

const SECTION_TITLE = `sk-text-label-small-semibold ${styles.sectionTitle}`;

/**
 * Program quick view (proposal, Nelson 23 Oct 2026; no DS component yet): the program's most
 * important facts without leaving the list. A centred modal (full screen on a phone), opened
 * from the card's Quick view button. Top: the type, partners, title and badges. Then, each only
 * when there is data:
 * - Progress: "N of M courses complete", the bar, the last time studied, the hours and the end
 *   of access (Learner Home, `progress_details`), and the next deadline (Dates API);
 * - Courses: every course of the program in order, with its state (done, in progress with its
 *   percent and "Up next", not started) — programs API + course progress;
 * - Certificate: issued on a date, or what is left to earn it (Certificates API);
 * - What's included: the Program page's list (courses, hours, projects…; no API, sample-data mark);
 * - About: the overview and the skills. Open edX serves no program marketing text: it is mock
 *   copy until the vendor's catalogue (handoff map §37), so it carries the sample-data mark.
 * Bottom: "Open program page" and the card's own action (Resume, Start, View certificate).
 */
export function ProgramQuickView({ program, open, onClose }: ProgramQuickViewProps) {
  const titleId = React.useId();
  const dialogRef = useDialog(open, onClose);
  const { mounted, state, onAnimationEnd } = useExitTransition(open, MOTION_MS.short3);
  const slug = slugOf(program);
  const cert = slug ? getProgramCertificate(slug) : undefined;
  const detail = cert?.program;
  // Open edX scope: no last-studied date and no hours left (no source); the total effort stays.
  const edx = useEdxScope();

  if (!mounted) return null;
  const closed = state === "closed";
  const completed = program.progressPct >= 100;
  const notStarted = program.progressPct === 0;
  const facts = (
    edx
      ? [program.hours?.endsWith("total") ? program.hours : undefined, program.accessUntil]
      : [program.lastStudied, program.hours, program.accessUntil]
  ).filter(Boolean) as string[];
  const overview = detail?.about.find((a) => /overview/i.test(a.title))?.body?.[0];
  // One chip per skill: a program may write its skills as sentences in one paragraph.
  const skills = (detail?.about.find((a) => /skills/i.test(a.title))?.body ?? [])
    .flatMap((b) => b.split(/(?<=\.)\s+/))
    .map((t) => t.replace(/\.$/, "").trim())
    .filter(Boolean);
  const current = detail?.courses.find((c) => (c.card.progressPct ?? 0) > 0 && (c.card.progressPct ?? 0) < 100);
  const pageHref = program.href ?? (slug ? programPageHref(slug) : undefined);
  const actionHref = program.actionHref ?? program.href;
  const hierarchy = program.cta === "Resume" ? "primary" : "secondary";

  return (
    <div
      ref={dialogRef}
      data-state={state}
      aria-hidden={closed || undefined}
      {...inertProps(closed)}
      className={cn(styles.layer, closed && styles.closed)}
    >
      <div className={`sk-backdrop sk-animate-fade ${styles.backdrop}`} onClick={onClose} onAnimationEnd={onAnimationEnd} aria-hidden />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`sk-animate-pop ${styles.dialog}`}
      >
        {/* The program's identity on the dark hero of its card. */}
        <header data-theme="dark" className={styles.hero}>
          <div className={styles.typeRow}>
            <CourseTypeBadge value="Program" />
            {program.partners.length ? (
              <ul aria-label="Partners" className={styles.partners}>
                {program.partners.map((p) => (
                  <li key={p.name} className={styles.partner}>
                    <ProviderBadge value={p.name} type="logo" />
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
          <div className={styles.titleRow}>
            <CourseThumb initials={program.initials} imageSrc={program.imageSrc} className={styles.thumb} />
            <h2 id={titleId} className={`sk-text-title-large-semibold ${styles.title}`}>
              {program.title}
            </h2>
          </div>
          <div className={styles.badges}>
            <DeliveryModeBadge value={program.delivery} />
            <DifficultyBadge value={program.difficulty} />
          </div>
          {/* A Secondary icon button: it reads on the dark hero in every skin (Nelson, 23 Oct 2026). */}
          <Button
            hierarchy="secondary"
            size="md"
            iconOnly
            leftIcon={X}
            onClick={onClose}
            aria-label="Close quick view"
            className={styles.close}
          />
        </header>

        {/* The body scrolls: it takes the focus so a keyboard can scroll it (WCAG 2.1.1). */}
        <div tabIndex={0} aria-label="Program details" className={`sk-scroll ${styles.body}`}>
          {/* Progress */}
          <section aria-labelledby={`${titleId}-progress`} className={styles.section}>
            <h3 id={`${titleId}-progress`} className={SECTION_TITLE}>
              Progress
            </h3>
            <div className={styles.progressHead}>
              <p className={`sk-text-title-medium-semibold ${styles.textDefault}`}>
                {completed ? "Program completed" : notStarted ? "Not started" : program.courses}
              </p>
              <span className={`sk-text-body-medium-regular ${styles.courseCount}`}>
                {program.courseCount} {program.courseCount === 1 ? "course" : "courses"}
              </span>
            </div>
            <PlatformProgressBar stepped tone={completed ? "complete" : "progress"} value={program.progressPct} label={`${program.title} progress`} />
            {facts.length || program.nextDue ? (
              <div className={styles.factsRow}>
                {facts.length ? (
                  <p className={`sk-text-body-small-regular ${styles.facts}`}>
                    <Icon icon={Clock} size={16} className={styles.factsIcon} aria-hidden="true" />
                    {facts.join(" · ")}
                  </p>
                ) : null}
                {!completed && program.nextDue ? (
                  <Badge variant="soft" color="warning">
                    {program.nextDue}
                  </Badge>
                ) : null}
              </div>
            ) : null}
          </section>

          {/* Courses */}
          {detail?.courses.length ? (
            <section aria-labelledby={`${titleId}-courses`} className={styles.section}>
              <h3 id={`${titleId}-courses`} className={SECTION_TITLE}>
                Courses
              </h3>
              <ol className={styles.courses}>
                {detail.courses.map((c) => {
                  const pct = c.card.progressPct ?? 0;
                  const done = pct >= 100;
                  const isCurrent = c === current;
                  return (
                    <li key={c.id} className={cn(styles.course, isCurrent && styles.courseCurrent)}>
                      <span
                        aria-hidden="true"
                        className={cn(
                          "sk-text-body-small-semibold",
                          styles.step,
                          done ? styles.stepDone : isCurrent ? styles.stepCurrent : styles.stepTodo,
                        )}
                      >
                        {done ? <Icon icon={Check} size={14} /> : c.number}
                      </span>
                      <div className={styles.courseText}>
                        <span className={`sk-text-body-medium-medium ${styles.courseTitle}`}>{c.card.title}</span>
                        {/* Where the learner is in the course in progress ("Module 2 of 4 · …"). */}
                        {isCurrent && c.position ? (
                          <span className={`sk-text-body-small-regular ${styles.courseWhere}`}>
                            You left off in {c.position}
                            {c.detail ? ` · ${c.detail}` : ""}
                          </span>
                        ) : null}
                      </div>
                      <span className="sk-sr-only">{done ? "Completed" : pct > 0 ? `${pct}% complete` : "Not started"}</span>
                      <span aria-hidden="true" className={styles.courseState}>
                        {done ? (
                          <Badge variant="soft" color="success">Completed</Badge>
                        ) : pct > 0 ? (
                          <Badge variant="soft" color="info">{pct}%</Badge>
                        ) : (
                          <Badge color="gray">Not started</Badge>
                        )}
                      </span>
                    </li>
                  );
                })}
              </ol>
            </section>
          ) : null}

          {/* Certificate */}
          {cert ? (
            <section aria-labelledby={`${titleId}-cert`} className={styles.section}>
              <h3 id={`${titleId}-cert`} className={SECTION_TITLE}>
                Certificate
              </h3>
              <div
                className={cn(
                  styles.certificate,
                  cert.certificate.status === "issued" ? styles.certificateIssued : styles.certificatePending,
                )}
              >
                <Icon icon={Award} size={20} className={cn(styles.certificateIcon, cert.certificate.status === "issued" ? styles.certificateIconIssued : styles.certificateIconPending)} aria-hidden="true" />
                <div className={styles.certificateText}>
                  <p className={`sk-text-body-medium-semibold ${styles.textDefault}`}>
                    {cert.certificate.status === "issued" ? `Issued ${program.certificateDate ?? ""}`.trim() : "Program certificate"}
                  </p>
                  <p className={`sk-text-body-medium-regular ${styles.textSubtle}`}>
                    {cert.certificate.status === "issued"
                      ? "Every course of the program is complete."
                      : `Complete every course to earn it · ${cert.complete} of ${cert.courses.length} done`}
                  </p>
                </div>
              </div>
            </section>
          ) : null}

          {/* What's included: the Program page's sidebar list (Nelson, 23 Oct 2026). */}
          {detail?.included.length ? (
            <section
              aria-labelledby={`${titleId}-included`}
              data-mock="Content counts per program have no API"
              data-invented="catalogue: no content counts per program in Open edX"
              className={styles.section}
            >
              <h3 id={`${titleId}-included`} className={SECTION_TITLE}>
                What&apos;s included
              </h3>
              <ul className={`sk-text-body-medium-regular ${styles.included}`}>
                {detail.included.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          ) : null}

          {/* About: mock until the vendor's catalogue */}
          {overview || skills.length ? (
            <section
              aria-labelledby={`${titleId}-about`}
              data-invented="catalogue: no program marketing text in Open edX"
              data-mock="Open edX serves no program marketing text: overview and skills wait for the vendor's catalogue"
              className={styles.section}
            >
              <h3 id={`${titleId}-about`} className={SECTION_TITLE}>
                About this program
              </h3>
              {overview ? <p className={`sk-text-body-medium-regular ${styles.textMuted}`}>{overview}</p> : null}
              {skills.length ? (
                <ul className={styles.skills} aria-label="Skills you will gain">
                  {skills.slice(0, 6).map((s) => (
                    <li key={s} className={styles.skill}>
                      {/* A long skill wraps inside its chip instead of pushing the dialog wider. */}
                      <Badge color="gray" className={styles.skill}>
                        {s}
                      </Badge>
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>
          ) : null}
        </div>

        <footer className={styles.footer}>
          {pageHref ? (
            <ButtonLink href={pageHref} hierarchy="secondary" size="md" className={styles.action}>
              Open program page
            </ButtonLink>
          ) : null}
          {actionHref ? (
            <ButtonLink href={actionHref} hierarchy={hierarchy} size="md" aria-label={`${program.cta} ${program.title}`} className={styles.action}>
              {program.cta}
            </ButtonLink>
          ) : null}
        </footer>
      </div>
    </div>
  );
}
