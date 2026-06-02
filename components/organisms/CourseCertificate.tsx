import * as React from "react";
import { Award } from "lucide-react";
import { Icon } from "@/lib/icons";
import { cn } from "@/lib/utils";

export interface CourseCertificateProps {
  learnerName: string;
  courseTitle: string;
  provider: string;
  dateLabel: string;
  className?: string;
}

/** Certificate of completion preview. */
export function CourseCertificate({
  learnerName,
  courseTitle,
  provider,
  dateLabel,
  className,
}: CourseCertificateProps) {
  return (
    <div
      className={cn(
        "mx-auto flex aspect-[1.4] w-full max-w-2xl flex-col items-center justify-center gap-3 rounded-xl border-4 border-lms-border-brand bg-lms-bg-brand-section p-10 text-center",
        className,
      )}
    >
      <Icon icon={Award} size={48} className="text-lms-text-brand-secondary" />
      <p className="lms-text-2xs-medium text-lms-text-tertiary">Certificate of Completion</p>
      <p className="lms-text-sm-regular text-lms-text-secondary">This certifies that</p>
      <p className="lms-text-display-sm-semibold text-lms-text-primary">{learnerName}</p>
      <p className="lms-text-sm-regular text-lms-text-secondary">has successfully completed</p>
      <p className="lms-text-lg-semibold text-lms-text-brand-secondary">{courseTitle}</p>
      <p className="lms-text-xs-regular mt-2 text-lms-text-tertiary">
        {provider} · {dateLabel}
      </p>
    </div>
  );
}
