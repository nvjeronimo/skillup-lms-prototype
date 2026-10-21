import { Skeleton } from "@/components/atoms/Skeleton";
import { certificatesInProgress, earnedCertificates } from "@/lib/platform/certificates";

function SectionTitleSkeleton({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-2">
      <Skeleton variant="ghost" text="title-large-semibold">{title}</Skeleton>
      <Skeleton variant="block" width={28} height={24} radius="pill" />
    </div>
  );
}

/**
 * Certificates while it loads (motion-matrix §7.9): CertificatesView's column, gaps and text
 * styles. Each earned card is drawn as the card is (eyebrow, the sheet at its 1123:794 ratio,
 * ghost title and issue line, the actions on the bottom edge, cards of a row one height); each
 * row of In progress has its ghost lines and its bar.
 */
export function CertificatesSkeleton() {
  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-8 lg:gap-10">
      <div className="flex flex-col gap-2">
        <Skeleton variant="ghost" text="headline-large-bold">Certificates</Skeleton>
        <Skeleton variant="ghost" text="body-large-regular">
          Everything you have earned, and what you are working towards.
        </Skeleton>
      </div>

      <div className="flex flex-col gap-4 md:gap-5">
        <SectionTitleSkeleton title="Earned" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-3 lg:gap-6">
          {earnedCertificates.map((e) => (
            <div key={e.id} className="flex">
              <div className="flex w-full flex-col gap-3 rounded-card border border-sko-border-subtle bg-sko-bg-page p-[15px]">
                <Skeleton text="label-small-medium" width={120} />
                <Skeleton variant="block" radius="card" className="aspect-[1123/794] w-full" />
                <Skeleton variant="ghost" text="body-large-semibold">{e.certificate.title}</Skeleton>
                <Skeleton variant="ghost" text="body-medium-regular">
                  {e.program
                    ? `${e.certificate.issuedLine} Course ${e.program.number} of ${e.program.total}, ${e.program.title}.`
                    : e.certificate.issuedLine}
                </Skeleton>
                <div className="mt-auto flex items-start gap-1.5">
                  <Skeleton variant="block" radius="control" className="h-11 min-w-0 flex-1 md:h-9" />
                  <Skeleton variant="block" radius="control" className="h-11 min-w-0 flex-1 md:h-9" />
                  <Skeleton variant="block" radius="control" className="size-11 shrink-0 md:size-9" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4 md:gap-5">
        <SectionTitleSkeleton title="In progress" />
        <div className="flex flex-col overflow-hidden rounded-card border border-sko-border-subtle bg-sko-bg-page">
          {certificatesInProgress.map((c) => (
            <div key={c.id} className="flex items-center gap-4 border-b border-sko-border-subtle p-4 last:border-b-0 md:px-5">
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <div className="flex flex-col gap-0.5">
                  <Skeleton variant="ghost" text="label-small-medium">
                    {`${c.kind === "program" ? "Program certificate" : "Course certificate"}${c.context ? ` · ${c.context}` : ""}`}
                  </Skeleton>
                  <Skeleton variant="ghost" text="body-large-semibold">{c.title}</Skeleton>
                </div>
                <div className="flex flex-col gap-1 md:flex-row md:items-center md:gap-3">
                  <Skeleton variant="block" height={8} radius="none" className="md:max-w-[320px] md:flex-1" />
                  <Skeleton variant="ghost" text="body-small-regular">{c.detail}</Skeleton>
                </div>
              </div>
              <Skeleton variant="block" width={20} height={20} radius="inner" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
