"use client";

import Link from "next/link";
import { Award, Check } from "lucide-react";
import { ButtonLink } from "@/components/atoms/ButtonLink";
import { CertificateShare } from "@/components/platform/certificate/CertificateShare";
import type { CourseLine, Enrolment } from "@/lib/platform/certificate-enrolments";
import type { EarnedCertificate } from "@/lib/platform/certificates";
import { Icon } from "@/lib/icons";
import { cn } from "@/lib/utils";

const MOCK = "No API says whether a program certificate is earned: counted here from the course rows";
const issuedOn = (e: EarnedCertificate) => e.certificate.document.issuedOn;

/** A course's place on the path: a check when its certificate is issued, else its number. */
function StateDot({ state, number }: { state: CourseLine["state"]; number?: number }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "sk-text-body-small-semibold relative flex size-7 shrink-0 items-center justify-center rounded-pill bg-sko-bg-page",
        state === "earned" && "bg-sko-bg-success text-sko-text-on-primary",
        state === "in-progress" && "border-2 border-sko-border-info text-sko-text-default",
        state === "not-started" && "border border-sko-border-default text-sko-text-subtle",
      )}
    >
      {state === "earned" ? <Icon icon={Check} size={16} /> : number ?? ""}
    </span>
  );
}

function PathStep({ c, last }: { c: CourseLine; last: boolean }) {
  return (
    <li className="relative flex gap-3 pb-5 lg:flex-1 lg:flex-col lg:gap-2 lg:pb-0 lg:pr-3">
      {/* The rail to the next step: down below lg, across from lg up; green once the course is earned. */}
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
        <Link href={c.href} className="sk-text-body-medium-semibold text-sko-text-default hover:underline lg:line-clamp-2">
          {c.title}
        </Link>
        {c.earned ? (
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="sk-text-body-small-regular text-sko-text-subtle">{issuedOn(c.earned)}</span>
            <ButtonLink href={c.earned.viewHref} hierarchy="link" size="sm" aria-label={`View certificate: ${c.title}`}>
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

/** The end of the path: the program certificate, earned (green, View + Share) or still ahead. */
function PathGoal({ e }: { e: Enrolment }) {
  return (
    <div
      data-mock={MOCK}
      className={cn(
        "flex gap-3 rounded-card p-3 lg:w-[220px] lg:shrink-0 lg:flex-col lg:gap-2",
        e.issued ? "bg-sko-bg-success-soft" : "border border-dashed border-sko-border-default",
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "flex size-7 shrink-0 items-center justify-center rounded-pill",
          e.issued ? "bg-sko-bg-success text-sko-text-on-primary" : "bg-sko-bg-subtle text-sko-icon-muted",
        )}
      >
        <Icon icon={Award} size={16} />
      </span>
      <div className="flex min-w-0 flex-col gap-1">
        <p className="sk-text-body-medium-semibold text-sko-text-default">Program certificate</p>
        {e.issued ? (
          <>
            <span className="sk-text-body-small-regular text-sko-text-subtle">Earned {issuedOn(e.issued)}</span>
            <div className="flex items-center gap-1.5 pt-1">
              <ButtonLink
                href={e.issued.viewHref}
                hierarchy="primary"
                size="sm"
                aria-label={`View certificate: ${e.title}`}
                className="max-md:h-11"
              >
                View
              </ButtonLink>
              <CertificateShare
                target={{ title: e.issued.certificate.title, document: e.issued.certificate.document }}
                look="icon"
                up
              />
            </div>
          </>
        ) : (
          <span className="sk-text-body-small-regular text-sko-text-subtle">
            Yours when all {e.courses.length} courses are complete
          </span>
        )}
      </div>
    </div>
  );
}

/**
 * The path to the program certificate (Nelson, 30 Oct 2026, from the Path proposal of PR 437),
 * at the top of the program's Certificates tab: one step per course in program order (a check
 * and the issue date with View when its certificate is issued, its number and "N% complete" or
 * "Not started" otherwise), joined by a rail that turns green behind each earned course, ending
 * in the program certificate. Across from lg up (the goal 220 on the right); a vertical list
 * below lg, the goal under the last course.
 */
export function ProgramCertificatePath({ e }: { e: Enrolment }) {
  return (
    <section
      aria-labelledby="program-path-title"
      className="flex flex-col gap-5 rounded-card border border-sko-border-subtle bg-sko-bg-page p-4 md:p-5 lg:p-6"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h3 id="program-path-title" className="sk-text-title-medium-semibold text-sko-text-default">
          Your path to the program certificate
        </h3>
        <p className="sk-text-body-medium-regular text-sko-text-subtle">
          {e.complete} of {e.courses.length} courses complete
        </p>
      </div>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:gap-4">
        <ol aria-label={`Courses of ${e.title}`} className="flex flex-col lg:flex-1 lg:flex-row">
          {e.courses.map((c, i) => (
            <PathStep key={c.slug} c={c} last={i === e.courses.length - 1} />
          ))}
        </ol>
        <PathGoal e={e} />
      </div>
    </section>
  );
}
