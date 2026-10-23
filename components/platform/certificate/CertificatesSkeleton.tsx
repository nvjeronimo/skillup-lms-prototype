import { Skeleton } from "@/components/atoms/Skeleton";
import { earnedCertificates } from "@/lib/platform/certificates";

/**
 * Certificates while it loads (motion-matrix §7.9): CertificatesView's column, gaps and text
 * styles. The two tabs on their rule, the search (and the view toggle on desktop), then the
 * Earned tab as it opens: each card drawn as the card is (eyebrow, the sheet at its 1123:794
 * ratio, ghost title and issue line, the actions on the bottom edge, cards of a row one height).
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

      <div className="flex flex-col gap-6">
        <div className="flex gap-3 border-b border-sko-border-subtle pb-3 pt-2 md:pt-5">
          <Skeleton text="body-large-semibold" width={120} />
          <Skeleton text="body-large-semibold" width={84} />
        </div>
        <div className="flex items-center gap-2 md:justify-end">
          <Skeleton variant="block" radius="control" className="h-11 w-full md:h-10 md:w-[240px] lg:w-[320px]" />
          <Skeleton variant="block" radius="track" className="hidden h-10 w-[98px] shrink-0 lg:block" />
        </div>
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
    </div>
  );
}
