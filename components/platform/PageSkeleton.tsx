import { Skeleton } from "@/components/atoms/Skeleton";

/**
 * The one live region of a loading page (motion-matrix §7.9): role="status" with a visually
 * hidden "Loading…", around skeletons that are all aria-hidden, so it is announced once.
 */
export function SkeletonStatus({ children }: { children: React.ReactNode }) {
  return (
    <div role="status">
      <span className="sr-only">Loading…</span>
      {children}
    </div>
  );
}

/**
 * The fallback skeleton of a platform page that has no page-shaped one yet: the page title
 * and three blocks, in the 1200 content column and the Dashboard's gaps. Part 2 of the
 * arrival block gives each page its own (PlatformPage's `skeleton` prop).
 */
export function PageSkeleton() {
  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-5 md:gap-6 lg:gap-8">
      <Skeleton text="headline-large-bold" width="40%" />
      <Skeleton variant="block" height={160} radius="card" />
      <Skeleton variant="block" height={240} radius="card" />
      <Skeleton variant="block" height={240} radius="card" />
    </div>
  );
}
