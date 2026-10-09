import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PlatformPage } from "@/components/platform/PlatformPage";
import { CertificatePageView } from "@/components/platform/certificate/CertificatePageView";
import { getIssuedCertificate } from "@/lib/platform/catalog";
import { pageTitle } from "@/lib/utils";

type Params = { params: { courseSlug: string } };

export function generateMetadata({ params }: Params): Metadata {
  const found = getIssuedCertificate(params.courseSlug);
  return { title: pageTitle(found ? `Certificate · ${found.certificate.title}` : "Certificate not found") };
}

/**
 * The certificate of a course of a program, on a page of its own. A PROPOSAL: no Figma
 * screen exists for it yet (asked for by Nelson on 9 Oct 2026 as a sample page); the page
 * says so itself.
 */
export default function CertificatePage({ params }: Params) {
  const found = getIssuedCertificate(params.courseSlug);
  if (!found) notFound();
  return (
    <PlatformPage current="my-learning">
      <CertificatePageView certificate={found.certificate} course={found.course} />
    </PlatformPage>
  );
}
