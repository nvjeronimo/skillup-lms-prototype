import { Skeleton } from "@/components/atoms/Skeleton";
import { cn } from "@/lib/utils";
import styles from "./HeaderBandSkeleton.module.css";

/**
 * The breadcrumb: 20 tall (its 44 target is drawn over with negative margins), except in the
 * Course header's flex column below desktop, where the target's 44 counts.
 */
function Crumbs({ tall }: { tall: boolean }) {
  return (
    <div className={cn(styles.crumbs, tall && styles.crumbsTall)}>
      <Skeleton text="body-medium-semibold" width={96} />
      <Skeleton text="body-medium-semibold" width={72} />
      <Skeleton text="body-medium-semibold" width={240} className={styles.desktopOnly} />
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
      className={cn(styles.band, program ? styles.bandProgram : styles.bandCourse)}
    >
      <div
        className={cn(
          styles.inner,
          !program && styles.innerCourse,
        )}
      >
        <Crumbs tall={!program} />
        <div
          className={cn(
            styles.row,
            program && styles.rowProgram,
          )}
        >
          <div
            className={cn(
              styles.main,
              program ? styles.mainProgram : styles.mainCourse,
            )}
          >
            <div className={cn(styles.badgeRow, program && styles.badgeRowProgram)}>
              <Skeleton variant="block" width={88} height={28} radius="pill" />
            </div>
            <div className={cn(styles.titleRow, program ? styles.titleRowProgram : styles.titleRowCourse)}>
              <Skeleton variant="block" width={88} height={88} radius="card" className={styles.tabletUp} />
              <Skeleton variant="ghost" text="headline-large-semibold" className={styles.title}>
                {title}
              </Skeleton>
            </div>
            <div className={styles.chips}>
              <Skeleton variant="block" width={96} height={22} radius="pill" />
              <Skeleton variant="block" width={88} height={22} radius="pill" />
            </div>
            {/* The facts, item by item as the headers lay them out, so they wrap where the real
                row does: a program's 19-tall items between separators; a course's items each
                with its left rule, the first one's pushed out of the clipped box. */}
            {program ? (
              <div className={styles.programFacts}>
                {facts.map((fact, i) => (
                  <div key={fact} className={styles.programFact}>
                    {i > 0 ? <span className={styles.separator} /> : null}
                    <span className={styles.programFactInner}>
                      {i === 0 ? <Skeleton variant="block" width={18} height={18} radius="inner" /> : null}
                      <Skeleton variant="ghost" text="body-medium-regular">{fact}</Skeleton>
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.courseFacts}>
                <div className={styles.courseFactRow}>
                  {facts.map((fact, i) => (
                    <div key={fact} className={styles.courseFact}>
                      {i === 0 ? <Skeleton variant="block" width={18} height={18} radius="inner" /> : null}
                      <Skeleton variant="ghost" text="body-medium-regular">{fact}</Skeleton>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className={styles.card}>
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
    <div className={cn(styles.tabBar, rule && styles.tabBarRule)}>
      <div className={styles.tabBarInner}>
        <div className={cn(styles.tabs, rule && styles.tabsOnRule)}>
          {tabs.map((w, i) => (
            <Skeleton key={i} variant="block" width={w} height={20} radius="inner" />
          ))}
        </div>
        {/* The course search beside the tabs, 8 above and 7 below it (CourseDetailView). */}
        {search ? (
          <div className={styles.search}>
            <Skeleton variant="block" width={320} height={40} radius="control" />
          </div>
        ) : null}
      </div>
    </div>
  );
}
