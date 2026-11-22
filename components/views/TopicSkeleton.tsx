import { Skeleton } from "@/components/atoms/Skeleton";
import { CONTENT_MEASURE, CONTENT_PAD, CONTENT_PB, CONTENT_PT, CONTENT_PX } from "./contentPadding";
import type { Breakpoint } from "@/lib/useBreakpoint";
import { cn } from "@/lib/utils";
import styles from "./TopicSkeleton.module.css";

/** A few lines of body text, the last one short. */
function Lines({ count, text = "body-large-regular" }: { count: number; text?: string }) {
  return (
    <div className={styles.lines}>
      {Array.from({ length: count }, (_, i) => (
        <Skeleton key={i} text={text} width={i === count - 1 ? "55%" : "100%"} />
      ))}
    </div>
  );
}

/** The tab row (ContentTabs): the tabs on a rule, or the select on a phone. */
function TabsSkeleton({ bp }: { bp: Breakpoint }) {
  return bp === "mobile" ? (
    <Skeleton variant="block" height={44} radius="control" />
  ) : (
    <div className={styles.tabs}>
      <Skeleton text="body-medium-semibold" width={88} />
      <Skeleton text="body-medium-semibold" width={64} />
    </div>
  );
}

/**
 * The topic body while it loads (motion-matrix §7.9): PlayerShell's body layout in Skeletons,
 * with the same content padding, so the header, the media and the tabs do not move when the
 * content replaces it. A video draws its player band at the player's height; every other type
 * the Topic Header (type · duration, title, description). The shell around it stays.
 */
export function TopicSkeleton({
  bp,
  video,
  videoHeight,
  tabs,
  title,
  description,
  completed = false,
}: {
  bp: Breakpoint;
  video: boolean;
  videoHeight: number | string;
  tabs: boolean;
  /** The header carries the "Marked as completed" badge. */
  completed?: boolean;
  /** The topic's title and description: ghost lines that wrap as the header will. */
  title: string;
  description?: string;
}) {
  if (video) {
    return (
      <>
        <div className={cn(CONTENT_PX[bp], CONTENT_PT[bp], styles.videoBand)}>
          <Skeleton variant="block" height={videoHeight} radius="card" />
        </div>
        <div className={cn(CONTENT_PX[bp], CONTENT_PB[bp], CONTENT_MEASURE)}>
          <Skeleton variant="ghost" text="headline-small-semibold">{title}</Skeleton>
          <div className={styles.videoBody}>
            {tabs ? <TabsSkeleton bp={bp} /> : null}
            <Lines count={4} />
            <Lines count={3} />
          </div>
        </div>
      </>
    );
  }
  return (
    <div className={cn(CONTENT_PAD[bp], CONTENT_MEASURE)}>
      <div className={styles.header}>
        {/* Type · duration, and the completed badge on the right (it wraps under on a phone). */}
        <div className={styles.meta}>
          <Skeleton variant="block" width={80} height={20} radius="pill" />
          <Skeleton text="body-medium-medium" width={104} />
          {completed ? <Skeleton variant="block" width={148} height={24.5} radius="pill" className={styles.completedBadge} /> : null}
        </div>
        <Skeleton variant="ghost" text="headline-small-semibold">{title}</Skeleton>
        {description ? <Skeleton variant="ghost" text="body-large-medium">{description}</Skeleton> : null}
      </div>
      <div className={styles.body}>
        {tabs ? <TabsSkeleton bp={bp} /> : null}
        <Lines count={5} />
        <Lines count={4} />
        <Lines count={3} />
      </div>
    </div>
  );
}
