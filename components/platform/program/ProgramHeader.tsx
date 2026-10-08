"use client";

import * as React from "react";
import Link from "next/link";
import { BookOpen, ChevronRight } from "lucide-react";
import { Icon } from "@/lib/icons";
import { ButtonLink } from "@/components/atoms/ButtonLink";
import { CourseTypeBadge, DeliveryModeBadge, DifficultyBadge } from "@/components/atoms/MetaBadges";
import { PlatformProgressBar } from "@/components/platform/PlatformProgressBar";
import { useLmsStore } from "@/lib/store";
import type { Program } from "@/lib/platform/program";

/* Breadcrumb item (DS `_Breadcrumb button base`): body-medium/Semibold, text/subtle; the
   current page is text/primary. 20px tall as drawn. The target is 44px below desktop and
   24px on desktop (WCAG 2.5.8); the negative margin keeps the breadcrumb at its drawn height. */
const CRUMB = "sk-text-body-medium-semibold -my-3 inline-flex min-h-11 items-center lg:-my-0.5 lg:min-h-6";

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
      className="relative overflow-hidden bg-sko-bg-subtle"
    >
      <div className="relative mx-auto w-full max-w-[1280px] px-4 pb-6 pt-4 md:px-6 md:pb-8 lg:px-10 lg:pb-10 lg:pt-5">
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
              <Link
                href="/platform/my-learning"
                className={`${CRUMB} text-sko-text-subtle hover:text-sko-text-default`}
              >
                My Learning
              </Link>
              <Icon icon={ChevronRight} size={16} aria-hidden className="text-sko-icon-muted" />
            </li>
            <li className="flex items-center gap-1.5 md:gap-2">
              {/* No Programs page in the prototype: say so instead of a dead link. */}
              <button
                type="button"
                onClick={() => showToast("Programs is not part of this prototype yet")}
                className={`${CRUMB} text-sko-text-subtle hover:text-sko-text-default`}
              >
                Programs
              </button>
              <Icon icon={ChevronRight} size={16} aria-hidden className="hidden text-sko-icon-muted lg:block" />
            </li>
            {/* Below desktop the DS breadcrumb stops at the parent: the title is the <h1> right under it. */}
            <li className="hidden min-w-0 items-center lg:flex">
              <span aria-current="page" className={`${CRUMB} text-sko-text-primary`}>
                {program.title}
              </span>
            </li>
          </ol>
        </nav>

        <div className="relative mt-4 flex flex-col gap-4 md:flex-row md:items-start md:gap-6 lg:mt-[18.75px] lg:gap-10 lg:pt-6">
          <div className="flex min-w-0 flex-1 flex-col gap-4 lg:min-h-[228.75px] lg:gap-0">
            {/* Below desktop the row is 36 tall: it is where the partner logos sit on a course. */}
            <div className="flex h-9 items-center gap-2 lg:h-auto lg:py-3">
              <CourseTypeBadge value="Program" />
            </div>

            <div className="flex items-start gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={program.imageSrc}
                alt=""
                className="hidden size-[88px] shrink-0 rounded-lg bg-sko-bg-muted object-cover md:block"
              />
              <h1 className="sk-text-headline-large-semibold min-w-0 flex-1 text-sko-text-default">
                {program.title}
              </h1>
            </div>

            <ul aria-label="Format and level" className="flex flex-wrap items-start gap-2 lg:py-3">
              <li className="flex">
                <DeliveryModeBadge value={program.deliveryMode} />
              </li>
              <li className="flex">
                <DifficultyBadge value={program.difficulty} />
              </li>
            </ul>

            <ul aria-label="Program facts" className="flex flex-wrap items-center gap-2 py-3">
              {stats.map((stat, i) => (
                <li key={stat} className="flex items-center gap-2">
                  {i > 0 ? (
                    <span aria-hidden className="h-[19px] border-l border-sko-border-default" />
                  ) : null}
                  {/* The DS row is 19 tall (the height of its separators); the 20px line is centred on it. */}
                  <span className="sk-text-body-medium-regular flex h-[19px] items-center gap-1.5 text-sko-text-default">
                    {i === 0 ? (
                      <Icon icon={BookOpen} size={18} aria-hidden className="text-sko-icon-default" />
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
            className="flex w-full shrink-0 flex-col gap-2 rounded-[10px] border border-sko-border-subtle bg-sko-bg-page p-[15px] md:w-[320px] lg:w-[360px]"
          >
            <div className="flex items-end justify-between gap-3">
              <p className="sk-text-headline-medium-bold text-sko-text-default">{program.progress.percent}%</p>
              <p className="sk-text-body-small-regular text-sko-text-subtle">{program.progress.label}</p>
            </div>
            <PlatformProgressBar value={program.progress.percent} label={program.progress.label} />
            <p className="sk-text-body-small-regular text-sko-text-subtle">{program.progress.status}</p>
            <ButtonLink href={program.progress.href} size="lg" className="w-full">
              {program.progress.cta}
            </ButtonLink>
            <p className="sk-text-body-small-regular text-sko-text-subtle">{program.progress.footer}</p>
          </section>
        </div>
      </div>
    </header>
  );
}
