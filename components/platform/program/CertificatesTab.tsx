"use client";

import * as React from "react";
import { Button } from "@/components/atoms/Button";
import { PlatformProgressBar } from "@/components/platform/PlatformProgressBar";
import { useLmsStore } from "@/lib/store";
import type { Program, ProgramCertificate } from "@/lib/platform/program";
import { CertificateDocument } from "./CertificateDocument";
import { CardShell, SectionIntro } from "./parts";

/**
 * DS `LMS / Course Detail / Certificate card` (5425:566), the two states the page draws.
 * Issued: the Certificate document thumbnail (bg/subtle, 1px border/subtle, radius 8), the
 * course title (body-large/Semibold), the issue line (body-medium/Regular, text/subtle) and
 * View (Primary) + Download (Secondary), Button V2 sm, sharing the row with a 6px gap.
 * Not earned: the fixed title and the requirements, each a title (body-medium/Semibold), a
 * detail (body-small/Regular, text/subtle) and a progress bar, 16 apart.
 * This is not organisms/CourseCertificate, which is the full certificate page.
 * The actions are 44px tall on mobile (36px from tablet up, as drawn).
 */
function CertificateCard({ certificate }: { certificate: ProgramCertificate }) {
  const showToast = useLmsStore((s) => s.showToast);

  if (certificate.status === "not-earned") {
    return (
      <CardShell label="Certificate" labelAs="p" gap="lg">
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
      </CardShell>
    );
  }

  return (
    <CardShell label="Certificate" labelAs="p" gap="lg">
      <div className="relative aspect-[1123/794] w-full overflow-hidden rounded-lg border border-sko-border-subtle bg-sko-bg-subtle [container-type:inline-size]">
        <div className="absolute inset-0">
          <CertificateDocument
            data={certificate.document}
            label={`Certificate of completion: ${certificate.document.learner}, ${certificate.title}`}
          />
        </div>
      </div>
      <p className="sk-text-body-large-semibold text-sko-text-default">{certificate.title}</p>
      <p className="sk-text-body-medium-regular text-sko-text-subtle">{certificate.issuedLine}</p>
      <div className="flex items-start gap-1.5">
        <Button
          hierarchy="primary"
          size="sm"
          aria-label={`View certificate: ${certificate.title}`}
          onClick={() => showToast("View certificate is not part of this prototype yet")}
          className="min-w-0 flex-1 max-md:h-11"
        >
          View
        </Button>
        <Button
          hierarchy="secondary"
          size="sm"
          aria-label={`Download certificate: ${certificate.title}`}
          onClick={() => showToast("Download certificate is not part of this prototype yet")}
          className="min-w-0 flex-1 max-md:h-11"
        >
          Download
        </Button>
      </div>
    </CardShell>
  );
}

/**
 * Certificates tab: the Section intro, one 320px column per course the learner has started
 * (the course line, body-medium/Semibold, over its Certificate card) and the note about the
 * courses not started yet. Desktop: the columns side by side, 24 apart. Tablet: one under
 * the other at 320, 20 apart. Mobile: at full width, 16 apart.
 */
export function CertificatesTab({ program }: { program: Program }) {
  return (
    <div className="flex flex-col gap-4 md:gap-5 lg:gap-6">
      <SectionIntro title={program.certificatesIntro.title} lead={program.certificatesIntro.lead} />
      <ul
        data-mock="Certificate artwork, IDs and requirements are not readable yet"
        className="flex flex-wrap items-start gap-4 md:gap-5 lg:gap-6"
      >
        {program.certificates.map((certificate) => (
          <li key={certificate.courseId} className="flex w-full flex-col gap-2 md:w-[320px]">
            <h3 className="sk-text-body-medium-semibold text-sko-text-default">{certificate.courseLabel}</h3>
            <CertificateCard certificate={certificate} />
          </li>
        ))}
      </ul>
      <p className="sk-text-body-medium-regular text-sko-text-subtle">{program.certificatesNote}</p>
    </div>
  );
}
