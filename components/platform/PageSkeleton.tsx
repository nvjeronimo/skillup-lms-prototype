import { Skeleton } from "@/components/atoms/Skeleton";

/**
 * The fallback skeleton of a platform page that has no page-shaped one yet: the page title
 * and three blocks, in the 1200 content column and the Dashboard's gaps. Every platform page
 * now passes its own (PlatformPage's `skeleton` prop); this stays as the fallback.
 */
export function PageSkeleton() {
  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-6 lg:gap-8">
      <Skeleton text="headline-large-bold" width="40%" />
      <Skeleton variant="block" height={160} radius="card" />
      <Skeleton variant="block" height={240} radius="card" />
      <Skeleton variant="block" height={240} radius="card" />
    </div>
  );
}
