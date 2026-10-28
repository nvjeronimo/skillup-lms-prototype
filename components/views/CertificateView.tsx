"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { CoursePlayerTopbar, type TopbarSize } from "@/components/organisms/CoursePlayerTopbar";
import { CourseCertificate } from "@/components/organisms/CourseCertificate";
import { Toast } from "@/components/organisms/Toast";
import { useLmsStore } from "@/lib/store";
import { useBreakpoint } from "@/lib/useBreakpoint";
import { track } from "@/lib/analytics";
import { DemoControlsMenu } from "@/components/molecules/DemoControlsMenu";
import { certificate, user, DEFAULT_USER } from "@/lib/data";
import { courseSearchScope } from "@/lib/courseSearchScope";
import { useHydrated } from "@/lib/persona-gate";
import { playerCourse } from "@/lib/platform/catalog";
import { courseHomeHref } from "@/lib/platform/routes";

export function CertificateView({ courseSlug }: { courseSlug: string }) {
  const router = useRouter();
  const bp = useBreakpoint();
  const toast = useLmsStore((s) => s.toast);
  const showToast = useLmsStore((s) => s.showToast);
  const clearToast = useLmsStore((s) => s.clearToast);
  const theme = useLmsStore((s) => s.theme);
  const toggleTheme = useLmsStore((s) => s.toggleTheme);
  const hydrated = useHydrated();
  const learner = hydrated ? user : DEFAULT_USER;
  const searchScope = React.useMemo(
    () => courseSearchScope(playerCourse(courseSlug), courseSlug),
    [courseSlug],
  );

  const topbarSize: TopbarSize = bp === "mobile" ? "Mobile" : bp === "tablet" ? "Tablet" : "Desktop";
  // Back from the certificate is the course page, where the certificate card lives.
  const backToCourse = () => router.push(courseHomeHref(courseSlug));

  React.useEffect(() => {
    track("certificate_view");
  }, []);

  return (
    <div className="flex min-h-[100dvh] flex-col bg-sko-bg-subtle">
      {/* The full player bar, as Figma 3830:77023 (Nelson's SKO match review, 28 Oct 2026): Search
          and Assistant, the theme switch and the learner with their role. */}
      <CoursePlayerTopbar
        size={topbarSize}
        showBookmark
        showNotifications
        searchScope={searchScope}
        showTheme
        theme={theme === "dark" ? "Dark" : "Light"}
        onTheme={toggleTheme}
        onClose={backToCourse}
        accountMenu={
          <DemoControlsMenu
            userName={learner.name}
            userAvatarUrl={learner.avatarUrl}
            compact={topbarSize === "Mobile"}
          />
        }
      />

      {/* Brand stage: bg/primary with its own text pair, so the overline holds AA in every
          theme and skin (the old stage sat on a text token that turned pale in Dark). */}
      <main id="main" tabIndex={-1} className="flex flex-1 flex-col items-center justify-center gap-6 bg-sko-bg-primary px-4 py-12 outline-none">
        <h1 className="sk-text-label-small-medium text-sko-text-on-primary">Certificate of Completion</h1>
        <CourseCertificate
          learnerName={certificate.learnerName}
          courseTitle={playerCourse(courseSlug).title}
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
      </main>

      <Toast toast={toast} onDone={clearToast} />
    </div>
  );
}
