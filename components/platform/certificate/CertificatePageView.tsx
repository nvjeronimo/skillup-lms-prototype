"use client";

import Link from "next/link";
import { ChevronRight, Download } from "lucide-react";
import { Icon } from "@/lib/icons";
import { Button } from "@/components/atoms/Button";
import { ButtonLink } from "@/components/atoms/ButtonLink";
import { InlineAlert } from "@/components/atoms/InlineAlert";
import { CertificateDocument } from "@/components/platform/program/CertificateDocument";
import type { CatalogCourse } from "@/lib/platform/catalog";
import { coursePageHref, programPageHref } from "@/lib/platform/hrefs";
import type { ProgramCertificate } from "@/lib/platform/program";
import { MY_LEARNING_HREF } from "@/lib/platform/routes";
import { useLmsStore } from "@/lib/store";

const CRUMB = "sk-text-body-medium-semibold inline-flex min-h-11 items-center lg:min-h-6";

/**
 * A certificate on its own page: where *View* on a Certificate card leads.
 *
 * PROPOSAL, NOT DESIGNED. There is no Figma screen for this page: it is assembled from what
 * exists (the platform shell, the breadcrumb of the course and program pages, the certificate
 * document of the Certificate card, DS buttons) so the flow has somewhere to land. The note
 * at the top of the page says the same to whoever is looking at it.
 */
export function CertificatePageView({
  certificate,
  course,
}: {
  certificate: Extract<ProgramCertificate, { status: "issued" }>;
  course: CatalogCourse;
}) {
  const showToast = useLmsStore((s) => s.showToast);
  const program = course.program;

  return (
    <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-4 px-4 pb-8 pt-4 md:gap-5 md:px-6 md:pb-12 lg:gap-6 lg:px-10 lg:pb-20 lg:pt-5">
      <nav aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-x-1.5 md:gap-x-2">
          <li className="flex items-center gap-1.5 md:gap-2">
            <Link href={MY_LEARNING_HREF} className={`${CRUMB} text-sko-text-subtle hover:text-sko-text-default`}>
              My Learning
            </Link>
            <Icon icon={ChevronRight} size={16} aria-hidden className="text-sko-icon-muted" />
          </li>
          {program ? (
            <li className="flex min-w-0 items-center gap-1.5 md:gap-2">
              <Link
                href={`${programPageHref(program.slug)}?tab=certificates`}
                className={`${CRUMB} min-w-0 text-sko-text-subtle hover:text-sko-text-default`}
              >
                {program.title}
              </Link>
              <Icon icon={ChevronRight} size={16} aria-hidden className="text-sko-icon-muted" />
            </li>
          ) : null}
          <li className="flex items-center">
            <span aria-current="page" className={`${CRUMB} text-sko-text-primary`}>
              Certificate
            </span>
          </li>
        </ol>
      </nav>

      <InlineAlert
        tone="info"
        title="Sample page: not designed yet"
        description="This page has no Figma screen. It is a proposal so that View certificate has somewhere to go, built from parts that already exist."
      />

      <div className="flex flex-col gap-1">
        <h1 className="sk-text-headline-small-semibold text-sko-text-default">{certificate.title}</h1>
        <p className="sk-text-body-medium-regular text-sko-text-subtle">{certificate.issuedLine}</p>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:gap-10">
        <div
          data-mock="Certificate artwork, ID and verification address are sample data"
          className="relative aspect-[1123/794] w-full min-w-0 overflow-hidden rounded-lg border border-sko-border-subtle bg-sko-bg-subtle shadow-sk-card [container-type:inline-size] lg:flex-1"
        >
          <div className="absolute inset-0">
            <CertificateDocument
              data={certificate.document}
              label={`Certificate of completion: ${certificate.document.learner}, ${certificate.title}`}
            />
          </div>
        </div>

        <div className="flex flex-col gap-3 lg:w-[320px] lg:shrink-0">
          <Button
            hierarchy="primary"
            size="lg"
            leftIcon={Download}
            onClick={() => showToast("Download certificate is not part of this prototype yet")}
          >
            Download certificate
          </Button>
          <ButtonLink href={coursePageHref(course.slug)} hierarchy="secondary" size="lg">
            Go to the course
          </ButtonLink>
          <dl className="mt-2 flex flex-col gap-3">
            <div className="flex flex-col gap-0.5">
              <dt className="sk-text-body-small-regular text-sko-text-subtle">Certificate ID</dt>
              <dd className="sk-text-body-medium-semibold text-sko-text-default">{certificate.document.certificateId}</dd>
            </div>
            <div className="flex flex-col gap-0.5">
              <dt className="sk-text-body-small-regular text-sko-text-subtle">Verify at</dt>
              <dd className="sk-text-body-medium-semibold break-all text-sko-text-default">{certificate.document.verifyUrl}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
