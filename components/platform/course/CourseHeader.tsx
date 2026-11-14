import Link from "@/lib/router";
import { BookOpen, ChevronRight } from "lucide-react";
import { Icon } from "@/lib/icons";
import { ArrivalCount } from "@/components/atoms/ArrivalCount";
import { ButtonLink } from "@/components/atoms/ButtonLink";
import { CourseTypeBadge, DeliveryModeBadge, DifficultyBadge, ProviderBadge } from "@/components/atoms/MetaBadges";
import { PlatformProgressBar, ProgressCardLabel } from "@/components/platform/PlatformProgressBar";
import type { CourseDetail } from "@/lib/platform/course-detail";
import { coursePartnersOf } from "@/lib/platform/my-learning";
import { programPageHref } from "@/lib/platform/hrefs";
import { MY_LEARNING_PROGRAMS_HREF } from "@/lib/platform/routes";
import { HostedProgressCard } from "./HostedProgressCard";
import { cn } from "@/lib/utils";
import { FadeImage } from "@/components/atoms/FadeImage";
import styles from "./CourseHeader.module.css";

/* Breadcrumb item, as on the Program header: body-medium/Semibold, 44px tall below desktop,
   20px as drawn on desktop with the target grown to 24px. */
const CRUMB = `sk-text-body-medium-semibold ${styles.crumb}`;

/**
 * DS `LMS/Platform/Course-Detail/Course-Header`, Kind=Course (desktop 6406:39262, tablet and
 * mobile variants on 6406:40055 and 6406:40771): the hero above the tab bar, light, on
 * bg/primary-soft. The Program page uses Kind=Program of the same component, which is pinned
 * to dark and has no partner logos, so it keeps its own file (program/ProgramHeader).
 *
 * Decoration (decorative only): a 220px circle on bg/primary at 12% and a hatched circle
 * (1px border/primary lines) at 35%, drawn in CSS as on the Program header.
 * Desktop: breadcrumb, then the info column (type + partner logos, 88px thumbnail + title,
 * badges, facts) beside the 360px Progress card, 40 apart.
 * Tablet: the same row, 24 apart, the card 320 wide; the breadcrumb stops at "Courses".
 * Mobile: one column, 16 apart, no thumbnail (as drawn), the card at full width.
 */
export function CourseHeader({ course, className }: { course: CourseDetail; className?: string }) {
  const facts = [course.stats.structure, course.stats.duration, course.stats.org];
  // "~ 8h 40m left" has no source in Open edX; "Completed …" / "Certificate issued …" do.
  const timeLeftInvented = /left$/.test(course.progress.timeLeft) ? "time: no time-left figure in Open edX" : undefined;

  return (
    <header className={cn(styles.header, className)}>
      <div className={styles.inner}>
        <div
          aria-hidden
          className={styles.hatch}
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, var(--color-border-primary) 0 1px, transparent 1px 7.07px)",
          }}
        />
        <div
          aria-hidden
          className={styles.circle}
        />

        <nav aria-label="Breadcrumb" className={styles.breadcrumb}>
          <ol className={styles.trail}>
            <li className={styles.crumbItem}>
              <Link href="/platform/my-learning" className={`${CRUMB} ${styles.crumbLink}`}>
                My Learning
              </Link>
              <Icon icon={ChevronRight} size={16} aria-hidden className={styles.chevron} />
            </li>
            {course.program ? (
              <>
                {/* A course of a program is reached through it: My Learning › Programs › the program. */}
                <li className={styles.crumbItem}>
                  <Link href={MY_LEARNING_PROGRAMS_HREF} className={`${CRUMB} ${styles.crumbLink}`}>
                    Programs
                  </Link>
                  <Icon icon={ChevronRight} size={16} aria-hidden className={styles.chevron} />
                </li>
                <li className={`${styles.crumbItem} ${styles.programCrumb}`}>
                  <Link
                    href={programPageHref(course.program.slug)}
                    className={`${CRUMB} ${styles.programCrumb} ${styles.crumbLink}`}
                  >
                    {course.program.title}
                  </Link>
                  <Icon icon={ChevronRight} size={16} aria-hidden className={`${styles.lastChevron} ${styles.chevron}`} />
                </li>
              </>
            ) : (
              <li className={styles.crumbItem}>
                {/* The Courses tab of My Learning is its default view. */}
                <Link href="/platform/my-learning" className={`${CRUMB} ${styles.crumbLink}`}>
                  Courses
                </Link>
                <Icon icon={ChevronRight} size={16} aria-hidden className={`${styles.lastChevron} ${styles.chevron}`} />
              </li>
            )}
            {/* Tablet and mobile draw the trail without its last item: the title is right under it. */}
            <li className={styles.currentItem}>
              <span aria-current="page" className={`${CRUMB} ${styles.current}`}>
                {course.title}
              </span>
            </li>
          </ol>
        </nav>

        <div className={styles.row}>
          {/* Desktop: the four rows are 237 tall in a 229 column, centred, as in the DS component. */}
          <div className={styles.info}>
            <div className={styles.typeRow}>
              <CourseTypeBadge value="Course" />
              {/* DS Course-Header: the Partners logos at the end of the type row, as Provider-Partner-Badge
                  Type=Logo (Theme=Light), the same list as the course card (provider, or its partners). */}
              <ul
                aria-label="Provider and partners"
                data-invented="partners: no partner-logo field in Open edX"
                data-mock="Partner logos have no field: org is the platform's own key"
                className={styles.partners}
              >
                {coursePartnersOf(course.slug, course.partners).map((partner) => (
                  <li key={partner} className={styles.flexItem}>
                    <ProviderBadge value={partner} type="logo" chip="page" />
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.titleRow}>
              {/* The cover fades in over its bg/muted placeholder once loaded (motion-matrix §7.9): the
                  placeholder is the frame, so it stays behind the image and if the image fails. */}
              <span
                className={styles.cover}
              >
                <FadeImage src={course.imageSrc} alt="" className={styles.coverImage} />
              </span>
              <h1 className={`sk-text-headline-large-semibold ${styles.title}`}>{course.title}</h1>
            </div>

            <ul aria-label="Format and level" className={styles.badges}>
              <li className={styles.flexItem}>
                <DeliveryModeBadge value={course.deliveryMode} />
              </li>
              <li className={styles.flexItem} data-invented="level: no course level in Open edX" data-mock="No LMS API has the course level">
                <DifficultyBadge value={course.difficulty} />
              </li>
            </ul>

            {/* The 1px separators belong to the item on their right; the negative margin pushes the
                first one of every line out of the clipped box, so a wrapped line starts clean. */}
            <div className={styles.factsClip}>
              <ul aria-label="Course facts" className={styles.facts}>
                {facts.map((fact, i) => (
                  <li
                    key={fact}
                    className={`sk-text-body-medium-regular ${styles.fact}`}
                  >
                    {i === 0 ? <Icon icon={BookOpen} size={18} aria-hidden className={styles.factIcon} /> : null}
                    {fact}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {course.hosted ? (
            <HostedProgressCard course={course} hosted={course.hosted} />
          ) : (
            <section
              aria-label={course.progress.label}
              className={styles.card}
            >
              <div className={styles.cardHead}>
                <p className={`sk-text-headline-medium-bold ${styles.percent}`}>
                  {/* One SCORM package (proposal, 11 Nov 2026): the status word, never a share. */}
                  {course.progress.status ?? <ArrivalCount value={`${course.progress.percent}%`} />}
                </p>
                <ProgressCardLabel complete={course.progress.percent >= 100} label={course.progress.label} />
              </div>
              {/* Green only once complete, beside the check icon and the word (as on the cards). */}
            {course.progress.status ? null : (
            <PlatformProgressBar
              value={course.progress.percent}
              label={course.progress.label}
              tone={course.progress.percent >= 100 ? "complete" : "progress"}
            />
            )}
              <p className={`sk-text-body-small-regular ${styles.subtle}`}>{course.progress.eyebrow}</p>
              <ButtonLink href={course.progress.href} size="lg" className={styles.cta}>
                {course.progress.cta}
              </ButtonLink>
              {/* The grade line. Drawn in warning (below the pass mark); on a passed course it takes the
                  success tokens: a proposal of 10 Oct 2026, not designed. */}
              <p
                className={cn(
                  "sk-text-body-small-medium",
                  styles.grade,
                  course.passed ? styles.gradePassed : styles.gradeBelow,
                )}
              >
                <span
                  aria-hidden
                  className={cn(styles.dot, course.passed ? styles.dotPassed : styles.dotBelow)}
                />
                {course.progress.notPassing}
              </p>
              <p className={`sk-text-body-small-regular ${styles.doneLine}`}>
                <span>{course.progress.done}</span>
                <span aria-hidden data-invented={timeLeftInvented}>·</span>
                <span data-invented={timeLeftInvented} data-mock="Time left has no source: effort_time is null on every block">
                  {course.progress.timeLeft}
                </span>
              </p>
            </section>
          )}
        </div>
      </div>
    </header>
  );
}
