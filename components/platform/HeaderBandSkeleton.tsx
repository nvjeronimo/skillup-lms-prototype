import { Skeleton } from "@/components/atoms/Skeleton";
import { cn } from "@/lib/utils";

/**
 * The breadcrumb: 20 tall (its 44 target is drawn over with negative margins), except in the
 * Course header's flex column below desktop, where the target's 44 counts.
 */
function Crumbs({ tall }: { tall: boolean }) {
  return (
    <div className={cn("flex items-center gap-2", tall ? "h-11 lg:h-5" : "h-5")}>
      <Skeleton text="body-medium-semibold" width={96} />
      <Skeleton text="body-medium-semibold" width={72} />
      <Skeleton text="body-medium-semibold" width={240} className="hidden lg:block" />
    </div>
  );
}

/**
 * The Program and Course headers while they load (motion-matrix §7.9): the band (dark for a
 * program, bg/primary-soft for a course), the breadcrumb, the kind badge row, the title as a
 * ghost line beside the 88 cover (tablet up), the format badges, the facts as a ghost line
 * (they wrap as the real row does), and the Progress card. The wrappers repeat ProgramHeader's
 * and CourseHeader's own classes, so the band has the header's height at every width.
 */
export function HeaderBandSkeleton({
  kind,
  title,
  facts,
  cardLines,
}: {
  kind: "program" | "course";
  title: string;
  /** The facts row, item by item ("7 courses", "6 months", …). */
  facts: string[];
  /** Lines under the Progress card's button: one on a program, two on a course. */
  cardLines: 1 | 2;
}) {
  const program = kind === "program";
  return (
    <div
      data-theme={program ? "dark" : undefined}
      className={cn("relative overflow-hidden", program ? "bg-sko-bg-subtle" : "bg-sko-bg-primary-soft")}
    >
      <div
        className={cn(
          "relative mx-auto w-full max-w-[1280px] px-layout-band-x pb-6 pt-4 md:pb-8 lg:pb-10 lg:pt-5",
          !program && "flex flex-col gap-4 lg:gap-0",
        )}
      >
        <Crumbs tall={!program} />
        <div
          className={cn(
            "relative flex flex-col gap-4 md:flex-row md:items-start md:gap-6 lg:mt-[18.75px] lg:gap-10 lg:pt-6",
            program && "mt-4",
          )}
        >
          <div
            className={cn(
              "flex min-w-0 flex-1 flex-col gap-4 lg:gap-0",
              program ? "lg:min-h-[228.75px]" : "lg:-my-1",
            )}
          >
            <div className={cn("flex items-center lg:py-3", program && "h-9 lg:h-auto")}>
              <Skeleton variant="block" width={88} height={28} radius="pill" />
            </div>
            <div className={cn("flex gap-4", program ? "items-start" : "items-center")}>
              <Skeleton variant="block" width={88} height={88} radius="card" className="hidden md:block" />
              <Skeleton variant="ghost" text="headline-large-semibold" className="min-w-0 flex-1">
                {title}
              </Skeleton>
            </div>
            <div className="flex gap-2 lg:py-3">
              <Skeleton variant="block" width={96} height={22} radius="pill" />
              <Skeleton variant="block" width={88} height={22} radius="pill" />
            </div>
            {/* The facts, item by item as the headers lay them out, so they wrap where the real
                row does: a program's 19-tall items between separators; a course's items each
                with its left rule, the first one's pushed out of the clipped box. */}
            {program ? (
              <div className="flex flex-wrap items-center gap-2 py-3">
                {facts.map((fact, i) => (
                  <div key={fact} className="flex items-center gap-2">
                    {i > 0 ? <span className="h-[19px] border-l border-sko-border-default" /> : null}
                    <span className="flex h-[19px] items-center gap-1.5">
                      {i === 0 ? <Skeleton variant="block" width={18} height={18} radius="inner" /> : null}
                      <Skeleton variant="ghost" text="body-medium-regular">{fact}</Skeleton>
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="overflow-hidden py-3 md:pb-0 lg:pb-3">
                <div className="-ml-[17px] flex flex-wrap items-center gap-y-2">
                  {facts.map((fact, i) => (
                    <div key={fact} className="ml-2 flex items-center gap-1.5 border-l border-sko-border-default pl-2">
                      {i === 0 ? <Skeleton variant="block" width={18} height={18} radius="inner" /> : null}
                      <Skeleton variant="ghost" text="body-medium-regular">{fact}</Skeleton>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="flex w-full shrink-0 flex-col gap-2 rounded-card border border-sko-border-subtle bg-sko-bg-page p-[15px] md:w-[320px] lg:w-[360px]">
            <Skeleton text="headline-medium-bold" width={72} />
            <Skeleton variant="block" height={8} radius="none" />
            <Skeleton text="body-small-regular" width="70%" />
            <Skeleton variant="block" height={48} radius="control" />
            {Array.from({ length: cardLines }, (_, i) => (
              <Skeleton key={i} text="body-small-regular" width={i ? "60%" : "45%"} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/** A tab bar under a header: bg/page across the page on its rule, the tab labels as bars. */
export function TabBarSkeleton({ tabs, search = false, rule = true }: { tabs: number[]; search?: boolean; rule?: boolean }) {
  return (
    <div className={cn("bg-sko-bg-page", rule && "border-b border-sko-border-subtle")}>
      <div className="mx-auto flex w-full max-w-[1280px] items-end justify-between pl-layout-band-x pt-3 md:px-layout-band-x md:pt-0">
        <div className={cn("flex h-8 items-center gap-6 md:h-12", rule && "-mb-px")}>
          {tabs.map((w, i) => (
            <Skeleton key={i} variant="block" width={w} height={20} radius="inner" />
          ))}
        </div>
        {/* The course search beside the tabs, 8 above and 7 below it (CourseDetailView). */}
        {search ? (
          <div className="hidden pb-[7px] pt-2 md:block">
            <Skeleton variant="block" width={320} height={40} radius="control" />
          </div>
        ) : null}
      </div>
    </div>
  );
}
