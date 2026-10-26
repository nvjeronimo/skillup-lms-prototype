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
    <div className="sk-page-stack mx-auto flex w-full max-w-[1200px] flex-col gap-layout-section">
      {/* Greeting: one line from tablet up, two on a phone; then the assistant's tip. */}
      <div className="flex flex-col gap-2">
        <div>
          <Skeleton text="headline-large-bold" width={420} className="max-w-[70%]" />
          <Skeleton text="headline-large-bold" width="35%" className="md:hidden" />
        </div>
        <Skeleton text="body-large-regular" width={520} className="max-w-[90%]" />
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

      {/* Pick up (the list beside the chosen course) beside Stay informed (400). */}
      <div className="flex flex-col gap-layout-column lg:flex-row lg:items-stretch">
        <div className="flex min-w-0 flex-col gap-4 lg:flex-1">
          <HeaderSkeleton />
          <div className="grid gap-3 rounded-card border border-sko-border-subtle bg-sko-bg-page p-2 lg:grid-cols-[minmax(0,280px)_minmax(0,1fr)]">
            <div className="flex flex-col gap-2">
              {Array.from({ length: resume }, (_, i) => (
                <div key={i} className="flex min-h-16 flex-col justify-center gap-0.5 rounded-inner bg-sko-bg-subtle px-4 py-3">
                  <Skeleton text="body-medium-semibold" width="80%" />
                  <Skeleton text="body-small-regular" width={96} />
                </div>
              ))}
            </div>
            <div className="flex min-w-0 flex-col gap-4 rounded-inner bg-sko-bg-subtle p-5 md:p-6">
              <Skeleton variant="block" radius="inner" className="aspect-[3/1] w-full" />
              <Skeleton text="title-large-semibold" width="70%" />
              <Skeleton text="body-medium-regular" width="55%" />
              <Skeleton variant="block" height={8} radius="none" />
              <div className="flex gap-3">
                <Skeleton variant="block" width={104} height={44} radius="control" />
                <Skeleton variant="block" width={128} height={44} radius="control" />
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col lg:w-[400px] lg:shrink-0 lg:pt-12">
          <div className="flex h-full flex-col gap-3 rounded-card border border-sko-border-subtle bg-sko-bg-page p-5">
            <Skeleton text="title-medium-semibold" width={140} />
            <Skeleton variant="block" height={36} radius="none" />
            {[0, 1, 2, 3].map((i) => (
              <Skeleton key={i} text="body-medium-medium" width="90%" />
            ))}
          </div>
        </div>
      </div>

      {/* Due this week beside Jump somewhere (400, one tile a row there). */}
      <div className="flex flex-col gap-layout-column lg:flex-row lg:items-start">
        <div className="flex min-w-0 flex-col gap-4 lg:flex-1">
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
                  <Skeleton text="body-small-regular" width="60%" />
                </div>
                <Skeleton variant="block" width={72} height={24} radius="pill" />
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-4 lg:w-[400px] lg:shrink-0">
          <HeaderSkeleton action={false} />
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-1">
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
    </div>
  );
}
