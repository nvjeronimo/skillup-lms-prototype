import * as React from "react";
import Link from "@/lib/router";
import { ButtonLink } from "@/components/atoms/ButtonLink";
import { CourseThumb } from "@/components/platform/my-learning/CourseThumb";
import { PlatformProgressBar } from "@/components/platform/PlatformProgressBar";
import { Icon, topicTypeIcon } from "@/lib/icons";
import type { DashboardResumeRow } from "@/lib/platform/dashboard-resume";
import { cn } from "@/lib/utils";
import styles from "./PickUp.module.css";

/**
 * "Pick up where you left off" (Nelson, 25 Oct 2026, after the DreamHost panel's home; Harbor and
 * Fluent first, every skin since 26 Oct 2026):
 * a list on the left (each course a white, hairlined card: its title and where it stopped) and
 * the chosen one large on the right, on a pale panel: the picture, the module, the next topic,
 * the progress and Resume. The list is a set of toggle buttons (aria-pressed) that drive the
 * panel, which is announced politely. Below desktop the list stacks above the panel.
 */
export function PickUp({ resume, titleId }: { resume: DashboardResumeRow[]; titleId: string }) {
  const [current, setCurrent] = React.useState(0);
  const course = resume[current] ?? resume[0];
  if (!course) return null;
  const NextIcon = course.next ? topicTypeIcon(course.next.type) : null;
  return (
    <div className={styles.card}>
      <ul aria-labelledby={titleId} className={styles.list}>
        {resume.map((c, i) => {
          const on = i === current;
          return (
            <li key={c.id}>
              <button
                type="button"
                aria-pressed={on}
                onClick={() => setCurrent(i)}
                className={cn(
                  styles.option,
                  on ? styles.optionOn : styles.optionOff,
                )}
              >
                <span className={cn("sk-text-body-medium-semibold", styles.optionTitle)}>{c.title}</span>
                <span className={cn("sk-text-body-small-regular", styles.optionMeta)}>{c.progressPct}% complete</span>
              </button>
            </li>
          );
        })}
      </ul>
      <div aria-live="polite" className={styles.panel}>
        {/* Another course picked: its preview fades in (short3), as a filtered list does in every
            skin. Keyed inside the live region, so the region itself stays mounted and keeps speaking. */}
        <div key={course.id} className={cn("sk-animate-fade-short3", styles.preview)}>
        <CourseThumb
          shape="cover"
          initials={course.initials}
          imageSrc={course.imageSrc}
          className={styles.cover}
        />
        <Link
          href={course.homeHref}
          className={cn("sk-text-title-large-semibold", styles.headline)}
        >
          {course.headline}
        </Link>
        {course.context ? (
          <p className={cn("sk-text-body-medium-regular", styles.context)}>{course.context}</p>
        ) : null}
        {course.next && NextIcon ? (
          <p className={cn("sk-text-body-medium-medium", styles.next)}>
            <Icon icon={NextIcon} size={16} className={styles.nextIcon} aria-hidden />
            Next: {course.next.type}
            {course.next.duration ? ` · ${course.next.duration}` : ""}
          </p>
        ) : null}
        <div className={styles.progress}>
          <PlatformProgressBar value={course.progressPct} label={`${course.title} progress`} className={styles.bar} />
          <span className={cn("sk-text-body-medium-semibold", styles.percent)}>{course.progressPct}%</span>
        </div>
        <div className={styles.actions}>
          <ButtonLink href={course.href} hierarchy="primary" size="md">
            Resume
          </ButtonLink>
          <ButtonLink href={course.homeHref} hierarchy="secondary" size="md">
            View course
          </ButtonLink>
        </div>
        </div>
      </div>
    </div>
  );
}
