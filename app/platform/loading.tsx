import { Skeleton } from "@/components/atoms/Skeleton";

/**
 * Shown while a platform route segment loads (Next's route-segment fallback). Each page draws
 * its own top bar and skeleton (PlatformPage), and this fallback can show on a revisit too, so
 * it is only the top bar's frame on the page ground: the bar's height, rule and logo place
 * (71 + 1 desktop, 63 + 1 below), nothing that could jump or replay (review M4). No live
 * region of its own: PlatformPage owns the one "Loading…".
 */
export default function PlatformLoading() {
  return (
    <div className="min-h-[100dvh] bg-sko-bg-faint">
      <div data-chrome="" aria-hidden="true" className="border-b border-sko-border-subtle bg-sko-bg-page">
        <div className="flex h-[63px] items-center px-4 lg:h-[71px] lg:px-6">
          <Skeleton variant="block" width={120} height={30} radius="inner" />
        </div>
      </div>
    </div>
  );
}
