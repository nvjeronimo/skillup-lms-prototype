import { Skeleton } from "@/components/atoms/Skeleton";
import { cn } from "@/lib/utils";
import styles from "./DashboardSkeleton.module.css";

/** A section header (DS Section header): the headline-small title, the action on the right. */
function HeaderSkeleton({ action = true }: { action?: boolean }) {
  return (
    <div className={styles.header}>
      <Skeleton text="headline-small-bold" width={220} className={styles.max60} />
      {action ? <Skeleton text="body-medium-semibold" width={104} className={styles.actionLine} /> : null}
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
    <div className={cn("sk-page-stack", styles.stack)}>
      {/* Greeting: one line from tablet up, two on a phone; then the assistant's tip. */}
      <div className={styles.greeting}>
        <div>
          <Skeleton text="headline-large-bold" width={420} className={styles.max70} />
          <Skeleton text="headline-large-bold" width="35%" className={styles.phoneOnly} />
        </div>
        <Skeleton text="body-large-regular" width={520} className={styles.max90} />
      </div>

      {/* Today at a glance: title, then four stats (value · label · detail). */}
      <div className={styles.glance}>
        <Skeleton text="label-small-semibold" width={120} />
        <div className={styles.stats}>
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className={styles.stat}>
              <Skeleton text="headline-medium-bold" width={40} />
              <Skeleton text="label-small-semibold" width={96} className={styles.maxFull} />
              <Skeleton text="body-small-medium" width={80} className={styles.maxFull} />
            </div>
          ))}
        </div>
      </div>

      {/* Pick up (the list beside the chosen course) beside Stay informed (400). */}
      <div className={cn(styles.row, styles.rowStretch)}>
        <div className={styles.main}>
          <HeaderSkeleton />
          <div className={styles.pickup}>
            <div className={styles.options}>
              {Array.from({ length: resume }, (_, i) => (
                <div key={i} className={styles.option}>
                  <Skeleton text="body-medium-semibold" width="80%" />
                  <Skeleton text="body-small-regular" width={96} />
                </div>
              ))}
            </div>
            <div className={styles.panel}>
              <Skeleton variant="block" radius="inner" className={styles.cover} />
              <Skeleton text="title-large-semibold" width="70%" />
              <Skeleton text="body-medium-regular" width="55%" />
              <Skeleton variant="block" height={8} radius="none" />
              <div className={styles.buttons}>
                <Skeleton variant="block" width={104} height={44} radius="control" />
                <Skeleton variant="block" width={128} height={44} radius="control" />
              </div>
            </div>
          </div>
        </div>
        <div className={styles.side}>
          <div className={styles.informed}>
            <Skeleton text="title-medium-semibold" width={140} />
            <Skeleton variant="block" height={36} radius="none" />
            {[0, 1, 2, 3].map((i) => (
              <Skeleton key={i} text="body-medium-medium" width="90%" />
            ))}
          </div>
        </div>
      </div>

      {/* Due this week beside Jump somewhere (400, one tile a row there). */}
      <div className={cn(styles.row, styles.rowStart)}>
        <div className={styles.main}>
          <HeaderSkeleton />
          <div className={styles.due}>
            {Array.from({ length: due }, (_, i) => (
              <div key={i} className={styles.dueItem}>
                <div className={styles.dueDate}>
                  <Skeleton text="headline-small-bold" width={32} />
                  <Skeleton text="label-small-semibold" width={48} />
                </div>
                <div className={styles.dueContent}>
                  <Skeleton text="body-medium-semibold" width="80%" />
                  <Skeleton text="body-small-regular" width="60%" />
                </div>
                <Skeleton variant="block" width={72} height={24} radius="pill" />
              </div>
            ))}
          </div>
        </div>
        <div className={styles.jump}>
          <HeaderSkeleton action={false} />
          <div className={styles.tiles}>
            {Array.from({ length: jump }, (_, i) => (
              <div key={i} className={styles.tile}>
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
