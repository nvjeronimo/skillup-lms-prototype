import * as React from "react";
import { Skeleton, SkeletonPill } from "@/components/atoms/Skeleton";
import { COURSE_ROW_FRAME } from "@/components/platform/CourseRowCard";
import {
  MY_LEARNING_TAB_KEY,
  myLearningFirstTab,
  myLearningHeading,
  myLearningStatusFilters,
  type MyLearningTab,
} from "@/lib/platform/my-learning";
import { cn } from "@/lib/utils";
import { MY_LEARNING_FILTER_TRACK, MY_LEARNING_GRID } from "./MyLearningCollection";
import { PROGRAM_CARD_FRAME } from "./ProgramCard";
import styles from "./MyLearningSkeleton.module.css";

/* The Collection's grid: 3 columns / 24, 2 / 20 on tablet, 1 / 16 on a phone (MyLearningCollection). */
/* Card heights: measured from sample data (21 Oct 2026, at 375 / 768 / 1024 / 1280). The cards'
   inner layouts (cover band, partner logos, module row) are not drawn line for line, so the
   outer height is held instead; the first screen is what has to stay still. */
/* At most this many cards: a long list is mostly below the fold and only adds markup. */
const MAX_CARDS = 8;

const useIsoLayoutEffect = typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

/** A Program card in the grid: the cover band (title, badges), then progress, next course and Resume. */
function ProgramCardSkeleton() {
  return (
    <div className={cn(PROGRAM_CARD_FRAME, styles.programCard)}>
      {/* The cover band: measured from sample data (220 at every width). */}
      <div className={styles.cover}>
        <div className={styles.stack3}>
          <Skeleton variant="block" width={120} height={28} radius="pill" />
          <Skeleton text="headline-small-bold" width="85%" />
          <Skeleton text="headline-small-bold" width="55%" />
        </div>
        <div className={styles.row2}>
          <Skeleton variant="block" width={120} height={22} radius="pill" />
          <Skeleton variant="block" width={88} height={22} radius="pill" />
        </div>
      </div>
      <div className={styles.programBody}>
        <div className={styles.stack2}>
          <Skeleton text="body-medium-semibold" width="60%" />
          <Skeleton variant="block" height={8} radius="none" />
          <Skeleton text="body-small-regular" width="70%" />
        </div>
        <div className={styles.programFooter}>
          <div className={styles.textColumn}>
            <Skeleton text="body-medium-semibold" width="80%" />
            <Skeleton text="body-small-regular" width="90%" />
          </div>
          <Skeleton variant="block" width={88} height={36} radius="control" />
        </div>
      </div>
    </div>
  );
}

/** A compact Course-Row: the card (kind, thumb + title, tags, progress, up next, Resume) over the module row. */
function CourseRowSkeleton() {
  return (
    <div className={cn(COURSE_ROW_FRAME, styles.courseRow)}>
      <div className={styles.courseBody}>
        <div className={styles.stack3}>
          <div className={styles.spread}>
            <Skeleton text="body-small-medium" width={52} />
            <Skeleton variant="block" width={67} height={28} radius="pill" />
          </div>
          <div className={styles.row3}>
            <Skeleton variant="block" width={64} height={64} radius="control" />
            <div className={styles.textColumn}>
              <Skeleton text="body-large-semibold" width="95%" />
              <Skeleton text="body-large-semibold" width="60%" />
            </div>
          </div>
          <div className={styles.row2}>
            <Skeleton variant="block" width={89} height={22} radius="pill" />
            <Skeleton variant="block" width={120} height={22} radius="pill" />
          </div>
        </div>
        <div className={styles.stack2}>
          <Skeleton text="body-medium-semibold" width="40%" />
          <Skeleton variant="block" height={8} radius="none" />
        </div>
        <div className={styles.column}>
          <Skeleton text="body-small-medium" width={60} />
          <Skeleton text="body-medium-regular" width="75%" />
        </div>
        <Skeleton variant="block" height={36} radius="control" />
      </div>
      {/* The module row: measured from sample data (67). */}
      <div className={styles.moduleRow}>
        <div className={styles.textColumn}>
          <Skeleton text="body-small-medium" width={96} />
          <Skeleton text="body-small-medium" width="80%" />
        </div>
        <Skeleton variant="block" width={44} height={44} radius="control" />
      </div>
    </div>
  );
}

/**
 * My Learning while it loads (motion-matrix §7.9): the page's layout in Skeletons, from the
 * same column, gaps and text styles. The title is a ghost line; the toolbar keeps its two rows
 * (one row of filter + search from tablet up, search over filter on a phone); the grid shows the
 * tab that will open (the address's ?tab=, the one last opened, else Programs when enrolled in
 * one) with as many cards as it has.
 */
export function MyLearningSkeleton({ courses, programs }: { courses: number; programs: number }) {
  const [tab, setTab] = React.useState<MyLearningTab>(() => myLearningFirstTab(programs));
  // Before the first paint after hydration (a layout effect), so a client navigation never shows
  // the wrong tab's cards; on a hard load the pre-painted server markup has the first-time rule
  // until hydration, as the page itself does.
  useIsoLayoutEffect(() => {
    try {
      const linked = new URLSearchParams(window.location.search).get("tab");
      const stored = window.localStorage.getItem(MY_LEARNING_TAB_KEY);
      const pick = linked === "programs" || linked === "courses" ? linked : stored === "programs" || stored === "courses" ? stored : null;
      if (pick) setTab(pick);
    } catch {
      /* storage blocked: the first-time rule */
    }
  }, []);
  const count = Math.min(tab === "courses" ? courses : programs, MAX_CARDS);
  return (
    <div className={cn("sk-page-stack", styles.page)}>
      <Skeleton variant="ghost" text="headline-large-bold">
        {myLearningHeading.title} {myLearningHeading.emphasis}
      </Skeleton>
      <div className={styles.collection}>
        {/* The toolbar (tabs + filter row, 24 apart), then the grid (as MyLearningCollection). */}
        <div className={styles.toolbar}>
          {/* Tabs on their rule: 32 tall on a phone, 48 from tablet up, 8 above. */}
          <div className={styles.tabs}>
            <div className={styles.tab}>
              <Skeleton variant="block" width={124} height={24} radius="inner" />
            </div>
            <div className={styles.tab}>
              <Skeleton variant="block" width={110} height={24} radius="inner" />
            </div>
          </div>
          <div className={styles.filterRow}>
            {/* The status filter, its segments as wide as their labels. */}
            <div className={styles.filterSlot}>
              <div className={cn(MY_LEARNING_FILTER_TRACK, styles.filterTrack)}>
                {myLearningStatusFilters.map((f) => (
                  <SkeletonPill key={f.id} size="segment" className={styles.segment}>{f.label}</SkeletonPill>
                ))}
              </div>
            </div>
            <div className={styles.searchRow}>
              <Skeleton variant="block" radius="control" className={styles.search} />
              <Skeleton variant="block" width={138} height={40} radius="track" className={styles.toggle} />
            </div>
          </div>
        </div>
        <div className={cn(MY_LEARNING_GRID, styles.grid)}>
          {Array.from({ length: count }, (_, i) =>
            tab === "courses" ? <CourseRowSkeleton key={i} /> : <ProgramCardSkeleton key={i} />,
          )}
        </div>
      </div>
    </div>
  );
}
