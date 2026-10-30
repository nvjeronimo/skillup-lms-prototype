"use client";

import * as React from "react";
import { Button } from "@/components/atoms/Button";
import { ButtonLink } from "@/components/atoms/ButtonLink";
import { PlatformProgressBar } from "@/components/platform/PlatformProgressBar";
import { Check, Lock } from "lucide-react";
import { useLmsStore } from "@/lib/store";
import { Icon } from "@/lib/icons";
import type { CertificateDocumentData, Program, ProgramCertificate } from "@/lib/platform/program";
import { CertificateDocument, certificateLearner } from "./CertificateDocument";
import { CertificateShare } from "@/components/platform/certificate/CertificateShare";
import { PlatformSectionHeader } from "@/components/platform/PlatformSectionHeader";
import { CardShell, SectionIntro } from "./parts";
import { ProgramCertificateGoal } from "./ProgramCertificateGoal";
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
  progress = true,
  preview,
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
  /**
   * Not earned only: false drops the requirements' detail and bar, for the program's
   * Certificates tab, which says what each course gives, not how far along it is (Nelson,
   * 30 Oct 2026: the progress is already in several places).
   */
  progress?: boolean;
  /**
   * Not earned only: the sheet this course will issue, drawn muted with a lock above the text,
   * as the Program certificate card does (Nelson, 30 Oct 2026).
   */
  preview?: CertificateDocumentData;
}) {
  const showToast = useLmsStore((s) => s.showToast);

  if (certificate.status === "not-earned") {
    return (
      <CardShell label={label} labelAs={labelAs} gap="lg" className={className}>
        {progress ? (
          <>
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
          </>
        ) : (
          <div className="flex flex-col gap-2">
            {preview ? (
              <div className="relative mb-2 aspect-[1123/794] w-full overflow-hidden rounded-card border border-sko-border-subtle bg-sko-bg-subtle [container-type:inline-size]">
                <div className="absolute inset-0 opacity-50 grayscale">
                  <CertificateDocument
                    data={preview}
                    label={`Preview of the course certificate: ${preview.courseTitle}`}
                  />
                </div>
                <div className="absolute inset-0 flex items-center justify-center p-4">
                  <span className="sk-text-body-small-semibold inline-flex items-center gap-1.5 whitespace-nowrap rounded-pill border border-sko-border-subtle bg-sko-bg-page px-3 py-1.5 text-sko-text-default shadow-sm">
                    <Icon icon={Lock} size={14} aria-hidden />
                    Pass the course
                  </span>
                </div>
              </div>
            ) : null}
            <p className="sk-text-body-large-semibold text-sko-text-default">Not earned yet</p>
            <p className="sk-text-body-medium-regular text-sko-text-subtle">Issued when you:</p>
            <ul className="sk-text-body-medium-regular flex flex-col gap-1 text-sko-text-default">
              {certificate.requirements.map((req) => (
                <li key={req.title} className="inline-flex items-center gap-1.5">
                  <Icon
                    icon={Check}
                    size={16}
                    className="shrink-0 text-sko-icon-subtle"
                    aria-hidden
                  />
                  {req.title}
                </li>
              ))}
            </ul>
          </div>
        )}
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
        <CertificateShare
          target={{ title: certificate.title, document: certificate.document }}
          look="icon"
          up
        />
      </div>
    </CardShell>
  );
}

/**
 * Every course of the program as a certificate card, in program order: its own card when the
 * program data has one (issued or not earned yet), otherwise a not-earned card (Nelson, 30 Oct 2026: "mostrar os cards de todos os cursos"; until
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
      title: "Not earned yet",
      requirements: [
        { title: "Reach the passing grade", detail: "Not started", percent: 0 },
        { title: "Complete the course content", detail: "Not started", percent: 0 },
      ],
    };
  });
}

/**
 * Certificates tab (Nelson, 30 Oct 2026): the whole content width (no program panel on this
 * tab), the Section intro, the Program certificate card (ProgramCertificateGoal: the sheet, or
 * its locked preview, and what it gives), then "Course certificates": one card per course of
 * the program, started or not, three across where the column allows (never under 320; they
 * stack on a phone). No progress here: a not-earned card says only what earns it, and there
 * is no path of steps, since a learner may take a program's courses in any order (Nelson,
 * 30 Oct 2026). Each item is a subgrid of two rows, so the course lines share one height
 * across a row and the cards start level; each card keeps its own height.
 * The course titles carry no "Course n ·" either, for the same reason.
 */
/** The course's title without "Course n · ": the number reads as an order the program may not have. */
const withoutNumber = (label: string) => label.replace(/^Course \d+\s*·\s*/, "");

/**
 * The sheet a course of the program will issue, before it is issued: its title and modules on
 * the real certificate layout, "On completion" where the date and ID go. Partners and
 * signatories come from a certificate the program has issued, else none.
 */
function coursePreview(program: Program, courseLabel: string): CertificateDocumentData {
  const issued = program.certificates.find((c) => c.status === "issued");
  const base = issued?.status === "issued" ? issued.document : undefined;
  const title = withoutNumber(courseLabel);
  const course = program.courses.find((c) => c.card.title === title);
  // "4 modules", or "Module 2 of 4" for the course in progress.
  const m = course ? /(\d+) modules|of (\d+)/.exec(course.position) : null;
  const modules = m ? Number(m[1] ?? m[2]) : undefined;
  return {
    courseTitle: title,
    summary: modules ? `${modules} modules` : program.title,
    issuedOn: "On completion",
    certificateId: "Issued on completion",
    verifyUrl: "skillup.online/certificates",
    partnerLogoSrc: base?.partnerLogoSrc,
    partnerName: base?.partnerName,
    morePartners: base?.morePartners,
    signatories: base?.signatories ?? [],
  };
}

export function CertificatesTab({ program }: { program: Program }) {
  const enrolment = programEnrolment(program.slug);
  const cards = allCourseCertificates(program);
  return (
    <div className="flex flex-col gap-layout-section">
      <div className="flex flex-col gap-layout-stack">
        <SectionIntro
          title={program.certificatesIntro.title}
          lead={program.certificatesIntro.lead}
        />
        {enrolment ? <ProgramCertificateGoal e={enrolment} program={program} /> : null}
      </div>
      {/* The course certificates as a section of their own, under the Dashboard's Section header
          (title + emphasis), a section's gap below the program certificate (Nelson, 30 Oct 2026:
          the plain h3 looked lost under the card). */}
      <section
        aria-labelledby="program-course-certificates"
        className="flex flex-col gap-layout-stack"
      >
        <PlatformSectionHeader
          id="program-course-certificates"
          as="h3"
          title="Course certificates"
          emphasis="one per course"
        />
        <ul
          data-mock="Certificate artwork, IDs and requirements are not readable yet"
          className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,max(320px,calc((100%-2*var(--sk-layout-grid-gap))/3))),1fr))] gap-layout-grid"
        >
          {cards.map((certificate) => (
            <li key={certificate.courseId} className="row-span-2 grid grid-rows-subgrid gap-2">
              <h4 className="sk-text-body-medium-semibold self-end text-sko-text-default">
                {withoutNumber(certificate.courseLabel)}
              </h4>
              <CertificateCard
                certificate={certificate}
                progress={false}
                preview={
                  certificate.status === "not-earned"
                    ? coursePreview(program, certificate.courseLabel)
                    : undefined
                }
                className="self-start"
              />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
