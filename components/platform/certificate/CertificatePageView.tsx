"use client";

import Link from "next/link";
import { ChevronRight, Download } from "lucide-react";
import { Icon } from "@/lib/icons";
import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import { ButtonLink } from "@/components/atoms/ButtonLink";
import { PlatformProgressBar } from "@/components/platform/PlatformProgressBar";
import { CertificateDocument, certificateLearner } from "@/components/platform/program/CertificateDocument";
import { CertificateShare } from "@/components/platform/certificate/CertificateShare";
import type { ProgramCertificateCourse } from "@/lib/platform/catalog";
import { coursePageHref, programPageHref } from "@/lib/platform/hrefs";
import type { ProgramCertificate } from "@/lib/platform/program";
import { MY_LEARNING_HREF, MY_LEARNING_PROGRAMS_HREF } from "@/lib/platform/routes";
import { useLmsStore } from "@/lib/store";

const CRUMB = "sk-text-body-medium-semibold relative inline-flex items-center after:absolute after:inset-x-0 after:-inset-y-3 after:content-['']";


/** The state of one course on the program certificate page, in the words of the course cards. */
function courseStatus(percent: number | null): { label: string; color: "success" | "gray" } {
  if (percent === null) return { label: "Not started", color: "gray" };
  if (percent >= 100) return { label: "Complete", color: "success" };
  return { label: `In progress · ${percent}%`, color: "gray" };
}

/**
 * A certificate on its own page: where *View* on a Certificate card leads.
 *
 * Drawn in Figma on 19 Oct 2026 with the Certificates page (in review), from what exists: the
 * platform shell, the breadcrumb of the course and program pages, the certificate document of
 * the Certificate card, DS buttons. Until then it was a proposal with a "not designed yet" note.
 *
 * Two kinds since 10 Oct 2026, both proposals:
 * - `course`: the certificate of a course (issued), as before;
 * - `program`: the certificate of a program. Issued, it is the same page. Not earned (the
 *   other two sample programs), there is no sheet to show: the page says what is missing instead,
 *   the requirement with its bar (courses complete of total) and the list of the program's
 *   courses, each with its state and a link to its page.
 * The trail goes through Programs for anything of a program, like the course page.
 */
export function CertificatePageView({
  kind,
  certificate,
  program,
  courseSlug,
  courses = [],
  complete = 0,
}: {
  kind: "course" | "program";
  certificate: ProgramCertificate;
  /** The program the certificate, or its course, belongs to. */
  program?: { slug: string; title: string };
  /** `course` only: the course the certificate is for. */
  courseSlug?: string;
  /** `program` only: its courses and how many are complete. */
  courses?: ProgramCertificateCourse[];
  complete?: number;
}) {
  const showToast = useLmsStore((s) => s.showToast);
  const heading = kind === "program" && program ? program.title : certificate.title;
  const back =
    kind === "course" && courseSlug
      ? { label: "Go to the course", href: coursePageHref(courseSlug) }
      : program
        ? { label: "Go to the program", href: programPageHref(program.slug) }
        : { label: "Go to My Learning", href: MY_LEARNING_HREF };

  return (
    <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-8 px-layout-band-x pb-8 pt-6 md:pb-12 lg:pb-20 lg:pt-6">
      <nav data-arrive={0} aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1 md:gap-x-2">
          <li className="flex items-center gap-1.5 md:gap-2">
            <Link href={MY_LEARNING_HREF} className={`${CRUMB} text-sko-text-subtle transition-colors hover:text-sko-text-default`}>
              My Learning
            </Link>
            <Icon icon={ChevronRight} size={16} aria-hidden className="text-sko-icon-muted" />
          </li>
          {program ? (
            <>
              <li className="flex items-center gap-1.5 md:gap-2">
                <Link href={MY_LEARNING_PROGRAMS_HREF} className={`${CRUMB} text-sko-text-subtle transition-colors hover:text-sko-text-default`}>
                  Programs
                </Link>
                <Icon icon={ChevronRight} size={16} aria-hidden className="text-sko-icon-muted" />
              </li>
              <li className="flex min-w-0 items-center gap-1.5 md:gap-2">
                <Link
                  href={`${programPageHref(program.slug)}?tab=certificates`}
                  className={`${CRUMB} min-w-0 text-sko-text-subtle transition-colors hover:text-sko-text-default`}
                >
                  {program.title}
                </Link>
                <Icon icon={ChevronRight} size={16} aria-hidden className="text-sko-icon-muted" />
              </li>
            </>
          ) : null}
          <li className="flex items-center">
            <span aria-current="page" className={`${CRUMB} text-sko-text-primary`}>
              {kind === "program" ? "Program certificate" : "Certificate"}
            </span>
          </li>
        </ol>
      </nav>

      <div data-arrive={1} className="flex flex-col gap-1">
        <h1 className="sk-text-headline-small-semibold text-sko-text-default">{heading}</h1>
        <p className="sk-text-body-medium-regular text-sko-text-subtle">
          {certificate.status === "issued" ? certificate.issuedLine : `Program certificate · ${certificate.title}`}
        </p>
      </div>

      {certificate.status === "issued" ? (
        <div className="flex flex-col gap-layout-column lg:flex-row lg:items-start">
          <div
            data-arrive={2}
            data-mock="Certificate artwork, ID and verification address are sample data"
            className="relative aspect-[1123/794] w-full min-w-0 overflow-hidden rounded-card border border-sko-border-subtle bg-sko-bg-subtle shadow-sk-card [container-type:inline-size] lg:flex-1"
          >
            <div className="absolute inset-0">
              <CertificateDocument
                data={certificate.document}
                label={`Certificate of completion: ${certificateLearner(certificate.document)}, ${certificate.title}`}
              />
            </div>
          </div>

          <div data-arrive={3} className="flex flex-col gap-3 lg:w-[320px] lg:shrink-0">
            <Button
              hierarchy="primary"
              size="lg"
              leftIcon={Download}
              data-invented="certificate: Open edX makes no PDF, only the web certificate"
              onClick={() => showToast("Download certificate is not part of this prototype yet")}
            >
              Download certificate
            </Button>
            <CertificateShare target={{ title: certificate.title, document: certificate.document }} size="lg" />
            <ButtonLink href={back.href} hierarchy="secondary" size="lg">
              {back.label}
            </ButtonLink>
            {/* The sheet is one image whose small print scales below 12 px: everything a learner
                reads on it that is not in its label (learner, course) is listed here as text,
                signatories included. */}
            <dl className="mt-2 flex flex-col gap-3">
              <div className="flex flex-col gap-0.5">
                <dt className="sk-text-body-small-regular text-sko-text-subtle">Issued</dt>
                <dd className="sk-text-body-medium-semibold text-sko-text-default">{certificate.document.issuedOn}</dd>
              </div>
              <div data-invented="certificate: Open edX identifies it by its verify UUID, no readable ID" className="flex flex-col gap-0.5">
                <dt className="sk-text-body-small-regular text-sko-text-subtle">Certificate ID</dt>
                <dd className="sk-text-body-medium-semibold text-sko-text-default">{certificate.document.certificateId}</dd>
              </div>
              {certificate.document.signatories.length ? (
                // Who signed it: on the sheet this is small print (audit 16 Oct 2026).
                <div className="flex flex-col gap-0.5">
                  <dt className="sk-text-body-small-regular text-sko-text-subtle">Signed by</dt>
                  {certificate.document.signatories.map((s) => (
                    <dd key={s.name} className="sk-text-body-medium-semibold text-sko-text-default">
                      {s.name}
                      <span className="sk-text-body-small-regular block text-sko-text-muted">{s.role}</span>
                    </dd>
                  ))}
                </div>
              ) : null}
              <div className="flex flex-col gap-0.5">
                <dt className="sk-text-body-small-regular text-sko-text-subtle">Verify at</dt>
                <dd className="sk-text-body-medium-semibold break-all text-sko-text-default">{certificate.document.verifyUrl}</dd>
              </div>
            </dl>
          </div>
        </div>
      ) : (
        /* Not earned: no sheet and nothing to download. What is missing, then the way back. */
        <div className="flex flex-col gap-layout-column lg:flex-row lg:items-start">
          <section
            data-arrive={2}
            aria-labelledby="certificate-missing-title"
            data-mock="No API says whether a program certificate is earned: counted here from the course rows"
            className="flex min-w-0 flex-col gap-4 rounded-card border border-sko-border-subtle bg-sko-bg-page p-[15px] md:p-[19px] lg:flex-1 lg:p-[23px]"
          >
            <h2 id="certificate-missing-title" className="sk-text-headline-small-bold text-sko-text-default">
              What is missing
            </h2>
            <ul className="flex flex-col gap-4">
              {certificate.requirements.map((req) => (
                <li key={req.title} className="flex flex-col gap-0.5">
                  <p className="sk-text-body-medium-semibold text-sko-text-default">{req.title}</p>
                  <p className="sk-text-body-small-regular text-sko-text-subtle">{req.detail}</p>
                  <PlatformProgressBar value={req.percent} label={req.title} />
                </li>
              ))}
            </ul>
            {courses.length > 0 ? (
              <ol aria-label={`Courses of the program: ${complete} of ${courses.length} complete`} className="flex flex-col">
                {courses.map((course) => {
                  const status = courseStatus(course.percent);
                  return (
                    <li
                      key={course.slug}
                      className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 border-t border-sko-border-subtle py-3"
                    >
                      <Link
                        href={coursePageHref(course.slug)}
                        className="sk-text-body-medium-medium inline-flex min-h-11 min-w-0 items-center text-sko-text-default hover:underline md:min-h-6"
                      >
                        Course {course.number} · {course.title}
                      </Link>
                      <Badge color={status.color} size="md" className="shrink-0">
                        {status.label}
                      </Badge>
                    </li>
                  );
                })}
              </ol>
            ) : null}
          </section>

          <div data-arrive={3} className="flex flex-col gap-3 lg:w-[320px] lg:shrink-0">
            <ButtonLink href={back.href} hierarchy="primary" size="lg">
              {back.label}
            </ButtonLink>
            <p className="sk-text-body-medium-regular text-sko-text-subtle">
              The certificate appears on this page once every course of the program is complete.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
