"use client";

import * as React from "react";
import { Button } from "@/components/atoms/Button";
import { ButtonLink } from "@/components/atoms/ButtonLink";
import { PlatformProgressBar } from "@/components/platform/PlatformProgressBar";
import { useLmsStore } from "@/lib/store";
import type { Program, ProgramCertificate } from "@/lib/platform/program";
import { CertificateDocument, certificateLearner } from "./CertificateDocument";
import { CertificateShare } from "@/components/platform/certificate/CertificateShare";
import { CardShell, SectionIntro } from "./parts";
import { ProgramCertificatePath } from "./ProgramCertificatePath";
import { programEnrolment } from "@/lib/platform/certificate-enrolments";

/**
 * DS `LMS / Course Detail / Certificate card` (5425:566), the two states the page draws.
 * Issued: the Certificate document thumbnail (bg/subtle, 1px border/subtle, radius 8), the
 * course title (body-large/Semibold), the issue line (body-medium/Regular, text/subtle) and
 * View (Primary) + Download (Secondary), Button sm, sharing the row with a 6px gap.
 * Not earned: the fixed title and the requirements, each a title (body-medium/Semibold), a
 * detail (body-small/Regular, text/subtle) and a progress bar, 16 apart.
 * This is not organisms/CourseCertificate, which is the full certificate page.
 * The actions are 44px tall on mobile (36px from tablet up, as drawn).
 * Also the Certificate card of the Course Detail sidebar and Progress tab (Status=Not earned;
 * Status=Issued on a passed course, a proposal of 10 Oct 2026).
 * `label` and `detailsHref` serve the Program certificate card (same proposal): its own
 * eyebrow and, on the not-earned shape, a link to the page that says what is missing.
 */
export function CertificateCard({
  certificate,
  labelAs = "p",
  label = "Certificate",
  detailsHref,
  className,
}: {
  certificate: ProgramCertificate;
  /** On the card: the Certificates page stretches it to the row (cards in a row, one height). */
  className?: string;
  /** The eyebrow is a plain line under a course title (Program) and a heading when the card stands alone (Course Detail). */
  labelAs?: "h2" | "h3" | "p";
  label?: string;
  /** Not earned only: where "View details" goes. Without it the card has no action, as drawn. */
  detailsHref?: string;
}) {
  const showToast = useLmsStore((s) => s.showToast);

  if (certificate.status === "not-earned") {
    return (
      <CardShell label={label} labelAs={labelAs} gap="lg" className={className}>
        <p className="sk-text-body-large-semibold text-sko-text-default">{certificate.title}</p>
        <ul className="flex flex-col gap-4">
          {certificate.requirements.map((req) => (
            <li key={req.title} className="flex flex-col gap-0.5">
              <p className="sk-text-body-medium-semibold text-sko-text-default">{req.title}</p>
              <p className="sk-text-body-small-regular text-sko-text-subtle">{req.detail}</p>
              <PlatformProgressBar value={req.percent} label={req.title} />
            </li>
          ))}
        </ul>
        {detailsHref ? (
          <ButtonLink
            href={detailsHref}
            hierarchy="secondary"
            size="sm"
            aria-label={`View details: ${label}`}
            className="w-full max-md:h-11"
          >
            View details
          </ButtonLink>
        ) : null}
      </CardShell>
    );
  }

  return (
    <CardShell label={label} labelAs={labelAs} gap="lg" className={className}>
      <div className="relative aspect-[1123/794] w-full overflow-hidden rounded-card border border-sko-border-subtle bg-sko-bg-subtle [container-type:inline-size]">
        <div className="absolute inset-0">
          <CertificateDocument
            data={certificate.document}
            label={`Certificate of completion: ${certificateLearner(certificate.document)}, ${certificate.title}`}
          />
        </div>
      </div>
      <p className="sk-text-body-large-semibold text-sko-text-default">{certificate.title}</p>
      <p className="sk-text-body-medium-regular text-sko-text-subtle">{certificate.issuedLine}</p>
      {/* mt-auto: in a stretched card the actions sit on the bottom edge, level across the row. */}
      <div className="mt-auto flex items-start gap-1.5">
        {certificate.viewHref ? (
          <ButtonLink
            href={certificate.viewHref}
            hierarchy="primary"
            size="sm"
            aria-label={`View certificate: ${certificate.title}`}
            className="min-w-0 flex-1 max-md:h-11"
          >
            View
          </ButtonLink>
        ) : (
          <Button
            hierarchy="primary"
            size="sm"
            aria-label={`View certificate: ${certificate.title}`}
            onClick={() => showToast("View certificate is not part of this prototype yet")}
            className="min-w-0 flex-1 max-md:h-11"
          >
            View
          </Button>
        )}
        <Button
          hierarchy="secondary"
          size="sm"
          aria-label={`Download certificate: ${certificate.title}`}
          data-invented="certificate: Open edX makes no PDF, only the web certificate"
          onClick={() => showToast("Download certificate is not part of this prototype yet")}
          className="min-w-0 flex-1 max-md:h-11"
        >
          Download
        </Button>
        {/* Share (20 Oct 2026): icon-only, the menu opens above the card's bottom edge. */}
        <CertificateShare target={{ title: certificate.title, document: certificate.document }} look="icon" up />
      </div>
    </CardShell>
  );
}

/**
 * Every course of the program as a certificate card, in program order: its own card when the
 * program data has one (issued or not earned yet), otherwise a not-earned card that says the
 * course has not started (Nelson, 30 Oct 2026: "mostrar os cards de todos os cursos"; until
 * then only the started courses, with a note about the others).
 */
function allCourseCertificates(program: Program): ProgramCertificate[] {
  return program.courses.map((course) => {
    const own = program.certificates.find((c) => c.courseId === `course-${course.number}`);
    if (own) return own;
    return {
      status: "not-earned" as const,
      courseId: `course-${course.number}`,
      courseLabel: `Course ${course.number} · ${course.card.title}`,
      title: "Not started yet",
      requirements: [{ title: "Complete the course content", detail: "Not started", percent: 0 }],
    };
  });
}

/**
 * Certificates tab (Nelson, 30 Oct 2026): the whole content width (no program panel on this
 * tab), the Section intro, then the path to the program certificate (ProgramCertificatePath:
 * every course in order, ending in the program certificate; it replaced the large Program
 * certificate card of 23 Oct), then "Course certificates": one card per course of the program,
 * started or not, three across where the column allows (never under 320; they stack on a
 * phone). Each item is a subgrid of two rows, so the course lines share one height across a
 * row and the cards start level; each card keeps its own height (an issued card with its sheet
 * is much taller than a course not started).
 */
export function CertificatesTab({ program }: { program: Program }) {
  const path = programEnrolment(program.slug);
  const cards = allCourseCertificates(program);
  return (
    <div className="flex flex-col gap-layout-stack">
      <SectionIntro title={program.certificatesIntro.title} lead={program.certificatesIntro.lead} />
      {path ? <ProgramCertificatePath e={path} /> : null}
      <h3 className="sk-text-body-large-semibold text-sko-text-default">Course certificates</h3>
      <ul
        data-mock="Certificate artwork, IDs and requirements are not readable yet"
        className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,max(320px,calc((100%-2*var(--sk-layout-grid-gap))/3))),1fr))] gap-layout-grid"
      >
        {cards.map((certificate) => (
          <li key={certificate.courseId} className="row-span-2 grid grid-rows-subgrid gap-2">
            <h4 className="sk-text-body-medium-semibold self-end text-sko-text-default">{certificate.courseLabel}</h4>
            <CertificateCard certificate={certificate} className="self-start" />
          </li>
        ))}
      </ul>
    </div>
  );
}
