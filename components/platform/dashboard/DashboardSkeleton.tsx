import { Skeleton } from "@/components/atoms/Skeleton";

/** A section header (DS Section header): the headline-small title, the action on the right. */
function HeaderSkeleton({ action = true }: { action?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <Skeleton text="headline-small-bold" width={220} className="max-w-[60%]" />
      {action ? <Skeleton text="body-medium-semibold" width={104} className="md:h-7" /> : null}
    </div>
  );
}

/**
 * The Dashboard while it loads (motion-matrix §7.9): DashboardView's layout with every
 * block drawn in Skeletons, from the same paddings, gaps and text styles, so nothing moves
 * when the content replaces it. The counts are the page's own (rows, tiles).
 */
export function DashboardSkeleton({ due, resume, jump }: { due: number; resume: number; jump: number }) {
  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-6 lg:gap-8">
      {/* Greeting: one line from tablet up, two on a phone. */}
      <div>
        <Skeleton text="headline-large-bold" width={420} className="max-w-[70%]" />
        <Skeleton text="headline-large-bold" width="35%" className="md:hidden" />
      </div>

      {/* Today at a glance: title, then four stats (value · label · detail). */}
      <div className="flex min-w-0 flex-col gap-4 rounded-card bg-sko-bg-page p-4 md:gap-5 md:p-5 lg:p-6">
        <Skeleton text="label-small-semibold" width={120} />
        <div className="flex justify-between gap-2 md:grid md:grid-cols-4 md:gap-5 lg:gap-6">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="flex min-w-0 flex-col gap-1">
              <Skeleton text="headline-medium-bold" width={40} />
              <Skeleton text="label-small-semibold" width={96} className="max-w-full" />
              <Skeleton text="body-small-medium" width={80} className="max-w-full" />
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-8">
        {/* Due this week. */}
        <div className="flex flex-col gap-4 lg:w-[440px] lg:shrink-0">
          <HeaderSkeleton />
          <div className="overflow-hidden rounded-card border border-sko-border-subtle bg-sko-bg-page">
            {Array.from({ length: due }, (_, i) => (
              <div key={i} className="flex items-start gap-3 border-b border-sko-border-subtle p-4 last:border-b-0 md:px-5">
                <div className="flex w-[60px] shrink-0 flex-col">
                  <Skeleton text="headline-small-bold" width={32} />
                  <Skeleton text="label-small-semibold" width={48} />
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <Skeleton text="body-medium-semibold" width="80%" />
                  {/* The meta line (course · kind) usually wraps to two in the 440 column. */}
                  <Skeleton text="body-small-regular" width="95%" />
                  <Skeleton text="body-small-regular" width="45%" />
                </div>
                <Skeleton variant="block" width={72} height={24} radius="pill" />
              </div>
            ))}
          </div>
        </div>

        {/* Pick up where you left off: the Resume row under 700px of list, the Course Row from 700. */}
        <div className="flex min-w-0 flex-col gap-4 lg:flex-1">
          <HeaderSkeleton />
          <div className="flex flex-col gap-4">
            {Array.from({ length: resume }, (_, i) => (
              <div key={i} className="[container-type:inline-size]">
                <div className="flex flex-col gap-3 rounded-card border border-sko-border-subtle bg-sko-bg-page p-4 [@container_(min-width:700px)]:hidden">
                  <div className="flex flex-col gap-0.5">
                    <Skeleton text="body-small-medium" width={120} />
                    <Skeleton text="body-large-medium" width="75%" />
                    <Skeleton text="body-small-regular" width="50%" />
                  </div>
                  <div className="flex items-center gap-4">
                    <Skeleton variant="block" height={8} radius="none" className="min-w-0 flex-1" />
                    <Skeleton variant="block" width={96} height={44} radius="control" />
                  </div>
                </div>
                <div className="hidden items-center gap-4 rounded-card border border-sko-border-subtle bg-sko-bg-page px-[19px] py-[15px] shadow-sk-card [@container_(min-width:700px)]:flex">
                  <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <Skeleton text="body-small-medium" width={120} />
                    <Skeleton text="body-large-medium" width="70%" />
                    <Skeleton text="body-small-regular" width="45%" />
                  </div>
                  <Skeleton variant="block" width={180} height={8} radius="none" />
                  <Skeleton variant="block" width={88} height={36} radius="control" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Jump somewhere: tiles, two a row on a phone, three from tablet up. */}
      <div className="flex flex-col gap-4">
        <HeaderSkeleton action={false} />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {Array.from({ length: jump }, (_, i) => (
            <div key={i} className="flex flex-col items-start gap-2 rounded-card border border-sko-border-subtle bg-sko-bg-page p-4">
              <Skeleton variant="block" width={36} height={36} radius="control" />
              <Skeleton text="body-medium-semibold" width="60%" />
              <Skeleton text="body-small-regular" width="90%" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
