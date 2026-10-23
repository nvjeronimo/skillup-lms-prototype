"use client";

import * as React from "react";
import { Button } from "@/components/atoms/Button";
import { ButtonLink } from "@/components/atoms/ButtonLink";
import { PlatformProgressBar } from "@/components/platform/PlatformProgressBar";
import { getProgramCertificate } from "@/lib/platform/catalog";
import { programCertificatePageHref } from "@/lib/platform/hrefs";
import { useLmsStore } from "@/lib/store";
import type { Program, ProgramCertificate } from "@/lib/platform/program";
import { CertificateDocument, certificateLearner } from "./CertificateDocument";
import { CertificateShare } from "@/components/platform/certificate/CertificateShare";
import { CardShell, SectionIntro } from "./parts";
import { ProgramCertificateHero } from "./ProgramCertificateHero";

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
 * Certificates tab: the Section intro, one 320px column per course the learner has started
 * (the course line, body-medium/Semibold, over its Certificate card) and the note about the
 * courses not started yet. Desktop: the columns side by side, 24 apart. Tablet: one under
 * the other at 320, 20 apart. Mobile: at full width, 16 apart.
 *
 * Above the course cards, the Program certificate first and large (ProgramCertificateHero;
 * Nelson, 23 Oct 2026: it is the goal of the program, so it leads the tab), closed by a 1px
 * rule, then a "Course certificates" heading for the course cards. Until 23 Oct it was a
 * 320 card under a "Proposal: not designed yet" note (10 Oct 2026).
 */
export function CertificatesTab({ program }: { program: Program }) {
  const programCertificate = getProgramCertificate(program.slug);
  return (
    <div className="flex flex-col gap-4 md:gap-5 lg:gap-6">
      <SectionIntro title={program.certificatesIntro.title} lead={program.certificatesIntro.lead} />
      {programCertificate ? (
        <>
          <section
            aria-labelledby="program-certificate-title"
            className="flex flex-col gap-3 border-b border-sko-border-subtle pb-4 md:pb-5 lg:pb-6"
          >
            <h3 id="program-certificate-title" className="sr-only">
              Program certificate
            </h3>
            <ProgramCertificateHero state={programCertificate} />
          </section>
          <h3 className="sk-text-body-large-semibold text-sko-text-default">Course certificates</h3>
        </>
      ) : null}
      {/* No course started yet: no list, the note alone (an empty list would still take a gap). */}
      {program.certificates.length > 0 ? (
        <ul
          data-mock="Certificate artwork, IDs and requirements are not readable yet"
          className="flex flex-wrap items-start gap-4 md:gap-5 lg:gap-6"
        >
          {program.certificates.map((certificate) => (
            <li key={certificate.courseId} className="flex w-full flex-col gap-2 md:w-[320px]">
              <h4 className="sk-text-body-medium-semibold text-sko-text-default">{certificate.courseLabel}</h4>
              <CertificateCard certificate={certificate} />
            </li>
          ))}
        </ul>
      ) : null}
      <p className="sk-text-body-medium-regular text-sko-text-subtle">{program.certificatesNote}</p>
    </div>
  );
}
