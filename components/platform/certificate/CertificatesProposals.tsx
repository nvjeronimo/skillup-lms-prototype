"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Award, Check, CheckCircle2 } from "lucide-react";
import { Icon } from "@/lib/icons";
import { Badge } from "@/components/atoms/Badge";
import { ButtonLink } from "@/components/atoms/ButtonLink";
import { FilterChip } from "@/components/atoms/FilterChip";
import { CourseTypeBadge } from "@/components/atoms/MetaBadges";
import { PlatformProgressBar } from "@/components/platform/PlatformProgressBar";
import { CertificateShare } from "@/components/platform/certificate/CertificateShare";
import { CourseThumb } from "@/components/platform/my-learning/CourseThumb";
import {
  earnedByDate,
  enrolmentOf,
  enrolments,
  type CourseLine,
  type Enrolment,
} from "@/lib/platform/certificate-enrolments";
import { earnedIssuedValue, type EarnedCertificate } from "@/lib/platform/certificates";
import { cn } from "@/lib/utils";
import { EarnedActions, Sheet } from "./CertificatesByProgram";

/**
 * PROPOSALS (Nelson, 30 Oct 2026): the Certificates page without the Earned / In progress tabs,
 * which split a program whose course certificates are issued while its own is not, and without
 * the Programs-then-Other-courses split. Four directions on one model (certificate-enrolments):
 *
 * 1 · One list: one card per enrolment, program or course, the same shape; a program lists its
 *     courses under it as a checklist.
 * 2 · Ledger: one row per certificate, earned or on the way; status and type are filters.
 * 3 · Path: each enrolment as a path of courses ending in its certificate; a single course is a
 *     path of one.
 * 4 · Shelf: what you hold, as a wall of certificates, then what you are working towards.
 */
export const PROPOSALS = ["Now", "One list", "Ledger", "Path", "Shelf"] as const;

const MOCK =
  "No API says whether a program certificate is earned: counted here from the course rows";
const CARD = "rounded-card border border-sko-border-subtle bg-sko-bg-page";
const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;
const issuedOn = (e: EarnedCertificate) => e.certificate.document.issuedOn;

const matches = (e: Enrolment, needle: string) =>
  !needle ||
  e.title.toLowerCase().includes(needle) ||
  e.courses.some((c) => c.title.toLowerCase().includes(needle));

function NoMatch({ needle }: { needle: string }) {
  return (
    <p className="sk-text-body-large-regular py-10 text-center text-sko-text-subtle">
      {needle ? "No certificates match your search." : "No certificates here yet."}
    </p>
  );
}

/** How far an enrolment is, in its own words: courses for a program, percent for a course. */
const progressWords = (e: Enrolment) =>
  e.kind === "program"
    ? `${e.complete} of ${plural(e.courses.length, "course", "courses")} complete`
    : `${e.percent}% complete`;

/** The course to carry on with: the first started and not earned, else the first not started. */
const nextCourse = (e: Enrolment) =>
  e.courses.find((c) => c.state === "in-progress") ??
  e.courses.find((c) => c.state === "not-started");

function StateDot({ state, number }: { state: CourseLine["state"]; number?: number }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "sk-text-body-small-semibold flex size-7 shrink-0 items-center justify-center rounded-pill",
        state === "earned" && "bg-sko-bg-success text-sko-text-on-primary",
        state === "in-progress" && "border-2 border-sko-border-info text-sko-text-default",
        state === "not-started" && "border border-sko-border-default text-sko-text-subtle",
      )}
    >
      {state === "earned" ? <Icon icon={Check} size={16} /> : (number ?? "")}
    </span>
  );
}

/* ── 1 · One list ─────────────────────────────────────────────────────────────────── */

function EnrolmentStatus({ e }: { e: Enrolment }) {
  if (e.issued) {
    return (
      <div className="flex flex-col gap-2 sm:items-end">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="soft" color="success" leftIcon={CheckCircle2}>
            {e.kind === "program" ? "Program certificate earned" : "Certificate earned"}
          </Badge>
          <span className="sk-text-body-medium-regular text-sko-text-subtle">
            {issuedOn(e.issued)}
          </span>
        </div>
        <EarnedActions e={e.issued} primary />
      </div>
    );
  }
  return (
    <div className="flex w-full flex-col gap-1.5 sm:w-[240px]">
      <PlatformProgressBar value={e.percent} label={`${e.title}: ${progressWords(e)}`} />
      <p className="sk-text-body-medium-regular text-sko-text-subtle">{progressWords(e)}</p>
      {e.kind === "program" ? (
        <p className="sk-text-body-small-regular text-sko-text-subtle">
          Program certificate when all are complete
        </p>
      ) : null}
    </div>
  );
}

function CourseChecklistRow({ c }: { c: CourseLine }) {
  return (
    <li className="flex items-start gap-3 py-2.5 md:items-center">
      <StateDot state={c.state} number={c.number} />
      {/* Mobile: the title, then its state or actions under it; one line from tablet up. */}
      <div className="flex min-w-0 flex-1 flex-col gap-2 md:flex-row md:items-center md:gap-3">
        <Link
          href={c.href}
          className="sk-text-body-large-regular min-w-0 flex-1 text-sko-text-default hover:underline"
        >
          {c.title}
        </Link>
        {c.earned ? (
          <div className="flex shrink-0 items-center gap-2">
            <span className="sk-text-body-medium-regular text-sko-text-subtle md:order-none">
              {issuedOn(c.earned)}
            </span>
            <EarnedActions e={c.earned} />
          </div>
        ) : (
          <span className="sk-text-body-medium-regular shrink-0 text-sko-text-subtle">
            {c.state === "in-progress" ? `${c.percent}% complete` : "Not started"}
          </span>
        )}
      </div>
    </li>
  );
}

function OneList({ needle }: { needle: string }) {
  const list = enrolments.filter((e) => matches(e, needle));
  if (!list.length) return <NoMatch needle={needle} />;
  return (
    <ul className="flex flex-col gap-layout-grid">
      {list.map((e) => (
        <li
          key={e.slug}
          data-mock={e.kind === "program" ? MOCK : undefined}
          className={cn(CARD, "p-4 md:p-5")}
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex min-w-0 items-start gap-3">
              <CourseThumb initials={e.initials} imageSrc={e.imageSrc} className="size-14" />
              <div className="flex min-w-0 flex-col gap-1.5">
                <CourseTypeBadge value={e.kind === "program" ? "Program" : "Course"} />
                <h3 className="sk-text-title-medium-semibold text-sko-text-default">
                  <Link href={e.href} className="hover:underline">
                    {e.title}
                  </Link>
                </h3>
              </div>
            </div>
            <EnrolmentStatus e={e} />
          </div>
          {e.kind === "program" ? (
            <ol
              aria-label={`Courses of ${e.title}`}
              className="mt-4 divide-y divide-sko-border-subtle border-t border-sko-border-subtle"
            >
              {e.courses.map((c) => (
                <CourseChecklistRow key={c.slug} c={c} />
              ))}
            </ol>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

/* ── 2 · Ledger ───────────────────────────────────────────────────────────────────── */

interface LedgerItem {
  id: string;
  title: string;
  type: "program" | "course";
  context: React.ReactNode;
  earned?: EarnedCertificate;
  percent: number;
  progress: string;
  href: string;
  action: string;
}

function ledgerItems(): LedgerItem[] {
  const items: LedgerItem[] = [];
  for (const e of enrolments) {
    if (e.kind === "program") {
      items.push({
        id: `p-${e.slug}`,
        title: e.title,
        type: "program",
        context: `Program certificate · ${plural(e.courses.length, "course", "courses")}`,
        earned: e.issued,
        percent: e.percent,
        progress: progressWords(e),
        href: e.href,
        action: "View program",
      });
    }
    for (const c of e.courses) {
      if (c.state === "not-started") continue;
      items.push({
        id: `c-${c.slug}`,
        title: c.title,
        type: "course",
        context:
          e.kind === "program" ? (
            <>
              Course {c.number} of {e.courses.length} ·{" "}
              <Link href={e.href} className="underline-offset-2 hover:underline">
                {e.title}
              </Link>
            </>
          ) : (
            "Course"
          ),
        earned: c.earned,
        percent: c.percent,
        progress: `${c.percent}% complete`,
        href: c.href,
        action: "Continue",
      });
    }
  }
  const date = (i: LedgerItem) => (i.earned ? earnedIssuedValue(i.earned) : 0);
  return items.sort(
    (a, b) => Number(!!b.earned) - Number(!!a.earned) || date(b) - date(a) || b.percent - a.percent,
  );
}

function EmptySheet() {
  return (
    <div className="flex aspect-[1123/794] w-16 shrink-0 items-center justify-center rounded-control border border-dashed border-sko-border-default bg-sko-bg-subtle md:w-20">
      <Icon icon={Award} size={20} aria-hidden className="text-sko-icon-muted" />
    </div>
  );
}

function Ledger({ needle }: { needle: string }) {
  const [status, setStatus] = React.useState<"all" | "earned" | "progress">("all");
  const [type, setType] = React.useState<"all" | "program" | "course">("all");
  const all = React.useMemo(ledgerItems, []);
  const searched = all.filter((i) => !needle || i.title.toLowerCase().includes(needle));
  const byStatus = (s: typeof status) =>
    searched.filter((i) => s === "all" || (s === "earned" ? !!i.earned : !i.earned));
  const list = byStatus(status).filter((i) => type === "all" || i.type === type);
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <div role="group" aria-label="Status" className="flex flex-wrap gap-2">
          <FilterChip
            label="All"
            count={searched.length}
            active={status === "all"}
            onClick={() => setStatus("all")}
          />
          <FilterChip
            label="Earned"
            count={byStatus("earned").length}
            active={status === "earned"}
            onClick={() => setStatus("earned")}
          />
          <FilterChip
            label="In progress"
            count={byStatus("progress").length}
            active={status === "progress"}
            onClick={() => setStatus("progress")}
          />
        </div>
        <div role="group" aria-label="Type" className="flex flex-wrap gap-2">
          <FilterChip
            label="Programs and courses"
            active={type === "all"}
            onClick={() => setType("all")}
          />
          <FilterChip
            label="Programs"
            active={type === "program"}
            onClick={() => setType("program")}
          />
          <FilterChip
            label="Courses"
            active={type === "course"}
            onClick={() => setType("course")}
          />
        </div>
      </div>
      {list.length ? (
        <div className={cn(CARD, "px-4 md:px-5")}>
          <div
            aria-hidden="true"
            className="sk-text-label-small-medium hidden grid-cols-[80px_minmax(0,1fr)_220px_200px] gap-x-4 border-b border-sko-border-subtle py-3 text-sko-text-subtle md:grid"
          >
            <span />
            <span>Certificate</span>
            <span>Status</span>
            <span />
          </div>
          <ul className="divide-y divide-sko-border-subtle">
            {list.map((i) => (
              <li
                key={i.id}
                data-mock={i.type === "program" ? MOCK : undefined}
                className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-3 gap-y-2 py-3 md:grid-cols-[80px_minmax(0,1fr)_220px_200px] md:gap-x-4"
              >
                {i.earned ? (
                  <Sheet
                    e={i.earned}
                    className="row-span-3 w-16 self-start md:row-span-1 md:w-20 md:self-center"
                  />
                ) : (
                  <div className="row-span-3 self-start md:row-span-1 md:self-center">
                    <EmptySheet />
                  </div>
                )}
                <div className="flex min-w-0 flex-col gap-0.5">
                  <h3 className="sk-text-body-large-semibold text-sko-text-default">{i.title}</h3>
                  <p className="sk-text-body-medium-regular text-sko-text-subtle">{i.context}</p>
                </div>
                <div className="col-start-2 flex flex-col gap-1 md:col-start-auto">
                  {i.earned ? (
                    <div className="flex flex-col items-start gap-1">
                      <Badge variant="soft" color="success" leftIcon={CheckCircle2}>
                        Earned
                      </Badge>
                      <span className="sk-text-body-medium-regular text-sko-text-subtle">
                        {issuedOn(i.earned)}
                      </span>
                    </div>
                  ) : (
                    <>
                      <PlatformProgressBar value={i.percent} label={`${i.title}: ${i.progress}`} />
                      <span className="sk-text-body-small-regular text-sko-text-subtle">
                        {i.progress}
                      </span>
                    </>
                  )}
                </div>
                <div className="col-start-2 flex md:col-start-auto md:justify-end">
                  {i.earned ? (
                    <EarnedActions e={i.earned} />
                  ) : (
                    <ButtonLink
                      href={i.href}
                      hierarchy="secondary"
                      size="sm"
                      className="max-md:h-11"
                    >
                      {i.action}
                    </ButtonLink>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <NoMatch needle={needle} />
      )}
    </div>
  );
}

/* ── 3 · Path ─────────────────────────────────────────────────────────────────────── */

function PathStep({ c, last }: { c: CourseLine; last: boolean }) {
  return (
    <li className="relative flex gap-3 pb-5 lg:flex-1 lg:flex-col lg:gap-2 lg:pb-0 lg:pr-3">
      {/* The rail to the next step: down on mobile and tablet, across on desktop. */}
      {!last ? (
        <span
          aria-hidden="true"
          className={cn(
            "absolute left-[13px] top-8 h-[calc(100%-2rem)] w-0.5 lg:left-8 lg:right-0 lg:top-[13px] lg:h-0.5 lg:w-auto",
            c.state === "earned" ? "bg-sko-bg-success" : "bg-sko-border-subtle",
          )}
        />
      ) : null}
      <StateDot state={c.state} number={c.number} />
      <div className="flex min-w-0 flex-col gap-1">
        <Link
          href={c.href}
          className="sk-text-body-medium-semibold line-clamp-2 text-sko-text-default hover:underline"
        >
          {c.title}
        </Link>
        {c.earned ? (
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="sk-text-body-small-regular text-sko-text-subtle">
              {issuedOn(c.earned)}
            </span>
            <ButtonLink
              href={c.earned.viewHref}
              hierarchy="link"
              size="sm"
              aria-label={`View certificate: ${c.title}`}
            >
              View
            </ButtonLink>
          </div>
        ) : (
          <span className="sk-text-body-small-regular text-sko-text-subtle">
            {c.state === "in-progress" ? `${c.percent}% complete` : "Not started"}
          </span>
        )}
      </div>
    </li>
  );
}

function PathGoal({ e }: { e: Enrolment }) {
  const what = e.kind === "program" ? "Program certificate" : "Course certificate";
  return (
    <li
      data-mock={e.kind === "program" ? MOCK : undefined}
      className={cn(
        "flex gap-3 rounded-card p-3",
        e.kind === "program"
          ? "lg:w-[220px] lg:shrink-0 lg:flex-col lg:gap-2"
          : "items-center lg:w-[420px] lg:shrink-0",
        e.issued ? "bg-sko-bg-success-soft" : "border border-dashed border-sko-border-default",
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "flex size-7 shrink-0 items-center justify-center rounded-pill",
          e.issued
            ? "bg-sko-bg-success text-sko-text-on-primary"
            : "bg-sko-bg-subtle text-sko-icon-muted",
        )}
      >
        <Icon icon={Award} size={16} />
      </span>
      <div className="flex min-w-0 flex-col gap-1">
        <p className="sk-text-body-medium-semibold text-sko-text-default">{what}</p>
        {e.issued ? (
          <>
            <span className="sk-text-body-small-regular text-sko-text-subtle">
              Earned {issuedOn(e.issued)}
            </span>
            <div className="flex items-center gap-1.5 pt-1">
              <ButtonLink
                href={e.issued.viewHref}
                hierarchy="primary"
                size="sm"
                className="max-md:h-11"
              >
                View
              </ButtonLink>
              <CertificateShare
                target={{
                  title: e.issued.certificate.title,
                  document: e.issued.certificate.document,
                }}
                look="icon"
                up
              />
            </div>
          </>
        ) : (
          <span className="sk-text-body-small-regular text-sko-text-subtle">
            {e.kind === "program"
              ? `Yours when all ${e.courses.length} courses are complete`
              : "Yours when the course is complete"}
          </span>
        )}
      </div>
    </li>
  );
}

function Path({ needle }: { needle: string }) {
  const list = enrolments.filter((e) => matches(e, needle));
  if (!list.length) return <NoMatch needle={needle} />;
  return (
    <ul className="flex flex-col gap-layout-grid">
      {list.map((e) => (
        <li key={e.slug} className={cn(CARD, "flex flex-col gap-5 p-4 md:p-5 lg:p-6")}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <CourseThumb initials={e.initials} imageSrc={e.imageSrc} className="size-12" />
              <div className="flex min-w-0 flex-col gap-1">
                <CourseTypeBadge value={e.kind === "program" ? "Program" : "Course"} />
                <h3 className="sk-text-title-medium-semibold text-sko-text-default">
                  <Link href={e.href} className="hover:underline">
                    {e.title}
                  </Link>
                </h3>
              </div>
            </div>
            <p className="sk-text-body-medium-regular text-sko-text-subtle">{progressWords(e)}</p>
          </div>
          <ol
            aria-label={`Path to the certificate of ${e.title}`}
            className="flex flex-col gap-3 lg:flex-row lg:items-start lg:gap-4"
          >
            {e.kind === "program" ? (
              <li className="lg:flex-1">
                <ol className="flex flex-col lg:flex-row">
                  {e.courses.map((c, i) => (
                    <PathStep key={c.slug} c={c} last={i === e.courses.length - 1} />
                  ))}
                </ol>
              </li>
            ) : null}
            {e.kind === "course" && !e.issued ? (
              <li className="lg:flex-1">
                <div className="flex flex-col gap-1.5 lg:max-w-[360px]">
                  <PlatformProgressBar
                    value={e.percent}
                    label={`${e.title}: ${progressWords(e)}`}
                  />
                  <ButtonLink
                    href={e.href}
                    hierarchy="link"
                    size="sm"
                    rightIcon={ArrowRight}
                    className="self-start"
                  >
                    Continue the course
                  </ButtonLink>
                </div>
              </li>
            ) : null}
            <PathGoal e={e} />
          </ol>
        </li>
      ))}
    </ul>
  );
}

/* ── 4 · Shelf ────────────────────────────────────────────────────────────────────── */

function Shelf({ needle }: { needle: string }) {
  const held = earnedByDate.filter(
    (e) =>
      !needle ||
      e.certificate.title.toLowerCase().includes(needle) ||
      e.program?.title.toLowerCase().includes(needle),
  );
  const goals = enrolments.filter((e) => !e.issued && matches(e, needle));
  return (
    <div className="flex flex-col gap-layout-section">
      <section aria-labelledby="shelf-held" className="flex flex-col gap-4">
        <h2 id="shelf-held" className="sk-text-title-large-semibold text-sko-text-default">
          Your certificates <span className="text-sko-text-subtle">· {held.length}</span>
        </h2>
        {held.length ? (
          <ul className="grid grid-flow-dense grid-cols-2 gap-layout-grid lg:grid-cols-4">
            {held.map((e) => {
              const program = e.kind === "program";
              const of = enrolmentOf(e);
              return (
                <li
                  key={e.id}
                  data-mock={program ? MOCK : undefined}
                  className={cn(
                    CARD,
                    "flex flex-col gap-3 p-3",
                    program &&
                      "sm:col-span-2 lg:grid lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:grid-rows-[1fr_auto] lg:gap-x-4",
                  )}
                >
                  <Link
                    href={e.viewHref}
                    aria-label={`View certificate: ${e.certificate.title}`}
                    className={cn(
                      "block transition-opacity hover:opacity-90",
                      program && "lg:row-span-2 lg:self-center",
                    )}
                  >
                    <Sheet e={e} className="w-full" />
                  </Link>
                  <div className={cn("flex flex-1 flex-col gap-1", program && "lg:justify-end")}>
                    {program ? (
                      <Badge variant="soft" color="success" leftIcon={Award} className="self-start">
                        Program certificate
                      </Badge>
                    ) : null}
                    <h3 className="sk-text-body-large-semibold text-sko-text-default">
                      {e.certificate.title}
                    </h3>
                    <p className="sk-text-body-medium-regular text-sko-text-subtle">
                      {program ? (
                        plural(e.program?.total ?? 0, "course", "courses")
                      ) : e.program ? (
                        <>
                          Course {e.program.number} of {e.program.total} ·{" "}
                          <Link href={of?.href ?? "#"} className="hover:underline">
                            {e.program.title}
                          </Link>
                        </>
                      ) : (
                        "Course"
                      )}
                    </p>
                    <p className="sk-text-body-small-regular text-sko-text-subtle">{issuedOn(e)}</p>
                  </div>
                  <EarnedActions e={e} primary={program} />
                </li>
              );
            })}
          </ul>
        ) : (
          <NoMatch needle={needle} />
        )}
      </section>

      {goals.length ? (
        <section aria-labelledby="shelf-goals" className="flex flex-col gap-4">
          <h2 id="shelf-goals" className="sk-text-title-large-semibold text-sko-text-default">
            Working towards <span className="text-sko-text-subtle">· {goals.length}</span>
          </h2>
          <ul className={cn(CARD, "divide-y divide-sko-border-subtle px-4 md:px-5")}>
            {goals.map((e) => {
              const next = nextCourse(e);
              const earnedHere = e.courses.filter((c) => c.earned).length;
              return (
                <li
                  key={e.slug}
                  data-mock={e.kind === "program" ? MOCK : undefined}
                  className="flex flex-col gap-3 py-4 md:flex-row md:items-center md:gap-6"
                >
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <CourseThumb initials={e.initials} imageSrc={e.imageSrc} className="size-12" />
                    <div className="flex min-w-0 flex-col gap-1">
                      <CourseTypeBadge value={e.kind === "program" ? "Program" : "Course"} />
                      <h3 className="sk-text-body-large-semibold text-sko-text-default">
                        <Link href={e.href} className="hover:underline">
                          {e.title}
                        </Link>
                      </h3>
                      {e.kind === "program" && earnedHere ? (
                        <p className="sk-text-body-small-regular text-sko-text-subtle">
                          {plural(earnedHere, "course certificate", "course certificates")} already
                          on your shelf
                        </p>
                      ) : null}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 md:w-[240px]">
                    <PlatformProgressBar
                      value={e.percent}
                      label={`${e.title}: ${progressWords(e)}`}
                    />
                    <span className="sk-text-body-small-regular text-sko-text-subtle">
                      {progressWords(e)}
                    </span>
                  </div>
                  {next ? (
                    <ButtonLink
                      href={next.href}
                      hierarchy="secondary"
                      size="sm"
                      className="max-md:h-11 md:w-[200px] md:justify-center"
                    >
                      {e.kind === "program" ? `Next: course ${next.number}` : "Continue"}
                    </ButtonLink>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}
    </div>
  );
}

export function CertificatesProposal({ index, needle }: { index: number; needle: string }) {
  if (index === 1) return <OneList needle={needle} />;
  if (index === 2) return <Ledger needle={needle} />;
  if (index === 3) return <Path needle={needle} />;
  return <Shelf needle={needle} />;
}

/* ── The picker (prototype harness chrome, not part of the design) ─────────────────── */

const PICKER_CSS = `
/* token-lint-disable-next-line prototype picker chrome, fixed by the prototype skill */
.proto-picker{position:fixed;bottom:24px;left:50%;transform:translateX(-50%);z-index:2147483647;display:flex;align-items:center;gap:2px;padding:4px;border-radius:999px;background:rgba(10,10,10,.82);-webkit-backdrop-filter:blur(12px) saturate(1.4);backdrop-filter:blur(12px) saturate(1.4);box-shadow:0 0 0 1px rgba(255,255,255,.08) inset,0 8px 24px rgba(0,0,0,.24),0 2px 6px rgba(0,0,0,.12);font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;font-size:13px;line-height:1;-webkit-font-smoothing:antialiased;user-select:none;-webkit-user-select:none}
/* token-lint-disable-next-line prototype picker chrome, fixed by the prototype skill */
.proto-picker-highlight{position:absolute;top:4px;left:0;height:28px;border-radius:999px;background:rgba(255,255,255,.12);will-change:transform}
/* token-lint-disable-next-line prototype picker chrome, fixed by the prototype skill */
.proto-picker[data-ready] .proto-picker-highlight{transition:transform 250ms cubic-bezier(.23,1,.32,1),width 250ms cubic-bezier(.23,1,.32,1)}
/* token-lint-disable-next-line prototype picker chrome, fixed by the prototype skill */
@media (prefers-reduced-motion:reduce){.proto-picker[data-ready] .proto-picker-highlight{transition:none}}
/* token-lint-disable-next-line prototype picker chrome, fixed by the prototype skill */
.proto-picker-item{white-space:nowrap;position:relative;display:flex;align-items:center;height:28px;padding:0 12px;border:0;border-radius:999px;background:transparent;color:rgba(255,255,255,.55);font:inherit;cursor:pointer;transition:color 150ms ease-out}
/* token-lint-disable-next-line prototype picker chrome, fixed by the prototype skill */
.proto-picker-item:hover{color:rgba(255,255,255,.85)}
/* token-lint-disable-next-line prototype picker chrome, fixed by the prototype skill */
.proto-picker-item:active{transform:scale(.97)}
/* token-lint-disable-next-line prototype picker chrome, fixed by the prototype skill */
.proto-picker-item:focus-visible{outline:2px solid rgba(255,255,255,.4);outline-offset:2px}
/* token-lint-disable-next-line prototype picker chrome, fixed by the prototype skill */
.proto-picker-item[data-active]{color:#fff}
`;

export function ProposalPicker({
  value,
  onChange,
}: {
  value: number;
  onChange: (i: number) => void;
}) {
  const items = React.useRef<(HTMLButtonElement | null)[]>([]);
  const highlight = React.useRef<HTMLSpanElement>(null);
  const [ready, setReady] = React.useState(false);

  React.useLayoutEffect(() => {
    const move = () => {
      const el = items.current[value];
      if (!el || !highlight.current) return;
      highlight.current.style.width = `${el.offsetWidth}px`;
      highlight.current.style.transform = `translateX(${el.offsetLeft}px)`;
    };
    move();
    window.addEventListener("resize", move);
    return () => window.removeEventListener("resize", move);
  }, [value]);

  React.useEffect(() => {
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setReady(true)));
    return () => cancelAnimationFrame(id);
  }, []);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) || t.isContentEditable) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const n = parseInt(e.key, 10);
      if (n >= 1 && n <= PROPOSALS.length) onChange(n - 1);
      else if (e.key === "ArrowRight") onChange((value + 1) % PROPOSALS.length);
      else if (e.key === "ArrowLeft") onChange((value - 1 + PROPOSALS.length) % PROPOSALS.length);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [value, onChange]);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: PICKER_CSS }} />
      <nav
        className="proto-picker"
        aria-label="Prototype variants"
        data-ready={ready ? "" : undefined}
      >
        <span ref={highlight} className="proto-picker-highlight" aria-hidden="true" />
        {PROPOSALS.map((name, i) => (
          <button
            key={name}
            ref={(el) => {
              items.current[i] = el;
            }}
            type="button"
            className="proto-picker-item"
            data-active={i === value ? "" : undefined}
            aria-current={i === value ? "true" : undefined}
            onClick={() => onChange(i)}
          >
            {name}
          </button>
        ))}
      </nav>
    </>
  );
}
