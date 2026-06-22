import { CertificateView } from "@/components/views/CertificateView";

export default function CertificatePage({ params }: { params: { courseSlug: string } }) {
  return <CertificateView courseSlug={params.courseSlug} />;
}
