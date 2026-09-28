"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { CoursePlayerTopbar, type TopbarSize } from "@/components/organisms/CoursePlayerTopbar";
import { CourseCertificate } from "@/components/organisms/CourseCertificate";
import { Toast } from "@/components/organisms/Toast";
import { useLmsStore } from "@/lib/store";
import { useBreakpoint } from "@/lib/useBreakpoint";
import { track } from "@/lib/analytics";
import { certificate, DEFAULT_TOPIC_ID } from "@/lib/data";

export function CertificateView({ courseSlug }: { courseSlug: string }) {
  const router = useRouter();
  const bp = useBreakpoint();
  const toast = useLmsStore((s) => s.toast);
  const showToast = useLmsStore((s) => s.showToast);
  const clearToast = useLmsStore((s) => s.clearToast);

  const topbarSize: TopbarSize = bp === "mobile" ? "Mobile" : bp === "tablet" ? "Tablet" : "Desktop";
  const backToCourse = () => router.push(`/course/${courseSlug}/topic/${DEFAULT_TOPIC_ID}`);

  React.useEffect(() => {
    track("certificate_view");
  }, []);

  return (
    <div className="flex min-h-[100dvh] flex-col bg-sko-bg-subtle">
      <CoursePlayerTopbar size={topbarSize} showBookmark showNotifications onClose={backToCourse} />

      {/* Deep brand stage (theme- + skin-stable; never inverts) */}
      {/* token-lint-disable-next-line no DS token for a fixed deep-teal stage; kept on the v4 alias of the old brand-stage token (see PR notes: it inverts in Dark) */}
      <div className="flex flex-1 flex-col items-center justify-center gap-6 bg-sko-text-on-primary-soft px-4 py-12">
        <p className="sk-text-2xs-medium text-sko-text-on-media">Certificate of Completion</p>
        <CourseCertificate
          learnerName={certificate.learnerName}
          courseTitle={certificate.courseTitle}
          provider={certificate.provider}
          dateLabel={certificate.dateLabel}
          certificateId={certificate.certificateId}
          stats={certificate.stats}
          onBack={backToCourse}
          onShare={(channel) => {
            track("certificate_share", { channel });
            showToast(channel === "copy" ? "Link copied" : `Sharing to ${channel}…`);
          }}
          onDownload={() => showToast("Downloading certificate (PDF)…")}
          onPrint={() => track("certificate_print")}
        />
      </div>

      <Toast toast={toast} onDone={clearToast} />
    </div>
  );
}
