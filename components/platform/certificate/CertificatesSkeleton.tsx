import { Skeleton } from "@/components/atoms/Skeleton";
import { earnedCertificates, earnedIssuedValue, groupCertificates } from "@/lib/platform/certificates";

/**
 * Certificates while it loads (motion-matrix §7.9): CertificatesView's column, gaps and text
 * styles. The two tabs on their rule, the search, then the Earned tab as it opens: one Program
 * card per program (the hero block beside the body: the program certificate line and the
 * show / hide button, closed), then the Other courses card with one row per certificate.
 */
export function CertificatesSkeleton() {
  const groups = groupCertificates(earnedCertificates, earnedIssuedValue);
  return (
    <div className="sk-page-stack mx-auto flex w-full max-w-[1200px] flex-col gap-layout-section">
      <div className="flex flex-col gap-2">
        <Skeleton variant="ghost" text="headline-large-bold">My Certificates</Skeleton>
        <Skeleton variant="ghost" text="body-large-regular">
          Everything you have earned, and what you are working towards.
        </Skeleton>
      </div>

      <div className="flex flex-col gap-layout-stack">
        <div className="flex gap-3 border-b border-sko-border-subtle pb-3 pt-2 md:pt-5">
          <Skeleton text="body-large-semibold" width={120} />
          <Skeleton text="body-large-semibold" width={84} />
        </div>
        <div className="flex items-center gap-2 md:justify-end">
          <Skeleton variant="block" radius="control" className="h-11 w-full md:h-10 md:w-[240px] lg:w-[320px]" />
        </div>
        <div className="flex flex-col gap-layout-grid">
          {groups.programs.map((g) => (
            <div key={g.program.slug} className="flex flex-col overflow-hidden rounded-card border border-sko-border-subtle bg-sko-bg-page lg:flex-row">
              <Skeleton variant="block" radius="none" className="h-[194px] w-full lg:w-[42%] lg:shrink-0" />
              <div className="flex min-w-0 flex-1 flex-col justify-between gap-4 p-4 md:p-5 lg:p-6">
                <Skeleton variant="ghost" text="title-medium-semibold">Program certificate</Skeleton>
                <Skeleton variant="block" radius="control" className="h-11 w-full md:h-9" />
              </div>
            </div>
          ))}
          {groups.standalone.length ? (
            <div className="flex flex-col gap-3 rounded-card border border-sko-border-subtle bg-sko-bg-page p-4 md:p-5 lg:p-6">
              <Skeleton variant="ghost" text="title-medium-semibold">Other courses</Skeleton>
              {groups.standalone.map((e) => (
                <div key={e.id} className="flex items-center gap-4 py-2">
                  <Skeleton variant="block" radius="control" className="aspect-[1123/794] w-16 shrink-0 md:w-20" />
                  <Skeleton variant="ghost" text="body-large-regular">{e.certificate.title}</Skeleton>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
