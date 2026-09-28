import type { Metadata } from "next";
import { CertificateView } from "@/components/views/CertificateView";
import { getCourseBySlug } from "@/lib/data";
import { pageTitle } from "@/lib/utils";

type Params = { params: { courseSlug: string } };

export function generateMetadata({ params }: Params): Metadata {
  return { title: pageTitle(`Certificate · ${getCourseBySlug(params.courseSlug).title}`) };
}

export default function CertificatePage({ params }: Params) {
  return <CertificateView courseSlug={params.courseSlug} />;
}
