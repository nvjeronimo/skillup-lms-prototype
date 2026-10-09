import Link from "next/link";
import { BookOpen, ChevronRight } from "lucide-react";
import { Icon } from "@/lib/icons";
import { ButtonLink } from "@/components/atoms/ButtonLink";
import { CourseTypeBadge, DeliveryModeBadge, DifficultyBadge } from "@/components/atoms/MetaBadges";
import { PlatformProgressBar } from "@/components/platform/PlatformProgressBar";
import type { CourseDetail } from "@/lib/platform/course-detail";
import { programPageHref } from "@/lib/platform/hrefs";
import { MY_LEARNING_PROGRAMS_HREF } from "@/lib/platform/routes";
import { HostedProgressCard } from "./HostedProgressCard";
import { cn } from "@/lib/utils";

/* Breadcrumb item, as on the Program header: body-medium/Semibold, 44px tall below desktop,
   20px as drawn on desktop with the target grown to 24px. */
const CRUMB = "sk-text-body-medium-semibold inline-flex min-h-11 items-center lg:-my-0.5 lg:min-h-6";

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

  return (
    <header className={cn("relative overflow-hidden bg-sko-bg-primary-soft", className)}>
      <div className="relative mx-auto flex w-full max-w-[1280px] flex-col gap-4 px-4 pb-6 pt-4 md:px-6 md:pb-8 lg:gap-0 lg:px-10 lg:pb-10 lg:pt-5">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-[103px] -top-[100px] size-[273px] rounded-full opacity-[0.35] md:-right-[73px] md:-top-[110px] lg:-right-[100px] lg:-top-[100px] lg:size-[360px]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, var(--color-border-primary) 0 1px, transparent 1px 7.07px)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -left-[56px] top-[256px] size-[147px] rounded-full bg-sko-bg-primary opacity-[0.12] md:left-auto md:right-[205px] md:top-[29px] md:size-[220px] lg:right-[280px] lg:top-[60px]"
        />

        <nav aria-label="Breadcrumb" className="relative">
          <ol className="flex flex-wrap items-center gap-x-1.5 md:gap-x-2">
            <li className="flex items-center gap-1.5 md:gap-2">
              <Link href="/platform/my-learning" className={`${CRUMB} text-sko-text-subtle hover:text-sko-text-default`}>
                My Learning
              </Link>
              <Icon icon={ChevronRight} size={16} aria-hidden className="text-sko-icon-muted" />
            </li>
            {course.program ? (
              <>
                {/* A course of a program is reached through it: My Learning › Programs › the program. */}
                <li className="flex items-center gap-1.5 md:gap-2">
                  <Link href={MY_LEARNING_PROGRAMS_HREF} className={`${CRUMB} text-sko-text-subtle hover:text-sko-text-default`}>
                    Programs
                  </Link>
                  <Icon icon={ChevronRight} size={16} aria-hidden className="text-sko-icon-muted" />
                </li>
                <li className="flex min-w-0 items-center gap-1.5 md:gap-2">
                  <Link
                    href={programPageHref(course.program.slug)}
                    className={`${CRUMB} min-w-0 text-sko-text-subtle hover:text-sko-text-default`}
                  >
                    {course.program.title}
                  </Link>
                  <Icon icon={ChevronRight} size={16} aria-hidden className="hidden text-sko-icon-muted lg:block" />
                </li>
              </>
            ) : (
              <li className="flex items-center gap-1.5 md:gap-2">
                {/* The Courses tab of My Learning is its default view. */}
                <Link href="/platform/my-learning" className={`${CRUMB} text-sko-text-subtle hover:text-sko-text-default`}>
                  Courses
                </Link>
                <Icon icon={ChevronRight} size={16} aria-hidden className="hidden text-sko-icon-muted lg:block" />
              </li>
            )}
            {/* Tablet and mobile draw the trail without its last item: the title is right under it. */}
            <li className="hidden min-w-0 items-center lg:flex">
              <span aria-current="page" className={`${CRUMB} text-sko-text-primary`}>
                {course.title}
              </span>
            </li>
          </ol>
        </nav>

        <div className="relative flex flex-col gap-4 md:flex-row md:items-start md:gap-6 lg:mt-[18.75px] lg:gap-10 lg:pt-6">
          {/* Desktop: the four rows are 237 tall in a 229 column, centred, as in the DS component. */}
          <div className="flex min-w-0 flex-1 flex-col gap-4 lg:-my-1 lg:gap-0">
            <div className="flex items-center justify-between gap-2 lg:max-w-[560px] lg:py-3">
              <CourseTypeBadge value="Course" />
              <ul
                aria-label="Partners"
                data-mock="Partner logos have no field: org is the platform's own key"
                className="flex items-center gap-3"
              >
                {course.partners.map((partner) => (
                  <li
                    key={partner.name}
                    className="flex h-9 w-[77px] items-center justify-center rounded border border-sko-text-on-primary bg-sko-bg-page p-[3px]"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={partner.logoSrc} alt={partner.name} width={69} height={28} className="h-7 w-[69px] object-contain" />
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={course.imageSrc}
                alt=""
                className="hidden size-[88px] shrink-0 rounded-lg bg-sko-bg-muted object-cover md:block"
              />
              <h1 className="sk-text-headline-large-semibold min-w-0 flex-1 text-sko-text-default">{course.title}</h1>
            </div>

            <ul aria-label="Format and level" className="flex flex-wrap items-start gap-2 lg:py-3">
              <li className="flex">
                <DeliveryModeBadge value={course.deliveryMode} />
              </li>
              <li className="flex" data-mock="No LMS API has the course level">
                <DifficultyBadge value={course.difficulty} />
              </li>
            </ul>

            {/* The 1px separators belong to the item on their right; the negative margin pushes the
                first one of every line out of the clipped box, so a wrapped line starts clean. */}
            <div className="overflow-hidden py-3 md:pb-0 lg:pb-3">
              <ul aria-label="Course facts" className="-ml-[17px] flex flex-wrap items-center gap-y-2">
                {facts.map((fact, i) => (
                  <li
                    key={fact}
                    className="sk-text-body-medium-regular ml-2 flex items-center gap-1.5 border-l border-sko-border-default pl-2 text-sko-text-default"
                  >
                    {i === 0 ? <Icon icon={BookOpen} size={18} aria-hidden className="text-sko-icon-default" /> : null}
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
              className="flex w-full shrink-0 flex-col gap-2 rounded-[10px] border border-sko-border-subtle bg-sko-bg-page p-[15px] md:w-[320px] lg:w-[360px]"
            >
              <div className="flex items-end justify-between gap-3">
                <p className="sk-text-headline-medium-bold text-sko-text-default">{course.progress.percent}%</p>
                <p className="sk-text-body-small-regular text-sko-text-subtle">{course.progress.label}</p>
              </div>
              <PlatformProgressBar value={course.progress.percent} label={course.progress.label} />
              <p className="sk-text-body-small-regular text-sko-text-subtle">{course.progress.eyebrow}</p>
              <ButtonLink href={course.progress.href} size="lg" className="w-full">
                {course.progress.cta}
              </ButtonLink>
              {/* The grade line. Drawn in warning (below the pass mark); on a passed course it takes the
                  success tokens: a proposal of 10 Oct 2026, not designed. */}
              <p
                className={cn(
                  "sk-text-body-small-medium flex items-center gap-1.5",
                  course.passed ? "text-sko-text-success" : "text-sko-text-warning",
                )}
              >
                <span
                  aria-hidden
                  className={cn("size-[7px] shrink-0 rounded-full", course.passed ? "bg-sko-bg-success" : "bg-sko-bg-warning")}
                />
                {course.progress.notPassing}
              </p>
              <p className="sk-text-body-small-regular flex flex-wrap items-center gap-x-1 gap-y-0.5 text-sko-text-subtle">
                <span>{course.progress.done}</span>
                <span aria-hidden>·</span>
                <span data-mock="Time left has no source: effort_time is null on every block">
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
