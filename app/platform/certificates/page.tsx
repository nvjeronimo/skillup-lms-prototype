import type { Metadata } from "next";
import { CertificatesView } from "@/components/platform/certificate/CertificatesView";
import { pageTitle } from "@/lib/utils";

export const metadata: Metadata = { title: pageTitle("My Certificates") };

/** Certificates (19 Oct 2026): every certificate of the learner, earned and in progress. */
export default function CertificatesPage() {
  return <CertificatesView />;
}
