"use client";

import Link from "next/link";
import { Award, Check, CheckCircle2, Lock } from "lucide-react";
import { Badge } from "@/components/atoms/Badge";
import { ButtonLink } from "@/components/atoms/ButtonLink";
import { CertificateShare } from "@/components/platform/certificate/CertificateShare";
import type { CourseLine, Enrolment } from "@/lib/platform/certificate-enrolments";
import type { EarnedCertificate } from "@/lib/platform/certificates";
import { programPartnersOf } from "@/lib/platform/my-learning";
import type { CertificateDocumentData, Program } from "@/lib/platform/program";
import { Icon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { CertificateDocument, certificateLearner } from "./CertificateDocument";

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

/**
 * The sheet the learner is working towards, before it is issued: the program's title and
 * partners on the real certificate layout, with "On completion" where the date and ID go. The
 * partners and signatories are those of the program's course certificates.
 */
function previewDocument(program: Program): CertificateDocumentData {
  const issued = program.certificates.find((c) => c.status === "issued");
  const base = issued?.status === "issued" ? issued.document : undefined;
  return {
    kind: "program",
    courseTitle: program.title,
    summary: `${program.stats.courses}  ·  ${program.stats.duration}`,
    issuedOn: "On completion",
    certificateId: "Issued on completion",
    verifyUrl: "skillup.online/certificates",
    partnerLogoSrc: base?.partnerLogoSrc,
    partnerName: base?.partnerName,
    morePartners: base?.morePartners,
    signatories: base?.signatories ?? [],
  };
}

/**
 * The end of the path: the Program certificate card (Nelson, 30 Oct 2026: the sheet and what it
 * gives, from the 23 Oct card, "no card do program certificate"). The sheet on the left (320;
 * on top below 640 of the card's own width): the real certificate once earned, else a muted
 * preview with a lock and "Complete all N courses". On the right: "Program certificate" with
 * Earned, the state line, View + Share once earned, and what the certificate gives. Earned it
 * sits on bg/success-soft; not yet, inside a dashed border/default.
 */
function ProgramCertificateGoal({ e, program }: { e: Enrolment; program: Program }) {
  const issued = e.issued;
  const total = e.courses.length;
  const doc = issued ? issued.certificate.document : previewDocument(program);
  // The program's partners (its header logos) until issued, then those on the sheet.
  const programPartners = programPartnersOf(program.slug).filter((p) => p !== "SkillUp");
  const partners = (
    !issued && programPartners.length
      ? programPartners
      : [doc.partnerName, ...(doc.morePartners ?? []).map((p) => p.name)].filter(Boolean)
  ) as string[];
  return (
    <div className="[container-type:inline-size]">
      <div
        data-mock={MOCK}
        className={cn(
          "grid gap-4 rounded-card p-4 md:p-5 [@container_(min-width:640px)]:grid-cols-[320px_minmax(0,1fr)] [@container_(min-width:640px)]:gap-6",
          issued ? "bg-sko-bg-success-soft" : "border border-dashed border-sko-border-default",
        )}
      >
        <div className="relative aspect-[1123/794] w-full max-w-[480px] self-start overflow-hidden rounded-card-inset border border-sko-border-subtle bg-sko-bg-subtle [container-type:inline-size]">
          <div className={cn("absolute inset-0", !issued && "opacity-50 grayscale")}>
            <CertificateDocument
              data={doc}
              label={
                issued
                  ? `Certificate of completion: ${certificateLearner(doc)}, ${program.title}`
                  : `Preview of the program certificate: ${program.title}`
              }
            />
          </div>
          {!issued ? (
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <span className="sk-text-body-small-semibold inline-flex items-center gap-1.5 whitespace-nowrap rounded-pill border border-sko-border-subtle bg-sko-bg-page px-3 py-1.5 text-sko-text-default shadow-sm">
                <Icon icon={Lock} size={14} aria-hidden />
                Complete all {total} courses
              </span>
            </div>
          ) : null}
        </div>

        <div className="flex min-w-0 flex-col gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex flex-wrap items-center gap-2">
              <span
                aria-hidden="true"
                className={cn(
                  "flex size-7 shrink-0 items-center justify-center rounded-pill",
                  issued ? "bg-sko-bg-success text-sko-text-on-primary" : "bg-sko-bg-subtle text-sko-icon-muted",
                )}
              >
                <Icon icon={Award} size={16} />
              </span>
              <p className="sk-text-title-medium-semibold text-sko-text-default">Program certificate</p>
              {/* Earned: green with the icon and the word, never colour alone (13 Oct 2026). */}
              {issued ? (
                <Badge variant="soft" color="success" leftIcon={CheckCircle2}>
                  Earned
                </Badge>
              ) : null}
            </div>
            <p className="sk-text-body-medium-regular text-sko-text-subtle">
              {issued ? `Issued ${issuedOn(issued)}.` : `Yours when all ${total} courses are complete.`}
            </p>
          </div>
          {issued ? (
            <div className="flex flex-wrap items-center gap-2">
              <ButtonLink
                href={issued.viewHref}
                hierarchy="primary"
                size="md"
                aria-label={`View certificate: ${program.title}`}
                className="max-md:h-11 max-md:flex-1"
              >
                View certificate
              </ButtonLink>
              <CertificateShare target={{ title: program.title, document: issued.certificate.document }} look="icon" />
            </div>
          ) : null}
          <ul className="sk-text-body-small-regular mt-auto flex flex-col gap-1 text-sko-text-subtle">
            <li className="inline-flex items-center gap-1.5">
              <Icon icon={Award} size={16} className="text-sko-icon-subtle" aria-hidden />
              {partners.length ? `Issued with ${partners.join(" and ")}` : "Issued by SkillUp Online"}
            </li>
            <li className="inline-flex items-center gap-1.5">
              <Icon icon={Check} size={16} className="text-sko-icon-subtle" aria-hidden />A certificate ID anyone can verify
            </li>
            <li className="inline-flex items-center gap-1.5">
              <Icon icon={Check} size={16} className="text-sko-icon-subtle" aria-hidden />
              Ready to share on LinkedIn
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

/**
 * The path to the program certificate (Nelson, 30 Oct 2026, from the Path proposal of PR 437),
 * at the top of the program's Certificates tab: one step per course in program order (a check
 * and the issue date with View when its certificate is issued, its number and "N% complete" or
 * "Not started" otherwise), joined by a rail that turns green behind each earned course, across
 * from lg up and a vertical list below. Under the steps, the Program certificate card
 * (ProgramCertificateGoal) at the card's full width.
 */
export function ProgramCertificatePath({ e, program }: { e: Enrolment; program: Program }) {
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
      <ol aria-label={`Courses of ${e.title}`} className="flex flex-col lg:flex-row">
        {e.courses.map((c, i) => (
          <PathStep key={c.slug} c={c} last={i === e.courses.length - 1} />
        ))}
      </ol>
      <ProgramCertificateGoal e={e} program={program} />
    </section>
  );
}
