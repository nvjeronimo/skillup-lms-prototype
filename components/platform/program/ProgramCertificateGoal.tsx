"use client";

import { Award, Check, CheckCircle2, Lock } from "lucide-react";
import { Badge } from "@/components/atoms/Badge";
import { ButtonLink } from "@/components/atoms/ButtonLink";
import { CertificateShare } from "@/components/platform/certificate/CertificateShare";
import type { Enrolment } from "@/lib/platform/certificate-enrolments";
import type { EarnedCertificate } from "@/lib/platform/certificates";
import { programPartnersOf } from "@/lib/platform/my-learning";
import type { CertificateDocumentData, Program } from "@/lib/platform/program";
import { Icon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { CertificateDocument, certificateLearner } from "./CertificateDocument";

const MOCK =
  "No API says whether a program certificate is earned: counted here from the course rows";
const issuedOn = (e: EarnedCertificate) => e.certificate.document.issuedOn;

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
 * The Program certificate card, at the top of the program's Certificates tab (Nelson, 30 Oct
 * 2026: the sheet and what it gives, from the 23 Oct card, "no card do program certificate").
 * It stands alone: the path of steps that led to it was removed the same day, since a learner
 * can take a program's courses in any order. A segmented bar (one segment per course, green once
 * complete) and "N of M courses complete" sit under the state line (31 Oct), earned or not: all
 * green once issued. The sheet on the left (320;
 * on top below 640 of the card's own width): the real certificate once earned, else a muted
 * preview with a lock and "Complete all N courses". On the right: "Program certificate" with
 * Earned, the state line, View + Share once earned, and what the certificate gives. Earned or
 * not, it is a plain card like the course cards below it, bg/page and border/subtle (Nelson,
 * 30 Oct 2026: no green fill; the Earned badge says it).
 */
export function ProgramCertificateGoal({ e, program }: { e: Enrolment; program: Program }) {
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
          "border border-sko-border-subtle bg-sko-bg-page",
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
                  issued
                    ? "bg-sko-bg-success text-sko-text-on-primary"
                    : "bg-sko-bg-subtle text-sko-icon-muted",
                )}
              >
                <Icon icon={Award} size={16} />
              </span>
              <p className="sk-text-title-medium-semibold text-sko-text-default">
                Program certificate
              </p>
              {/* Earned: green with the icon and the word, never colour alone (13 Oct 2026). */}
              {issued ? (
                <Badge variant="soft" color="success" leftIcon={CheckCircle2}>
                  Earned
                </Badge>
              ) : null}
            </div>
            <p className="sk-text-body-medium-regular text-sko-text-subtle">
              {issued
                ? `Issued ${issuedOn(issued)}.`
                : `Yours when all ${total} courses are complete.`}
            </p>
          </div>
          {/* One segment per course, in program order, filled as each is completed: how far along,
              not a path (any order works). Back on the card at Nelson's ask, 31 Oct 2026; kept
              once earned, all green (same day). */}
          <div className="flex flex-col gap-2">
            <ol aria-label="Courses towards the certificate" className="flex gap-1">
              {e.courses.map((c) => (
                <li
                  key={c.slug}
                  className={cn(
                    "h-2 min-w-0 flex-1",
                    // A finished course is a progress at 100%: green (Nelson, 27 Oct 2026).
                    c.state === "earned"
                      ? "bg-sko-bg-success"
                      : c.state === "in-progress"
                        ? "bg-sko-bg-info-soft"
                        : "bg-sko-bg-track",
                  )}
                >
                  <span className="sr-only">
                    {c.number ? `Course ${c.number}, ` : ""}
                    {c.title}:{" "}
                    {c.state === "earned"
                      ? "complete"
                      : c.state === "in-progress"
                        ? `${c.percent}% complete`
                        : "not started"}
                  </span>
                </li>
              ))}
            </ol>
            <p className="sk-text-body-small-medium text-sko-text-muted">
              {e.complete} of {total} courses complete
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
              <CertificateShare
                target={{ title: program.title, document: issued.certificate.document }}
                look="icon"
              />
            </div>
          ) : null}
          <ul className="sk-text-body-small-regular mt-auto flex flex-col gap-1 text-sko-text-subtle">
            <li className="inline-flex items-center gap-1.5">
              <Icon icon={Award} size={16} className="text-sko-icon-subtle" aria-hidden />
              {partners.length
                ? `Issued with ${partners.join(" and ")}`
                : "Issued by SkillUp Online"}
            </li>
            <li className="inline-flex items-center gap-1.5">
              <Icon icon={Check} size={16} className="text-sko-icon-subtle" aria-hidden />A
              certificate ID anyone can verify
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
