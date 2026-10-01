"use client";

import * as React from "react";
import Link from "next/link";
import { BookOpen, ChevronRight } from "lucide-react";
import { Icon } from "@/lib/icons";
import { CourseTypeBadge, DeliveryModeBadge, DifficultyBadge } from "@/components/atoms/MetaBadges";
import { useLmsStore } from "@/lib/store";
import type { Program } from "@/lib/platform/program";
import { ProgramCtaLink, ProgramProgressBar } from "./parts";

/* Breadcrumb item (DS `_Breadcrumb button base`): body-medium/Semibold, text/subtle; the
   current page is text/primary. 44px tall below desktop so each crumb is a full touch target. */
const CRUMB = "sk-text-sm-semibold inline-flex min-h-11 items-center lg:min-h-0";

/**
 * DS `LMS / Course Detail / Course header`, Type=Program (6443:18729): the hero above the tab
 * bar. The component pins the Semantics collection to Dark, so the whole band carries
 * `data-theme="dark"` and every token below resolves dark in both app themes.
 *
 * Decoration (decorative only): a 220px circle on bg/primary at 12% and a 360px circle of
 * diagonal hatch — 1px border/primary lines every 10px along the edge — at 35%, drawn in CSS.
 * Content: breadcrumb, Course Type Badge, thumbnail + title (the page's <h1>), delivery and
 * difficulty badges, the stats row, and the Progress card (5422:600) in flow on the right.
 * Below desktop the card drops under the title block at full width (not drawn in Figma).
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
      <div className="relative mx-auto w-full max-w-[1280px] px-6 pb-10 pt-5 md:px-8 lg:px-10">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-[100px] -top-[100px] size-[360px] rounded-full opacity-[0.35]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, var(--color-border-primary) 0 1px, transparent 1px 7.07px)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute right-[280px] top-[60px] hidden size-[220px] rounded-full bg-sko-bg-primary opacity-[0.12] lg:block"
        />

        <nav aria-label="Breadcrumb" className="relative">
          <ol className="flex flex-wrap items-center gap-x-2">
            <li className="flex items-center gap-2">
              <Link
                href="/platform/my-learning"
                className={`${CRUMB} text-sko-text-subtle hover:text-sko-text-default`}
              >
                My Learning
              </Link>
              <Icon icon={ChevronRight} size={16} aria-hidden className="text-sko-icon-muted" />
            </li>
            <li className="flex items-center gap-2">
              {/* No Programs page in the prototype: say so instead of a dead link. */}
              <button
                type="button"
                onClick={() => showToast("Programs is not part of this prototype yet")}
                className={`${CRUMB} text-sko-text-subtle hover:text-sko-text-default`}
              >
                Programs
              </button>
              <Icon icon={ChevronRight} size={16} aria-hidden className="text-sko-icon-muted" />
            </li>
            <li className="flex min-w-0 items-center">
              <span aria-current="page" className={`${CRUMB} text-sko-text-primary`}>
                {program.title}
              </span>
            </li>
          </ol>
        </nav>

        <div className="relative mt-[18.75px] flex flex-col gap-6 pt-6 lg:flex-row lg:items-start lg:gap-10">
          <div className="flex min-w-0 flex-1 flex-col lg:min-h-[228.75px]">
            <div className="flex items-center gap-2 py-3">
              <CourseTypeBadge value="Program" />
            </div>

            <div className="flex items-start gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={program.imageSrc}
                alt=""
                className="size-16 shrink-0 rounded-lg bg-sko-bg-muted object-cover md:size-[88px]"
              />
              <h1 className="sk-text-display-md-semibold min-w-0 flex-1 text-sko-text-default">
                {program.title}
              </h1>
            </div>

            <ul aria-label="Format and level" className="flex flex-wrap items-start gap-2 py-3">
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
                  <span className="sk-text-sm-regular flex items-center gap-1.5 text-sko-text-default">
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
            aria-label={program.progress.label}
            className="flex w-full shrink-0 flex-col gap-2 rounded-[10px] border border-sko-border-subtle bg-sko-bg-page p-4 lg:w-[360px]"
          >
            <div className="flex items-end justify-between gap-3">
              <p className="sk-text-display-sm-bold text-sko-text-default">{program.progress.percent}%</p>
              <p className="sk-text-xs-regular text-sko-text-subtle">{program.progress.label}</p>
            </div>
            <ProgramProgressBar value={program.progress.percent} label={program.progress.label} />
            <p className="sk-text-xs-regular text-sko-text-subtle">{program.progress.status}</p>
            <ProgramCtaLink href={program.progress.href} size="lg" className="w-full">
              {program.progress.cta}
            </ProgramCtaLink>
            <p className="sk-text-xs-regular text-sko-text-subtle">{program.progress.footer}</p>
          </section>
        </div>
      </div>
    </header>
  );
}
