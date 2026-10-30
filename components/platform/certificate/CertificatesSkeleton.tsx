import { Skeleton } from "@/components/atoms/Skeleton";
import { enrolments } from "@/lib/platform/certificate-enrolments";

/**
 * Certificates while it loads (motion-matrix §7.9): CertificatesView's column, gaps and text
 * styles. The search, the two Button groups, then the ledger as it opens on Programs: one card
 * per program, its certificate row on bg/subtle and the course bar under it.
 */
export function CertificatesSkeleton() {
  const programs = enrolments.filter((e) => e.kind === "program");
  return (
    <div className="sk-page-stack mx-auto flex w-full max-w-[1200px] flex-col gap-layout-section">
      <div className="flex flex-col gap-2">
        <Skeleton variant="ghost" text="headline-large-bold">
          My Certificates
        </Skeleton>
        <Skeleton variant="ghost" text="body-large-regular">
          Everything you have earned, and what you are working towards.
        </Skeleton>
      </div>

      <div className="flex flex-col gap-layout-stack">
        <div className="flex items-center gap-2 md:justify-end">
          <Skeleton
            variant="block"
            radius="control"
            className="h-11 w-full md:h-10 md:w-[240px] lg:w-[320px]"
          />
        </div>
        <div className="flex flex-col gap-2 md:flex-row md:justify-between">
          <Skeleton
            variant="block"
            radius="track"
            className="h-[52px] w-full md:h-10 md:w-[252px]"
          />
          <Skeleton
            variant="block"
            radius="track"
            className="h-[52px] w-full md:h-10 md:w-[266px]"
          />
        </div>
        <div className="flex flex-col gap-layout-grid">
          {programs.map((e) => (
            <div
              key={e.slug}
              className="overflow-hidden rounded-card border border-sko-border-subtle bg-sko-bg-page"
            >
              <div className="flex items-center gap-3 bg-sko-bg-subtle px-4 py-3 md:gap-4 md:px-5">
                <Skeleton
                  variant="block"
                  radius="control"
                  className="aspect-[1123/794] w-14 shrink-0 md:w-20"
                />
                <Skeleton variant="ghost" text="title-medium-semibold">
                  {e.title}
                </Skeleton>
              </div>
              <div className="border-t border-sko-border-subtle px-4 py-2.5 md:px-5">
                <Skeleton text="body-medium-medium" width={220} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
