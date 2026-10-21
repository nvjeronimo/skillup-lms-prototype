import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PlatformPage } from "@/components/platform/PlatformPage";
import { CertificatePageSkeleton } from "@/components/platform/certificate/CertificatePageSkeleton";
import { CertificatePageView } from "@/components/platform/certificate/CertificatePageView";
import { getProgramCertificate } from "@/lib/platform/catalog";
import { pageTitle } from "@/lib/utils";

type Params = { params: { programSlug: string } };

export function generateMetadata({ params }: Params): Metadata {
  const found = getProgramCertificate(params.programSlug);
  return { title: pageTitle(found ? `Program certificate · ${found.program.title}` : "Certificate not found") };
}

/**
 * The certificate of a program, on a page of its own. A PROPOSAL: no Figma screen exists for
 * it (asked for by Nelson on 10 Oct 2026); the page says so itself. The completed sample
 * program (data-analytics-foundations) shows its issued certificate; the others show the
 * not-earned state with what is missing. The static
 * `program` segment sits beside `[courseSlug]`: no course is called "program".
 */
export default function ProgramCertificatePage({ params }: Params) {
  const found = getProgramCertificate(params.programSlug);
  if (!found) notFound();
  return (
    <PlatformPage
      current="my-learning"
      skeleton={
        <CertificatePageSkeleton
          kind="program"
          certificate={found.certificate}
          program={{ slug: found.program.slug, title: found.program.title }}
          courses={found.courses}
        />
      }
    >
      <CertificatePageView
        kind="program"
        certificate={found.certificate}
        program={{ slug: found.program.slug, title: found.program.title }}
        courses={found.courses}
        complete={found.complete}
      />
    </PlatformPage>
  );
}
