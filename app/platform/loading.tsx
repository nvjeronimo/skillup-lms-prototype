import { PageSkeleton, SkeletonStatus } from "@/components/platform/PageSkeleton";

/**
 * Shown while a platform route segment loads (Next's route-segment fallback): the generic
 * page skeleton on the page ground, with the Dashboard's padding (motion-matrix §7.9; it
 * replaced the spinner). Static under reduced motion (app/globals.css).
 */
export default function PlatformLoading() {
  return (
    <div className="min-h-[100dvh] bg-sko-bg-faint px-6 pb-12 pt-6 md:px-8 md:pb-16 md:pt-8 lg:px-10 lg:pb-20 lg:pt-10">
      <SkeletonStatus>
        <PageSkeleton />
      </SkeletonStatus>
    </div>
  );
}
