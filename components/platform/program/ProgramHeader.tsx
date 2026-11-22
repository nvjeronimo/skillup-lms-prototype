import * as React from "react";
import Link from "@/lib/router";
import { BookOpen, ChevronRight } from "lucide-react";
import { Icon } from "@/lib/icons";
import { ArrivalCount } from "@/components/atoms/ArrivalCount";
import { ButtonLink } from "@/components/atoms/ButtonLink";
import { CourseTypeBadge, DeliveryModeBadge, DifficultyBadge, ProviderBadge } from "@/components/atoms/MetaBadges";
import { programPartnersOf } from "@/lib/platform/my-learning";
import { PlatformProgressBar, ProgressCardLabel } from "@/components/platform/PlatformProgressBar";
import { useLmsStore } from "@/lib/store";
import type { Program } from "@/lib/platform/program";
import { MY_LEARNING_PROGRAMS_HREF } from "@/lib/platform/routes";
import { FadeImage } from "@/components/atoms/FadeImage";
import styles from "./ProgramHeader.module.css";

/* Breadcrumb item (DS `_Breadcrumb button base`): body-medium/Semibold, text/subtle; the
   current page is text/primary. 20px tall as drawn. The target is 44px below desktop and
   24px on desktop (WCAG 2.5.8); the negative margin keeps the breadcrumb at its drawn height. */
const CRUMB = `sk-text-body-medium-semibold ${styles.crumb}`;

/**
 * DS `LMS/Platform/Course-Detail/Course-Header`, Kind=Program, on its three breakpoints: the
 * hero above the tab bar, on bg/subtle. The component pins the Semantics collection to Dark,
 * so the whole band carries `data-theme="dark"` and every token below resolves dark in both
 * app themes.
 *
 * Decoration (decorative only): a circle on bg/primary at 12% and a circle of diagonal
 * hatch (1px border/primary lines every 10px along the edge) at 35%, drawn in CSS.
 * Content: breadcrumb, Course Type Badge, thumbnail + title (the page's <h1>), delivery and
 * difficulty badges, the stats row, and the Progress card.
 * - Desktop (1280 × 352): padding 20 / 40 / 40, the Progress card (360) on the right.
 * - Tablet (960 × 321): padding 16 / 24 / 32, 16 between the blocks, the Progress card (320)
 *   stays on the right of the title block, 24 apart.
 * - Mobile (375 × 525): padding 16 / 16 / 24, everything stacked 16 apart, the Progress card
 *   at full width.
 * As drawn, the breadcrumb ends at "Programs" below desktop (the title is the <h1> right
 * under it) and the mobile variant has no thumbnail.
 */
export function ProgramHeader({ program }: { program: Program }) {
  const showToast = useLmsStore((s) => s.showToast);
  const partners = programPartnersOf(program.slug);
  // The brand skin lives on <html>; a nested dark band needs it repeated to pick the
  // matching dark brand ramp. Read after mount so the server markup stays skin-neutral.
  const skin = useLmsStore((s) => s.skin);
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const stats = [program.stats.courses, program.stats.duration, program.stats.org];

  return (
    <header
      data-theme="dark"
      data-skin={mounted && skin !== "teal" ? skin : undefined}
      className={styles.header}
    >
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
          className={styles.dot}
        />

        <nav aria-label="Breadcrumb" className={styles.nav}>
          <ol className={styles.crumbs}>
            <li className={styles.crumbItem}>
              <Link
                href="/platform/my-learning"
                className={`${CRUMB} ${styles.crumbLink}`}
              >
                My Learning
              </Link>
              <Icon icon={ChevronRight} size={16} aria-hidden className={styles.chevron} />
            </li>
            <li className={styles.crumbItem}>
              {/* Programs is a tab of My Learning. */}
              <Link
                href={MY_LEARNING_PROGRAMS_HREF}
                className={`${CRUMB} ${styles.crumbLink}`}
              >
                Programs
              </Link>
              <Icon icon={ChevronRight} size={16} aria-hidden className={styles.chevronLast} />
            </li>
            {/* Below desktop the DS breadcrumb stops at the parent: the title is the <h1> right under it. */}
            <li className={styles.crumbCurrentItem}>
              <span aria-current="page" className={`${CRUMB} ${styles.crumbCurrent}`}>
                {program.title}
              </span>
            </li>
          </ol>
        </nav>

        <div className={styles.content}>
          <div className={styles.titleBlock}>
            {/* Below desktop the row is 36 tall: it is where the partner logos sit on a course. */}
            <div className={styles.typeRow}>
              <CourseTypeBadge value="Program" />
              {/* DS Course-Header Kind=Program (1.1): the partner logos at the end of the row,
                  Provider-Partner-Badge Type=Logo, Theme=Dark (the band is data-theme="dark"); the
                  same list as the program card. */}
              {partners.length ? (
                <ul
                  aria-label="Partners"
                  data-mock="Partner logos have no field: org is the platform's own key"
                  className={styles.partners}
                >
                  {partners.map((partner) => (
                    <li key={partner} className={styles.badgeItem}>
                      <ProviderBadge value={partner} type="logo" chip="page" />
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>

            <div className={styles.titleRow}>
              {/* The cover fades in over its bg/muted placeholder once loaded (motion-matrix §7.9): the
                  placeholder is the frame, so it stays behind the image and if the image fails. */}
              <span
                className={styles.cover}
              >
                <FadeImage src={program.imageSrc} alt="" className={styles.coverImage} />
              </span>
              <h1 className={`sk-text-headline-large-semibold ${styles.title}`}>
                {program.title}
              </h1>
            </div>

            <ul aria-label="Format and level" className={styles.format}>
              <li className={styles.badgeItem}>
                <DeliveryModeBadge value={program.deliveryMode} />
              </li>
              <li className={styles.badgeItem}>
                <DifficultyBadge value={program.difficulty} />
              </li>
            </ul>

            <ul aria-label="Program facts" className={styles.facts}>
              {stats.map((stat, i) => (
                <li key={stat} className={styles.fact}>
                  {i > 0 ? (
                    <span aria-hidden className={styles.factRule} />
                  ) : null}
                  {/* The DS row is 19 tall (the height of its separators); the 20px line is centred on it. */}
                  <span className={`sk-text-body-medium-regular ${styles.factText}`}>
                    {i === 0 ? (
                      <Icon icon={BookOpen} size={18} aria-hidden className={styles.factIcon} />
                    ) : null}
                    {stat}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <section
            data-mock="Program progress is not sent by the Course Home APIs"
            aria-label={program.progress.label}
            // The DS stroke is inside the card and the CSS border is outside the padding: 15 + 1 = the DS 16.
            className={styles.progress}
          >
            <div className={styles.progressTop}>
              <p className={`sk-text-headline-medium-bold ${styles.percent}`}>
                <ArrivalCount value={`${program.progress.percent}%`} />
              </p>
              <ProgressCardLabel complete={program.progress.percent >= 100} label={program.progress.label} />
            </div>
            {/* Green only once complete, beside the check icon and the word (as on the cards). */}
            <PlatformProgressBar
              value={program.progress.percent}
              label={program.progress.label}
              tone={program.progress.percent >= 100 ? "complete" : "progress"}
            />
            <p className={`sk-text-body-small-regular ${styles.note}`}>{program.progress.status}</p>
            <ButtonLink href={program.progress.href} size="lg" className={styles.cta}>
              {program.progress.cta}
            </ButtonLink>
            <p className={`sk-text-body-small-regular ${styles.note}`}>{program.progress.footer}</p>
          </section>
        </div>
      </div>
    </header>
  );
}
