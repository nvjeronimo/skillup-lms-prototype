import { SkillUpLogo } from "@/components/atoms/SkillUpLogo";

/**
 * Shown while a platform route segment loads (Next's route-segment fallback). Each page draws
 * its own top bar and skeleton (PlatformPage), and this fallback can show on a revisit too, so
 * it is only the top bar's frame on the page ground: the bar's height and rule (71 + 1 desktop,
 * 63 + 1 below) and the logo where PlatformTopbar puts it (below desktop after the menu's 44
 * target, -10 + -2 as there), nothing that could jump or replay (review M4). No live region of
 * its own: PlatformPage owns the one "Loading…".
 */
export default function PlatformLoading() {
  return (
    <div className="min-h-[100dvh] bg-sko-bg-faint">
      <div data-chrome="" aria-hidden="true" className="border-b border-sko-border-subtle bg-sko-bg-page">
        <div className="hidden h-[71px] items-center px-6 lg:flex">
          <span className="flex min-h-11 items-center">
            <SkillUpLogo className="h-[30px]" />
          </span>
        </div>
        <div className="flex h-[63px] items-center px-4 lg:hidden">
          <span className="-ml-2.5 size-11" />
          <span className="-ml-0.5 flex min-h-11 items-center">
            <SkillUpLogo className="h-[30px]" />
          </span>
        </div>
      </div>
    </div>
  );
}
